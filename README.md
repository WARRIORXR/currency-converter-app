# 🪙 CurrencyXpress - Modern Real-Time Currency Converter

A feature-rich, responsive web application for real-time currency conversion, historical exchange rate trends, offline access, and customizable favorites.

![Currency Converter](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![JavaScript](https://img.shields.io/badge/Language-Vanilla%20JS%20ES6+-yellow?style=flat-square&logo=javascript)
![Chart.js](https://img.shields.io/badge/Charts-Chart.js-FF6384?style=flat-square&logo=chartdotjs)
![HTML5 / CSS3](https://img.shields.io/badge/Design-HTML5%20%2F%20CSS3-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## ✨ Features

- ⚡ **Real-Time Exchange Rates**: Fetches live currency rates across 30+ major global currencies with fallback data.
- 📈 **Interactive Historical Trends**: Visualize 7-day, 30-day, and 90-day currency fluctuations with responsive Chart.js gradient graphs.
- 🔄 **Quick Currency Swap**: Instant 1-click swap between source and target currencies with synchronized result updates.
- ⭐ **Quick-Access Favorites**: Bookmark frequent currency pairs (e.g., USD/EUR, GBP/JPY) for instant switching.
- 🕒 **Conversion History**: Automatic logging of recent conversions with timestamps and clear actions.
- 📶 **Offline Mode & Caching**: Graceful offline fallback utilizing `localStorage` caching with visual indicators and cached rate timestamps.
- 🎨 **Modern Glassmorphic UI**: Sleek dark/light styled card layout, smooth animations, and mobile-friendly responsive design.

---

## 🛠️ Tech Stack

- **Frontend Core**: Semantic HTML5 & Vanilla CSS3 (Custom Design System & CSS Variables)
- **Logic & State**: Modern JavaScript (ES6+ Classes & LocalStorage API)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) via CDN
- **Icons**: [FontAwesome 6](https://fontawesome.com/)
- **Testing**: Node.js built-in `assert` test suite

---

## 📁 Project Structure

```
currency-converter-app/
├── app.js               # Application logic, state management, API/caching & favorites
├── chart.js             # Historical chart rendering and data generation
├── index.html           # Main interface structure
├── styles.css           # Custom styling, animations, and responsive layout
├── tests/
│   └── converter.test.js # Unit test suite for core converter features
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/WARRIORXR/currency-converter-app.git
cd currency-converter-app
```

### 2. Run Locally
Open `index.html` directly in any modern web browser or use a local development server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js npx
npx serve .
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Running Tests

To run the automated unit test suite:

```bash
node tests/converter.test.js
```

All 6 core test suites will execute and validate:
- Static fallback rates generation
- Exchange rate calculation & inverse rate accuracy
- Currency swap functionality
- Favorites storage & retrieval
- History logging & clearing
- Offline status detection & error handling

---

## 📄 License

This project is licensed under the MIT License - feel free to use and modify for your personal and commercial projects.
