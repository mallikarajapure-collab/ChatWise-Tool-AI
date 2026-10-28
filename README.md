# ChatWise AI — RAG-powered AI Tool Selection Assistant

A GIST Task 4 starter with a React + Vite frontend and FastAPI backend in one repository.

## Features
- Search a local knowledge base of AI tools with TF-IDF retrieval.
- Return evidence snippets and source links with recommendations.
- Compare answers from 2–4 AI tools using user-entered responses and transparent human ratings.
- Add knowledge-base entries through the API.
- Optional Gemini-powered synthesis when `GEMINI_API_KEY` is configured; deterministic evidence-based fallback otherwise.

## Requirements
- Python 3.10+
- Node.js 18+

## Run the backend (Terminal 1 — PowerShell)
```powershell
cd "$HOME\Downloads\ChatWise_AI\backend"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Run the frontend (Terminal 2 — PowerShell)
```powershell
cd "$HOME\Downloads\ChatWise_AI\frontend"
npm install
npm run dev
```
Open the URL Vite prints, usually `http://localhost:5173`.

## Important
- The comparison ratings are human-entered judgments, not an objective benchmark.
- Tool facts and links in `backend/data/knowledge_base.json` are starter examples. Verify official sources and update `last_verified` before submission.
- Gemini is optional. Without a key, the backend uses retrieved evidence and a transparent fallback answer.
- Never commit `.env` or API keys.
