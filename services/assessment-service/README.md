# Assessment Service

A Python/FastAPI microservice for managing competency-based assessments in the SomaAI CBC platform.

## Overview

This service provides CRUD operations for competency-based assessments, supporting formative, summative, diagnostic, project, and observation assessment types.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/assessments/` | List all assessments |
| POST | `/api/v1/assessments/` | Create an assessment |
| GET | `/api/v1/assessments/{id}` | Get assessment by ID |
| PUT | `/api/v1/assessments/{id}` | Update an assessment |
| DELETE | `/api/v1/assessments/{id}` | Delete an assessment |

## Running Locally

```bash
pip install -r requirements.txt
export DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/assessment_db"
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

## Running with Docker

```bash
docker build -t assessment-service .
docker run -p 8002:8002 \
  -e DATABASE_URL="postgresql+asyncpg://postgres:password@db:5432/assessment_db" \
  assessment-service
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:password@localhost:5432/assessment_db` | PostgreSQL connection string |

## Technology Stack

- **Python 3.12**
- **FastAPI** – Web framework
- **SQLAlchemy 2.x** (async) – ORM
- **asyncpg** – Async PostgreSQL driver
- **Pydantic v2** – Data validation
- **Uvicorn** – ASGI server
