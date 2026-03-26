# src/agents/providers/azure_openai_provider.py
from typing import Any
from agent_framework.azure import AzureAIAgentsProvider
from azure.identity.aio import AzureCliCredential
from src.agents.providers.base import BaseAgentProvider


class AzureOpenAIProvider(BaseAgentProvider):
    """
    Provider para crear agentes usando Azure AI Agents (recomendado para GroupChatBuilder).
    
    Usa AzureAIAgentsProvider que permite:
    - Multi-agent orchestration con GroupChatBuilder
    - Tools dinámicas en runtime
    - Mejor compatibilidad con Agent Framework
    
    NOTA: AzureAIAgentsProvider es un context manager. Se debe inicializar
    una sola vez en setup() y mantener vivo para toda la sesión.
    """

    def __init__(self):
        self._credential = None
        self._provider = None
        # Track if we're inside the context manager
        self._context_active = False

    async def _ensure_provider(self):
        """Ensure provider is initialized within async context."""
        if not self._provider or not self._context_active:
            raise RuntimeError(
                "Provider not initialized. Call setup() first or use within async with."
            )
        return self._provider

    async def setup(self):
        """Initialize the provider and credential. Must be called before using."""
        self._credential = AzureCliCredential()
        return self

    async def __aenter__(self):
        """Enter async context manager."""
        if not self._credential:
            self._credential = AzureCliCredential()
        
        self._provider = AzureAIAgentsProvider(credential=self._credential)
        # Enter the provider's async context
        await self._provider.__aenter__()
        self._context_active = True
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Exit async context manager."""
        if self._provider:
            await self._provider.__aexit__(exc_type, exc_val, exc_tb)
        self._context_active = False
        self._provider = None

    async def build(
        self,
        name: str,
        instructions: str,
        tools: list[Any] | None = None,
    ) -> Any:
        """Create an agent. Must be called within async with context."""
        provider = await self._ensure_provider()
        agent = await provider.create_agent(
            name=name,
            instructions=instructions,
            tools=tools or [],
        )
        return agent
    
    async def close(self):
        """Cleanup. Normally not needed if using async with."""
        if self._context_active:
            await self.__aexit__(None, None, None)

