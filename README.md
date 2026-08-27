# 🪙 CurrencyXpress - Modern Real-Time Currency Converter

> **A sleek, high-performance, and responsive web application for real-time currency conversion, interactive historical exchange rate charts, offline support, and customizable favorite currency pairs.**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://currency-converter-app-two-eta.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://currency-converter-app-two-eta.vercel.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🌐 Live Application

Explore the live production deployment hosted on Vercel:

👉 **[https://currency-converter-app-two-eta.vercel.app/](https://currency-converter-app-two-eta.vercel.app/)**

---

## ✨ Features

- ⚡ **Real-Time Exchange Rates**: Fetches live, accurate exchange rates for 30+ major global currencies from the ExchangeRate API, with an automatic resilient static fallback mechanism.
- 📈 **Interactive Historical Trends**: Visualize 7-day, 30-day, and 90-day currency fluctuations with interactive gradient graphs powered by [Chart.js](https://www.chartjs.org/).
- 🔄 **Instant 1-Click Currency Swap**: Smoothly swap source and target currencies with animated feedback and immediate recalculation.
- ⭐ **Quick-Access Favorite Pairs**: Pin frequently converted currency pairs (e.g. `USD ⇄ EUR`, `GBP ⇄ JPY`, `INR ⇄ USD`) for 1-click quick conversion.
- 🕒 **Conversion History Log**: Automatically logs your latest currency conversions with exact amounts, rates, and timestamps, complete with a quick-clear option.
- 📶 **Full Offline Mode & Local Caching**: Gracefully handles network loss using `localStorage` caching, displaying clear offline alert badges and cached rate timestamps.
- 🎨 **Modern Glassmorphic UI**: Clean, contemporary card layout with fluid typography, responsive grid, micro-animations, and full mobile optimization.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, SEO-optimized meta tags, OpenGraph sharing |
| **Vanilla CSS3** | Custom design system, CSS variables, glassmorphism, responsive grid & flexbox |
| **Vanilla JavaScript (ES6+)** | State management, async API fetch, DOM manipulation, LocalStorage API |
| **Chart.js** | Interactive historical rate visualization with custom gradients |
| **FontAwesome 6** | Modern UI iconography |
| **Node.js Assert** | Automated unit test suite validating core business logic |
| **Vercel** | Production cloud hosting and continuous deployment |

---

## 📁 Project Structure

```
currency-converter-app/
├── app.js               # Application logic, state management, API/caching & favorites
├── chart.js             # Historical chart rendering and data generation
├── index.html           # Main user interface & SEO/OpenGraph metadata
├── styles.css           # Custom design system, responsive styles & animations
├── tests/
│   └── converter.test.js # Automated unit test suite
├── .gitignore           # Git ignore configuration
└── README.md            # Comprehensive project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) [Node.js](https://nodejs.org/) installed for running tests or local dev servers

### 1. Clone the Repository
```bash
git clone https://github.com/WARRIORXR/currency-converter-app.git
cd currency-converter-app
```

### 2. Run Locally

#### Option A: Direct Browser Opening
Simply double-click `index.html` or open it directly in your favorite browser.

#### Option B: Using Python
```bash
python -m http.server 3000
```
Open `http://localhost:3000` in your browser.

#### Option C: Using Node.js / NPX
```bash
npx serve .
```

#### Option D: VS Code Live Server
Right-click `index.html` in VS Code and click **"Open with Live Server"**.

---

## 🧪 Running Tests

A comprehensive unit test suite is included to validate the converter's business logic, exchange rate computations, state handling, and offline behavior.

Run the test suite using Node.js:

```bash
node tests/converter.test.js
```

### Test Suite Coverage:
- ✔️ **Test 1**: Static Fallback Rates generation
- ✔️ **Test 2**: Currency exchange rate calculation & inverse rate precision
- ✔️ **Test 3**: Currency swap functionality and state synchronization
- ✔️ **Test 4**: Favorite pair addition, deduplication, and retrieval
- ✔️ **Test 5**: History logging, limiting, and clearing
- ✔️ **Test 6**: Offline status detection & error handling

---

## ☁️ Deployment

This project is deployed to **Vercel**:
- **Production URL**: [https://currency-converter-app-two-eta.vercel.app/](https://currency-converter-app-two-eta.vercel.app/)

### Deploy Your Own:
1. Fork this repository.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your forked repository and click **Deploy**.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👤 Author

- **GitHub**: [@WARRIORXR](https://github.com/WARRIORXR)
- **Live Demo**: [CurrencyXpress on Vercel](https://currency-converter-app-two-eta.vercel.app/)
