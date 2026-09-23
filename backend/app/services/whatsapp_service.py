import urllib.parse
from app.core.config import settings

def build_whatsapp_handoff(
    counsellor_name: str,
    date_str: str,
    time_str: str,
    custom_phone: str = None
) -> dict:
    """
    Generates a minimal, non-diagnostic WhatsApp appointment coordination link.
    CRITICAL PRIVACY RULE: Never includes risk scores, behavioural signals, notes, or diagnoses.
    """
    # Environment configurable phone number fallback
    target_number = custom_phone or getattr(settings, "WHATSAPP_COUNSELLOR_NUMBER", "+919876543210")
    # Clean phone number (strip spaces/dashes)
    clean_number = "".join([c for c in target_number if c.isdigit() or c == "+"])

    # Strictly minimal appointment coordination message
    message = (
        f"Hi, I requested a counselling session through MindTrace.\n\n"
        f"Counsellor: {counsellor_name}\n"
        f"Date: {date_str}\n"
        f"Time: {time_str}\n\n"
        f"I'd like to confirm my session."
    )

    encoded_text = urllib.parse.quote(message)
    whatsapp_url = f"https://wa.me/{clean_number.replace('+', '')}?text={encoded_text}"

    return {
        "whatsapp_url": whatsapp_url,
        "minimal_message": message,
        "phone_number": clean_number
    }
