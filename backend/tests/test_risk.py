from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_risk_analysis():
    payload = {
        "student_id": "demo_student",
        "mood": 2,
        "energy_level": 2,
        "stress_level": 5,
        "sleep_hours": 4.0,
        "academic_pressure": 5
    }
    response = client.post("/api/wellbeing/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] in ["low", "moderate", "high"]
    assert 0 <= data["risk_score"] <= 100
    assert len(data["contributing_factors"]) > 0
    assert len(data["recommendations"]) > 0
