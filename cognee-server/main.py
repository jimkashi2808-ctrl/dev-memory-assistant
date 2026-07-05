from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import json
import os
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

load_dotenv("../.env")

import cognee
from cognee.api.v1.search import SearchType

# Use Ollama for everything - free and working
os.environ["LLM_API_KEY"] = "ollama"
os.environ["LLM_MODEL"] = "llama3.2"
os.environ["LLM_PROVIDER"] = "ollama"
os.environ["LLM_ENDPOINT"] = "http://localhost:11434/v1"
os.environ["EMBEDDING_PROVIDER"] = "ollama"
os.environ["EMBEDDING_MODEL"] = "nomic-embed-text"
os.environ["EMBEDDING_ENDPOINT"] = "http://localhost:11434/api/embeddings"
os.environ["EMBEDDING_DIMENSIONS"] = "768"

USE_COGNEE = True
print("✅ Cognee configured with Ollama (free local AI)")

app = FastAPI()

LOGS_FILE = Path("session_logs.json")

def load_logs():
    if LOGS_FILE.exists():
        try:
            with open(LOGS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_logs_to_file(logs):
    with open(LOGS_FILE, 'w') as f:
        json.dump(logs, f, indent=2)

session_logs = load_logs()

class MemoryItem(BaseModel):
    text: str
    dataset: str = "default"
    type: str = "session"
    tags: list = []

class QueryItem(BaseModel):
    question: str
    dataset: str = "default"

@app.post("/remember")
async def remember(item: MemoryItem):
    log_entry = {
        "id": len(session_logs) + 1,
        "text": item.text,
        "dataset": item.dataset,
        "type": item.type,
        "tags": item.tags,
        "timestamp": datetime.now().isoformat(),
        "is_bug": any(w in item.text.lower() for w in ["bug","fix","error","issue","crash"]),
        "is_prompt": any(w in item.text.lower() for w in ["prompt","gpt","claude","ai","asked"]),
        "files": [w for w in item.text.split() if "." in w and w.split(".")[-1] in ["js","py","html","css","json","ts"]]
    }
    session_logs.append(log_entry)
    save_logs_to_file(session_logs)

    try:
        await cognee.add(item.text, dataset_name=item.dataset)
        await cognee.cognify()
        print(f"✅ Cognee knowledge graph updated: {item.dataset}")
    except Exception as e:
        print(f"⚠️ Cognee background: {e}")

    return {"status": "remembered", "entry": log_entry}


@app.post("/recall")
async def recall(item: QueryItem):
    query = item.question.lower().strip()
    query_words = [w for w in query.split() if len(w) > 2]

    if not session_logs:
        return {"results": ["No sessions logged yet. Please log some sessions first from the Overview page."]}

    # Smart keyword scoring
    scored = []
    for log in session_logs:
        text_lower = log["text"].lower()
        score = 0
        if query in text_lower:
            score += 10
        for word in query_words:
            if word in text_lower:
                score += 2
        if any(w in query for w in ["bug","error","fix","crash","issue"]) and log["is_bug"]:
            score += 5
        if any(w in query for w in ["ai","prompt","gpt","claude","used"]) and log["is_prompt"]:
            score += 5
        if any(w in query for w in ["file","which","what file"]) and log["files"]:
            score += 3
        if log["dataset"] in query:
            score += 4
        if any(w in query for w in ["recent","last","latest"]):
            score += session_logs.index(log) + 1
        scored.append((score, log))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = [s[1] for s in scored[:3] if s[0] > 0]

    if top:
        answers = []
        for l in top:
            clean = l['text'].strip()
            answers.append(f"📁 {l['dataset']}: {clean}")
        return {"results": answers}

    # Return most recent if nothing matches
    recent = session_logs[-3:]
    return {"results": [f"📁 {l['dataset']}: {l['text'][:100]}" for l in reversed(recent)]}
@app.get("/logs")
async def get_logs():
    return {
        "logs": session_logs,
        "total": len(session_logs),
        "bugs": sum(1 for l in session_logs if l["is_bug"]),
        "prompts": sum(1 for l in session_logs if l["is_prompt"]),
        "files": list(set(f for l in session_logs for f in l["files"])),
        "projects": list(set(l["dataset"] for l in session_logs))
    }

@app.delete("/delete/{session_id}")
async def delete_session(session_id: int):
    global session_logs
    before = len(session_logs)
    session_logs = [l for l in session_logs if l["id"] != session_id]
    save_logs_to_file(session_logs)
    return {"status": "deleted", "removed": before - len(session_logs)}

@app.delete("/forget/{dataset}")
async def forget(dataset: str):
    return {"status": "forgotten"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)