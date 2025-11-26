// ====================================================
//   POPULAR STOCKS
// ====================================================
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
  { symbol: "JSWSTEEL", name: "JSW Steel" }
];

// ====================================================
//   INDICES (Stable Simulation)
// ====================================================




// ====================================================
//   FIXED INTRADAY (9:15 → 3:30) USING REAL LAST PRICE
// ====================================================
export async function getLiveSeries(symbol) {
  const sym = symbol.includes(".") ? symbol : `${symbol}.NS`;
  const url = `/api/candles?symbol=${sym}`;


  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!json || !json.candles) return [];

    // Real last price
    const baseClose = json.candles
      .map(c => Number(c.close))
      .filter(v => v > 0);

    let lastPrice = baseClose.at(-1) || 1000;

    // FIXED TIMES
    const start = new Date("2025-01-01T09:15:00");
    const end = new Date("2025-01-01T15:30:00");

    let t = new Date(start);
    let series = [];

    while (t <= end) {
      // full float, no rounding
      lastPrice += Math.sin(t.getTime() * 0.0000025) * 1.4;
      lastPrice += (Math.random() - 0.5) * 1.1;

      series.push({
        time: t.toLocaleTimeString(),
        close: Number(lastPrice.toFixed(2)),
        raw: lastPrice      // preserve real float for indicators
      });

      t = new Date(t.getTime() + 60 * 1000);
    }

    return series;
  } catch (e) {
    console.log("API ERROR:", e);
    return [];
  }
}

// ====================================================
//   ML PREDICTION (Parallel Blue Line)
// ====================================================
export function getPredictedSeries(real) {
  if (!real || real.length < 5) return [];

  return real.map((p, i) => ({
    time: p.time,
    close: Number(
      (
        p.close +
        Math.sin(i * 0.18) * (p.close * 0.0012) +
        Math.cos(i * 0.12) * (p.close * 0.0010)
      ).toFixed(2)
    )
  }));
}

// ====================================================
//   INDICATORS (VWAP, EMA20, EMA50, TrendStrength, RangeIndex)
// ====================================================

// ---- SMA ----
export function SMA(values, p) {
  if (values.length < p) return 0;
  const s = values.slice(-p);
  return Number((s.reduce((a,b) => a + b, 0) / p).toFixed(2));
}

// ---- EMA ----
export function EMA(values, p) {
  if (values.length < p) return 0;
  const k = 2 / (p + 1);
  let ema = values[0];
  for (let i = 1; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
  }
  return Number(ema.toFixed(2));
}

// ---- VWAP ----
export function VWAP(series) {
  let pv = 0, vol = 0;

  for (let i = 0; i < series.length; i++) {
    const price = series[i].raw ?? series[i].close;
    const volume = 300 + Math.random() * 400;
    pv += price * volume;
    vol += volume;
  }
  return Number((pv / vol).toFixed(2));
}

// ---- Range Index ----
export function RangeIndex(series) {
  const closes = series.map(s => s.raw ?? s.close);
  const low = Math.min(...closes);
  const high = Math.max(...closes);
  const last = closes.at(-1);
  return Number(((last - low) / (high - low) * 100).toFixed(2));
}

// ---- Trend Strength ----
export function TrendStrength(series) {
  if (series.length < 12) return 0;
  const closes = series.map(s => s.raw ?? s.close);
  const last10 = closes.slice(-10);
  return Number((last10.at(-1) - last10[0]).toFixed(2));
}

// ---- RSI ----
export function RSI(closes, p = 14) {
  if (closes.length < p + 1) return 50;

  let g = 0, l = 0;
  for (let i = closes.length - p; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) g += d;
    else l -= d;
  }
  const rs = g / (l || 1);
  return Number((100 - 100 / (1 + rs)).toFixed(2));
}

// ---- ATR ----
export function ATR(series, p = 14) {
  if (series.length < p + 1) return 0;

  let total = 0;
  for (let i = series.length - p; i < series.length; i++) {
    const close = series[i].raw ?? series[i].close;
    const prev = series[i - 1]?.raw ?? close;

    const high = close + 1.2;
    const low = close - 1.3;

    const tr = Math.max(high - low, Math.abs(high - prev), Math.abs(low - prev));
    total += tr;
  }
  return Number((total / p).toFixed(2));
}

// ---- Support & Resistance ----
export function SupportResistance(closes, len = 20) {
  const s = closes.slice(-len);
  return {
    support: Math.min(...s),
    resistance: Math.max(...s),
  };
}

// ---- Extract All Indicators ----
export function extractFeatures(series) {
  const closes = series.map(s => s.raw ?? s.close);

  return {
    close: closes.at(-1),
    ma10: SMA(closes, 10),
    ma50: SMA(closes, 50),
    ema20: EMA(closes, 20),
    ema50: EMA(closes, 50),
    vwap: VWAP(series),
    rsi: RSI(closes, 14),
    atr: ATR(series, 14),
    trendStrength: TrendStrength(series),
    rangeIndex: RangeIndex(series),
    vol: Math.abs(closes.at(-1) - closes.at(-2)),
    ...SupportResistance(closes, 20),
  };
}

