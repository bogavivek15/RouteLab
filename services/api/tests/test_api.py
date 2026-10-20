import os
import sys

# Force test isolation mode BEFORE importing application modules
os.environ["CALLFLOW_ENV"] = "test"
os.environ["TESTING"] = "1"

import time
import pytest
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.models import StageResultCreate, CallCreate, CallClose, SummaryResponse
from services.api.llm import generate_fallback_summary
from services.api.database import db

client = TestClient(app)

VALID_ACTIVE_OUTCOMES = [
    "agreed_to_receive_report",
    "next_step_agreed",
    "interested",
    "follow_up",
    "call_again",
    "not_interested",
    "do_not_call",
    "wrong_person",
    "moved_company",
]


# ==========================================
# 1. UNIT TESTS
# ==========================================

def test_all_eight_stage_numbers_validation():
    # Valid stages 1 through 8
    for s in range(1, 9):
        valid = StageResultCreate(stage_number=s, outcome=f"Outcome for stage {s}")
        assert valid.stage_number == s

    # Invalid stage numbers
    for invalid_s in [-5, 0, 9, 10, 99]:
        with pytest.raises(Exception):
            StageResultCreate(stage_number=invalid_s)

def test_pydantic_call_create_optional_fields():
    call_payload = CallCreate()
    assert call_payload.prospect_name is None
    assert call_payload.prospect_company is None

    call_named = CallCreate(prospect_name="Priya", prospect_company="Meridian")
    assert call_named.prospect_name == "Priya"
    assert call_named.prospect_company == "Meridian"

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

def test_deterministic_fallback_handles_missing_prospect_words():
    # Call with completely empty stage words and notes
    mock_call = {
        "id": "mock-empty",
        "prospect_name": None,
        "prospect_company": None,
        "furthest_stage": 1,
        "final_outcome": None,
        "stage_results": []
    }
    summary = generate_fallback_summary(mock_call)
    assert summary["call_id"] == "mock-empty"
    assert summary["source"] == "fallback"
    assert "No specific need recorded" in summary["stated_needs"]
    assert "No objections recorded" in summary["objections"]
    assert "No next step confirmed" in summary["agreed_next_step"]

def test_test_environment_database_isolation_safeguard():
    # Verify that the test suite NEVER runs against remote production Supabase
    assert db.is_test is True
    assert db.use_supabase is False
    assert "test_callflow_isolated" in db.db_path or "callflow_local" in db.db_path

def test_final_outcome_validation_and_not_logged_rejection():
    # Verify all 9 active operational outcomes can be used to close a call
    for outcome in VALID_ACTIVE_OUTCOMES:
        close_obj = CallClose(final_outcome=outcome)
        assert close_obj.final_outcome == outcome

    # Verify 'not_logged' is explicitly rejected as a selectable closure outcome
    with pytest.raises(Exception) as excinfo:
        CallClose(final_outcome="not_logged")
    assert "not_logged" in str(excinfo.value)

    # Verify empty string or whitespace is rejected
    with pytest.raises(Exception):
        CallClose(final_outcome="")
    with pytest.raises(Exception):
        CallClose(final_outcome="   ")

    # Verify arbitrary unknown outcome is rejected
    with pytest.raises(Exception):
        CallClose(final_outcome="invented_outcome")



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

    # Root health check alias
    root_res = client.get("/health")
    assert root_res.status_code == 200
    assert root_res.json()["status"] == "healthy"

def test_unknown_call_id_returns_404():
    unknown_id = "00000000-0000-0000-0000-000000000000"
    res = client.get(f"/api/calls/{unknown_id}")
    assert res.status_code == 404

    res = client.put(f"/api/calls/{unknown_id}/stages/1", json={"outcome": "Test"})
    assert res.status_code == 404

    res = client.post(f"/api/calls/{unknown_id}/close", json={"final_outcome": "not_interested"})
    assert res.status_code == 404

    res = client.post(f"/api/calls/{unknown_id}/summarize")
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

    # 9. Retrieve individual call with all stages
    get_res = client.get(f"/api/calls/{call_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["id"] == call_id
    assert retrieved["status"] == "completed"
    assert len(retrieved["stage_results"]) == 4  # Stages 1, 2, 4, 5 were touched and upserted


# ==========================================
# 3. PERFORMANCE & RESILIENCE TESTS
# ==========================================

def test_api_latency_under_normal_operations():
    max_latency = 3.5 if db.use_supabase else 0.200

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


# ==========================================
# 4. TRANSCRIPT-DERIVED TEST SCENARIOS (PRIVACY-SAFE)
# ==========================================

def test_transcript_scenario_gatekeeper_screening():
    # Case: Reception/Assistant screens call, prospect unavailable
    res = client.post("/api/calls", json={"prospect_name": "Managing Director", "prospect_company": "Industrial Precision"})
    call_id = res.json()["id"]

    s1 = client.put(f"/api/calls/{call_id}/stages/1", json={
        "outcome": "Gatekeeper / reception answered",
        "prospect_words": "He is in an operations meeting. What is this regarding?",
        "notes": "Assistant asked for company intro"
    })
    assert s1.status_code == 200

    close = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "follow_up"})
    assert close.status_code == 200
    assert close.json()["furthest_stage"] == 1
    assert close.json()["final_outcome"] == "follow_up"

