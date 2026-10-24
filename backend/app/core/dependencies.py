from typing import AsyncGenerator, Optional

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.exceptions import raise_http_unauthorized
from app.core.redis_client import get_redis_client
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency: Yields an active SQLAlchemy AsyncSession."""
    async for session in get_db_session():
        yield session


def get_redis() -> Optional[Redis]:
    """Dependency: Returns the initialized Redis client (or None)."""
    return get_redis_client()


async def get_current_user_payload(
    token: Optional[str] = Depends(oauth2_scheme),
) -> dict:
    """
    Dependency: Extracts and validates the JWT claims payload from Authorization header.
    """
    if not token:
        raise_http_unauthorized("Authentication token required")
    payload = decode_access_token(token)
    if payload is None or "sub" not in payload:
        raise_http_unauthorized("Invalid or expired authentication token")
    return payload
