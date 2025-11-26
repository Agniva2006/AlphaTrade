// src/components/IndicatorPanel.jsx
import React from "react";

export default function IndicatorPanel({
  support = 0,
  resistance = 0,
  volatility = 0,
  rsi = 0,
  ma10 = 0,
  ma50 = 0,
  last = 0,
}) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: 14,
        marginTop: 14,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 10,
      }}
    >
      <IndicatorCard label="Last price" value={`₹${Number(last).toFixed(2)}`} sub="Spot (demo)" />

      {/* Removed Predicted card on purpose (visual-only forecast is on chart) */}

      <IndicatorCard label="Support" value={`₹${Number(support).toFixed(2)}`} sub="Short-term zone" />
      <IndicatorCard label="Resistance" value={`₹${Number(resistance).toFixed(2)}`} sub="Ceiling zone" />
      <IndicatorCard label="RSI" value={Number(rsi).toFixed(1)} sub={rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral"} />
      <IndicatorCard label="Volatility" value={Number(volatility).toFixed(2)} sub="Std dev (10 bars)" />
      <IndicatorCard label="MA 10" value={`₹${Number(ma10).toFixed(2)}`} sub="Fast moving avg" />
      <IndicatorCard label="MA 50" value={`₹${Number(ma50).toFixed(2)}`} sub="Slow moving avg" />
    </div>
  );
}

function IndicatorCard({ label, value, sub, tone }) {
  let color = "#e5e7eb";
  let subColor = "#9ca3af";
  if (tone === "up") color = "#4ade80";
  if (tone === "down") color = "#f97373";

  return (
    <div style={{
      borderRadius: 18,
      padding: "8px 10px",
      border: "1px solid rgba(148,163,184,0.45)",
      background: "linear-gradient(to bottom, rgba(15,23,42,0.97), rgba(2,6,23,0.97))",
    }}>
      <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: subColor }}>{sub}</div>
    </div>
  );
}
