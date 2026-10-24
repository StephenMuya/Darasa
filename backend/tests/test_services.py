import pytest

from app.services.cache_service import CacheService
from app.services.cbc_inquiry_service import CBCInquiryService
from app.services.password_service import PasswordService
from app.services.token_service import TokenService


def test_password_service_hash_and_verify():
    """PasswordService should hash and correctly verify passwords."""
    plain = "KenyaCBC#2026!"
    hashed = PasswordService.hash(plain)

    assert hashed != plain
    assert PasswordService.verify(plain, hashed) is True
    assert PasswordService.verify("WrongPassword", hashed) is False


def test_token_service_generate_and_verify():
    """TokenService should encode and decode claims payload."""
    user_id = "user-12345"
    email = "test@darasa.app"
    role = "teacher"

    token = TokenService.generate_token(user_id=user_id, email=email, role=role)
    assert isinstance(token, str)

    payload = TokenService.verify_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["email"] == email
    assert payload["role"] == role


@pytest.mark.asyncio
async def test_cache_service_fallback_memory_crud():
    """CacheService memory fallback should store, retrieve, and delete values."""
    cache = CacheService(redis=None)

    key = "test_key_1"
    data = {"message": "Hello CBC", "grade": 6}

    # Set
    success = await cache.set_json(key, data)
    assert success is True

    # Get
    retrieved = await cache.get_json(key)
    assert retrieved == data

    # Delete
    deleted = await cache.delete(key)
    assert deleted is True

    # Re-get returns None
    assert await cache.get_json(key) is None


def test_cbc_inquiry_service_generates_materials_response():
    """CBCInquiryService should return materials list for practical queries."""
    result = CBCInquiryService.generate_pedagogical_response(
        "How to improvise bottle drip irrigation?"
    )
    assert result["materials"] is not None
    assert len(result["materials"]) > 0
    assert result["rubric"] is None
    assert len(result["follow_ups"]) > 0


def test_cbc_inquiry_service_generates_rubric_response():
    """CBCInquiryService should return 4-tier rubric for rubric assessment queries."""
    result = CBCInquiryService.generate_pedagogical_response(
        "Provide a formative assessment rubric for Agriculture"
    )
    assert result["rubric"] is not None
    assert result["materials"] is None
    assert "Exceeding Expectations" in result["rubric"].ee
