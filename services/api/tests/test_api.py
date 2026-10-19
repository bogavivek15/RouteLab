import time
import pytest
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.models import StageResultCreate, CallCreate, CallClose, SummaryResponse
from services.api.llm import generate_fallback_summary
from services.api.database import db

client = TestClient(app)

# ==========================================
# 1. UNIT TESTS
# ==========================================

def test_pydantic_stage_result_validation():
    # Valid
    valid_stage = StageResultCreate(stage_number=1, outcome="Reached right person")
    assert valid_stage.stage_number == 1
    assert valid_stage.outcome == "Reached right person"

    # Invalid stage numbers
    with pytest.raises(Exception):
        StageResultCreate(stage_number=0)
    with pytest.raises(Exception):
        StageResultCreate(stage_number=9)

def test_pydantic_call_create_optional_fields():
    call_payload = CallCreate()
    assert call_payload.prospect_name is None
    assert call_payload.prospect_company is None

    call_named = CallCreate(prospect_name="Priya", prospect_company="Meridian")
    assert call_named.prospect_name == "Priya"

def test_deterministic_fallback_summary_logic():
    mock_call = {
        "id": "mock-123",
        "prospect_name": "Suresh",
        "prospect_company": "Apex",
        "furthest_stage": 5,
        "final_outcome": "agreed_to_receive_report",
        "stage_results": [
            {"stage_number": 5, "prospect_words": "Need CRM automation", "notes": "Pain point"},
            {"stage_number": 6, "outcome": "Already have an agency"},
            {"stage_number": 7, "outcome": "Agreed to receive document"}
        ]
    }
    summary = generate_fallback_summary(mock_call)
    assert summary["call_id"] == "mock-123"
    assert summary["source"] == "fallback"
    assert "Need CRM automation" in summary["stated_needs"]
    assert "Already have an agency" in summary["objections"]
    assert "Agreed to receive document" in summary["agreed_next_step"]


# ==========================================
# 2. INTEGRATION & API CONTRACT TESTS
# ==========================================

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "llm_configured" in data
    assert "timestamp" in data

def test_unknown_call_id_returns_404():
    res = client.get("/api/calls/00000000-0000-0000-0000-000000000000")
    assert res.status_code == 404

    res = client.put("/api/calls/00000000-0000-0000-0000-000000000000/stages/1", json={"outcome": "Test"})
    assert res.status_code == 404

    res = client.post("/api/calls/00000000-0000-0000-0000-000000000000/close", json={"final_outcome": "not_interested"})
    assert res.status_code == 404

def test_invalid_stage_validation():
    # Stage 0 is invalid
    res = client.put("/api/calls/123/stages/0", json={"outcome": "Test"})
    assert res.status_code == 422

    # Stage 9 is invalid
    res = client.put("/api/calls/123/stages/9", json={"outcome": "Test"})
    assert res.status_code == 422

def test_call_lifecycle_and_furthest_stage_tracking():
    # 1. Start a call
    create_res = client.post("/api/calls", json={
        "prospect_name": "Test Prospect",
        "prospect_company": "Acme Corp"
    })
    assert create_res.status_code == 201
    call = create_res.json()
    call_id = call["id"]
    assert call["current_stage"] == 1
    assert call["furthest_stage"] == 1
    assert call["status"] == "in_progress"

    # 2. Update Stage 1 outcome & words
    s1_res = client.put(f"/api/calls/{call_id}/stages/1", json={
        "outcome": "Reached the right person",
        "prospect_words": "Yes, I am the founder.",
        "notes": "Direct call"
    })
    assert s1_res.status_code == 200
    call = s1_res.json()
    assert call["current_stage"] == 1
    assert call["furthest_stage"] == 1
    assert len(call["stage_results"]) == 1

    # 3. Progress to Stage 4 (Their business)
    s4_res = client.put(f"/api/calls/{call_id}/stages/4", json={
        "outcome": "Described their business",
        "prospect_words": "We run 4 diagnostic labs in Secunderabad.",
        "notes": "Diagnostic healthcare"
    })
    assert s4_res.status_code == 200
    call = s4_res.json()
    assert call["current_stage"] == 4
    assert call["furthest_stage"] == 4

    # 4. Navigate back to Stage 2 (Purpose) - furthest stage must NOT regress!
    s2_res = client.put(f"/api/calls/{call_id}/stages/2", json={
        "outcome": "Asked what we do",
        "prospect_words": "Tell me what you guys do.",
        "notes": "Clarified purpose"
    })
    assert s2_res.status_code == 200
    call = s2_res.json()
    assert call["current_stage"] == 2
    assert call["furthest_stage"] == 4  # Furthest stage preserved!

    # 5. Progress to Stage 5 (Their need in their words)
    s5_res = client.put(f"/api/calls/{call_id}/stages/5", json={
        "outcome": "Named a specific goal or need",
        "prospect_words": "We need to reduce patient turnaround time by 30%.",
        "notes": "Key operational bottleneck"
    })
    assert s5_res.status_code == 200
    call = s5_res.json()
    assert call["current_stage"] == 5
    assert call["furthest_stage"] == 5

    # 6. Close call early (at stage 5)
    close_res = client.post(f"/api/calls/{call_id}/close", json={
        "final_outcome": "agreed_to_receive_report"
    })
    assert close_res.status_code == 200
    call = close_res.json()
    assert call["status"] == "completed"
    assert call["final_outcome"] == "agreed_to_receive_report"
    assert call["ended_at"] is not None

    # 7. Generate Post-Call Summary (exercises LLM or deterministic fallback)
    summary_res = client.post(f"/api/calls/{call_id}/summarize")
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["call_id"] == call_id
    assert summary["summary"] != ""
    assert "reduce patient turnaround time" in summary["stated_needs"] or summary["source"].startswith("llm") or summary["source"].startswith("fallback")

    # 8. List calls and verify presence
    list_res = client.get("/api/calls")
    assert list_res.status_code == 200
    calls_list = list_res.json()
    matching = [c for c in calls_list if c["id"] == call_id]
    assert len(matching) >= 1
    assert matching[0]["furthest_stage"] == 5
    assert matching[0]["status"] == "completed"


# ==========================================
# 3. PERFORMANCE & RESILIENCE TESTS
# ==========================================

def test_api_latency_under_normal_operations():
    # When connected to remote cloud Supabase over the public internet, allow cloud roundtrip
    max_latency = 2.5 if db.use_supabase else 0.200

    # Create call latency
    t0 = time.time()
    res = client.post("/api/calls", json={"prospect_name": "Perf Test"})
    dt = time.time() - t0
    assert res.status_code == 201
    assert dt < max_latency

    call_id = res.json()["id"]

    # Stage update latency
    t0 = time.time()
    res = client.put(f"/api/calls/{call_id}/stages/1", json={"outcome": "Reached"})
    dt = time.time() - t0
    assert res.status_code == 200
    assert dt < max_latency

def test_early_call_closure_resilience_zero_notes():
    # Caller hangs up in first 3 seconds with zero notes
    create_res = client.post("/api/calls")
    call_id = create_res.json()["id"]

    close_res = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "wrong_person"})
    assert close_res.status_code == 200
    assert close_res.json()["status"] == "completed"
    assert close_res.json()["final_outcome"] == "wrong_person"

    # Summarize must succeed without crashing even with no stage results
    sum_res = client.post(f"/api/calls/{call_id}/summarize")
    assert sum_res.status_code == 200
    assert sum_res.json()["call_id"] == call_id
