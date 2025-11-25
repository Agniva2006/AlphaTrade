import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Prediction from "./pages/Prediction.jsx";
import Navbar from "./components/Navbar.jsx";
import LoginOverlay from "./components/LoginOverlay.jsx";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="app-root">
      {!loggedIn && <LoginOverlay onLogin={() => setLoggedIn(true)} />}
      {loggedIn && (
        <>
          <Navbar />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict/:symbol" element={<Prediction />} />
          </Routes>
        </>
      )}
    </div>
  );
}
