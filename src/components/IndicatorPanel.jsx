import React from "react";

export default function IndicatorPanel({
  support,
  resistance,
  volatility,
  rsi,
  ma10,
  ma50,
  last,
  predicted,
}) {
  const diff = predicted != null ? predicted - last : 0;
  const pct = last ? (diff / last) * 100 : 0;

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
      <IndicatorCard
        label="Last price"
        value={`₹${last.toFixed(2)}`}
        sub="Spot (demo)"
      />
      <IndicatorCard
        label="Predicted"
        value={`₹${predicted.toFixed(2)}`}
        sub={`${diff >= 0 ? "+" : ""}${diff.toFixed(2)} (${pct.toFixed(2)}%)`}
        tone={diff >= 0 ? "up" : "down"}
      />
      <IndicatorCard
        label="Support"
        value={`₹${support.toFixed(2)}`}
        sub="Short-term zone"
      />
      <IndicatorCard
        label="Resistance"
        value={`₹${resistance.toFixed(2)}`}
        sub="Ceiling zone"
      />
      <IndicatorCard
        label="RSI"
        value={rsi.toFixed(1)}
        sub={rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral"}
      />
      <IndicatorCard
        label="Volatility"
        value={volatility.toFixed(2)}
        sub="Std dev (10 bars)"
      />
      <IndicatorCard
        label="MA 10"
        value={`₹${ma10.toFixed(2)}`}
        sub="Fast moving avg"
      />
      <IndicatorCard
        label="MA 50"
        value={`₹${ma50.toFixed(2)}`}
        sub="Slow moving avg"
      />
    </div>
  );
}

function IndicatorCard({ label, value, sub, tone }) {
  let color = "#e5e7eb";
  let subColor = "#9ca3af";
  if (tone === "up") color = "#4ade80";
  if (tone === "down") color = "#f97373";

  return (
    <div
      style={{
        borderRadius: 18,
        padding: "8px 10px",
        border: "1px solid rgba(148,163,184,0.45)",
        background:
          "linear-gradient(to bottom, rgba(15,23,42,0.97), rgba(2,6,23,0.97))",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 600,
          color,
          marginBottom: 2,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: subColor }}>{sub}</div>
    </div>
  );
}
