from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.student import Student
from app.models.signal import BehaviorSignal, StudentBaseline
from app.schemas.signal import BehaviorSignalCreate, BehaviorSignalResponse, TrendResponse
from app.services.indicator_service import evaluate_routine_trend, update_or_create_baseline

router = APIRouter(prefix="/signals", tags=["Behavior Signals"])

@router.post("", response_model=BehaviorSignalResponse)
def log_signal(req: BehaviorSignalCreate, db: Session = Depends(get_db)):
    """Log a daily behavior signal."""
    student = db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found. Please onboard first.")
        
    signal = BehaviorSignal(
        student_id=student.id,
        date=req.date,
        late_night_activity_minutes=req.late_night_activity_minutes,
        assignment_delay_hours=req.assignment_delay_hours,
        library_checkins=req.library_checkins,
        routine_variance=req.routine_variance
    )
    db.add(signal)
    db.commit()
    db.refresh(signal)
    
    # Recalculate baseline
    all_signals = db.query(BehaviorSignal).filter(BehaviorSignal.student_id == student.id).order_by(BehaviorSignal.date.asc()).all()
    update_or_create_baseline(db, student.id, all_signals)
    
    return signal

@router.get("/history", response_model=List[BehaviorSignalResponse])
def get_signal_history(db: Session = Depends(get_db)):
    """Fetch history of behavioral signals."""
    student = db.query(Student).first()
    if not student:
        return []
        
    signals = db.query(BehaviorSignal).filter(BehaviorSignal.student_id == student.id).order_by(BehaviorSignal.date.asc()).all()
    return signals

@router.get("/trend", response_model=TrendResponse)
def get_routine_trend(db: Session = Depends(get_db)):
    """
    Evaluates current routine trend vs baseline.
    Explicitly an early-warning indicator monitor, NOT a clinical diagnosis.
    """
    student = db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")
        
    signals = db.query(BehaviorSignal).filter(BehaviorSignal.student_id == student.id).order_by(BehaviorSignal.date.asc()).all()
    baseline = db.query(StudentBaseline).filter(StudentBaseline.student_id == student.id).first()
    
    if not baseline:
        baseline = update_or_create_baseline(db, student.id, signals)
        
    trend_result = evaluate_routine_trend(signals, baseline)
    trend_result["baseline"] = baseline
    return trend_result
