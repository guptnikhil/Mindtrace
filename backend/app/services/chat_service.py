import logging
import re
from typing import Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

CRISIS_KEYWORDS = [
    r"\bsuicide\b",
    r"\bkill myself\b",
    r"\bend my life\b",
    r"\bwant to die\b",
    r"\bself harm\b",
    r"\bcutting myself\b",
    r"\boverdose\b",
    r"\bhurt myself\b"
]

CALM_COMPANION_SYSTEM_PROMPT = """
You are "Calm Companion", a warm, empathetic, privacy-first conversational listener inside MindTrace (a wellbeing app for engineering students).

YOUR SOLE GOAL:
LISTEN → ACKNOWLEDGE → REFLECT → GENTLY ASK

CORE RULES:
1. NO UNSOLICITED ADVICE: Never offer productivity tips, breathing exercises, study schedules, time management advice, sleep hygiene tips, or self-care lists. Never say "You should...", "Try doing...", "Take a break...", or "Maybe you should...".
2. NO DIAGNOSIS OR LABELS: Never state or imply that the student has burnout, clinical depression, anxiety, or deteriorating mental health. Never say "You are burned out" or "You have anxiety".
3. NO DASHBOARD DATA ASSUMPTIONS: Do not claim to know the user's stress level or routine data unless they explicitly tell you in this chat.
4. TONE & FORMAT:
   - Warm, calm, human, concise, patient, and non-judgmental.
   - 1 to 2 short paragraphs max.
   - End with exactly ONE natural, gentle open question so the student can keep sharing if they wish.
"""

def check_crisis_trigger(message: str) -> bool:
    """Checks if message contains explicit imminent self-harm or suicide indicators."""
    lowered = message.lower()
    for pattern in CRISIS_KEYWORDS:
        if re.search(pattern, lowered):
            return True
    return False

def get_fallback_response(message: str, history: List[Dict[str, str]] = None) -> str:
    """
    Generates a deterministic conversational response following LISTEN -> ACKNOWLEDGE -> REFLECT -> GENTLY ASK
    when Gemini API is unconfigured or unavailable.
    """
    lowered = message.lower()

    if any(w in lowered for w in ["assignment", "exam", "college", "study", "deadline", "project", "lab", "professor"]):
        return (
            "It sounds like college demands have been piling up and sitting heavy on your mind.\n\n"
            "Is it mostly the sheer volume of deadlines right now, or something specific about what's expected of you?"
        )
    elif any(w in lowered for w in ["tired", "exhausted", "sleep", "rest", "drained", "can't focus", "burnout"]):
        return (
            "That feeling of being completely drained makes everything feel twice as heavy.\n\n"
            "Has this exhaustion been building up over a while, or did it hit all at once recently?"
        )
    elif any(w in lowered for w in ["alone", "lonely", "nobody", "isolated", "friend", "overwhelmed"]):
        return (
            "Carrying all of this by yourself can feel really isolating.\n\n"
            "Do you feel like you're having to hold everything together on your own right now?"
        )
    else:
        return (
            "Thank you for sharing that with me. It sounds like there's a lot sitting on your mind right now.\n\n"
            "What part of all this has been feeling the hardest to deal with?"
        )

async def generate_chat_response(
    user_message: str,
    conversation_id: str = "default",
    history: List[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Processes a chat message with safety check, server-side system prompt, and fallback.
    Returns dict with keys: "message", "conversation_id", "safety_state".
    """
    # 1. Check Safety Trigger
    if check_crisis_trigger(user_message):
        return {
            "message": (
                "I hear how deeply painful things feel right now, but please know you don't have to carry this alone.\n\n"
                "If you're in immediate danger or having thoughts of self-harm or suicide, please connect right away with a trusted person or emergency support.\n\n"
                "In India, Tele-MANAS (14416 / 1800-891-4416) and AASRA (91-9820466726) offer free, confidential 24/7 support. "
                "You can also reach out to your college counsellor or emergency medical services."
            ),
            "conversation_id": conversation_id,
            "safety_state": "crisis"
        }

    # 2. Try Gemini API if key is present
    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)

            # Build dialog context
            contents = [CALM_COMPANION_SYSTEM_PROMPT]
            if history:
                for item in history[-6:]:  # Keep recent context window
                    role_label = "Student" if item.get("role") == "user" else "Calm Companion"
                    contents.append(f"{role_label}: {item.get('content', '')}")

            contents.append(f"Student: {user_message}\nCalm Companion:")

            full_prompt = "\n\n".join(contents)

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=full_prompt
            )

            bot_reply = response.text.strip()
            if bot_reply:
                return {
                    "message": bot_reply,
                    "conversation_id": conversation_id,
                    "safety_state": "normal"
                }
        except Exception as e:
            logger.warning(f"Gemini API chat call failed or timed out: {e}. Executing fallback response.")

    # 3. Fallback Response
    fallback_text = get_fallback_response(user_message, history)
    return {
        "message": fallback_text,
        "conversation_id": conversation_id,
        "safety_state": "normal"
    }
