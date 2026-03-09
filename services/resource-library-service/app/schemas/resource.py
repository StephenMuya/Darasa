"""
Pydantic schemas for request and response validation of educational resources.

These schemas are used by the FastAPI endpoints for serialization/deserialization.
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.models.resource import ResourceType


class ResourceBase(BaseModel):
    """Shared fields used by create and update schemas."""

    title: str = Field(..., min_length=1, max_length=255, description="Title of the resource")
    description: Optional[str] = Field(None, description="Detailed description of the resource")
    resource_type: ResourceType = Field(..., description="Type of educational resource")
    subject: str = Field(..., min_length=1, max_length=100, description="Academic subject")
    grade_level: str = Field(..., min_length=1, max_length=50, description="Target grade level")
    author: Optional[str] = Field(None, max_length=255, description="Author or creator of the resource")
    url: Optional[str] = Field(None, description="URL to access the resource")


class ResourceCreate(ResourceBase):
    """Schema for creating a new resource."""
    pass


class ResourceUpdate(BaseModel):
    """Schema for updating an existing resource (all fields optional)."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    resource_type: Optional[ResourceType] = None
    subject: Optional[str] = Field(None, min_length=1, max_length=100)
    grade_level: Optional[str] = Field(None, min_length=1, max_length=50)
    author: Optional[str] = Field(None, max_length=255)
    url: Optional[str] = None


class ResourceResponse(ResourceBase):
    """Schema for returning a resource in API responses."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
