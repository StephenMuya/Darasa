"""
Database Initialization & Health Verification Script
Single responsibility: Verify PostgreSQL connectivity, auto-create the database
if missing, provision the plain PostgreSQL schema, and seed initial demo user.
"""
import asyncio
from pathlib import Path
import sys
from urllib.parse import urlparse

# Ensure backend root is in sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import asyncpg
from sqlalchemy import select

from app.core.config import get_settings
from app.core.database import Base, async_session_factory, engine
from app.models.user import User
from app.services.password_service import PasswordService


async def ensure_postgres_database_exists(db_url: str) -> None:
    """Check if the target database exists; if not, create it via postgres admin DB."""
    if not db_url.startswith("postgresql"):
        return

    clean_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(clean_url)
    target_db = parsed.path.lstrip("/")

    admin_url = clean_url.replace(f"/{target_db}", "/postgres")

    try:
        conn = await asyncpg.connect(clean_url, timeout=5)
        await conn.close()
        print(f"[OK] Target database '{target_db}' is accessible.")
        return
    except asyncpg.InvalidCatalogNameError:
        print(f"[*] Database '{target_db}' does not exist. Creating it now...")
    except Exception as e:
        print(f"[!] Target DB not yet directly accessible: {e}")
        print("[*] Attempting connection via admin 'postgres' database...")

    try:
        admin_conn = await asyncpg.connect(admin_url, timeout=5)
        exists = await admin_conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", target_db
        )
        if not exists:
            await admin_conn.execute(f'CREATE DATABASE "{target_db}"')
            print(f"[OK] Database '{target_db}' created successfully!")
        else:
            print(f"[OK] Database '{target_db}' already exists.")
        await admin_conn.close()
    except Exception as e:
        print(f"[ERROR] Could not auto-create database via admin connection: {e}")
        raise


async def create_schema() -> None:
    """Create all plain PostgreSQL tables using SQLAlchemy metadata."""
    print("[*] Creating / verifying database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Schema provisioned successfully (users, conversations, messages).")


async def seed_demo_teacher() -> None:
    """Seed initial teacher account if not already present."""
    async with async_session_factory() as session:
        result = await session.execute(
            select(User).where(User.email == "teacher@darasa.org")
        )
        teacher = result.scalar_one_or_none()

        if not teacher:
            teacher = User(
                email="teacher@darasa.org",
                full_name="Mwalimu Judha",
                role="teacher",
                hashed_password=PasswordService.hash("Teacher@2026"),
                is_active=True,
            )
            session.add(teacher)
            await session.commit()
            print("[OK] Seeded demo teacher account: teacher@darasa.org / Teacher@2026")
        else:
            print(f"[OK] Demo teacher account already exists (ID: {teacher.id})")


async def main() -> None:
    settings = get_settings()
    print("=" * 60)
    print("Darasa Plain PostgreSQL Setup & Initialization")
    print("=" * 60)
    target_display = settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL
    print(f"Target Database URL: {target_display}")

    try:
        if settings.DATABASE_URL.startswith("postgresql"):
            await ensure_postgres_database_exists(settings.DATABASE_URL)
        await create_schema()
        await seed_demo_teacher()
        print("=" * 60)
        print("[SUCCESS] Plain PostgreSQL database is ready for Darasa!")
        print("=" * 60)
    except Exception as e:
        print("=" * 60)
        print(f"[FAILED] Database initialization error: {e}")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
