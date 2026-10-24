from app.core.exceptions import DuplicateEntityException, InvalidCredentialsException
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.password_service import PasswordService
from app.services.token_service import TokenService


class AuthService:
    """
    Authentication & User Onboarding Service
    Single responsibility: orchestrate account registration, credential verification,
    and access token generation.
    """

    def __init__(self, user_repo: UserRepository):
        self._user_repo = user_repo

    async def register(self, data: UserCreate) -> UserResponse:
        """Register a new user account with unique email enforcement."""
        existing = await self._user_repo.get_by_email(data.email)
        if existing is not None:
            raise DuplicateEntityException(
                f"Account with email '{data.email}' already exists."
            )

        hashed_pwd = PasswordService.hash(data.password)
        new_user = User(
            email=data.email.lower().strip(),
            full_name=data.full_name.strip(),
            hashed_password=hashed_pwd,
            role=data.role.value,
            is_active=True,
        )
        saved = await self._user_repo.create(new_user)
        return UserResponse.model_validate(saved)

    async def authenticate(self, data: UserLogin) -> TokenResponse:
        """Verify user credentials and return a signed JWT token with user profile."""
        user = await self._user_repo.get_by_email(data.email)
        if user is None:
            raise InvalidCredentialsException("Invalid email or password.")

        if not PasswordService.verify(data.password, user.hashed_password):
            raise InvalidCredentialsException("Invalid email or password.")

        token = TokenService.generate_token(
            user_id=user.id,
            email=user.email,
            role=user.role,
        )
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
