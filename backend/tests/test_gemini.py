import pytest
import asyncio
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.services.chat_service import generate_chat_response, CALM_COMPANION_SYSTEM_PROMPT
from app.services.ai_service import generate_wellbeing_nudge, generate_student_summary

client = TestClient(app)

def test_chat_missing_api_key_uses_fallback():
    """Verify that when GEMINI_API_KEY is empty, chat uses graceful fallback."""
    with patch("app.core.config.settings.GEMINI_API_KEY", ""):
        res = asyncio.run(generate_chat_response("I have too many exams next week", "test_missing_key"))
        assert res["safety_state"] == "normal"
        assert len(res["message"]) > 0
        assert "GEMINI_API_KEY" not in res["message"]

def test_chat_mocked_gemini_success():
    """Verify successful Gemini API response formatting."""
    mock_response = MagicMock()
    mock_response.text = "It sounds like exam season is taking a toll on your peace of mind. What subject is feeling most demanding?"
    
    mock_client_instance = MagicMock()
    mock_client_instance.models.generate_content.return_value = mock_response

    with patch("app.core.config.settings.GEMINI_API_KEY", "mock_key_12345"):
        with patch("google.genai.Client", return_value=mock_client_instance):
            res = asyncio.run(generate_chat_response("Exams are stressing me out", "test_mock_success"))
            assert res["safety_state"] == "normal"
            assert "exam season" in res["message"].lower()

def test_chat_gemini_exception_fallback():
    """Verify that if Gemini API throws an exception, system falls back without crashing."""
    mock_client_instance = MagicMock()
    mock_client_instance.models.generate_content.side_effect = Exception("API quota exceeded or network timeout")

    with patch("app.core.config.settings.GEMINI_API_KEY", "mock_key_12345"):
        with patch("google.genai.Client", return_value=mock_client_instance):
            res = asyncio.run(generate_chat_response("I feel overwhelmed by my project", "test_mock_exception"))
            assert res["safety_state"] == "normal"
            assert len(res["message"]) > 0
            assert "quota" not in res["message"].lower()  # No raw error leak to student

def test_chat_crisis_interceptor_bypasses_gemini():
    """Verify crisis trigger intercepts before calling Gemini API."""
    mock_client_instance = MagicMock()
    
    with patch("app.core.config.settings.GEMINI_API_KEY", "mock_key_12345"):
        with patch("google.genai.Client", return_value=mock_client_instance):
            res = asyncio.run(generate_chat_response("I want to kill myself", "test_crisis"))
            assert res["safety_state"] == "crisis"
            assert "14416" in res["message"]
            # Ensure Gemini API generate_content was NOT called for crisis message
            mock_client_instance.models.generate_content.assert_not_called()

def test_nudge_mocked_gemini_json_generation():
    """Verify Gemini nudge generation returns valid structured dict."""
    mock_response = MagicMock()
    mock_response.text = '```json\n{"title": "Take a breath", "body": "Small breaks preserve focus.", "action_label": "Reset now"}\n```'
    
    mock_client_instance = MagicMock()
    mock_client_instance.models.generate_content.return_value = mock_response

    with patch("app.core.config.settings.GEMINI_API_KEY", "mock_key_12345"):
        with patch("google.genai.Client", return_value=mock_client_instance):
            nudge = asyncio.run(generate_wellbeing_nudge("std_1", "moderate", "Riya"))
            assert nudge["title"] == "Take a breath"
            assert nudge["body"] == "Small breaks preserve focus."
            assert nudge["action_label"] == "Reset now"

def test_system_prompt_hygiene():
    """Verify system prompt enforces non-diagnostic rules."""
    assert "NO DIAGNOSIS OR LABELS" in CALM_COMPANION_SYSTEM_PROMPT
    assert "NO UNSOLICITED ADVICE" in CALM_COMPANION_SYSTEM_PROMPT
