from agent_framework import BaseContextProvider, AgentSession, SessionContext
from typing import Any

class CustomContextProvider(BaseContextProvider):
    """Inyecta contexto personalizado para usuarios con TDH."""

    DEFAULT_SOURCE_ID = "user_context"

    def __init__(self):
        super().__init__(self.DEFAULT_SOURCE_ID)

    async def before_run(
        self,
        *,
        agent: Any,
        session: AgentSession | None,
        context: SessionContext,
        state: dict[str, Any],
    ) -> None:
        """Se ejecuta antes de cada llamada al LLM."""

        if session and hasattr(session, 'state'):
            user_name = session.state.get("user_name")
            if user_name:
                context.extend_instructions(
                    self.source_id,
                    f"El nombre del usuario es {user_name}. Sé cálido, empático y dirígete a él por su nombre cuando sea natural."
                )

        # Contexto general para TDH (siempre se aplica)
        context.extend_instructions(
            self.source_id,
            "Usuario con TDH: Usa frases cortas, viñetas, lenguaje sencillo, tono motivador y evita sobrecarga de información."
        )

    async def after_run(
        self,
        *,
        agent: Any,
        session: AgentSession | None,
        context: SessionContext,
        state: dict[str, Any],
    ) -> None:
        """Se ejecuta DESPUÉS de cada llamada (para guardar info)."""
        # Ejemplo: si el usuario dice su nombre, lo guardamos en el state
        for msg in context.input_messages:
            text = msg.text if hasattr(msg, "text") else ""
            if isinstance(text, str) and "mi nombre es" in text.lower():
                name = text.lower().split("mi nombre es")[-1].strip().split()[0].capitalize()
                state["user_name"] = name