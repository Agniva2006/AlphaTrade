import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PriceChart from "../components/PriceChart";
import SearchBar from "../components/SearchBar";
import IndicatorPanel from "../components/IndicatorPanel";
import {
  getLiveSeries,
  getLiveQuote,
  extractFeatures,
  INDICES,
} from "../data/demoPrices.js";

/**
 * Upgraded Prediction Page
 * - polished top indicator cards
 * - chart container with legend
 * - extra indicators presented as cards (MA20 / MA200 / MACD / BB)
 * - right sidebar: indices + quick stock list (SearchBar)
 * - improved trading signal pill and layout
 *
 * Drop-in replacement for your existing Prediction.jsx
 */

export default function PredictionPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [features, setFeatures] = useState(null);
  const [signal, setSignal] = useState("NEUTRAL");
  const [indices, setIndices] = useState({});
  const [loading, setLoading] = useState(true);

  // compute a naive predicted price (small-horizon forecast) for UI display
  const computePredicted = (f) => {
    if (!f) return null;
    return Number((f.close * (1 + f.ret1)).toFixed(2));
  };

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      try {
        const s = await getLiveSeries(symbol);
        if (!mounted) return;
        setSeries(s);

        const feats = extractFeatures(s);
        setFeatures(feats);

        setSignal(computeSignal(feats));
      } catch (err) {
        console.error("loadAll error", err);
      } finally {
        if (mounted) setLoading(false);
      }

      // indices
      const idxData = {};
      await Promise.all(
        INDICES.map(async (ix) => {
          try {
            const q = await getLiveQuote(ix.code);
            idxData[ix.symbol] = q;
          } catch (e) {
            idxData[ix.symbol] = { error: true };
          }
        })
      );
      if (mounted) setIndices(idxData);
    }

    loadAll();
    const id = setInterval(loadAll, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [symbol]);

  // extra indicators: MA20, MA200, MACD, Bollinger Bands
  const extraIndicators = React.useMemo(() => {
    if (!series || series.length === 0) return {};
    const closes = series.map((s) => s.close);
    return {
      ma20: sma(closes, 20),
      ma200: sma(closes, 200),
      macd: macd(closes),
      bb: bollinger(closes, 20, 2),
    };
  }, [series]);

  const predicted = computePredicted(features);

  return (
    <div style={styles.pageShell}>
      {/* Top bar */}
      <div style={styles.topRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={styles.logoDot} />
          <div>
            <div style={styles.h1}>
              {symbol} — Live Prediction
            </div>
            <div style={styles.subtitle}>Realtime intraday · AI preview · Demo data</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 380 }}>
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main grid: left content + right sidebar */}
      <div style={styles.mainGrid}>
        {/* Left: chart + indicators */}
        <div>
          {/* signal & summary */}
          <div style={styles.signalRow}>
            <SignalPill signal={signal} />
            <div style={styles.summaryText}>
              <div>
                Predicted:{" "}
                <span style={{ color: predicted >= (features?.close || 0) ? "var(--accent)" : "var(--danger)" }}>
                  ₹{predicted ?? "—"}
                </span>
              </div>
              <div style={{ color: "#9ca3af" }}>
                • Last: ₹{features ? Number(features.close).toFixed(2) : "—"}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button style={styles.actionBtn} onClick={() => navigate(`/predict/${symbol}`)}>Refresh</button>
              <button style={{ ...styles.actionBtn, background: "transparent", border: "1px solid rgba(255,255,255,0.06)" }}>Add Alert</button>
            </div>
          </div>

          {/* Top indicator cards */}
          <div style={styles.cardGrid}>
            <IndicatorCard title="Last Price" subtitle="Spot (demo)">
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                ₹{features ? Number(features.close).toFixed(2) : "—"}
              </div>
            </IndicatorCard>

            <IndicatorCard title="Predicted" subtitle="Short horizon">
              <div style={{ color: predicted >= (features?.close || 0) ? "var(--accent)" : "var(--danger)", fontWeight: 800 }}>
                ₹{predicted ?? "—"}
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                  {features ? `${Number(((predicted - features.close) / features.close) * 100).toFixed(2)}%` : "—"}
                </div>
              </div>
            </IndicatorCard>

            <IndicatorCard title="Support" subtitle="Short-term zone">
              <div style={{ fontWeight: 800 }}>₹{features?.support ?? "—"}</div>
            </IndicatorCard>

            <IndicatorCard title="Resistance" subtitle="Ceiling zone">
              <div style={{ fontWeight: 800 }}>₹{features?.resistance ?? "—"}</div>
            </IndicatorCard>

            <IndicatorCard title="RSI" subtitle="Momentum">
              <div style={{ fontWeight: 800 }}>{features?.rsi ?? "—"}</div>
            </IndicatorCard>

            <IndicatorCard title="Volatility" subtitle="Std dev (10 bars)">
              <div style={{ fontWeight: 800 }}>{features ? Number(features.vol).toFixed(4) : "—"}</div>
            </IndicatorCard>

            <IndicatorCard title="MA10" subtitle="Fast moving avg">
              <div style={{ fontWeight: 800 }}>₹{features?.ma10 ?? "—"}</div>
            </IndicatorCard>

            <IndicatorCard title="MA50" subtitle="Slow moving avg">
              <div style={{ fontWeight: 800 }}>₹{features?.ma50 ?? "—"}</div>
            </IndicatorCard>
          </div>

          {/* Chart */}
          <div style={{ marginTop: 16 }} className="glass-panel">
            <div style={{ padding: 16 }}>
              <PriceChart data={series} predicted={predicted} />
            </div>
          </div>

          {/* Extra indicators grid */}
          <div style={{ marginTop: 14 }}>
            <div className="glass-panel" style={{ padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                <SmallInd title="MA20" value={extraIndicators.ma20} label="Medium term SMA" />
                <SmallInd title="MA200" value={extraIndicators.ma200} label="Long term SMA" />
                <SmallInd title="MACD (Hist)" value={extraIndicators.macd?.hist} label="Momentum hist" />
                <SmallInd title="BB Upper" value={extraIndicators.bb?.upper} label="+2σ band" />
                <SmallInd title="BB Mid" value={extraIndicators.bb?.mid} label="20 SMA" />
                <SmallInd title="BB Lower" value={extraIndicators.bb?.lower} label="-2σ band" />
                <SmallInd title="ATR" value={features?.atr ? Number(features.atr).toFixed(2) : null} label="Average true range" />
                <SmallInd title="Volatility (σ)" value={extraIndicators.bb?.sd ?? Number(features?.vol).toFixed(4)} label="Std dev" />
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside style={{ width: 360 }}>
          <div className="glass-panel" style={{ padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800 }}>Indices</div>
              <div style={{ color: "#9ca3af", fontSize: 12 }}>Realtime (demo)</div>
            </div>

            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {INDICES.map((ix) => {
                const d = indices[ix.symbol];
                if (!d || d.error) {
                  return (
                    <div key={ix.symbol} style={styles.indexCard}>
                      <div style={{ fontSize: 13 }}>{ix.name}</div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>—</div>
                      <div style={{ color: "#9ca3af", fontSize: 12 }}>—</div>
                    </div>
                  );
                }
                const price = d.price ?? d.regularMarketPrice ?? d.previousClose ?? 0;
                const change = d.change ?? d.regularMarketChange ?? 0;
                const pct = d.percent_change ?? d.regularMarketChangePercent ?? 0;
                const isUp = change >= 0;
                return (
                  <div key={ix.symbol} style={styles.indexCard}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 13 }}>{ix.name}</div>
                      <div style={{ fontWeight: 800 }}>₹{Number(price).toFixed(2)}</div>
                    </div>
                    <div style={{ color: isUp ? "var(--accent)" : "var(--danger)", fontSize: 13 }}>
                      {change >= 0 ? "+" : ""}{Number(change).toFixed(2)} ({Number(pct).toFixed(2)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800 }}>Stocks</div>
              <div style={{ color: "#9ca3af", fontSize: 12 }}>Popular</div>
            </div>

            <div style={{ marginTop: 8 }}>
              <SearchBar />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 12, marginTop: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Quick Actions</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={styles.smallBtn} onClick={() => window.open(`/predict/${symbol}`, "_self")}>Refresh</button>
              <button style={styles.smallBtn}>Export CSV</button>
              <button style={styles.smallBtn}>Share</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------
   Small presentational components
   ------------------------*/

function IndicatorCard({ title, subtitle, children }) {
  return (
    <div style={styles.indicatorCard}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>{subtitle}</div>
      </div>
      <div style={{ marginTop: 8 }}>{children}</div>
    </div>
  );
}

function SmallInd({ title, value, label }) {
  return (
    <div style={styles.smallInd}>
      <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>{title}</div>
      <div style={{ marginTop: 6, fontWeight: 800, fontSize: 16 }}>
        {value !== null && value !== undefined ? value : "—"}
      </div>
      {label && <div style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>{label}</div>}
    </div>
  );
}

function SignalPill({ signal }) {
  const color =
    signal === "BUY" ? "rgba(34,197,94,0.12)" :
    signal === "SELL" ? "rgba(239,68,68,0.12)" :
    "rgba(255,255,255,0.03)";
  const border =
    signal === "BUY" ? "1px solid rgba(34,197,94,0.25)" :
    signal === "SELL" ? "1px solid rgba(239,68,68,0.25)" :
    "1px solid rgba(255,255,255,0.04)";

  return (
    <div style={{ padding: "8px 12px", borderRadius: 10, fontWeight: 800, background: color, border }}>
      Trading Signal: <span style={{ color: signal === "BUY" ? "var(--accent)" : signal === "SELL" ? "var(--danger)" : "#d1d5db" }}>{signal}</span>
    </div>
  );
}

/* -------------------------
   Small helpers (local)
   ------------------------*/
function sma(values, period) {
  if (!values || values.length < period) return null;
  const slice = values.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return Number((sum / period).toFixed(2));
}

// MACD simple: fast=12, slow=26, signal=9, returns {macd, signal, hist}
function macd(values, fast = 12, slow = 26, signal = 9) {
  if (!values || values.length < slow) return null;
  const ema = (arr, period) => {
    const k = 2 / (period + 1);
    let ema = arr.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < arr.length; i++) {
      ema = arr[i] * k + ema * (1 - k);
    }
    return ema;
  };

  const slowEma = ema(values, slow);
  const fastEma = ema(values, fast);
  const macdLine = fastEma - slowEma;
  const signalLine = macdLine; // approximation for UI
  return {
    macd: Number(macdLine.toFixed(4)),
    signal: Number(signalLine.toFixed(4)),
    hist: Number((macdLine - signalLine).toFixed(4)),
  };
}

// Bollinger bands (period, stdDev multiplier)
function bollinger(values, period = 20, mult = 2) {
  if (!values || values.length < period) return null;
  const slice = values.slice(-period);
  const mid = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((acc, v) => acc + Math.pow(v - mid, 2), 0) / period;
  const sd = Math.sqrt(variance);
  return {
    upper: Number((mid + mult * sd).toFixed(2)),
    mid: Number(mid.toFixed(2)),
    lower: Number((mid - mult * sd).toFixed(2)),
    sd: Number(sd.toFixed(4)),
  };
}

/* BUY / SELL SIGNAL (slightly improved)
   Uses RSI, MA cross, and support/resistance proximity.
*/
function computeSignal(f) {
  if (!f) return "NEUTRAL";
  let score = 0;

  // RSI
  if (f.rsi < 30) score += 2;
  if (f.rsi > 70) score -= 2;

  // MA crossover
  if (f.ma10 > f.ma50) score += 1;
  if (f.ma10 < f.ma50) score -= 1;

  // trend strength via ATR: lower ATR favors BUY (less volatility) — small bias
  if (f.atr && f.atr < Math.max(1, f.ma10 * 0.01)) score += 0.5;

  // proximity to support/resistance
  if (f.close <= f.support * 1.015) score += 1.5;
  if (f.close >= f.resistance * 0.985) score -= 1.5;

  if (score >= 2) return "BUY";
  if (score <= -2) return "SELL";
  return "NEUTRAL";
}

/* ------ inline styles ------- */
const styles = {
  pageShell: {
    padding: 18,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    background: "linear-gradient(90deg,#10b981,#22c55e)",
    boxShadow: "0 4px 14px rgba(16,185,129,0.08)",
  },
  h1: { fontSize: 22, fontWeight: 800 },
  subtitle: { color: "#9ca3af", fontSize: 13 },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: 20,
    alignItems: "start",
  },
  signalRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  summaryText: { color: "#9ca3af", fontSize: 13, display: "flex", gap: 10, alignItems: "center" },
  actionBtn: {
    background: "var(--accent-bg, rgba(34,197,94,0.06))",
    border: "1px solid rgba(255,255,255,0.04)",
    padding: "6px 10px",
    borderRadius: 8,
    color: "#e6eef6",
    cursor: "pointer",
    fontWeight: 700,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 6,
  },
  indicatorCard: {
    background: "rgba(255,255,255,0.03)",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.04)",
  },
  indexCard: {
    background: "transparent",
    padding: 8,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.03)",
  },
  smallInd: {
    background: "rgba(255,255,255,0.02)",
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.04)",
    minHeight: 74,
  },
  smallBtn: {
    padding: "8px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
    color: "#e6eef6",
  },
  indicatorCard2: {
    background: "rgba(255,255,255,0.03)",
    padding: 12,
    borderRadius: 10,
  },
};

