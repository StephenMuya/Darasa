Markdown# somaAI — Intelligent Curriculum Engine for Kenya's Competency-Based Curriculum (CBC)

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL + pgvector](https://img.shields.io/badge/PostgreSQL-16%2B%20%7C%20pgvector-336791.svg)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Redis-Caching%20Layer-DC382D.svg)](https://redis.io/)
[![Curriculum Alignment](https://img.shields.io/badge/Alignment-KICD%20CBC%20Framework-success.svg)](https://kicd.ac.ke/)

**somaAI** is a specialized, curriculum-grounded artificial intelligence platform engineered specifically for Kenya's **Competency-Based Curriculum (CBC)**. Built on a hybrid relational-vector Retrieval-Augmented Generation (RAG) architecture, somaAI bridges the gap between official **Kenya Institute of Curriculum Development (KICD)** syllabus mandates and the daily realities of classrooms and households across Pre-Primary, Primary, Junior School, and Senior School levels.

Unlike generic large language models that default to Western pedagogical standards and grading scales, somaAI anchors every generated response to structured KICD **Strands**, **Sub-Strands**, **Specific Learning Outcomes (SLOs)**, **Suggested Learning Experiences**, and **Key Inquiry Questions (KIQs)**.

---

## Table of Contents

1. [Problem Statement: The CBC Implementation Gap](#1-problem-statement-the-cbc-implementation-gap)
2. [Core Platform Capabilities (Multi-Persona Engine)](#2-core-platform-capabilities-multi-persona-engine)
3. [System Architecture & Technical Design](#3-system-architecture--technical-design)
4. [Intellectual Property & Data Governance](#4-intellectual-property--data-governance)
5. [Technology Stack](#5-technology-stack)
6. [Repository Structure](#6-repository-structure)
7. [Database Architecture & Indexing Strategy](#7-database-architecture--indexing-strategy)
8. [Offline Curriculum Ingestion Pipeline](#8-offline-curriculum-ingestion-pipeline)
9. [Getting Started & Local Development](#9-getting-started--local-development)
10. [Configuration & Environment Variables](#10-configuration--environment-variables)
11. [API Specification](#11-api-specification)
12. [Performance, Caching & Traffic Engineering](#12-performance-caching--traffic-engineering)
13. [Roadmap](#13-roadmap)

---

## 1. Problem Statement: The CBC Implementation Gap

The transition from the legacy 8-4-4 system to the Competency-Based Curriculum (CBC) shifted Kenyan education from rote memorization and summative exams to continuous formative assessment and practical application. While pedagogically sound, implementation has created severe operational friction across four primary stakeholder groups:

*   **For Teachers — Administrative Overload & Rubric Fatigue:** Educators spend excessive hours drafting Quality Assurance (QA)-compliant lesson plans, designing learner-centered classroom activities, and manually constructing four-tier Competency-Based Assessment (CBA) rubrics (`EE`, `ME`, `AE`, `BE`), significantly reducing active instruction time.
*   **For Parents — The Knowledge Gap & "Hidden Costs" of Co-Teaching:** CBC mandates continuous parental engagement via practical home assignments and Community Service Learning (CSL) projects. Parents face recurring financial strain sourcing craft and project materials on short notice, compounded by difficulty explaining modern curriculum concepts at home.
*   **For Students — Lack of Personalized, Real-Time Interventions:** High student-to-teacher ratios limit individualized attention, leaving learners without immediate, Socratic, step-by-step guidance needed to master specific competencies before the syllabus advances.
*   **For Academic Institutions — Standardization & Compliance Bottlenecks:** School administrations lack centralized tooling to audit teacher lesson plans against official term allocations, standardize School-Based Assessments (SBAs) across streams, and format performance records for mandatory **KNEC CBA Portal** uploads.

---

## 2. Core Platform Capabilities (Multi-Persona Engine)

somaAI routes every curriculum query through a persona-aware orchestration layer that adapts tone, pedagogical structure, and output constraints to the active user role:

### 2.1 Parent Portal Mode
*   **Zero-Cost Local Material Substitution Engine:** Translates classroom practical assignments into step-by-step home build guides using free, everyday Kenyan household items (e.g., repurposed cooking fat tubs, maize cobs, charcoal dust, sisal string, bottle tops, old cartons) instead of expensive commercial craft supplies.
*   **CBA Portfolio Evidence Guide:** Instructs parents on the exact observable evidence required by teachers for the student's portfolio (e.g., which construction stages to photograph) to satisfy the **Exceeding Expectation (EE)** rubric tier.
*   **Parent-Child Inquiry Scripts:** Converts official KICD *Key Inquiry Questions* into conversational prompts parents can ask their children while building a project together.

### 2.2 Teacher Dashboard Mode
*   **QA-Compliant Lesson Plan Generator:** Generates structured CBC lesson plans containing Administrative Details, Strand/Sub-Strand mappings, Specific Learning Outcomes, Key Inquiry Questions, Core Competencies, Values, Pertinent and Contemporary Issues (PCIs), and a 3-part lesson flow (*Introduction, Learner-Centered Development, Conclusion*).
*   **Strict Learner-Centered Enforcement:** Programmatically prevents passive phrasing (e.g., *"Teacher explains..."*) in favor of KICD-mandated active facilitation (*"In groups, learners are guided to..."*).
*   **Automated 4-Tier CBA Rubric Engine:** Dynamically builds observable grading criteria mapped across **Exceeding Expectation (EE - 4)**, **Meeting Expectation (ME - 3)**, **Approaching Expectation (AE - 2)**, and **Below Expectation (BE - 1)**.

### 2.3 Student Companion Mode
*   **Socratic Pedagogical Guardrails:** Blocks direct homework answer dumping. Guides learners through concepts step-by-step using localized Kenyan analogies (local markets, *shamba* practices, public transport, local geography) and concludes every turn with a diagnostic check-for-understanding question.
*   **Grade-Calibrated Complexity:** Dynamically adjusts vocabulary and conceptual depth to match the exact Grade filter (`Grade 1` through `Grade 12`).

---

## 3. System Architecture & Technical Design

somaAI decouples **curriculum structure** (stored in PostgreSQL) from **content generation** (handled by the foundational LLM API), connected via a low-latency hybrid retrieval pipeline.

```mermaid
flowchart TD
    subgraph Offline Ingestion Pipeline
        A[KICD Curriculum Design PDFs & OERs] -->|pdfplumber Layout Extraction| B[Raw Multi-Page Table Rows]
        B -->|LLM Structured Output Normalization| C[Atomic Sub-Strand JSON Blueprints]
        C -->|Embedding Generation| D[(PostgreSQL + pgvector)]
    end

    subgraph Online Runtime Engine
        U[React / Tailwind Frontend] -->|POST /api/v1/ask| F[FastAPI Async Gateway]
        F -->|1. Check Deterministic/Semantic Hash| R[(Redis Cache)]
        R -->|Cache Hit < 15ms| F
        F -->|2. Cache Miss: B-Tree Pre-Filter + HNSW Vector Search| D
        D -->|Top-K Sub-Strand Blueprints| F
        F -->|3. Inject Persona Constraints + KICD Context| L[LLM Generation Engine]
        L -->|Curriculum-Grounded Response| F
        F -->|4. Async Write TTL 24h| R
        F -->|JSON / SSE Stream| U
    end
Architectural HighlightsAtomic Sub-Strand Partitioning: Standard fixed-token RAG chunking breaks KICD landscape specification tables across pages, separating learning outcomes from their corresponding assessment rubrics. somaAI treats each Sub-Strand as a single, indivisible atomic record.Two-Stage Hybrid Retrieval: Prevents cross-grade syllabus contamination (e.g., confusing Grade 4 nutrition with Grade 8 nutrition) by applying a hard B-Tree relational pre-filter (grade and subject) prior to executing HNSW cosine distance vector search (pgvector).Persona Prompt Injection: Combines retrieved KICD JSON specifications with strict system-level persona rules at inference time.4. Intellectual Property & Data GovernancesomaAI is architected on a strict Clean-Room Curriculum Abstraction model to ensure full compliance with the Kenya Copyright Act:Zero Commercial Textbook Ingestion: somaAI does not ingest, chunk, store, or redistribute proprietary KICD-approved commercial coursebooks (e.g., KLB, Longhorn, Moran, Oxford).Functional Syllabus Mapping: The ingestion pipeline extracts structural curriculum metadata—such as grade allocations, strand hierarchies, required competencies, and inquiry themes—from public KICD Curriculum Design frameworks and openly licensed resources on the Kenya Education Cloud (KEC OERs).Dynamic Original Generation: No verbatim copyrighted prose is stored for public distribution. At runtime, the database supplies the structural syllabus requirements to the LLM, which synthesizes 100% original explanations, lesson plans, and home project guides on demand.5. Technology StackLayerTechnologyRoleAPI FrameworkFastAPI (Python 3.11+)Asynchronous REST & SSE streaming API gatewayData ValidationPydantic v2 & Pydantic SettingsStrict request/response schema validation and structured LLM parsingPrimary DatabasePostgreSQL 16+Relational metadata storage & JSONB curriculum payload engineVector Searchpgvector (HNSW Indexing)High-dimensional semantic similarity search over curriculum strandsDatabase ORMSQLAlchemy 2.0 (Async) + asyncpgNon-blocking database connection pooling and query executionCaching LayerRedis 7+ (redis-py async)Sub-15ms deterministic and high-frequency query cachingDocument ParsingpdfplumberCoordinate and grid-line aware PDF table extractionAI / LLM LayerOpenAI API / Compatible LLM SDKEmbedding generation (text-embedding-3-small) & persona inferenceFrontend ClientReact + Tailwind CSSResponsive multi-persona web application6. Repository StructurePlaintextsomaai-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application lifecycle, CORS & router registration
│   ├── config.py            # Environment configuration via Pydantic BaseSettings
│   ├── database.py          # Async SQLAlchemy engine & session dependency injection
│   ├── models.py            # PostgreSQL ORM models (Relational + JSONB + Vector)
│   ├── schemas.py           # Request/Response Pydantic contracts
│   ├── routers/
│   │   ├── __init__.py
│   │   └── chat.py          # Primary /api/v1/ask inference & caching endpoints
│   └── services/
│       ├── __init__.py
│       ├── cache.py         # Redis key hashing, retrieval, and TTL management
│       ├── retriever.py     # Hybrid metadata pre-filtering & pgvector similarity search
│       └── llm_engine.py    # Persona prompt templates & LLM completion orchestration
├── ingestion/
│   ├── __init__.py
│   ├── parse_kicd_pdf.py    # Layout-aware PDF table extractor & multi-page stitcher
│   └── seed_db.py           # Embedding generator & idempotent PostgreSQL upsert script
├── data/
│   └── raw_pdfs/            # Local staging directory for KICD Curriculum Design PDFs
├── requirements.txt         # Locked Python dependencies
└── .env.example             # Template environment configuration
7. Database Architecture & Indexing StrategyThe curriculum_substrands table combines relational filtering, semi-structured document storage, and vector indexing within a single PostgreSQL table:ColumnTypeIndex TypeDescriptiondocument_idVARCHAR(64)PRIMARY KEYDeterministic ID (e.g., cbc_g7_intsci_1_1) for idempotent upsertseducation_levelVARCHAR(50)—Primary, Junior School, or Senior SchoolgradeINTEGERB-Tree (Composite)CBC Grade level (1 to 12)subjectVARCHAR(100)B-Tree (Composite)Official KICD Learning Area namestrand_id / nameVARCHAR—Top-level syllabus section (e.g., 1.0 Scientific Investigation)sub_strand_id / nameVARCHAR—Atomic syllabus unit (e.g., 1.1 Introduction to Integrated Science)content_payloadJSONBGIN IndexArrays of specific_learning_outcomes, suggested_learning_experiences, key_inquiry_questions, core_competencies, and valuessemantic_embedding_textTEXT—Flattened hierarchical text string used to compute the embeddingembeddingVECTOR(1536)HNSW (vector_cosine_ops)1536-dimensional vector representation (m=16, ef_construction=64)8. Offline Curriculum Ingestion PipelineBecause KICD Curriculum Design tables frequently split single Sub-Strands across multiple landscape PDF pages, the ingestion/ pipeline executes a three-step normalization workflow:Grid-Line Table Extraction (parse_kicd_pdf.py): Uses pdfplumber with explicit vertical and horizontal line strategies to extract tabular cell contents while stripping page headers, footers, and introductory boilerplate.Cross-Page Stitching & Schema Enforcement: Passes raw page-by-page table dumps into a temperature-zero structured extraction pass (CurriculumBatch Pydantic schema) that merges multi-page sub-strand rows into clean JSON objects.Dense Context Flattening & Upsert (seed_db.py): Concatenates the Grade, Subject, Strand, Sub-Strand, Outcomes, Experiences, and Inquiry Questions into a single dense paragraph, generates its vector embedding, and performs an idempotent ON CONFLICT (document_id) DO UPDATE into PostgreSQL.9. Getting Started & Local Development9.1 PrerequisitesPython: 3.11 or higherPostgreSQL: 16.x with the pgvector extension installedRedis: 7.x (local instance or Docker container)LLM API Key: OpenAI API key (or compatible provider)9.2 Infrastructure Setup (Docker Quickstart)Spin up local PostgreSQL (pgvector enabled) and Redis instances:Bash# Start PostgreSQL 16 with pgvector
docker run -d \
  --name somaai-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=somaai \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Start Redis
docker run -d \
  --name somaai-redis \
  -p 6379:6379 \
  redis:7-alpine
9.3 Backend InstallationBash# 1. Clone the repository
git clone [https://github.com/your-org/somaai-backend.git](https://github.com/your-org/somaai-backend.git)
cd somaai-backend

# 2. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
# .venv\Scripts\activate         # Windows PowerShell

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
9.4 Running the Ingestion PipelinePlace a KICD Curriculum Design PDF inside data/raw_pdfs/ and trigger the seeding script:Bashpython -m ingestion.seed_db
9.5 Running the API ServerBashuvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
Interactive Swagger UI: http://localhost:8000/docsReDoc Specification: http://localhost:8000/redoc10. Configuration & Environment VariablesConfigure the .env file in the project root:Ini, TOML# Application Settings
APP_ENV=development
APP_PORT=8000
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# PostgreSQL + pgvector Connection (Asyncpg driver required)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/somaai

# Redis Caching Layer
REDIS_URL=redis://localhost:6379/0
CACHE_TTL_SECONDS=86400

# LLM & Embedding Configuration
OPENAI_API_KEY=sk-proj-your-api-key-here
EMBEDDING_MODEL=text-embedding-3-small
GENERATION_MODEL=gpt-4o-mini
RETRIEVAL_TOP_K=2
11. API SpecificationPOST /api/v1/askRetrieves official KICD curriculum context and generates a persona-specific response.Request PayloadJSON{
  "persona": "parent",
  "grade": 5,
  "subject": "Science and Technology",
  "query": "My child was told to make an improvised water filter for homework. What materials can we use at home?"
}
Response Payload (200 OK)JSON{
  "answer": "### Grade 5 Science & Technology: Improvised Water Filter\n\nYou do not need to buy anything from the supermarket for this assignment...",
  "cached": false,
  "kicd_sources": [
    {
      "grade": 5,
      "subject": "Science and Technology",
      "strand": "2.0 Matter",
      "sub_strand": "2.3 Water Conservation and Purification"
    }
  ]
}
12. Performance, Caching & Traffic EngineeringKenyan educational traffic exhibits sharp diurnal spikes between 18:00 and 21:30 EAT on weekdays and Sunday afternoons. somaAI mitigates latency and LLM token expenditure through:Deterministic SHA-256 Request Hashing: Queries are normalized (lowercase, whitespace-trimmed) and hashed alongside persona, grade, and subject (soma:cache:<sha256>). Identical requests for standard lesson plans or common homework projects resolve directly from Redis in <15ms with zero LLM cost.Connection Pooling: SQLAlchemy async connection pools (pool_size=20, max_overflow=10) with asyncpg ensure non-blocking I/O under high concurrency.Scoped Vector Scans: Enforcing B-Tree pre-filtering on grade and subject shrinks the HNSW search space by >90% per query, maintaining sub-30ms database retrieval times even as the database scales across all Grades (1–12) and Learning Areas.13. Roadmap[x] Core Hybrid RAG Architecture (PostgreSQL + pgvector + FastAPI)[x] Multi-Persona Prompt Engine (Parent, Teacher, Student)[x] Deterministic Redis Caching Layer[ ] Server-Sent Events (SSE) real-time token streaming for Lesson Plan generation[ ] Semantic Query Cache (vector-matching similar parent questions at >0.92 threshold)[ ] KNEC CBA Portal CSV/Excel Export Module for Academic Institutions[ ] Kiswahili (Kazi Mradi / Mtaala wa Umilisi) bi-lingual support for Indigenous & Kiswahili learning areasLicenseProprietary and Confidential. © 2026 somaAI. All rights reserved.
