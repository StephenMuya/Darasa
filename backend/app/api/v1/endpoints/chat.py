from typing import Optional

from fastapi import APIRouter, Depends, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_redis, oauth2_scheme
from app.core.exceptions import raise_http_not_found
from app.core.security import decode_access_token
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.chat import (
    ConversationCreate,
    ConversationResponse,
    InquiryRequest,
    InquiryResponse,
)
from app.services.cache_service import CacheService
from app.services.chat_service import ChatService
from app.services.curriculum_retrieval_service import CurriculumRetrievalService
from app.services.embedding_service import EmbeddingService
from app.services.rag_chat_service import RagChatService

router = APIRouter()


async def get_optional_user_id(
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[str]:
    """Helper: Extracts user_id from token if present, returns None for guest inquiries."""
    if token:
        payload = decode_access_token(token)
        if payload:
            return payload.get("sub")
    return None


@router.post(
    "/inquiry",
    response_model=InquiryResponse,
    status_code=status.HTTP_200_OK,
    summary="Dispatch CBC Inquiry",
    description="Submit a pedagogical query to Darasa AI and receive KICD-grounded curriculum reasoning.",
)
async def submit_inquiry(
    data: InquiryRequest,
    db: AsyncSession = Depends(get_db),
    redis: Optional[Redis] = Depends(get_redis),
    user_id: Optional[str] = Depends(get_optional_user_id),
) -> InquiryResponse:
    conv_repo = ConversationRepository(db)
    msg_repo = MessageRepository(db)
    cache = CacheService(redis)

    # Wire RAG pipeline: EmbeddingService → CurriculumRetrievalService → RagChatService
    embedding_service = EmbeddingService(dimension=1536)
    retrieval_service = CurriculumRetrievalService(
        session=db,
        embedding_service=embedding_service,
    )
    rag_service = RagChatService(retrieval_service=retrieval_service)

    service = ChatService(conv_repo, msg_repo, cache, rag_chat_service=rag_service)
    return await service.process_inquiry(data, user_id=user_id)


@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Conversation",
    description="Initialize a new conversation session.",
)
async def create_conversation(
    data: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    user_id: Optional[str] = Depends(get_optional_user_id),
) -> ConversationResponse:
    conv_repo = ConversationRepository(db)
    msg_repo = MessageRepository(db)
    cache = CacheService()
    service = ChatService(conv_repo, msg_repo, cache)
    conv = await service.get_or_create_conversation(
        title=data.title or "New CBC Inquiry",
        user_id=user_id,
    )
    return ConversationResponse.from_orm_model(conv)


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
    summary="Get Conversation Transcript",
    description="Fetch a full conversation transcript with message history.",
)
async def get_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    redis: Optional[Redis] = Depends(get_redis),
) -> ConversationResponse:
    conv_repo = ConversationRepository(db)
    msg_repo = MessageRepository(db)
    cache = CacheService(redis)
    service = ChatService(conv_repo, msg_repo, cache)
    conv = await service.get_conversation_history(conversation_id)
    if conv is None:
        raise_http_not_found("Conversation not found.")
    return conv