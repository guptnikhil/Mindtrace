from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.student import Student
from app.models.signal import BehaviorSignal
from app.services.indicator_service import update_or_create_baseline, evaluate_routine_trend

router = APIRouter(prefix="/demo", tags=["Demo Mode"])

# Deterministic 21-day behavioral signal series for Student "Riya"
BASELINE_SERIES = [
    {"late_night": 32.0, "delay": 1.0, "library": 3.5, "variance": 1.0},
    {"late_night": 38.0, "delay": 1.3, "library": 3.8, "variance": 1.1},
    {"late_night": 35.0, "delay": 1.1, "library": 3.2, "variance": 0.9},
    {"late_night": 40.0, "delay": 1.4, "library": 3.6, "variance": 1.2},
    {"late_night": 34.0, "delay": 1.2, "library": 3.4, "variance": 1.0},
    {"late_night": 36.0, "delay": 1.0, "library": 3.7, "variance": 1.1},
    {"late_night": 33.0, "delay": 1.3, "library": 3.5, "variance": 1.0},
    {"late_night": 37.0, "delay": 1.2, "library": 3.3, "variance": 0.9},
    {"late_night": 35.0, "delay": 1.1, "library": 3.6, "variance": 1.1},
    {"late_night": 36.0, "delay": 1.2, "library": 3.4, "variance": 1.0},
    {"late_night": 34.0, "delay": 1.1, "library": 3.5, "variance": 1.0},
]

RECENT_SERIES = {
    "stable": [
        {"late_night": 35.0, "delay": 1.2, "library": 3.4, "variance": 1.0},
        {"late_night": 33.0, "delay": 1.1, "library": 3.6, "variance": 0.9},
        {"late_night": 37.0, "delay": 1.3, "library": 3.5, "variance": 1.1},
        {"late_night": 34.0, "delay": 1.0, "library": 3.7, "variance": 1.0},
        {"late_night": 36.0, "delay": 1.2, "library": 3.4, "variance": 1.0},
        {"late_night": 35.0, "delay": 1.1, "library": 3.5, "variance": 1.1},
        {"late_night": 33.0, "delay": 1.3, "library": 3.6, "variance": 0.9},
        {"late_night": 38.0, "delay": 1.2, "library": 3.3, "variance": 1.0},
        {"late_night": 34.0, "delay": 1.1, "library": 3.5, "variance": 1.1},
        {"late_night": 36.0, "delay": 1.2, "library": 3.6, "variance": 1.0},
    ],
    "changing": [
        {"late_night": 45.0, "delay": 1.6, "library": 3.1, "variance": 1.2},
        {"late_night": 48.0, "delay": 1.8, "library": 2.9, "variance": 1.3},
        {"late_night": 52.0, "delay": 2.1, "library": 2.7, "variance": 1.4},
        {"late_night": 55.0, "delay": 2.3, "library": 2.5, "variance": 1.5},
        {"late_night": 58.0, "delay": 2.5, "library": 2.3, "variance": 1.6},
        {"late_night": 60.0, "delay": 2.7, "library": 2.1, "variance": 1.7},
        {"late_night": 62.0, "delay": 2.9, "library": 1.9, "variance": 1.8},
        {"late_night": 65.0, "delay": 3.1, "library": 1.8, "variance": 1.8},
        {"late_night": 68.0, "delay": 3.3, "library": 1.7, "variance": 1.9},
        {"late_night": 70.0, "delay": 3.5, "library": 1.6, "variance": 2.0},
    ],
    "needs_attention": [
        {"late_night": 60.0, "delay": 2.8, "library": 2.2, "variance": 1.6},
        {"late_night": 65.0, "delay": 3.2, "library": 1.9, "variance": 1.8},
        {"late_night": 72.0, "delay": 3.7, "library": 1.6, "variance": 2.0},
        {"late_night": 78.0, "delay": 4.2, "library": 1.3, "variance": 2.2},
        {"late_night": 84.0, "delay": 4.8, "library": 1.0, "variance": 2.4},
        {"late_night": 88.0, "delay": 5.2, "library": 0.8, "variance": 2.5},
        {"late_night": 92.0, "delay": 5.7, "library": 0.6, "variance": 2.6},
        {"late_night": 96.0, "delay": 6.1, "library": 0.5, "variance": 2.7},
        {"late_night": 100.0, "delay": 6.5, "library": 0.4, "variance": 2.8},
        {"late_night": 105.0, "delay": 7.0, "library": 0.3, "variance": 2.9},
    ]
}

@router.post("/seed")
def seed_demo_data(
    state: str = Query("changing", pattern="^(stable|changing|needs_attention)$"),
    db: Session = Depends(get_db)
):
    """Seed 21 days of deterministic simulated behavioral signals for hackathon demonstration."""
    student = db.query(Student).first()
    if not student:
        student = Student(name="Riya", tone="balanced", consent_given=True, onboarding_complete=True)
        db.add(student)
        db.commit()
        db.refresh(student)
        
    # Clear existing signals
    db.query(BehaviorSignal).filter(BehaviorSignal.student_id == student.id).delete()
    db.commit()
    
    today = datetime.now(timezone.utc).date()
    signals = []
    
    # 1. Baseline Days (Days -20 to -10)
    for idx, item in enumerate(BASELINE_SERIES):
        d = today - timedelta(days=20 - idx)
        signals.append(BehaviorSignal(
            student_id=student.id,
            date=d.isoformat(),
            late_night_activity_minutes=item["late_night"],
            assignment_delay_hours=item["delay"],
            library_checkins=item["library"],
            routine_variance=item["variance"]
        ))
        
    # 2. Recent Days (Days -9 to 0) based on selected scenario
    recent_items = RECENT_SERIES.get(state, RECENT_SERIES["changing"])
    for idx, item in enumerate(recent_items):
        d = today - timedelta(days=9 - idx)
        signals.append(BehaviorSignal(
            student_id=student.id,
            date=d.isoformat(),
            late_night_activity_minutes=item["late_night"],
            assignment_delay_hours=item["delay"],
            library_checkins=item["library"],
            routine_variance=item["variance"]
        ))
        
    db.add_all(signals)
    db.commit()
    
    # Update baseline and compute trend
    all_signals = db.query(BehaviorSignal).filter(BehaviorSignal.student_id == student.id).order_by(BehaviorSignal.date.asc()).all()
    baseline = update_or_create_baseline(db, student.id, all_signals)
    trend = evaluate_routine_trend(all_signals, baseline)
    
    return {
        "status": "success",
        "demo_state": state,
        "student_name": student.name,
        "signals_count": len(all_signals),
        "computed_trend": trend
    }

@router.post("/reset")
def reset_demo_data(db: Session = Depends(get_db)):
    """Reset demo data deterministically to initial state ('changing')."""
    return seed_demo_data(state="changing", db=db)
