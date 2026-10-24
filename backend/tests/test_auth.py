import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_teacher_user_success(client: AsyncClient):
    """POST /api/v1/auth/register should create user and return 201."""
    payload = {
        "email": "wanjiku@darasa.ac.ke",
        "full_name": "Wanjiku Mwangi",
        "password": "SecurePassword123!",
        "role": "teacher",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "wanjiku@darasa.ac.ke"
    assert data["full_name"] == "Wanjiku Mwangi"
    assert data["role"] == "teacher"
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email_fails(client: AsyncClient):
    """POST /api/v1/auth/register with already registered email should return 400."""
    payload = {
        "email": "duplicate@darasa.ac.ke",
        "full_name": "First User",
        "password": "SecurePassword123!",
        "role": "learner",
    }
    first_resp = await client.post("/api/v1/auth/register", json=payload)
    assert first_resp.status_code == 201

    second_resp = await client.post("/api/v1/auth/register", json=payload)
    assert second_resp.status_code == 400
    assert "already exists" in second_resp.json()["detail"]


@pytest.mark.asyncio
async def test_register_invalid_email_format(client: AsyncClient):
    """POST /api/v1/auth/register with invalid email format should return 422."""
    payload = {
        "email": "not-an-email",
        "full_name": "Test User",
        "password": "ValidPassword123!",
        "role": "parent",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    """POST /api/v1/auth/login with valid credentials should return 200 with JWT token."""
    # 1. Register
    reg_payload = {
        "email": "login_user@school.ac.ke",
        "full_name": "Login User",
        "password": "CorrectPassword123!",
        "role": "teacher",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # 2. Login
    login_payload = {
        "email": "login_user@school.ac.ke",
        "password": "CorrectPassword123!",
    }
    response = await client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login_user@school.ac.ke"


@pytest.mark.asyncio
async def test_login_invalid_password_fails(client: AsyncClient):
    """POST /api/v1/auth/login with wrong password should return 401."""
    login_payload = {
        "email": "mwalimu_test@school.ac.ke",
        "password": "WrongPassword999!",
    }
    response = await client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_me_with_valid_token(client: AsyncClient, auth_headers: dict):
    """GET /api/v1/auth/me with Bearer token should return profile."""
    response = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "mwalimu_test@school.ac.ke"
    assert data["full_name"] == "Mwalimu Kiprono"


@pytest.mark.asyncio
async def test_get_me_without_token_fails(client: AsyncClient):
    """GET /api/v1/auth/me without Bearer token should return 401."""
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
