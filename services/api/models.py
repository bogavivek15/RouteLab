from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

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
