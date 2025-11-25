import React from "react";

export default function LoginOverlay({ onLogin }) {
  return (
    <div className="login-overlay">
      <style>
        {`
        .login-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, rgba(15,23,42,0.95), rgba(2,6,23,0.98));
          z-index: 50;
        }
        .login-card {
          width: min(420px, 92vw);
          border-radius: 24px;
          padding: 28px 26px 24px;
          background: radial-gradient(circle at top left, #020617 0, #020617 65%);
          border: 1px solid rgba(148,163,184,0.4);
          box-shadow: 0 24px 70px rgba(15,23,42,0.9);
        }
        .login-title {
          font-size: 26px;
          font-weight: 700;
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 6px;
        }
        .logo-dot {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: radial-gradient(circle at 20% 20%, #4ade80, #22c55e);
          box-shadow: 0 0 18px rgba(34,197,94,0.8);
        }
        .login-sub {
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 18px;
        }
        .login-google-btn {
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.35);
          background: linear-gradient(to right, #020617, #020617);
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 13px;
          justify-content: center;
          transition: border 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .login-google-btn:hover {
          border-color: rgba(248,250,252,0.7);
          box-shadow: 0 0 25px rgba(34,197,94,0.4);
          transform: translateY(-1px);
        }
        .login-footnote {
          font-size: 11px;
          color: #6b7280;
          margin-top: 10px;
        }
      `}
      </style>

      <div className="login-card">
        <div className="login-title">
          <span className="logo-dot" />
          AlphaTrade
        </div>
        <div className="login-sub">
          Sign in to view real-time indices, trending stocks, and AI-powered
          predictions — all in one clean dashboard.
        </div>

        <button className="login-google-btn" onClick={onLogin}>
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "4px",
              background:
                "conic-gradient(from 0deg, #ea4335, #fbbc05, #34a853, #4285f4, #ea4335)",
            }}
          />
          Continue with Google
        </button>

        <div className="login-footnote">
          Demo only – Google sign-in is mocked on localhost.
        </div>
      </div>
    </div>
  );
}
