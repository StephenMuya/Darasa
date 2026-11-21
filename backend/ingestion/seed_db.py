"""
KICD CBC Curriculum Database Seeding & Vector Embedding Pipeline
Single responsibility: load parsed KICD JSON blueprints from local storage or S3,
synthesize contextual semantic text chunks, generate high-dimensional vector embeddings,
and batch upsert relational records and vector embeddings into PostgreSQL (pgvector).

Phase Breakdown:
  Step 1: Read Processed JSON (local or S3 Data Lake)
  Step 2: Chunking & Semantic Text Formatting (combining titles, SLOs, experiences, KIQs, rubrics)
  Step 3: Generate High-Dimensional Vector Embeddings (Gemini / OpenAI VECTOR(1536))
  Step 4: Batch Upsert into PostgreSQL (pgvector) with metadata, raw chunks, embeddings, and S3 URIs.
"""
import argparse
import asyncio
import json
import logging
import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union
from uuid import uuid4

# Ensure backend root is on sys.path for direct module imports
_backend_dir = Path(__file__).resolve().parent.parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from app.core.config import get_settings
from app.core.database import async_session_factory
from app.repositories.curriculum_chunk_repository import CurriculumChunkRepository
from app.schemas.curriculum import AssessmentCriterion, CurriculumBlueprint, CurriculumChunkCreate
from app.services.embedding_service import EmbeddingService
from app.services.s3_storage_service import S3StorageService

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed_db")


def extract_codes(title: str) -> Tuple[str, str]:
    """
    Extracts numerical code and clean text from strand/sub-strand title.
    Example: '1.0 CONSERVATION OF RESOURCES' -> ('1.0', 'CONSERVATION OF RESOURCES')
    Example: '1.1 Soil Conservation' -> ('1.1', 'Soil Conservation')
    """
    match = re.match(r"^(\d+\.[\d\.]*)\s*(.*)$", title.strip())
    if match:
        return match.group(1).rstrip("."), match.group(2).strip()
    return "", title.strip()


# =============================================================================
# Step 1: Read the Processed JSON
# =============================================================================
async def read_processed_json(
    source_path_or_key: Union[str, Path],
    storage_service: Optional[S3StorageService] = None,
) -> Tuple[CurriculumBlueprint, Dict[str, Any]]:
    """
    Step 1: Loads and parses the structured KICD JSON file.
    Supports:
      - Local filesystem paths (e.g., cbc_grade_5_agriculture_nutrition.json)
      - S3 URIs or Keys (e.g., curriculum-processed/upper-primary/file.json or s3://...)
    """
    source_str = str(source_path_or_key)
    metadata_provenance = {
        "source": source_str,
        "loaded_from": "local",
    }

    if source_str.startswith("s3://") or source_str.startswith("curriculum-processed/"):
        logger.info(f"[*] Step 1: Loading processed JSON from S3 Data Lake: {source_str}")
        storage = storage_service or S3StorageService()
        s3_key = source_str.replace(f"s3://{get_settings().S3_BUCKET_NAME}/", "")
        raw_bytes = await storage.download_bytes(s3_key)
        raw_dict = json.loads(raw_bytes.decode("utf-8"))
        metadata_provenance["loaded_from"] = "s3"
        metadata_provenance["s3_processed_uri"] = f"s3://{get_settings().S3_BUCKET_NAME}/{s3_key}"
    else:
        path = Path(source_str)
        if not path.exists():
            raise FileNotFoundError(f"Processed JSON file not found: {source_str}")
        logger.info(f"[*] Step 1: Loading processed JSON from local disk: {path.resolve()}")
        raw_text = path.read_text(encoding="utf-8")
        raw_dict = json.loads(raw_text)
        metadata_provenance["loaded_from"] = "local"
        metadata_provenance["local_path"] = str(path.resolve())

    blueprint = CurriculumBlueprint.model_validate(raw_dict)
    logger.info(
        f"[OK] Step 1 Complete: Validated '{blueprint.title}' | Grade: {blueprint.grade} | "
        f"Learning Area: {blueprint.learning_area} | Strands: {len(blueprint.strands)}"
    )
    return blueprint, metadata_provenance


