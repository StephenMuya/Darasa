"""
Resource Library Service - FastAPI Application Entry Point.

This service manages educational resources for the SomaAI platform,
providing CRUD operations for textbooks, digital content, and teaching materials.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import resources
from app.core.config import settings
from app.db.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown events."""
    # Create database tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Dispose the engine on shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    description="Resource Library Service for managing educational materials in the CBC ecosystem.",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(resources.router, prefix="/api/v1/resources", tags=["resources"])


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint to verify the service is running."""
    return {"status": "healthy", "service": settings.APP_NAME, "version": settings.APP_VERSION}
