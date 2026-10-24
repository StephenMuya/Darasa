from app.core.security import hash_password, verify_password


class PasswordService:
    """
    Password Security Service
    Single responsibility: handle password hashing and comparison.
    """

    @staticmethod
    def hash(password: str) -> str:
        """Hash a plaintext password."""
        return hash_password(password)

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        """Verify a plaintext password against a stored hash."""
        return verify_password(plain_password, hashed_password)
