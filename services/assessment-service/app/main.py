"""
Assessment Service - FastAPI Application Entry Point.

This service manages competency-based assessments for the SomaAI platform,
providing endpoints for creating, managing, and retrieving student assessments.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import assessments
from app.core.config import settings
from app.db.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown events."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    description="Assessment Service for managing competency-based assessments in the CBC ecosystem.",
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

app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["assessments"])


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint to verify the service is running."""
    return {"status": "healthy", "service": settings.APP_NAME, "version": settings.APP_VERSION}
