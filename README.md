# ChatWise AI — RAG-Powered AI Tool Selection Assistant 🤖

**GIST Internship | Task 4**

ChatWise AI is a full-stack application that helps users discover and evaluate AI tools using **Retrieval-Augmented Generation (RAG)**. It combines a React frontend with a FastAPI backend to retrieve relevant information from a local knowledge base, present evidence-backed recommendations, and support transparent AI tool comparisons.

## ✨ Features

- 🔎 **Knowledge-Based Retrieval** — Search a local AI tools knowledge base using TF-IDF retrieval.
- 📚 **Evidence-Backed Recommendations** — Display relevant evidence snippets and source links alongside recommendations.
- ⚖️ **AI Tool Comparison** — Compare responses from 2–4 AI tools using user-provided answers and transparent human ratings.
- 🧠 **Optional Gemini Integration** — Generate synthesized answers using Gemini when `GEMINI_API_KEY` is configured.
- 🔄 **Fallback Responses** — Provide deterministic, evidence-based responses when Gemini is unavailable.
- ➕ **Knowledge Base Management** — Add knowledge-base entries through the backend API.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Python, FastAPI |
| Retrieval | TF-IDF |
| LLM Integration | Google Gemini (optional) |
| Data Source | Local JSON knowledge base |

## 📁 Project Structure

```text
ChatWise_AI/
├── backend/
│   ├── app/
│   ├── data/
│   │   └── knowledge_base.json
│   ├── requirements.txt
│   └── .env.example
└── frontend/
```

## ⚙️ Requirements

- Python 3.10+
- Node.js 18+
- npm

## 🚀 Getting Started

### 1. Clone the Repository

```powershell
git clone https://github.com/mallikarajapure-collab/ChatWise-Tool-AI.git
cd ChatWise-Tool-AI
```

### 2. Set Up the Backend

Open **Terminal 1 — PowerShell**:

```powershell
cd .\backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If you want Gemini-powered synthesis, add your API key to `backend/.env` using the configuration expected by the application.

### 3. Set Up the Frontend

Open **Terminal 2 — PowerShell** from the repository root:

```powershell
cd .\frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

## 🎓 Internship Context

- **Organization:** GIST
- **Program:** Internship
- **Task:** Task 4
- **Project:** ChatWise AI — RAG-Powered AI Tool Selection Assistant

This project brings together frontend development, backend API integration, information retrieval, evidence-based responses, and optional LLM integration.

## 📝 Notes & Limitations

- Comparison ratings are human-entered judgments, not an objective benchmark.
- Entries in `backend/data/knowledge_base.json` are starter examples. Verify tool details against official sources and update `last_verified` before submission.
- Gemini integration is optional; without a configured API key, the backend uses retrieved evidence and its fallback response.
- Never commit `.env` files, API keys, or other secrets.

## 👩‍💻 Author

**Mallika**

GitHub: [@mallikarajapure-collab](https://github.com/mallikarajapure-collab)

---

*Built as part of the GIST Internship — Task 4.*
