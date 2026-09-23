import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

ADMIN_TOKEN = "token_admin_rkgit_college_admin_9921"
HEADERS = {"Authorization": f"Bearer {ADMIN_TOKEN}"}

def test_admin_login():
    # Valid login
    res = client.post("/api/institution/login", json={"email": "admin@rkgit.edu", "password": "admin123"})
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "COLLEGE_ADMIN"
    assert data["access_token"] == ADMIN_TOKEN

    # Invalid login
    res_bad = client.post("/api/institution/login", json={"email": "admin@rkgit.edu", "password": "wrongpassword"})
    assert res_bad.status_code == 401

def test_institutional_overview_authorization():
    # Without token -> 401
    res_no_token = client.get("/api/institution/overview")
    assert res_no_token.status_code == 401

    # Invalid student token -> 403 Forbidden
    res_student_token = client.get("/api/institution/overview", headers={"Authorization": "Bearer student_token_xyz"})
    assert res_student_token.status_code == 403

    # Valid admin token -> 200 OK
    res_valid = client.get("/api/institution/overview", headers=HEADERS)
    assert res_valid.status_code == 200
    data = res_valid.json()
    assert data["eligible_students"] == 1240
    assert data["opted_in_students"] >= 682

def test_privacy_threshold_enforcement():
    res = client.get("/api/institution/cohorts?year=All", headers=HEADERS)
    assert res.status_code == 200
    cohorts = res.json()
    assert isinstance(cohorts, list)
    
    # 1st Year cohort (count >= 10) -> not masked
    y1 = next(c for c in cohorts if c["year"] == "1st Year")
    assert y1["privacy_masked"] is False
    assert y1["opted_in_count"] >= 10

    # Specialized M.Tech cohort (count < 10) -> privacy_masked IS TRUE
    mtech = next(c for c in cohorts if c["year"] == "Specialized M.Tech")
    assert mtech["privacy_masked"] is True
    assert "Minimum 10 students required" in mtech["message"]
    assert mtech["opted_in_count"] == 0

def test_no_individual_pii_exposed():
    res = client.get("/api/institution/report", headers=HEADERS)
    assert res.status_code == 200
    report = res.json()
    assert "privacy_declaration" in report
    assert "nikhil" not in str(report).lower()
    assert "email" not in str(report).lower()
