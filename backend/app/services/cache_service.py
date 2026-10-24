import json
import logging
from typing import Any, Dict, Optional

from redis.asyncio import Redis

logger = logging.getLogger(__name__)


class CacheService:
    """
    Redis Caching Service
    Single responsibility: handle caching, retrieval, expiration, and invalidation.
    Includes memory fallback for environments where Redis is offline.
    """

    def __init__(self, redis: Optional[Redis] = None):
        self._redis = redis
        self._memory_fallback: Dict[str, str] = {}

    async def get_json(self, key: str) -> Optional[Any]:
        """Fetch and deserialise a cached JSON object by key."""
        try:
            if self._redis is not None:
                raw = await self._redis.get(key)
                if raw:
                    return json.loads(raw)
            else:
                raw = self._memory_fallback.get(key)
                if raw:
                    return json.loads(raw)
        except Exception as exc:
            logger.warning("Cache read failed for key '%s': %s", key, exc)
        return None

    async def set_json(self, key: str, value: Any, expire_seconds: int = 3600) -> bool:
        """Serialise and store an object as JSON with TTL expiration."""
        try:
            payload = json.dumps(value, default=str)
            if self._redis is not None:
                await self._redis.set(key, payload, ex=expire_seconds)
            else:
                self._memory_fallback[key] = payload
            return True
        except Exception as exc:
            logger.warning("Cache write failed for key '%s': %s", key, exc)
            return False

    async def delete(self, key: str) -> bool:
        """Invalidate a specific cache key."""
        try:
            if self._redis is not None:
                await self._redis.delete(key)
            else:
                self._memory_fallback.pop(key, None)
            return True
        except Exception as exc:
            logger.warning("Cache deletion failed for key '%s': %s", key, exc)
            return False
