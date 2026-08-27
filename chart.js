/**
 * Historical Rates Chart Controller
 * Handles historical currency data generation and rendering using Chart.js
 */

let chartInstance = null;
let currentDaysFilter = 7;

function generateHistoricalData(fromCurrency, toCurrency, days) {
  const labels = [];
  const dataPoints = [];
  const today = new Date();

  // Get current rate or base rate estimation
  let baseRate = 1.0;
  if (window.app && window.app.ratesData && window.app.ratesData[toCurrency]) {
    baseRate = window.app.ratesData[toCurrency];
  } else {
    // Basic fallback relative ratios for realistic trends
    const mockRates = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 155.0, CAD: 1.36, AUD: 1.52 };
    const fromRatio = mockRates[fromCurrency] || 1.0;
    const toRatio = mockRates[toCurrency] || 1.0;
    baseRate = toRatio / fromRatio;
  }

  // Seed pseudo-random walk for smooth trend representation
  let currentRate = baseRate * 0.98;
  const volatility = 0.005;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));

    if (i === 0) {
      dataPoints.push(baseRate);
    } else {
      const changePercent = (Math.random() - 0.48) * volatility;
      currentRate = currentRate * (1 + changePercent);
      dataPoints.push(parseFloat(currentRate.toFixed(4)));
    }
  }

  return { labels, dataPoints };
}

function renderHistoricalChart(fromCurrency, toCurrency, days = currentDaysFilter) {
  currentDaysFilter = days;
  const ctx = document.getElementById("historical-chart");
  if (!ctx) return;

  const { labels, dataPoints } = generateHistoricalData(fromCurrency, toCurrency, days);

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create Chart.js gradient
  const canvasCtx = ctx.getContext("2d");
  const gradient = canvasCtx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, "rgba(79, 70, 229, 0.35)");
  gradient.addColorStop(1, "rgba(79, 70, 229, 0.0)");

  chartInstance = new Chart(canvasCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${fromCurrency} to ${toCurrency}`,
          data: dataPoints,
          borderColor: "#4f46e5",
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointRadius: days <= 14 ? 3 : 0,
          pointHoverRadius: 5,
          pointBackgroundColor: "#4f46e5"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: (context) => `1 ${fromCurrency} = ${context.parsed.y.toFixed(4)} ${toCurrency}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxTicksLimit: 8,
            font: { size: 11 }
          }
        },
        y: {
          grid: { color: "#f3f4f6" },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
}

// Global initialization & timeframe selector event listeners
document.addEventListener("DOMContentLoaded", () => {
  const timeframeBtns = document.querySelectorAll(".timeframe-btn");
  timeframeBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      timeframeBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      const days = parseInt(e.target.dataset.days, 10);
      if (window.app) {
        renderHistoricalChart(window.app.currentBase, window.app.currentTarget, days);
      }
    });
  });
});

window.renderHistoricalChart = renderHistoricalChart;
