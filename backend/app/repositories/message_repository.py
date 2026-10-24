from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.message import Message


class MessageRepository:
    """
    Message Data Access Repository
    Single responsibility: encapsulate all database queries for Message entities.
    """

    def __init__(self, session: AsyncSession):
        self._session = session

    async def create(self, message: Message) -> Message:
        """Persist a new message in the database."""
        self._session.add(message)
        await self._session.flush()
        await self._session.refresh(message)
        return message

    async def list_by_conversation(
        self, conversation_id: str, limit: int = 100
    ) -> List[Message]:
        """Fetch all messages for a specific conversation in chronological order."""
        query = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        result = await self._session.execute(query)
        return list(result.scalars().all())
