// Alerts.js
import React, { useEffect, useState } from "react";
import "./alert.css";

export default function Alerts() {
  const [sensor, setSensor] = useState(null);

  async function fetchAlerts() {
    try {
      const res = await fetch("http://localhost:8000/live-data");
      const json = await res.json();

      // alert logic
      let status = "Safe";
      if (json.temperature > 50 || json.smoke > 300) {
        status = "🔥 Fire Risk!";
      } else if (json.temperature > 40) {
        status = "⚠️ Warning";
      }

      setSensor({
        temperature: json.temperature,
        humidity: json.humidity,
        smoke: json.smoke,
        status,
      });
    } catch (err) {
      console.log("Error loading alerts");
    }
  }

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!sensor) return <p>Loading alerts...</p>;

  return (
    <div className="page-container">
      <h2 className="subtitle">🔥 Alerts</h2>

      <div
        className={`alert-card ${
          sensor.status.includes("Fire") ? "alert-risk" :
          sensor.status.includes("Warning") ? "alert-warning" : "alert-safe"
        }`}
      >
        <h3>Live Sensor</h3>

        <p>🌡 Temperature: {sensor.temperature}°C</p>
        <p>💧 Humidity: {sensor.humidity}%</p>
        <p>💨 Smoke: {sensor.smoke}</p>

        <p className="alert-status">{sensor.status}</p>
      </div>
    </div>
  );
}
