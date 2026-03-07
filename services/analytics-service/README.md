# Analytics Service

A Python/FastAPI microservice for data analytics and student performance tracking in the SomaAI CBC platform.

## Overview

This service enables schools to record and analyze student performance data, track competency progression, and generate insights to inform instruction.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/analytics/` | List all performance records |
| POST | `/api/v1/analytics/` | Create a performance record |
| GET | `/api/v1/analytics/{id}` | Get record by ID |
| PUT | `/api/v1/analytics/{id}` | Update a record |
| DELETE | `/api/v1/analytics/{id}` | Delete a record |
| GET | `/api/v1/analytics/students/{student_id}` | Get all records for a student |
| GET | `/api/v1/analytics/students/{student_id}/summary` | Get performance summary for a student |

## Running Locally

```bash
pip install -r requirements.txt
export DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/analytics_db"
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

## Running with Docker

```bash
docker build -t analytics-service .
docker run -p 8003:8003 \
  -e DATABASE_URL="postgresql+asyncpg://postgres:password@db:5432/analytics_db" \
  analytics-service
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:password@localhost:5432/analytics_db` | PostgreSQL connection string |

## Technology Stack

- **Python 3.12**
- **FastAPI** – Web framework
- **SQLAlchemy 2.x** (async) – ORM
- **asyncpg** – Async PostgreSQL driver
- **Pydantic v2** – Data validation
- **Uvicorn** – ASGI server
