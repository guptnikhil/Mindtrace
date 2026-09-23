import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_counsellors():
    response = client.get("/api/counsellors")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    assert data[0]["name"] == "Dr. Mehta"

def test_get_counsellor_availability():
    response = client.get("/api/counsellors/counsellor_mehta/availability")
    assert response.status_code == 200
    slots = response.json()
    assert isinstance(slots, list)
    assert len(slots) > 0
    assert "start_time" in slots[0]
    assert "is_available" in slots[0]

def test_book_appointment_flow():
    # 1. Fetch availability to get a valid availability_id for a test date
    avail_res = client.get("/api/counsellors/counsellor_mehta/availability?date=2026-10-15")
    assert avail_res.status_code == 200
    slots = avail_res.json()
    available_slots = [s for s in slots if s["is_available"]]
    assert len(available_slots) > 0
    target_slot = available_slots[0]

    # 2. Book appointment using valid availability_id
    payload = {
        "student_id": "test_student_counsellor",
        "counsellor_id": "counsellor_mehta",
        "availability_id": target_slot["id"],
        "duration_minutes": 15
    }
    res = client.post("/api/appointments", json=payload)
    assert res.status_code == 201
    appt = res.json()
    assert appt["counsellor_name"] == "Dr. Mehta"
    assert "wa.me" in appt["whatsapp_url"]
    assert "9919963335" in appt["whatsapp_url"]
    assert "burnout" not in appt["whatsapp_url"].lower()
    assert "risk" not in appt["whatsapp_url"].lower()

    # 3. Prevent double booking same slot
    res_double = client.post("/api/appointments", json=payload)
    assert res_double.status_code == 409

    # 4. Retrieve student appointments
    res_list = client.get("/api/appointments?student_id=test_student_counsellor")
    assert res_list.status_code == 200
    appts = res_list.json()
    assert len(appts) >= 1
    assert any(a["id"] == appt["id"] for a in appts)
