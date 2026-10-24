from typing import Optional

from pydantic import BaseModel, Field


class RubricTier(BaseModel):
    """
    Official Kenya CBC 4-Tier Formative Assessment Rubric
    EE: Exceeding Expectations (Level 4)
    ME: Meeting Expectations (Level 3)
    AE: Approaching Expectations (Level 2)
    BE: Below Expectations (Level 1)
    """

    strand: str = Field(..., example="Crop Production  -  Water Conservation")
    sub_strand: Optional[str] = Field(default=None, example="Soil Moisture Retention")
    ee: str = Field(..., description="Exceeding Expectations (Level 4)")
    me: str = Field(..., description="Meeting Expectations (Level 3)")
    ae: str = Field(..., description="Approaching Expectations (Level 2)")
    be: str = Field(..., description="Below Expectations (Level 1)")


class RubricGenerateRequest(BaseModel):
    """Request payload to generate a formative assessment rubric."""

    grade: str = Field(default="Grade 6", example="Grade 6")
    learning_area: str = Field(
        default="Agriculture & Nutrition", example="Agriculture & Nutrition"
    )
    strand: str = Field(..., example="Water Conservation & Drip Irrigation")
    task_description: Optional[str] = Field(
        default=None,
        example="Learners design an improvised bottle drip irrigation system using local materials.",
    )


class RubricGenerateResponse(BaseModel):
    """Response containing the generated rubric and pedagogical guidance."""

    grade: str
    learning_area: str
    rubric: RubricTier
    source_curriculum: str = "KICD Competency-Based Curriculum Framework"
    assessment_type: str = "Formative Authentic Task Assessment"
