from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse
from app.services.chat_service import generate_chat_response

router = APIRouter(prefix="", tags=["Calm Companion Chat"])

@router.post("/chat", response_model=ChatMessageResponse)
async def send_chat_message(payload: ChatMessageRequest):
    """
    POST /api/chat
    Communicates with Calm Companion chatbot.
    Enforces privacy, no unsolicited advice, no clinical diagnosis, and crisis escalation.
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    history_dicts = [h.model_dump() for h in (payload.history or [])]

    res = await generate_chat_response(
        user_message=payload.message.strip(),
        conversation_id=payload.conversation_id or "default",
        history=history_dicts
    )

    return ChatMessageResponse(
        message=res["message"],
        conversation_id=res["conversation_id"],
        safety_state=res["safety_state"]
    )
