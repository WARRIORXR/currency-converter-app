/**
 * CurrencyConverter App Engine
 */

const CURRENCY_NAMES = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  BRL: "Brazilian Real",
  RUB: "Russian Ruble",
  KRW: "South Korean Won",
  SGD: "Singapore Dollar",
  NZD: "New Zealand Dollar",
  MXN: "Mexican Peso",
  HKD: "Hong Kong Dollar",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  TRY: "Turkish Lira",
  ZAR: "South African Rand",
  AED: "UAE Dirham",
  SAR: "Saudi Riyal",
  THB: "Thai Baht",
  IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit",
  PHP: "Philippine Peso",
  PLN: "Polish Zloty",
  EGP: "Egyptian Pound",
  ILS: "Israeli New Shekel",
  DKK: "Danish Krone"
};

const DEFAULT_BASE = "USD";
const DEFAULT_TARGET = "EUR";
const STORAGE_KEYS = {
  RATES_PREFIX: "currency_rates_",
  LAST_UPDATE: "currency_last_update",
  FAVORITES: "currency_favorites",
  HISTORY: "currency_history"
};

class CurrencyApp {
  constructor() {
    this.ratesData = null; // Rates relative to current base currency
    this.cachedAllRates = {}; // Base -> Rates mapping
    this.currentBase = DEFAULT_BASE;
    this.currentTarget = DEFAULT_TARGET;
    this.historyDebounceTimer = null;

    this.initDOMElements();
    this.initEventListeners();
    this.init();
  }

  initDOMElements() {
    this.amountInput = document.getElementById("amount-input");
    this.fromSelect = document.getElementById("from-currency-select");
    this.toSelect = document.getElementById("to-currency-select");
    this.swapBtn = document.getElementById("swap-btn");
    this.addFavoriteBtn = document.getElementById("add-favorite-btn");
    this.favoriteStarIcon = document.getElementById("favorite-star-icon");
    this.resultFromText = document.getElementById("result-from-text");
    this.resultValue = document.getElementById("result-value");
    this.exchangeRateInfo = document.getElementById("exchange-rate-info");
    this.inverseRateInfo = document.getElementById("inverse-rate-info");
    this.favoritesList = document.getElementById("favorites-list");
    this.historyList = document.getElementById("history-list");
    this.clearHistoryBtn = document.getElementById("clear-history-btn");
    this.networkBadge = document.getElementById("network-badge");
    this.networkStatusText = document.getElementById("network-status-text");
    this.lastUpdatedBadge = document.getElementById("last-updated-text");
    this.offlineBanner = document.getElementById("offline-banner");
    this.offlineTimestamp = document.getElementById("offline-timestamp");
  }

