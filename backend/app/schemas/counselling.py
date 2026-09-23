from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class CounsellorRead(BaseModel):
    id: str
    name: str
    role: str
    active: bool
    phone_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AvailabilitySlotRead(BaseModel):
    id: str
    counsellor_id: str
    date: str
    start_time: str
    end_time: str
    is_available: bool

    model_config = ConfigDict(from_attributes=True)

class AppointmentCreate(BaseModel):
    student_id: str = Field(..., min_length=1)
    counsellor_id: str = Field(..., min_length=1)
    availability_id: Optional[str] = None
    date: Optional[str] = None
    time_slot: Optional[str] = None
    consent_given: bool = True

class AppointmentUpdate(BaseModel):
    new_availability_id: Optional[str] = None
    date: Optional[str] = None
    time_slot: Optional[str] = None
    status: Optional[str] = None

class AppointmentRead(BaseModel):
    id: str
    student_id: str
    counsellor_id: str
    counsellor_name: str
    counsellor_role: str
    scheduled_at: str
    duration_minutes: int
    status: str
    meeting_link: Optional[str] = None
    whatsapp_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class WhatsAppHandoffRead(BaseModel):
    appointment_id: str
    whatsapp_url: str
    minimal_message: str
