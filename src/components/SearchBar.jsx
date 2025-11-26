// src/components/SearchBar.jsx
import React, { useState, useEffect } from "react";
import { POPULAR_STOCKS, getLiveSeries } from "../data/demoPrices.js";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = POPULAR_STOCKS.filter(
      (s) =>
        s.symbol.toLowerCase().includes(lower) ||
        s.name.toLowerCase().includes(lower)
    );

    loadPrices(filtered);

    // eslint-disable-next-line
  }, [query]);

  async function loadPrices(list) {
    const out = [];
    for (const s of list) {
      const series = await getLiveSeries(s.symbol);
      if (!series || series.length === 0) {
        out.push({
          symbol: s.symbol,
          name: s.name,
          price: null,
          pct: null,
        });
        continue;
      }
      const last = series[series.length - 1];
      const prev = series.length > 1 ? series[series.length - 2] : last;

      const change = last.close - prev.close;
      const pct = prev.close
        ? ((change / prev.close) * 100).toFixed(2)
        : 0;

      out.push({
        symbol: s.symbol,
        name: s.name,
        price: last.close,
        pct,
      });
    }
    setResults(out);
  }

  function go(sym) {
    navigate(`/predict/${sym}`);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="search-input" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search 25+ popular stocks..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.2)",
          color: "#fff",
        }}
      />

      {open && results.length > 0 && (
        <div
          className="search-dropdown glass-panel"
          style={{
            position: "absolute",
            width: "100%",
            top: "45px",
            zIndex: 20,
            padding: 8,
            borderRadius: 10,
          }}
        >
          {results.map((s) => (
            <div
              key={s.symbol}
              className="search-item"
              onClick={() => go(s.symbol)}
              style={{
                padding: "10px 12px",
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{s.symbol}</div>
                <div style={{ color: "#9ca3af", fontSize: 12 }}>{s.name}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>
                  {s.price !== null ? `₹${s.price.toFixed(2)}` : "—"}
                </div>
                <div
                  style={{
                    color:
                      s.pct > 0
                        ? "var(--accent)"
                        : s.pct < 0
                        ? "var(--danger)"
                        : "#9ca3af",
                    fontSize: 12,
                  }}
                >
                  {s.pct !== null ? `${s.pct}%` : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
