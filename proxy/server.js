import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// ************** LIVE QUOTE USING CHART API **************
app.get("/api/quote", async (req, res) => {
  try {
    const symbol = req.query.symbol;
    const result = await yahooFinance.quote(symbol);

    if (!result) {
      return res.json({ error: true, message: "No data returned" });
    }

    const price = result.regularMarketPrice || result.previousClose || 0;
    const change = result.regularMarketChange || 0;
    const percent = result.regularMarketChangePercent || 0;

    res.json({
      symbol,
      price,
      change,
      percent_change: percent
    });

  } catch (err) {
    console.error("quote error", err);
    res.json({ error: true, message: err.toString() });
  }
});


// ************** INTRADAY CANDLES (1m, 1d) **************
app.get("/api/candles", async (req, res) => {
  try {
    const symbol = req.query.symbol;

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
    const response = await fetch(url);
    const json = await response.json();

    const result = json.chart?.result?.[0];

    if (!result) {
      return res.json({ error: true, message: "No data returned" });
    }

    const indicators = result.indicators.quote[0];
    const timestamps = result.timestamp;

    const candles = timestamps.map((t, i) => ({
      time: new Date(t * 1000),
      open: indicators.open[i],
      high: indicators.high[i],
      low: indicators.low[i],
      close: indicators.close[i],
      volume: indicators.volume[i],
    }));

    res.json({ symbol, candles });
  } catch (err) {
    console.error("candles error:", err);
    res.json({ error: true, message: err.toString() });
  }
});

app.listen(5000, () =>
  console.log("Proxy running at http://localhost:5000")
);
