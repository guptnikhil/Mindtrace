from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.student import Student
from app.models.checkin import Checkin
from app.schemas.ai import AISummaryRequest, AISummaryResponse
from app.services.ai_service import generate_student_summary

router = APIRouter(prefix="/ai", tags=["AI Integration"])

@router.post("/summary", response_model=AISummaryResponse)
async def get_ai_student_summary(req: AISummaryRequest, db: Session = Depends(get_db)):
    """
    Generates a personalized non-diagnostic AI summary of student wellbeing patterns.
    AI keys remain strictly server-side.
    """
    student = db.query(Student).filter(Student.id == req.student_id).first()
    student_name = student.name if student else "Student"
    
    checkins = db.query(Checkin).filter(Checkin.student_id == req.student_id).order_by(Checkin.created_at.desc()).limit(10).all()
    history_data = [
        {
            "mood": c.mood,
            "energy": c.energy_level,
            "stress": c.stress_level,
            "sleep": c.sleep_hours,
            "academic_pressure": c.academic_pressure,
            "date": c.created_at.isoformat() if c.created_at else ""
        }
        for c in checkins
    ]
    
    result = await generate_student_summary(
        student_id=req.student_id,
        student_name=student_name,
        history_data=history_data
    )
    
    return AISummaryResponse(
        student_id=req.student_id,
        summary=result.get("summary", "Routine trends remain stable."),
        key_observations=result.get("key_observations", ["Active check-ins"]),
        suggested_focus=result.get("suggested_focus", "Maintain sleep schedule.")
    )
