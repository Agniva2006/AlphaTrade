import yahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  try {
    const symbol = req.query.symbol;

    const q = await yahooFinance.quote(symbol);

    res.status(200).json({
      symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      percent_change: q.regularMarketChangePercent,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
}
