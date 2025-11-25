import React, { useEffect, useState } from "react";
import { INDICES, getLiveQuote } from "../data/demoPrices";
import SearchBar from "../components/SearchBar";
import StockGrid from "../components/StockGrid";

export default function Dashboard() {
  const [indexData, setIndexData] = useState({
    NIFTY: null,
    BANKNIFTY: null,
    SENSEX: null,
  });

  // Fetch index values
  useEffect(() => {
    async function loadIndices() {
      let updated = {};
      for (let i of INDICES) {
        const q = await getLiveQuote(i.code);
        updated[i.symbol] = q;
      }
      setIndexData(updated);
    }

    loadIndices();
    const timer = setInterval(loadIndices, 30000);
    return () => clearInterval(timer);
  }, []);

  function formatIndex(name, data) {
    if (!data || data.error) return { price: "--", change: "--" };

    return {
      price: data.price.toFixed(2),
      change: ((data.change || 0).toFixed(2)),
      pct: ((data.percent_change || 0).toFixed(2)),
    };
  }

  return (
    <div style={{ display: "flex", gap: "20px", width: "100%" }}>
      
      {/* LEFT SIDE — Market Indices + Stock Grid */}
      <div style={{ width: "65%" }}>
        <h1 className="title">Live Indian Market <span className="sub">REALTIME FEEL (DEMO)</span></h1>

        {/* INDEX CARDS */}
        <div className="index-container">

          {INDICES.map((idx) => {
            const d = formatIndex(idx.symbol, indexData[idx.symbol]);
            return (
              <div className="index-card" key={idx.symbol}>
                <div className="index-name">{idx.name}</div>
                <div className="index-price">₹ {d.price}</div>
                <div
                  className="index-change"
                  style={{ color: d.change >= 0 ? "#3CB371" : "#FF6347" }}
                >
                  {d.change} ({d.pct}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* STOCK GRID */}
        <StockGrid />
      </div>

      {/* RIGHT SIDE — Search + Live Stock List */}
      <div style={{ width: "35%" }}>

        <h2 className="stock-panel-title">Stocks <span className="small">Popular</span></h2>

        {/* SearchBar Component */}
        <SearchBar />

      </div>
    </div>
  );
}
