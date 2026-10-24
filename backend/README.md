# Darasa / SomaAI - Backend Service

Modular Python & FastAPI backend powering the Darasa CBC Educational Intelligence platform. Built with **PostgreSQL**, **Redis**, and clean architecture adhering strictly to the **Single Responsibility Principle (SRP)**.

---

## 🛠 Technology Stack

- **Core Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13+)
- **Database & ORM**: Plain PostgreSQL via [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (`asyncpg` async driver)
- **Database Migrations**: [Alembic](https://alembic.sqlalchemy.org/) async migrations
- **In-Memory Cache & Session Store**: [Redis](https://redis.io/) (`redis.asyncio`) with fallback in-memory caching
- **Validation & DTOs**: [Pydantic v2](https://docs.pydantic.dev/) + `pydantic-settings`
- **Security & Authentication**: [bcrypt](https://pypi.org/project/bcrypt/) password hashing + [PyJWT](https://pyjwt.readthedocs.io/) access tokens
- **Testing**: [pytest](https://docs.pytest.org/) + `pytest-asyncio` + `httpx`

---

## 🐘 Plain PostgreSQL Database Setup

The backend uses **plain PostgreSQL** for core relational domain entities:
- **`users`**: Authentication credentials, roles (`teacher`, `learner`, `parent`), status flags.
- **`conversations`**: Multi-turn conversation sessions tied to a user.
- **`messages`**: Dialogue history, structured CBC materials, and 4-tier formative assessment rubrics.

> **Note on Vector Storage**: Vector embeddings and `pgvector` are intentionally decoupled and will be introduced during the RAG curriculum ingestion pipeline phase (using a dedicated migration without breaking these plain relational tables).

### Option A: Run Plain PostgreSQL via Docker Compose

A dedicated database compose file is provided:

```bash
cd backend
docker compose -f docker-compose.db.yml up -d
```

This spins up:
- PostgreSQL 16 on `localhost:5432` (database: `darasa_db`, user: `postgres`, password: `password`)
- Redis 7 on `localhost:6379`

*(If port 5432 is already occupied by a local PostgreSQL service, adjust the port in `docker-compose.db.yml` to `5433:5432` and update `DATABASE_URL` in `.env`).*

### Option B: Use Local Windows PostgreSQL Service

If you have PostgreSQL installed locally on Windows (e.g. PostgreSQL 18 on port 5432):
1. Copy `.env.example` to `.env`.
2. Update `DATABASE_URL` with your local PostgreSQL password:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:<YOUR_LOCAL_PASSWORD>@localhost:5432/darasa_db
   ```

### Database Initialization & Migration Commands

Run the automated verification & seeding script:

```bash
cd backend
python scripts/init_db.py
```

This script:
1. Verifies connectivity to PostgreSQL.
2. Automatically creates the database `darasa_db` if it does not yet exist.
3. Provisions all plain PostgreSQL tables (`users`, `conversations`, `messages`).
4. Seeds a default demo teacher account (`teacher@darasa.org` / `Teacher@2026`).

To run or manage Alembic migrations manually:

```bash
# Apply migrations to latest revision
alembic upgrade head

# Rollback one revision
alembic downgrade -1
```

---

## 📁 Modular Directory Architecture (Single Responsibility)

```
backend/
├── alembic/                        # Async database migration versions
│   ├── env.py                      # Alembic async configuration
│   └── versions/
│       └── 0001_initial_schema.py  # Plain PostgreSQL baseline schema
├── alembic.ini                     # Alembic runtime settings
├── docker-compose.db.yml           # Standalone PostgreSQL 16 & Redis 7 container stack
├── scripts/
│   └── init_db.py                  # Database verification, creation & demo seeding
├── app/
│   ├── main.py                     # FastAPI application factory & lifespan
│   ├── core/                       # Core configurations, security & infrastructure
│   │   ├── config.py               # Pydantic Settings & external API placeholders
│   │   ├── database.py             # SQLAlchemy Async Engine, sessionmaker, Base
│   │   ├── redis_client.py         # Async Redis connection pool manager
│   │   ├── security.py             # bcrypt hashing & JWT encoding/decoding
│   │   ├── exceptions.py           # Domain exceptions & HTTP handlers
│   │   └── dependencies.py         # Dependency injection (get_db, get_redis, get_current_user)
│   ├── models/                     # SQLAlchemy persistence entities (1 model per file)
│   │   ├── base.py                 # TimestampMixin and Base
│   │   ├── user.py                 # User account entity (Teacher, Learner, Parent roles)
│   │   ├── conversation.py         # Multi-turn conversation sessions
│   │   └── message.py              # Individual message turns with JSON CBC metadata
│   ├── schemas/                    # Pydantic v2 validation contracts
│   │   ├── common.py               # Health, readiness, and standard message schemas
│   │   ├── user.py                 # UserCreate, UserLogin, UserResponse, TokenResponse
│   │   ├── chat.py                 # InquiryRequest/Response, PracticalMaterial, ConversationResponse
│   │   └── rubric.py               # 4-tier formative assessment rubric schemas (EE, ME, AE, BE)
│   ├── repositories/               # Data access layer (pure SQL queries)
│   │   ├── user_repository.py      # User entity queries
│   │   ├── conversation_repository.py # Conversation session queries
│   │   └── message_repository.py   # Message entity queries
│   ├── services/                   # Business logic layer (SRP: 1 task per service)
│   │   ├── password_service.py     # Password hashing and verification
│   │   ├── token_service.py        # JWT generation and validation
│   │   ├── cache_service.py        # Redis caching operations with fallback
│   │   ├── auth_service.py         # User registration and credential authentication
│   │   ├── external_llm_client.py  # LLM API client with placeholder fallback
│   │   ├── nemis_client.py         # Kenya NEMIS portal integration placeholder
│   │   ├── cbc_inquiry_service.py  # KICD pedagogical reasoning and rubric generation
│   │   └── chat_service.py         # Multi-turn conversation lifecycle & caching
│   └── api/                        # Route controllers
│       ├── router.py               # Master API router aggregator
│       └── v1/endpoints/
│           ├── health.py           # GET /health, GET /ready
│           ├── auth.py             # POST /auth/register, POST /auth/login, GET /auth/me
│           ├── chat.py             # POST /chat/inquiry, POST /chat/conversations
│           └── rubrics.py          # POST /rubrics/generate
├── tests/                          # Automated test suites
│   ├── conftest.py                 # Async in-memory SQLite fixtures & mock test clients
│   ├── test_health.py              # Health & readiness probe tests
│   ├── test_auth.py                # Authentication, registration & token tests
│   ├── test_chat.py                # CBC inquiry & conversation tests
│   ├── test_rubrics.py             # 4-tier rubric generator tests
│   ├── test_services.py            # Unit tests for individual services (SRP)
│   └── test_external_clients.py    # Unit tests for external API placeholders
├── .env.example                    # All configurations & external API placeholders
├── requirements.txt                # Production dependencies
├── requirements-dev.txt            # Development & testing dependencies
├── pyproject.toml                  # pytest & tool configurations
└── Dockerfile                      # Production container image
```

---

## 🔑 External API Placeholders & Integrations

The backend provides designated placeholders in `.env.example` and `app/core/config.py`:

- **LLM Providers**: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GEMINI_API_KEY`. When using placeholder keys, the `ExternalLLMClient` gracefully falls back to deterministic local KICD curriculum reasoning without network latency or errors.
- **Kenya NEMIS SSO**: `NEMIS_CLIENT_ID`, `NEMIS_CLIENT_SECRET`. When in placeholder mode, `NEMISClient` simulates verified learner UPI records for sandbox development.
- **M-Pesa Daraja Payment Gateway**: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`.
- **Vector Search Index**: `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`.

---

## 🧪 Running Tests

All tests run asynchronously with zero external database dependencies (using isolated in-memory `aiosqlite` and memory-fallback caching):

```bash
cd backend
python -m pytest -v
```
