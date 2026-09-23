from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class CheckinCreate(BaseModel):
    student_id: str
    mood: int = Field(..., ge=1, le=5, description="1 (low) to 5 (high)")
    energy_level: int = Field(..., ge=1, le=5, description="1 (low) to 5 (high)")
    stress_level: int = Field(..., ge=1, le=5, description="1 (low) to 5 (high)")
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Sleep hours in last 24h")
    academic_pressure: int = Field(..., ge=1, le=5, description="1 (low) to 5 (high)")
    optional_note: Optional[str] = Field(None, max_length=500)

class CheckinResponse(BaseModel):
    id: str
    student_id: str
    mood: int
    energy_level: int
    stress_level: int
    sleep_hours: float
    academic_pressure: int
    optional_note: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
