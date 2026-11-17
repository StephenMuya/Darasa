"""
KICD CBC Lesson Plan API Endpoints
Single responsibility: expose REST endpoints to generate standardized Kenya CBC lesson plans,
render printable Markdown tables, and archive artifacts to AWS S3 Data Lake.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_optional_user_payload, get_db
from app.schemas.lesson_plan import LessonPlanRequest, LessonPlanResponse
from app.services.lesson_planner_service import LessonPlannerService

router = APIRouter()


@router.post(
    "/generate",
    response_model=LessonPlanResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate standardized KICD CBC Lesson Plan",
    description=(
        "Retrieves authoritative KICD curriculum chunks via pgvector RAG, "
        "synthesizes measurable SLOs (Knowledge, Skills, Values), zero-cost local resources, "
        "phased learner-centered activities, and a 4-tier formative assessment rubric."
    ),
)
async def generate_lesson_plan(
    request: LessonPlanRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[dict] = Depends(get_optional_user_payload),
) -> LessonPlanResponse:
    """Generate a complete KICD-compliant lesson plan document."""
    service = LessonPlannerService(session=db)
    user_id = current_user.get("sub") if current_user else None
    return await service.generate_lesson_plan(request=request, user_id=user_id)


@router.post(
    "/export-markdown",
    status_code=status.HTTP_200_OK,
    summary="Export KICD CBC Lesson Plan as print-ready Markdown",
    description="Returns the formatted Markdown document with tables and assessment rubrics.",
)
async def export_lesson_plan_markdown(
    request: LessonPlanRequest,
    db: AsyncSession = Depends(get_db),
) -> Response:
    """Returns the plain-text markdown document."""
    service = LessonPlannerService(session=db)
    plan = await service.generate_lesson_plan(request=request)
    return Response(
        content=plan.raw_markdown,
        media_type="text/markdown; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="lesson_plan_{plan.id}.md"'},
    )
