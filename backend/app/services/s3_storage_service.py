"""
AWS S3 Storage Service
Single responsibility: orchestrate asynchronous S3 operations (upload, download,
pre-signed URLs, listing, and metadata retrieval) for curriculum blueprints and student portfolios.
"""
import asyncio
from typing import Any, BinaryIO, List, Optional
from botocore.exceptions import ClientError

from app.core.config import get_settings
from app.core.exceptions import (
    StorageException,
    StorageFileNotFoundException,
    StorageUploadException,
)
from app.core.s3_client import get_s3_client
from app.schemas.storage import S3FileMetadata


class S3StorageService:
    """
    High-level asynchronous storage service for S3.
    Executes blocking boto3 calls inside asyncio.to_thread for optimal non-blocking performance.
    """

    def __init__(self, s3_client: Optional[Any] = None, bucket_name: Optional[str] = None):
        settings = get_settings()
        self._s3_client = s3_client if s3_client is not None else get_s3_client()
        self.bucket_name = bucket_name or settings.S3_BUCKET_NAME

    async def upload_bytes(
        self,
        data: bytes,
        key: str,
        content_type: str = "application/octet-stream",
    ) -> S3FileMetadata:
        """Upload raw bytes to S3 and return file metadata."""
        clean_key = key.lstrip("/")
        try:
            await asyncio.to_thread(
                self._s3_client.put_object,
                Bucket=self.bucket_name,
                Key=clean_key,
                Body=data,
                ContentType=content_type,
            )
            return S3FileMetadata(
                key=clean_key,
                size_bytes=len(data),
                content_type=content_type,
            )
        except Exception as exc:
            raise StorageUploadException(f"Failed to upload bytes to '{clean_key}': {exc}")

    async def upload_fileobj(
        self,
        fileobj: BinaryIO,
        key: str,
        content_type: str = "application/octet-stream",
    ) -> S3FileMetadata:
        """Upload a file-like stream object to S3."""
        clean_key = key.lstrip("/")
        try:
            extra_args = {"ContentType": content_type}
            await asyncio.to_thread(
                self._s3_client.upload_fileobj,
                fileobj,
                self.bucket_name,
                clean_key,
                ExtraArgs=extra_args,
            )
            return await self.get_metadata(clean_key)
        except Exception as exc:
            raise StorageUploadException(f"Failed to upload stream to '{clean_key}': {exc}")

    async def download_bytes(self, key: str) -> bytes:
        """
        Download S3 object contents directly into memory as bytes.
        Essential for LLM table extraction & blueprint parsing.
        """
        clean_key = key.lstrip("/")
        try:
            response = await asyncio.to_thread(
                self._s3_client.get_object,
                Bucket=self.bucket_name,
                Key=clean_key,
            )
            body = response["Body"]
            content = await asyncio.to_thread(body.read)
            return content
        except ClientError as exc:
            error_code = exc.response.get("Error", {}).get("Code", "")
            if error_code in ("404", "NoSuchKey"):
                raise StorageFileNotFoundException(f"S3 object '{clean_key}' not found.")
            raise StorageException(f"S3 download failed for '{clean_key}': {exc}")
        except Exception as exc:
            raise StorageException(f"Unexpected error downloading '{clean_key}': {exc}")

    async def generate_presigned_download_url(
        self, key: str, expires_in: int = 3600
    ) -> str:
        """Generate a secure, time-limited GET URL for client downloads/viewing."""
        clean_key = key.lstrip("/")
        try:
            url = await asyncio.to_thread(
                self._s3_client.generate_presigned_url,
                ClientMethod="get_object",
                Params={"Bucket": self.bucket_name, "Key": clean_key},
                ExpiresIn=expires_in,
            )
            return url
        except Exception as exc:
            raise StorageException(
                f"Failed to generate pre-signed download URL for '{clean_key}': {exc}"
            )

    async def generate_presigned_upload_post(
        self,
        key: str,
        content_type: str = "application/pdf",
        expires_in: int = 1800,
        max_size_mb: int = 50,
    ) -> dict:
        """
        Generate pre-signed POST policy for direct client-to-S3 uploads.
        Bypasses server bandwidth for large files (e.g. portfolio videos/PDFs).
        """
        clean_key = key.lstrip("/")
        max_bytes = max_size_mb * 1024 * 1024
        try:
            fields = {"Content-Type": content_type}
            conditions = [
                {"Content-Type": content_type},
                ["content-length-range", 1, max_bytes],
            ]
            response = await asyncio.to_thread(
                self._s3_client.generate_presigned_post,
                Bucket=self.bucket_name,
                Key=clean_key,
                Fields=fields,
                Conditions=conditions,
                ExpiresIn=expires_in,
            )
            return response
        except Exception as exc:
            raise StorageException(
                f"Failed to generate pre-signed upload URL for '{clean_key}': {exc}"
            )

    async def list_files(
        self, prefix: str = "", max_keys: int = 1000
    ) -> List[S3FileMetadata]:
        """List objects under a specific S3 prefix (e.g. 'curriculum-raw/upper-primary/')."""
        clean_prefix = prefix.lstrip("/")
        try:
            response = await asyncio.to_thread(
                self._s3_client.list_objects_v2,
                Bucket=self.bucket_name,
                Prefix=clean_prefix,
                MaxKeys=max_keys,
            )
            items = []
            for item in response.get("Contents", []):
                key = item.get("Key", "")
                # Skip 0-byte prefix folder placeholders ending with '/'
                if key.endswith("/") and item.get("Size", 0) == 0:
                    continue
                items.append(
                    S3FileMetadata(
                        key=key,
                        size_bytes=item.get("Size", 0),
                        last_modified=item.get("LastModified"),
                        etag=item.get("ETag", "").strip('"'),
                    )
                )
            return items
        except Exception as exc:
            raise StorageException(f"Failed to list objects under '{clean_prefix}': {exc}")

    async def get_metadata(self, key: str) -> S3FileMetadata:
        """Fetch head metadata for an S3 object."""
        clean_key = key.lstrip("/")
        try:
            resp = await asyncio.to_thread(
                self._s3_client.head_object,
                Bucket=self.bucket_name,
                Key=clean_key,
            )
            return S3FileMetadata(
                key=clean_key,
                size_bytes=resp.get("ContentLength", 0),
                content_type=resp.get("ContentType", "application/octet-stream"),
                last_modified=resp.get("LastModified"),
                etag=resp.get("ETag", "").strip('"'),
            )
        except ClientError as exc:
            error_code = exc.response.get("Error", {}).get("Code", "")
            if error_code in ("404", "NoSuchKey"):
                raise StorageFileNotFoundException(f"Object '{clean_key}' does not exist.")
            raise StorageException(f"Metadata lookup failed for '{clean_key}': {exc}")

    async def delete_file(self, key: str) -> bool:
        """Delete an object from S3."""
        clean_key = key.lstrip("/")
        try:
            await asyncio.to_thread(
                self._s3_client.delete_object,
                Bucket=self.bucket_name,
                Key=clean_key,
            )
            return True
        except Exception as exc:
            raise StorageException(f"Failed to delete '{clean_key}': {exc}")
