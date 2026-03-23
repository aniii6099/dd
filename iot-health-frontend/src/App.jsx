import { useEffect, useRef, useState } from "react";
import MetricCard from "./components/MetricCard";
import AlertBanner from "./components/AlertBanner";
import LiveChart from "./components/LiveChart";
import MLInsightsPanel from "./components/MLInsightsPanel";
import "./App.css";

const WS_URL = "ws://localhost:8000/ws";
const MAX_HISTORY = 20;

function App() {
  // 1. Single State Object with default values
  const [sensorData, setSensorData] = useState({
    bpm: 0,
    spo2: 0,
    acceleration: 0,
    timestamp: null,
    alert: "NORMAL",
    ml_insights: null
  });
  
  const [history, setHistory] = useState([]);        // Last 20 readings for chart
  const [connected, setConnected] = useState(false); // WS connection status
  const wsRef = useRef(null);

  // ── WebSocket lifecycle ──────────────────────────────────────────────────
  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // 8. Log each incoming message with timestamp
          console.log("New frame:", data);
          
          // 6. Add Data Validation
          if (data && typeof data === "object" && !Array.isArray(data)) {
            // 2 & 3. Atomic Update: Replace ENTIRE state
            setSensorData(data);
            
            setHistory((prev) => {
              const next = [...prev, data];
              return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
            });
          }
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      ws.onclose = () => {
        console.log("❌ WebSocket disconnected. Reconnecting in 3s...");
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // ── Alert helpers ────────────────────────────────────────────────────────
  
  // 6. Validation for "No finger detected"
  let displayAlert = sensorData.alert;
  let isNoFinger = false;
  if (sensorData.bpm === 0 && sensorData.spo2 === 0) {
    displayAlert = "No finger detected";
    isNoFinger = true;
  }
  
  const isAlert = displayAlert && displayAlert !== "NORMAL" && !isNoFinger;
  // If no finger, we don't necessarily want red cards for bpm/spo2, just the banner, or maybe red cards. Let's keep cards normal or grey.
  const bpmAlert = sensorData.bpm > 120;
  const spo2Alert = sensorData.spo2 > 0 && sensorData.spo2 < 90;
  const accelAlert = sensorData.acceleration > 2.5;

  return (
    <div className="app">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-icon">🏥</span>
          <div>
            <h1 className="header-title">Smart Health Monitor</h1>
            <p className="header-subtitle">IoT · ESP32 · Real-time Dashboard</p>
          </div>
        </div>
        <div className={`ws-badge ${connected ? "ws-badge--online" : "ws-badge--offline"}`}>
          <span className="ws-dot" />
          {connected ? "Live" : "Disconnected"}
        </div>
      </header>

      {/* ── Alert Banner ────────────────────────────────────────────────── */}
      {isNoFinger ? (
        <div className="alert-banner warning-banner">
          <span className="alert-banner__icon">🖐️</span>
          <span className="alert-banner__text">{displayAlert}</span>
        </div>
      ) : (
        <AlertBanner alert={displayAlert} />
      )}

      {/* ── Metric Cards ────────────────────────────────────────────────── */}
      {/* 4. UI Bindings all read from sensorData */}
      <section className="metrics-grid">
        <MetricCard
          label="Heart Rate"
          value={sensorData.bpm?.toFixed(0)}
          unit="BPM"
          icon="❤️"
          isAlert={bpmAlert}
        />
        <MetricCard
          label="Blood Oxygen"
          value={sensorData.spo2?.toFixed(1)}
          unit="%"
          icon="🩸"
          isAlert={spo2Alert}
        />
        <MetricCard
          label="Temperature"
          value={sensorData.temperature?.toFixed(1)}
          unit="°C"
          icon="🌡️"
          isAlert={false}
        />
        <MetricCard
          label="Acceleration"
          value={sensorData.acceleration?.toFixed(2)}
          unit="g"
          icon="📡"
          isAlert={accelAlert}
        />
      </section>

      {/* ── Alert Status Strip ──────────────────────────────────────────── */}
      <div className={`status-strip ${isAlert ? "status-strip--alert" : isNoFinger ? "status-strip--warning" : "status-strip--normal"}`}>
        {isNoFinger 
          ? "⚠️  STATUS: No finger detected" 
          : isAlert
            ? `⚠️  STATUS: ${displayAlert}`
            : "✅  STATUS: ALL VITALS NORMAL"}
        {sensorData.timestamp && (
          <span className="status-time">
            Last update: {new Date(sensorData.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* ── ML Insights Panel ───────────────────────────────────────────── */}
      <MLInsightsPanel insights={sensorData.ml_insights} />

      {/* ── Live Chart ──────────────────────────────────────────────────── */}
      <LiveChart data={history} />

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="app-footer">
        IoT Smart Healthcare Monitoring System · ESP32 + FastAPI + MongoDB
      </footer>
    </div>
  );
}

export default App;
