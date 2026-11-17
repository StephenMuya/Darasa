"""
Vector Embedding Service
Single responsibility: generate dense float embeddings for curriculum text chunks
using Google Gemini (gemini-embedding-001 / text-embedding-004), OpenAI, or deterministic local vectors.
"""
import asyncio
import hashlib
from typing import List, Optional

from app.core.config import get_settings


class EmbeddingService:
    """
    Asynchronous Vector Embedding Generation Service.
    Supports Google Gemini, OpenAI, and deterministic offline mock fallbacks.
    """

    def __init__(self, dimension: int = 1536):
        self.dimension = dimension
        self._settings = get_settings()

    async def generate_embedding(
        self,
        text: str,
        task_type: str = "RETRIEVAL_DOCUMENT",
        model_name: Optional[str] = None,
    ) -> List[float]:
        """Generate a single vector embedding for a text chunk."""
        results = await self.generate_embeddings([text], task_type=task_type, model_name=model_name)
        return results[0]

    async def generate_query_embedding(
        self,
        query: str,
        model_name: Optional[str] = None,
    ) -> List[float]:
        """
        Generate a dense query embedding using RETRIEVAL_QUERY task type.
        Optimized for asymmetric semantic search against indexed RETRIEVAL_DOCUMENT chunks.
        """
        return await self.generate_embedding(
            text=query,
            task_type="RETRIEVAL_QUERY",
            model_name=model_name,
        )

    async def generate_embeddings(
        self,
        texts: List[str],
        task_type: str = "RETRIEVAL_DOCUMENT",
        model_name: Optional[str] = None,
    ) -> List[List[float]]:
        """Batch generate embeddings for multiple text chunks."""
        if not texts:
            return []

        if self._settings.has_valid_openai_key:
            return await self._generate_openai_embeddings(texts, model_name=model_name)
        elif self._settings.has_valid_gemini_key:
            return await self._generate_gemini_embeddings(texts, task_type=task_type, model_name=model_name)
        else:
            return [self._generate_deterministic_vector(t) for t in texts]

    async def _generate_openai_embeddings(
        self,
        texts: List[str],
        model_name: Optional[str] = None,
    ) -> List[List[float]]:
        """Generate embeddings using OpenAI text-embedding-3-small."""
        try:
            from openai import OpenAI

            client = OpenAI(api_key=self._settings.OPENAI_API_KEY)
            chosen_model = model_name or self._settings.EMBEDDING_MODEL or "text-embedding-3-small"

            def _call_api():
                resp = client.embeddings.create(
                    model=chosen_model,
                    input=texts,
                )
                return [d.embedding for d in resp.data]

            return await asyncio.to_thread(_call_api)
        except Exception:
            return [self._generate_deterministic_vector(t) for t in texts]

    async def _generate_gemini_embeddings(
        self,
        texts: List[str],
        task_type: str = "RETRIEVAL_DOCUMENT",
        model_name: Optional[str] = None,
    ) -> List[List[float]]:
        """Generate embeddings using Google GenAI (text-embedding-004 or gemini-embedding-001)."""
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=self._settings.GOOGLE_GEMINI_API_KEY)
            chosen_model = model_name or self._settings.EMBEDDING_MODEL or "text-embedding-004"
            if chosen_model in ("gemini-embedding-001", "models/embedding-001"):
                chosen_model = "text-embedding-004"

            def _call_api():
                embeddings = []
                for t in texts:
                    try:
                        config = types.EmbedContentConfig(
                            task_type=task_type,
                            output_dimensionality=self.dimension,
                        )
                        res = client.models.embed_content(
                            model=chosen_model,
                            contents=t,
                            config=config,
                        )
                    except Exception:
                        res = client.models.embed_content(
                            model=chosen_model,
                            contents=t,
                        )
                    vec = res.embedding.values
                    if len(vec) < self.dimension:
                        vec = vec + [0.0] * (self.dimension - len(vec))
                    embeddings.append(vec[: self.dimension])
                return embeddings

            return await asyncio.to_thread(_call_api)
        except Exception:
            return [self._generate_deterministic_vector(t) for t in texts]

    def _generate_deterministic_vector(self, text: str) -> List[float]:
        """
        Creates a deterministic pseudo-random unit vector based on SHA-256 hash.
        Guarantees that identical text receives identical embeddings in test runs.
        """
        h = hashlib.sha256(text.encode("utf-8")).digest()
        vector = []
        for i in range(self.dimension):
            val = (h[i % len(h)] - 128) / 128.0
            vector.append(round(val, 6))

        norm = sum(x * x for x in vector) ** 0.5
        if norm > 0:
            vector = [round(x / norm, 6) for x in vector]
        return vector
