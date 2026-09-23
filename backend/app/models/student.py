import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_identifier = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    branch = Column(String, nullable=True, default="Computer Science & Engineering")
    year = Column(Integer, nullable=True, default=3)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    checkins = relationship("Checkin", back_populates="student", cascade="all, delete-orphan")
    assessments = relationship("WellbeingAssessment", back_populates="student", cascade="all, delete-orphan")
    nudges = relationship("Nudge", back_populates="student", cascade="all, delete-orphan")
    signals = relationship("BehaviorSignal", back_populates="student", cascade="all, delete-orphan")
    baseline = relationship("StudentBaseline", back_populates="student", uselist=False, cascade="all, delete-orphan")
