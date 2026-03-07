"""
SQLAlchemy ORM model for competency-based assessments.

Defines the database table schema for the Assessment entity.
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, Float, Integer, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.db.database import Base


class AssessmentType(str, enum.Enum):
    """Enumeration of supported assessment types in the CBC framework."""
    FORMATIVE = "formative"
    SUMMATIVE = "summative"
    DIAGNOSTIC = "diagnostic"
    PROJECT = "project"
    OBSERVATION = "observation"


class AssessmentStatus(str, enum.Enum):
    """Enumeration of assessment lifecycle statuses."""
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"


class Assessment(Base):
    """
    ORM model representing a competency-based assessment.

    Maps to the 'assessments' table in PostgreSQL.
    """

    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    assessment_type = Column(SAEnum(AssessmentType), nullable=False)
    subject = Column(String(100), nullable=False)
    grade_level = Column(String(50), nullable=False)
    total_marks = Column(Float, nullable=False, default=100.0)
    duration_minutes = Column(Integer, nullable=True)
    status = Column(SAEnum(AssessmentStatus), nullable=False, default=AssessmentStatus.DRAFT)
    created_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
