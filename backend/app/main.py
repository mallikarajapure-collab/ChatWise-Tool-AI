from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import math
import re

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
KB_PATH = DATA_DIR / "knowledge_base.json"
EVALUATIONS_PATH = DATA_DIR / "evaluations.json"
DATA_DIR.mkdir(parents=True, exist_ok=True)
load_dotenv(ROOT / ".env")

app = FastAPI(title="ChatWise AI API", version="1.0.0")
origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_kb() -> list[dict[str, Any]]:
    if not KB_PATH.exists():
        return []
    try:
        data = json.loads(KB_PATH.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []

def save_kb(data: list[dict[str, Any]]) -> None:
    KB_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

def load_evaluations() -> list[dict[str, Any]]:
    if not EVALUATIONS_PATH.exists():
        return []
    try:
        return json.loads(EVALUATIONS_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []

class RecommendRequest(BaseModel):
    task: str = Field(min_length=3, max_length=2000)
    budget: str = "Any"
    priority: str = "Balanced"
    limit: int = Field(default=3, ge=1, le=6)

class ToolEntry(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    category: str = Field(default="General", max_length=100)
    summary: str = Field(min_length=10, max_length=2000)
    strengths: list[str] = []
    limitations: list[str] = []
    pricing: str = "Check official site"
    source_url: str = ""
    last_verified: str = "Needs verification"

class CompareItem(BaseModel):
    tool: str = Field(min_length=1, max_length=100)
    response: str = Field(min_length=1, max_length=12000)
    correctness: int = Field(ge=1, le=5)
    relevance: int = Field(ge=1, le=5)
    clarity: int = Field(ge=1, le=5)
    notes: str = Field(default="", max_length=1000)

class CompareRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=3000)
    items: list[CompareItem] = Field(min_length=2, max_length=4)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "ChatWise AI API", "tools_in_kb": len(load_kb()),
            "gemini_enabled": bool(os.getenv("GEMINI_API_KEY"))}

@app.get("/api/tools")
def tools():
    return load_kb()

@app.post("/api/tools")
def add_tool(entry: ToolEntry):
    items = load_kb()
    if any(t.get("name", "").lower() == entry.name.lower() for t in items):
        raise HTTPException(status_code=409, detail="A tool with this name already exists.")
    new_entry = entry.model_dump()
    items.append(new_entry)
    save_kb(items)
    return {"saved": True, "tool": new_entry}

def retrieve(task: str, budget: str, priority: str, limit: int) -> list[dict[str, Any]]:
    """Lightweight TF-IDF-style lexical retrieval without NumPy/SciPy."""
    items = load_kb()
    if not items:
        return []

    stop_words = {
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
        "how", "i", "in", "is", "it", "of", "on", "or", "that", "the",
        "this", "to", "with", "you", "your", "can", "do", "need", "want"
    }

    def tokenize(text: str) -> list[str]:
        words = re.findall(r"[a-zA-Z0-9+#.-]+", str(text).lower())
        words = [word for word in words if word not in stop_words and len(word) > 1]
        # Include adjacent word pairs to capture phrases such as "code review".
        return words + [f"{a}_{b}" for a, b in zip(words, words[1:])]

    docs = []
    for item in items:
        fields = [
            item.get("name", ""),
            item.get("category", ""),
            item.get("summary", ""),
            " ".join(item.get("strengths", [])),
            " ".join(item.get("limitations", [])),
            item.get("pricing", ""),
        ]
        docs.append(tokenize(" ".join(map(str, fields))))

    query = task
    if budget and budget != "Any":
        query += f" budget preference {budget}"
    if priority and priority != "Balanced":
        query += f" priority {priority}"

    query_tokens = tokenize(query)
    if not query_tokens:
        return [
            {**item, "relevance_score": 0.0, "evidence": item.get("summary", "")}
            for item in items[:limit]
        ]

    # Smoothed inverse document frequency.
    document_count = len(docs)
    document_frequency = {}
    for tokens in docs:
        for token in set(tokens):
            document_frequency[token] = document_frequency.get(token, 0) + 1

    def vectorize(tokens):
        counts = {}
        for token in tokens:
            counts[token] = counts.get(token, 0) + 1
        vector = {}
        for token, count in counts.items():
            idf = math.log((1 + document_count) / (1 + document_frequency.get(token, 0))) + 1
            vector[token] = (1 + math.log(count)) * idf
        return vector

    query_vector = vectorize(query_tokens)
    query_norm = math.sqrt(sum(value * value for value in query_vector.values()))
    ranked = []

    for item, tokens in zip(items, docs):
        doc_vector = vectorize(tokens)
        doc_norm = math.sqrt(sum(value * value for value in doc_vector.values()))
        dot = sum(value * doc_vector.get(token, 0.0) for token, value in query_vector.items())
        score = dot / (query_norm * doc_norm) if query_norm and doc_norm else 0.0
        ranked.append((item, score))

    ranked.sort(key=lambda pair: pair[1], reverse=True)

    return [
        {
            **item,
            "relevance_score": round(float(score) * 100, 1),
            "evidence": item.get("summary", ""),
        }
        for item, score in ranked[:limit]
    ]

def synthesize(task: str, budget: str, priority: str, results: list[dict[str, Any]]) -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if key and results:
        try:
            from google import genai
            client = genai.Client(api_key=key)
            model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
            evidence = "\n".join(
                f"- {x['name']}: {x.get('summary','')} Strengths: {', '.join(x.get('strengths', []))}. "
                f"Limitations: {', '.join(x.get('limitations', []))}. Source: {x.get('source_url','')}"
                for x in results
            )
            prompt = (
                "You are ChatWise AI, an evidence-grounded AI-tool selection assistant. "
                "Use only the provided evidence; do not invent features or prices. Mention that "
                "relevance scores are retrieval similarity, not quality scores. Give a concise "
                "recommendation, trade-offs, and cite source URLs.\n"
                f"User task: {task}\nBudget preference: {budget}\nPriority: {priority}\nEvidence:\n{evidence}"
            )
            response = client.models.generate_content(model=model, contents=prompt)
            if response.text:
                return response.text.strip()
        except Exception:
            pass
    if not results:
        return "Knowledge base mein abhi matching entries nahi mili. Knowledge Base tab se verified tool information add karein."
    first = results[0]
    return (
        f"**Starting point:** {first['name']} appears most relevant to the task based on text similarity. "
        f"{first.get('summary', '')}\n\n"
        f"**Trade-off to check:** {'; '.join(first.get('limitations', [])) or 'Verify limitations in the official documentation.'}\n\n"
        "The relevance percentage is a retrieval similarity signal, not a measure of answer quality. "
        "Compare the official sources and test the same prompt before making a final choice."
    )

@app.post("/api/recommend")
def recommend(request: RecommendRequest):
    results = retrieve(request.task, request.budget, request.priority, request.limit)
    return {
        "task": request.task,
        "recommendations": results,
        "answer": synthesize(request.task, request.budget, request.priority, results),
        "retrieval_method": "TF-IDF lexical retrieval",
        "note": "Relevance score is not a quality/performance score."
    }

@app.post("/api/compare")
def compare(request: CompareRequest):
    record = {
        "prompt": request.prompt,
        "items": [item.model_dump() for item in request.items],
        "created_at": __import__("datetime").datetime.now().astimezone().isoformat(),
        "method": "human-entered ratings; not an objective benchmark",
    }
    records = load_evaluations()
    records.insert(0, record)
    EVALUATIONS_PATH.write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding="utf-8")
    return {"saved": True, "comparison": record}

@app.get("/api/evaluations")
def evaluations():
    return load_evaluations()
