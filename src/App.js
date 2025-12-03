// src/App.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";
import SensorChart from "./SensorChart.jsx";
import Locations from "./locations.jsx";
import Alerts from "./alert.jsx";
import Settings from "./settings.jsx";


function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [smoke, setSmoke] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [darkMode, setDarkMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  // Poll live data every 3s
  useEffect(() => {
    let mounted = true;

    async function pollLive() {
      try {
        const res = await fetch("http://localhost:8000/live-data");

        if (!res.ok) {
          console.warn("live fetch status", res.status);
          return;
        }
        const json = await res.json();
        if (!mounted) return;

        setTemperature(json.temperature);
        setHumidity(json.humidity);
        setSmoke(json.smoke);
        setStatus(json.fire_risk === 1 ? "Fire Risk!" : "Safe");
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Poll error:", err);
      }
    }

    pollLive();
    const id = setInterval(pollLive, 3000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "locations":
        return <Locations />;
      case "alerts":
        return <Alerts temperature={temperature} humidity={humidity} smoke={smoke} status={status} />;
      case "settings":
        return <Settings darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />;
      default:
        return (
          <>
            <p className="subtitle">Real-time monitoring of forest conditions</p>
            <p className="last-updated">🕒 Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}</p>

            <div className="cards">
              <motion.div
                className={`card ${status === "Safe" ? "status-safe" : "status-risk"}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2>🔥 Fire Status</h2>
                <p className="value" style={{ color: status === "Safe" ? "#22c55e" : "#ef4444" }}>{status}</p>
              </motion.div>

              <div className="card">
                <h2>🌡 Temperature</h2>
                <p className="value" style={{ color: "#f97316" }}>{temperature ?? "—"}°C</p>
              </div>

              <div className="card">
                <h2>💧 Humidity</h2>
                <p className="value" style={{ color: "#0ea5e9" }}>{humidity ?? "—"}%</p>
              </div>

              <div className="card">
                <h2>💨 Smoke</h2>
                <p className="value">{smoke ?? "—"}</p>
              </div>
            </div>

            {status === "Fire Risk!" && (
              <div className="alert-banner">🚨 Fire Risk Detected! Take Action Immediately 🚨</div>
            )}

            <div className="chart-box">
              <SensorChart />
            </div>
          </>
        );
    }
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard"}>
      <div className="top-nav">
        <h2 className="logo">🌲 Forest Fire Detection</h2>
        <div className="nav-links">
          <button onClick={() => setActivePage("dashboard")}>Dashboard</button>
          <button onClick={() => setActivePage("locations")}>Locations</button>
          <button onClick={() => setActivePage("alerts")}>Alerts</button>
          <button onClick={() => setActivePage("settings")}>Settings</button>
          <button className="mode-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
      <div style={{ marginTop: 80 }}>{renderPage()}</div>
    </div>
  );
}

export default App;
