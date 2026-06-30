import cognee
from cognee.api.v1.search import SearchType
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
import os

load_dotenv("../.env")

app = FastAPI()


os.environ["LLM_API_KEY"] = "ollama"
os.environ["LLM_MODEL"] = "llama3.2"
os.environ["LLM_PROVIDER"] = "ollama"
os.environ["LLM_ENDPOINT"] = "http://localhost:11434/v1"

os.environ["EMBEDDING_PROVIDER"] = "ollama"
os.environ["EMBEDDING_MODEL"] = "nomic-embed-text"
os.environ["EMBEDDING_ENDPOINT"] = "http://localhost:11434/api/embeddings"
os.environ["EMBEDDING_DIMENSIONS"] = "768"

class MemoryItem(BaseModel):
    text: str
    dataset: str = "default"


class QueryItem(BaseModel):
    question: str


@app.post("/remember")
async def remember(item: MemoryItem):
    await cognee.add(item.text, dataset_name=item.dataset)
    await cognee.cognify()
    return {"status": "remembered"}


@app.post("/recall")
async def recall(item: QueryItem):
    try:
        results = await cognee.search(item.question, SearchType.SUMMARIES)
        if not results:
            results = await cognee.search(item.question, SearchType.CHUNKS)
        answers = [str(r) for r in results]
        return {"results": answers if answers else ["No memories found yet."]}
    except Exception as e:
        return {"results": [f"Search error: {str(e)}"]}


@app.delete("/forget/{dataset}")
async def forget(dataset: str):
    await cognee.prune.prune_data(dataset)
    return {"status": "forgotten"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)