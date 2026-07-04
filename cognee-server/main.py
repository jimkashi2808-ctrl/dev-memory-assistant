from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import json
from pathlib import Path
from datetime import datetime

app = FastAPI()

LOGS_FILE = Path("session_logs.json")

def load_logs():
    if LOGS_FILE.exists():
        with open(LOGS_FILE, 'r') as f:
            return json.load(f)
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
    return {"status": "remembered", "entry": log_entry}

@app.post("/recall")
async def recall(item: QueryItem):
    query = item.question.lower().strip()
    query_words = [w for w in query.split() if len(w) > 2]
    
    if not session_logs:
        return {"results": ["No sessions logged yet. Please log some sessions first from the Overview page."]}
    
    # Score each log by relevance
    scored = []
    for log in session_logs:
        text_lower = log["text"].lower()
        score = 0
        
        # Exact phrase match gets highest score
        if query in text_lower:
            score += 10
        
        # Individual word matches
        for word in query_words:
            if word in text_lower:
                score += 2
        
        # Context-based matching
        if any(w in query for w in ["bug", "error", "fix", "crash", "issue"]) and log["is_bug"]:
            score += 5
        if any(w in query for w in ["ai", "prompt", "gpt", "claude", "asked"]) and log["is_prompt"]:
            score += 5
        if any(w in query for w in ["file", "what file", "which file"]) and log["files"]:
            score += 3
        if log["dataset"] in query:
            score += 4
            
        # Time-based queries
        if any(w in query for w in ["recent", "last", "latest", "today"]):
            score += (session_logs.index(log) + 1)
            
        if score > 0:
            scored.append((score, log))
    
    # Sort by relevance score
    scored.sort(key=lambda x: x[0], reverse=True)
    
    if scored:
        # Return top 3 most relevant results
        top_results = [s[1] for s in scored[:3]]
        answers = []
        for log in top_results:
            answer = f"[{log['dataset']}] {log['text']}"
            answers.append(answer)
        return {"results": answers}
    
    # If no match found, say so clearly
    return {"results": [f"No sessions found matching '{item.question}'. Try asking about bugs, files, or project names you've logged."]}

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

@app.delete("/forget/{dataset}")
async def forget(dataset: str):
    return {"status": "forgotten"}
@app.delete("/delete/{session_id}")
async def delete_session(session_id: int):
    global session_logs
    session_logs = [l for l in session_logs if l["id"] != session_id]
    save_logs_to_file(session_logs)
    return {"status": "deleted"}
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)