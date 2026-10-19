# CallFlow — Decision Log

## Architecture and Design Decisions

### ADR-001: Monorepo Structure & Separation of Concerns
- **Decision:** Use a clean monorepo with `apps/web` (React + Vite + Tailwind CSS) and `services/api` (FastAPI + Python 3.11).
- **Rationale:** Strict separation of client interface and server logic ensures server secrets (LLM keys, Supabase service-role keys) are never exposed to the browser.
- **Status:** Approved & Implemented.

### ADR-002: Eight-Stage Data Model & Furthest Stage Tracking
- **Decision:** Store both `current_stage` and `furthest_stage` (1–8) on the `calls` table, alongside a normalized `stage_results` table with unique constraint on `(call_id, stage_number)`.
- **Rationale:** Allows callers to freely navigate back and forth to edit notes without regressing the furthest stage reached metric in call analytics and history views.
- **Status:** Approved & Implemented in `supabase/schema.sql`.

### ADR-003: LLM Integration Pattern (Server-Side with Graceful Fallback)
- **Decision:** Call Google Gemini API (`gemini-2.0-flash` or `gemini-1.5-flash`) exclusively from FastAPI. If the LLM call fails, times out, or lacks credentials, provide a deterministic structured summary fallback clearly labeled as non-LLM.
- **Rationale:** Satisfies the strict requirement that saving and closing a call must never be blocked by external LLM provider downtime or quota limits.
- **Status:** Approved.

### ADR-004: Direct Local Fallback / Mock Database Mode for Development & Testing
- **Decision:** Implement database abstraction in FastAPI that connects to Supabase PostgreSQL when credentials (`CALLFLOW_DATABASE_URL` or `CALLFLOW_SUPABASE_URL`) are present, with SQLite/in-memory fallback for local integration tests and when Supabase credentials have not yet been provided.
- **Rationale:** Enables fully automated unit, integration, and end-to-end tests to pass locally prior to remote cloud deployment.
- **Status:** Approved.

### ADR-005: Clean UI Design Grounded in ClinicBooks Reference Screen
- **Decision:** Follow the ClinicBooks reference screen:
  1. Top header with live call timer and call controls.
  2. Stage navigation stepper (1 to 8) showing completed, active, and upcoming stages.
  3. "She may say" guidance card grounded in official evidence.
  4. Quick 4-tap outcome grid.
  5. Dedicated free-text area for prospect words.
  6. Sticky bottom action bar with "Previous", "Next", and "End Call".
- **Rationale:** Minimizes cognitive load for callers speaking live on the phone.
- **Status:** Approved.