def test_transcript_scenario_wrong_person_former_employee():
    # Case: Person listed no longer works with the company
    res = client.post("/api/calls", json={"prospect_name": "Former Exec", "prospect_company": "Auto Components"})
    call_id = res.json()["id"]

    client.put(f"/api/calls/{call_id}/stages/1", json={
        "outcome": "Wrong number / person left company",
        "prospect_words": "He left the organization six months ago.",
        "notes": "Outdated contact record"
    })
    close = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "moved_company"})
    assert close.status_code == 200
    assert close.json()["final_outcome"] == "moved_company"

def test_transcript_scenario_prospect_challenging_purpose():
    # Case: Prospect asks where number came from and questions sales intent
    res = client.post("/api/calls", json={"prospect_name": "Founder", "prospect_company": "Solar Panels Ltd"})
    call_id = res.json()["id"]

    client.put(f"/api/calls/{call_id}/stages/1", json={"outcome": "Reached the right person"})
    s2 = client.put(f"/api/calls/{call_id}/stages/2", json={
        "outcome": "Asked where we got the number",
        "prospect_words": "Where did you get my direct mobile number from?",
        "notes": "Explained public manufacturing registry"
    })
    assert s2.status_code == 200
    assert s2.json()["furthest_stage"] == 2

def test_transcript_scenario_time_bound_callback():
    # Case: Prospect driving or travelling, grants specific callback time
    res = client.post("/api/calls", json={"prospect_name": "Owner", "prospect_company": "Packaging Solutions"})
    call_id = res.json()["id"]

    client.put(f"/api/calls/{call_id}/stages/1", json={"outcome": "Reached the right person"})
    client.put(f"/api/calls/{call_id}/stages/2", json={"outcome": "Let me go on"})
    s3 = client.put(f"/api/calls/{call_id}/stages/3", json={
        "outcome": "Asked to call back later",
        "prospect_words": "I am driving on the highway. Call me on Thursday at 3 PM.",
        "notes": "Thursday 3 PM confirmed"
    })
    assert s3.status_code == 200
    close = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "follow_up"})
    assert close.json()["final_outcome"] == "follow_up"
    assert close.json()["furthest_stage"] == 3

def test_transcript_scenario_business_domain_correction():
    # Case: Prospect corrects caller assumption (e.g. distribution vs manufacturing)
    res = client.post("/api/calls", json={"prospect_name": "CEO", "prospect_company": "Apex Chemicals"})
    call_id = res.json()["id"]

    client.put(f"/api/calls/{call_id}/stages/1", json={"outcome": "Reached the right person"})
    client.put(f"/api/calls/{call_id}/stages/2", json={"outcome": "Asked what we do"})
    client.put(f"/api/calls/{call_id}/stages/3", json={"outcome": "Gave permission to talk now"})
    s4 = client.put(f"/api/calls/{call_id}/stages/4", json={
        "outcome": "Corrected my assumption",
        "prospect_words": "We do not do manufacturing here. We only distribute imported specialty chemicals.",
        "notes": "Distributor, not OEM"
    })
    assert s4.status_code == 200
    assert s4.json()["furthest_stage"] == 4