  initEventListeners() {
    this.amountInput.addEventListener("input", () => {
      this.calculateConversion();
      this.debounceLogHistory();
    });

    this.fromSelect.addEventListener("change", async (e) => {
      this.currentBase = e.target.value;
      await this.loadExchangeRates(this.currentBase);
      this.calculateConversion();
      this.updateFavoriteStarStatus();
      if (window.renderHistoricalChart) {
        window.renderHistoricalChart(this.currentBase, this.currentTarget);
      }
      this.debounceLogHistory();
    });

    this.toSelect.addEventListener("change", (e) => {
      this.currentTarget = e.target.value;
      this.calculateConversion();
      this.updateFavoriteStarStatus();
      if (window.renderHistoricalChart) {
        window.renderHistoricalChart(this.currentBase, this.currentTarget);
      }
      this.debounceLogHistory();
    });

    this.swapBtn.addEventListener("click", () => this.swapCurrencies());

    this.addFavoriteBtn.addEventListener("click", () => this.toggleFavoriteCurrentPair());

    this.clearHistoryBtn.addEventListener("click", () => this.clearHistory());

    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.updateOnlineStatus());
      window.addEventListener("offline", () => this.updateOnlineStatus());
    }
  }

  async init() {
    this.updateOnlineStatus();
    await this.loadExchangeRates(this.currentBase);
    this.populateCurrencySelectors();
    this.renderFavorites();
    this.renderHistory();
    this.calculateConversion();
      if (typeof window !== "undefined" && window.renderHistoricalChart) {
      window.renderHistoricalChart(this.currentBase, this.currentTarget);
    }
  }

  updateOnlineStatus() {
    const isOnline = navigator.onLine;
    if (isOnline) {
      this.networkBadge.className = "badge online";
      this.networkBadge.querySelector("i").className = "fa-solid fa-wifi";
      this.networkStatusText.textContent = "Online";
      this.offlineBanner.classList.add("hidden");
    } else {
      this.networkBadge.className = "badge offline";
      this.networkBadge.querySelector("i").className = "fa-solid fa-plane-slash";
      this.networkStatusText.textContent = "Offline";
      const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE) || "Unknown";
      this.offlineTimestamp.textContent = lastUpdate;
      this.offlineBanner.classList.remove("hidden");
    }
  }

  async loadExchangeRates(baseCurrency) {
    let data = null;
    const cacheKey = `${STORAGE_KEYS.RATES_PREFIX}${baseCurrency}`;
    const cachedDataStr = localStorage.getItem(cacheKey);

    if (navigator.onLine) {
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        
        if (data && data.result === "success") {
          const timestampStr = new Date(data.time_last_update_unix * 1000).toLocaleString();
          localStorage.setItem(cacheKey, JSON.stringify(data));
          localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, timestampStr);
          this.lastUpdatedBadge.textContent = `Rates: ${new Date(data.time_last_update_unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
      } catch (err) {
        console.warn("API Fetch failed, using cache if available:", err);
      }
    }

    if (!data && cachedDataStr) {
      data = JSON.parse(cachedDataStr);
      const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE) || "Cached Data";
      this.lastUpdatedBadge.textContent = `Rates: Offline (${lastUpdate})`;
      this.updateOnlineStatus();
    } else if (!data) {
      // Fallback data structure if API fails and no cache exists
      data = this.getStaticFallbackRates(baseCurrency);
      this.lastUpdatedBadge.textContent = "Rates: Fallback Data";
    }

    this.ratesData = data.rates;
    this.cachedAllRates[baseCurrency] = data.rates;
  }

  getStaticFallbackRates(base) {
    // Basic fallback rates relative to USD if no network and no cache
    const rates = {
      USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 155.0, AUD: 1.52, CAD: 1.36,
      CHF: 0.89, CNY: 7.23, INR: 83.4, BRL: 5.15, SGD: 1.35, NZD: 1.64
    };
    const baseRate = rates[base] || 1.0;
    const normalizedRates = {};
    for (const [code, rate] of Object.entries(rates)) {
      normalizedRates[code] = rate / baseRate;
    }
    return { result: "success", rates: normalizedRates };
  }

  populateCurrencySelectors() {
    if (!this.ratesData) return;

    const availableCurrencies = Object.keys(this.ratesData).sort();
    
    // Sort so known currencies are nicely described
    const optionsHTML = availableCurrencies.map(code => {
      const name = CURRENCY_NAMES[code] ? `${code} - ${CURRENCY_NAMES[code]}` : code;
      return `<option value="${code}">${name}</option>`;
    }).join("");

    this.fromSelect.innerHTML = optionsHTML;
    this.toSelect.innerHTML = optionsHTML;

    this.fromSelect.value = this.currentBase;
    this.toSelect.value = this.currentTarget;
    this.updateFavoriteStarStatus();
  }

  calculateConversion() {
    const amount = parseFloat(this.amountInput.value);

    if (isNaN(amount) || amount < 0) {
      this.resultValue.textContent = "Invalid Amount";
      this.exchangeRateInfo.textContent = "";
      this.inverseRateInfo.textContent = "";
      return;
    }

    let rate = 1;
    if (this.currentBase !== this.currentTarget) {
      if (this.ratesData && this.ratesData[this.currentTarget]) {
        rate = this.ratesData[this.currentTarget];
      } else {
        rate = 1;
      }
    }

    const convertedAmount = amount * rate;
    const inverseRate = rate !== 0 ? 1 / rate : 0;

    // Formatting currency output
    this.resultFromText.textContent = `${this.formatNumber(amount)} ${this.currentBase} =`;
    this.resultValue.textContent = `${this.formatNumber(convertedAmount)} ${this.currentTarget}`;

    this.exchangeRateInfo.textContent = `1 ${this.currentBase} = ${rate.toFixed(4)} ${this.currentTarget}`;
    this.inverseRateInfo.textContent = `1 ${this.currentTarget} = ${inverseRate.toFixed(4)} ${this.currentBase}`;
  }

  formatNumber(val) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(val);
  }

  async swapCurrencies() {
    const temp = this.currentBase;
    this.currentBase = this.currentTarget;
    this.currentTarget = temp;

    this.fromSelect.value = this.currentBase;
    this.toSelect.value = this.currentTarget;

    await this.loadExchangeRates(this.currentBase);
    this.calculateConversion();
    this.updateFavoriteStarStatus();

    if (typeof window !== "undefined" && window.renderHistoricalChart) {
      window.renderHistoricalChart(this.currentBase, this.currentTarget);
    }
    this.debounceLogHistory();
  }

  /* --- Favorites Management --- */
  getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [
      { from: "USD", to: "EUR" },
      { from: "EUR", to: "GBP" },
      { from: "USD", to: "JPY" }
    ];
  }

  saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }

  updateFavoriteStarStatus() {
    const favorites = this.getFavorites();
    const isFav = favorites.some(
      p => p.from === this.currentBase && p.to === this.currentTarget
    );

    if (isFav) {
      this.favoriteStarIcon.className = "fa-solid fa-star";
      this.addFavoriteBtn.classList.add("active");
    } else {
      this.favoriteStarIcon.className = "fa-regular fa-star";
      this.addFavoriteBtn.classList.remove("active");
    }
  }

  toggleFavoriteCurrentPair() {
    let favorites = this.getFavorites();
    const index = favorites.findIndex(
      p => p.from === this.currentBase && p.to === this.currentTarget
    );

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ from: this.currentBase, to: this.currentTarget });
    }

    this.saveFavorites(favorites);
    this.updateFavoriteStarStatus();
    this.renderFavorites();
  }

  renderFavorites() {
    const favorites = this.getFavorites();

    if (favorites.length === 0) {
      this.favoritesList.innerHTML = `<p class="empty-state">No favorite currency pairs saved yet. Click the star icon to pin your favorite pair!</p>`;
      return;
    }

    this.favoritesList.innerHTML = favorites.map((pair, idx) => `
      <div class="favorite-chip" data-from="${pair.from}" data-to="${pair.to}">
        <span>${pair.from} / ${pair.to}</span>
        <i class="fa-solid fa-xmark remove-fav" data-idx="${idx}" title="Remove"></i>
      </div>
    `).join("");

    // Add click event handlers
    this.favoritesList.querySelectorAll(".favorite-chip").forEach(chip => {
      chip.addEventListener("click", async (e) => {
        if (e.target.classList.contains("remove-fav")) {
          e.stopPropagation();
          const idx = parseInt(e.target.dataset.idx, 10);
          favorites.splice(idx, 1);
          this.saveFavorites(favorites);
          this.renderFavorites();
          this.updateFavoriteStarStatus();
          return;
        }

        const from = chip.dataset.from;
        const to = chip.dataset.to;

        this.currentBase = from;
        this.currentTarget = to;
        this.fromSelect.value = from;
        this.toSelect.value = to;

        await this.loadExchangeRates(this.currentBase);
        this.calculateConversion();
        this.updateFavoriteStarStatus();
        if (window.renderHistoricalChart) {
          window.renderHistoricalChart(this.currentBase, this.currentTarget);
        }
      });
    });
  }

  /* --- History Logging --- */
  getHistory() {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  }

  debounceLogHistory() {
    clearTimeout(this.historyDebounceTimer);
    this.historyDebounceTimer = setTimeout(() => {
      this.logConversionHistory();
    }, 800);
  }

  logConversionHistory() {
    const amount = parseFloat(this.amountInput.value);
    if (isNaN(amount) || amount <= 0 || !this.ratesData) return;

    const rate = this.ratesData[this.currentTarget] || 1;
    const convertedAmount = amount * rate;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let history = this.getHistory();
    // Avoid duplicate immediate entries
    if (history.length > 0) {
      const last = history[0];
      if (last.from === this.currentBase && last.to === this.currentTarget && last.amount === amount) {
        return;
      }
    }

    history.unshift({
      from: this.currentBase,
      to: this.currentTarget,
      amount: amount,
      result: convertedAmount,
      rate: rate,
      timestamp: timestamp
    });

    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    this.renderHistory();
  }

  clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    this.renderHistory();
  }

  renderHistory() {
    const history = this.getHistory();

    if (history.length === 0) {
      this.historyList.innerHTML = `<li class="empty-state">No recent conversions logged yet.</li>`;
      return;
    }

    this.historyList.innerHTML = history.map(item => `
      <li class="history-item">
        <div class="history-item-details">
          <span class="history-item-conversion">
            ${this.formatNumber(item.amount)} ${item.from} = ${this.formatNumber(item.result)} ${item.to}
          </span>
          <span class="history-item-rate">1 ${item.from} = ${item.rate.toFixed(4)} ${item.to}</span>
        </div>
        <span class="history-item-time">${item.timestamp}</span>
      </li>
    `).join("");
  }
}

// Global Export/Initialization
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CurrencyApp, CURRENCY_NAMES, STORAGE_KEYS };
} else {
  document.addEventListener("DOMContentLoaded", () => {
    window.app = new CurrencyApp();
  });
}
