"""
Pydantic schemas for request and response validation of assessments.

These schemas are used by the FastAPI endpoints for serialization/deserialization.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.models.assessment import AssessmentType, AssessmentStatus


class AssessmentBase(BaseModel):
    """Shared fields used by create and update schemas."""

    title: str = Field(..., min_length=1, max_length=255, description="Title of the assessment")
    description: Optional[str] = Field(None, description="Detailed description")
    assessment_type: AssessmentType = Field(..., description="Type of assessment")
    subject: str = Field(..., min_length=1, max_length=100, description="Academic subject")
    grade_level: str = Field(..., min_length=1, max_length=50, description="Target grade level")
    total_marks: float = Field(100.0, ge=0, description="Total marks available")
    duration_minutes: Optional[int] = Field(None, ge=1, description="Duration in minutes")
    status: AssessmentStatus = Field(AssessmentStatus.DRAFT, description="Assessment status")
    created_by: Optional[str] = Field(None, max_length=255, description="Creator identifier")


class AssessmentCreate(AssessmentBase):
    """Schema for creating a new assessment."""
    pass


class AssessmentUpdate(BaseModel):
    """Schema for updating an existing assessment (all fields optional)."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    assessment_type: Optional[AssessmentType] = None
    subject: Optional[str] = Field(None, min_length=1, max_length=100)
    grade_level: Optional[str] = Field(None, min_length=1, max_length=50)
    total_marks: Optional[float] = Field(None, ge=0)
    duration_minutes: Optional[int] = Field(None, ge=1)
    status: Optional[AssessmentStatus] = None
    created_by: Optional[str] = Field(None, max_length=255)


class AssessmentResponse(AssessmentBase):
    """Schema for returning an assessment in API responses."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
