from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from typing import List
from app.db.database import get_db
from app.db.repositories.checkin_repository import CheckinRepository
from app.db.repositories.student_repository import StudentRepository
from app.schemas.checkin import CheckinCreate, CheckinResponse
from app.services.wellbeing_service import submit_checkin_service

router = APIRouter(prefix="/checkins", tags=["Check-ins"])

@router.post("", response_model=CheckinResponse, status_code=status.HTTP_201_CREATED)
def submit_checkin_route(req: CheckinCreate, db: Session = Depends(get_db)):
    """
    POST /api/checkins
    Submit a check-in with mood, energy_level, stress_level, sleep_hours, academic_pressure, and optional_note.
    """
    try:
        return submit_checkin_service(db, req)
    except OperationalError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process check-in: {str(e)}"
        )

@router.get("/{student_id}", response_model=List[CheckinResponse])
def get_student_checkins_route(student_id: str, db: Session = Depends(get_db)):
    """
    GET /api/checkins/{student_id}
    Retrieve all check-ins for a student.
    """
    student_repo = StudentRepository(db)
    student = student_repo.get_by_id(student_id) or student_repo.get_by_identifier(student_id)
    if not student:
        return []
        
    checkin_repo = CheckinRepository(db)
    return checkin_repo.get_by_student_id(student.id)
