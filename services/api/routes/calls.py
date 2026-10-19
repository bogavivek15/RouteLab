from typing import List
from fastapi import APIRouter, HTTPException, Path
from services.api.models import CallCreate, CallClose, CallResponse, CallBase, StageResultBase
from services.api.database import db

router = APIRouter(prefix="/api/calls", tags=["Calls"])

@router.post("", response_model=CallResponse, status_code=201)
def start_call(payload: CallCreate = CallCreate()):
    created = db.create_call(
        prospect_name=payload.prospect_name if payload else None,
        prospect_company=payload.prospect_company if payload else None
    )
    return created


@router.get("", response_model=List[CallBase])
def list_calls():
    return db.list_calls()

@router.get("/{call_id}", response_model=CallResponse)
def get_call(call_id: str):
    call = db.get_call(call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call

@router.put("/{call_id}/stages/{stage_number}", response_model=CallResponse)
def update_stage_result(
    call_id: str,
    stage_number: int = Path(..., ge=1, le=8, description="Stage number between 1 and 8"),
    payload: StageResultBase = None
):
    outcome = payload.outcome if payload else None
    prospect_words = payload.prospect_words if payload else None
    notes = payload.notes if payload else None

    updated_call = db.save_stage_result(
        call_id=call_id,
        stage_number=stage_number,
        outcome=outcome,
        prospect_words=prospect_words,
        notes=notes
    )
    if not updated_call:
        raise HTTPException(status_code=404, detail="Call not found")
    return updated_call

@router.post("/{call_id}/close", response_model=CallResponse)
def close_call(call_id: str, payload: CallClose):
    closed_call = db.close_call(call_id, payload.final_outcome)
    if not closed_call:
        raise HTTPException(status_code=404, detail="Call not found")
    return closed_call
