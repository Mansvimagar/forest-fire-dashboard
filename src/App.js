import React, { useState, useEffect } from "react";
import "./App.css";

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(40);
  const [status, setStatus] = useState("Safe");

  useEffect(() => {
    const interval = setInterval(() => {
      const temp = getRandom(25, 50);
      const hum = getRandom(20, 80);
      setTemperature(temp);
      setHumidity(hum);
      setStatus(temp > 45 && hum < 30 ? "Fire Risk!" : "Safe");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>🌲 Forest Fire Detection Dashboard</h1>
      <p className="subtitle">Real-time monitoring of forest conditions</p>

      <div className="cards">
        <div className={`card ${status === "Safe" ? "status-safe" : "status-risk"}`}>
          <h2>🔥 Fire Status</h2>
          <p
            className="value"
            style={{ color: status === "Safe" ? "#22c55e" : "#ef4444" }}
          >
            {status}
          </p>
        </div>
        <div className="card">
          <h2>🌡 Temperature</h2>
          <p className="value" style={{ color: "#f97316" }}>{temperature}°C</p>
        </div>
        <div className="card">
          <h2>💧 Humidity</h2>
          <p className="value" style={{ color: "#0ea5e9" }}>{humidity}%</p>
        </div>
      </div>

      <div className="chart-box">
        <h2>📈 Sensor Data Trends</h2>
        <p style={{ color: "#64748b" }}>
          Charts coming soon (using Recharts or Chart.js)...
        </p>
      </div>
    </div>
  );
}

export default App;
