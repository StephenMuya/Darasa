from pathlib import Path
"""
Unit and Integration Tests for KICD Curriculum Ingestion Pipeline & pgvector Models
Single responsibility: test curriculum schemas, visual extraction engine,
chunk synthesis, embedding generation, and repository operations.
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.curriculum_chunk import CurriculumChunk
from app.repositories.curriculum_chunk_repository import CurriculumChunkRepository
from app.schemas.curriculum import (
    AssessmentCriterion,
    CurriculumBlueprint,
    CurriculumChunkCreate,
    Strand,
    SubStrand,
)
from app.services.curriculum_extractor import CurriculumExtractor
from app.services.embedding_service import EmbeddingService
from scripts.ingest_curriculum import run_pipeline


@pytest.fixture
def sample_blueprint() -> CurriculumBlueprint:
    """Fixture providing a validated KICD CurriculumBlueprint."""
    rubric = AssessmentCriterion(
        exceeding="Level 4: Flawlessly constructs compost mulch.",
        meeting="Level 3: Constructs compost mulch as guided.",
        approaching="Level 2: Constructs mulch with teacher prompts.",
        below="Level 1: Needs continuous assistance.",
    )
    sub = SubStrand(
        sub_strand_name="1.1 Soil Conservation",
        suggested_lessons=10,
        specific_learning_outcomes=["Identify soil conservation methods."],
        suggested_learning_experiences=["Use dry leaves and grass to construct organic mulch."],
        key_inquiry_questions=["Why conserve soil?"],
        core_competencies=["Critical thinking"],
        values=["Unity"],
        pertinent_contemporary_issues=["Environmental Conservation"],
        assessment_rubric=rubric,
    )
    strand = Strand(
        strand_name="1.0 CONSERVATION OF RESOURCES",
        sub_strands=[sub],
    )
    return CurriculumBlueprint(
        title="GRADE 5 AGRICULTURE CURRICULUM DESIGN",
        grade="Grade 5",
        learning_area="Agriculture",
        education_level="Upper Primary",
        strands=[strand],
    )


def test_curriculum_pydantic_schema_validation(sample_blueprint):
    """Verify validation and serialization of KICD curriculum models."""
    data = sample_blueprint.model_dump()
    assert data["grade"] == "Grade 5"
    assert len(data["strands"]) == 1
    assert data["strands"][0]["sub_strands"][0]["sub_strand_name"] == "1.1 Soil Conservation"
    assert data["strands"][0]["sub_strands"][0]["assessment_rubric"]["exceeding"].startswith("Level 4")


def test_blueprint_synthesizes_search_chunks(sample_blueprint):
    """Verify chunking flattens hierarchy into rich searchable text with rubrics."""
    chunks = sample_blueprint.synthesize_search_chunks()
    assert len(chunks) == 1
    chunk = chunks[0]
    assert chunk.grade == "Grade 5"
    assert chunk.learning_area == "Agriculture"
    assert "Grade Level: Grade 5" in chunk.content
    assert "Specific Learning Outcomes:" in chunk.content
    assert "Suggested Learning Experiences" in chunk.content
    assert "Assessment Criteria:" in chunk.content
    assert chunk.metadata["sub_strand"] == "1.1 Soil Conservation"


@pytest.mark.asyncio
async def test_embedding_service_deterministic_generation():
    """Verify embedding service produces normalized 1536-dim unit vectors."""
    service = EmbeddingService(dimension=1536)
    vec1 = await service.generate_embedding("Soil erosion prevention methods")
    vec2 = await service.generate_embedding("Soil erosion prevention methods")

    assert len(vec1) == 1536
    assert vec1 == vec2  # Deterministic test consistency

    # Verify unit length normalization (sum of squares ≈ 1.0)
    norm_sq = sum(x * x for x in vec1)
    assert abs(norm_sq - 1.0) < 0.01


@pytest.mark.asyncio
async def test_curriculum_extractor_deterministic_fallback():
    """Verify extractor returns valid blueprint when external API keys are placeholders."""
    extractor = CurriculumExtractor()
    blueprint = await extractor.extract_blueprint_from_bytes(
        pdf_bytes=b"%PDF-1.4 Mock",
        filename="GRADE.6.SOCIAL.STUDIES.pdf",
    )
    assert blueprint.grade == "Grade 6"
    assert len(blueprint.strands) > 0
    assert len(blueprint.strands[0].sub_strands) > 0


@pytest.mark.asyncio
async def test_curriculum_chunk_repository_crud(db_session: AsyncSession):
    """Verify repository bulk upsert, count, and lookup operations on test DB."""
    repo = CurriculumChunkRepository(db_session)

    chunk = CurriculumChunkCreate(
        grade="Grade 5",
        learning_area="Agriculture",
        strand="1.0 Conservation",
        sub_strand="1.1 Soil Conservation",
        content="Soil conservation practices using organic mulch.",
        metadata={"s3_key": "curriculum-raw/test.pdf"},
        embedding=[0.01] * 1536,
    )

    count = await repo.bulk_upsert([chunk])
    assert count == 1

    total = await repo.count_all()
    assert total >= 1

    fetched = await repo.get_by_sub_strand("Grade 5", "Agriculture", "Soil Conservation")
    assert fetched is not None
    assert fetched.sub_strand == "1.1 Soil Conservation"

    # Test search similar fallback on SQLite
    similar = await repo.search_similar(query_vector=[0.01] * 1536, limit=2)
    assert len(similar) >= 1


@pytest.mark.asyncio
async def test_full_ingestion_pipeline_dry_run(monkeypatch):
    """Verify end-to-end dry-run pipeline executes without network blocking."""
    from app.services.s3_storage_service import S3StorageService

    async def mock_download(self, key):
        return b"%PDF-1.4 Mock KICD CBC Blueprint Content"

    monkeypatch.setattr(S3StorageService, "download_bytes", mock_download)

    blueprint = await run_pipeline(
        s3_key="curriculum-raw/upper-primary/GRADE-5-AGRICULTURE-NUTRITION.pdf",
        dry_run=True,
    )
    assert blueprint is not None
    assert blueprint.grade == "Grade 5"
@pytest.mark.asyncio
async def test_seed_database_from_json_dry_run():
    """Verify seed_db 4-step dry-run pipeline with sample processed JSON."""
    from ingestion.seed_db import seed_database_from_json

    sample_path = (
        Path(__file__).resolve().parent.parent
        / "ingestion"
        / "samples"
        / "cbc_grade_5_agriculture_nutrition.json"
    )
    summary = await seed_database_from_json(
        source_path_or_key=sample_path,
        dry_run=True,
    )

    assert summary["grade"] == "Grade 5"
    assert summary["learning_area"] == "Agriculture and Nutrition"
    assert summary["chunks_generated"] == 4
    assert summary["chunks_stored"] == 4
    assert summary["vector_dimensions"] == 1536
    assert summary["s3_source_pointer_uri"] is not None


@pytest.mark.asyncio
async def test_seed_database_from_json_into_session(db_session: AsyncSession):
    """Verify seed_db 4-step seeding into database session with pgvector/SQLite."""
    from ingestion.seed_db import seed_database_from_json

    sample_path = (
        Path(__file__).resolve().parent.parent
        / "ingestion"
        / "samples"
        / "cbc_grade_5_agriculture_nutrition.json"
    )
    summary = await seed_database_from_json(
        source_path_or_key=sample_path,
        active_session=db_session,
        dry_run=False,
    )

    assert summary["chunks_stored"] == 4
    assert summary["vector_dimensions"] == 1536

    # Verify query against seeded chunks in DB
    repo = CurriculumChunkRepository(db_session)
    total = await repo.count_all()
    assert total >= 4

    soil_chunk = await repo.get_by_sub_strand(
        grade="Grade 5",
        learning_area="Agriculture and Nutrition",
        sub_strand="Soil Conservation",
    )
    assert soil_chunk is not None
    assert soil_chunk.strand == "1.0 CONSERVATION OF RESOURCES"
    assert soil_chunk.metadata_json["strand_code"] == "1.0"
    assert soil_chunk.metadata_json["sub_strand_code"] == "1.1"
    assert "Soil Conservation" in soil_chunk.sub_strand
    assert "SPECIFIC LEARNING OUTCOMES" in soil_chunk.content
    assert "KEY INQUIRY QUESTIONS" in soil_chunk.content
    assert "SUGGESTED LEARNING EXPERIENCES" in soil_chunk.content
    assert "FORMATIVE ASSESSMENT RUBRIC" in soil_chunk.content
    assert soil_chunk.metadata_json["s3_source_pointer_uri"].startswith("s3://")
    assert len(soil_chunk.embedding) == 1536
