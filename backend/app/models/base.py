import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

__all__ = ["Base", "TimestampMixin", "generate_uuid"]


def generate_uuid() -> str:
    """Generate a clean 32-character hex UUID string."""
    return uuid.uuid4().hex


class TimestampMixin:
    """Mixin adding created_at and updated_at timezone-aware timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
