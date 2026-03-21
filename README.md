# DocSimplify

AI assistant to simplify documents designed for people with dyslexia and ADHD.

## 🎯 Purpose

Transform dense documents (PDF, Word, texts) into clear and accessible versions with:

- Adjustable reading levels (A1-C1)
- Bullet point summaries
- BeeLine Reader (alternating line colors)
- OpenDyslexic font support
- Calm explanations of each change
- WCAG 2.2 compliance report

## 🚀 Running locally

### Requirements

- Python 3.13
- Node.js 18+
- Azure CLI

### 1. Backend

```bash
# Install dependencies
py -3.13 -m pip install -r requirements.txt

# Start the API (port 8001)
py -3.13 -m uvicorn src.main:app --port 8001 --reload
```

API available at: `http://localhost:8001`
Interactive docs at: `http://localhost:8001/docs`

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend available at: `http://localhost:5173` (or the port Vite assigns)

### Environment variables

Copy `.env.example` to `.env` and fill in the values, or run `deploy.sh` to provision Azure resources and generate the `.env` automatically.

| Variable | Description |
|---|---|
| `AZURE_OPENAI_ENDPOINT` | Azure AI Foundry endpoint |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_CHAT_MODEL` | Chat model deployment name (e.g. `gpt-4o-mini`) |
| `AZURE_OPENAI_EMBEDDING_MODEL` | Embedding model deployment name |
| `COSMOS_ENDPOINT` | Cosmos DB endpoint |
| `COSMOS_KEY` | Cosmos DB primary key |
| `COSMOS_DATABASE` | Database name |
| `AZURE_SEARCH_ENDPOINT` | AI Search endpoint |
| `AZURE_SEARCH_KEY` | AI Search admin key |
| `AZURE_STORAGE_CONNECTION_STRING` | Blob Storage connection string |
| `DOCUMENT_INTELLIGENCE_ENDPOINT` | Document Intelligence endpoint |
| `DOCUMENT_INTELLIGENCE_KEY` | Document Intelligence key |

## 🏗️ Architecture

### Frontend
- **React + Vite + Tailwind CSS**
- OpenDyslexic font, BeeLine Reader, Pomodoro timer
- WCAG 2.2 compliant

### Backend (Multi-Agent System)
- **FastAPI** on Python 3.13
- **Adaptation Agent** — orchestrates the full simplification pipeline
- **Parser Agent** — extracts text with Azure Document Intelligence
- **Teacher Agent** — simplifies and adapts text with GPT-4o-mini
- **Comprehension Agent** — generates comprehension questions
- RAG via Azure AI Search

### Azure Services
| Service | Purpose |
|---|---|
| Azure AI Foundry | GPT-4o-mini + text-embedding-ada-002 |
| Azure Cosmos DB | Users, documents metadata, chat history |
| Azure Blob Storage | Raw document files |
| Azure AI Search | RAG index for document chunks |
| Azure Document Intelligence | PDF/Word text extraction |

## 🏠 Project structure

```
demo-group3/
├── src/
│   ├── agents/        # Multi-agent pipeline
│   ├── api/           # FastAPI routers
│   ├── config/        # Settings / env vars
│   ├── models/        # Pydantic schemas
│   └── services/      # Cosmos DB, Search, Blob
├── frontend/          # React + Tailwind
└── infra/             # Bicep infrastructure
```

## ☁️ Deploy Azure infrastructure

```bash
# Provisions all Azure resources and generates .env
bash deploy.sh
```

## 👥 User presets

| Preset | Description |
|---|---|
| **TDAH** | Short sentences, bullets, Pomodoro timer |
| **Dislexia** | OpenDyslexic font, BeeLine, high contrast |
| **Combinado** | Both adaptations combined |
| **Docente** | Generates 3 versions (A1 / A2 / B1) for teachers |
