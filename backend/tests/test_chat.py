import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_inquiry_practical_materials_generation(client: AsyncClient):
    """POST /api/v1/chat/inquiry with materials query returns zero-cost list."""
    payload = {
        "query": "How do I teach soil conservation with zero-cost improvised materials?",
        "role": "teacher",
    }
    response = await client.post("/api/v1/chat/inquiry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "conversation_id" in data
    assert "message_id" in data
    assert data["materials"] is not None
    assert len(data["materials"]) > 0
    assert any("bottle" in m["item"].lower() for m in data["materials"])
    assert len(data["follow_ups"]) > 0


@pytest.mark.asyncio
async def test_inquiry_formative_rubric_generation(client: AsyncClient):
    """POST /api/v1/chat/inquiry with rubric query returns 4-tier rubric."""
    payload = {
        "query": "Generate a formative assessment rubric for Grade 6 Crop Production",
        "role": "teacher",
    }
    response = await client.post("/api/v1/chat/inquiry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["rubric"] is not None
    assert "Exceeding Expectations" in data["rubric"]["ee"]
    assert "Meeting Expectations" in data["rubric"]["me"]
    assert "Approaching Expectations" in data["rubric"]["ae"]
    assert "Below Expectations" in data["rubric"]["be"]


@pytest.mark.asyncio
async def test_conversation_creation_and_history(client: AsyncClient):
    """POST /api/v1/chat/conversations and subsequent GET history."""
    # 1. Create conversation
    create_resp = await client.post(
        "/api/v1/chat/conversations",
        json={"title": "Grade 5 Science Inquiry"},
    )
    assert create_resp.status_code == 201
    conv_id = create_resp.json()["id"]

    # 2. Dispatch turn linked to conversation
    inquiry_resp = await client.post(
        "/api/v1/chat/inquiry",
        json={
            "query": "What are local materials for simple water filter?",
            "conversation_id": conv_id,
        },
    )
    assert inquiry_resp.status_code == 200
    assert inquiry_resp.json()["conversation_id"] == conv_id

    # 3. Retrieve transcript
    history_resp = await client.get(f"/api/v1/chat/conversations/{conv_id}")
    assert history_resp.status_code == 200
    history_data = history_resp.json()
    assert history_data["id"] == conv_id
    assert len(history_data["messages"]) >= 2  # user message + darasa response
