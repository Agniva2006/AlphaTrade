// /api/candles.js  (Vercel Serverless Backend)

export default async function handler(req, res) {
  try {
    const symbol = req.query.symbol || "RELIANCE.NS";

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;

    const r = await fetch(url);
    const j = await r.json();

    if (!j.chart || !j.chart.result) {
      return res.status(400).json({ error: true, candles: [] });
    }

    const result = j.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    const candles = timestamps.map((t, i) => ({
      time: new Date(t * 1000).toISOString(),
      close: closes[i] || 0,
    }));

    return res.status(200).json({ candles });
  } catch (e) {
    return res.status(500).json({ error: true, message: e.toString() });
  }
}
