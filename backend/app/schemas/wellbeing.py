from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class AnalyzeRequest(BaseModel):
    student_id: str
    mood: Optional[int] = Field(None, ge=1, le=5)
    energy_level: Optional[int] = Field(None, ge=1, le=5)
    stress_level: Optional[int] = Field(None, ge=1, le=5)
    sleep_hours: Optional[float] = Field(None, ge=0.0, le=24.0)
    academic_pressure: Optional[int] = Field(None, ge=1, le=5)

class AnalyzeResponse(BaseModel):
    id: Optional[str] = None
    student_id: str
    risk_level: str  # low | moderate | high
    risk_score: float  # 0 - 100
    contributing_factors: List[str]
    recommendations: List[str]
    explanation: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
