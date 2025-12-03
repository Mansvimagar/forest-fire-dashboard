import React, { useState, useEffect } from "react";

export default function Settings() {
  const [threshold, setThreshold] = useState(45);

  useEffect(() => {
    const saved = localStorage.getItem("threshold");
    if (saved) setThreshold(Number(saved));
  }, []);

  const saveSettings = () => {
    localStorage.setItem("threshold", threshold);
    alert("Settings Saved!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>⚙️ Settings</h2>

      <div className="settings-box">
        <label>🔥 Fire Temperature Threshold</label>
        <input
          type="number"
          className="settings-input"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />

        <button className="save-btn" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
