from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Include routers
app.include_router(health.router)
app.include_router(calls.router)
app.include_router(summarize.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
