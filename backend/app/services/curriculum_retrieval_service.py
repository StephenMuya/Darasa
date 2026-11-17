"""
Curriculum Semantic Retrieval & RAG Service
Single responsibility: orchestrate dense query vector embedding generation,
similarity search with relational filters (Grade, Subject, Strand), threshold pruning,
and formatting structured LLM context blocks with official KICD citations.
"""
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.curriculum_chunk import CurriculumChunk
from app.repositories.curriculum_chunk_repository import CurriculumChunkRepository
from app.schemas.curriculum import (
    CurriculumSearchRequest,
    CurriculumSearchResponse,
    CurriculumSearchResultItem,
    RAGContextCitation,
    RAGContextRequest,
    RAGContextResponse,
)
from app.services.embedding_service import EmbeddingService

logger = logging.getLogger("curriculum_retrieval")


class CurriculumRetrievalService:
    """
    Core RAG retrieval engine for Kenya KICD Competency-Based Curriculum.
    Connects vector similarity in pgvector with educational domain filters.
    """

    def __init__(
        self,
        session: AsyncSession,
        embedding_service: Optional[EmbeddingService] = None,
    ):
        self._session = session
        self._repo = CurriculumChunkRepository(session)
        self._embedding_service = embedding_service or EmbeddingService(dimension=1536)

    async def search(
        self,
        request: CurriculumSearchRequest,
    ) -> CurriculumSearchResponse:
        """
        Executes semantic search over indexed curriculum chunks with optional relational filters.
        """
        logger.info(
            f"[*] Executing curriculum search: query='{request.query}', "
            f"grade='{request.grade}', learning_area='{request.learning_area}'"
        )

        # 1. Generate query embedding with RETRIEVAL_QUERY task type
        query_vector = await self._embedding_service.generate_query_embedding(request.query)

        # 2. Retrieve similar chunks with similarity scores
        scored_chunks = await self._repo.search_similar_with_scores(
            query_vector=query_vector,
            limit=request.limit,
            grade=request.grade,
            learning_area=request.learning_area,
            strand=request.strand,
            sub_strand=request.sub_strand,
            min_similarity=request.min_similarity,
        )

        results: List[CurriculumSearchResultItem] = []
        for chunk, score in scored_chunks:
            results.append(
                CurriculumSearchResultItem(
                    chunk_id=chunk.id,
                    grade=chunk.grade,
                    learning_area=chunk.learning_area,
                    strand=chunk.strand,
                    sub_strand=chunk.sub_strand,
                    content=chunk.content,
                    similarity_score=round(score, 4),
                    metadata=chunk.metadata_json or {},
                )
            )

        logger.info(f"[OK] Search complete: Found {len(results)} matching chunks.")
        return CurriculumSearchResponse(
            query=request.query,
            total_matches=len(results),
            results=results,
        )

    async def build_rag_context(
        self,
        request: RAGContextRequest,
    ) -> RAGContextResponse:
        """
        Retrieves top curriculum chunks and formats them into an authoritative,
        structured markdown context block ready for LLM prompt injection with KICD citations.
        """
        search_req = CurriculumSearchRequest(
            query=request.query,
            grade=request.grade,
            learning_area=request.learning_area,
            limit=request.top_k,
            min_similarity=0.0,
        )
        search_resp = await self.search(search_req)

        if not search_resp.results:
            fallback_msg = (
                f"No specific KICD curriculum blueprint nodes found for '{request.query}' "
                f"(Grade: {request.grade or 'Any'}, Learning Area: {request.learning_area or 'Any'})."
            )
            return RAGContextResponse(
                query=request.query,
                grade=request.grade,
                learning_area=request.learning_area,
                retrieved_count=0,
                rag_context=fallback_msg,
                citations=[],
            )

        context_blocks: List[str] = []
        citations: List[RAGContextCitation] = []

        context_blocks.append("### OFFICIAL KICD COMPETENCY-BASED CURRICULUM CONTEXT\n")
        context_blocks.append(
            "Use the following authoritative KICD curriculum design sources to answer the user's inquiry, "
            "design lesson plans, or structure formative assessments. Ground all outputs strictly in these sources.\n"
        )

        for idx, item in enumerate(search_resp.results, 1):
            meta = item.metadata
            s3_uri = meta.get("s3_source_pointer_uri") or meta.get("s3_raw_uri") or "N/A"
            strand_code = meta.get("strand_code") or ""
            sub_strand_code = meta.get("sub_strand_code") or ""

            # Structured citation footnote
            citation = RAGContextCitation(
                source_index=idx,
                chunk_id=item.chunk_id,
                grade=item.grade,
                learning_area=item.learning_area,
                strand=item.strand,
                sub_strand=item.sub_strand,
                similarity_score=item.similarity_score,
                s3_source_pointer_uri=s3_uri,
            )
            citations.append(citation)

            # Block representation
            block_lines = [
                f"#### SOURCE [{idx}]: {item.grade} | {item.learning_area}",
                f"- **Strand [{strand_code}]**: {item.strand}",
                f"- **Sub-Strand [{sub_strand_code}]**: {item.sub_strand}",
                f"- **Relevance Score**: {item.similarity_score:.2f}",
                f"- **S3 Blueprint Pointer**: `{s3_uri}`",
            ]

            slos = meta.get("specific_learning_outcomes") or []
            if slos:
                block_lines.append("- **Specific Learning Outcomes (SLOs)**:")
                for slo in slos:
                    block_lines.append(f"  * {slo}")

            if request.include_experiences:
                exps = meta.get("suggested_learning_experiences") or []
                if exps:
                    block_lines.append("- **Suggested Learning Experiences (Hands-on & Local Zero-Cost Materials)**:")
                    for exp in exps:
                        block_lines.append(f"  * {exp}")

            kiqs = meta.get("key_inquiry_questions") or []
            if kiqs:
                block_lines.append("- **Key Inquiry Questions (KIQs)**:")
                for q in kiqs:
                    block_lines.append(f"  * {q}")

            if request.include_rubrics and meta.get("assessment_rubric"):
                rub = meta["assessment_rubric"]
                block_lines.append("- **Formative Assessment Rubric (KICD 4-Tier Matrix)**:")
                block_lines.append(f"  * Exceeding Expectations (EE - Level 4): {rub.get('exceeding', 'N/A')}")
                block_lines.append(f"  * Meeting Expectations (ME - Level 3): {rub.get('meeting', 'N/A')}")
                block_lines.append(f"  * Approaching Expectations (AE - Level 2): {rub.get('approaching', 'N/A')}")
                block_lines.append(f"  * Below Expectations (BE - Level 1): {rub.get('below', 'N/A')}")

            context_blocks.append("\n".join(block_lines))
            context_blocks.append("\n---\n")

        rag_text = "\n".join(context_blocks).strip()
        logger.info(f"[OK] RAG context built with {len(citations)} source citations.")

        return RAGContextResponse(
            query=request.query,
            grade=request.grade,
            learning_area=request.learning_area,
            retrieved_count=len(citations),
            rag_context=rag_text,
            citations=citations,
        )
