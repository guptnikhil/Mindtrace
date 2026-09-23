from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    student_identifier: str = Field(..., min_length=1, max_length=100, description="Unique student ID/roll number")
    name: str = Field(..., min_length=1, max_length=100)
    branch: Optional[str] = Field("Computer Science & Engineering", max_length=100)
    year: Optional[int] = Field(3, ge=1, le=5)

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    branch: Optional[str] = None
    year: Optional[int] = Field(None, ge=1, le=5)

class StudentResponse(StudentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
