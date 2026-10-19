# CallFlow — Cold-Call Companion Application

CallFlow is the live companion screen a caller keeps open during a cold call. It enables callers to understand the current stage at a glance, actively listen without losing focus, capture the prospect's exact words, record stage outcomes with single-tap controls, and automatically generate post-call syntheses with server-side AI.

---

## Authoritative Grounding

CallFlow is built strictly according to official product specifications and evidence:
1. **Official Eight-Stage Structure**:
   - `1. Opening`: Reach the right person and state who you are within 10 seconds.
   - `2. Purpose`: State in 1-2 sentences why you called, in words the prospect can repeat to a colleague.
   - `3. Permission`: Establish whether the prospect is willing to talk now.
   - `4. Their business`: Learn about their company and operations before pitching.
   - `5. Their need, in their words`: Hear what they are struggling with; record exact quotes.
   - `6. Objection`: Understand the underlying reason for hesitation.
   - `7. Next step`: Agree on one concrete item (WhatsApp document, named callback time).
   - `8. Close`: End the call clearly and log the outcome.
2. **ClinicBooks Reference Screen**: Dynamic header with ticking call timer, 8-stage progress stepper, "She may say" guidance card, 4-tap outcome grid, and prominent "Her words" free-text quote box.
3. **100 Cold-Call Transcript Archive**: Analyzed across 100 real call recordings from Meridian Growth Partners (Hyderabad) to design evidence-based outcome choices, common objections, and prospect behaviors.

---

## Technology Stack

- **Frontend (`apps/web`)**: React 19, Vite 8, JavaScript (ESM), Tailwind CSS, Lucide Icons.
- **Backend (`services/api`)**: Python 3.11, FastAPI, Pydantic v2, Uvicorn, Supabase Python Client.
- **Database (`supabase`)**: PostgreSQL (Supabase) with local SQLite fallback for testing.
- **LLM**: Google Gemini 2.0 (`gemini-2.0-flash`) via server-side API with deterministic evidence-based fallback.
- **Deployments**: Vercel (Frontend static build), Render (Backend Python service).

---

## Monorepo Layout

```text
callflow/
├── apps/
│   └── web/                   # React + Vite + Tailwind CSS frontend
│       ├── src/
│       │   ├── components/    # Navbar, StageProgress, StageCard, BottomBar, Modals
│       │   ├── data/          # Stage definitions & outcome choices (stages.js)
│       │   ├── api.js         # Unified API client utility
│       │   ├── App.jsx        # Master state and navigation container
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
│       ├── tests/             # Automated test suite (9 tests)
│       ├── .env.example       # Backend environment template
│       └── requirements.txt   # Pinned Python dependencies
├── supabase/
│   └── schema.sql             # PostgreSQL tables (calls, stage_results), triggers & indexes
├── docs/                      # Requirements, transcript analysis, API contracts, test reports
│   ├── product-requirements.md
│   ├── transcript-analysis.md
│   ├── decision-log.md
│   ├── api-contract.md
│   ├── test-report.md
│   ├── demo-script.md
│   └── execution-log.md
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
| `CALLFLOW_SUPABASE_URL` | Supabase project URL | Optional |
| `CALLFLOW_SUPABASE_SERVICE_KEY` | Supabase service-role secret key | Optional |
| `CALLFLOW_LLM_API_KEY` | Google Gemini API Key | Optional (falls back to deterministic summary) |
| `CALLFLOW_LLM_MODEL` | Gemini Model Identifier | `gemini-2.0-flash` |
| `CALLFLOW_CORS_ORIGIN` | Allowed Frontend Origin | `*` or `http://localhost:5173` |
| `PORT` | Web Service Port | `8000` |

### Frontend (`apps/web/.env`)
Copy `apps/web/.env.example` to `apps/web/.env`:
| Variable | Description | Default / Example |
|---|---|---|
| `VITE_CALLFLOW_API_BASE_URL` | Base URL for FastAPI backend | `/api` (local proxy) or `https://<render-service>.onrender.com/api` |
| `VITE_CALLFLOW_SUPABASE_URL` | Public Supabase project URL | Optional |
| `VITE_CALLFLOW_SUPABASE_ANON_KEY` | Public Supabase Anon key | Optional |

---

## API Endpoints

All endpoints use JSON payloads and return structured responses:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check (app status, database connectivity, LLM status) |
| `POST` | `/api/calls` | Start a new call (optional `prospect_name`, `prospect_company`) |
| `GET` | `/api/calls` | List past calls ordered by `created_at DESC` for history |
| `GET` | `/api/calls/{call_id}` | Retrieve full call details and all recorded stage results |
| `PUT` | `/api/calls/{call_id}/stages/{stage_number}` | Save/update stage outcome and prospect words (stages 1–8) |
| `POST` | `/api/calls/{call_id}/close` | End call with final outcome and timestamp |
| `POST` | `/api/calls/{call_id}/summarize` | Generate/retrieve AI post-call synthesis (needs, objections, next step) |

---

## Testing

Run the automated test suite across Unit, Integration, API Contract, and Resilience tests:
```bash
# From repository root:
.\services\api\.venv\Scripts\python -m pytest services/api/tests -v
```
All 9 automated test suites verify:
- Pydantic models & validation rules
- Stage outcome saving & non-regressing furthest stage tracking
- End-to-end call lifecycle (start → navigate → record → close → summarize)
- Sub-200ms API response latency
- Resilience when handling dropped calls with zero notes

See [docs/test-report.md](docs/test-report.md) for full test evidence and browser recordings.

---

## Deployment Guide

### Database (Supabase)
1. In the Supabase Dashboard, create a new project.
2. Open the **SQL Editor** and paste the contents of `supabase/schema.sql`.
3. Run the query to initialize the `calls` and `stage_results` tables, triggers, and indexes.

### Backend (Render)
1. Connect this repository to Render as a **Web Service**.
2. Settings:
   - **Root Directory**: `.`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r services/api/requirements.txt`
   - **Start Command**: `uvicorn services.api.main:app --host 0.0.0.0 --port $PORT`
3. Environment Variables in Render:
   - `CALLFLOW_SUPABASE_URL`: Your Supabase URL
   - `CALLFLOW_SUPABASE_SERVICE_KEY`: Your Supabase Service Key
   - `CALLFLOW_LLM_API_KEY`: Your Google Gemini API Key
   - `CALLFLOW_LLM_MODEL`: `gemini-2.0-flash`
   - `CALLFLOW_CORS_ORIGIN`: Your Vercel frontend URL

### Frontend (Vercel)
1. Import this repository into Vercel.
2. Settings:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
3. Environment Variables in Vercel:
   - `VITE_CALLFLOW_API_BASE_URL`: `https://<render-service-name>.onrender.com/api`

---

## Known Limitations & Resilience Design
- **Offline / Free LLM Quotas**: If `CALLFLOW_LLM_API_KEY` is omitted or the provider rate limit is encountered, CallFlow automatically generates a deterministic evidence-based summary from the prospect's recorded quotes in Stage 5, objections in Stage 6, and next steps in Stage 7, clearly labeled with source attribution. Call saving and closing never block on external LLM availability.
- **Database Fallback**: In local or unconfigured environments, `DatabaseAdapter` automatically initializes a local SQLite database that implements the exact same table constraints and triggers, ensuring zero developer friction.

---

## License
MIT License. See [LICENSE](LICENSE) for details.
