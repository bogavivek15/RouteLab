# RouteLab — Real-Time Cold-Call Companion Application

RouteLab is the live companion screen a sales representative keeps open during a high-velocity cold call. It enables callers to understand the current stage at a glance, actively listen without losing conversational cadence, capture the prospect's exact words, log stage outcomes with single-tap controls, and automatically generate post-call syntheses with server-side AI.

---

## Live Production Deployments

- **Live Application (Frontend - Vercel):** [https://route-lab.vercel.app/](https://route-lab.vercel.app/)
- **Live API Service (Backend - Render):** [https://routelab-zj54.onrender.com](https://routelab-zj54.onrender.com)
  - Verified Health Endpoint: [https://routelab-zj54.onrender.com/api/health](https://routelab-zj54.onrender.com/api/health)
  - Root Health Alias: [https://routelab-zj54.onrender.com/health](https://routelab-zj54.onrender.com/health)
- **Live Database:** Remote Supabase PostgreSQL (55+ verified calls persisted)
- **GitHub Repository:** [https://github.com/bogavivek15/RouteLab](https://github.com/bogavivek15/RouteLab)

---

## Key Highlights & Caller Experience

- **Intuitive Live Dashboard**: Replaces complex CRM interfaces with a clean, focused, 8-stage calling dashboard that keeps the caller grounded second-by-second.
- **High-Velocity Single-Tap Outcomes**: 4 contextual outcomes per stage allowing callers to log reality instantly without breaking conversation cadence.
- **Operational Outcome Taxonomy**: Supports 9 selectable call outcomes for active call closure (`next_step_agreed`, `agreed_to_receive_report`, `interested`, `follow_up`, `call_again`, `not_interested`, `do_not_call`, `wrong_person`, `moved_company`). Historical `not_logged` entries from the source archive are tracked as a data-quality audit category and rejected on active call closure (HTTP 422).
- **Non-Regressive Stepper Navigation**: Callers can navigate freely backward and forward across stages without corrupting or regressing furthest-stage milestones.
- **Automated AI Call Debrief & Coaching**: Real-time server-side intelligence (`gemini-3.8-flash`) that synthesizes prospect needs, objections, next steps, and coaching insights immediately upon call completion, with a deterministic fallback when offline.

---

## Authoritative Grounding & Research Documentation

RouteLab is built strictly according to official specifications and empirical evidence:
1. **Official Eight-Stage Structure**:
   - `1. Opening`: Reach the right person and state who you are within 10 seconds.
   - `2. Purpose`: State in 1–2 sentences why you called, in words the prospect can repeat.
   - `3. Permission`: Establish whether the prospect is willing to talk now.
   - `4. Their business`: Learn about their company and operations before pitching.
   - `5. Their need, in their words`: Hear what they are struggling with; record exact quotes.
   - `6. Objection`: Understand the underlying reason for hesitation or refusal.
   - `7. Next step`: Agree on one concrete item (WhatsApp document, named callback time).
   - `8. Close`: End the call clearly and log the outcome.
2. **ClinicBooks Reference Screen Specification**: Live call timer, 8-stage stepper, 3 "She may say" prospect reaction examples, 4-tap outcome grid, and prominent verbatim quote box.
3. **100 Cold-Call Transcript Archive**: Comprehensive computational analysis of all 100 call recordings (`T001`–`T100`) from Meridian Growth Partners (Hyderabad).
   - See [docs/transcript-analysis.md](docs/transcript-analysis.md) for full empirical findings, stage drop-off analysis, and outcome discrepancies.
   - See [docs/research-methodology.md](docs/research-methodology.md) for classification rules, ambiguity resolution, and privacy safeguards.
   - See [docs/evidence-map.md](docs/evidence-map.md) for design decision traceability.
   - See [docs/decision-log.md](docs/decision-log.md) for architecture decision records (ADR-001 through ADR-008).

---

## Technology Stack

- **Frontend (`apps/web`)**: React 19, Vite 8, JavaScript (ESM), Tailwind CSS, Lucide Icons. Deployed to **Vercel**.
- **Backend (`services/api`)**: Python 3.11, FastAPI, Pydantic v2, Uvicorn, Supabase Python Client. Deployed to **Render**.
- **Database (`supabase`)**: PostgreSQL (Supabase) with local SQLite fallback for testing.
- **LLM**: Google Gemini (`gemini-3.8-flash`) via server-side API with deterministic evidence-based fallback.

---

## Monorepo Layout

```text
callflow/
├── apps/
│   └── web/                   # React 19 + Vite 8 + Tailwind CSS frontend
│       ├── public/            # Favicon and static web assets
│       ├── src/
│       │   ├── assets/        # Visual assets
│       │   ├── components/    # Navbar, StageProgress, StageCard, BottomBar, Modals
│       │   ├── data/          # Stage definitions & outcome choices (stages.js)
│       │   ├── api.js         # Unified API client utility
│       │   ├── App.jsx        # Master state and navigation container
│       │   ├── index.css      # Design system, glassmorphism, and custom animations
│       │   └── main.jsx       # React application entry point
│       ├── .env.example       # Frontend environment template
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.js
├── services/
│   └── api/                   # FastAPI backend service
│       ├── routes/            # /api/health, /api/calls, /api/calls/.../summarize
│       ├── config.py          # Settings and environment variables
│       ├── database.py        # DatabaseAdapter (Supabase + local SQLite fallback)
│       ├── llm.py             # Server-side Gemini integration + deterministic fallback
│       ├── models.py          # Pydantic request/response models
│       ├── main.py            # FastAPI entry point & CORS configuration
│       ├── tests/             # Automated test suite (22 tests)
│       │   └── test_api.py
│       ├── .env.example       # Backend environment template
│       └── requirements.txt   # Pinned Python dependencies
├── supabase/
│   └── schema.sql             # PostgreSQL tables (calls, stage_results), triggers & indexes
├── docs/                      # Authoritative specifications and empirical research
│   ├── product-requirements.md
│   ├── transcript-analysis.md
│   ├── research-methodology.md
│   ├── evidence-map.md
│   ├── decision-log.md
│   ├── api-contract.md
│   ├── test-report.md
│   ├── demo-script.md
│   └── execution-log.md
├── render.yaml                # Render cloud service deployment configuration
├── LICENSE                    # MIT License
└── README.md
```

---

## Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18+ (Node 22 recommended) and npm
- Python 3.11+
- Git

### 2. Backend Setup
```bash
cd services/api

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn services.api.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API will run on `http://127.0.0.1:8000`.  
Verify health check at: `http://127.0.0.1:8000/api/health`.

### 3. Frontend Setup
```bash
cd apps/web

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend application will run on `http://localhost:5173`.

---

## Environment Variables

### Backend (`services/api/.env`)
Copy `services/api/.env.example` to `services/api/.env`:
| Variable | Description | Default / Example |
|---|---|---|
| `CALLFLOW_DATABASE_URL` | Supabase PostgreSQL connection string | Optional (falls back to local SQLite) |
| `CALLFLOW_SUPABASE_URL` | Supabase project URL | `https://<project-ref>.supabase.co` |
| `CALLFLOW_SUPABASE_SERVICE_KEY` | Supabase service-role secret key | `<secret-service-key>` |
| `CALLFLOW_LLM_API_KEY` | Google Gemini API Key | Optional (falls back to deterministic summary) |
| `CALLFLOW_LLM_MODEL` | Gemini Model Identifier | `gemini-3.8-flash` |
| `CALLFLOW_CORS_ORIGIN` | Allowed Frontend Origin | `*` or `https://route-lab.vercel.app` |
| `PORT` | Web Service Port | `8000` |

### Frontend (`apps/web/.env`)
Copy `apps/web/.env.example` to `apps/web/.env`:
| Variable | Description | Default / Example |
|---|---|---|
| `VITE_CALLFLOW_API_BASE_URL` | Base URL for backend API | `/api` (local proxy) or `https://routelab-zj54.onrender.com/api` |
| `VITE_CALLFLOW_SUPABASE_URL` | Public Supabase project URL | Optional |
| `VITE_CALLFLOW_SUPABASE_ANON_KEY` | Public Supabase Anon key | Optional |

---

## API Endpoints

All endpoints use JSON payloads and return structured responses:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` / `/api/health` | Health check (service status, database connectivity, LLM status) |
| `POST` | `/api/calls` | Start a new call (optional `prospect_name`, `prospect_company`) |
| `GET` | `/api/calls` | List past calls ordered by `created_at DESC` for history |
| `GET` | `/api/calls/{call_id}` | Retrieve full call details and all recorded stage results |
| `PUT` | `/api/calls/{call_id}/stages/{stage_number}` | Save/update stage outcome and prospect words (stages 1–8) |
| `POST` | `/api/calls/{call_id}/close` | End call with final outcome and timestamp |
| `POST` | `/api/calls/{call_id}/summarize` | Generate/retrieve AI post-call synthesis (needs, objections, next step) |

---

## Testing

Run the automated test suite across Unit, Integration, API Contract, Resilience, and Transcript Scenarios:
```powershell
# Windows PowerShell (from repository root):
$env:PYTHONPATH="."
.\services\api\.venv\Scripts\python -m pytest services/api/tests -v
```

```bash
# macOS / Linux (from repository root):
PYTHONPATH=. services/api/.venv/bin/pytest services/api/tests -v
```

All 23 automated tests verify:
- Stage constraint validation (stages 1 through 8 strictly enforced; out-of-bounds rejected with 422).
- Final outcome validation: Enforces 9 valid active operational outcomes; explicitly rejects `not_logged` and empty strings with HTTP 422.
- Automated test database isolation: Enforces isolated SQLite test execution (`test_callflow_isolated.db`), completely protecting production Supabase from test data pollution.
- End-to-end call lifecycle with non-regressing furthest stage tracking.
- Idempotent and early call closure at any stage with zero notes.
- Sub-200ms API response latency and database health connectivity.
- 11 privacy-safe transcript-derived test scenarios modeling gatekeeper screening, domain corrections, objection handling, and concrete agreements.

See [docs/test-report.md](docs/test-report.md) for full test logs, audit record identification, and live cloud evidence.

---

## Known Limitations & Resilience Design

- **Offline / LLM Provider Resilience**: If `CALLFLOW_LLM_API_KEY` is omitted, times out, or provider errors occur, RouteLab automatically generates a deterministic evidence-based summary from the prospect's recorded quotes in Stage 5, objections in Stage 6, and next steps in Stage 7, clearly labeled with source attribution. Call saving and closing never block on external LLM availability. Model configurations are normalized to `gemini-3.8-flash` to prevent obsolete dashboard environment variables from breaking post-call summaries.
- **Database Isolation & Fallback**: Automated tests run against an isolated local SQLite database (`test_callflow_isolated.db`) with zero risk to production. In local or unconfigured environments, `DatabaseAdapter` automatically initializes local SQLite with the exact same table constraints and triggers.

---

## License
MIT License. See [LICENSE](LICENSE) for details.
