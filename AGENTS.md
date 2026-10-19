# CallFlow — Agent Rules

## Project Identity

CallFlow is a cold-call companion application.
Stack: React + Vite + JavaScript + Tailwind CSS (frontend), Python + FastAPI (backend), Supabase PostgreSQL (database), server-side LLM API.
Frontend deploys to Vercel. Backend deploys to Render.

## Deadline

This project has an **eight-hour** implementation window. Every decision must favour shipping a working product within that constraint. Cut scope before cutting quality.

## Source of Truth

Product requirements documents, the reference screen, and the 100-transcript archive are the authoritative specification. When in doubt, re-read the source material — do not invent requirements.

## Implementation Discipline

1. **Small, sequential stages.** Complete one feature or layer before starting the next. Each stage must produce a verifiable artefact (running endpoint, rendered component, passing test).
2. **Mandatory verification gates.** After every stage: run the relevant tests, confirm the expected output, and record the result (pass / fail / blocked / unverified). Do not advance past a failing gate without explicit user approval.
3. **Honest reporting.** Never claim a test passed if it did not. Never claim a deployment succeeded without a live health-check response. Report exact error messages.

## Security & Credentials

- **Never commit real secrets.** All `.env` files are gitignored. Only `.env.example` files (with empty placeholders) may be committed.
- Store API keys and database URLs exclusively in environment variables.
- Use unique, project-scoped variable names to avoid collisions (prefix `CALLFLOW_`).
- Do not log, print, or embed secrets in source code, commit messages, or agent output.
- Follow the credentials skill (`product-evidence`) and deployment skill (`deployment-security`) for handling specifics.

## Minimal Dependencies

- Add a dependency only when it solves a clear, immediate need.
- Prefer the platform or existing library over a new package.
- No unnecessary architectural layers, ORMs, or abstraction libraries unless the product requirements demand them.

## Human Approval Required

The following operations require explicit user confirmation before execution:

- Deleting or overwriting files outside the working branch.
- Running database migrations on a remote/production database.
- Deploying to production (Vercel or Render).
- Changing billing-relevant cloud settings.
- Installing global packages or modifying global configurations.
- Any destructive operation that cannot be trivially undone.

## Deployment Verification

- A deployment is **not complete** until a live URL returns a healthy response.
- Always provide the exact URL tested and the response received.
- If a health-check fails, report the failure — do not retry silently and claim success.

## Skills

Four workspace skills are available in `.agents/skills/`:

| Skill | Purpose |
|---|---|
| `product-evidence` | Tracing requirements to the three source documents and 100 transcripts |
| `fullstack-implementation` | Enforcing the stack, API contracts, and stage-gate workflow |
| `verification-testing` | Running all seven test categories with honest status reporting |
| `deployment-security` | Protecting secrets, validating deploy configs, verifying live URLs |

Read the relevant `SKILL.md` before starting work that falls under its scope.

## General Conduct

- Preserve existing comments and documentation unless a change is explicitly requested.
- Keep responses concise and evidence-based.
- When uncertain, ask — do not guess.
