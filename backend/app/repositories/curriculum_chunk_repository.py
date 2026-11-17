"""
Curriculum Chunk Repository
Single responsibility: data access layer for pgvector curriculum chunks,
including bulk insertion, cosine similarity search, and similarity scoring.
"""
from typing import List, Optional, Tuple

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.curriculum_chunk import CurriculumChunk
from app.schemas.curriculum import CurriculumChunkCreate


class CurriculumChunkRepository:
    """Repository handling CRUD and vector similarity queries for curriculum chunks."""

    def __init__(self, session: AsyncSession):
        self._session = session

    async def bulk_upsert(self, chunks: List[CurriculumChunkCreate]) -> int:
        """
        Inserts or replaces curriculum chunks in the database.
        Returns the number of chunks stored.
        """
        if not chunks:
            return 0

        count = 0
        for item in chunks:
            # Delete existing chunk if matching grade + learning_area + sub_strand
            await self._session.execute(
                delete(CurriculumChunk).where(
                    CurriculumChunk.grade == item.grade,
                    CurriculumChunk.learning_area == item.learning_area,
                    CurriculumChunk.sub_strand == item.sub_strand,
                )
            )

            db_chunk = CurriculumChunk(
                id=item.chunk_id,
                grade=item.grade,
                learning_area=item.learning_area,
                strand=item.strand,
                sub_strand=item.sub_strand,
                chunk_type=item.chunk_type,
                content=item.content,
                metadata_json=item.metadata,
                embedding=item.embedding,
            )
            self._session.add(db_chunk)
            count += 1

        await self._session.commit()
        return count

    async def search_similar(
        self,
        query_vector: List[float],
        limit: int = 5,
        grade: Optional[str] = None,
        learning_area: Optional[str] = None,
    ) -> List[CurriculumChunk]:
        """
        Performs vector similarity search.
        On PostgreSQL, uses pgvector cosine distance operator (<=>).
        On SQLite (testing), falls back to filtering and ordering by ID.
        """
        query = select(CurriculumChunk)

        if grade:
            query = query.where(CurriculumChunk.grade.ilike(f"%{grade}%"))
        if learning_area:
            query = query.where(CurriculumChunk.learning_area.ilike(f"%{learning_area}%"))

        bind = self._session.bind
        dialect_name = bind.dialect.name if bind else "postgresql"

        if dialect_name == "postgresql" and hasattr(CurriculumChunk.embedding, "cosine_distance"):
            query = query.order_by(CurriculumChunk.embedding.cosine_distance(query_vector))
        else:
            query = query.order_by(CurriculumChunk.created_at.desc())

        query = query.limit(limit)
        result = await self._session.execute(query)
        return list(result.scalars().all())

    async def search_similar_with_scores(
        self,
        query_vector: List[float],
        limit: int = 5,
        grade: Optional[str] = None,
        learning_area: Optional[str] = None,
        strand: Optional[str] = None,
        sub_strand: Optional[str] = None,
        min_similarity: float = 0.0,
    ) -> List[Tuple[CurriculumChunk, float]]:
        """
        Performs vector similarity search returning chunks with similarity scores [0.0 - 1.0].
        On PostgreSQL, leverages pgvector cosine distance operator (<=>).
        On SQLite (testing), computes cosine similarity dynamically over normalized vectors.
        """
        query = select(CurriculumChunk)

        if grade:
            query = query.where(CurriculumChunk.grade.ilike(f"%{grade}%"))
        if learning_area:
            query = query.where(CurriculumChunk.learning_area.ilike(f"%{learning_area}%"))
        if strand:
            query = query.where(CurriculumChunk.strand.ilike(f"%{strand}%"))
        if sub_strand:
            query = query.where(CurriculumChunk.sub_strand.ilike(f"%{sub_strand}%"))

        bind = self._session.bind
        dialect_name = bind.dialect.name if bind else "postgresql"

        if dialect_name == "postgresql" and hasattr(CurriculumChunk.embedding, "cosine_distance"):
            dist_expr = CurriculumChunk.embedding.cosine_distance(query_vector)
            sim_expr = 1.0 - dist_expr
            query_with_sim = select(CurriculumChunk, sim_expr.label("similarity")).where(
                query.whereclause if query.whereclause is not None else True
            )
            if min_similarity > 0.0:
                query_with_sim = query_with_sim.where(sim_expr >= min_similarity)
            query_with_sim = query_with_sim.order_by(dist_expr.asc()).limit(limit)
            result = await self._session.execute(query_with_sim)
            return [(row[0], float(row[1])) for row in result.all()]
        else:
            result = await self._session.execute(query)
            all_chunks = list(result.scalars().all())
            scored = []
            for chunk in all_chunks:
                score = 0.0
                if chunk.embedding and len(chunk.embedding) == len(query_vector):
                    dot = sum(q * c for q, c in zip(query_vector, chunk.embedding))
                    score = max(0.0, min(1.0, float(dot)))
                scored.append((chunk, score))
            scored.sort(key=lambda x: x[1], reverse=True)
            if min_similarity > 0.0:
                scored = [item for item in scored if item[1] >= min_similarity]
            return scored[:limit]

    async def get_by_sub_strand(
        self, grade: str, learning_area: str, sub_strand: str
    ) -> Optional[CurriculumChunk]:
        """Fetch a specific sub-strand curriculum chunk."""
        query = select(CurriculumChunk).where(
            CurriculumChunk.grade == grade,
            CurriculumChunk.learning_area == learning_area,
            CurriculumChunk.sub_strand.ilike(f"%{sub_strand}%"),
        )
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def count_all(self) -> int:
        """Return total number of seeded curriculum chunks."""
        query = select(func.count(CurriculumChunk.id))
        result = await self._session.execute(query)
        return result.scalar_one() or 0
