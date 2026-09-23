from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from app.db.database import get_db
from app.db.repositories.student_repository import StudentRepository
from app.schemas.wellbeing import AnalyzeRequest, AnalyzeResponse
from app.services.wellbeing_service import analyze_and_store_assessment

router = APIRouter(prefix="/wellbeing", tags=["Wellbeing & Assessment"])

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_wellbeing_route(req: AnalyzeRequest, db: Session = Depends(get_db)):
    """
    POST /api/wellbeing/analyze
    Analyzes student check-in/wellbeing inputs, runs deterministic risk scoring,
    stores assessment in Supabase DB, and returns structured result.
    """
    student_repo = StudentRepository(db)
    student = student_repo.get_by_id(req.student_id) or student_repo.get_by_identifier(req.student_id)
    target_id = student.id if student else req.student_id

    try:
        assessment = analyze_and_store_assessment(
            db=db,
            student_id=target_id,
            mood=req.mood,
            energy_level=req.energy_level,
            stress_level=req.stress_level,
            sleep_hours=req.sleep_hours,
            academic_pressure=req.academic_pressure
        )
        return assessment
    except OperationalError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to calculate risk analysis: {str(e)}"
        )
