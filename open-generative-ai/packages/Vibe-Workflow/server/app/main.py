from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import workflow_router, app_router, api_keys_router, credits_router
from app.database import init_db

app = FastAPI(title="Kalivid API", version="2.0.0")

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(workflow_router.router, prefix="/api/workflow", tags=["workflow"])
app.include_router(app_router.router, prefix="/api/app", tags=["app"])
app.include_router(api_keys_router.router, prefix="/api", tags=["api-keys"])
app.include_router(credits_router.router, prefix="/api", tags=["credits"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Kalivid API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
