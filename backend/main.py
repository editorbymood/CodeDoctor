from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import orchestrator

app = FastAPI(title="CodeSentinel API")

# Allow Vite frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str

from fastapi.responses import StreamingResponse

@app.post("/analyze")
async def analyze_code(req: CodeRequest):
    try:
        results = await orchestrator.run_all_agents(req.code, req.language)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/stream")
async def analyze_code_stream(req: CodeRequest):
    return StreamingResponse(
        orchestrator.run_all_agents_stream(req.code, req.language),
        media_type="text/event-stream"
    )

@app.get("/health")
def health():
    return {"status": "ok", "system": "CodeSentinel Multi-Agent Engine Operational"}
