from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any

class AdminLoginRequest(BaseModel):
    email: str = Field(..., description="Institutional admin email")
    password: str = Field(..., description="Password")

class AdminLoginResponse(BaseModel):
    access_token: str
    role: str = Field(..., description="Role e.g. COLLEGE_ADMIN or COUNSELLOR")
    name: str
    institution_name: str

class OverviewMetrics(BaseModel):
    eligible_students: int
    opted_in_students: int
    active_students: int
    counselling_requests: int
    completed_sessions: int
    nudge_engagement_rate: float
    demo_mode: bool = True
    institution_name: str = "RKGIT — Demo Institution"

class AdoptionFunnel(BaseModel):
    eligible: int
    opted_in: int
    onboarded: int
    active_monthly: int
    active_weekly: int
    opt_in_rate: float
    onboarding_completion_rate: float

class CohortBreakdown(BaseModel):
    year: str
    opted_in_count: int
    active_count: int
    counselling_requests: int
    privacy_masked: bool = False
    message: Optional[str] = None

class SupportAnalytics(BaseModel):
    total_requests: int
    confirmed: int
    completed: int
    cancelled: int
    whatsapp_handoffs: int
    reminder_confirmations: int
    utilization_rate: float

class EngagementMetrics(BaseModel):
    feature_usage: Dict[str, float]
    nudge_feedback: Dict[str, float]

class InstitutionalReport(BaseModel):
    institution_name: str
    report_date: str
    eligible_population: int
    opt_in_rate: float
    active_monthly: int
    counselling_utilization: float
    top_student_concerns: List[Dict[str, Any]]
    nudge_helpfulness_rate: float
    privacy_declaration: str
