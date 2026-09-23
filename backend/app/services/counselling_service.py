from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.db.repositories.counselling_repository import CounsellingRepository
from app.services.whatsapp_service import build_whatsapp_handoff

def generate_15min_slots(date_str: str, start_time: str = "16:00", end_time: str = "18:00") -> List[str]:
    """Derives 15-minute bookable time slots (e.g., 16:00, 16:15, 16:30, 16:45, 17:00...)."""
    slots = []
    sh, sm = map(int, start_time.split(":"))
    eh, em = map(int, end_time.split(":"))

    current_minutes = sh * 60 + sm
    end_minutes = eh * 60 + em

    while current_minutes + 15 <= end_minutes:
        h = current_minutes // 60
        m = current_minutes % 60
        slots.append(f"{h:02d}:{m:02d}")
        current_minutes += 15

    return slots

class CounsellingService:
    def __init__(self, db: Session):
        self.repo = CounsellingRepository(db)

    def list_counsellors(self) -> List[dict]:
        counsellors = self.repo.get_counsellors()
        return [
            {
                "id": c.id,
                "name": c.name,
                "role": c.role,
                "active": c.active,
                "phone_number": c.phone_number
            }
            for c in counsellors
        ]

    def get_availability(self, counsellor_id: str, date_str: str = None) -> List[dict]:
        if not date_str:
            date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        counsellor = self.repo.get_counsellor_by_id(counsellor_id)
        if not counsellor:
            raise HTTPException(status_code=404, detail="Counsellor not found")

        # Derive 15-minute slots
        raw_slots = generate_15min_slots(date_str, "16:00", "18:00")
        existing_appts = self.repo.get_appointments_for_counsellor_and_date(counsellor_id, date_str)
        booked_times = {a.scheduled_at.split(" ")[1] for a in existing_appts}

        slot_objs = []
        for slot in raw_slots:
            slot_objs.append({
                "id": f"{counsellor_id}_{date_str}_{slot}",
                "counsellor_id": counsellor_id,
                "date": date_str,
                "start_time": slot,
                "end_time": slot,
                "is_available": slot not in booked_times
            })

        return slot_objs

    def book_appointment(
        self,
        student_id: str,
        counsellor_id: str,
        date_str: str,
        time_slot: str,
        consent_given: bool
    ) -> Dict[str, Any]:
        if not consent_given:
            raise HTTPException(status_code=400, detail="Explicit student consent is required to request a session.")

        counsellor = self.repo.get_counsellor_by_id(counsellor_id)
        if not counsellor:
            raise HTTPException(status_code=404, detail="Counsellor not found.")

        scheduled_at_str = f"{date_str} {time_slot}"

        # Prevent double booking
        if self.repo.is_slot_booked(counsellor_id, scheduled_at_str):
            raise HTTPException(status_code=409, detail="This appointment slot is already booked. Please choose another time.")

        meeting_link = "https://meet.jit.si/mindtrace-wellbeing-support-session"
        appt = self.repo.create_appointment(
            student_id=student_id,
            counsellor_id=counsellor_id,
            scheduled_at=scheduled_at_str,
            duration_minutes=15,
            meeting_link=meeting_link
        )

        handoff = build_whatsapp_handoff(
            counsellor_name=counsellor.name,
            date_str=date_str,
            time_str=time_slot,
            custom_phone=counsellor.phone_number
        )

        return {
            "id": appt.id,
            "student_id": appt.student_id,
            "counsellor_id": appt.counsellor_id,
            "counsellor_name": counsellor.name,
            "counsellor_role": counsellor.role,
            "scheduled_at": appt.scheduled_at,
            "duration_minutes": appt.duration_minutes,
            "status": appt.status,
            "meeting_link": appt.meeting_link,
            "whatsapp_url": handoff["whatsapp_url"],
            "created_at": appt.created_at,
            "updated_at": appt.updated_at
        }

    def list_student_appointments(self, student_id: str) -> List[Dict[str, Any]]:
        appts = self.repo.get_student_appointments(student_id)
        results = []
        for a in appts:
            c = self.repo.get_counsellor_by_id(a.counsellor_id)
            c_name = c.name if c else "College Counsellor"
            c_role = c.role if c else "Support Counsellor"
            c_phone = c.phone_number if c else None

            # Split scheduled_at into date and time
            parts = a.scheduled_at.split(" ")
            d_str = parts[0] if len(parts) > 0 else "Today"
            t_str = parts[1] if len(parts) > 1 else "17:00"

            handoff = build_whatsapp_handoff(
                counsellor_name=c_name,
                date_str=d_str,
                time_str=t_str,
                custom_phone=c_phone
            )

            results.append({
                "id": a.id,
                "student_id": a.student_id,
                "counsellor_id": a.counsellor_id,
                "counsellor_name": c_name,
                "counsellor_role": c_role,
                "scheduled_at": a.scheduled_at,
                "duration_minutes": a.duration_minutes,
                "status": a.status,
                "meeting_link": a.meeting_link,
                "whatsapp_url": handoff["whatsapp_url"],
                "created_at": a.created_at,
                "updated_at": a.updated_at
            })
        return results

    def reschedule_appointment(
        self,
        appointment_id: str,
        new_date: str,
        new_time_slot: str
    ) -> Dict[str, Any]:
        appt = self.repo.get_appointment_by_id(appointment_id)
        if not appt:
            raise HTTPException(status_code=404, detail="Appointment not found.")

        new_scheduled_at = f"{new_date} {new_time_slot}"
        if self.repo.is_slot_booked(appt.counsellor_id, new_scheduled_at, exclude_appointment_id=appointment_id):
            raise HTTPException(status_code=409, detail="The selected new slot is already booked.")

        updated = self.repo.update_appointment(appointment_id, {
            "scheduled_at": new_scheduled_at,
            "status": "rescheduled"
        })

        c = self.repo.get_counsellor_by_id(updated.counsellor_id)
        c_name = c.name if c else "College Counsellor"
        c_role = c.role if c else "Support Counsellor"
        c_phone = c.phone_number if c else None

        handoff = build_whatsapp_handoff(
            counsellor_name=c_name,
            date_str=new_date,
            time_str=new_time_slot,
            custom_phone=c_phone
        )

        return {
            "id": updated.id,
            "student_id": updated.student_id,
            "counsellor_id": updated.counsellor_id,
            "counsellor_name": c_name,
            "counsellor_role": c_role,
            "scheduled_at": updated.scheduled_at,
            "duration_minutes": updated.duration_minutes,
            "status": updated.status,
            "meeting_link": updated.meeting_link,
            "whatsapp_url": handoff["whatsapp_url"],
            "created_at": updated.created_at,
            "updated_at": updated.updated_at
        }

    def cancel_appointment(self, appointment_id: str) -> Dict[str, Any]:
        appt = self.repo.get_appointment_by_id(appointment_id)
        if not appt:
            raise HTTPException(status_code=404, detail="Appointment not found.")

        updated = self.repo.update_appointment(appointment_id, {"status": "cancelled"})
        return {"id": updated.id, "status": "cancelled", "message": "Appointment cancelled successfully."}
