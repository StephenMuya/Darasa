import logging
from typing import Optional

from redis.asyncio import Redis, from_url

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_redis_client: Optional[Redis] = None


async def init_redis() -> Optional[Redis]:
    """
    Initialize Redis connection pool.
    Gracefully handles environments where Redis is not yet reachable.
    """
    global _redis_client
    try:
        _redis_client = from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_timeout=3.0,
            socket_connect_timeout=3.0,
        )
        await _redis_client.ping()
        logger.info("Successfully connected to Redis at %s", settings.REDIS_URL)
        return _redis_client
    except Exception as exc:
        logger.warning(
            "Redis connection unavailable (%s). Running with memory fallback.", exc
        )
        _redis_client = None
        return None


async def close_redis() -> None:
    """Close Redis connection pool gracefully."""
    global _redis_client
    if _redis_client is not None:
        try:
            await _redis_client.close()
            logger.info("Redis connection closed.")
        except Exception as exc:
            logger.warning("Error closing Redis connection: %s", exc)
        finally:
            _redis_client = None


def get_redis_client() -> Optional[Redis]:
    """Accessor for the global async Redis client."""
    return _redis_client
