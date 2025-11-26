// ===============================
//    src/pages/Prediction.jsx
// ===============================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PriceChart from "../components/PriceChart";
import SearchBar from "../components/SearchBar";
import {
  getLiveSeries,
  extractFeatures
} from "../data/demoPrices.js";

export default function PredictionPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [series, setSeries] = useState([]);
  const [features, setFeatures] = useState(null);
  const [signal, setSignal] = useState("NEUTRAL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const s = await getLiveSeries(symbol);
        if (!mounted) return;

        setSeries(s);

        const feats = extractFeatures(s);
        setFeatures(feats);

        setSignal(computeSignal(feats));
      } catch (e) {
        console.log("ERR:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 30000); // 30 sec auto refresh
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [symbol]);

  function computeSignal(f) {
    if (!f) return "NEUTRAL";

    let score = 0;

    if (f.rsi < 30) score += 2;
    if (f.rsi > 70) score -= 2;

    if (f.ma10 > f.ma50) score += 1;
    if (f.ma10 < f.ma50) score -= 1;

    if (f.ema20 > f.ema50) score += 1;
    if (f.ema20 < f.ema50) score -= 1;

    if (f.close <= f.support * 1.015) score += 1.5;
    if (f.close >= f.resistance * 0.985) score -= 1.5;

    if (score >= 2) return "BUY";
    if (score <= -2) return "SELL";
    return "NEUTRAL";
  }

  return (
    <div style={{ padding: 18 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "linear-gradient(90deg,#10b981,#22c55e)"
          }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{symbol} — Live View</div>
            <div style={{ color: "#9ca3af" }}>Realtime intraday • ML Comparison</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate(`/predict/${symbol}`)} style={btnStyle}>Refresh</button>
          <button style={{ ...btnStyle, background: "transparent", border: "1px solid rgba(255,255,255,0.06)" }}>Add Alert</button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 20 }}>
        
        {/* LEFT SIDE */}
        <div>
          {/* TOP 3 VALUES */}
          <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
            <MiniCard title="Last Price" value={features ? "₹" + features.close.toFixed(2) : "—"} />
            <MiniCard title="Support" value={features ? "₹" + features.support.toFixed(2) : "—"} />
            <MiniCard title="Resistance" value={features ? "₹" + features.resistance.toFixed(2) : "—"} />

            <div style={{ marginLeft: "auto", fontWeight: 800 }}>
              Trading Signal: <span style={{
                color:
                  signal === "BUY" ? "#10b981" :
                  signal === "SELL" ? "#ef4444" :
                  "#d1d5db"
              }}>{signal}</span>
            </div>
          </div>

          {/* CHART */}
          <div className="glass-panel" style={{ padding: 16 }}>
            <PriceChart data={series} showForecast={true} height={420} />
          </div>

          {/* INDICATORS GRID */}
          <div style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 12
          }}>
            <SmallInd title="MA10" value={features?.ma10} />
            <SmallInd title="MA50" value={features?.ma50} />
            <SmallInd title="EMA20" value={features?.ema20} />
            <SmallInd title="EMA50" value={features?.ema50} />
            <SmallInd title="VWAP" value={features?.vwap} />
            <SmallInd title="Range Index" value={features?.rangeIndex + "%"} />
            <SmallInd title="ATR" value={features?.atr} />
            <SmallInd title="RSI" value={features?.rsi} />
            <SmallInd title="Trend Strength" value={features?.trendStrength} />
            <SmallInd title="Volatility" value={features?.vol?.toFixed(4)} />
          </div>
        </div>

        {/* RIGHT SIDE: ONLY SEARCHBAR NOW, NO INDICES */}
        <aside>
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontWeight: 800 }}>Stocks</div>
            <div style={{ marginTop: 8 }}>
              <SearchBar />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

/* MINI DISPLAY CARDS */
function MiniCard({ title, value }) {
  return (
    <div style={{
      padding: 10,
      borderRadius: 10,
      background: "rgba(255,255,255,0.03)"
    }}>
      <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function SmallInd({ title, value }) {
  return (
    <div style={{
      padding: 10,
      borderRadius: 10,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.04)"
    }}>
      <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 16, marginTop: 4, fontWeight: 800 }}>
        {value !== undefined ? value : "—"}
      </div>
    </div>
  );
}

const btnStyle = {
  background: "rgba(34,197,94,0.06)",
  border: "1px solid rgba(255,255,255,0.04)",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
  color: "#e6eef6",
  fontWeight: 700
};
