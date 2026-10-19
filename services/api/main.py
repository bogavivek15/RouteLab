import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure project root is in sys.path
_current_dir = Path(__file__).resolve().parent
_root_dir = _current_dir.parent.parent
if str(_root_dir) not in sys.path:
    sys.path.insert(0, str(_root_dir))

from services.api.config import settings
from services.api.routes import health, calls, summarize

app = FastAPI(
    title="CallFlow API",
    description="Backend API for CallFlow - the real-time cold-call companion",
    version="1.0.0"
)

# CORS configuration
origins = [origin.strip() for origin in settings.CORS_ORIGIN.split(",") if origin.strip()]
if not origins or "*" in origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root health check alias for cloud platforms (Render, etc.)
@app.get("/health", include_in_schema=False)
def root_health():
    return health.get_health()

# Include routers
app.include_router(health.router)
app.include_router(calls.router)
app.include_router(summarize.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.main:app", host="0.0.0.0", port=settings.PORT, reload=True)

