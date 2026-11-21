"""
Unit and Integration Tests for Curriculum Semantic Retrieval & RAG Service
Single responsibility: verify query embedding generation, similarity search,
relational filtering, KICD citation formatting, and REST API endpoints.
"""
from pathlib import Path
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.curriculum_chunk import CurriculumChunk
from app.repositories.curriculum_chunk_repository import CurriculumChunkRepository
from app.schemas.curriculum import (
    CurriculumChunkCreate,
    CurriculumSearchRequest,
    RAGContextRequest,
)
from app.services.curriculum_retrieval_service import CurriculumRetrievalService
from app.services.embedding_service import EmbeddingService
from ingestion.seed_db import seed_database_from_json


@pytest.fixture
async def seeded_curriculum_db(db_session: AsyncSession) -> AsyncSession:
    """Fixture that seeds the test DB with sample Grade 5 Agriculture curriculum chunks."""
    sample_path = (
        Path(__file__).resolve().parent.parent
        / "ingestion"
        / "samples"
        / "cbc_grade_5_agriculture_nutrition.json"
    )
    await seed_database_from_json(
        source_path_or_key=sample_path,
        active_session=db_session,
        dry_run=False,
    )
    return db_session


@pytest.mark.asyncio
async def test_generate_query_embedding():
    """Verify query embedding produces normalized 1536-dimensional unit vector."""
    service = EmbeddingService(dimension=1536)
    vec = await service.generate_query_embedding("How to mulch soil using organic leaves?")
    assert len(vec) == 1536
    norm = sum(x * x for x in vec) ** 0.5
    assert abs(norm - 1.0) < 0.01


@pytest.mark.asyncio
async def test_search_similar_with_scores_in_repo(seeded_curriculum_db: AsyncSession):
    """Verify repository similarity search calculates scores and applies grade/subject filters."""
    repo = CurriculumChunkRepository(seeded_curriculum_db)
    emb_service = EmbeddingService(dimension=1536)

    query_vec = await emb_service.generate_query_embedding("Soil erosion prevention with mulching")

    # Search with grade filter
    scored_results = await repo.search_similar_with_scores(
        query_vector=query_vec,
        limit=3,
        grade="Grade 5",
        learning_area="Agriculture",
    )

    assert len(scored_results) > 0
    top_chunk, score = scored_results[0]
    assert isinstance(top_chunk, CurriculumChunk)
    assert top_chunk.grade == "Grade 5"
    assert "Agriculture" in top_chunk.learning_area
    assert 0.0 <= score <= 1.0


@pytest.mark.asyncio
async def test_curriculum_retrieval_service_search(seeded_curriculum_db: AsyncSession):
    """Verify CurriculumRetrievalService.search maps chunks and handles thresholds."""
    service = CurriculumRetrievalService(session=seeded_curriculum_db)

    req = CurriculumSearchRequest(
        query="rainwater harvesting drip irrigation with plastic bottles",
        grade="Grade 5",
        learning_area="Agriculture and Nutrition",
        limit=2,
    )

    response = await service.search(req)
    assert response.query == req.query
    assert response.total_matches > 0
    assert len(response.results) <= 2

    first = response.results[0]
    assert first.grade == "Grade 5"
    assert first.learning_area == "Agriculture and Nutrition"
    assert "s3_source_pointer_uri" in first.metadata
    assert 0.0 <= first.similarity_score <= 1.0


@pytest.mark.asyncio
async def test_curriculum_retrieval_service_rag_context(seeded_curriculum_db: AsyncSession):
    """Verify build_rag_context formats structured prompt context with KICD citations."""
    service = CurriculumRetrievalService(session=seeded_curriculum_db)

    req = RAGContextRequest(
        query="Design a practical lesson on soil conservation using organic mulch",
        grade="Grade 5",
        learning_area="Agriculture and Nutrition",
        top_k=2,
        include_rubrics=True,
        include_experiences=True,
    )

    rag_resp = await service.build_rag_context(req)
    assert rag_resp.retrieved_count > 0
    assert len(rag_resp.citations) == rag_resp.retrieved_count

    # Check Markdown Context Structure
    assert "### OFFICIAL KICD COMPETENCY-BASED CURRICULUM CONTEXT" in rag_resp.rag_context
    assert "SOURCE [1]" in rag_resp.rag_context
    assert "Specific Learning Outcomes (SLOs)" in rag_resp.rag_context
    assert "Suggested Learning Experiences" in rag_resp.rag_context
    assert "Formative Assessment Rubric" in rag_resp.rag_context
    assert "s3://darasa-curriculum-blueprints-store" in rag_resp.rag_context

    # Verify citation attributes
    cit = rag_resp.citations[0]
    assert cit.source_index == 1
    assert cit.grade == "Grade 5"
    assert cit.s3_source_pointer_uri.startswith("s3://")


@pytest.mark.asyncio
async def test_api_curriculum_search_post(client: AsyncClient, seeded_curriculum_db: AsyncSession):
    """Verify POST /api/v1/curriculum/search endpoint."""
    payload = {
        "query": "Poultry chicken feeding and local breeds",
        "grade": "Grade 5",
        "learning_area": "Agriculture and Nutrition",
        "limit": 3,
    }
    resp = await client.post("/api/v1/curriculum/search", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["query"] == payload["query"]
    assert "results" in data
    assert data["total_matches"] > 0
    assert len(data["results"]) <= 3


@pytest.mark.asyncio
async def test_api_curriculum_search_get(client: AsyncClient, seeded_curriculum_db: AsyncSession):
    """Verify GET /api/v1/curriculum/search endpoint with query parameters."""
    resp = await client.get(
        "/api/v1/curriculum/search",
        params={
            "q": "water conservation",
            "grade": "Grade 5",
            "limit": 2,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["query"] == "water conservation"
    assert len(data["results"]) > 0


@pytest.mark.asyncio
async def test_api_curriculum_rag_context(client: AsyncClient, seeded_curriculum_db: AsyncSession):
    """Verify POST /api/v1/curriculum/rag-context endpoint."""
    payload = {
        "query": "Vegetable nursery preparation and transplanting",
        "grade": "Grade 5",
        "learning_area": "Agriculture and Nutrition",
        "top_k": 2,
        "include_rubrics": True,
        "include_experiences": True,
    }
    resp = await client.post("/api/v1/curriculum/rag-context", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["retrieved_count"] > 0
    assert "### OFFICIAL KICD COMPETENCY-BASED CURRICULUM CONTEXT" in data["rag_context"]
    assert len(data["citations"]) == data["retrieved_count"]
