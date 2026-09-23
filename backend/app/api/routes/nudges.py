from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from typing import List
from app.db.database import get_db
from app.db.repositories.student_repository import StudentRepository
from app.schemas.nudge import NudgeResponse
from app.services.nudge_service import get_student_nudges_service, generate_contextual_nudge_service

router = APIRouter(prefix="/nudges", tags=["Nudges"])

@router.get("/{student_id}", response_model=List[NudgeResponse])
def get_nudges_route(student_id: str, db: Session = Depends(get_db)):
    """
    GET /api/nudges/{student_id}
    Fetch all contextual nudges for a student.
    """
    student_repo = StudentRepository(db)
    student = student_repo.get_by_id(student_id) or student_repo.get_by_identifier(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student profile '{student_id}' not found."
        )
    return get_student_nudges_service(db, student.id)

@router.post("/{student_id}/generate", response_model=NudgeResponse, status_code=status.HTTP_201_CREATED)
def generate_nudge_route(student_id: str, db: Session = Depends(get_db)):
    """
    POST /api/nudges/{student_id}/generate
    Generate a new contextual nudge for a student based on recent check-ins and risk analysis.
    """
    student_repo = StudentRepository(db)
    student = student_repo.get_by_id(student_id) or student_repo.get_by_identifier(student_id)
    target_id = student.id if student else student_id

    try:
        return generate_contextual_nudge_service(db, target_id)
    except OperationalError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to generate nudge: {str(e)}"
        )
