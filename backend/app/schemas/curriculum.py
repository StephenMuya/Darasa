"""
KICD CBC Curriculum Blueprint Schemas
Single responsibility: define exact Pydantic v2 data models for KICD Competency-Based
Curriculum blueprints, landscape table extractions, and hierarchical vector chunks.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class AssessmentCriterion(BaseModel):
    """KICD 4-Tier Formative Assessment Rubric."""

    exceeding: str = Field(
        ...,
        description="Level 4 (Exceeding Expectations - EE): Demonstrates mastery, autonomy, and innovation.",
    )
    meeting: str = Field(
        ...,
        description="Level 3 (Meeting Expectations - ME): Proficiently fulfills core competency criteria.",
    )
    approaching: str = Field(
        ...,
        description="Level 2 (Approaching Expectations - AE): Partially achieves criteria; needs prompting.",
    )
    below: str = Field(
        ...,
        description="Level 1 (Below Expectations - BE): Struggles with criteria; requires continuous intervention.",
    )


class SubStrand(BaseModel):
    """Individual Sub-Strand table row in KICD curriculum blueprints."""

    sub_strand_name: str = Field(
        ..., description="Sub-strand title (e.g. '1.1 Soil Conservation')"
    )
    suggested_lessons: Optional[int] = Field(
        default=None, description="Number of allocated classroom periods"
    )
    specific_learning_outcomes: List[str] = Field(
        default_factory=list,
        description="Observable competencies learners must achieve by end of sub-strand",
    )
    suggested_learning_experiences: List[str] = Field(
        default_factory=list,
        description="Practical, hands-on learner activities using local and zero-cost materials",
    )
    key_inquiry_questions: List[str] = Field(
        default_factory=list,
        description="Provocative questions guiding exploratory learner inquiry",
    )
    core_competencies: List[str] = Field(
        default_factory=list,
        description="Target CBC 21st century competencies (e.g. Critical Thinking, Digital Literacy)",
    )
    values: List[str] = Field(
        default_factory=list,
        description="National and civic values nurtured (e.g. Respect, Unity, Integrity)",
    )
    pertinent_contemporary_issues: List[str] = Field(
        default_factory=list,
        description="PCIs integrated (e.g. Environmental Awareness, Disaster Risk Reduction)",
    )
    assessment_rubric: Optional[AssessmentCriterion] = Field(
        default=None,
        description="Formative evaluation matrix for this sub-strand",
    )


class Strand(BaseModel):
    """Major thematic domain containing one or more sub-strands."""

    strand_name: str = Field(
        ..., description="High-level strand title (e.g. '1.0 CONSERVATION OF RESOURCES')"
    )
    sub_strands: List[SubStrand] = Field(
        default_factory=list, description="Sub-strands under this strand"
    )


class CurriculumBlueprint(BaseModel):
    """Complete structured KICD Curriculum Design document."""

    title: str = Field(..., description="Official blueprint document title")
    grade: str = Field(..., description="Target grade level (e.g. 'Grade 5', 'Grade 6')")
    learning_area: str = Field(
        ..., description="Subject domain (e.g. 'Agriculture and Nutrition', 'Social Studies')"
    )
    education_level: str = Field(
        default="Upper Primary",
        description="CBC level: Lower Primary, Upper Primary, Junior School, Senior School",
    )
    kicd_edition_year: Optional[int] = Field(
        default=2024, description="KICD curriculum syllabus publication year"
    )
    strands: List[Strand] = Field(
        default_factory=list, description="All strands extracted from the blueprint"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Ingestion provenance, S3 keys, model version, and timestamps",
    )

    def synthesize_search_chunks(self) -> List["CurriculumChunkCreate"]:
        """
        Transforms the hierarchical blueprint into searchable, contextualized text chunks
        optimized for dense vector embedding and semantic retrieval.
        """
        chunks: List[CurriculumChunkCreate] = []

        for strand in self.strands:
            for sub in strand.sub_strands:
                # 1. Comprehensive Sub-Strand Search Chunk
                slo_text = "\n".join([f"  - {slo}" for slo in sub.specific_learning_outcomes])
                exp_text = "\n".join([f"  - {exp}" for exp in sub.suggested_learning_experiences])
                inq_text = ", ".join(sub.key_inquiry_questions) or "N/A"
                comp_text = ", ".join(sub.core_competencies) or "N/A"

                rubric_summary = ""
                if sub.assessment_rubric:
                    rubric_summary = (
                        f"\nAssessment Criteria:\n"
                        f"  [EE Level 4]: {sub.assessment_rubric.exceeding}\n"
                        f"  [ME Level 3]: {sub.assessment_rubric.meeting}\n"
                        f"  [AE Level 2]: {sub.assessment_rubric.approaching}\n"
                        f"  [BE Level 1]: {sub.assessment_rubric.below}"
                    )

                chunk_content = (
                    f"KICD CBC CURRICULUM BLUEPRINT\n"
                    f"Grade Level: {self.grade} ({self.education_level})\n"
                    f"Learning Area: {self.learning_area}\n"
                    f"Strand: {strand.strand_name}\n"
                    f"Sub-Strand: {sub.sub_strand_name}\n"
                    f"Suggested Periods: {sub.suggested_lessons or 'Standard'}\n"
                    f"Key Inquiry Questions: {inq_text}\n"
                    f"Core Competencies: {comp_text}\n\n"
                    f"Specific Learning Outcomes:\n{slo_text}\n\n"
                    f"Suggested Learning Experiences (Hands-on Activities & Local Materials):\n{exp_text}"
                    f"{rubric_summary}"
                )

                chunk_metadata = {
                    "blueprint_title": self.title,
                    "grade": self.grade,
                    "learning_area": self.learning_area,
                    "education_level": self.education_level,
                    "strand": strand.strand_name,
                    "sub_strand": sub.sub_strand_name,
                    "specific_learning_outcomes": sub.specific_learning_outcomes,
                    "suggested_learning_experiences": sub.suggested_learning_experiences,
                    "key_inquiry_questions": sub.key_inquiry_questions,
                    "core_competencies": sub.core_competencies,
                    "values": sub.values,
                    "pertinent_contemporary_issues": sub.pertinent_contemporary_issues,
                    "assessment_rubric": sub.assessment_rubric.model_dump()
                    if sub.assessment_rubric
                    else None,
                    "s3_raw_key": self.metadata.get("s3_raw_key"),
                    "s3_processed_key": self.metadata.get("s3_processed_key"),
                }

                chunks.append(
                    CurriculumChunkCreate(
                        chunk_id=str(uuid4()),
                        grade=self.grade,
                        learning_area=self.learning_area,
                        strand=strand.strand_name,
                        sub_strand=sub.sub_strand_name,
                        chunk_type="sub_strand_composite",
                        content=chunk_content.strip(),
                        metadata=chunk_metadata,
                    )
                )

        return chunks


class CurriculumChunkCreate(BaseModel):
    """Payload representing a single vector-searchable curriculum chunk."""

    chunk_id: str = Field(default_factory=lambda: str(uuid4()))
    grade: str
    learning_area: str
    strand: str
    sub_strand: str
    chunk_type: str = "sub_strand_composite"
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    embedding: Optional[List[float]] = None
# =============================================================================
# Semantic Retrieval & RAG Schemas
# =============================================================================
class CurriculumSearchRequest(BaseModel):
    """Payload for natural language semantic search across curriculum blueprints."""

    query: str = Field(..., min_length=2, description="Natural language search prompt or query")
    grade: Optional[str] = Field(None, description="Optional grade filter (e.g. 'Grade 5')")
    learning_area: Optional[str] = Field(None, description="Optional subject domain (e.g. 'Agriculture')")
    strand: Optional[str] = Field(None, description="Optional strand keyword or code")
    sub_strand: Optional[str] = Field(None, description="Optional sub-strand keyword or code")
    limit: int = Field(default=5, ge=1, le=20, description="Maximum number of chunks to return")
    min_similarity: float = Field(default=0.0, ge=0.0, le=1.0, description="Minimum cosine similarity cutoff")


class CurriculumSearchResultItem(BaseModel):
    """Individual ranked result from vector similarity retrieval."""

    chunk_id: str
    grade: str
    learning_area: str
    strand: str
    sub_strand: str
    content: str
    similarity_score: float = Field(..., description="Cosine similarity score [0.0 to 1.0]")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class CurriculumSearchResponse(BaseModel):
    """Structured response containing ranked curriculum nodes."""

    query: str
    total_matches: int
    results: List[CurriculumSearchResultItem]


class RAGContextRequest(BaseModel):
    """Request payload to retrieve and format KICD context for LLMs."""

    query: str = Field(..., min_length=2, description="Teacher prompt, inquiry, or lesson topic")
    grade: Optional[str] = Field(None, description="Target grade level (e.g. 'Grade 5')")
    learning_area: Optional[str] = Field(None, description="Subject area (e.g. 'Agriculture and Nutrition')")
    top_k: int = Field(default=3, ge=1, le=10, description="Number of top curriculum chunks to inject")
    include_rubrics: bool = Field(default=True, description="Include 4-tier assessment criteria")
    include_experiences: bool = Field(default=True, description="Include practical hands-on activities")


class RAGContextCitation(BaseModel):
    """Provenance citation linking generated content to official KICD design blueprints."""

    source_index: int
    chunk_id: str
    grade: str
    learning_area: str
    strand: str
    sub_strand: str
    similarity_score: float
    s3_source_pointer_uri: Optional[str] = None


class RAGContextResponse(BaseModel):
    """Authoritative KICD context block formatted for direct LLM system/user prompts."""

    query: str
    grade: Optional[str] = None
    learning_area: Optional[str] = None
    retrieved_count: int
    rag_context: str = Field(..., description="Markdown-formatted prompt context for LLM injection")
    citations: List[RAGContextCitation]
