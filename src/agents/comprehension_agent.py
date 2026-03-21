"""Comprehension Agent — generates 3 multiple choice questions from simplified text."""

import json
from src.agents.base_agent import AzureAIProvider


class ComprehensionAgent:
    def __init__(self, agent):
        self._agent = agent

    async def run(self, simplified_text: str) -> list[dict]:
        prompt = (
            f"Read this simplified text and generate exactly 3 multiple choice questions "
            f"to check comprehension. Each question must have 3 options (A, B, C) and one correct answer.\n\n"
            f"TEXT:\n{simplified_text[:1500]}\n\n"
            f"Respond ONLY with a valid JSON array in this exact format, nothing else:\n"
            f'[{{"question": "...", "options": {{"A": "...", "B": "...", "C": "..."}}, "answer": "A"}}]'
        )
        result = await self._agent.run(prompt)
        raw = result.text if hasattr(result, "text") else str(result)

        # Extract JSON from response
        try:
            start = raw.index("[")
            end = raw.rindex("]") + 1
            return json.loads(raw[start:end])
        except Exception:
            return [
                {
                    "question": "¿Cuál es la idea principal del texto?",
                    "options": {"A": "La primera opción", "B": "La segunda opción", "C": "La tercera opción"},
                    "answer": "A",
                }
            ]


async def comprehension_agent() -> ComprehensionAgent:
    provider = AzureAIProvider()
    agent = await provider.build(
        name="ComprehensionAgent",
        instructions=(
            "You generate simple, clear multiple choice questions to check reading comprehension. "
            "Questions must be easy to understand. "
            "Always respond with a valid JSON array only, no extra text. "
            "Use calm and encouraging language."
        ),
    )
    return ComprehensionAgent(agent)
