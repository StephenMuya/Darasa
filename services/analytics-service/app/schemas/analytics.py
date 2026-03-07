"""
Pydantic schemas for request and response validation of analytics records.

These schemas are used by the FastAPI endpoints for serialization/deserialization.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class PerformanceRecordBase(BaseModel):
    """Shared fields used by create and update schemas."""

    student_id: str = Field(..., min_length=1, max_length=255, description="Student identifier")
    school_id: str = Field(..., min_length=1, max_length=255, description="School identifier")
    subject: str = Field(..., min_length=1, max_length=100, description="Academic subject")
    grade_level: str = Field(..., min_length=1, max_length=50, description="Student's grade level")
    assessment_id: Optional[str] = Field(None, max_length=255, description="Associated assessment ID")
    score: float = Field(..., ge=0, description="Score achieved")
    max_score: float = Field(100.0, ge=1, description="Maximum possible score")
    competency_area: Optional[str] = Field(None, max_length=255, description="CBC competency area")
    notes: Optional[str] = Field(None, description="Additional notes")
    recorded_at: Optional[datetime] = Field(None, description="When the record was taken")


class PerformanceRecordCreate(PerformanceRecordBase):
    """Schema for creating a new performance record."""
    pass


class PerformanceRecordUpdate(BaseModel):
    """Schema for updating an existing performance record (all fields optional)."""

    score: Optional[float] = Field(None, ge=0)
    max_score: Optional[float] = Field(None, ge=1)
    competency_area: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None


class PerformanceRecordResponse(PerformanceRecordBase):
    """Schema for returning a performance record in API responses."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StudentSummary(BaseModel):
    """Aggregated performance summary for a single student."""

    student_id: str
    school_id: str
    total_records: int
    average_score: float
    subjects: List[str]
