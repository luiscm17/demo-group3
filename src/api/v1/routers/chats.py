from fastapi import APIRouter, Depends, status
from src.core.dependencies import get_current_user_id
from src.models.schemas.chats import ChatMessage, ChatResponse

from src.agents.orchestrator_service import orchestrator_service

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("", response_model=ChatResponse, response_model_by_alias=True)
async def chat_with_agent(
    body: ChatMessage,
    user_id: str = Depends(get_current_user_id),
):
    """
    Endpoint principal que usa el OrchestratorAgent para comprensión lectora con TDH.
    """
    try:
        agent_text = await orchestrator_service.process_message(
            user_id=user_id,
            user_message=body.message
        )

        return ChatResponse(
            simplifiedText=agent_text,
            explanation="Respuesta generada por la orquesta educativa especializada en TDH",
            tone="empático",
            glossary=[]
        )

    except Exception as e:
        print(f"[ERROR] en chat_with_agent: {e}")
        return ChatResponse(
            simplifiedText="Lo siento, ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
            explanation="Error en el procesamiento del agente",
            tone="neutral",
            glossary=[]
        )