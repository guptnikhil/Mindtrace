import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Nudge(Base):
    __tablename__ = "nudges"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String, nullable=False, default="general")  # hydration, sleep, workload, support
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="medium")  # low, medium, high
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="nudges")
