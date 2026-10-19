# CallFlow — Cloud Deployment Guide

This guide provides instructions for deploying CallFlow to **Supabase** (PostgreSQL), **Render** (FastAPI backend), and **Vercel** (React/Vite frontend).

---

## 1. Supabase Database Deployment

1. Log in to [Supabase](https://supabase.com) and create a new project named `callflow`.
2. Once the database is initialized, navigate to the **SQL Editor** on the left menu.
3. Open `supabase/schema.sql` from this repository, paste the entire SQL script, and click **Run**.
4. Confirm both tables (`calls` and `stage_results`), triggers, and indexes are created successfully.
5. In **Project Settings** -> **API**:
   - Copy the **Project URL** (e.g. `https://xyzcompany.supabase.co`).
   - Copy the **service_role secret key** (needed for backend).
   - Copy the **anon public key** (safe for frontend).

---

## 2. Render Backend Deployment

1. Log in to [Render](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository containing the `callflow` codebase.
3. Configure settings:
   - **Name:** `callflow-api`
   - **Root Directory:** `.`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r services/api/requirements.txt`
   - **Start Command:** `uvicorn services.api.main:app --host 0.0.0.0 --port $PORT`
4. In the **Environment Variables** section, add:
   - `CALLFLOW_SUPABASE_URL`: `<your-supabase-project-url>`
   - `CALLFLOW_SUPABASE_SERVICE_KEY`: `<your-supabase-service-role-key>`
   - `CALLFLOW_LLM_API_KEY`: `<your-google-gemini-api-key>`
   - `CALLFLOW_LLM_MODEL`: `gemini-2.0-flash`
   - `CALLFLOW_CORS_ORIGIN`: `*` (or your Vercel URL once deployed)
5. Click **Create Web Service**.
6. **Live Verification Gate:**
   Once deployed, run:
   ```bash
   curl https://<your-render-service>.onrender.com/api/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "version": "1.0.0",
     "database": "connected",
     "llm_configured": true,
     "timestamp": "..."
   }
   ```

---

## 3. Vercel Frontend Deployment

1. Log in to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
2. Import your `callflow` GitHub repository.
3. In project configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `apps/web`.
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_CALLFLOW_API_BASE_URL`: `https://<your-render-service>.onrender.com/api`
5. Click **Deploy**.
6. **Live Verification Gate:**
   - Open your production Vercel URL (e.g., `https://callflow-web.vercel.app`).
   - Verify the top right status shows "Ready".
   - Start a new call and confirm stages and outcomes persist to the live Supabase database.
