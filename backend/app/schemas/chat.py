from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.rubric import RubricTier


class PracticalMaterial(BaseModel):
    """Zero-cost improvised practical resource for CBC learning activities."""

    item: str = Field(..., example="2L used plastic bottle")
    purpose: str = Field(..., example="Water reservoir and flow regulator")
    source: str = Field(
        default="Locally available / Recycled household items",
        example="Locally available",
    )


class InquiryRequest(BaseModel):
    """
    User inquiry dispatched to Darasa AI engine.
    Supports optional conversation_id to maintain multi-turn context.
    """

    query: str = Field(
        ...,
        min_length=1,
        example="How do I teach soil conservation with zero-cost materials in Grade 5?",
    )
    conversation_id: Optional[str] = Field(default=None, example=None)
    role: Optional[str] = Field(default="teacher", example="teacher")


class InquiryResponse(BaseModel):
    """
    Darasa CBC pedagogical intelligence response.
    Includes textual guidance, local zero-cost materials, formative rubric, and Socratic follow-ups.
    """

    conversation_id: str
    message_id: str
    sender_name: str = "Darasa CBC Assistant"
    text: str
    materials: Optional[List[PracticalMaterial]] = None
    rubric: Optional[RubricTier] = None
    follow_ups: List[str] = Field(default_factory=list)
    source_confidence: str = "98.9% KICD Curriculum Alignment"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MessageCreate(BaseModel):
    """Payload to post an explicit message into a conversation."""

    text: str = Field(..., min_length=1)
    sender: str = Field(default="user")
    sender_name: Optional[str] = Field(default="User")


class MessageResponse(BaseModel):
    """Message schema returned to frontend."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    conversation_id: str
    sender: str
    sender_name: str
    text: str
    materials: Optional[List[Dict[str, Any]]] = None
    rubric: Optional[Dict[str, Any]] = None
    follow_ups: Optional[List[str]] = None
    created_at: datetime


class ConversationCreate(BaseModel):
    """Payload to initiate a new conversation session."""

    title: Optional[str] = Field(default="New CBC Inquiry", max_length=255)


class ConversationResponse(BaseModel):
    """Conversation summary schema."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = Field(default_factory=list)

    @classmethod
    def from_orm_model(cls, conv: Any) -> "ConversationResponse":
        """Safe constructor avoiding async MissingGreenlet on unloaded relationships."""
        msgs: List[MessageResponse] = []
        if (
            hasattr(conv, "__dict__")
            and "messages" in conv.__dict__
            and conv.__dict__["messages"]
        ):
            msgs = [MessageResponse.model_validate(m) for m in conv.messages]
        return cls(
            id=conv.id,
            user_id=conv.user_id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            messages=msgs,
        )
