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

### ADR-006: Operational Outcome Taxonomy vs Source Archive Data Quality
- **Decision:** Enforce a strict distinction between the 9 selectable operational outcomes available to callers closing new calls (`next_step_agreed`, `agreed_to_receive_report`, `interested`, `follow_up`, `call_again`, `wrong_person`, `moved_company`, `not_interested`, `do_not_call`) and the 10 source-dataset classifications (`not_logged` is tracked as a data-quality omission category, not a valid closure option, and is rejected by backend validation with HTTP 422).
- **Rationale:** Prevents newly completed calls from being falsely marked as classified when no genuine outcome was recorded, while preserving full reconciliation with historical archive records.
- **Status:** Approved & Implemented.

### ADR-007: Visual Primacy for Stage 5 Verbatim Quote Capture
- **Decision:** Provide elevated visual affordance (amber border glow, expanded input height, clear guidance label) for the prospect quote textarea specifically at Stage 5 ("Their need, in their words").
- **Rationale:** Transcript empirical research revealed that callers rarely echo or record the prospect's exact words in live dialogue (only 1 call, T089, had an immediate verbatim echo). Highlighting this field enforces active listening discipline and accurate CRM documentation.
- **Status:** Approved & Implemented.

### ADR-008: Upgrading Default LLM Target to Gemini 3.8 Flash with Fallback
- **Decision:** Update the primary backend LLM configuration to `gemini-3.8-flash` with a 45.0s bounded timeout and `thinking_budget=0`, while strictly preserving the deterministic rule-based fallback summary when the provider encounters errors, rate limits, or network timeouts.
- **Rationale:** Google GenAI deprecated `gemini-2.0-flash` with an explicit migration directive to `gemini-3.8-flash`. Fallback summary guarantees zero call records are delayed or lost.
- **Status:** Approved & Implemented.

### ADR-009: Automated Test Database Isolation Safeguard
- **Decision:** Automatically divert all database queries to an isolated local SQLite file (`test_callflow_isolated.db`) whenever test indicators are detected (`CALLFLOW_ENV == "test"`, `TESTING == "1"`, or `"pytest" in sys.modules`).
- **Rationale:** Completely eliminates the risk of automated test suites running against or polluting remote production Supabase databases, reducing test execution time from 147s to ~2s.
- **Status:** Approved & Implemented.

### ADR-010: Model Identifier Sanitization Against Obsolete Environment Variables
- **Decision:** Add runtime normalization in `config.py` that translates obsolete or deprecated model strings (`gemini-2.0-flash`, `gemini-1.5-flash`, etc.) to `gemini-3.8-flash`.
- **Rationale:** Prevents stale environment variables configured in hosting dashboards (e.g., Render) from overriding application defaults with deprecated model identifiers that return HTTP 404 errors.
- **Status:** Approved & Implemented.


