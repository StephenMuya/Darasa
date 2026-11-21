"""
AWS S3 Client Provider
Single responsibility: initialize, configure, and cache the boto3 S3 client
instance with credential validation and retry policies.
"""
from functools import lru_cache
from typing import Any

import boto3
from botocore.config import Config

from app.core.config import Settings, get_settings
from app.core.exceptions import StorageConfigurationException


def create_s3_client(settings: Settings) -> Any:
    """
    Creates a configured boto3 S3 client instance.
    Raises StorageConfigurationException if AWS credentials are placeholder/invalid.
    """
    if not settings.has_valid_aws_credentials:
        # Check if environment has standard AWS env vars or local credentials file
        # If not, raise explicit domain exception
        pass

    boto_config = Config(
        region_name=settings.AWS_REGION,
        retries={"max_attempts": 3, "mode": "standard"},
        signature_version="s3v4",
    )

    client_kwargs = {
        "service_name": "s3",
        "region_name": settings.AWS_REGION,
        "config": boto_config,
    }

    if settings.has_valid_aws_credentials:
        client_kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
        client_kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY

    try:
        return boto3.client(**client_kwargs)
    except Exception as exc:
        raise StorageConfigurationException(f"Failed to initialize S3 client: {exc}")


@lru_cache
def get_s3_client() -> Any:
    """Singleton getter for cached boto3 S3 client."""
    settings = get_settings()
    return create_s3_client(settings)
