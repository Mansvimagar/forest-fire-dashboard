// SensorChart.jsx
import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function SensorChart() {
    const [data, setData] = useState([]);

    async function getLive() {
        try {
            const res = await fetch("http://localhost:8000/live-data");
            const json = await res.json();

            setData((prev) => [
                ...prev.slice(-20),
                {
                    time: new Date().toLocaleTimeString(),
                    temperature: json.temperature,
                    humidity: json.humidity,
                    smoke: json.smoke,
                },
            ]);
        } catch (e) {
            console.log("Error fetching live data");
        }
    }

    useEffect(() => {
        getLive();
        const id = setInterval(getLive, 3000);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{ width: "100%", height: 330 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Line type="monotone" dataKey="temperature" stroke="#f97316" />
                    <Line type="monotone" dataKey="humidity" stroke="#0ea5e9" />
                    <Line type="monotone" dataKey="smoke" stroke="#22c55e" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
