"""
Storage REST Endpoints
Single responsibility: expose HTTP API for S3 object operations,
pre-signed URL generation, blueprint retrieval, and student portfolio uploads.
"""
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Query,
    UploadFile,
    status,
)

from app.core.exceptions import (
    StorageFileNotFoundException,
    raise_http_bad_request,
    raise_http_not_found,
)
from app.schemas.storage import (
    FileDeleteResponse,
    FileListResponse,
    PresignedDownloadResponse,
    PresignedUploadRequest,
    PresignedUploadResponse,
    S3FileMetadata,
    UploadSuccessResponse,
)
from app.services.s3_storage_service import S3StorageService

router = APIRouter()


def get_storage_service() -> S3StorageService:
    """Dependency provider for S3StorageService."""
    return S3StorageService()


@router.post(
    "/upload",
    response_model=UploadSuccessResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload File to S3",
    description="Upload multipart file (KICD PDF or student portfolio evidence) directly to S3.",
)
async def upload_file(
    file: UploadFile = File(...),
    prefix: str = Form("portfolios/general"),
    service: S3StorageService = Depends(get_storage_service),
) -> UploadSuccessResponse:
    if not file.filename:
        raise_http_bad_request("Filename must not be empty.")

    clean_prefix = prefix.strip("/")
    target_key = f"{clean_prefix}/{file.filename}"
    content_type = file.content_type or "application/octet-stream"

    try:
        metadata = await service.upload_fileobj(
            fileobj=file.file,
            key=target_key,
            content_type=content_type,
        )
        download_url = await service.generate_presigned_download_url(target_key)
        return UploadSuccessResponse(
            key=target_key,
            bucket=service.bucket_name,
            size_bytes=metadata.size_bytes,
            content_type=metadata.content_type,
            download_url=download_url,
        )
    except Exception as exc:
        raise_http_bad_request(f"Failed to upload file: {exc}")


@router.get(
    "/presigned-download",
    response_model=PresignedDownloadResponse,
    summary="Generate Pre-signed Download URL",
    description="Obtain secure, time-limited download URL to access a KICD blueprint or portfolio item.",
)
async def get_presigned_download_url(
    key: str = Query(..., description="Target S3 key (e.g. curriculum-raw/upper-primary/file.pdf)"),
    expires_in: int = Query(3600, ge=60, le=86400, description="Expiration time in seconds"),
    service: S3StorageService = Depends(get_storage_service),
) -> PresignedDownloadResponse:
    try:
        url = await service.generate_presigned_download_url(key=key, expires_in=expires_in)
        return PresignedDownloadResponse(
            key=key,
            download_url=url,
            expires_in_seconds=expires_in,
        )
    except StorageFileNotFoundException as exc:
        raise_http_not_found(exc.message)
    except Exception as exc:
        raise_http_bad_request(str(exc))


@router.post(
    "/presigned-upload",
    response_model=PresignedUploadResponse,
    summary="Generate Pre-signed Upload Policy",
    description="Generate pre-signed POST policy for direct browser-to-S3 uploads.",
)
async def get_presigned_upload_url(
    data: PresignedUploadRequest,
    service: S3StorageService = Depends(get_storage_service),
) -> PresignedUploadResponse:
    try:
        result = await service.generate_presigned_upload_post(
            key=data.key,
            content_type=data.content_type,
            expires_in=data.expires_in_seconds,
        )
        return PresignedUploadResponse(
            key=data.key,
            upload_url=result.get("url", ""),
            fields=result.get("fields", {}),
            expires_in_seconds=data.expires_in_seconds,
        )
    except Exception as exc:
        raise_http_bad_request(str(exc))


@router.get(
    "/files",
    response_model=FileListResponse,
    summary="List S3 Files by Prefix",
    description="List all blueprints or portfolio items under a specified directory prefix.",
)
async def list_files(
    prefix: str = Query("", description="Folder prefix (e.g. curriculum-raw/upper-primary/)"),
    max_keys: int = Query(100, ge=1, le=1000),
    service: S3StorageService = Depends(get_storage_service),
) -> FileListResponse:
    try:
        items = await service.list_files(prefix=prefix, max_keys=max_keys)
        return FileListResponse(
            prefix=prefix,
            files=items,
            total_count=len(items),
        )
    except Exception as exc:
        raise_http_bad_request(str(exc))


@router.get(
    "/metadata",
    response_model=S3FileMetadata,
    summary="Get S3 Object Metadata",
    description="Inspect size, MIME type, and last modified timestamp for an S3 object.",
)
async def get_file_metadata(
    key: str = Query(...),
    service: S3StorageService = Depends(get_storage_service),
) -> S3FileMetadata:
    try:
        return await service.get_metadata(key=key)
    except StorageFileNotFoundException as exc:
        raise_http_not_found(exc.message)
    except Exception as exc:
        raise_http_bad_request(str(exc))


@router.delete(
    "/file",
    response_model=FileDeleteResponse,
    summary="Delete S3 Object",
    description="Remove an object from the S3 bucket.",
)
async def delete_file(
    key: str = Query(...),
    service: S3StorageService = Depends(get_storage_service),
) -> FileDeleteResponse:
    try:
        deleted = await service.delete_file(key=key)
        return FileDeleteResponse(
            key=key,
            deleted=deleted,
            message=f"Object '{key}' successfully deleted.",
        )
    except Exception as exc:
        raise_http_bad_request(str(exc))
