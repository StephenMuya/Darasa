"""
RAG-Grounded Chat Response Service
Single responsibility: retrieve authoritative KICD curriculum chunks for a given query,
assemble a structured LLM prompt, generate a grounded response via Google Gemini (or
offline fallback), and return a structured result dict ready for ChatService to persist.
"""
import asyncio
import logging
from typing import Any, Dict, List, Optional

from app.core.config import get_settings
from app.schemas.curriculum import RAGContextRequest, RAGContextResponse
from app.services.curriculum_retrieval_service import CurriculumRetrievalService

logger = logging.getLogger("rag_chat_service")
settings = get_settings()

# ---------------------------------------------------------------------------
# System prompt — strict KICD grounding instruction
# ---------------------------------------------------------------------------
_SYSTEM_PROMPT = """You are Darasa, an authoritative AI assistant for Kenya's
Competency-Based Curriculum (CBC) as defined by the Kenya Institute of Curriculum
Development (KICD). You help teachers, school administrators, and curriculum
specialists with lesson planning, formative assessment, learning materials, and
pedagogical guidance.

STRICT RULES:
1. Base every answer EXCLUSIVELY on the KICD curriculum context provided below.
2. Never invent strands, sub-strands, SLOs, or rubric descriptors not present in
   the context.
3. Always cite the Grade, Learning Area, Strand, and Sub-Strand from the context.
4. Keep responses clear, practical, and classroom-actionable.
5. If the context does not cover the query, clearly say so and suggest the teacher
   consult the official KICD Curriculum Design document for that grade/area.
6. Use simple English suitable for Kenyan primary school teachers.
"""

_NO_CONTEXT_RESPONSE = (
    "I searched the KICD curriculum blueprints for your query, but no relevant "
    "curriculum content was found in the current database. This may be because "
    "only Grade 5 Agriculture & Nutrition is currently seeded.\n\n"
    "Please try a question about:\n"
    "- Grade 5 Agriculture & Nutrition strands\n"
    "- Soil conservation or crop production activities\n"
    "- Irrigation and water conservation\n"
    "- Nutrition and balanced diet for Grade 5\n\n"
    "More curriculum data will be available as additional grades are ingested."
)


class RagChatService:
    """
    RAG-Grounded Chat Response Generator.
    Retrieves KICD chunks → builds an authoritative prompt → calls Gemini LLM
    (or returns a grounded offline answer when no API key is available).
    """

    def __init__(self, retrieval_service: CurriculumRetrievalService):
        self._retrieval = retrieval_service

    async def answer(
        self,
        query: str,
        grade: Optional[str] = None,
        learning_area: Optional[str] = None,
        top_k: int = 4,
    ) -> Dict[str, Any]:
        """
        Main entry point called by ChatService.process_inquiry().

        Returns a dict with keys:
            text         (str)  — grounded assistant response
            follow_ups   (list) — 3 suggested follow-up questions derived from retrieved content
            citations    (list) — source chunk metadata dicts
            retrieved_count (int)
        """
        # 1. Retrieve relevant KICD chunks
        rag_req = RAGContextRequest(
            query=query,
            grade=grade,
            learning_area=learning_area,
            top_k=top_k,
            include_rubrics=True,
            include_experiences=True,
        )
        rag_resp: RAGContextResponse = await self._retrieval.build_rag_context(rag_req)

        # 2. No curriculum context found — return honest fallback
        if rag_resp.retrieved_count == 0:
            logger.warning("[RAG] No chunks retrieved for query: '%s'", query)
            return {
                "text": _NO_CONTEXT_RESPONSE,
                "follow_ups": [
                    "What are the strands in Grade 5 Agriculture & Nutrition?",
                    "How do I teach soil conservation with local materials?",
                    "What is the 4-tier rubric for Grade 5 crop production?",
                ],
                "citations": [],
                "retrieved_count": 0,
            }

        # 3. Build grounded LLM prompt
        full_prompt = (
            f"{rag_resp.rag_context}\n\n"
            f"---\n\n"
            f"TEACHER'S QUESTION:\n{query}\n\n"
            f"Provide a clear, curriculum-grounded answer based strictly on the "
            f"KICD sources above. Cite the Strand and Sub-Strand in your response."
        )

        # 4. Generate response (Gemini → offline fallback)
        response_text = await self._call_gemini(full_prompt)

        # 5. Derive follow-up questions from retrieved strand/sub-strand names
        follow_ups = self._derive_follow_ups(rag_resp)

        citations = [c.model_dump() for c in rag_resp.citations]
        logger.info("[RAG] Chat answered with %d citations.", rag_resp.retrieved_count)

        return {
            "text": response_text,
            "follow_ups": follow_ups,
            "citations": citations,
            "retrieved_count": rag_resp.retrieved_count,
        }

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _call_gemini(self, prompt: str) -> str:
        """
        Calls Google Gemini for a grounded chat completion.
        Falls back to returning the raw RAG context summary if no key is available
        or if the API call fails.
        """
        if not settings.has_valid_gemini_key:
            logger.info("[RAG] No Gemini key — returning offline grounded context.")
            return self._offline_fallback(prompt)

        try:
            from google import genai

            client = genai.Client(api_key=settings.GOOGLE_GEMINI_API_KEY)
            model_name = settings.GOOGLE_GEMINI_MODEL or "gemini-1.5-pro"

            full_contents = f"{_SYSTEM_PROMPT}\n\n{prompt}"

            def _call() -> str:
                response = client.models.generate_content(
                    model=model_name,
                    contents=full_contents,
                )
                return response.text or ""

            text = await asyncio.to_thread(_call)
            logger.info("[RAG] Gemini responded successfully.")
            return text.strip()

        except Exception as exc:
            logger.error("[RAG] Gemini call failed: %s — falling back to context summary.", exc)
            return self._offline_fallback(prompt)

    def _offline_fallback(self, prompt: str) -> str:
        """
        Returns a structured offline answer using the raw KICD context text
        embedded in the prompt, so the response is still grounded even without LLM.
        """
        # Extract everything before the TEACHER'S QUESTION separator
        separator = "---\n\nTEACHER'S QUESTION:"
        if separator in prompt:
            context_block = prompt.split(separator)[0].strip()
        else:
            context_block = prompt

        return (
            "**[Offline Mode — KICD Context Retrieved]**\n\n"
            "The following authoritative KICD curriculum content was found for your query:\n\n"
            f"{context_block}\n\n"
            "_(Connect a Gemini API key for a fully synthesized response.)_"
        )

    def _derive_follow_ups(self, rag_resp: RAGContextResponse) -> List[str]:
        """
        Generates 3 contextual follow-up suggestions from the retrieved citations.
        Falls back to generic CBC suggestions if no citations are present.
        """
        if not rag_resp.citations:
            return [
                "What are the SLOs for this strand?",
                "How do I assess this using the 4-tier rubric?",
                "What zero-cost materials can I use for this activity?",
            ]

        citation = rag_resp.citations[0]
        grade = citation.grade or "this grade"
        strand = citation.strand or "this strand"
        sub_strand = citation.sub_strand or "this sub-strand"

        return [
            f"Generate a 4-tier formative assessment rubric for '{sub_strand}' in {grade}",
            f"What zero-cost local materials can I use to teach '{sub_strand}'?",
            f"List the Specific Learning Outcomes (SLOs) for Strand: '{strand}' in {grade}",
        ]

