from fastapi import APIRouter, status

from app.schemas.rubric import (
    RubricGenerateRequest,
    RubricGenerateResponse,
    RubricTier,
)

router = APIRouter()


@router.post(
    "/generate",
    response_model=RubricGenerateResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate 4-Tier CBC Rubric",
    description="Generate a KICD-compliant formative assessment rubric with 4 performance levels (EE, ME, AE, BE).",
)
async def generate_rubric(data: RubricGenerateRequest) -> RubricGenerateResponse:
    # Build authentic 4-tier formative assessment criteria for the specified strand
    rubric = RubricTier(
        strand=data.strand,
        sub_strand=data.task_description
        or f"Formative competency evaluation for {data.grade}",
        ee=(
            f"Exceeding Expectations (Level 4): Masterfully demonstrates {data.strand}; "
            "exhibits exceptional autonomy, innovates additional solutions, and assists peers."
        ),
        me=(
            f"Meeting Expectations (Level 3): Proficiently fulfills all core criteria in {data.strand}; "
            "accurately performs the learning task with standard guidance."
        ),
        ae=(
            f"Approaching Expectations (Level 2): Partially demonstrates competencies in {data.strand}; "
            "requires occasional teacher prompting to complete key activity steps."
        ),
        be=(
            f"Below Expectations (Level 1): Struggles to demonstrate basic competencies in {data.strand}; "
            "requires comprehensive individualized intervention and scaffolding."
        ),
    )
    return RubricGenerateResponse(
        grade=data.grade,
        learning_area=data.learning_area,
        rubric=rubric,
    )
