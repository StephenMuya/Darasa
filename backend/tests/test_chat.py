"""
Chat endpoint integration tests.
Tests validate the structural shape of /api/v1/chat/inquiry responses after
the RAG wiring. Content assertions target structure (conversation_id, message_id,
text non-empty, follow_ups list) — NOT hardcoded heuristic text, which was
removed when CBCInquiryService was replaced by RagChatService.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.curriculum_chunk import CurriculumChunk


# ---------------------------------------------------------------------------
# Helper fixture — seed one curriculum chunk so retrieval has data to find
# ---------------------------------------------------------------------------

SAMPLE_CHUNK_CONTENT = (
    "Grade 5 Agriculture & Nutrition | Strand: 2.0 Crop Production | "
    "Sub-Strand: 2.3 Improvised Drip Irrigation | "
    "SLOs: Learner constructs an improvised drip irrigation model using locally "
    "available materials such as plastic bottles, sisal twine, and wooden pegs. "
    "Learner demonstrates water conservation by monitoring drip rate and soil "
    "moisture levels. | "
    "KIQs: How can we conserve water while irrigating crops? | "
    "Experiences: Learners work in groups to build and test drip models on "
    "sukuma wiki seedlings using zero-cost household materials."
)


@pytest.fixture(autouse=False)
async def seeded_chunk(db_session: AsyncSession):
    """
    Inserts a single curriculum chunk into the test DB so the RAG retrieval
    path returns at least one result without needing a live pgvector index.
    Uses a deterministic 1536-D vector (all 0.0 values are fine for SQLite tests
    since the vector similarity operator is not executed — SQLite falls back to
    a full scan stub).
    """
    chunk = CurriculumChunk(
        grade="Grade 5",
        learning_area="Agriculture & Nutrition",
        strand="2.0 Crop Production",
        sub_strand="2.3 Improvised Drip Irrigation",
        content=SAMPLE_CHUNK_CONTENT,
        embedding=[0.0] * 1536,
        metadata_json={
            "specific_learning_outcomes": [
                "Construct an improvised drip irrigation model",
                "Demonstrate water conservation techniques",
            ],
            "key_inquiry_questions": [
                "How can we conserve water while irrigating crops?",
            ],
            "suggested_learning_experiences": [
                "Build drip models using plastic bottles and sisal twine",
            ],
            "assessment_rubric": {
                "exceeding": "Designs and calculates drip rate with zero assistance.",
                "meeting": "Constructs model that maintains steady root-zone hydration.",
                "approaching": "Assembles with minor guidance on pinhole calibration.",
                "below": "Requires substantial scaffolding to demonstrate concept.",
            },
            "strand_code": "2.0",
            "sub_strand_code": "2.3",
        },
    )
    db_session.add(chunk)
    await db_session.commit()
    await db_session.refresh(chunk)
    return chunk


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_inquiry_returns_structural_response(client: AsyncClient):
    """POST /api/v1/chat/inquiry returns a valid InquiryResponse structure."""
    payload = {
        "query": "How do I teach soil conservation with zero-cost improvised materials?",
        "role": "teacher",
    }
    response = await client.post("/api/v1/chat/inquiry", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Structural shape assertions (independent of RAG content)
    assert "conversation_id" in data
    assert "message_id" in data
    assert "text" in data
    assert isinstance(data["text"], str)
    assert len(data["text"]) > 0
    assert "follow_ups" in data
    assert isinstance(data["follow_ups"], list)
    assert len(data["follow_ups"]) > 0


@pytest.mark.asyncio
async def test_inquiry_text_is_non_empty_for_any_query(client: AsyncClient):
    """Any valid query must return a non-empty text response (fallback or RAG)."""
    payload = {
        "query": "Generate a formative assessment rubric for Grade 5 Agriculture",
        "role": "teacher",
    }
    response = await client.post("/api/v1/chat/inquiry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["text"]
    assert data["sender_name"] == "Darasa CBC Assistant"


@pytest.mark.asyncio
async def test_conversation_creation_and_history(client: AsyncClient):
    """POST /api/v1/chat/conversations and subsequent GET history."""
    # 1. Create conversation
    create_resp = await client.post(
        "/api/v1/chat/conversations",
        json={"title": "Grade 5 Agriculture Inquiry"},
    )
    assert create_resp.status_code == 201
    conv_id = create_resp.json()["id"]

    # 2. Dispatch turn linked to conversation
    inquiry_resp = await client.post(
        "/api/v1/chat/inquiry",
        json={
            "query": "What are the key inquiry questions for Grade 5 crop production?",
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


@pytest.mark.asyncio
async def test_inquiry_with_rag_seeded_chunk(
    client: AsyncClient,
    seeded_chunk: CurriculumChunk,
    db_session: AsyncSession,
):
    """
    When a curriculum chunk is seeded in the test DB, the RAG retrieval path
    executes fully. The response text must be non-empty (Gemini or offline fallback).
    Structural integrity of the full RAG-chat pipeline is verified.
    """
    payload = {
        "query": "How do I teach Grade 5 drip irrigation using local materials?",
        "role": "teacher",
    }
    response = await client.post("/api/v1/chat/inquiry", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "conversation_id" in data
    assert "message_id" in data
    assert isinstance(data["text"], str)
    assert len(data["text"]) > 0
    assert isinstance(data["follow_ups"], list)
    assert len(data["follow_ups"]) == 3


@pytest.mark.asyncio
async def test_inquiry_missing_query_returns_422(client: AsyncClient):
    """POST /api/v1/chat/inquiry with empty query must return 422 Unprocessable Entity."""
    response = await client.post("/api/v1/chat/inquiry", json={"query": ""})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_nonexistent_conversation_returns_404(client: AsyncClient):
    """GET /api/v1/chat/conversations/{id} for unknown ID must return 404."""
    response = await client.get("/api/v1/chat/conversations/nonexistent-id-xyz")
    assert response.status_code == 404