# =============================================================================
# Step 2: Chunking & Semantic Text Formatting
# =============================================================================
def chunk_and_format_semantic_text(
    blueprint: CurriculumBlueprint,
    provenance: Optional[Dict[str, Any]] = None,
) -> List[CurriculumChunkCreate]:
    """
    Step 2: Loops through every Strand and Sub-Strand, combining titles,
    Specific Learning Outcomes (SLOs), Suggested Learning Experiences,
    Key Inquiry Questions (KIQs), Core Competencies, and 4-tier Formative Assessment Rubrics
    into coherent text chunks optimized for dense semantic retrieval.
    """
    logger.info("[*] Step 2: Chunking & semantic text formatting...")
    chunks: List[CurriculumChunkCreate] = []
    prov = provenance or {}

    s3_raw_uri = (
        blueprint.metadata.get("s3_raw_uri")
        or blueprint.metadata.get("s3_raw_key")
        or prov.get("s3_raw_uri")
        or f"s3://{get_settings().S3_BUCKET_NAME}/curriculum-raw/{blueprint.grade.lower().replace(' ', '-')}.pdf"
    )
    s3_processed_uri = (
        blueprint.metadata.get("s3_processed_uri")
        or blueprint.metadata.get("s3_processed_key")
        or prov.get("s3_processed_uri")
        or f"s3://{get_settings().S3_BUCKET_NAME}/curriculum-processed/{blueprint.grade.lower().replace(' ', '-')}.json"
    )

    for strand in blueprint.strands:
        strand_code, clean_strand_title = extract_codes(strand.strand_name)

        for sub in strand.sub_strands:
            sub_code, clean_sub_title = extract_codes(sub.sub_strand_name)

            # Bulleted formats
            slo_bullets = "\n".join([f"  - {slo}" for slo in sub.specific_learning_outcomes]) or "  - (Standard KICD outcomes)"
            exp_bullets = "\n".join([f"  - {exp}" for exp in sub.suggested_learning_experiences]) or "  - (Practical inquiry activities)"
            kiq_text = "\n".join([f"  {idx}. {q}" for idx, q in enumerate(sub.key_inquiry_questions, 1)]) or "  1. How do core concepts apply locally?"
            competencies = ", ".join(sub.core_competencies) or "Critical thinking, Problem solving"
            values = ", ".join(sub.values) or "Responsibility, Integrity"
            pcis = ", ".join(sub.pertinent_contemporary_issues) or "Environmental sustainability"

            # 4-tier KICD Assessment Rubric Formatting
            rubric_section = ""
            rubric_dict = None
            if sub.assessment_rubric:
                rubric_dict = sub.assessment_rubric.model_dump()
                rubric_section = (
                    f"\n\nFORMATIVE ASSESSMENT RUBRIC (4-Tier KICD CBC Matrix):\n"
                    f"  [Level 4 - Exceeding Expectations (EE)]: {sub.assessment_rubric.exceeding}\n"
                    f"  [Level 3 - Meeting Expectations (ME)]:   {sub.assessment_rubric.meeting}\n"
                    f"  [Level 2 - Approaching Expectations (AE)]:{sub.assessment_rubric.approaching}\n"
                    f"  [Level 1 - Below Expectations (BE)]:      {sub.assessment_rubric.below}"
                )

            # Synthesize coherent semantic chunk representation
            formatted_text = (
                f"KICD COMPETENCY-BASED CURRICULUM (CBC) BLUEPRINT\n"
                f"Grade Level: {blueprint.grade} ({blueprint.education_level})\n"
                f"Learning Area / Subject: {blueprint.learning_area}\n"
                f"Strand [{strand_code}]: {clean_strand_title}\n"
                f"Sub-Strand [{sub_code}]: {clean_sub_title}\n"
                f"Suggested Lesson Allocation: {sub.suggested_lessons or 'Standard'} periods\n\n"
                f"KEY INQUIRY QUESTIONS (KIQs):\n{kiq_text}\n\n"
                f"SPECIFIC LEARNING OUTCOMES (SLOs):\n{slo_bullets}\n\n"
                f"SUGGESTED LEARNING EXPERIENCES (Hands-on Activities & Local Materials):\n{exp_bullets}\n\n"
                f"CORE 21ST-CENTURY COMPETENCIES & VALUES:\n"
                f"  Competencies: {competencies}\n"
                f"  Values: {values}\n"
                f"  Pertinent Contemporary Issues (PCIs): {pcis}"
                f"{rubric_section}"
            )

            # Relational & Vector Metadata Payload
            metadata = {
                "blueprint_title": blueprint.title,
                "grade": blueprint.grade,
                "subject": blueprint.learning_area,
                "learning_area": blueprint.learning_area,
                "education_level": blueprint.education_level,
                "strand": strand.strand_name,
                "strand_code": strand_code,
                "strand_name": clean_strand_title,
                "sub_strand": sub.sub_strand_name,
                "sub_strand_code": sub_code,
                "sub_strand_name": clean_sub_title,
                "suggested_lessons": sub.suggested_lessons,
                "specific_learning_outcomes": sub.specific_learning_outcomes,
                "suggested_learning_experiences": sub.suggested_learning_experiences,
                "key_inquiry_questions": sub.key_inquiry_questions,
                "core_competencies": sub.core_competencies,
                "values": sub.values,
                "pertinent_contemporary_issues": sub.pertinent_contemporary_issues,
                "assessment_rubric": rubric_dict,
                "s3_source_pointer_uri": s3_raw_uri,
                "s3_raw_uri": s3_raw_uri,
                "s3_processed_uri": s3_processed_uri,
                "provenance": prov,
            }

            chunks.append(
                CurriculumChunkCreate(
                    chunk_id=str(uuid4()),
                    grade=blueprint.grade,
                    learning_area=blueprint.learning_area,
                    strand=strand.strand_name,
                    sub_strand=sub.sub_strand_name,
                    chunk_type="sub_strand_composite",
                    content=formatted_text.strip(),
                    metadata=metadata,
                )
            )

    logger.info(f"[OK] Step 2 Complete: Synthesized {len(chunks)} rich semantic text chunks.")
    return chunks


