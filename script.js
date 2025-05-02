const fromCrypto = document.getElementById("fromCrypto");
const toCrypto = document.getElementById("toCrypto");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");
const chartCanvas = document.getElementById("priceChart");
let chart;

// Basic crypto list
const cryptoList = ["bitcoin", "ethereum", "tether", "litecoin", "ripple", "usd", "dogecoin", "cardano", "polkadot", "solana", "INR", "USDT"];

// Populate dropdowns
function populateDropdowns() {
  cryptoList.forEach(coin => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = option2.value = coin;
    option1.text = option2.text = coin.charAt(0).toUpperCase() + coin.slice(1);
    fromCrypto.add(option1);
    toCrypto.add(option2);
  });
  fromCrypto.value = "bitcoin";
  toCrypto.value = "tether";
}

populateDropdowns();

// Draw price trend chart
function drawChart(prices, label) {
  if (chart) chart.destroy();
  chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: prices.map((_, i) => `T-${prices.length - i}`),
      datasets: [{
        label: label,
        data: prices,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        fill: true
      }]
    },
    options: {
      scales: { y: { beginAtZero: false } }
    }
  });
}

// Convert and fetch chart data
convertBtn.addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromCrypto.value;
  const to = toCrypto.value;

  if (!amount || from === to) {
    result.textContent = "Enter valid amount & choose different currencies.";
    return;
  }

  // Conversion
  fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`)
    .then(res => res.json())
    .then(data => {
      const rate = data[from][to];
      const converted = (amount * rate).toFixed(4);
      result.textContent = `${amount} ${from} = ${converted} ${to}`;
    });

  // Chart (last 7 days)
  fetch(`https://api.coingecko.com/api/v3/coins/${from}/market_chart?vs_currency=${to}&days=7`)
    .then(res => res.json())
    .then(data => {
      const prices = data.prices.map(p => p[1]);
      drawChart(prices, `${from} ➡ ${to} (7d)`);
    });
});