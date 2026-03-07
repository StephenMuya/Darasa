"""
Analytics Service - FastAPI Application Entry Point.

This service provides data analytics and student performance tracking for the SomaAI platform,
enabling schools to analyze learning outcomes and inform instruction.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import analytics
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
    description="Analytics Service for tracking student performance and providing data insights.",
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

app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint to verify the service is running."""
    return {"status": "healthy", "service": settings.APP_NAME, "version": settings.APP_VERSION}
