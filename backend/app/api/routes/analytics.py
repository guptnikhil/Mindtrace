from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.student import Student
from app.models.checkin import Checkin
from app.models.wellbeing import WellbeingAssessment

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    """Provides high-level aggregated analytics for institutional wellbeing oversight."""
    total_students = db.query(Student).count()
    total_checkins = db.query(Checkin).count()
    
    assessments = db.query(WellbeingAssessment).all()
    risk_distribution = {
        "low": sum(1 for r in assessments if r.risk_level == "low"),
        "moderate": sum(1 for r in assessments if r.risk_level == "moderate"),
        "high": sum(1 for r in assessments if r.risk_level == "high")
    }
    
    return {
        "total_students": total_students,
        "total_checkins": total_checkins,
        "risk_distribution": risk_distribution
    }
