import yahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  try {
    const symbol = req.query.symbol;

    const result = await yahooFinance.chart(symbol, {
      interval: "1d",
      range: "3mo",
    });

    const candles = result?.quotes || [];
    res.status(200).json({ candles });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
}
