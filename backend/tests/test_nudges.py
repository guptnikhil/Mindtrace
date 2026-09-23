from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_nudge_generation():
    student_id = "test_nudge_student"
    response = client.post(f"/api/nudges/{student_id}/generate")
    assert response.status_code == 201
    data = response.json()
    assert "student_id" in data
    assert "title" in data
    assert "message" in data
    assert "category" in data
    assert "priority" in data

def test_get_nudges():
    # First generate a student & nudge
    student_id = "test_nudge_student"
    gen_res = client.post(f"/api/nudges/{student_id}/generate")
    assert gen_res.status_code == 201
    created_student_id = gen_res.json()["student_id"]

    response = client.get(f"/api/nudges/{created_student_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
