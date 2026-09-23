from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.student import Student
from app.models.signal import BehaviorSignal, StudentBaseline
from app.models.nudge import NudgeLog
from app.schemas.nudge import NudgeResponse, NudgeFeedbackRequest
from app.services.indicator_service import evaluate_routine_trend, update_or_create_baseline
from app.services.ai_service import generate_wellbeing_nudge

router = APIRouter(prefix="/nudges", tags=["Wellbeing Nudges"])

@router.post("/generate", response_model=NudgeResponse)
async def generate_nudge(db: Session = Depends(get_db)):
    """
    Calls backend AI service (Gemini) to generate a personalized, tone-matched
    early-warning nudge based on student routine trends.
    """
    student = db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")
        
    signals = db.query(BehaviorSignal).filter(BehaviorSignal.student_id == student.id).order_by(BehaviorSignal.date.asc()).all()
    baseline = db.query(StudentBaseline).filter(StudentBaseline.student_id == student.id).first()
    
    if not baseline:
        baseline = update_or_create_baseline(db, student.id, signals)
        
    trend_data = evaluate_routine_trend(signals, baseline)
    trend_state = trend_data["state"]
    
    nudge_content = await generate_wellbeing_nudge(
        trend_state=trend_state,
        tone=student.tone,
        student_name=student.name,
        factors=trend_data["factors"]
    )
    
    nudge_log = NudgeLog(
        student_id=student.id,
        title=nudge_content["title"],
        body=nudge_content["body"],
        action_label=nudge_content["action_label"],
        trend_state=trend_state
    )
    db.add(nudge_log)
    db.commit()
    db.refresh(nudge_log)
    
    return nudge_log

@router.post("/feedback")
def submit_nudge_feedback(req: NudgeFeedbackRequest, db: Session = Depends(get_db)):
    """Record student feedback on a nudge."""
    nudge = db.query(NudgeLog).filter(NudgeLog.id == req.nudge_id).first()
    if not nudge:
        raise HTTPException(status_code=404, detail="Nudge log not found.")
        
    nudge.helpful = req.helpful
    db.commit()
    return {"status": "success", "helpful": req.helpful}
