# Resource Library Service

A Python/FastAPI microservice for managing educational resources in the SomaAI CBC platform.

## Overview

This service provides CRUD operations for educational materials, including textbooks, digital content, and teaching materials, serving teachers, students, and parents.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/resources/` | List all resources |
| POST | `/api/v1/resources/` | Create a resource |
| GET | `/api/v1/resources/{id}` | Get resource by ID |
| PUT | `/api/v1/resources/{id}` | Update a resource |
| DELETE | `/api/v1/resources/{id}` | Delete a resource |

## Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/resource_library_db"

# Run the service
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## Running with Docker

```bash
docker build -t resource-library-service .
docker run -p 8001:8001 \
  -e DATABASE_URL="postgresql+asyncpg://postgres:password@db:5432/resource_library_db" \
  resource-library-service
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:password@localhost:5432/resource_library_db` | PostgreSQL connection string |

## Technology Stack

- **Python 3.12**
- **FastAPI** – Web framework
- **SQLAlchemy 2.x** (async) – ORM
- **asyncpg** – Async PostgreSQL driver
- **Pydantic v2** – Data validation
- **Uvicorn** – ASGI server
