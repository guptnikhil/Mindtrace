from pydantic import BaseModel
from typing import List, Optional

class BehaviorSignalCreate(BaseModel):
    date: str
    late_night_activity_minutes: float
    assignment_delay_hours: float
    library_checkins: float
    routine_variance: float

class BehaviorSignalResponse(BehaviorSignalCreate):
    id: str
    student_id: str

    class Config:
        from_attributes = True

class BaselineResponse(BaseModel):
    avg_late_night_activity: float
    avg_assignment_delay: float
    avg_library_checkins: float
    avg_routine_variance: float

    class Config:
        from_attributes = True

class TrendResponse(BaseModel):
    state: str  # stable, changing, needs_attention
    score: float
    percentage_change: int
    last_updated: str
    baseline: Optional[BaselineResponse] = None
    factors: List[dict]
