from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(str, Enum):
    TEACHER = "teacher"
    LEARNER = "learner"
    PARENT = "parent"
    ADMIN = "admin"


class UserCreate(BaseModel):
    """Payload for user account registration."""

    email: EmailStr = Field(..., example="mwalimu@school.ac.ke")
    full_name: str = Field(..., min_length=2, max_length=150, example="Jane Wanjiku")
    password: str = Field(..., min_length=6, max_length=100, example="KenyaCBC2026!")
    role: UserRole = Field(default=UserRole.TEACHER, example=UserRole.TEACHER)


class UserLogin(BaseModel):
    """Payload for user authentication / login."""

    email: EmailStr = Field(..., example="mwalimu@school.ac.ke")
    password: str = Field(..., min_length=1, example="KenyaCBC2026!")


class UserResponse(BaseModel):
    """Public user response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    """JWT bearer token response."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
