import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check_returns_ok(client: AsyncClient):
    """GET /api/v1/health should return 200 and status ok."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "app_name" in data
    assert "environment" in data


@pytest.mark.asyncio
async def test_readiness_check_verifies_services(client: AsyncClient):
    """GET /api/v1/ready should return 200 and evaluate DB and Redis connectivity."""
    response = await client.get("/api/v1/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ready", "degraded"]
    assert data["database"] == "connected"
    assert "redis" in data
    assert "timestamp" in data
