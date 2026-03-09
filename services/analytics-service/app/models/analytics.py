"""
SQLAlchemy ORM model for student performance analytics records.

Defines the database table schema for the PerformanceRecord entity.
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class PerformanceRecord(Base):
    """
    ORM model representing a student performance analytics record.

    Captures assessment scores and competency data for analysis.
    Maps to the 'performance_records' table in PostgreSQL.
    """

    __tablename__ = "performance_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    student_id = Column(String(255), nullable=False, index=True)
    school_id = Column(String(255), nullable=False, index=True)
    subject = Column(String(100), nullable=False)
    grade_level = Column(String(50), nullable=False)
    assessment_id = Column(String(255), nullable=True)
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False, default=100.0)
    competency_area = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
