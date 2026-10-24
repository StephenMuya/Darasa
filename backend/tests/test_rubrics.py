import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_generate_rubric_success(client: AsyncClient):
    """POST /api/v1/rubrics/generate should return a 4-tier formative assessment rubric."""
    payload = {
        "grade": "Grade 7",
        "learning_area": "Integrated Science",
        "strand": "Separation of Mixtures",
        "task_description": "Learners separate salt and sand mixture using dissolution and filtration.",
    }
    response = await client.post("/api/v1/rubrics/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["grade"] == "Grade 7"
    assert data["learning_area"] == "Integrated Science"
    assert "rubric" in data

    rubric = data["rubric"]
    assert rubric["strand"] == "Separation of Mixtures"
    assert "Level 4" in rubric["ee"]
    assert "Level 3" in rubric["me"]
    assert "Level 2" in rubric["ae"]
    assert "Level 1" in rubric["be"]


@pytest.mark.asyncio
async def test_generate_rubric_missing_strand_validation(client: AsyncClient):
    """POST /api/v1/rubrics/generate without required strand should fail with 422."""
    payload = {
        "grade": "Grade 7",
        "learning_area": "Integrated Science",
        # missing strand
    }
    response = await client.post("/api/v1/rubrics/generate", json=payload)
    assert response.status_code == 422
