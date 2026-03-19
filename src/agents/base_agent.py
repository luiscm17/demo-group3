import os
from typing import Any
from agent_framework.azure import AzureAIProjectAgentProvider
from azure.ai.projects.aio import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition
from azure.identity.aio import AzureCliCredential
from src.config.settings import AgentSettings

class AzureAIProvider:
    async def build(
        self,
        name: str,
        instructions: str,
        tools: list[Any] | None = None,
    ) -> Any:
        AgentSettings.ai_project_settings()

        async with AzureCliCredential() as credential, AIProjectClient(
            endpoint=AgentSettings.AI_PROJECT_ENDPOINT,
            credential=credential,
        ) as project_client:

            # Crear versión persistente del agente
            created_agent = await project_client.agents.create_version(
                agent_name=name,
                definition=PromptAgentDefinition(
                    model=AgentSettings.AI_MODEL_DEPLOYMENT_NAME,
                    instructions=instructions,
                    tools=tools or [],
                ),
            )

            # Convertirlo en agente usable
            provider = AzureAIProjectAgentProvider(project_client=project_client)
            agent = provider.as_agent(created_agent)

            return agent
