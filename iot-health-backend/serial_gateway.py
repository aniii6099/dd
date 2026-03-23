import serial
import requests
import json
import time

# 🔌 CHANGE COM PORT if needed
COM_PORT = "COM11"
BAUD_RATE = 115200

try:
    ser = serial.Serial(COM_PORT, BAUD_RATE)
except Exception as e:
    print(f"❌ Could not open serial port {COM_PORT}: {e}")
    exit(1)

# backend API
URL = "http://localhost:8000/api/data"

print(f"🚀 Serial Gateway Started on {COM_PORT}")

while True:
    try:
        # Read line from ESP32 over serial
        line = ser.readline().decode().strip()

        if line.startswith("{") and line.endswith("}"):
            print("📦 Received:", line)

            # Parse JSON
            data = json.loads(line)

            # 🔥 FIX FIELD NAMES
            mapped_data = {
                "bpm": data.get("bpm", 0),
                "spo2": data.get("spo2", 0),
                "temperature": data.get("temp", 0),      # FIXED
                "acceleration": data.get("accel", 0)     # FIXED
            }

            # Send to FastAPI backend
            response = requests.post(URL, json=mapped_data)

            print("🌐 Sent to backend:", response.status_code)

    except json.JSONDecodeError:
        print("❌ Invalid JSON received.")
    except Exception as e:
        print("❌ Error:", e)
        time.sleep(1) # Prevent spamming error logs if something unplugs
