"""
Pydantic v2 Storage Schemas
Single responsibility: define input/output data contracts for AWS S3
file uploads, downloads, pre-signed URLs, and object metadata.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class S3FileMetadata(BaseModel):
    """Metadata representation of an S3 object."""

    key: str = Field(..., description="Unique S3 object key / path")
    size_bytes: int = Field(..., ge=0, description="Size of file in bytes")
    content_type: str = Field(
        default="application/octet-stream", description="MIME type of object"
    )
    last_modified: Optional[datetime] = Field(
        default=None, description="Timestamp when object was last modified"
    )
    etag: Optional[str] = Field(default=None, description="S3 entity tag (hash)")


class PresignedDownloadResponse(BaseModel):
    """Response payload for time-limited download URL."""

    key: str
    download_url: str
    expires_in_seconds: int = 3600


class PresignedUploadRequest(BaseModel):
    """Request payload to initiate a direct browser-to-S3 upload."""

    key: str = Field(..., description="Target S3 key path (e.g. portfolios/user1/art.pdf)")
    content_type: str = Field(default="application/pdf", description="MIME type of file")
    expires_in_seconds: int = Field(default=1800, ge=60, le=86400)


class PresignedUploadResponse(BaseModel):
    """Response containing signed POST URL and form fields for direct S3 upload."""

    key: str
    upload_url: str
    fields: Dict[str, Any]
    expires_in_seconds: int


class FileListResponse(BaseModel):
    """List response for S3 objects under a prefix."""

    prefix: str
    files: List[S3FileMetadata]
    total_count: int


class UploadSuccessResponse(BaseModel):
    """Response after server-side file upload completion."""

    key: str
    bucket: str
    size_bytes: int
    content_type: str
    download_url: Optional[str] = None


class FileDeleteResponse(BaseModel):
    """Confirmation of S3 object deletion."""

    key: str
    deleted: bool
    message: str
