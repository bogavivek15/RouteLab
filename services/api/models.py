from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

VALID_ACTIVE_OUTCOMES = {
    "agreed_to_receive_report",
    "next_step_agreed",
    "interested",
    "follow_up",
    "call_again",
    "not_interested",
    "do_not_call",
    "wrong_person",
    "moved_company",
}

class StageResultBase(BaseModel):
    outcome: Optional[str] = None
    prospect_words: Optional[str] = None
    notes: Optional[str] = None

class StageResultCreate(StageResultBase):
    stage_number: int = Field(..., ge=1, le=8, description="Stage number between 1 and 8")

class StageResultResponse(StageResultBase):
    id: str
    call_id: str
    stage_number: int
    created_at: datetime
    updated_at: datetime

class CallCreate(BaseModel):
    prospect_name: Optional[str] = None
    prospect_company: Optional[str] = None

class CallClose(BaseModel):
    final_outcome: str = Field(..., description="Final outcome of the call")

    @field_validator("final_outcome")
    @classmethod
    def validate_final_outcome(cls, v: str) -> str:
        clean = v.strip() if isinstance(v, str) else ""
        if not clean:
            raise ValueError("final_outcome cannot be empty. An explicit outcome is required to close a call.")
        if clean == "not_logged":
            raise ValueError(
                "'not_logged' indicates an unrecorded historical call in source data. "
                "It cannot be selected when closing a new live call."
            )
        if clean not in VALID_ACTIVE_OUTCOMES:
            raise ValueError(f"Invalid outcome '{clean}'. Must be one of: {sorted(list(VALID_ACTIVE_OUTCOMES))}")
        return clean


class CallBase(BaseModel):
    id: str
    prospect_name: Optional[str] = None
    prospect_company: Optional[str] = None
    current_stage: int
    furthest_stage: int
    status: str
    final_outcome: Optional[str] = None
    summary: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class CallResponse(CallBase):
    stage_results: List[StageResultResponse] = []

class HealthResponse(BaseModel):
    status: str
    version: str = "1.0.0"
    database: str
    llm_configured: bool
    timestamp: datetime

class SummaryResponse(BaseModel):
    call_id: str
    source: str  # "llm" or "fallback"
    summary: str
    stated_needs: Optional[str] = None
    objections: Optional[str] = None
    agreed_next_step: Optional[str] = None
    follow_up_actions: Optional[str] = None
