"""Add pgvector extension and curriculum_chunks table

Revision ID: 0002_add_pgvector
Revises: 0001_initial_schema
Create Date: 2026-10-24 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision: str = '0002_add_pgvector'
down_revision: Union[str, None] = '0001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Enable pgvector extension if PostgreSQL
    bind = op.get_bind()
    dialect_name = bind.dialect.name

    if dialect_name == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    # 2. Determine embedding column type based on dialect
    emb_col = sa.Column('embedding', Vector(1536), nullable=True) if dialect_name == "postgresql" else sa.Column('embedding', sa.JSON(), nullable=True)

    # 3. Create curriculum_chunks table
    op.create_table(
        'curriculum_chunks',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('grade', sa.String(length=50), nullable=False),
        sa.Column('learning_area', sa.String(length=100), nullable=False),
        sa.Column('strand', sa.String(length=255), nullable=False),
        sa.Column('sub_strand', sa.String(length=255), nullable=False),
        sa.Column('chunk_type', sa.String(length=50), server_default='sub_strand_composite', nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('metadata_json', sa.JSON(), nullable=False),
        emb_col,
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(op.f('ix_curriculum_chunks_grade'), 'curriculum_chunks', ['grade'], unique=False)
    op.create_index(op.f('ix_curriculum_chunks_learning_area'), 'curriculum_chunks', ['learning_area'], unique=False)
    op.create_index(op.f('ix_curriculum_chunks_sub_strand'), 'curriculum_chunks', ['sub_strand'], unique=False)

    # 4. Create HNSW index for high-speed cosine vector similarity on PostgreSQL
    if dialect_name == "postgresql":
        op.execute(
            "CREATE INDEX IF NOT EXISTS ix_curriculum_chunks_embedding_hnsw "
            "ON curriculum_chunks USING hnsw (embedding vector_cosine_ops);"
        )


def downgrade() -> None:
    op.drop_index(op.f('ix_curriculum_chunks_sub_strand'), table_name='curriculum_chunks')
    op.drop_index(op.f('ix_curriculum_chunks_learning_area'), table_name='curriculum_chunks')
    op.drop_index(op.f('ix_curriculum_chunks_grade'), table_name='curriculum_chunks')
    op.drop_table('curriculum_chunks')
