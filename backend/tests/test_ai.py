import asyncio
from app.services.ai_service import generate_wellbeing_nudge, generate_student_summary

def test_ai_fallback_nudge():
    result = asyncio.run(generate_wellbeing_nudge(
        student_id="test_student",
        concern_level="moderate",
        student_name="Test Student"
    ))
    assert "title" in result
    assert "body" in result
    assert "action_label" in result

def test_ai_fallback_summary():
    result = asyncio.run(generate_student_summary(
        student_id="test_student",
        student_name="Test Student"
    ))
    assert "summary" in result
    assert "key_observations" in result
    assert "suggested_focus" in result
