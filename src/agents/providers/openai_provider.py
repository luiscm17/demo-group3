# src/agents/providers/azure_openai_provider.py
from typing import Any
# from agent_framework.azure import AzureOpenAIResponsesClient
from agent_framework.openai import OpenAIChatClient
from src.agents.providers.base import BaseAgentProvider
from src.config.settings import AzureOpenAISettings
from azure.identity import AzureCliCredential


class OpenAIProvider(BaseAgentProvider):
    """
    Provider para crear agentes usando Azure OpenAI.
    No requiere async with, funciona como cliente API.
    """

    def __init__(self):
        self.client = OpenAIChatClient(
            model_id=AzureOpenAISettings.get_deployment_name(),
            api_key=AzureOpenAISettings.get_api_key()
        )

    async def build(
        self,
        name: str,
        instructions: str,
        tools: list[Any] | None = None,
    ) -> Any:
        agent = self.client.as_agent(
            name=name,
            instructions=instructions,
            tools=tools or [],
        )
        return agent

