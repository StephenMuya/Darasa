"""
KICD CBC Lesson Plan & Formative Assessment Schemas
Single responsibility: define exact Pydantic v2 data models for Kenyan Competency-Based
Curriculum lesson designs, learner inquiry steps, and 4-tier formative evaluation matrices.
"""
from datetime import date
from typing import Any, Dict, List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class LessonPlanStep(BaseModel):
    """Individual pedagogical phase within a 40-minute or 80-minute CBC period."""

    step_name: str = Field(
        ...,
        description="Phase name (e.g. 'Introduction', 'Step 1: Exploration & Inquiry', 'Step 2: Hands-on Practical', 'Conclusion')",
    )
    duration_minutes: int = Field(..., ge=1, le=60, description="Duration in minutes")
    teacher_activity: str = Field(
        ...,
        description="Teacher facilitating actions, guiding questions, and safety supervision",
    )
    learner_activity: str = Field(
        ...,
        description="Active, learner-centered collaborative tasks, experimentation, or documentation",
    )
    competencies_and_values: List[str] = Field(
        default_factory=list,
        description="Specific 21st-century CBC competencies and values nurtured during this step",
    )


class LessonPlanAssessmentRubric(BaseModel):
    """4-Tier Formative Assessment Rubric aligned with KICD evaluation standards."""

    criterion: str = Field(
        ...,
        description="Specific observable competency criterion (e.g. 'Constructing organic mulch over seedbeds')",
    )
    exceeding: str = Field(
        ...,
        description="Level 4 (Exceeding Expectations - EE): Flawless, independent, and innovative execution; guides peers",
    )
    meeting: str = Field(
        ...,
        description="Level 3 (Meeting Expectations - ME): Accurately fulfills core performance criteria as instructed",
    )
    approaching: str = Field(
        ...,
        description="Level 2 (Approaching Expectations - AE): Partially achieves criteria; needs occasional teacher prompts",
    )
    below: str = Field(
        ...,
        description="Level 1 (Below Expectations - BE): Struggles with task; requires continuous intervention",
    )


class LessonPlanRequest(BaseModel):
    """Input payload to trigger RAG-assisted CBC lesson plan generation."""

    topic_or_prompt: str = Field(
        ...,
        min_length=3,
        description="Lesson topic or focus (e.g. 'Constructing organic mulch to conserve soil moisture')",
    )
    grade: str = Field(
        default="Grade 5",
        description="Target CBC grade level (e.g. 'Grade 5', 'Grade 6')",
    )
    learning_area: str = Field(
        default="Agriculture and Nutrition",
        description="Subject / Learning area domain",
    )
    duration_minutes: int = Field(
        default=40,
        ge=20,
        le=120,
        description="Allocated period duration (typically 40 mins single or 80 mins double)",
    )
    class_size: Optional[int] = Field(
        default=40,
        ge=1,
        le=120,
        description="Number of learners in class",
    )
    sub_strand_hint: Optional[str] = Field(
        None,
        description="Optional sub-strand title or code to force strict alignment (e.g. '1.1 Soil Conservation')",
    )
    save_to_s3: bool = Field(
        default=False,
        description="Whether to archive the generated lesson plan JSON & Markdown to AWS S3",
    )


class LessonPlanResponse(BaseModel):
    """Complete structured KICD Competency-Based Curriculum Lesson Plan document."""

    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str = Field(..., description="Official KICD CBC Lesson Plan Title")
    lesson_date: str = Field(default_factory=lambda: str(date.today()))
    grade: str
    learning_area: str
    strand: str
    sub_strand: str
    duration_minutes: int
    class_size: int
    specific_learning_outcomes: List[str] = Field(
        ...,
        description="Measurable observable competencies (Knowledge, Skills, Values)",
    )
    key_inquiry_questions: List[str] = Field(
        default_factory=list,
        description="Provocative questions guiding exploratory learner inquiry",
    )
    core_competencies: List[str] = Field(default_factory=list)
    values: List[str] = Field(default_factory=list)
    pertinent_contemporary_issues: List[str] = Field(default_factory=list)
    learning_resources: List[str] = Field(
        ...,
        description="Zero-cost, locally available Kenyan materials and learning aids",
    )
    lesson_development: List[LessonPlanStep] = Field(
        ...,
        description="Phased lesson progression (Introduction, Steps 1-3, Conclusion)",
    )
    assessment_rubric: LessonPlanAssessmentRubric
    extended_learning_activity: str = Field(
        ...,
        description="Home or community practical follow-up activity",
    )
    teacher_reflection: str = Field(
        default="The lesson was successfully executed. Most learners met expectations in collaborative group activities.",
        description="Post-lesson teacher self-evaluation notes",
    )
    raw_markdown: str = Field(
        ...,
        description="Formatted, ready-to-print or export KICD lesson plan markdown document",
    )
    s3_uri: Optional[str] = Field(
        None,
        description="S3 Data Lake URI if saved (s3://darasa-curriculum-blueprints-store/...)",
    )
    citations: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Exact KICD curriculum blueprint source citations used to ground the plan",
    )
