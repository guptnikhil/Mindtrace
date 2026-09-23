import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Counsellor(Base):
    __tablename__ = "counsellors"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="College Counsellor")
    phone_number = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    availabilities = relationship("CounsellorAvailability", back_populates="counsellor", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="counsellor", cascade="all, delete-orphan")

class CounsellorAvailability(Base):
    __tablename__ = "counsellor_availabilities"

    id = Column(String, primary_key=True, default=generate_uuid)
    counsellor_id = Column(String, ForeignKey("counsellors.id"), nullable=False, index=True)
    date = Column(String, nullable=False) # Format YYYY-MM-DD
    start_time = Column(String, nullable=False) # e.g. "16:00"
    end_time = Column(String, nullable=False) # e.g. "18:00"
    status = Column(String, nullable=False, default="available") # "available", "fully_booked"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    counsellor = relationship("Counsellor", back_populates="availabilities")
    appointments = relationship("Appointment", back_populates="availability")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    counsellor_id = Column(String, ForeignKey("counsellors.id"), nullable=False, index=True)
    availability_id = Column(String, ForeignKey("counsellor_availabilities.id"), nullable=True, index=True)
    scheduled_at = Column(String, nullable=False) # e.g. "2026-09-23 17:30"
    duration_minutes = Column(Integer, default=15)
    status = Column(String, nullable=False, default="scheduled") # "scheduled", "rescheduled", "cancelled", "completed"
    meeting_link = Column(String, nullable=True)
    whatsapp_handoff_status = Column(String, default="pending")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    counsellor = relationship("Counsellor", back_populates="appointments")
    availability = relationship("CounsellorAvailability", back_populates="appointments")
