import html

def sanitize_text(text: str) -> str:
    """Sanitizes plain text input to prevent XSS and injection attacks."""
    if not text:
        return ""
    return html.escape(text.strip())
