from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from models.sensor import SensorInput, SensorRecord
from services.health_analyzer import analyze_health
from services.ml_models import get_ml_insights
from services.websocket_manager import manager
from database import get_database

router = APIRouter()


@router.post("/api/data", response_model=SensorRecord)
async def receive_sensor_data(payload: SensorInput):
    """
    POST /api/data

    Accepts JSON from ESP32:
        { "bpm": 78, "spo2": 97, "temp": 36.5, "accel": 1.02 }

    Steps:
    1. Run health alert analysis
    2. Build full record with timestamp
    3. Save to MongoDB
    4. Broadcast to all WebSocket clients
    5. Return full record
    """
    # 1. Analyse health
    alert = analyze_health(
        bpm=payload.bpm,
        spo2=payload.spo2,
        accel=payload.acceleration,
    )

    # 1.5 Run ML models
    ml_insights = get_ml_insights(
        bpm=payload.bpm,
        spo2=payload.spo2,
        accel=payload.acceleration
    )

    # 2. Build record
    record = {
        "bpm": payload.bpm,
        "spo2": payload.spo2,
        "temperature": payload.temperature,
        "acceleration": payload.acceleration,
        "alert": alert,
        "ml_insights": ml_insights,
        "timestamp": datetime.now(timezone.utc),
    }

    # 3. Save to MongoDB
    try:
        db = get_database()
        db["sensor_data"].insert_one(record)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # 4. Broadcast via WebSocket (convert datetime for JSON)
    ws_payload = {**record, "timestamp": record["timestamp"].isoformat()}
    await manager.broadcast(ws_payload)

    # 5. Return structured response
    return SensorRecord(**record)
