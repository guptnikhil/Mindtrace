from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class NudgeResponse(BaseModel):
    id: str
    student_id: str
    category: str
    title: str
    message: str
    priority: str  # low, medium, high
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
