 <div align="center">

# 💬 ChatWise AI

### RAG-Powered AI Tool Selection Assistant

**Discover smarter tools. Retrieve relevant evidence. Compare responses.**

A full-stack application built as **GIST Internship — Task 4**, combining retrieval-based knowledge search, evidence-backed recommendations, and AI tool comparison.

<p>
  <img src="https://img.shields.io/badge/GIST_Internship-Task_4-38BDF8?style=for-the-badge" alt="GIST Internship Task 4" />
  <img src="https://img.shields.io/badge/RAG-Information_Retrieval-06B6D4?style=for-the-badge" alt="RAG" />
  <img src="https://img.shields.io/badge/Status-Project_Repository-0EA5E9?style=for-the-badge" alt="Project repository" />
</p>

[Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-getting-started) · [Internship](#-internship-context)

</div>

---

## 🌤️ About the Project

**ChatWise AI** is a tool-selection assistant that searches a local knowledge base to help users explore AI tools and review relevant information.

It uses TF-IDF retrieval to identify relevant knowledge-base entries, presents evidence snippets and source links, and supports comparisons between responses from multiple AI tools. Optional Gemini integration provides synthesized answers when configured.

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔎 Knowledge Retrieval
Search a local AI tools knowledge base using TF-IDF retrieval.

</td>
<td width="50%" valign="top">

### 📚 Evidence-Based Results
Present relevant evidence snippets and source links alongside recommendations.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⚖️ AI Tool Comparison
Compare responses from 2–4 AI tools using user-provided answers and transparent human ratings.

</td>
<td width="50%" valign="top">

### 🧠 Optional Gemini Integration
Use Gemini-powered synthesis when `GEMINI_API_KEY` is configured.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔄 Fallback Responses
Use retrieved evidence and a deterministic fallback when Gemini is unavailable.

</td>
<td width="50%" valign="top">

### ➕ Knowledge Base Updates
Add knowledge-base entries through the backend API.

</td>
</tr>
</table>

## 🛠️ Tech Stack

<p>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=20232A" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-REST_API-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TF--IDF-Retrieval-0EA5E9?style=flat-square" alt="TF-IDF" />
  <img src="https://img.shields.io/badge/Gemini-Optional_Integration-4285F4?style=flat-square&logo=googlegemini&logoColor=white" alt="Gemini" />
</p>

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Python, FastAPI |
| Retrieval | TF-IDF |
| Language model integration | Google Gemini (optional) |
| Knowledge base | Local JSON data |

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

## 🚀 Getting Started

### Requirements

- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the Repository

```powershell
git clone https://github.com/mallikarajapure-collab/ChatWise-Tool-AI.git
cd ChatWise-Tool-AI
```

### 2. Run the Backend

Open **Terminal 1 — PowerShell** from the repository root:

```powershell
cd .\backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Run the Frontend

Open **Terminal 2 — PowerShell** from the repository root:

```powershell
cd .\frontend
npm install
npm run dev
```

Open the URL displayed by Vite, usually:

**http://localhost:5173**

### 4. Optional Gemini Configuration

To enable Gemini-powered synthesis, configure `GEMINI_API_KEY` in the backend `.env` file using the variable name expected by the application.

Without a configured key, the backend can use retrieved evidence and its fallback response.

## 🎓 Internship Context

| Detail | Information |
|---|---|
| Organization | GIST |
| Program | Internship |
| Task | Task 4 |
| Project | ChatWise AI |
| Focus | RAG, information retrieval, tool selection, and full-stack development |

This project demonstrates the integration of frontend development, backend APIs, knowledge retrieval, evidence-backed responses, and optional language-model synthesis.

## 📝 Notes & Limitations

- Comparison ratings are human-entered judgments, not an objective benchmark.
- The knowledge-base entries in `backend/data/knowledge_base.json` are starter examples. Verify tool details against official sources and update `last_verified` before submission.
- Gemini is optional. Without a configured key, the backend uses its fallback response.
- Never commit `.env` files, API keys, or other secrets.

## 👩‍💻 Author

**Mallika**

GitHub: [@mallikarajapure-collab](https://github.com/mallikarajapure-collab)

---

<div align="center">

**Built with curiosity and code 🩵**

*GIST Internship — Task 4*

</div>
