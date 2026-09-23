import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Checkin(Base):
    __tablename__ = "wellbeing_checkins"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    mood = Column(Integer, nullable=False)  # 1-5
    energy_level = Column(Integer, nullable=False)  # 1-5
    stress_level = Column(Integer, nullable=False)  # 1-5
    sleep_hours = Column(Float, nullable=False)  # 0-24
    academic_pressure = Column(Integer, nullable=False)  # 1-5
    optional_note = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="checkins")
