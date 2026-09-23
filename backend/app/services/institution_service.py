import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, Header

from app.models.student import Student
from app.models.checkin import Checkin
from app.models.counselling import Appointment
from app.models.nudge import Nudge

logger = logging.getLogger(__name__)

MIN_AGGREGATION_COUNT = 10

DEMO_ADMINS = {
    "admin@rkgit.edu": {
        "password": "admin123",
        "role": "COLLEGE_ADMIN",
        "name": "Dr. A. K. Verma (Dean of Student Affairs)",
        "institution_name": "RKGIT — Demo Institution",
        "token": "token_admin_rkgit_college_admin_9921"
    },
    "counsellor@rkgit.edu": {
        "password": "counsellor123",
        "role": "COUNSELLOR",
        "name": "Dr. Mehta (College Counsellor)",
        "institution_name": "RKGIT — Demo Institution",
        "token": "token_counsellor_rkgit_counsellor_8812"
    }
}

class InstitutionService:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def authenticate_admin(email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        if email_clean in DEMO_ADMINS and DEMO_ADMINS[email_clean]["password"] == password:
            user = DEMO_ADMINS[email_clean]
            return {
                "access_token": user["token"],
                "role": user["role"],
                "name": user["name"],
                "institution_name": user["institution_name"]
            }
        raise HTTPException(status_code=401, detail="Invalid institutional admin credentials.")

    @staticmethod
    def authorize_admin_token(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
        """Validates that token belongs to a COLLEGE_ADMIN or COUNSELLOR. Rejects student tokens with 403."""
        if not authorization:
            raise HTTPException(status_code=401, detail="Institutional authorization token required.")

        token = authorization.replace("Bearer ", "").strip()
        for user_email, data in DEMO_ADMINS.items():
            if data["token"] == token:
                return data

        # Explicitly reject student or unauthorized tokens with 403 Forbidden
        raise HTTPException(
            status_code=403,
            detail="Access denied. Institutional administrator privileges required."
        )

    def get_overview_metrics(self) -> Dict[str, Any]:
        total_in_db = self.db.query(Student).count()
        # Scale to realistic college numbers for hackathon demo
        eligible_students = 1240
        opted_in_students = max(682, total_in_db + 680)
        active_students = max(541, total_in_db + 538)
        
        counselling_requests = self.db.query(Appointment).count() + 86
        completed_sessions = self.db.query(Appointment).filter(Appointment.status == "completed").count() + 72
        
        nudges_total = self.db.query(Nudge).count() + 150
        nudge_engagement_rate = 64.2 if nudges_total > 0 else 0.0

        return {
            "eligible_students": eligible_students,
            "opted_in_students": opted_in_students,
            "active_students": active_students,
            "counselling_requests": counselling_requests,
            "completed_sessions": completed_sessions,
            "nudge_engagement_rate": nudge_engagement_rate,
            "demo_mode": True,
            "institution_name": "RKGIT — Demo Institution"
        }

    def get_adoption_funnel(self) -> Dict[str, Any]:
        eligible = 1240
        opted_in = 682
        onboarded = 654
        active_monthly = 541
        active_weekly = 388

        opt_in_rate = round((opted_in / eligible) * 100, 1)
        onboarding_completion_rate = round((onboarded / opted_in) * 100, 1)

        return {
            "eligible": eligible,
            "opted_in": opted_in,
            "onboarded": onboarded,
            "active_monthly": active_monthly,
            "active_weekly": active_weekly,
            "opt_in_rate": opt_in_rate,
            "onboarding_completion_rate": onboarding_completion_rate
        }

    def get_cohort_breakdowns(self, year_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Enforces MIN_AGGREGATION_COUNT = 10 server-side.
        If a cohort contains <10 students, returns privacy_masked=True.
        """
        raw_cohorts = [
            {"year": "1st Year", "opted_in_count": 210, "active_count": 182, "counselling_requests": 24},
            {"year": "2nd Year", "opted_in_count": 195, "active_count": 154, "counselling_requests": 31},
            {"year": "3rd Year", "opted_in_count": 178, "active_count": 139, "counselling_requests": 22},
            {"year": "4th Year", "opted_in_count": 94, "active_count": 66, "counselling_requests": 9},
            {"year": "Specialized M.Tech", "opted_in_count": 6, "active_count": 4, "counselling_requests": 1}, # < 10 threshold test
        ]

        if year_filter and year_filter != "All":
            raw_cohorts = [c for c in raw_cohorts if c["year"] == year_filter]

        processed = []
        for cohort in raw_cohorts:
            if cohort["opted_in_count"] < MIN_AGGREGATION_COUNT:
                processed.append({
                    "year": cohort["year"],
                    "opted_in_count": 0,
                    "active_count": 0,
                    "counselling_requests": 0,
                    "privacy_masked": True,
                    "message": f"Not enough students in this group to display this insight. (Minimum {MIN_AGGREGATION_COUNT} students required for privacy protection)"
                })
            else:
                processed.append({
                    "year": cohort["year"],
                    "opted_in_count": cohort["opted_in_count"],
                    "active_count": cohort["active_count"],
                    "counselling_requests": cohort["counselling_requests"],
                    "privacy_masked": False,
                    "message": None
                })

        return processed

    def get_support_analytics(self) -> Dict[str, Any]:
        total_db_appts = self.db.query(Appointment).count()
        total_requests = total_db_appts + 86
        confirmed = 48
        completed = 32
        cancelled = 6
        whatsapp_handoffs = 74
        reminder_confirmations = 68
        utilization_rate = round((confirmed + completed) / max(1, total_requests) * 100, 1)

        return {
            "total_requests": total_requests,
            "confirmed": confirmed,
            "completed": completed,
            "cancelled": cancelled,
            "whatsapp_handoffs": whatsapp_handoffs,
            "reminder_confirmations": reminder_confirmations,
            "utilization_rate": utilization_rate
        }

    def get_engagement_metrics(self) -> Dict[str, Any]:
        return {
            "feature_usage": {
                "Pattern Timeline": 52.4,
                "Daily Check-ins": 44.1,
                "Calm Companion": 28.6,
                "Counsellor Connect": 14.2
            },
            "nudge_feedback": {
                "Helpful": 64.0,
                "Not helpful": 21.0,
                "No response": 15.0
            }
        }

    def get_institutional_report(self) -> Dict[str, Any]:
        return {
            "institution_name": "RKGIT — Demo Institution",
            "report_date": datetime.now(timezone.utc).strftime("%B %Y"),
            "eligible_population": 1240,
            "opt_in_rate": 55.0,
            "active_monthly": 541,
            "counselling_utilization": 93.0,
            "top_student_concerns": [
                {"concern": "Sleep / Routine Consistency", "percentage": 31.0},
                {"concern": "Assignment & Exam Deadlines", "percentage": 24.0},
                {"concern": "Study Consistency", "percentage": 18.0},
                {"concern": "Placement & Career Preparation", "percentage": 15.0},
                {"concern": "Project & Lab Workload", "percentage": 12.0}
            ],
            "nudge_helpfulness_rate": 64.0,
            "privacy_declaration": (
                "This report contains strictly aggregated data from students who voluntarily opted into MindTrace. "
                "Minimum aggregation thresholds (MIN_COUNT=10) were enforced server-side. No individual student identity, "
                "burnout score, or private chat transcript is contained herein."
            )
        }
