from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.conversation import Conversation


class ConversationRepository:
    """
    Conversation Data Access Repository
    Single responsibility: encapsulate all database queries for Conversation entities.
    """

    def __init__(self, session: AsyncSession):
        self._session = session

    async def get_by_id(
        self, conversation_id: str, load_messages: bool = True
    ) -> Optional[Conversation]:
        """Fetch a conversation by ID, optionally eager-loading associated messages."""
        query = select(Conversation).where(Conversation.id == conversation_id)
        if load_messages:
            query = query.options(selectinload(Conversation.messages))
        result = await self._session.execute(query)
        return result.scalars().first()

    async def create(self, conversation: Conversation) -> Conversation:
        """Persist a new conversation session."""
        self._session.add(conversation)
        await self._session.flush()
        await self._session.refresh(conversation)
        return conversation

    async def list_by_user(self, user_id: str, limit: int = 20) -> List[Conversation]:
        """List recent conversations for a specific user."""
        query = (
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .limit(limit)
        )
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def update_title(
        self, conversation: Conversation, new_title: str
    ) -> Conversation:
        """Update the title of an existing conversation."""
        conversation.title = new_title
        await self._session.flush()
        await self._session.refresh(conversation)
        return conversation

    async def delete(self, conversation: Conversation) -> None:
        """Remove a conversation and cascade-delete its messages."""
        await self._session.delete(conversation)
        await self._session.flush()