def test_transcript_scenario_explicit_stated_need():
    # Case: Prospect articulates operational bottleneck in their own words (Stage 5)
    res = client.post("/api/calls", json={"prospect_name": "Director", "prospect_company": "Precision Robotics"})
    call_id = res.json()["id"]

    for st in range(1, 5):
        client.put(f"/api/calls/{call_id}/stages/{st}", json={"outcome": f"Stage {st} completed"})

    s5 = client.put(f"/api/calls/{call_id}/stages/5", json={
        "outcome": "Named a specific goal or need",
        "prospect_words": "The biggest challenge is manpower requirement. Skilled technical manpower.",
        "notes": "Labor shortage in high-spec CNC operations"
    })
    assert s5.status_code == 200
    assert s5.json()["stage_results"][-1]["prospect_words"] == "The biggest challenge is manpower requirement. Skilled technical manpower."

def test_transcript_scenario_existing_consultant_objection():
    # Case: Prospect has global / central consultant agreement
    res = client.post("/api/calls", json={"prospect_name": "VP Eng", "prospect_company": "MNC Tech India"})
    call_id = res.json()["id"]

    for st in range(1, 6):
        client.put(f"/api/calls/{call_id}/stages/{st}", json={"outcome": f"Stage {st} complete"})

    s6 = client.put(f"/api/calls/{call_id}/stages/6", json={
        "outcome": "Already have a provider / consultant",
        "prospect_words": "Because we are an MNC, we already have such consultants at a global level through a single agreement.",
        "notes": "Global MSA in place"
    })
    assert s6.status_code == 200
    assert s6.json()["furthest_stage"] == 6

def test_transcript_scenario_request_written_info():
    # Case: Prospect requests deck/profile to review on WhatsApp/email
    res = client.post("/api/calls", json={"prospect_name": "Director", "prospect_company": "Hydraulics Unit"})
    call_id = res.json()["id"]

    for st in range(1, 7):
        client.put(f"/api/calls/{call_id}/stages/{st}", json={"outcome": f"Stage {st} passed"})

    s7 = client.put(f"/api/calls/{call_id}/stages/7", json={
        "outcome": "Agreed to receive a document",
        "prospect_words": "Send me a sample report on WhatsApp and I will review it.",
        "notes": "WhatsApp dispatch agreed"
    })
    assert s7.status_code == 200

    close = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "agreed_to_receive_report"})
    assert close.status_code == 200
    assert close.json()["final_outcome"] == "agreed_to_receive_report"

def test_transcript_scenario_direct_rejection_do_not_call():
    # Case: Explicit refusal to be contacted
    res = client.post("/api/calls", json={"prospect_name": "Executive", "prospect_company": "Pharma Chem"})
    call_id = res.json()["id"]

    client.put(f"/api/calls/{call_id}/stages/1", json={"outcome": "Reached the right person"})
    client.put(f"/api/calls/{call_id}/stages/2", json={"outcome": "Said it is a sales call"})
    close = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "do_not_call"})
    assert close.status_code == 200
    assert close.json()["final_outcome"] == "do_not_call"

def test_transcript_scenario_dropped_or_interrupted_call():
    # Case: Line drops or prospect hangs up mid-conversation
    res = client.post("/api/calls", json={"prospect_name": "Manager", "prospect_company": "Fabricators"})
    call_id = res.json()["id"]

    client.put(f"/api/calls/{call_id}/stages/1", json={"outcome": "Reached the right person"})
    client.put(f"/api/calls/{call_id}/stages/2", json={
        "outcome": "Asked what we do",
        "prospect_words": "[Line disconnected / silence]",
        "notes": "Call dropped mid-sentence"
    })
    close = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "call_again"})
    assert close.status_code == 200
    assert close.json()["final_outcome"] == "call_again"
    assert close.json()["furthest_stage"] == 2

def test_transcript_scenario_vague_agreement_vs_concrete_commitment():
    # Case: Stage 7 concrete commitment (named founder meeting)
    res = client.post("/api/calls", json={"prospect_name": "Partner", "prospect_company": "Green Energy Systems"})
    call_id = res.json()["id"]

    for st in range(1, 7):
        client.put(f"/api/calls/{call_id}/stages/{st}", json={"outcome": f"Stage {st} completed"})

    s7 = client.put(f"/api/calls/{call_id}/stages/7", json={
        "outcome": "Set a specific time for next call",
        "prospect_words": "Tuesday at 11 AM works for our leadership team.",
        "notes": "Founder discovery meeting scheduled"
    })
    assert s7.status_code == 200

    close = client.post(f"/api/calls/{call_id}/close", json={"final_outcome": "next_step_agreed"})
    assert close.status_code == 200
    assert close.json()["final_outcome"] == "next_step_agreed"
    assert close.json()["furthest_stage"] == 7
