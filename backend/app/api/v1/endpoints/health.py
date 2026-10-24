from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.dependencies import get_db, get_redis
from app.schemas.common import HealthResponse, ReadinessResponse

router = APIRouter()
settings = get_settings()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Liveness Probe",
    description="Returns OK if the FastAPI service is alive and accepting traffic.",
)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        app_name=settings.PROJECT_NAME,
        environment=settings.ENVIRONMENT,
    )


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    summary="Readiness Probe",
    description="Evaluates connectivity to PostgreSQL database and Redis caching layer.",
)
async def readiness_check(
    db: AsyncSession = Depends(get_db),
    redis: Optional[Redis] = Depends(get_redis),
) -> ReadinessResponse:
    # 1. Database check
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        db_status = f"unreachable: {exc}"

    # 2. Redis check
    if redis is not None:
        try:
            await redis.ping()
            redis_status = "connected"
        except Exception as exc:
            redis_status = f"error: {exc}"
    else:
        redis_status = "fallback_memory"

    all_ready = db_status == "connected"
    return ReadinessResponse(
        status="ready" if all_ready else "degraded",
        database=db_status,
        redis=redis_status,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
