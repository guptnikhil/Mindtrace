import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class BehaviorSignal(Base):
    __tablename__ = "behavior_signals"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    late_night_activity_minutes = Column(Float, nullable=False, default=0.0)
    assignment_delay_hours = Column(Float, nullable=False, default=0.0)
    library_checkins = Column(Float, nullable=False, default=0.0)
    routine_variance = Column(Float, nullable=False, default=1.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="signals")

class StudentBaseline(Base):
    __tablename__ = "student_baselines"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, unique=True)
    avg_late_night_activity = Column(Float, nullable=False, default=35.0)
    avg_assignment_delay = Column(Float, nullable=False, default=1.2)
    avg_library_checkins = Column(Float, nullable=False, default=3.5)
    avg_routine_variance = Column(Float, nullable=False, default=1.0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="baseline")
