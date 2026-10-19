from datetime import datetime, timezone
from fastapi import APIRouter
from services.api.models import HealthResponse
from services.api.database import db
from services.api.config import settings

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    db_status = db.check_health()
    llm_configured = bool(settings.LLM_API_KEY)
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        database=db_status,
        llm_configured=llm_configured,
        timestamp=datetime.now(timezone.utc)
    )
