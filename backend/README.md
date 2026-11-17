# Darasa / SomaAI - Backend Service

Modular Python & FastAPI backend powering the Darasa CBC Educational Intelligence platform. Built with **PostgreSQL**, **Redis**, **AWS S3**, and clean architecture adhering strictly to the **Single Responsibility Principle (SRP)**.

---

## 🛠 Technology Stack

- **Core Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13+)
- **Database & ORM**: Plain PostgreSQL via [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (`asyncpg` async driver)
- **Object Storage**: [AWS S3](https://aws.amazon.com/s3/) via `boto3` for KICD curriculum blueprints & student portfolios
- **Database Migrations**: [Alembic](https://alembic.sqlalchemy.org/) async migrations
- **In-Memory Cache & Session Store**: [Redis](https://redis.io/) (`redis.asyncio`) with fallback in-memory caching
- **Validation & DTOs**: [Pydantic v2](https://docs.pydantic.dev/) + `pydantic-settings`
- **Security & Authentication**: [bcrypt](https://pypi.org/project/bcrypt/) password hashing + [PyJWT](https://pyjwt.readthedocs.io/) access tokens
- **Testing**: [pytest](https://docs.pytest.org/) + `pytest-asyncio` + `httpx`

---

## ☁️ AWS S3 Storage Service

The backend connects to AWS S3 (`darasa-curriculum-blueprints-store` in region `af-south-1`):
- **Curriculum Blueprints**: Stored under `curriculum-raw/{level}/{filename}.pdf` (e.g. `curriculum-raw/upper-primary/GRADE-5-AGRICULTURE-NUTRITION.pdf`).
- **Student Portfolios**: Uploaded under `portfolios/{user_id}/{filename}` with pre-signed upload URLs.
- **Pre-signed Access**: Generates secure, time-limited GET/POST URLs for direct client streaming and browser-to-S3 uploads.

### Endpoints (`/api/v1/storage`):
- `POST /api/v1/storage/upload`: Multipart file upload.
- `GET /api/v1/storage/presigned-download`: Generates secure time-limited download URL.
- `POST /api/v1/storage/presigned-upload`: Generates signed POST policy for direct browser uploads.
- `GET /api/v1/storage/files`: Lists objects under a prefix.
- `GET /api/v1/storage/metadata`: Fetches file size, content-type, and ETag.
- `DELETE /api/v1/storage/file`: Removes an object.

---

## 🐘 Plain PostgreSQL Database Setup

The backend uses **plain PostgreSQL** for core relational domain entities:
- **`users`**: Authentication credentials, roles (`teacher`, `learner`, `parent`), status flags.
- **`conversations`**: Multi-turn conversation sessions tied to a user.
- **`messages`**: Dialogue history, structured CBC materials, and 4-tier formative assessment rubrics.

> **Note on Vector Storage**: Vector embeddings and `pgvector` are intentionally decoupled and will be introduced during the RAG curriculum ingestion pipeline phase (using a dedicated migration without breaking these plain relational tables).

### Option A: Run Plain PostgreSQL via Docker Compose

```bash
cd backend
docker compose -f docker-compose.db.yml up -d
```

### Option B: Use Local Windows PostgreSQL Service

Update `DATABASE_URL` in `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://postgres:<YOUR_LOCAL_PASSWORD>@localhost:5432/darasa_db
```

### Database Initialization & Migration Commands

```bash
cd backend
python scripts/init_db.py
alembic upgrade head
```

---

## 🧪 Running Tests

All 53 test suites run with zero external network or database dependencies (using in-memory `aiosqlite` and mock S3):

```bash
cd backend
python -m pytest tests/ -v
```
---

## 📚 KICD Curriculum Ingestion & Database Seeding (`seed_db.py`)

A dedicated 4-step pipeline to ingest KICD curriculum blueprints, generate vector embeddings, and seed the PostgreSQL `pgvector` store:

1. **Read Processed JSON**: Loads validated blueprints from local disk or downloads from S3 Data Lake (`s3://darasa-curriculum-blueprints-store/curriculum-processed/...`).
2. **Chunking & Semantic Formatting**: Combines titles, Specific Learning Outcomes (SLOs), Suggested Learning Experiences, Key Inquiry Questions (KIQs), and 4-tier formative assessment rubrics.
3. **High-Dimensional Embeddings**: Generates 1536-dimensional embeddings with Google Gemini (`task_type="RETRIEVAL_DOCUMENT"`) or OpenAI (`text-embedding-3-small`).
4. **Batch Upsert (pgvector)**: Stores relational metadata, raw text, and `VECTOR(1536)` embeddings in `curriculum_chunks` with HNSW cosine similarity indexing (`<=>`).

```bash
# Dry run validation
python ingestion/seed_db.py --dry-run

# Seed local JSON file
python ingestion/seed_db.py --json-file ./data/cbc_grade_5_agriculture_nutrition.json

# Seed from AWS S3 Data Lake
python ingestion/seed_db.py --s3-key curriculum-processed/upper-primary/GRADE-5-AGRICULTURE-NUTRITION.json
```

---

## 🔍 Semantic Retrieval & RAG Engine (`/api/v1/curriculum`)

Provides dense semantic vector retrieval and context assembly for downstream generative AI (Lesson Planner & CBC Teacher Assistant):

- `POST /api/v1/curriculum/search`: Asymmetric query embedding (`task_type="RETRIEVAL_QUERY"`) and cosine similarity search (`<=>`) with metadata filtering.
- `GET /api/v1/curriculum/search`: Query-parameter interface for quick browser/curl lookups.
- `POST /api/v1/curriculum/rag-context`: Retrieves top-k matching nodes and synthesizes a structured Markdown context block complete with SLOs, practical experiences, rubrics, and S3 Data Lake citations.
---

## 📝 CBC Lesson Plan & Formative Assessment Generator (`/api/v1/lesson-plans`)

Generates complete, standardized Kenya Competency-Based Curriculum (CBC) lesson designs grounded directly in official KICD blueprints via pgvector RAG:

- `POST /api/v1/lesson-plans/generate`:
  - Retrieves authoritative KICD chunks (Strand, Sub-Strand, SLOs, Inquiry Questions).
  - Generates measurable cognitive, psychomotor, and affective learning outcomes.
  - Suggests practical hands-on activities utilizing **zero-cost, locally available Kenyan materials** (dry leaves, cartons, clean plastic bottles, sticks, garden soil).
  - Outlines phased lesson progression: Introduction, Step 1 (Inquiry), Step 2 (Hands-on Practical), Step 3 (Presentation), Conclusion.
  - Synthesizes the official **4-tier Formative Assessment Rubric** (Exceeding, Meeting, Approaching, Below Expectations).
  - Optionally archives the generated plan (JSON & print-ready Markdown) to AWS S3 Data Lake (`s3://darasa-curriculum-blueprints-store/lesson-plans/...`).
- `POST /api/v1/lesson-plans/export-markdown`: Returns ready-to-print Markdown document attachment.
