import json
import logging
from typing import Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

FALLBACK_NUDGES = {
    "low": {
        "title": "A steady moment",
        "body": "Your routine looks fairly consistent. Keep making room for small rest moments that help you stay grounded.",
        "action_label": "Maintain routine"
    },
    "moderate": {
        "title": "Noticing a routine shift",
        "body": "We noticed slight increases in academic pressure or late hours. Taking a brief 5-minute break can help recharge your focus.",
        "action_label": "Take a short reset"
    },
    "high": {
        "title": "A moment to pause & connect",
        "body": "Your routine has been running harder lately. Consider stepping back briefly or reaching out to a trusted mentor or campus support.",
        "action_label": "Explore support options"
    }
}

async def generate_wellbeing_nudge(
    student_id: str,
    concern_level: str = "moderate",
    student_name: str = "Student",
    recent_checkins: List[dict] = None
) -> Dict[str, str]:
    """
    Generate a personalized, non-diagnostic wellbeing nudge via Gemini API.
    Falls back gracefully to deterministic templates if AI call fails or GEMINI_API_KEY is unset.
    """
    concern_level = concern_level if concern_level in ["low", "moderate", "high"] else "moderate"
    
    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            prompt = f"""
You are an early-warning wellbeing companion for engineering students.
Generate a supportive, non-diagnostic nudge for a student named {student_name}.

CONTEXT:
- Concern Level: {concern_level} (early warning pattern indicator, NOT a medical diagnosis or burnout prediction)
- Recent Check-ins Summary: {json.dumps(recent_checkins or [])}

RULES:
1. NEVER use medical or clinical terms (do NOT say 'burnout diagnosis', 'clinical depression', 'medical test').
2. Treat routine changes strictly as indicators of daily pattern variance.
3. Offer a supportive next step (e.g., 2-minute breathing reset or talking to someone).
4. Return ONLY a JSON object with exact keys: "title", "body", "action_label".

JSON Output:
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            
            cleaned_text = response.text.strip()
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
                
            data = json.loads(cleaned_text.strip())
            return {
                "title": data.get("title", FALLBACK_NUDGES[concern_level]["title"]),
                "body": data.get("body", FALLBACK_NUDGES[concern_level]["body"]),
                "action_label": data.get("action_label", FALLBACK_NUDGES[concern_level]["action_label"])
            }
        except Exception as e:
            logger.warning(f"Gemini AI API call failed or timed out: {e}. Executing graceful fallback.")
            
    return FALLBACK_NUDGES[concern_level]

async def generate_student_summary(
    student_id: str,
    student_name: str = "Student",
    history_data: List[dict] = None
) -> Dict[str, Any]:
    """
    Generates a high-level non-diagnostic wellbeing summary using Gemini API.
    Falls back gracefully if API is unavailable.
    """
    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            prompt = f"""
Analyze the routine check-in history for student {student_name} and generate a brief supportive non-diagnostic summary.
Data: {json.dumps(history_data or [])}

Return ONLY a JSON object with keys: "summary", "key_observations" (list of strings), "suggested_focus".
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            
            cleaned = response.text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
                
            return json.loads(cleaned.strip())
        except Exception as e:
            logger.warning(f"Gemini AI summary call failed: {e}. Executing fallback summary.")
            
    return {
        "student_id": student_id,
        "summary": f"{student_name}'s routine shows steady participation with periodic academic stress fluctuations.",
        "key_observations": [
            "Consistent self-checkin engagement",
            "Periodic late-night studying during assignment deadlines",
            "Positive response to short breathing breaks"
        ],
        "suggested_focus": "Maintaining a balanced sleep schedule during peak academic deadlines."
    }
