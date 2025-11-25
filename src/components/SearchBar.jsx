import React, { useEffect, useRef, useState } from "react";
import { POPULAR_STOCKS, getLiveQuote } from "../data/demoPrices";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [liveData, setLiveData] = useState({});
  const boxRef = useRef(null);

  // Fetch live prices for all popular stocks
  useEffect(() => {
    async function loadPrices() {
      let updated = {};
      for (let s of POPULAR_STOCKS) {
        const q = await getLiveQuote(s.symbol);
        updated[s.symbol] = q;
      }
      setLiveData(updated);
    }
    loadPrices();
    const timer = setInterval(loadPrices, 30000);
    return () => clearInterval(timer);
  }, []);

  // Filter stocks by search
  useEffect(() => {
    if (!query) {
      setResults(POPULAR_STOCKS);
    } else {
      setResults(
        POPULAR_STOCKS.filter((s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query]);

  // Click outside to close list
  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Navigate to prediction page
  function goToStock(symbol) {
    navigate(`/predict/${symbol}`);
  }

  return (
    <div ref={boxRef} className="search-wrapper">
      <input
        className="search-input"
        placeholder="Search 25+ popular stocks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="search-list">
        {results.map((s) => {
          const live = liveData[s.symbol];

          return (
            <div
              key={s.symbol}
              className="search-item"
              onClick={() => goToStock(s.symbol)}
            >
              <div className="left">
                <div className="symbol">{s.symbol}</div>
                <div className="name">{s.name}</div>
              </div>

              <div className="right">
                <div className="price">
                  ₹{live?.price ? live.price.toFixed(2) : "--"}
                </div>
                <div
                  className="pct"
                  style={{
                    color:
                      live?.percent_change > 0
                        ? "#33ff99"
                        : live?.percent_change < 0
                        ? "#ff6666"
                        : "#aaa",
                  }}
                >
                  {live?.percent_change
                    ? `${live.percent_change.toFixed(2)}%`
                    : "0.00%"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
