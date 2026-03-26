from abc import ABC, abstractmethod
from typing import Any, Generic, TypeVar

T = TypeVar("T")

class BaseAgentProvider(ABC, Generic[T]):
    """Interfaz base para todos los providers."""

    @abstractmethod
    async def build(
        self,
        name: str,
        instructions: str,
        tools: list[Any] | None = None,
    ) -> T:
        """Construir un agente."""
        pass
