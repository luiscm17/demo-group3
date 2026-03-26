import asyncio
import logging
from src.agents.orchestrator_agent import AgentOrchestrator

async def main():
    orchestrator = AgentOrchestrator()
    
    # Provider must be kept alive for the entire session
    async with orchestrator.provider:
        await orchestrator.setup()

        session_id = "user123"
        output = await orchestrator.run("Simplifica este documento para nivel A1", session_id)
        print(output)
    
    # Provider is now closed


if __name__ == "__main__":
    asyncio.run(main())
