// src/components/StockGrid.jsx
import React, { useEffect, useState } from "react";
import { POPULAR_STOCKS, getLiveSeries } from "../data/demoPrices.js";
import { useNavigate } from "react-router-dom";

export default function StockGrid() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  async function loadAll() {
    const results = [];
    for (const s of POPULAR_STOCKS) {
      const series = await getLiveSeries(s.symbol);
      if (!series || series.length === 0) {
        results.push({ symbol: s.symbol, name: s.name, price: null, change: null, pct: null });
        continue;
      }
      const last = series[series.length - 1];
      const prev = series.length > 1 ? series[series.length - 2] : last;
      const change = Number((last.close - prev.close).toFixed(2));
      const pct = prev.close ? Number(((last.close - prev.close) / prev.close * 100).toFixed(2)) : 0;
      results.push({
        symbol: s.symbol,
        name: s.name,
        price: last.close,
        change,
        pct,
      });
    }
    setStocks(results);
  }

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stock-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 10 }}>
      {stocks.map((s) => (
        <button key={s.symbol} onClick={() => navigate(`/predict/${s.symbol}`)} style={{ borderRadius: 12, padding: 12, textAlign: "left", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: 13 }}>{s.symbol}</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{s.price != null ? `₹${Number(s.price).toFixed(2)}` : "—"}</div>
          <div style={{ fontSize: 12, color: (s.change || 0) >= 0 ? "#4ade80" : "#f87171" }}>
            {s.change == null ? "—" : `${s.change >= 0 ? "+" : ""}${s.change} (${s.pct}%)`}
          </div>
        </button>
      ))}
    </div>
  );
}
