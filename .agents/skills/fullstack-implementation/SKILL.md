---
name: fullstack-implementation
description: >-
  Enforces the CallFlow technology stack, API/data contracts, and sequential
  stage-gate implementation workflow. Use when writing application code,
  defining API endpoints, creating database schemas, or wiring frontend to
  backend.
---

# Full-Stack Implementation Skill

## Responsibility

Ensure all application code adheres to the chosen stack, preserves API and data
contracts, and follows the stage-gate workflow defined in AGENTS.md.

## When to Invoke

- When creating or modifying frontend components, pages, or routing.
- When creating or modifying backend endpoints or middleware.
- When defining or altering database schemas or migrations.
- When wiring frontend API calls to backend endpoints.
- When adding a new dependency.

## Enforced Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend framework | React + Vite | JavaScript (not TypeScript unless user approves) |
| Frontend styling | Tailwind CSS | Utility-first; configure in `tailwind.config.js` |
| Backend framework | Python + FastAPI | Async endpoints, Pydantic models |
| Database | Supabase PostgreSQL | Use Supabase client libraries; Row Level Security where appropriate |
| LLM integration | Server-side API | Called from FastAPI only — never expose API keys to the frontend |
| Frontend deploy | Vercel | Static build output from Vite |
| Backend deploy | Render | Python web service |

## Procedure

1. **Plan the stage.** Define what this stage delivers (e.g., "Auth endpoints + login form").
2. **Check contracts.** Before writing code, confirm the API route, request/response shape, and database table involved. Document them briefly in a comment or docstring.
3. **Implement backend first** (endpoint + schema), then frontend (component + API call). This ensures the contract exists before the consumer.
4. **Validate the contract.** Hit the endpoint manually or with a test; confirm the frontend renders the expected data.
5. **Record the gate result.** Pass / Fail / Blocked / Unverified.
6. **Do not start the next stage** until the current gate passes or the user explicitly approves advancing.

## API Contract Rules

- All endpoints use JSON request/response bodies.
- Use Pydantic models for request validation and response serialization.
- Frontend API calls go through a single `api.js` utility module — no scattered `fetch` calls.
- Environment-specific base URLs are read from environment variables, never hardcoded.

## Dependency Policy

- Check if the platform or an existing package already solves the problem.
- If a new package is needed, state the reason before installing.
- Pin versions in `package.json` and `requirements.txt`.

## Verification Criteria

- Each stage produces a running artefact (visible component or callable endpoint).
- API contracts match between frontend and backend.
- No hardcoded URLs, secrets, or credentials in source code.
- The stage gate is recorded honestly.
