import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_valid_checkin():
    unique_id = f"STUDENT_{uuid.uuid4().hex[:6]}"
    student_res = client.post("/api/students", json={
        "student_identifier": unique_id,
        "name": "Test Student",
        "branch": "CSE",
        "year": 3
    })
    assert student_res.status_code == 201
    student_id = student_res.json()["id"]

    # Submit valid check-in
    payload = {
        "student_id": student_id,
        "mood": 4,
        "energy_level": 3,
        "stress_level": 2,
        "sleep_hours": 7.5,
        "academic_pressure": 3,
        "optional_note": "Feeling fine after study session"
    }
    response = client.post("/api/checkins", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["student_id"] == student_id
    assert data["mood"] == 4
    assert data["sleep_hours"] == 7.5

def test_invalid_checkin_bounds():
    payload = {
        "student_id": "test_id",
        "mood": 10,  # Invalid: > 5
        "energy_level": 3,
        "stress_level": 2,
        "sleep_hours": 30.0,  # Invalid: > 24
        "academic_pressure": 3
    }
    response = client.post("/api/checkins", json=payload)
    assert response.status_code == 422  # Unprocessable Entity
