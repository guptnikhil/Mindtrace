from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.db.repositories.student_repository import StudentRepository
from app.db.repositories.checkin_repository import CheckinRepository
from app.db.repositories.wellbeing_repository import WellbeingRepository
from app.schemas.checkin import CheckinCreate
from app.models.checkin import Checkin
from app.models.wellbeing import WellbeingAssessment
from app.services.risk_service import analyze_wellbeing_risk
from app.core.security import sanitize_text

def submit_checkin_service(db: Session, req: CheckinCreate) -> Checkin:
    """Service handling check-in submission via repository abstraction."""
    student_repo = StudentRepository(db)
    checkin_repo = CheckinRepository(db)

    student = student_repo.get_by_id(req.student_id) or student_repo.get_by_identifier(req.student_id)
    if not student:
        # Create student record if missing
        name = "Riya Sharma" if "riya" in req.student_id.lower() else "Student"
        student = student_repo.create(
            student_identifier=req.student_id,
            name=name
        )

    sanitized_note = sanitize_text(req.optional_note) if req.optional_note else None

    return checkin_repo.create(
        student_id=student.id,
        mood=req.mood,
        energy_level=req.energy_level,
        stress_level=req.stress_level,
        sleep_hours=req.sleep_hours,
        academic_pressure=req.academic_pressure,
        optional_note=sanitized_note
    )

def analyze_and_store_assessment(
    db: Session,
    student_id: str,
    mood: Optional[int] = None,
    energy_level: Optional[int] = None,
    stress_level: Optional[int] = None,
    sleep_hours: Optional[float] = None,
    academic_pressure: Optional[int] = None
) -> WellbeingAssessment:
    """Runs risk analysis using recent check-in or parameters and stores assessment in DB."""
    student_repo = StudentRepository(db)
    checkin_repo = CheckinRepository(db)
    wellbeing_repo = WellbeingRepository(db)

    student = student_repo.get_by_id(student_id) or student_repo.get_by_identifier(student_id)
    target_student_id = student.id if student else student_id
    latest_checkin = checkin_repo.get_latest_by_student_id(target_student_id) if student else None

    final_mood = mood if mood is not None else (latest_checkin.mood if latest_checkin else 3)
    final_energy = energy_level if energy_level is not None else (latest_checkin.energy_level if latest_checkin else 3)
    final_stress = stress_level if stress_level is not None else (latest_checkin.stress_level if latest_checkin else 2)
    final_sleep = sleep_hours if sleep_hours is not None else (latest_checkin.sleep_hours if latest_checkin else 7.0)
    final_academic = academic_pressure if academic_pressure is not None else (latest_checkin.academic_pressure if latest_checkin else 3)

    analysis = analyze_wellbeing_risk(
        mood=final_mood,
        energy_level=final_energy,
        stress_level=final_stress,
        sleep_hours=final_sleep,
        academic_pressure=final_academic
    )

    if not student:
        student = student_repo.create(student_identifier=student_id, name="Student")

    return wellbeing_repo.create_assessment(
        student_id=student.id,
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"],
        contributing_factors=analysis["contributing_factors"],
        recommendations=analysis["recommendations"],
        explanation=analysis["explanation"]
    )