# =============================================================================
# Step 3: Generate High-Dimensional Vector Embeddings
# =============================================================================
async def generate_vector_embeddings(
    chunks: List[CurriculumChunkCreate],
    embedding_service: Optional[EmbeddingService] = None,
    model_name: Optional[str] = None,
    task_type: str = "RETRIEVAL_DOCUMENT",
    batch_size: int = 25,
) -> List[CurriculumChunkCreate]:
    """
    Step 3: Passes text chunks through the embedding generator (Gemini embedding model
    with task_type='RETRIEVAL_DOCUMENT' or OpenAI text-embedding-3-small).
    Converts raw text chunks into 1536-dimensional float arrays.
    """
    service = embedding_service or EmbeddingService(dimension=1536)
    logger.info(
        f"[*] Step 3: Generating high-dimensional vector embeddings for {len(chunks)} chunks "
        f"(model={model_name or 'auto'}, task_type={task_type}, dims=1536)..."
    )

    contents = [c.content for c in chunks]
    all_embeddings: List[List[float]] = []

    # Batch embedding generation to adhere to provider rate limits
    for i in range(0, len(contents), batch_size):
        batch = contents[i : i + batch_size]
        logger.info(f"     Embedding batch [{i + 1}-{min(i + batch_size, len(contents))}/{len(contents)}]...")
        batch_vecs = await service.generate_embeddings(
            batch,
            task_type=task_type,
            model_name=model_name,
        )
        all_embeddings.extend(batch_vecs)

    for chunk, emb in zip(chunks, all_embeddings):
        chunk.embedding = emb

    logger.info(f"[OK] Step 3 Complete: Successfully generated {len(all_embeddings)} vector embeddings.")
    return chunks


# =============================================================================
# Step 4: Batch Upsert into PostgreSQL (pgvector)
# =============================================================================
async def batch_upsert_into_pgvector(
    chunks: List[CurriculumChunkCreate],
    session_factory=None,
    active_session=None,
    dry_run: bool = False,
) -> int:
    """
    Step 4: Inserts relational metadata (Grade, Subject, Strand Code, Sub-Strand Code),
    raw text chunks, vector embeddings (VECTOR(1536)), and S3 source pointer URIs
    into the PostgreSQL database tables via pgvector.
    """
    if dry_run:
        logger.info(f"[DRY-RUN] Step 4: Skipped database persistence for {len(chunks)} chunks.")
        return len(chunks)

    if active_session:
        repo = CurriculumChunkRepository(active_session)
        upserted_count = await repo.bulk_upsert(chunks)
        total_chunks = await repo.count_all()
        logger.info(
            f"[OK] Step 4 Complete: Upserted {upserted_count} chunks. "
            f"Total curriculum chunks in database: {total_chunks}"
        )
        return upserted_count

    factory = session_factory or async_session_factory
    logger.info(f"[*] Step 4: Batch upserting {len(chunks)} chunks into PostgreSQL 'curriculum_chunks'...")

    try:
        async with factory() as session:
            repo = CurriculumChunkRepository(session)
            upserted_count = await repo.bulk_upsert(chunks)
            total_chunks = await repo.count_all()

        logger.info(
            f"[OK] Step 4 Complete: Upserted {upserted_count} chunks. "
            f"Total curriculum chunks in database: {total_chunks}"
        )
        return upserted_count
    except Exception as exc:
        logger.error(
            f"[!] PostgreSQL Connection Failed: {exc}\n"
            f"    Please ensure PostgreSQL with pgvector is running and POSTGRES_URL in .env is correct.\n"
            f"    (Tip: Use --dry-run flag to test parsing and vector embedding generation without DB write.)"
        )
        raise exc


