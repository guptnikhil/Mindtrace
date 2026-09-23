from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.student import Student
from app.schemas.student import OnboardRequest, StudentResponse, PreferencesUpdate

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/onboard", response_model=StudentResponse)
def onboard_student(req: OnboardRequest, db: Session = Depends(get_db)):
    """Create or update a student profile with consent and tone preference."""
    # For single-user / demo flow, check if a student exists or create new
    student = db.query(Student).first()
    if not student:
        student = Student(
            name=req.name,
            tone=req.tone,
            consent_given=req.consent_given,
            onboarding_complete=True
        )
        db.add(student)
    else:
        student.name = req.name
        student.tone = req.tone
        student.consent_given = req.consent_given
        student.onboarding_complete = True

    db.commit()
    db.refresh(student)
    return student

@router.get("/me", response_model=StudentResponse)
def get_current_student(db: Session = Depends(get_db)):
    """Fetch current student details."""
    student = db.query(Student).first()
    if not student:
        # Create default demo student profile if none exists
        student = Student(name="Riya", tone="balanced", consent_given=True, onboarding_complete=False)
        db.add(student)
        db.commit()
        db.refresh(student)
    return student

@router.put("/preferences", response_model=StudentResponse)
def update_preferences(req: PreferencesUpdate, db: Session = Depends(get_db)):
    """Update student tone or consent preferences."""
    student = db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    if req.tone is not None:
        student.tone = req.tone
    if req.consent_given is not None:
        student.consent_given = req.consent_given
        
    db.commit()
    db.refresh(student)
    return student

@router.delete("/data")
def delete_student_data(db: Session = Depends(get_db)):
    """Permanently delete student profile, signals, and logs."""
    student = db.query(Student).first()
    if student:
        db.delete(student)
        db.commit()
    return {"status": "success", "message": "All student data permanently deleted."}
