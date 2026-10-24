from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Basic health check status."""

    status: str = Field(default="ok", example="ok")
    app_name: str
    environment: str
    version: str = "1.0.0"


class ReadinessResponse(BaseModel):
    """Readiness probe checking database and redis health."""

    status: str = Field(default="ready", example="ready")
    database: str
    redis: str
    timestamp: str


class StandardMessageResponse(BaseModel):
    """Standard message response for simple operations."""

    message: str
    success: bool = True
