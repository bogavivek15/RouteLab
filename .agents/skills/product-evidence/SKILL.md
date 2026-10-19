---
name: product-evidence
description: >-
  Traces every feature, screen, and data field back to the three authoritative
  task sources (product-requirements document, reference screen, transcript
  archive of 100 cold-call recordings). Use when planning a feature, resolving
  an ambiguity, or validating that an implementation matches the specification.
---

# Product Evidence Skill

## Responsibility

Ensure every implementation decision is grounded in the supplied product
documentation — not in assumptions or invented requirements.

## When to Invoke

- Before implementing any new feature or component.
- When a requirement is ambiguous or conflicting.
- During code review to verify specification coverage.
- When prioritising scope cuts under the eight-hour deadline.

## Authoritative Sources (priority order)

1. **Product-requirements document** — feature list, user stories, acceptance criteria.
2. **Reference screen** — visual layout, component hierarchy, interaction patterns.
3. **Transcript archive** — 100 cold-call recordings that define real-world usage patterns, vocabulary, objection types, and conversation flow.

## Procedure

1. Identify the feature or question.
2. Search the product-requirements document for the relevant section.
3. Cross-reference with the reference screen for visual/UX intent.
4. Search the transcript archive for real-world examples, edge cases, and vocabulary.
5. Record the evidence trail: source name → section/page/transcript ID → quoted excerpt.
6. If no evidence is found, flag the item as **unspecified** and request user guidance.

## Verification Criteria

- Every implemented feature cites at least one source.
- Transcript-derived data (objection categories, talk tracks, vocabulary) references specific transcript IDs.
- No feature is implemented based solely on assumption — gaps are explicitly flagged.

## Constraints

- Do not duplicate the full product-requirements text inside code or agent output.
- Do not fabricate transcript content; use actual quotes.
- Do not make network calls to fetch documents — they are supplied locally.
