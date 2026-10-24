from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user_payload, get_db
from app.core.exceptions import (
    DuplicateEntityException,
    InvalidCredentialsException,
    raise_http_bad_request,
    raise_http_not_found,
    raise_http_unauthorized,
)
from app.repositories.user_repository import UserRepository
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New Account",
    description="Create a new user account with role selection (Teacher, Learner, Parent).",
)
async def register(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    repo = UserRepository(db)
    service = AuthService(repo)
    try:
        return await service.register(data)
    except DuplicateEntityException as exc:
        raise_http_bad_request(exc.message)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User Login",
    description="Authenticate credentials and obtain a JWT bearer token.",
)
async def login(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    repo = UserRepository(db)
    service = AuthService(repo)
    try:
        return await service.authenticate(data)
    except InvalidCredentialsException as exc:
        raise_http_unauthorized(exc.message)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User Profile",
    description="Fetch profile details of currently authenticated user.",
)
async def get_me(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    user_id = payload.get("sub")
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if user is None:
        raise_http_not_found("User account not found.")
    return UserResponse.model_validate(user)
