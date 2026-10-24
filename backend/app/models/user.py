from enum import Enum
from typing import TYPE_CHECKING, List

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.conversation import Conversation


class UserRole(str, Enum):
    TEACHER = "teacher"
    LEARNER = "learner"
    PARENT = "parent"
    ADMIN = "admin"


class User(Base, TimestampMixin):
    """
    User Account Model
    Single responsibility: represent system user accounts, roles, and credentials.
    """

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    role: Mapped[str] = mapped_column(
        String(30),
        default=UserRole.TEACHER.value,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation",
        back_populates="user",
        cascade="all, delete-orphan",
    )
