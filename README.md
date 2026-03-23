# 🏥 IoT Smart Healthcare Monitoring System

Real-time health monitoring dashboard — ESP32 → FastAPI → MongoDB → WebSocket → React.

## 📂 Project Structure

```
Final Year Project/
├── iot-health-backend/          # FastAPI backend
│   ├── models/
│   │   └── sensor.py            # Pydantic request/response models
│   ├── services/
│   │   ├── health_analyzer.py   # Rule-based alert logic
│   │   └── websocket_manager.py # WebSocket broadcast manager
│   ├── routes/
│   │   ├── data.py              # POST /api/data
│   │   └── ws.py                # /ws WebSocket endpoint
│   ├── database.py              # MongoDB (Motor) connection
│   ├── main.py                  # FastAPI app entrypoint
│   ├── requirements.txt
│   └── .env                     # MongoDB URL config
│
└── iot-health-frontend/         # React + Vite frontend
    └── src/
        ├── components/
        │   ├── MetricCard.jsx   # BPM / SpO2 / Temp / Accel card
        │   ├── AlertBanner.jsx  # Warning strip for alerts
        │   └── LiveChart.jsx    # Recharts live line chart
        ├── App.jsx              # WebSocket hook + dashboard layout
        └── App.css              # Dark premium theme
```

---

## ✅ Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10+ |
| Node.js | 18+ |
| MongoDB | 6+ (running locally on port 27017) |

---

## 🚀 Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running locally:
```bash
mongod
```
Or use MongoDB Compass / MongoDB Atlas (update `.env` accordingly).

---

### 2. Backend

```bash
cd "iot-health-backend"

# Create & activate virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
Interactive API docs: **http://localhost:8000/docs**

---

### 3. Frontend

```bash
cd "iot-health-frontend"
npm install
npm run dev
```

Dashboard runs at: **http://localhost:5173**

---

## 🧪 API Test — curl Examples

### Send normal sensor data
```bash
curl -X POST http://localhost:8000/api/data \
  -H "Content-Type: application/json" \
  -d '{"bpm": 78, "spo2": 97, "temp": 36.5, "accel": 1.02}'
```

**Expected response:**
```json
{
  "bpm": 78.0,
  "spo2": 97.0,
  "temp": 36.5,
  "accel": 1.02,
  "alert": "NORMAL",
  "timestamp": "2026-03-17T05:25:00.000000+00:00"
}
```

---

### Trigger LOW OXYGEN alert
```bash
curl -X POST http://localhost:8000/api/data \
  -H "Content-Type: application/json" \
  -d '{"bpm": 95, "spo2": 85, "temp": 37.2, "accel": 1.1}'
```

### Trigger FALL DETECTED alert
```bash
curl -X POST http://localhost:8000/api/data \
  -H "Content-Type: application/json" \
  -d '{"bpm": 88, "spo2": 96, "temp": 36.8, "accel": 3.5}'
```

### Trigger HIGH HEART RATE alert
```bash
curl -X POST http://localhost:8000/api/data \
  -H "Content-Type: application/json" \
  -d '{"bpm": 145, "spo2": 96, "temp": 37.0, "accel": 1.0}'
```

---

## ⚙️ Alert Rules

| Condition | Alert |
|-----------|-------|
| SpO2 < 90% | LOW OXYGEN |
| Acceleration > 2.5g | FALL DETECTED |
| BPM > 120 | HIGH HEART RATE |
| Everything normal | NORMAL |

---

## 🔌 WebSocket

Connect from JavaScript:
```js
const ws = new WebSocket("ws://localhost:8000/ws");
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data); // { bpm, spo2, temp, accel, alert, timestamp }
};
```

---

## 🐟 ESP32 Code Snippet

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* serverUrl = "http://YOUR_PC_IP:8000/api/data";

void sendData(float bpm, float spo2, float temp, float accel) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["bpm"] = bpm;
  doc["spo2"] = spo2;
  doc["temp"] = temp;
  doc["accel"] = accel;

  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  http.end();
}
```

---

## 🗄️ MongoDB Collection

**Database:** `smart_health`  
**Collection:** `sensor_data`

```json
{
  "_id": "ObjectId(...)",
  "bpm": 78.0,
  "spo2": 97.0,
  "temp": 36.5,
  "accel": 1.02,
  "alert": "NORMAL",
  "timestamp": "2026-03-17T05:25:00Z"
}
```
