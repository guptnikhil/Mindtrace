from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.schemas.counselling import (
    CounsellorRead,
    AvailabilitySlotRead,
    AppointmentCreate,
    AppointmentRead,
    AppointmentUpdate
)
from app.services.counselling_service import CounsellingService

router = APIRouter(prefix="", tags=["counselling"])

@router.get("/counsellors", response_model=List[CounsellorRead])
def list_counsellors(db: Session = Depends(get_db)):
    """List available college counsellors."""
    service = CounsellingService(db)
    return service.list_counsellors()

@router.get("/counsellors/{counsellor_id}/availability", response_model=List[AvailabilitySlotRead])
def get_counsellor_availability(
    counsellor_id: str,
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    """Retrieve 15-minute bookable slots for a counsellor on a given date."""
    service = CounsellingService(db)
    return service.get_availability(counsellor_id, date)

@router.post("/appointments", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
def book_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db)
):
    """Book a counselling appointment with consent verification and slot locking."""
    service = CounsellingService(db)

    date_str = payload.date
    time_slot = payload.time_slot

    if payload.availability_id and (not date_str or not time_slot):
        # Format: counsellor_id_YYYY-MM-DD_HH:MM
        parts = payload.availability_id.rsplit("_", 2)
        if len(parts) == 3:
            date_str = parts[1]
            time_slot = parts[2]

    if not date_str or not time_slot:
        raise HTTPException(status_code=400, detail="Missing date or time_slot for appointment.")

    return service.book_appointment(
        student_id=payload.student_id,
        counsellor_id=payload.counsellor_id,
        date_str=date_str,
        time_slot=time_slot,
        consent_given=payload.consent_given
    )

@router.get("/appointments", response_model=List[AppointmentRead])
def list_student_appointments_query(
    student_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve all support appointments for a student via query parameter."""
    if not student_id:
        return []
    service = CounsellingService(db)
    return service.list_student_appointments(student_id)

@router.get("/appointments/{student_id}", response_model=List[AppointmentRead])
def get_student_appointments(
    student_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve all support appointments for a student by path parameter."""
    service = CounsellingService(db)
    return service.list_student_appointments(student_id)

@router.patch("/appointments/{appointment_id}", response_model=AppointmentRead)
def update_appointment(
    appointment_id: str,
    payload: AppointmentUpdate,
    db: Session = Depends(get_db)
):
    """Reschedule an existing appointment."""
    service = CounsellingService(db)
    if payload.status == "cancelled":
        res = service.cancel_appointment(appointment_id)
        # Return updated appointment representation
        appts = service.repo.get_appointment_by_id(appointment_id)
        c = service.repo.get_counsellor_by_id(appts.counsellor_id)
        return {
            "id": appts.id,
            "student_id": appts.student_id,
            "counsellor_id": appts.counsellor_id,
            "counsellor_name": c.name if c else "College Counsellor",
            "counsellor_role": c.role if c else "Support Counsellor",
            "scheduled_at": appts.scheduled_at,
            "duration_minutes": appts.duration_minutes,
            "status": appts.status,
            "meeting_link": appts.meeting_link,
            "whatsapp_url": "",
            "created_at": appts.created_at,
            "updated_at": appts.updated_at
        }

    date_str = payload.date
    time_slot = payload.time_slot

    if payload.new_availability_id and (not date_str or not time_slot):
        parts = payload.new_availability_id.rsplit("_", 2)
        if len(parts) == 3:
            date_str = parts[1]
            time_slot = parts[2]

    if date_str and time_slot:
        return service.reschedule_appointment(appointment_id, date_str, time_slot)
    else:
        raise HTTPException(status_code=400, detail="Invalid update payload.")

@router.delete("/appointments/{appointment_id}")
def cancel_appointment(
    appointment_id: str,
    db: Session = Depends(get_db)
):
    """Cancel an appointment."""
    service = CounsellingService(db)
    return service.cancel_appointment(appointment_id)
