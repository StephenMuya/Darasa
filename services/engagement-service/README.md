# Engagement Service

A Java/Spring Boot microservice for managing interactive learning and engagement tools in the SomaAI CBC platform.

## Overview

This service provides CRUD operations for engagement activities including quizzes, polls, discussions, group activities, games, and projects designed to foster active participation and critical thinking.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (Spring Actuator) |
| GET | `/api/v1/engagements` | List all engagements |
| POST | `/api/v1/engagements` | Create an engagement |
| GET | `/api/v1/engagements/{id}` | Get engagement by ID |
| PUT | `/api/v1/engagements/{id}` | Update an engagement |
| DELETE | `/api/v1/engagements/{id}` | Delete an engagement |

## Running Locally

Requires Java 17+ and Maven 3.9+.

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/engagement_db
export DB_USERNAME=postgres
export DB_PASSWORD=password

mvn clean spring-boot:run
```

## Running with Docker

```bash
docker build -t engagement-service .
docker run -p 8005:8005 \
  -e DATABASE_URL=jdbc:postgresql://db:5432/engagement_db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=password \
  engagement-service
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/engagement_db` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | `password` | Database password |
| `PORT` | `8005` | Server port |

## Technology Stack

- **Java 17**
- **Spring Boot 3.x** – Web framework
- **Spring Data JPA** – ORM
- **PostgreSQL** – Database
- **Lombok** – Boilerplate reduction
- **Maven** – Build tool
