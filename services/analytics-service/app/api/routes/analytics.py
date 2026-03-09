"""
API routes for the Analytics Service.

Provides endpoints for recording performance data and querying student analytics.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.analytics import PerformanceRecord
from app.schemas.analytics import (
    PerformanceRecordCreate,
    PerformanceRecordUpdate,
    PerformanceRecordResponse,
    StudentSummary,
)

router = APIRouter()


@router.get("/", response_model=List[PerformanceRecordResponse], summary="List performance records")
async def list_records(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve a paginated list of all performance records.

    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    result = await db.execute(select(PerformanceRecord).offset(skip).limit(limit))
    return result.scalars().all()


@router.post("/", response_model=PerformanceRecordResponse, status_code=status.HTTP_201_CREATED, summary="Create a performance record")
async def create_record(
    record_in: PerformanceRecordCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new student performance record.

    - **record_in**: Performance data conforming to the PerformanceRecordCreate schema
    """
    record = PerformanceRecord(**record_in.model_dump())
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


@router.get("/students/{student_id}", response_model=List[PerformanceRecordResponse], summary="Get records for a student")
async def get_student_records(
    student_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve all performance records for a specific student.

    - **student_id**: The student's unique identifier
    """
    result = await db.execute(
        select(PerformanceRecord).where(PerformanceRecord.student_id == student_id)
    )
    return result.scalars().all()


@router.get("/students/{student_id}/summary", response_model=StudentSummary, summary="Get performance summary for a student")
async def get_student_summary(
    student_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve an aggregated performance summary for a student.

    Returns average score, total records, and subjects covered.

    - **student_id**: The student's unique identifier
    """
    result = await db.execute(
        select(PerformanceRecord).where(PerformanceRecord.student_id == student_id)
    )
    records = result.scalars().all()

    if not records:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No records found for this student")

    total = len(records)
    avg_score = sum(r.score / r.max_score * 100 for r in records) / total
    subjects = list({r.subject for r in records})
    school_id = records[0].school_id

    return StudentSummary(
        student_id=student_id,
        school_id=school_id,
        total_records=total,
        average_score=round(avg_score, 2),
        subjects=subjects,
    )


@router.get("/{record_id}", response_model=PerformanceRecordResponse, summary="Get a performance record by ID")
async def get_record(
    record_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve a single performance record by its unique identifier.

    - **record_id**: UUID of the record to retrieve
    """
    result = await db.execute(select(PerformanceRecord).where(PerformanceRecord.id == record_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    return record


@router.put("/{record_id}", response_model=PerformanceRecordResponse, summary="Update a performance record")
async def update_record(
    record_id: UUID,
    record_in: PerformanceRecordUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update an existing performance record.

    - **record_id**: UUID of the record to update
    - **record_in**: Fields to update
    """
    result = await db.execute(select(PerformanceRecord).where(PerformanceRecord.id == record_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    update_data = record_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)

    await db.flush()
    await db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a performance record")
async def delete_record(
    record_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a performance record.

    - **record_id**: UUID of the record to delete
    """
    result = await db.execute(select(PerformanceRecord).where(PerformanceRecord.id == record_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    await db.delete(record)
