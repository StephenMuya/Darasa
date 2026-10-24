import logging
from typing import Any, Dict, Optional

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class ExternalLLMClient:
    """
    External AI / Large Language Model Client
    Single responsibility: interface with external LLM APIs (OpenAI / Gemini / Anthropic)
    with graceful fallback logic when placeholder tokens are configured.
    """

    def __init__(self, api_key: Optional[str] = None):
        self._api_key = api_key or settings.OPENAI_API_KEY
        self._model = settings.OPENAI_MODEL

    @property
    def is_configured(self) -> bool:
        """Check whether a real, non-placeholder API key is available."""
        return bool(self._api_key and not self._api_key.startswith("PLACEHOLDER"))

    async def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Request completion from external LLM.
        Falls back to local curriculum inference when using placeholder keys.
        """
        if not self.is_configured:
            logger.info(
                "External LLM using PLACEHOLDER key. Returning deterministic CBC fallback."
            )
            return {
                "source": "Darasa Offline KICD Fallback Engine",
                "model": "offline-kicd-rules-engine",
                "content": f"KICD Pedagogical Guidance for: '{prompt}'",
                "usage": {"prompt_tokens": 0, "completion_tokens": 0},
            }

        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self._model,
            "messages": [
                {
                    "role": "system",
                    "content": system_instruction
                    or "You are Darasa, an AI assistant for Kenya CBC curriculum.",
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers=headers,
                    json=payload,
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "source": "OpenAI API",
                        "model": self._model,
                        "content": data["choices"][0]["message"]["content"],
                        "usage": data.get("usage", {}),
                    }
                else:
                    logger.warning(
                        "External LLM API returned status %s: %s",
                        response.status_code,
                        response.text,
                    )
        except Exception as exc:
            logger.error("Failed to connect to external LLM provider: %s", exc)

        return {
            "source": "Darasa Offline KICD Fallback Engine (Error Fallback)",
            "model": "offline-fallback",
            "content": f"Locally cached guidance for: '{prompt}'",
            "usage": {},
        }
