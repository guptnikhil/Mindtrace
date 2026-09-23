from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.nudge import Nudge

class NudgeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        student_id: str,
        category: str,
        title: str,
        message: str,
        priority: str = "medium"
    ) -> Nudge:
        nudge = Nudge(
            student_id=student_id,
            category=category,
            title=title,
            message=message,
            priority=priority
        )
        self.db.add(nudge)
        self.db.commit()
        self.db.refresh(nudge)
        return nudge

    def get_by_student_id(self, student_id: str, limit: int = 50) -> List[Nudge]:
        return (
            self.db.query(Nudge)
            .filter(Nudge.student_id == student_id)
            .order_by(Nudge.created_at.desc())
            .limit(limit)
            .all()
        )

    def mark_completed(self, nudge_id: str) -> Optional[Nudge]:
        nudge = self.db.query(Nudge).filter(Nudge.id == nudge_id).first()
        if nudge:
            nudge.completed_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(nudge)
        return nudge
