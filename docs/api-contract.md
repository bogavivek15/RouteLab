# CallFlow — API Contract & Specification

## Base URL
- Local development: `http://localhost:8000/api`
- Production (Render): `https://<render-service-name>.onrender.com/api`

All endpoints accept and return JSON (`Content-Type: application/json`).

---

## Endpoints

### 1. Health Check
- **Route:** `GET /api/health`
- **Description:** Verifies service health, database connectivity, and LLM configuration status.
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected", // or "disconnected", "local_fallback"
  "llm_configured": true,
  "timestamp": "2026-10-19T14:45:00Z"
}
```

---

### 2. Start a Call
- **Route:** `POST /api/calls`
- **Description:** Initializes a new call record starting at Stage 1.
- **Request Body:**
```json
{
  "prospect_name": "Dr. Rajesh Sharma", // optional
  "prospect_company": "City Health Clinic" // optional
}
```
- **Response (201 Created):**
```json
{
  "id": "c8a4b62f-48d0-449e-b9e7-5781a7a0b123",
  "prospect_name": "Dr. Rajesh Sharma",
  "prospect_company": "City Health Clinic",
  "current_stage": 1,
  "furthest_stage": 1,
  "status": "in_progress",
  "final_outcome": null,
  "summary": null,
  "started_at": "2026-10-19T14:45:00Z",
  "ended_at": null,
  "created_at": "2026-10-19T14:45:00Z",
  "updated_at": "2026-10-19T14:45:00Z",
  "stage_results": []
}
```

---

### 3. List Calls
- **Route:** `GET /api/calls`
- **Description:** Lists all calls ordered by `created_at DESC` for the Call History screen.
- **Response (200 OK):**
```json
[
  {
    "id": "c8a4b62f-48d0-449e-b9e7-5781a7a0b123",
    "prospect_name": "Dr. Rajesh Sharma",
    "prospect_company": "City Health Clinic",
    "current_stage": 4,
    "furthest_stage": 4,
    "status": "completed",
    "final_outcome": "follow_up",
    "summary": "...",
    "started_at": "2026-10-19T14:45:00Z",
    "ended_at": "2026-10-19T14:52:10Z",
    "created_at": "2026-10-19T14:45:00Z",
    "updated_at": "2026-10-19T14:52:10Z"
  }
]
```

---

### 4. Get a Single Call
- **Route:** `GET /api/calls/{call_id}`
- **Description:** Retrieves full call details including all recorded stage results.
- **Response (200 OK):**
```json
{
  "id": "c8a4b62f-48d0-449e-b9e7-5781a7a0b123",
  "prospect_name": "Dr. Rajesh Sharma",
  "prospect_company": "City Health Clinic",
  "current_stage": 2,
  "furthest_stage": 2,
  "status": "in_progress",
  "final_outcome": null,
  "summary": null,
  "started_at": "2026-10-19T14:45:00Z",
  "ended_at": null,
  "created_at": "2026-10-19T14:45:00Z",
  "updated_at": "2026-10-19T14:46:12Z",
  "stage_results": [
    {
      "id": "f1b2c3d4-...",
      "call_id": "c8a4b62f-48d0-449e-b9e7-5781a7a0b123",
      "stage_number": 1,
      "outcome": "Reached the right person",
      "prospect_words": "Yes, speaking.",
      "notes": "Direct line",
      "created_at": "2026-10-19T14:45:30Z",
      "updated_at": "2026-10-19T14:45:30Z"
    }
  ]
}
```

---

### 5. Save or Update Stage Result
- **Route:** `PUT /api/calls/{call_id}/stages/{stage_number}`
- **Description:** Upserts the stage result for the specified stage number (1–8). Updates `current_stage` and `furthest_stage = max(furthest_stage, stage_number)`.
- **Request Body:**
```json
{
  "outcome": "Asked what we do",
  "prospect_words": "What is this regarding exactly?",
  "notes": "Interested in billing software"
}
```
- **Response (200 OK):**
```json
{
  "call_id": "c8a4b62f-48d0-449e-b9e7-5781a7a0b123",
  "stage_number": 2,
  "outcome": "Asked what we do",
  "prospect_words": "What is this regarding exactly?",
  "notes": "Interested in billing software",
  "current_stage": 2,
  "furthest_stage": 2,
  "updated_at": "2026-10-19T14:46:12Z"
}
```

---

### 6. Close Call
- **Route:** `POST /api/calls/{call_id}/close`
- **Description:** Marks the call as `completed`, records the `final_outcome`, and sets `ended_at = NOW()`. Can be triggered from any stage (stages 1–8).
- **Request Body:**
```json
{
  "final_outcome": "agreed_to_receive_report"
}
```
- **Response (200 OK):**
```json
{
  "id": "c8a4b62f-48d0-449e-b9e7-5781a7a0b123",
  "status": "completed",
  "final_outcome": "agreed_to_receive_report",
  "furthest_stage": 7,
  "ended_at": "2026-10-19T14:52:10Z"
}
```

---

### 7. Post-Call Summary (LLM)
- **Route:** `POST /api/calls/{call_id}/summarize`
- **Description:** Synthesizes the prospect's needs, objections, and agreed next steps using Gemini. If LLM is unreachable or unconfigured, returns an evidence-based deterministic fallback clearly labeled.
- **Response (200 OK):**
```json
{
  "call_id": "c8a4b62f-48d0-449e-b9e7-5781a7a0b123",
  "source": "llm", // or "fallback"
  "summary": "Brief 2-3 sentence overview of the conversation.",
  "stated_needs": "Need to automate patient billing across 3 clinic locations.",
  "objections": "Concerned about staff training downtime.",
  "agreed_next_step": "Send 2-page overview PDF on WhatsApp by tomorrow 10 AM.",
  "follow_up_actions": "Call back Thursday at 2:00 PM for demo."
}
```

---

## Error Responses
Consistent error payload across all endpoints:
```json
{
  "detail": "Descriptive error message"
}
```
- `400 Bad Request`: Validation failure (e.g. stage number not 1-8).
- `404 Not Found`: Call ID not found.
- `500 Internal Server Error`: Unhandled server exception (secrets redacted).
