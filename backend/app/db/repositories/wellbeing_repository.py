from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.wellbeing import WellbeingAssessment

class WellbeingRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_assessment(
        self,
        student_id: str,
        risk_score: float,
        risk_level: str,
        contributing_factors: List[str],
        recommendations: List[str],
        explanation: str
    ) -> WellbeingAssessment:
        assessment = WellbeingAssessment(
            student_id=student_id,
            risk_score=risk_score,
            risk_level=risk_level,
            contributing_factors=contributing_factors,
            recommendations=recommendations
        )
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    def get_latest_by_student_id(self, student_id: str) -> Optional[WellbeingAssessment]:
        return (
            self.db.query(WellbeingAssessment)
            .filter(WellbeingAssessment.student_id == student_id)
            .order_by(WellbeingAssessment.created_at.desc())
            .first()
        )

    def get_by_student_id(self, student_id: str, limit: int = 50) -> List[WellbeingAssessment]:
        return (
            self.db.query(WellbeingAssessment)
            .filter(WellbeingAssessment.student_id == student_id)
            .order_by(WellbeingAssessment.created_at.desc())
            .limit(limit)
            .all()
        )
