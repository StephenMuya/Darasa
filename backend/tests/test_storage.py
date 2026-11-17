"""
Unit and Integration Tests for AWS S3 Storage Service & API Endpoints
Single responsibility: verify storage domain service and HTTP controllers
using isolated mocks with 100% test reliability and zero external AWS network calls.
"""
from io import BytesIO
from unittest.mock import MagicMock

from botocore.exceptions import ClientError
from httpx import ASGITransport, AsyncClient
import pytest

from app.core.exceptions import StorageFileNotFoundException
from app.main import app
from app.services.s3_storage_service import S3StorageService


@pytest.fixture
def mock_s3_client():
    """Mock boto3 S3 client."""
    mock = MagicMock()
    # Mock put_object
    mock.put_object.return_value = {"ETag": '"test-etag"'}
    # Mock get_object
    mock_body = MagicMock()
    mock_body.read.return_value = b"%PDF-1.4 Mock Curriculum Blueprint Content"
    mock.get_object.return_value = {"Body": mock_body}
    # Mock generate_presigned_url
    mock.generate_presigned_url.return_value = (
        "https://mock-s3.amazonaws.com/test.pdf?X-Amz-Signature=mock"
    )
    # Mock generate_presigned_post
    mock.generate_presigned_post.return_value = {
        "url": "https://mock-s3.amazonaws.com/",
        "fields": {"key": "test.pdf", "AWSAccessKeyId": "mock"},
    }
    # Mock list_objects_v2
    mock.list_objects_v2.return_value = {
        "Contents": [
            {
                "Key": "curriculum-raw/upper-primary/GRADE-5-AGRICULTURE.pdf",
                "Size": 1489320,
                "ETag": '"sample-etag-1"',
            },
            {
                "Key": "curriculum-raw/upper-primary/",
                "Size": 0,
            },
            {
                "Key": "curriculum-raw/upper-primary/GRADE.6.SOCIAL.STUDIES.pdf",
                "Size": 1204518,
                "ETag": '"sample-etag-2"',
            },
        ]
    }
    # Mock head_object
    mock.head_object.return_value = {
        "ContentLength": 1489320,
        "ContentType": "application/pdf",
        "ETag": '"sample-etag-1"',
    }
    # Mock delete_object
    mock.delete_object.return_value = {}
    return mock


@pytest.fixture
def storage_service(mock_s3_client):
    """Storage service instance with injected mock S3 client."""
    return S3StorageService(s3_client=mock_s3_client, bucket_name="darasa-test-bucket")


@pytest.mark.asyncio
async def test_upload_bytes_success(storage_service, mock_s3_client):
    data = b"Hello KICD Curriculum"
    meta = await storage_service.upload_bytes(data, "test.txt", "text/plain")

    assert meta.key == "test.txt"
    assert meta.size_bytes == len(data)
    assert meta.content_type == "text/plain"
    mock_s3_client.put_object.assert_called_once()


@pytest.mark.asyncio
async def test_download_bytes_success(storage_service):
    content = await storage_service.download_bytes("blueprints/grade5.pdf")
    assert b"Mock Curriculum Blueprint Content" in content


@pytest.mark.asyncio
async def test_download_bytes_not_found(storage_service, mock_s3_client):
    mock_s3_client.get_object.side_effect = ClientError(
        {"Error": {"Code": "NoSuchKey", "Message": "The specified key does not exist."}},
        "GetObject",
    )
    with pytest.raises(StorageFileNotFoundException):
        await storage_service.download_bytes("missing.pdf")


@pytest.mark.asyncio
async def test_generate_presigned_download_url(storage_service, mock_s3_client):
    url = await storage_service.generate_presigned_download_url("curriculum-raw/g5.pdf", expires_in=1800)
    assert "https://mock-s3.amazonaws.com/" in url
    mock_s3_client.generate_presigned_url.assert_called_once()


@pytest.mark.asyncio
async def test_generate_presigned_upload_post(storage_service, mock_s3_client):
    res = await storage_service.generate_presigned_upload_post("portfolios/student1/art.pdf")
    assert res["url"] == "https://mock-s3.amazonaws.com/"
    assert res["fields"]["key"] == "test.pdf"


@pytest.mark.asyncio
async def test_list_files_filters_directory_markers(storage_service):
    files = await storage_service.list_files(prefix="curriculum-raw/upper-primary/")
    assert len(files) == 2
    keys = [f.key for f in files]
    assert "curriculum-raw/upper-primary/GRADE-5-AGRICULTURE.pdf" in keys
    assert "curriculum-raw/upper-primary/GRADE.6.SOCIAL.STUDIES.pdf" in keys
    assert "curriculum-raw/upper-primary/" not in keys


@pytest.mark.asyncio
async def test_get_metadata_success(storage_service):
    meta = await storage_service.get_metadata("curriculum-raw/upper-primary/file.pdf")
    assert meta.size_bytes == 1489320
    assert meta.content_type == "application/pdf"


@pytest.mark.asyncio
async def test_delete_file_success(storage_service, mock_s3_client):
    deleted = await storage_service.delete_file("portfolios/user1/temp.png")
    assert deleted is True
    mock_s3_client.delete_object.assert_called_once()


@pytest.mark.asyncio
async def test_storage_api_upload_endpoint(monkeypatch, mock_s3_client):
    service = S3StorageService(s3_client=mock_s3_client, bucket_name="darasa-test-bucket")
    from app.api.v1.endpoints.storage import get_storage_service

    app.dependency_overrides[get_storage_service] = lambda: service

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        file_payload = {"file": ("student_craft.pdf", BytesIO(b"Sample PDF bytes"), "application/pdf")}
        response = await ac.post("/api/v1/storage/upload", files=file_payload, data={"prefix": "portfolios/user1"})

    app.dependency_overrides.clear()
    assert response.status_code == 201
    json_data = response.json()
    assert json_data["key"] == "portfolios/user1/student_craft.pdf"
    assert "download_url" in json_data


@pytest.mark.asyncio
async def test_storage_api_presigned_download_endpoint(monkeypatch, mock_s3_client):
    service = S3StorageService(s3_client=mock_s3_client, bucket_name="darasa-test-bucket")
    from app.api.v1.endpoints.storage import get_storage_service

    app.dependency_overrides[get_storage_service] = lambda: service

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get(
            "/api/v1/storage/presigned-download",
            params={"key": "curriculum-raw/upper-primary/GRADE-5-AGRICULTURE.pdf"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    json_data = response.json()
    assert "download_url" in json_data
    assert json_data["key"] == "curriculum-raw/upper-primary/GRADE-5-AGRICULTURE.pdf"


@pytest.mark.asyncio
async def test_storage_api_files_endpoint(monkeypatch, mock_s3_client):
    service = S3StorageService(s3_client=mock_s3_client, bucket_name="darasa-test-bucket")
    from app.api.v1.endpoints.storage import get_storage_service

    app.dependency_overrides[get_storage_service] = lambda: service

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get(
            "/api/v1/storage/files",
            params={"prefix": "curriculum-raw/upper-primary/"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["total_count"] == 2
    assert len(json_data["files"]) == 2
