"""
SQLAlchemy ORM model for educational resources.

Defines the database table schema for the Resource entity.
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.db.database import Base


class ResourceType(str, enum.Enum):
    """Enumeration of supported resource types."""
    TEXTBOOK = "textbook"
    DIGITAL_CONTENT = "digital_content"
    TEACHING_MATERIAL = "teaching_material"
    VIDEO = "video"
    WORKSHEET = "worksheet"


class Resource(Base):
    """
    ORM model representing an educational resource in the library.

    Maps to the 'resources' table in PostgreSQL.
    """

    __tablename__ = "resources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    resource_type = Column(SAEnum(ResourceType), nullable=False)
    subject = Column(String(100), nullable=False)
    grade_level = Column(String(50), nullable=False)
    author = Column(String(255), nullable=True)
    url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
