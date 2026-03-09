"""
API routes for the Assessment Service.

Provides CRUD endpoints for managing competency-based assessments.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.assessment import Assessment
from app.schemas.assessment import AssessmentCreate, AssessmentUpdate, AssessmentResponse

router = APIRouter()


@router.get("/", response_model=List[AssessmentResponse], summary="List all assessments")
async def list_assessments(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve a paginated list of all assessments.

    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    result = await db.execute(select(Assessment).offset(skip).limit(limit))
    assessments = result.scalars().all()
    return assessments


@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED, summary="Create an assessment")
async def create_assessment(
    assessment_in: AssessmentCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new competency-based assessment.

    - **assessment_in**: Assessment data conforming to the AssessmentCreate schema
    """
    assessment = Assessment(**assessment_in.model_dump())
    db.add(assessment)
    await db.flush()
    await db.refresh(assessment)
    return assessment


@router.get("/{assessment_id}", response_model=AssessmentResponse, summary="Get an assessment by ID")
async def get_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve a single assessment by its unique identifier.

    - **assessment_id**: UUID of the assessment to retrieve
    """
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return assessment


@router.put("/{assessment_id}", response_model=AssessmentResponse, summary="Update an assessment")
async def update_assessment(
    assessment_id: UUID,
    assessment_in: AssessmentUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update an existing assessment.

    - **assessment_id**: UUID of the assessment to update
    - **assessment_in**: Fields to update
    """
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    update_data = assessment_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assessment, field, value)

    await db.flush()
    await db.refresh(assessment)
    return assessment


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an assessment")
async def delete_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete an assessment.

    - **assessment_id**: UUID of the assessment to delete
    """
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    await db.delete(assessment)
