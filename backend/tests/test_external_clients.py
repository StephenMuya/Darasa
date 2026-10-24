import pytest

from app.services.external_llm_client import ExternalLLMClient
from app.services.nemis_client import NEMISClient


@pytest.mark.asyncio
async def test_external_llm_client_placeholder_fallback():
    """ExternalLLMClient with placeholder token should return local KICD guidance safely."""
    client = ExternalLLMClient(api_key="PLACEHOLDER_OPENAI_API_KEY")
    assert client.is_configured is False

    response = await client.generate_completion(
        prompt="Explain soil moisture retention"
    )
    assert "source" in response
    assert "Fallback" in response["source"]
    assert "content" in response
    assert len(response["content"]) > 0


@pytest.mark.asyncio
async def test_nemis_client_placeholder_sandbox():
    """NEMISClient with placeholder token should return simulated verified learner."""
    client = NEMISClient()
    # In default config, NEMIS_CLIENT_ID starts with PLACEHOLDER
    assert client.is_configured is False

    result = await client.verify_upi("UPI-987654321")
    assert result["verified"] is True
    assert result["mode"] == "simulated_sandbox"
    assert result["upi"] == "UPI-987654321"
    assert "learner_name" in result
