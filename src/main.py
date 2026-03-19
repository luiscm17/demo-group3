import asyncio
from src.agents.teacher_agent import teacher_agent

async def main():
    # Instanciamos el TeacherAgent (persistente en Foundry v2)
    teacher = await teacher_agent()

    # Ejemplo de interacción
    question = "Can you explain what a neural network is?"
    response = await teacher.run(question)

    print("User:", question)
    print("TeacherAgent:", response)


if __name__ == "__main__":
    asyncio.run(main())
