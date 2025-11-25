import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PriceChart({ data = [], predicted }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");

    const labels = data.map((d) => d.time);
    const closes = data.map((d) => d.close);

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Close Price",
            data: closes,
            borderColor: "#4ade80",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.25,
          },
          predicted !== null
            ? {
                label: "Predicted",
                data: [
                  ...closes.slice(0, closes.length - 1),
                  predicted,
                ],
                borderColor: "#60a5fa",
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.25,
              }
            : null,
        ].filter(Boolean),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#d1d5db", font: { size: 12 } },
          },
        },
        scales: {
          x: {
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
          y: {
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
        },
      },
    });
  }, [data, predicted]);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} height="120"></canvas>
    </div>
  );
}
