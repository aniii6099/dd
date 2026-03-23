import React from "react";
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

/**
 * LiveChart — plots the last N sensor readings using Recharts.
 *
 * Props:
 *   data {Array} - Array of sensor records (last 20)
 */
const LiveChart = ({ data }) => {
  // Format timestamp for the X-axis tick
  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const chartData = data.map((d) => ({
    time: formatTime(d.timestamp),
    BPM: Number(d.bpm?.toFixed(1)),
    SpO2: Number(d.spo2?.toFixed(1)),
    Temp: Number(d.temperature?.toFixed(1)),
    Accel: Number(d.acceleration?.toFixed(2)),
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">📈 Live Sensor Readings (Last 20)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#a0aec0", fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: "#a0aec0", fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: "#1a1a2e", border: "1px solid #4a4a6a", borderRadius: 8 }}
            labelStyle={{ color: "#e2e8f0" }}
            itemStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ color: "#a0aec0" }} />
          <Line type="monotone" dataKey="BPM" stroke="#f6ad55" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="SpO2" stroke="#68d391" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Temp" stroke="#76e4f7" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Accel" stroke="#b794f4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;
