from fastapi import APIRouter, Depends, Query, Header, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.schemas.institution import (
    AdminLoginRequest,
    AdminLoginResponse,
    OverviewMetrics,
    AdoptionFunnel,
    CohortBreakdown,
    SupportAnalytics,
    EngagementMetrics,
    InstitutionalReport
)
from app.services.institution_service import InstitutionService

router = APIRouter(prefix="", tags=["Institutional Analytics"])

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest):
    """Authenticates college administrators or counsellors."""
    return InstitutionService.authenticate_admin(payload.email, payload.password)

@router.get("/overview", response_model=OverviewMetrics)
def get_overview_metrics(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Returns top KPI cards and high-level health metrics. Server-side role authorization enforced."""
    InstitutionService.authorize_admin_token(authorization)
    service = InstitutionService(db)
    return service.get_overview_metrics()

@router.get("/adoption", response_model=AdoptionFunnel)
def get_adoption_funnel(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Returns platform adoption funnel and opt-in percentages."""
    InstitutionService.authorize_admin_token(authorization)
    service = InstitutionService(db)
    return service.get_adoption_funnel()

@router.get("/cohorts", response_model=List[CohortBreakdown])
def get_cohort_breakdowns(
    year: Optional[str] = Query("All", description="Year filter e.g. 1st Year, 2nd Year, All"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Returns year-wise cohort metrics with MIN_AGGREGATION_COUNT = 10 server-side privacy enforcement."""
    InstitutionService.authorize_admin_token(authorization)
    service = InstitutionService(db)
    return service.get_cohort_breakdowns(year_filter=year)

@router.get("/support", response_model=SupportAnalytics)
def get_support_analytics(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Returns counselling demand, utilization rates, and WhatsApp handoff statistics."""
    InstitutionService.authorize_admin_token(authorization)
    service = InstitutionService(db)
    return service.get_support_analytics()

@router.get("/engagement", response_model=EngagementMetrics)
def get_engagement_metrics(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Returns feature adoption breakdown and nudge feedback percentages."""
    InstitutionService.authorize_admin_token(authorization)
    service = InstitutionService(db)
    return service.get_engagement_metrics()

@router.get("/report", response_model=InstitutionalReport)
def get_institutional_report(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Returns executive aggregate program impact report data."""
    InstitutionService.authorize_admin_token(authorization)
    service = InstitutionService(db)
    return service.get_institutional_report()
