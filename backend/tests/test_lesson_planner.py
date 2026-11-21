"""
Unit and Integration Tests for KICD CBC Lesson Plan & Formative Assessment Generator
Single responsibility: test lesson plan schemas, RAG context synthesis,
phased pedagogical progression, 4-tier formative rubrics, markdown rendering, and REST endpoints.
"""
from pathlib import Path
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.lesson_plan import (
    LessonPlanAssessmentRubric,
    LessonPlanRequest,
    LessonPlanResponse,
    LessonPlanStep,
)
from app.services.lesson_planner_service import LessonPlannerService
from app.services.s3_storage_service import S3StorageService
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


def test_lesson_plan_schema_validation():
    """Verify serialization and validation of KICD lesson plan models."""
    step = LessonPlanStep(
        step_name="Step 1: Inquiry",
        duration_minutes=10,
        teacher_activity="Teacher asks inquiry question.",
        learner_activity="Learners inspect soil.",
        competencies_and_values=["Critical thinking"],
    )
    rubric = LessonPlanAssessmentRubric(
        criterion="Constructing organic mulch",
        exceeding="Flawless construction",
        meeting="Correct construction",
        approaching="Partially correct",
        below="Needs help",
    )
    response = LessonPlanResponse(
        title="GRADE 5 AGRICULTURE LESSON PLAN",
        grade="Grade 5",
        learning_area="Agriculture and Nutrition",
        strand="1.0 Conservation",
        sub_strand="1.1 Soil Conservation",
        duration_minutes=40,
        class_size=40,
        specific_learning_outcomes=["Identify soil conservation methods"],
        key_inquiry_questions=["Why conserve soil?"],
        core_competencies=["Critical thinking"],
        values=["Responsibility"],
        pertinent_contemporary_issues=["Environmental sustainability"],
        learning_resources=["Dry leaves", "plastic bottles"],
        lesson_development=[step],
        assessment_rubric=rubric,
        extended_learning_activity="Observe home garden",
        teacher_reflection="Successful lesson",
        raw_markdown="# KICD LESSON PLAN",
    )
    data = response.model_dump()
    assert data["grade"] == "Grade 5"
    assert len(data["lesson_development"]) == 1
    assert data["assessment_rubric"]["meeting"] == "Correct construction"


@pytest.mark.asyncio
async def test_lesson_planner_service_generation(seeded_curriculum_db: AsyncSession):
    """Verify LessonPlannerService generates complete CBC lesson plan grounded in DB."""
    service = LessonPlannerService(session=seeded_curriculum_db)

    req = LessonPlanRequest(
        topic_or_prompt="Constructing organic mulch to conserve topsoil moisture",
        grade="Grade 5",
        learning_area="Agriculture and Nutrition",
        sub_strand_hint="1.1 Soil Conservation",
        duration_minutes=40,
        class_size=45,
    )

    plan = await service.generate_lesson_plan(req)
    assert plan is not None
    assert plan.grade == "Grade 5"
    assert plan.learning_area == "Agriculture and Nutrition"
    assert "Soil Conservation" in plan.sub_strand or "Conservation" in plan.strand

    # Verify KICD Pedagogical Structure
    assert len(plan.specific_learning_outcomes) >= 3
    assert len(plan.key_inquiry_questions) >= 1
    assert len(plan.learning_resources) >= 3
    assert len(plan.lesson_development) >= 4  # Intro, Steps, Conclusion

    # Verify 4-Tier Rubric
    rub = plan.assessment_rubric
    assert rub.exceeding != ""
    assert rub.meeting != ""
    assert rub.approaching != ""
    assert rub.below != ""

    # Verify Markdown generated
    assert "# MINISTRY OF EDUCATION - REPUBLIC OF KENYA" in plan.raw_markdown
    assert "### VII. FORMATIVE ASSESSMENT RUBRIC" in plan.raw_markdown


@pytest.mark.asyncio
async def test_lesson_planner_markdown_rendering(seeded_curriculum_db: AsyncSession):
    """Verify rendered markdown has complete KICD tables and formatting."""
    service = LessonPlannerService(session=seeded_curriculum_db)

    req = LessonPlanRequest(
        topic_or_prompt="Water harvesting using plastic bottles",
        grade="Grade 5",
        learning_area="Agriculture and Nutrition",
        duration_minutes=40,
    )

    plan = await service.generate_lesson_plan(req)
    md = plan.raw_markdown

    assert "| **Introduction**" in md
    assert "| **Step 1: Exploration & Inquiry**" in md
    assert "Level 4: Exceeding Expectations (EE)" in md
    assert "s3://darasa-curriculum-blueprints-store" in md


@pytest.mark.asyncio
async def test_api_lesson_plan_generate_post(client: AsyncClient, seeded_curriculum_db: AsyncSession):
    """Verify POST /api/v1/lesson-plans/generate endpoint."""
    payload = {
        "topic_or_prompt": "Indigenous vegetable nursery bed preparation",
        "grade": "Grade 5",
        "learning_area": "Agriculture and Nutrition",
        "duration_minutes": 40,
        "class_size": 40,
    }
    resp = await client.post("/api/v1/lesson-plans/generate", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    assert data["grade"] == "Grade 5"
    assert data["learning_area"] == "Agriculture and Nutrition"
    assert len(data["lesson_development"]) >= 4
    assert "raw_markdown" in data
    assert "# MINISTRY OF EDUCATION" in data["raw_markdown"]


@pytest.mark.asyncio
async def test_api_lesson_plan_export_markdown(client: AsyncClient, seeded_curriculum_db: AsyncSession):
    """Verify POST /api/v1/lesson-plans/export-markdown endpoint returns markdown file."""
    payload = {
        "topic_or_prompt": "Domestic animal rearing poultry feeding",
        "grade": "Grade 5",
        "learning_area": "Agriculture and Nutrition",
        "duration_minutes": 40,
    }
    resp = await client.post("/api/v1/lesson-plans/export-markdown", json=payload)
    assert resp.status_code == 200
    assert "text/markdown" in resp.headers["content-type"]
    assert "attachment; filename=" in resp.headers["content-disposition"]
    assert "# MINISTRY OF EDUCATION" in resp.text


@pytest.mark.asyncio
async def test_lesson_plan_s3_archive_mock(monkeypatch, seeded_curriculum_db: AsyncSession):
    """Verify save_to_s3 archives JSON and Markdown to S3 Data Lake."""
    from app.schemas.storage import S3FileMetadata

    mock_uploads = []

    async def mock_upload(self, data, key, content_type=None, metadata=None):
        mock_uploads.append({"key": key, "size": len(data), "type": content_type})
        return S3FileMetadata(
            key=key,
            bucket="darasa-curriculum-blueprints-store",
            size_bytes=len(data),
            content_type=content_type or "application/octet-stream",
            last_modified="2026-10-24T18:00:00Z",
            etag="mock-etag",
        )

    monkeypatch.setattr(S3StorageService, "upload_bytes", mock_upload)

    service = LessonPlannerService(session=seeded_curriculum_db)
    req = LessonPlanRequest(
        topic_or_prompt="Rainwater harvesting and storage",
        grade="Grade 5",
        learning_area="Agriculture and Nutrition",
        save_to_s3=True,
    )

    plan = await service.generate_lesson_plan(req, user_id="teacher_123")
    assert plan.s3_uri is not None
    assert plan.s3_uri.startswith("s3://darasa-curriculum-blueprints-store/lesson-plans/teacher_123/")
    assert len(mock_uploads) == 2  # .json and .md
