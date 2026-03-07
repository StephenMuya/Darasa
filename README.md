# SomaAI

## Project Description
SomaAI is an innovative educational API platform designed to address the challenges within the Competency-Based Curriculum (CBC) ecosystem in Kenya. Our main goal is to streamline the educational experience for teachers, students, parents, and schools by providing a comprehensive set of tools and resources that enhance learning outcomes.

## CBC Ecosystem Problems
The CBC ecosystem faces several problems that hinder effective learning and teaching:

1. **Inadequate Resources**: Many schools lack the necessary educational resources, including textbooks, digital content, and teaching materials.
2. **Teacher Training**: Teachers often receive insufficient training in implementing the CBC, leading to challenges in delivering the curriculum effectively.
3. **Student Engagement**: Engaging students in a manner that fosters critical thinking and problem-solving can be difficult with traditional teaching methods.
4. **Parental Involvement**: Parents may struggle to understand the curriculum and how to support their children's learning at home.
5. **Assessment Challenges**: The shift from traditional exams to competency-based assessments poses difficulties for teachers and students alike.
6. **Data Management**: Schools often lack the tools needed to manage student data effectively, leading to inefficiencies in tracking progress and outcomes.

## Engineering Challenges
### For Teachers:
- Adapting lesson plans to a competency-based framework.
- Accessing effective digital tools that align with the curriculum.
- Receiving ongoing professional development to improve teaching methods.

### For Students:
- Finding resources that cater to different learning styles and paces.
- Developing skills in self-directed learning and critical thinking.

### For Parents:
- Understanding the new grading systems and assessment methods.
- Engaging with schools and teachers to support their children's learning.

### For Schools:
- Integrating technology into the classroom environment.
- Managing the transition from traditional to competency-based assessments effectively.

## Technical Approach
SomaAI utilizes a microservices architecture to provide scalable and efficient API services that address the various challenges in the CBC ecosystem. The platform includes:
- **Resource Libraries**: A comprehensive database of educational materials accessible to teachers, students, and parents.
- **Training Modules**: Online courses and resources for teacher training and development in line with the CBC.
- **Engagement Tools**: Features that promote interactive learning experiences.
- **Assessment Tools**: Digital solutions to help students and teachers manage competency-based assessments seamlessly.
- **Data Analytics**: Tools for schools to analyze student performance and inform instruction.

By leveraging technology, SomaAI aims to create a supportive educational ecosystem that meets the diverse needs of stakeholders in the CBC framework.


---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| API Gateway | Python 3.12 · FastAPI · httpx |
| Resource Library Service | Python 3.12 · FastAPI · SQLAlchemy 2 (async) · PostgreSQL |
| Assessment Service | Python 3.12 · FastAPI · SQLAlchemy 2 (async) · PostgreSQL |
| Analytics Service | Python 3.12 · FastAPI · SQLAlchemy 2 (async) · PostgreSQL |
| Training Module Service | Java 17 · Spring Boot 3 · Spring Data JPA · PostgreSQL · Lombok |
| Engagement Service | Java 17 · Spring Boot 3 · Spring Data JPA · PostgreSQL · Lombok |
| Database | PostgreSQL 16 |
| Cache | Redis 7 (optional) |
| Containerisation | Docker · Docker Compose |

---

## Project Structure

```
SomaAI/
├── api-gateway/                        # FastAPI API Gateway (port 8000)
│   ├── app/
│   │   └── main.py                     # Route forwarding to microservices
│   ├── requirements.txt
│   └── Dockerfile
├── services/
│   ├── resource-library-service/       # Python/FastAPI – port 8001
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/routes/resources.py
│   │   │   ├── models/resource.py
│   │   │   ├── schemas/resource.py
│   │   │   ├── core/config.py
│   │   │   └── db/database.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── assessment-service/             # Python/FastAPI – port 8002
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/routes/assessments.py
│   │   │   ├── models/assessment.py
│   │   │   ├── schemas/assessment.py
│   │   │   ├── core/config.py
│   │   │   └── db/database.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── analytics-service/              # Python/FastAPI – port 8003
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/routes/analytics.py
│   │   │   ├── models/analytics.py
│   │   │   ├── schemas/analytics.py
│   │   │   ├── core/config.py
│   │   │   └── db/database.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── training-module-service/        # Java/Spring Boot – port 8004
│   │   ├── src/main/java/com/somaai/training/
│   │   │   ├── TrainingModuleApplication.java
│   │   │   ├── controller/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── dto/
│   │   ├── src/main/resources/application.yml
│   │   ├── pom.xml
│   │   └── Dockerfile
│   └── engagement-service/             # Java/Spring Boot – port 8005
│       ├── src/main/java/com/somaai/engagement/
│       │   ├── EngagementApplication.java
│       │   ├── controller/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── service/
│       │   └── dto/
│       ├── src/main/resources/application.yml
│       ├── pom.xml
│       └── Dockerfile
├── scripts/
│   └── create-multiple-postgresql-databases.sh
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

### Run all services with Docker Compose

```bash
# Clone the repository
git clone https://github.com/StephenMuya/SomaAI.git
cd SomaAI

# Build and start all services (first run may take a few minutes)
docker compose up --build
```

Once all services are up, the following endpoints are available:

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:8000 |
| Resource Library | http://localhost:8001 |
| Assessment | http://localhost:8002 |
| Analytics | http://localhost:8003 |
| Training Modules | http://localhost:8004 |
| Engagement | http://localhost:8005 |

Interactive API docs (Swagger UI) for each Python service are accessible at `<service-url>/docs`.

### Run a single service locally (Python)

```bash
cd services/resource-library-service
pip install -r requirements.txt
export DATABASE_URL="******localhost:5432/resource_library_db"
uvicorn app.main:app --reload --port 8001
```

### Run a single service locally (Java)

```bash
cd services/training-module-service
export DATABASE_URL=jdbc:postgresql://localhost:5432/training_module_db
export DB_USERNAME=postgres
export DB_PASSWORD=password
mvn clean spring-boot:run
```

### Stop all services

```bash
docker compose down
# To also remove volumes (database data):
docker compose down -v
```
