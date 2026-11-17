from fastapi import APIRouter

from app.api.v1.endpoints import auth, chat, curriculum, health, lesson_plans, rubrics, storage

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

api_router.include_router(
    storage.router,
    prefix="/storage",
    tags=["AWS S3 Blueprint & Portfolio Storage"],
)

api_router.include_router(
    curriculum.router,
    prefix="/curriculum",
    tags=["KICD Curriculum & Semantic RAG"],
)

api_router.include_router(
    lesson_plans.router,
    prefix="/lesson-plans",
    tags=["KICD CBC Lesson Plans"],
)
