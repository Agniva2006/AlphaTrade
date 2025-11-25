import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogoClick = () => navigate("/");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(148,163,184,0.3)",
        background:
          "linear-gradient(to right, rgba(15,23,42,0.9), rgba(2,6,23,0.9))",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div
          onClick={onLogoClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 20% 20%, #4ade80, #22c55e)",
              boxShadow: "0 0 20px rgba(34,197,94,0.7)",
            }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>AlphaTrade</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              Live indices • AI predictions
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          <span
            className="chip"
            style={{
              borderColor: location.pathname === "/" ? "#22c55e" : undefined,
              color: location.pathname === "/" ? "#bbf7d0" : undefined,
            }}
          >
            Dashboard
          </span>
          <span
            className="chip"
            style={{
              borderColor: location.pathname.startsWith("/predict")
                ? "#22c55e"
                : undefined,
              color: location.pathname.startsWith("/predict")
                ? "#bbf7d0"
                : undefined,
            }}
          >
            Prediction
          </span>
        </div>
      </div>
    </header>
  );
}