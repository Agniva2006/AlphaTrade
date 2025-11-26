// src/components/PriceChart.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { getPredictedSeries } from "../data/demoPrices.js";

export default function PriceChart({ data = [], showForecast = true, height = 360 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    // --- 1) Sort data strictly by TIME (important for 9:15 start) ---
    const sorted = [...data].sort((a, b) => {
      const da = new Date("2025-01-01 " + a.time);
      const db = new Date("2025-01-01 " + b.time);
      return da - db;
    });

    // sanitize
    const clean = sorted
      .map(d => ({
        time: d.time,
        close: Number(d.close || 0)
      }))
      .filter(d => Number.isFinite(d.close) && d.close > 0);

    // labels
    const labels = clean.map(d => d.time);
    const closes = clean.map(d => d.close);

    // predicted
    const predicted = showForecast ? getPredictedSeries(clean) : [];
    const predValues = predicted.map(p => p.close);

    // destroy previous chart
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Real Price",
            data: closes,
            borderColor: "#4ade80",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2,
          },
          ...(predicted.length
            ? [
                {
                  label: "Model (forecast)",
                  data: predValues,
                  borderColor: "#60a5fa",
                  borderDash: [6, 6],
                  borderWidth: 2,
                  pointRadius: 0,
                  tension: 0.25,
                },
              ]
            : []),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            labels: {
              color: "#d1d5db",
              font: { size: 12 },
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (items) => items[0].label, // show time
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: "#9ca3af",
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 14,
            },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
          y: {
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(255,255,255,0.06)" },
            suggestedMin: Math.min(...closes) * 0.97,
            suggestedMax: Math.max(...closes) * 1.03,
          },
        },

        interaction: { mode: "index", intersect: false },
        elements: {
          line: { borderJoinStyle: "round" },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data, showForecast]);

  return (
    <div className="chart-container" style={{ height }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
