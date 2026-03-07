"""
Configuration settings for the Assessment Service.

Uses Pydantic BaseSettings to load configuration from environment variables.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    APP_NAME: str = "Assessment Service"
    APP_VERSION: str = "1.0.0"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/assessment_db"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
