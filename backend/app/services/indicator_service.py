from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.signal import BehaviorSignal, StudentBaseline

def calculate_student_baseline(signals: List[BehaviorSignal]) -> Dict[str, float]:
    """Calculate 14-day baseline averages from student signals."""
    if not signals:
        return {
            "avg_late_night_activity": 35.0,
            "avg_assignment_delay": 1.2,
            "avg_library_checkins": 3.5,
            "avg_routine_variance": 1.0,
        }
    
    sample = signals[:14] if len(signals) >= 14 else signals
    count = len(sample)
    
    return {
        "avg_late_night_activity": sum(s.late_night_activity_minutes for s in sample) / count,
        "avg_assignment_delay": sum(s.assignment_delay_hours for s in sample) / count,
        "avg_library_checkins": sum(s.library_checkins for s in sample) / count,
        "avg_routine_variance": sum(s.routine_variance for s in sample) / count,
    }

def update_or_create_baseline(db: Session, student_id: str, signals: List[BehaviorSignal]) -> StudentBaseline:
    baseline_data = calculate_student_baseline(signals)
    baseline = db.query(StudentBaseline).filter(StudentBaseline.student_id == student_id).first()
    
    if not baseline:
        baseline = StudentBaseline(student_id=student_id, **baseline_data)
        db.add(baseline)
    else:
        for k, v in baseline_data.items():
            setattr(baseline, k, v)
        baseline.updated_at = datetime.now(timezone.utc)
        
    db.commit()
    db.refresh(baseline)
    return baseline

def evaluate_routine_trend(signals: List[BehaviorSignal], baseline: StudentBaseline) -> Dict[str, Any]:
    """
    Evaluates routine change indicators strictly as an early-warning pattern monitor,
    NOT as a diagnostic tool or medical predictor.
    """
    if not signals or len(signals) < 7:
        return {
            "state": "stable",
            "score": 1.0,
            "percentage_change": 0,
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "factors": []
        }
        
    recent = signals[-7:]
    count = len(recent)
    
    recent_late_night = sum(s.late_night_activity_minutes for s in recent) / count
    recent_delay = sum(s.assignment_delay_hours for s in recent) / count
    recent_library = sum(s.library_checkins for s in recent) / count
    recent_variance = sum(s.routine_variance for s in recent) / count
    
    base_late = baseline.avg_late_night_activity or 35.0
    base_delay = baseline.avg_assignment_delay or 1.2
    base_library = baseline.avg_library_checkins or 3.5
    base_variance = baseline.avg_routine_variance or 1.0
    
    dev_late = recent_late_night / base_late if base_late > 0 else 1.0
    dev_delay = recent_delay / base_delay if base_delay > 0 else 1.0
    dev_library = base_library / recent_library if recent_library > 0 else 1.0
    dev_variance = recent_variance / base_variance if base_variance > 0 else 1.0
    
    score = (
        0.35 * dev_late +
        0.30 * dev_delay +
        0.20 * dev_library +
        0.15 * dev_variance
    )
    
    if score < 1.15:
        state = "stable"
    elif score < 1.45:
        state = "changing"
    else:
        state = "needs_attention"
        
    percentage_change = int(round((score - 1.0) * 100))
    
    factors = [
        {
            "name": "Late nights",
            "status": "Higher than usual" if dev_late > 1.15 else "Usual pattern",
            "detail": f"{int(round(recent_late_night))} min avg (baseline: {int(round(base_late))} min)",
            "icon": "Clock3"
        },
        {
            "name": "Assignment timing",
            "status": "More delayed" if dev_delay > 1.15 else "Usual pattern",
            "detail": f"{recent_delay:.1f}h avg delay (baseline: {base_delay:.1f}h)",
            "icon": "BookOpen"
        },
        {
            "name": "Campus activity",
            "status": "Less frequent" if dev_library < 0.85 else "Usual pattern",
            "detail": f"{recent_library:.1f} visits / wk (baseline: {base_library:.1f})",
            "icon": "UsersRound"
        },
        {
            "name": "Routine consistency",
            "status": "More variable" if dev_variance > 1.15 else "Usual pattern",
            "detail": f"{dev_variance:.1f}x variance relative to routine",
            "icon": "Activity"
        }
    ]
    
    return {
        "state": state,
        "score": round(score, 2),
        "percentage_change": max(0, percentage_change),
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "factors": factors
    }
