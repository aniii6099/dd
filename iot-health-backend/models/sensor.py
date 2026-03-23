from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class SensorInput(BaseModel):
    """
    Validates the incoming JSON payload from the ESP32.
    All fields are required.
    """
    bpm: float = Field(..., ge=0, le=300, description="Heart rate in beats per minute")
    spo2: float = Field(..., ge=0, le=100, description="Blood oxygen saturation (%)")
    temperature: float = Field(..., description="Body temperature in Celsius")
    acceleration: float = Field(..., description="Acceleration magnitude in g")


class SensorRecord(BaseModel):
    """
    Full record stored in MongoDB and returned to clients.
    """
    bpm: float
    spo2: float
    temperature: float
    acceleration: float
    alert: str
    ml_insights: dict
    timestamp: datetime

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
