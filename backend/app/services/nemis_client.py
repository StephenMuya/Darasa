import logging
from typing import Any, Dict

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class NEMISClient:
    """
    Kenya NEMIS (National Education Management Information System) Client
    Single responsibility: interface with government educational portal APIs
    for teacher registration and student UPI verification with mock fallback.
    """

    def __init__(self):
        self._base_url = settings.NEMIS_BASE_URL
        self._client_id = settings.NEMIS_CLIENT_ID
        self._client_secret = settings.NEMIS_CLIENT_SECRET

    @property
    def is_configured(self) -> bool:
        """Check whether valid non-placeholder NEMIS credentials are provided."""
        return bool(
            self._client_id
            and not self._client_id.startswith("PLACEHOLDER")
            and not self._client_secret.startswith("PLACEHOLDER")
        )

    async def verify_upi(self, upi: str) -> Dict[str, Any]:
        """
        Verify a learner's Unique Personal Identifier (UPI) through NEMIS.
        Returns verified data or developmental mock record.
        """
        if not self.is_configured:
            logger.info(
                "NEMIS client running in PLACEHOLDER mode. Returning simulated verified learner."
            )
            return {
                "verified": True,
                "mode": "simulated_sandbox",
                "upi": upi,
                "learner_name": "Amani Mwangi",
                "grade": "Grade 6",
                "school_code": "0100234",
                "sub_county": "Westlands",
            }

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(
                    f"{self._base_url}/api/v1/students/{upi}",
                    headers={
                        "X-Client-ID": self._client_id,
                        "X-Client-Secret": self._client_secret,
                    },
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as exc:
            logger.warning("NEMIS API verification failed: %s", exc)

        return {"verified": False, "upi": upi, "error": "NEMIS service unreachable"}
