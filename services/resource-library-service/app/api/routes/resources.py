"""
API routes for the Resource Library Service.

Provides CRUD endpoints for managing educational resources.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceResponse

router = APIRouter()


@router.get("/", response_model=List[ResourceResponse], summary="List all resources")
async def list_resources(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve a paginated list of all educational resources.

    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    """
    result = await db.execute(select(Resource).offset(skip).limit(limit))
    resources = result.scalars().all()
    return resources


@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED, summary="Create a resource")
async def create_resource(
    resource_in: ResourceCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new educational resource in the library.

    - **resource_in**: Resource data conforming to the ResourceCreate schema
    """
    resource = Resource(**resource_in.model_dump())
    db.add(resource)
    await db.flush()
    await db.refresh(resource)
    return resource


@router.get("/{resource_id}", response_model=ResourceResponse, summary="Get a resource by ID")
async def get_resource(
    resource_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve a single educational resource by its unique identifier.

    - **resource_id**: UUID of the resource to retrieve
    """
    result = await db.execute(select(Resource).where(Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return resource


@router.put("/{resource_id}", response_model=ResourceResponse, summary="Update a resource")
async def update_resource(
    resource_id: UUID,
    resource_in: ResourceUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update an existing educational resource.

    - **resource_id**: UUID of the resource to update
    - **resource_in**: Fields to update (only provided fields are changed)
    """
    result = await db.execute(select(Resource).where(Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    update_data = resource_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resource, field, value)

    await db.flush()
    await db.refresh(resource)
    return resource


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a resource")
async def delete_resource(
    resource_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete an educational resource from the library.

    - **resource_id**: UUID of the resource to delete
    """
    result = await db.execute(select(Resource).where(Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    await db.delete(resource)
