---
name: deployment-security
description: >-
  Protects secrets, validates deployment configuration for Vercel and Render,
  and requires live evidence (URL + response) for any deployment claim. Use
  before and after every deployment, and when handling credentials or
  environment variables.
---

# Deployment & Security Skill

## Responsibility

Ensure secrets are never exposed, deployment configurations are correct, and
every deployment claim is backed by live evidence.

## When to Invoke

- When creating, modifying, or reviewing `.env` or `.env.example` files.
- Before deploying to Vercel (frontend) or Render (backend).
- After any deployment to verify the live URL.
- When configuring CORS, authentication, or any security-related middleware.
- When a new API key or credential is introduced.

## Secrets Policy

1. **All real credentials** live in `.env` files that are gitignored.
2. **`.env.example` files** contain the variable names with empty placeholder values — safe to commit.
3. **Variable naming**: prefix all project variables with `CALLFLOW_` to avoid collisions.
4. **No secrets in code**: no API keys, database URLs, or tokens in source files, comments, logs, or agent output.
5. **Server-side only**: LLM API keys and database credentials are used only in the FastAPI backend — never sent to the frontend.

## Environment File Locations

| File | Purpose | Git Status |
|---|---|---|
| `apps/web/.env` | Frontend runtime variables (public API base URL) | **Gitignored** |
| `apps/web/.env.example` | Frontend variable template | Committed |
| `services/api/.env` | Backend secrets (DB URL, LLM key, Supabase keys) | **Gitignored** |
| `services/api/.env.example` | Backend variable template | Committed |

## Deployment Checklist — Vercel (Frontend)

1. Confirm `vite.config.js` build output is correct.
2. Confirm environment variables are set in Vercel project settings (not in code).
3. Deploy and wait for build completion.
4. Hit the live URL and confirm a 200 response with expected content.
5. Record the URL and response as evidence.

## Deployment Checklist — Render (Backend)

1. Confirm `requirements.txt` or equivalent is up to date.
2. Confirm environment variables are set in Render dashboard (not in code).
3. Confirm the start command is correct (e.g., `uvicorn main:app --host 0.0.0.0 --port $PORT`).
4. Deploy and wait for build completion.
5. Hit the `/health` endpoint and confirm a 200 JSON response.
6. Record the URL and response as evidence.

## Verification Criteria

- `git diff --cached` shows no `.env` files staged.
- `.env.example` files contain only empty-value placeholders.
- Every deployment claim includes the exact live URL tested and the response received.
- CORS is configured to allow only the frontend origin in production.
- Unauthenticated requests to protected endpoints return 401/403.

## Constraints

- Do not deploy to production without explicit user approval.
- Do not create or store real credentials — the user provides them.
- Do not retry a failed deployment silently; report the failure and wait for guidance.
