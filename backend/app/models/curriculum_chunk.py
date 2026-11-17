"""
Curriculum Chunk Entity (PostgreSQL + pgvector)
Single responsibility: define persistence model for vector-searchable
curriculum nodes with dialect-safe embedding columns.
"""
from typing import Any, Dict, List, Optional
from uuid import uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import TypeDecorator

from app.core.database import Base
from app.models.base import TimestampMixin


class SafeVector(TypeDecorator):
    """
    Dialect-aware vector column:
    Renders as native pgvector Vector(dim) on PostgreSQL,
    and falls back to JSON on SQLite for mock unit tests.
    """

    impl = Vector
    cache_ok = True

    def __init__(self, dim: int = 1536):
        super().__init__(dim)
        self.dim = dim

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(Vector(self.dim))
        return dialect.type_descriptor(JSON())


class CurriculumChunk(Base, TimestampMixin):
    """
    Individual curriculum chunk with semantic vector embedding.
    Supports cosine similarity retrieval (<=>) for CBC inquiries and rubrics.
    """

    __tablename__ = "curriculum_chunks"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    grade: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    learning_area: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    strand: Mapped[str] = mapped_column(String(255), nullable=False)
    sub_strand: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    chunk_type: Mapped[str] = mapped_column(
        String(50), default="sub_strand_composite", nullable=False
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(
        JSON, default=dict, nullable=False
    )
    embedding: Mapped[Optional[List[float]]] = mapped_column(
        SafeVector(1536), nullable=True
    )
