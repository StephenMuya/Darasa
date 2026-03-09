# Training Module Service

A Java/Spring Boot microservice for managing teacher training modules and online courses in the SomaAI CBC platform.

## Overview

This service supports teacher professional development by providing CRUD operations for training modules, enabling educators to access and complete online courses aligned with Kenya's Competency-Based Curriculum.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (Spring Actuator) |
| GET | `/api/v1/training-modules` | List all training modules |
| POST | `/api/v1/training-modules` | Create a training module |
| GET | `/api/v1/training-modules/{id}` | Get module by ID |
| PUT | `/api/v1/training-modules/{id}` | Update a module |
| DELETE | `/api/v1/training-modules/{id}` | Delete a module |

## Running Locally

Requires Java 17+ and Maven 3.9+.

```bash
# Set environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/training_module_db
export DB_USERNAME=postgres
export DB_PASSWORD=password

# Build and run
mvn clean spring-boot:run
```

## Running with Docker

```bash
docker build -t training-module-service .
docker run -p 8004:8004 \
  -e DATABASE_URL=jdbc:postgresql://db:5432/training_module_db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=password \
  training-module-service
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/training_module_db` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | `password` | Database password |
| `PORT` | `8004` | Server port |

## Technology Stack

- **Java 17**
- **Spring Boot 3.x** – Web framework
- **Spring Data JPA** – ORM
- **PostgreSQL** – Database
- **Lombok** – Boilerplate reduction
- **Maven** – Build tool
