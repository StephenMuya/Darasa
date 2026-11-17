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
from app.services.rag_chat_service import RagChatService


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
        rag_chat_service: Optional[RagChatService] = None,
    ):
        self._conv_repo = conv_repo
        self._msg_repo = msg_repo
        self._cache = cache_service
        self._rag = rag_chat_service

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
        3. Compute RAG-grounded CBC pedagogical response
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

        # 3. Generate RAG-grounded CBC intelligence
        if self._rag is not None:
            rag_result = await self._rag.answer(query=data.query)
            response_text = rag_result["text"]
            follow_ups = rag_result["follow_ups"]
        else:
            # Graceful fallback when RAG service is unavailable (e.g. test stubs)
            response_text = (
                f"Darasa CBC Assistant is ready. You asked: '{data.query}'. "
                "Please ensure the curriculum database is seeded and the "
                "retrieval service is configured."
            )
            follow_ups = [
                "What are the strands in Grade 5 Agriculture & Nutrition?",
                "How do I assess learners using the CBC 4-tier rubric?",
                "What zero-cost materials can I use for a Grade 5 lesson?",
            ]

        # 4. Persist assistant turn
        ai_msg = Message(
            conversation_id=conversation.id,
            sender="darasa",
            sender_name="Darasa CBC Assistant",
            text=response_text,
            materials=None,
            rubric=None,
            follow_ups=follow_ups,
        )
        saved_ai_msg = await self._msg_repo.create(ai_msg)

        # 5. Invalidate conversation cache
        await self._cache.delete(f"conv:{conversation.id}")

        return InquiryResponse(
            conversation_id=conversation.id,
            message_id=saved_ai_msg.id,
            sender_name="Darasa CBC Assistant",
            text=response_text,
            materials=None,
            rubric=None,
            follow_ups=follow_ups,
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