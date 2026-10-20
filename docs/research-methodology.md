# RouteLab — Transcript Research Methodology & Data Integrity

## Overview

This document specifies the research protocol, classification taxonomy, ambiguity resolution rules, reproducibility instructions, and privacy safeguards applied to the 100 cold-call audio transcript archive (`cold-call-transcripts-100.zip`).

---

## 1. Source Archive & Integrity Verification

- **Archive File:** `cold-call-transcripts-100.zip` (125,626 bytes)
- **Manifest:**
  - `README.md`: Archive scope, outcome dictionary, turn definitions, language notes, and usage guidelines.
  - `index.csv` & `index.json`: 100 metadata rows with columns: `id`, `duration_seconds`, `outcome`, `prospect_role`, `company_kind`, `company`, `caller`, and `turns`.
  - `transcripts/T001.txt` through `T100.txt`: 100 complete, sequential call transcript files.
- **Verification:** All 100 files were accounted for, parsed, and reconciled against the index manifest without missing files or corrupted records.

---

## 2. Stage Classification Methodology

Each call conversation is evaluated against the eight official stages of the cold call framework:

| Stage # | Stage Name | Conversational Criteria | Operational Indicators |
|---|---|---|---|
| **1** | **Opening** | Reaching the contact, identifying the caller and firm, handling gatekeepers or availability friction. | Switchboard screening, "Who is this regarding?", "In a meeting / driving", wrong number, former employee. |
| **2** | **Purpose** | Articulating the 1–2 sentence purpose of the outreach (growth/margin analysis, peer benchmarking, bottleneck discovery). | "What do you do?", "Where did you get my number?", "Is this a sales call?", "Tell me briefly". |
| **3** | **Permission** | Testing prospect willingness to speak now vs request for alternative channel or callback. | "Is this a good time?", "Can I take two minutes?", "Call me tomorrow", "Send on WhatsApp first". |
| **4** | **Their business** | Investigating prospect's operational model, manufacturing, products, or corporate structure before pitching. | Distribution vs OEM corrections, turnover, facility branches, multinational global hierarchy. |
| **5** | **Their need, in their words** | Uncovering specific business bottlenecks, constraints, capacity, or confirmation that "everything is fine". | Capacity utilization (e.g. 60%), skilled manpower scarcity, export margin pressure, billing delays. |
| **6** | **Objection** | Hearing, acknowledging, and understanding reasons for hesitation or outright refusal. | Existing provider/consultant agreement, centralized global MSA, not decision maker / wrong KRA, no budget. |
| **7** | **Next step** | Agreeing on one concrete, tangible action item with a defined channel or timeframe. | Specific time named (e.g. Thursday 3 PM), founder discovery session, sample report sent on WhatsApp/email. |
| **8** | **Close** | Wrapping up the conversation with confirmed next steps, contact info verification, and polite signoff. | Mutual goodbye, email confirmation, or early termination logging. |

### Classification Rules for Furthest Stage:
1. **Evidence-based progression:** A call advances to Stage $N$ if and only if explicit conversational turns addressing Stage $N$'s criteria occur.
2. **Non-regressive tracking:** If a caller or prospect navigates backward (e.g., prospect answers a Stage 4 question and then circles back to a Stage 2 question like "What do you do again?"), the *furthest stage reached* remains $\max(\text{all stages reached})$.
3. **Early interruption:** Calls where line quality drops, prospects hang up abruptly, or gatekeepers refuse transfer terminate at the stage where the interruption occurred.

---

## 3. Ambiguity Resolution & Uncertainty Handling

Conversational transcripts contain natural real-world ambiguities. The following deterministic rules were applied:

1. **Polite Brush-Off vs Genuine Agreement (Stages 6 vs 7):**
   - When a prospect says *"Send me an email / share your deck"* solely to exit an uncomfortable pitch after expressing resistance (e.g., T088, T091), the conversation is classified as reaching Stage 6 (Objection handled via written material) rather than Stage 7 (Next step agreed), unless a concrete follow-up date/time or specific report content was mutually established.
2. **Authority & Decision-Maker Mismatches:**
   - When a prospect is listed as a senior executive (e.g., CEO) but explicitly states they do not oversee company-level profit or consulting engagements (e.g., T087: *"Company level profit is not my KRA"*), the conversational outcome is classified as role mismatch / wrong person, even if the caller logged `follow_up`.
3. **Interrupted / Dropped Calls vs Direct Rejections:**
   - Incomplete sentences followed by immediate silence or `[Call dropped / disconnected]` are classified under `call_again` or `interrupted`, distinct from `do_not_call` (which requires an explicit verbal request to cease contact).

---

## 4. Privacy & Data Protection Safeguards

In accordance with strict operating rules and data stewardship:
1. **Zero Raw Text in Public Repositories:** The raw transcript ZIP, individual transcript files, and raw excerpt files are strictly excluded from git tracking via `.gitignore`.
2. **Synthetic / Aggregate Public Representation:** Only statistical aggregates, normalized patterns, and synthetic representative scenarios are committed to the codebase.
3. **No Inference of Real-World Entities:** The fictional company names (Meridian Growth Partners, ClinicBooks) and synthesized prospect roles are treated strictly as reference data models.
4. **Credential Isolation:** All API keys, database connection strings, and service tokens are kept exclusively in server-side environment variables.

---

## 5. Reproducibility

To reproduce the aggregate counts and evidence matrices:
1. Place `cold-call-transcripts-100.zip` in your local Downloads directory.
2. Run the deterministic analysis parser:
   ```bash
   python scratch/analyze_transcripts.py
   ```
3. The script processes all 100 transcripts, parses speaker turns, evaluates stage indicators, computes cumulative reach percentages, and outputs exact reconciliation numbers.
