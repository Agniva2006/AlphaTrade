import React, { useEffect, useState } from "react";
import { INDICES, getLiveQuote } from "../data/demoPrices.js";


export default function IndexStrip() {
const [indexData, setIndexData] = useState([]);


async function load() {
const out = [];
for (const idx of INDICES) {
const q = await getLiveQuote(idx.code);
if (!q || q.error) {
out.push({ symbol: idx.symbol, name: idx.name, price: null, change: null, pct: null });
} else {
out.push({ symbol: idx.symbol, name: idx.name, price: q.price, change: q.change, pct: q.percent_change });
}
}
setIndexData(out);
}


useEffect(() => {
load();
const id = setInterval(load, 15000);
return () => clearInterval(id);
}, []);


return (
<div className="index-strip" style={{ display: "flex", gap: 12, overflowX: "auto" }}>
{indexData.map((i) => (
<div key={i.symbol} style={{ minWidth: 160, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
<div style={{ fontSize: 12, color: "#9ca3af" }}>{i.name}</div>
<div style={{ fontSize: 18, fontWeight: 600 }}>{i.price != null ? `₹${Number(i.price).toFixed(2)}` : "—"}</div>
<div style={{ fontSize: 12, color: (i.change || 0) >= 0 ? "#4ade80" : "#f87171" }}>
{i.change == null ? "—" : `${i.change >= 0 ? "+" : ""}${Number(i.change).toFixed(2)} (${Number(i.pct).toFixed(2)}%)`}
</div>
</div>
))}
</div>
);
}