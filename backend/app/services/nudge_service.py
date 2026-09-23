from typing import List
from sqlalchemy.orm import Session
from app.db.repositories.nudge_repository import NudgeRepository
from app.db.repositories.student_repository import StudentRepository
from app.db.repositories.checkin_repository import CheckinRepository
from app.models.nudge import Nudge
from app.services.risk_service import analyze_wellbeing_risk

CONTEXTUAL_NUDGES = {
    "low": {
        "category": "hydration",
        "title": "A steady moment",
        "message": "Your routine looks fairly consistent. Remember to stay hydrated and take brief regular breaks.",
        "priority": "low"
    },
    "moderate": {
        "category": "workload",
        "title": "Noticing a routine shift",
        "message": "Your recent check-in shows higher stress or less sleep. Consider trying a 25-minute focus session followed by a short break.",
        "priority": "medium"
    },
    "high": {
        "category": "support",
        "title": "A moment to pause & connect",
        "message": "Your routine has been running harder lately. Consider reaching out to a trusted mentor or campus student support counselor.",
        "priority": "high"
    }
}

def get_student_nudges_service(db: Session, student_id: str) -> List[Nudge]:
    repo = NudgeRepository(db)
    return repo.get_by_student_id(student_id)

def generate_contextual_nudge_service(db: Session, student_id: str) -> Nudge:
    student_repo = StudentRepository(db)
    checkin_repo = CheckinRepository(db)
    nudge_repo = NudgeRepository(db)

    student = student_repo.get_by_id(student_id)
    if not student:
        student = student_repo.create(student_identifier=student_id, name="Student")

    latest_checkin = checkin_repo.get_latest_by_student_id(student.id)

    analysis = analyze_wellbeing_risk(
        mood=latest_checkin.mood if latest_checkin else 3,
        energy_level=latest_checkin.energy_level if latest_checkin else 3,
        stress_level=latest_checkin.stress_level if latest_checkin else 2,
        sleep_hours=latest_checkin.sleep_hours if latest_checkin else 7.0,
        academic_pressure=latest_checkin.academic_pressure if latest_checkin else 3
    )

    concern_level = analysis["risk_level"]
    config = CONTEXTUAL_NUDGES.get(concern_level, CONTEXTUAL_NUDGES["moderate"])

    return nudge_repo.create(
        student_id=student.id,
        category=config["category"],
        title=config["title"],
        message=config["message"],
        priority=config["priority"]
    )
