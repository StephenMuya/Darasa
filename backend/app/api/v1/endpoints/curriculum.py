"""
KICD Curriculum & Semantic RAG API Endpoints
Single responsibility: expose REST endpoints for semantic search over curriculum blueprints
and contextual KICD knowledge injection for generative AI workflows.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.schemas.curriculum import (
    CurriculumSearchRequest,
    CurriculumSearchResponse,
    RAGContextRequest,
    RAGContextResponse,
)
from app.services.curriculum_retrieval_service import CurriculumRetrievalService

router = APIRouter()


@router.post(
    "/search",
    response_model=CurriculumSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Semantic vector search across KICD curriculum blueprints",
    description=(
        "Converts natural language queries into 1536-dimensional embeddings (task_type=RETRIEVAL_QUERY) "
        "and executes cosine distance search (<=>) in PostgreSQL pgvector with optional grade/subject filters."
    ),
)
async def search_curriculum(
    request: CurriculumSearchRequest,
    db: AsyncSession = Depends(get_db),
) -> CurriculumSearchResponse:
    """Execute dense semantic vector retrieval against curriculum chunks."""
    service = CurriculumRetrievalService(session=db)
    return await service.search(request)


@router.get(
    "/search",
    response_model=CurriculumSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="GET semantic search across KICD curriculum blueprints",
    description="Convenience query-parameter interface for semantic curriculum retrieval.",
)
async def search_curriculum_get(
    q: str = Query(..., min_length=2, description="Search query or topic"),
    grade: Optional[str] = Query(None, description="Optional grade filter, e.g. 'Grade 5'"),
    learning_area: Optional[str] = Query(None, description="Optional subject, e.g. 'Agriculture'"),
    limit: int = Query(5, ge=1, le=20, description="Max results"),
    min_similarity: float = Query(0.0, ge=0.0, le=1.0, description="Min similarity score"),
    db: AsyncSession = Depends(get_db),
) -> CurriculumSearchResponse:
    """Execute GET query semantic retrieval."""
    service = CurriculumRetrievalService(session=db)
    req = CurriculumSearchRequest(
        query=q,
        grade=grade,
        learning_area=learning_area,
        limit=limit,
        min_similarity=min_similarity,
    )
    return await service.search(req)


@router.post(
    "/rag-context",
    response_model=RAGContextResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve formatted KICD RAG context with citations",
    description=(
        "Retrieves authoritative KICD blueprint nodes and formats them into a markdown context block "
        "complete with SLOs, practical zero-cost experiences, 4-tier rubrics, and S3 Data Lake citations."
    ),
)
async def retrieve_rag_context(
    request: RAGContextRequest,
    db: AsyncSession = Depends(get_db),
) -> RAGContextResponse:
    """Assemble formatted KICD context for LLM lesson planning and teacher chat."""
    service = CurriculumRetrievalService(session=db)
    return await service.build_rag_context(request)
