from typing import Any, Dict, Optional

from app.core.security import create_access_token, decode_access_token


class TokenService:
    """
    JWT Token Management Service
    Single responsibility: create, issue, and decode authentication tokens.
    """

    @staticmethod
    def generate_token(user_id: str, email: str, role: str) -> str:
        """Create a new signed JWT access token for an authenticated user."""
        claims = {
            "email": email,
            "role": role,
        }
        return create_access_token(subject=user_id, claims=claims)

    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """Validate and decode a JWT access token."""
        return decode_access_token(token)
