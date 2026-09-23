from pydantic import BaseModel, Field
from typing import Optional, List

class ChatMessageItem(BaseModel):
    role: str = Field(..., description="Either 'user' or 'assistant'")
    content: str = Field(..., description="Text content of the message")

class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Student's message")
    conversation_id: Optional[str] = Field(default="default", description="Conversation session ID")
    history: Optional[List[ChatMessageItem]] = Field(default=[], description="Prior conversation context")

class ChatMessageResponse(BaseModel):
    message: str = Field(..., description="Companion response")
    conversation_id: str
    safety_state: str = Field(default="normal", description="'normal' or 'crisis'")
