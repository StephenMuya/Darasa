from fastapi import APIRouter

from app.api.v1.endpoints import auth, chat, health, rubrics

api_router = APIRouter()

api_router.include_router(
    health.router,
    tags=["System Health"],
)

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication & Users"],
)

api_router.include_router(
    chat.router,
    prefix="/chat",
    tags=["CBC Intelligence & Chat"],
)

api_router.include_router(
    rubrics.router,
    prefix="/rubrics",
    tags=["Formative Assessment Rubrics"],
)