# =============================================================================
# Master Orchestration Function
# =============================================================================
async def seed_database_from_json(
    source_path_or_key: Union[str, Path],
    embedding_model: Optional[str] = None,
    task_type: str = "RETRIEVAL_DOCUMENT",
    batch_size: int = 25,
    dry_run: bool = False,
    active_session=None,
) -> Dict[str, Any]:
    """
    Executes the complete 4-step database seeding and vector embedding phase.
    """
    start_time = time.time()
    logger.info("=" * 75)
    logger.info("CBC CURRICULUM DATABASE SEEDING & VECTOR EMBEDDING (seed_db.py)")
    logger.info("=" * 75)

    # 1. Read JSON
    blueprint, provenance = await read_processed_json(source_path_or_key)

    # 2. Chunking & Semantic Text Formatting
    chunks = chunk_and_format_semantic_text(blueprint, provenance)

    # 3. High-Dimensional Vector Embeddings
    chunks = await generate_vector_embeddings(
        chunks=chunks,
        model_name=embedding_model,
        task_type=task_type,
        batch_size=batch_size,
    )

    # 4. Batch Upsert into PostgreSQL (pgvector)
    stored_count = await batch_upsert_into_pgvector(
        chunks,
        active_session=active_session,
        dry_run=dry_run,
    )

    elapsed = time.time() - start_time
    summary = {
        "title": blueprint.title,
        "grade": blueprint.grade,
        "learning_area": blueprint.learning_area,
        "chunks_generated": len(chunks),
        "chunks_stored": stored_count,
        "vector_dimensions": len(chunks[0].embedding) if chunks and chunks[0].embedding else 0,
        "s3_source_pointer_uri": chunks[0].metadata.get("s3_source_pointer_uri") if chunks else None,
        "elapsed_seconds": round(elapsed, 2),
        "dry_run": dry_run,
    }

    logger.info("=" * 75)
    logger.info(f"[SUCCESS] Seeding Complete in {elapsed:.2f}s!")
    logger.info(f"   Grade / Subject: {summary['grade']} | {summary['learning_area']}")
    logger.info(f"   Chunks Seeded:   {summary['chunks_stored']} (VECTOR({summary['vector_dimensions']}))")
    logger.info(f"   S3 Pointer:      {summary['s3_source_pointer_uri']}")
    logger.info("=" * 75)

    return summary


def main():
    parser = argparse.ArgumentParser(
        description="Database Seeding and Vector Embedding (ingestion/seed_db.py)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    default_sample = str(
        Path(__file__).resolve().parent / "samples" / "cbc_grade_5_agriculture_nutrition.json"
    )

    parser.add_argument(
        "--json-file",
        "-f",
        default=default_sample,
        help="Path to structured KICD JSON file (default: sample Grade 5 Agriculture)",
    )
    parser.add_argument(
        "--s3-key",
        "-k",
        help="S3 key of processed JSON file (e.g. curriculum-processed/upper-primary/file.json)",
    )
    parser.add_argument(
        "--model",
        "-m",
        default="gemini-embedding-001",
        help="Embedding model (e.g. gemini-embedding-001, text-embedding-004, text-embedding-3-small)",
    )
    parser.add_argument(
        "--task-type",
        "-t",
        default="RETRIEVAL_DOCUMENT",
        help="Task type for Gemini embeddings (default: RETRIEVAL_DOCUMENT)",
    )
    parser.add_argument(
        "--batch-size",
        "-b",
        type=int,
        default=25,
        help="Batch size for generating embeddings",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate JSON, format chunks, and embed without writing to database",
    )

    args = parser.parse_args()
    target_source = args.s3_key if args.s3_key else args.json_file

    asyncio.run(
        seed_database_from_json(
            source_path_or_key=target_source,
            embedding_model=args.model,
            task_type=args.task_type,
            batch_size=args.batch_size,
            dry_run=args.dry_run,
        )
    )


if __name__ == "__main__":
    main()
