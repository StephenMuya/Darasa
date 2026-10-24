from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings
    Single responsibility: manage all configuration, environment variables,
    and external API placeholder tokens in a type-safe manner.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # --- Core Application ---
    PROJECT_NAME: str = "Darasa Educational Intelligence Backend"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # --- Server & CORS ---
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://darasa.app",
    ]

    # --- Database (PostgreSQL + asyncpg / SQLite for testing) ---
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:password@localhost:5432/darasa_db"
    )
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # --- Redis Cache ---
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_EXPIRE_SECONDS: int = 3600

    # --- Security & JWT ---
    SECRET_KEY: str = "darasa_dev_secret_key_change_in_production_min32chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # =========================================================================
    # External API Placeholders & Integrations
    # =========================================================================

    # --- LLM Providers ---
    OPENAI_API_KEY: str = "PLACEHOLDER_OPENAI_API_KEY"
    OPENAI_MODEL: str = "gpt-4o"

    ANTHROPIC_API_KEY: str = "PLACEHOLDER_ANTHROPIC_API_KEY"
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20241022"

    GOOGLE_GEMINI_API_KEY: str = "PLACEHOLDER_GOOGLE_GEMINI_API_KEY"
    GOOGLE_GEMINI_MODEL: str = "gemini-1.5-pro"

    # --- Vector Index & Embeddings ---
    EMBEDDING_API_KEY: str = "PLACEHOLDER_EMBEDDING_API_KEY"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    PINECONE_API_KEY: str = "PLACEHOLDER_PINECONE_API_KEY"
    PINECONE_INDEX_NAME: str = "kicd-cbc-curriculum-index"

    # --- Kenya NEMIS SSO Portal ---
    NEMIS_BASE_URL: str = "https://api.nemis.education.go.ke"
    NEMIS_CLIENT_ID: str = "PLACEHOLDER_NEMIS_CLIENT_ID"
    NEMIS_CLIENT_SECRET: str = "PLACEHOLDER_NEMIS_CLIENT_SECRET"
    NEMIS_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/nemis/callback"

    # --- Payment Gateway (M-Pesa Daraja) ---
    MPESA_ENVIRONMENT: str = "sandbox"
    MPESA_CONSUMER_KEY: str = "PLACEHOLDER_MPESA_CONSUMER_KEY"
    MPESA_CONSUMER_SECRET: str = "PLACEHOLDER_MPESA_CONSUMER_SECRET"
    MPESA_PASSKEY: str = "PLACEHOLDER_MPESA_PASSKEY"
    MPESA_SHORTCODE: str = "174379"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def has_valid_openai_key(self) -> bool:
        return bool(
            self.OPENAI_API_KEY and not self.OPENAI_API_KEY.startswith("PLACEHOLDER")
        )

    @property
    def has_valid_gemini_key(self) -> bool:
        return bool(
            self.GOOGLE_GEMINI_API_KEY
            and not self.GOOGLE_GEMINI_API_KEY.startswith("PLACEHOLDER")
        )


@lru_cache
def get_settings() -> Settings:
    """Singleton getter for cached application settings."""
    return Settings()
