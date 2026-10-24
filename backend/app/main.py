import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import Base, engine
from app.core.exceptions import DomainException
from app.core.redis_client import close_redis, init_redis

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("darasa.api")
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application Lifespan Event Handler
    Initializes database schema and Redis pool on startup;
    Gracefully cleans up connection pools on shutdown.
    """
    logger.info("Initializing Darasa Backend [%s environment]...", settings.ENVIRONMENT)

    # 1. Initialize DB tables (for development / testing environments)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema verified.")
    except Exception as exc:
        logger.error("Database connection initialization failed: %s", exc)

    # 2. Initialize Redis connection pool
    await init_redis()

    yield

    # 3. Shutdown cleanup
    logger.info("Shutting down Darasa Backend...")
    await close_redis()
    await engine.dispose()
    logger.info("Database and Redis connections closed.")


def create_application() -> FastAPI:
    """FastAPI Application Factory."""
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description=(
            "Pedagogical Intelligence API for Kenya CBC (Competency-Based Curriculum). "
            "Integrates formative assessment rubrics, zero-cost materials reasoning, "
            "and multi-turn educational inquiry with PostgreSQL and Redis."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Domain Exception Handler
    @application.exception_handler(DomainException)
    async def domain_exception_handler(
        request: Request, exc: DomainException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": exc.message},
        )

    # Mount API Router
    application.include_router(api_router, prefix=settings.API_V1_PREFIX)

    return application


app = create_application()
