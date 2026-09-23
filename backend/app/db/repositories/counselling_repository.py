from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.models.counselling import Counsellor, CounsellorAvailability, Appointment

class CounsellingRepository:
    def __init__(self, db: Session):
        self.db = db

    def seed_demo_counsellors_if_empty(self):
        """Seeds realistic deterministic demo counsellors and availabilities if database is empty."""
        count = self.db.query(Counsellor).count()
        if count > 0:
            return

        c1 = Counsellor(
            id="counsellor_mehta",
            name="Dr. Mehta",
            role="College Counsellor",
            phone_number="+919876543210",
            active=True
        )
        c2 = Counsellor(
            id="counsellor_sharma",
            name="Dr. Sharma",
            role="Senior Student Counsellor",
            phone_number="+919876543211",
            active=True
        )
        self.db.add_all([c1, c2])
        self.db.commit()

        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        a1 = CounsellorAvailability(
            counsellor_id=c1.id,
            date=today_str,
            start_time="16:00",
            end_time="18:00",
            status="available"
        )
        a2 = CounsellorAvailability(
            counsellor_id=c2.id,
            date=today_str,
            start_time="15:30",
            end_time="17:30",
            status="available"
        )
        self.db.add_all([a1, a2])
        self.db.commit()

    def get_counsellors(self) -> List[Counsellor]:
        self.seed_demo_counsellors_if_empty()
        return self.db.query(Counsellor).filter(Counsellor.active == True).all()

    def get_counsellor_by_id(self, counsellor_id: str) -> Optional[Counsellor]:
        self.seed_demo_counsellors_if_empty()
        return self.db.query(Counsellor).filter(Counsellor.id == counsellor_id).first()

    def get_appointments_for_counsellor_and_date(self, counsellor_id: str, date_str: str) -> List[Appointment]:
        prefix = f"{date_str}"
        return self.db.query(Appointment).filter(
            Appointment.counsellor_id == counsellor_id,
            Appointment.scheduled_at.like(f"{prefix}%"),
            Appointment.status != "cancelled"
        ).all()

    def is_slot_booked(self, counsellor_id: str, scheduled_at_str: str, exclude_appointment_id: str = None) -> bool:
        query = self.db.query(Appointment).filter(
            Appointment.counsellor_id == counsellor_id,
            Appointment.scheduled_at == scheduled_at_str,
            Appointment.status != "cancelled"
        )
        if exclude_appointment_id:
            query = query.filter(Appointment.id != exclude_appointment_id)
        return query.first() is not None

    def create_appointment(
        self,
        student_id: str,
        counsellor_id: str,
        scheduled_at: str,
        duration_minutes: int = 15,
        meeting_link: str = None
    ) -> Appointment:
        appt = Appointment(
            student_id=student_id,
            counsellor_id=counsellor_id,
            scheduled_at=scheduled_at,
            duration_minutes=duration_minutes,
            status="scheduled",
            meeting_link=meeting_link or "https://meet.jit.si/mindtrace-wellbeing-support-session"
        )
        self.db.add(appt)
        self.db.commit()
        self.db.refresh(appt)
        return appt

    def get_student_appointments(self, student_id: str) -> List[Appointment]:
        return self.db.query(Appointment).filter(
            Appointment.student_id == student_id
        ).order_by(Appointment.created_at.desc()).all()

    def get_appointment_by_id(self, appointment_id: str) -> Optional[Appointment]:
        return self.db.query(Appointment).filter(Appointment.id == appointment_id).first()

    def update_appointment(self, appointment_id: str, updates: dict) -> Optional[Appointment]:
        appt = self.get_appointment_by_id(appointment_id)
        if not appt:
            return None
        for k, v in updates.items():
            if v is not None:
                setattr(appt, k, v)
        self.db.commit()
        self.db.refresh(appt)
        return appt
