from fastapi import APIRouter, HTTPException
from services.api.models import SummaryResponse
from services.api.database import db
from services.api.llm import generate_call_summary

router = APIRouter(prefix="/api/calls", tags=["Summarize"])

@router.post("/{call_id}/summarize", response_model=SummaryResponse)
async def summarize_call(call_id: str):
    call = db.get_call(call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    summary_data = await generate_call_summary(call)

    # Persist the summary string to the call record
    if summary_data.get("summary"):
        db.update_call_summary(call_id, summary_data["summary"])

    return SummaryResponse(**summary_data)
