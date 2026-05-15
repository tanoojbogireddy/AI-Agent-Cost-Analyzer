from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os

from cost_calculator import analyze_cost_configuration

app = FastAPI()

# Enable CORS so the React dev server can talk to this Python API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---
class AgentConfig(BaseModel):
    agent_type: str
    daily_requests: int
    llm_provider: str
    deployment_region: str = "us"
    custom_input_tokens: Optional[int] = None
    custom_output_tokens: Optional[int] = None
    custom_processing_time: Optional[float] = None

# --- COST ANALYSIS ENDPOINT ---
@app.post("/api/analyze-cost")
async def analyze_cost(config: AgentConfig):
    """Analyze and compare agent deployment costs across platforms"""
    try:
        result = analyze_cost_configuration(
            agent_type=config.agent_type,
            daily_requests=config.daily_requests,
            llm_provider=config.llm_provider,
            deployment_region=config.deployment_region,
            custom_input_tokens=config.custom_input_tokens,
            custom_output_tokens=config.custom_output_tokens,
            custom_processing_time=config.custom_processing_time,
        )
        return result
    except ValueError as e:
        return {"error": str(e)}

# --- UNIFIED FRONTEND SERVING ---
# This serves your React build (dist folder) on the same port
if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        # Serve index.html for all routes (SPA behavior)
        return FileResponse("dist/index.html")
else:
    @app.get("/")
    async def fallback():
        return {
            "status": "Backend Active",
            "message": "To see the UI, run 'npm run build' first."
        }

if __name__ == "__main__":
    import uvicorn
    # Runs the unified app on http://localhost:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)