from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    """
    User Data Access Repository
    Single responsibility: encapsulate all database queries concerning User entities.
    """

    def __init__(self, session: AsyncSession):
        self._session = session

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Fetch a user by their unique primary key."""
        result = await self._session.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        """Fetch a user by normalized email address."""
        result = await self._session.execute(
            select(User).where(User.email == email.lower().strip())
        )
        return result.scalars().first()

    async def create(self, user: User) -> User:
        """Persist a new user entity in the database."""
        self._session.add(user)
        await self._session.flush()
        await self._session.refresh(user)
        return user

    async def list_all(self, limit: int = 50, offset: int = 0) -> List[User]:
        """Retrieve a paginated list of users."""
        result = await self._session.execute(
            select(User).order_by(User.created_at.desc()).limit(limit).offset(offset)
        )
        return list(result.scalars().all())
