from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_demo_seed_deterministic_changing():
    response = client.post("/api/demo/seed?state=changing")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["demo_state"] == "changing"
    assert data["signals_count"] == 21
    assert "computed_trend" in data
    assert data["computed_trend"]["state"] in ["changing", "needs_attention", "stable"]

def test_demo_seed_deterministic_stable():
    response = client.post("/api/demo/seed?state=stable")
    assert response.status_code == 200
    data = response.json()
    assert data["demo_state"] == "stable"

def test_demo_reset():
    response = client.post("/api/demo/reset")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
