import os
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")


class AgentSettings:
    AI_PROJECT_ENDPOINT: Optional[str] = os.getenv("AZURE_AI_PROJECT_ENDPOINT")
    AI_MODEL_DEPLOYMENT_NAME: Optional[str] = os.getenv(
        "AZURE_AI_MODEL_DEPLOYMENT_NAME"
    )

    @classmethod
    def ai_project_settings(cls) -> None:
        if not cls.AI_PROJECT_ENDPOINT:
            raise ValueError("AI_PROJECT_ENDPOINT is not configured")
        if not cls.AI_MODEL_DEPLOYMENT_NAME:
            raise ValueError("AI_MODEL_DEPLOYMENT_NAME is not configured")


class BlobStorageSettings:
    AZURE_STORAGE_CONNECTION_STRING: Optional[str] = os.getenv(
        "AZURE_STORAGE_CONNECTION_STRING"
    )
    AZURE_STORAGE_CONTAINER: Optional[str] = os.getenv("AZURE_STORAGE_CONTAINER")

    @classmethod
    def validate(cls) -> None:
        if not cls.AZURE_STORAGE_CONNECTION_STRING:
            raise ValueError("AZURE_STORAGE_CONNECTION_STRING is not configured")
        if not cls.AZURE_STORAGE_CONTAINER:
            raise ValueError("AZURE_STORAGE_CONTAINER is not configured")
