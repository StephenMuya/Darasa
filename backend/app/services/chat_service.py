from typing import Optional

from app.models.conversation import Conversation
from app.models.message import Message
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.chat import (
    ConversationResponse,
    InquiryRequest,
    InquiryResponse,
)
from app.services.cache_service import CacheService
from app.services.cbc_inquiry_service import CBCInquiryService


class ChatService:
    """
    Chat Orchestration & Conversation Lifecycle Service
    Single responsibility: coordinate multi-turn conversations, persist message turns,
    and update Redis cache for sub-second retrieval.
    """

    def __init__(
        self,
        conv_repo: ConversationRepository,
        msg_repo: MessageRepository,
        cache_service: CacheService,
    ):
        self._conv_repo = conv_repo
        self._msg_repo = msg_repo
        self._cache = cache_service

    async def get_or_create_conversation(
        self,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None,
        title: str = "New CBC Inquiry",
    ) -> Conversation:
        """Retrieve existing conversation or instantiate a new conversation session."""
        if conversation_id:
            conv = await self._conv_repo.get_by_id(conversation_id)
            if conv is not None:
                return conv

        new_conv = Conversation(
            user_id=user_id,
            title=title[:255],
        )
        return await self._conv_repo.create(new_conv)

    async def process_inquiry(
        self,
        data: InquiryRequest,
        user_id: Optional[str] = None,
    ) -> InquiryResponse:
        """
        Execute an end-to-end CBC inquiry turn:
        1. Resolve / create conversation
        2. Persist user message
        3. Compute CBC pedagogical response
        4. Persist assistant message
        5. Invalidate / update Redis cache
        """
        # 1. Conversation session
        title = data.query[:50] + ("..." if len(data.query) > 50 else "")
        conversation = await self.get_or_create_conversation(
            conversation_id=data.conversation_id,
            user_id=user_id,
            title=title,
        )

        # 2. Persist user turn
        user_msg = Message(
            conversation_id=conversation.id,
            sender="user",
            sender_name="You (Educator)"
            if (data.role or "teacher") == "teacher"
            else "You",
            text=data.query,
        )
        await self._msg_repo.create(user_msg)

        # 3. Generate CBC intelligence
        pedagogical_result = CBCInquiryService.generate_pedagogical_response(
            query=data.query,
            role=data.role or "teacher",
        )

        # 4. Persist assistant turn
        ai_msg = Message(
            conversation_id=conversation.id,
            sender="darasa",
            sender_name="Darasa CBC Assistant",
            text=pedagogical_result["text"],
            materials=[m.model_dump() for m in pedagogical_result["materials"]]
            if pedagogical_result["materials"]
            else None,
            rubric=pedagogical_result["rubric"].model_dump()
            if pedagogical_result["rubric"]
            else None,
            follow_ups=pedagogical_result["follow_ups"],
        )
        saved_ai_msg = await self._msg_repo.create(ai_msg)

        # 5. Invalidate conversation cache
        await self._cache.delete(f"conv:{conversation.id}")

        return InquiryResponse(
            conversation_id=conversation.id,
            message_id=saved_ai_msg.id,
            sender_name="Darasa CBC Assistant",
            text=pedagogical_result["text"],
            materials=pedagogical_result["materials"],
            rubric=pedagogical_result["rubric"],
            follow_ups=pedagogical_result["follow_ups"],
        )

    async def get_conversation_history(
        self, conversation_id: str
    ) -> Optional[ConversationResponse]:
        """Retrieve full conversation transcript with Redis caching."""
        cache_key = f"conv:{conversation_id}"
        cached = await self._cache.get_json(cache_key)
        if cached:
            return ConversationResponse.model_validate(cached)

        conv = await self._conv_repo.get_by_id(conversation_id, load_messages=True)
        if conv is None:
            return None

        response = ConversationResponse.from_orm_model(conv)
        await self._cache.set_json(
            cache_key, response.model_dump(), expire_seconds=1800
        )
        return response
