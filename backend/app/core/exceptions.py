from fastapi import HTTPException, status


class DomainException(Exception):
    """Base exception for all domain business errors."""

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class EntityNotFoundException(DomainException):
    """Raised when a requested resource is not found."""

    pass


class DuplicateEntityException(DomainException):
    """Raised when attempting to create an entity that already exists."""

    pass


class InvalidCredentialsException(DomainException):
    """Raised when authentication credentials fail validation."""

    pass


class UnauthorizedException(DomainException):
    """Raised when an operation lacks necessary permissions."""

    pass


class ExternalServiceException(DomainException):
    """Raised when an external API or service fails."""

    pass


def raise_http_not_found(detail: str = "Resource not found") -> None:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


def raise_http_bad_request(detail: str = "Invalid request") -> None:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


def raise_http_unauthorized(detail: str = "Could not validate credentials") -> None:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def raise_http_forbidden(detail: str = "Operation not permitted") -> None:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
