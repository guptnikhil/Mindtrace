from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.checkin import Checkin

class CheckinRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        student_id: str,
        mood: int,
        energy_level: int,
        stress_level: int,
        sleep_hours: float,
        academic_pressure: int,
        optional_note: Optional[str] = None
    ) -> Checkin:
        checkin = Checkin(
            student_id=student_id,
            mood=mood,
            energy_level=energy_level,
            stress_level=stress_level,
            sleep_hours=sleep_hours,
            academic_pressure=academic_pressure,
            optional_note=optional_note
        )
        self.db.add(checkin)
        self.db.commit()
        self.db.refresh(checkin)
        return checkin

    def get_by_student_id(self, student_id: str, limit: int = 50) -> List[Checkin]:
        return (
            self.db.query(Checkin)
            .filter(Checkin.student_id == student_id)
            .order_by(Checkin.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_latest_by_student_id(self, student_id: str) -> Optional[Checkin]:
        return (
            self.db.query(Checkin)
            .filter(Checkin.student_id == student_id)
            .order_by(Checkin.created_at.desc())
            .first()
        )
