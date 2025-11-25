// POPULAR STOCKS (used by SearchBar, Dashboard, StockGrid)
export const POPULAR_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK", name: "HDFC Bank" },
  { symbol: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "INFY", name: "Infosys" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel" },
  { symbol: "LT", name: "Larsen & Toubro" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance" },
  { symbol: "ASIANPAINT", name: "Asian Paints" },
  { symbol: "MARUTI", name: "Maruti Suzuki" },
  { symbol: "TITAN", name: "Titan Company" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement" },
  { symbol: "WIPRO", name: "Wipro" },
  { symbol: "AXISBANK", name: "Axis Bank" },
  { symbol: "ADANIENT", name: "Adani Enterprises" },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ" },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories" },
  { symbol: "HCLTECH", name: "HCL Technologies" },
  { symbol: "CIPLA", name: "Cipla" },
  { symbol: "ONGC", name: "ONGC" },
  { symbol: "NTPC", name: "NTPC Ltd" },
  { symbol: "GRASIM", name: "Grasim Industries" },
  { symbol: "SBILIFE", name: "SBI Life Insurance" },
  { symbol: "POWERGRID", name: "Power Grid Corporation" },
  { symbol: "BRITANNIA", name: "Britannia Industries" },
  { symbol: "DIVISLAB", name: "Divi's Laboratories" },
  { symbol: "JSWSTEEL", name: "JSW Steel" },
];

// Indices (Yahoo tickers)
export const INDICES = [
  { symbol: "NIFTY", name: "Nifty 50", code: "^NSEI" },
  { symbol: "BANKNIFTY", name: "Bank Nifty", code: "^NSEBANK" },
  { symbol: "SENSEX", name: "Sensex", code: "^BSESN" },
  { symbol: "NIFTYIT", name: "Nifty IT", code: "^CNXIT" },
];


const PROXY_BASE = " ";


// ---------------- Live series (candles) ----------------
export async function getLiveSeries(symbol) {
  const sym = symbol.includes(".") ? symbol : `${symbol}.NS`;
  const url = `${PROXY_BASE}/api/candles?symbol=${sym}`;
  const r = await fetch(url);
  const json = await r.json();
  if (!json || json.error || !json.candles) return [];

  return json.candles.map((c) => ({
    time: new Date(c.time).toLocaleString(),
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close),
    volume: Number(c.volume || 0),
  }));
}


// ---------------- Live quote ----------------
export async function getLiveQuote(symbol) {
  const sym = symbol.includes(".") ? symbol : `${symbol}.NS`;
  const url = `${PROXY_BASE}/api/candles?symbol=${sym}`;

  try {
    const r = await fetch(url);
    return await r.json();
  } catch (err) {
    console.error("getLiveQuote error:", err);
    return { error: true };
  }
}


// -------------- Technical Indicators --------------

export function SMA(values, period) {
  if (!values || values.length < period) return 0;
  const slice = values.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return Number((sum / period).toFixed(2));
}

export function RSI(closes, period = 14) {
  if (!closes || closes.length < period + 1) return 50;
  let gains = 0, losses = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const rs = gains / (losses || 1);
  return Number((100 - 100 / (1 + rs)).toFixed(2));
}

export function ATR(series, period = 14) {
  if (!series || series.length < period + 1) return 0;
  let sum = 0;

  for (let i = series.length - period; i < series.length; i++) {
    const high = series[i].high;
    const low = series[i].low;
    const prevClose = series[i - 1]?.close || series[i].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    sum += tr;
  }

  return Number((sum / period).toFixed(2));
}

export function SupportResistance(closes, len = 20) {
  const slice = closes.slice(-len);
  return {
    support: Math.min(...slice),
    resistance: Math.max(...slice),
  };
}


// -------- FEATURE EXTRACTOR --------
export function extractFeatures(series) {
  const closes = (series || []).map((s) => s.close || 0);
  const last = closes[closes.length - 1] || 0;

  const ret1 = closes.length > 1 ? Math.log(last / closes.at(-2)) : 0;
  const ret5 = closes.length > 5 ? Math.log(last / closes.at(-6)) : 0;

  return {
    close: last,
    ma10: SMA(closes, 10),
    ma50: SMA(closes, 50),
    rsi: RSI(closes, 14),
    vol: Math.abs(ret1),
    atr: ATR(series, 14),
    ret1,
    ret5,
    ...SupportResistance(closes, 20),
  };
}
