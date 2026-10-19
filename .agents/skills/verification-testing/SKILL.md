---
name: verification-testing
description: >-
  Runs all seven testing categories for CallFlow and reports results with
  honest pass/fail/blocked/unverified status. Use after completing any
  implementation stage, before deployment, and during final acceptance.
---

# Verification & Testing Skill

## Responsibility

Execute and report test results across all seven required testing categories.
Never misrepresent a test outcome.

## When to Invoke

- After completing any implementation stage (mandatory verification gate).
- Before any deployment to Vercel or Render.
- During final acceptance review.
- When investigating a reported bug or regression.

## Seven Testing Categories

| # | Category | Scope | Method |
|---|---|---|---|
| 1 | **Unit** | Individual functions, utilities, Pydantic models | pytest (backend), manual or Vitest (frontend) |
| 2 | **API / Integration** | FastAPI endpoint request→response round-trips | pytest + httpx TestClient, or curl/fetch |
| 3 | **Component / UI** | React component renders correctly with expected props | Browser inspection, manual smoke test |
| 4 | **End-to-End** | Full user workflow from frontend through API to database | Browser agent or manual walkthrough |
| 5 | **Security** | No exposed secrets, CORS policy, auth enforcement, input sanitisation | Grep for secrets, test unauthenticated access |
| 6 | **Performance** | Page load time, API response time under normal load | Browser DevTools, `time` on API calls |
| 7 | **Deployment** | Live URL returns healthy response, env vars are set, build succeeds | curl health-check, Vercel/Render dashboard |

## Result Statuses

| Status | Meaning |
|---|---|
| **Pass** | Test executed and produced the expected result. |
| **Fail** | Test executed and produced an unexpected or erroneous result. Include the error. |
| **Blocked** | Test could not execute due to a missing dependency, environment issue, or prerequisite failure. State what is blocking. |
| **Unverified** | Test was not run. State why (e.g., feature not yet implemented, category deferred). |

## Procedure

1. Identify which testing categories apply to the current stage.
2. Execute each applicable test.
3. Record the result using the exact statuses above.
4. For any **Fail** result: include the exact error message or unexpected output.
5. For any **Blocked** result: state the prerequisite that is missing.
6. Summarise the results in a table before advancing to the next stage.

## Verification Criteria

- Every stage gate includes results for at least categories 1–4 (where applicable).
- Security (5) is checked before every deployment.
- Deployment (7) is checked after every deploy, with the live URL and response.
- No category is silently skipped — use **Unverified** with a reason if deferred.

## Constraints

- Do not fabricate test output.
- Do not claim **Pass** without executing the test.
- If a test framework is not yet installed, record **Blocked** and note the missing tool.
