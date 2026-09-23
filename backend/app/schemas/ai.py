from pydantic import BaseModel
from typing import Optional, List

class AISummaryRequest(BaseModel):
    student_id: str

class AISummaryResponse(BaseModel):
    student_id: str
    summary: str
    key_observations: List[str]
    suggested_focus: str
