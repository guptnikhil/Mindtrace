import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WellbeingAssessment(Base):
    __tablename__ = "wellbeing_assessments"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    risk_score = Column(Float, nullable=False)  # 0-100
    risk_level = Column(String, nullable=False)  # low, moderate, high
    contributing_factors = Column(JSON, nullable=False, default=list)
    recommendations = Column(JSON, nullable=False, default=list)
    explanation = Column(String, nullable=False, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="assessments")
