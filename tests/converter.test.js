const assert = require("assert");
const { CurrencyApp, CURRENCY_NAMES, STORAGE_KEYS } = require("../app.js");

// Mock LocalStorage
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// Mock DOM elements
function createMockDOM() {
  const elements = {};
  const ids = [
    "amount-input", "from-currency-select", "to-currency-select",
    "swap-btn", "add-favorite-btn", "favorite-star-icon",
    "result-from-text", "result-value", "exchange-rate-info",
    "inverse-rate-info", "favorites-list", "history-list",
    "clear-history-btn", "network-badge", "network-status-text",
    "last-updated-text", "offline-banner", "offline-timestamp"
  ];

  ids.forEach(id => {
    elements[id] = {
      value: id === "amount-input" ? "100" : "",
      textContent: "",
      className: "",
      classList: {
        add: function(c) { this[c] = true; },
        remove: function(c) { delete this[c]; },
        contains: function(c) { return !!this[c]; }
      },
      addEventListener: () => {},
      querySelectorAll: () => [],
      querySelector: () => ({ className: "" })
    };
  });

  global.document = {
    getElementById: (id) => elements[id] || { addEventListener: () => {}, classList: { add: () => {}, remove: () => {} } },
    addEventListener: () => {}
  };
  global.localStorage = new MockLocalStorage();
  global.navigator = { onLine: true };

  return elements;
}

async function runTests() {
  console.log("Starting Currency Converter Unit Tests...");

  createMockDOM();
  const app = new CurrencyApp();

  // Test 1: Static Fallback Rates
  console.log("Test 1: Static Fallback Rates generation");
  const fallback = app.getStaticFallbackRates("USD");
  assert.strictEqual(fallback.result, "success");
  assert.strictEqual(fallback.rates["USD"], 1.0);
  assert.strictEqual(fallback.rates["EUR"], 0.92);

  // Test 2: Rate Calculation
  console.log("Test 2: Rate Calculation");
  app.ratesData = { USD: 1.0, EUR: 0.85, GBP: 0.75 };
  app.currentBase = "USD";
  app.currentTarget = "EUR";
  app.amountInput.value = "100";
  app.calculateConversion();
  assert.ok(document.getElementById("result-value").textContent.includes("85.00 EUR"));

  // Test 3: Swap functionality
  console.log("Test 3: Swap functionality state change");
  app.currentBase = "USD";
  app.currentTarget = "GBP";
  await app.swapCurrencies();
  assert.strictEqual(app.currentBase, "GBP");
  assert.strictEqual(app.currentTarget, "USD");

  // Test 4: Favorites Management
  console.log("Test 4: Favorites add and retrieve");
  localStorage.clear();
  app.currentBase = "EUR";
  app.currentTarget = "JPY";
  app.toggleFavoriteCurrentPair();
  const favs = app.getFavorites();
  assert.ok(favs.some(p => p.from === "EUR" && p.to === "JPY"));

  // Test 5: History Logging
  console.log("Test 5: History Logging");
  localStorage.clear();
  app.ratesData = { USD: 1.0, JPY: 150.0 };
  app.currentBase = "USD";
  app.currentTarget = "JPY";
  app.amountInput.value = "50";
  app.logConversionHistory();
  const history = app.getHistory();
  assert.strictEqual(history.length, 1);
  assert.strictEqual(history[0].amount, 50);
  assert.strictEqual(history[0].result, 7500);

  // Test 6: Offline status handling
  console.log("Test 6: Offline status update");
  global.navigator.onLine = false;
  app.updateOnlineStatus();
  assert.strictEqual(document.getElementById("network-status-text").textContent, "Offline");

  console.log("✅ All Unit Tests Passed Successfully!");
}

runTests().catch(err => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
