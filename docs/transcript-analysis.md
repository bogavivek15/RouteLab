# RouteLab — Transcript Archive Empirical Research & Analysis

## Executive Summary

An exhaustive empirical research audit was conducted on the entire archive of 100 cold-call transcripts (`T001` through `T100`) and the companion manifest (`index.csv` / `index.json`) from Meridian Growth Partners (Hyderabad). Callers included Priya, Divya, Meera, Sana, Arjun, Anjali, Rohit, Rachel, and others, contacting owners, CEOs, Managing Directors, and technical leaders of mid-sized Indian enterprises.

Every transcript was read, parsed, and analyzed using a reproducible computational pipeline (`scratch/analyze_transcripts.py`) cross-verified with manual inspection of edge cases.

---

## 1. Usable Transcripts & Archive Reconciliation

- **Total Transcripts in Archive:** 100 files (`T001.txt` to `T100.txt`).
- **Index Records:** 100 rows in `index.csv`.
- **Usable Transcripts Inspected:** 100 (100% complete coverage).
- **Duration:** Ranging from 22 seconds to 580 seconds (median: 165 seconds).

### Outcome Distribution (Reconciled with `index.csv`):

| Recorded Outcome | Transcript Count | Percentage | Operational Meaning |
|---|---|---|---|
| `not_interested` | 14 | 14.0% | Direct prospect refusal or lack of business need. |
| `agreed_to_receive_report` | 14 | 14.0% | Prospect agreed to receive research profile via WhatsApp or email. |
| `follow_up` | 14 | 14.0% | Prospect requested a callback at a future date/time. |
| `not_logged` | 13 | 13.0% | Caller failed to log any structured outcome in CRM post-call. |
| `next_step_agreed` | 11 | 11.0% | Specific discovery session or founder meeting scheduled. |
| `do_not_call` | 10 | 10.0% | Explicit request to be removed from calling lists. |
| `wrong_person` | 8 | 8.0% | Reached switchboard, ex-employee, or non-decision maker. |
| `interested` | 7 | 7.0% | High verbal interest expressed; discovery initiated without fixed date. |
| `moved_company` | 5 | 5.0% | Target contact has departed the organization. |
| `call_again` | 4 | 4.0% | Call dropped mid-conversation, bad line, or language barrier. |
| **Total** | **100** | **100.0%** | **Reconciled against archive manifest.** |

---

## 2. Where Do Calls End? (Stage Reach & Drop-Off Analysis)

Every transcript was classified by the furthest official stage reached based on the 8-stage framework:

### Metric Definitions:
- **Calls Reaching at Least This Stage:** Number of calls whose conversational dialogue reached or progressed past this stage milestone.
- **Cumulative Reach (%):** Proportion of the total 100-call archive reaching this stage ($N = 100$).
- **Calls Dropping / Terminating at This Stage:** Number of calls that ended prematurely at this stage without progressing to subsequent stages.
- **Stage Drop-Off Rate (%):** Proportion of calls reaching this stage that dropped here ($\text{Calls Dropping at Stage} / \text{Calls Reaching Stage}$).
- **Completed Close:** Calls that reached Stage 8 and concluded with a full mutual wrap-up (confirmed action, callback, or polite mutual sign-off). Completed calls are **not** counted as dropped calls.
- **Dropped Off Before Stage 8:** Total calls terminating across Stages 1 through 7 ($2 + 7 + 4 + 18 + 14 + 7 + 7 = 59$ calls, 59.0%).

### Cumulative Stage Reach & Drop-Off Table (Reconciled):

| Stage # | Stage Name | Calls Reaching at Least This Stage | Cumulative Reach (%) | Calls Dropping at This Stage | Drop-off Rate (%) | Completed Closes | Primary Drop-off Cause |
|---|---|---|---|---|---|---|---|
| **Stage 1** | **Opening** | 100 | 100.0% | 2 | 2.0% | — | Wrong contact number, instant hangup. |
| **Stage 2** | **Purpose** | 98 | 98.0% | 7 | 7.1% | — | Instant rejection on purpose ("Where did you get number?"). |
| **Stage 3** | **Permission** | 91 | 91.0% | 4 | 4.4% | — | Direct refusal of permission ("Not interested in listening"). |
| **Stage 4** | **Their business** | 87 | 87.0% | 18 | 20.7% | — | Corporate structure mismatch, distribution vs OEM divergence. |
| **Stage 5** | **Their need** | 69 | 69.0% | 14 | 20.3% | — | Prospect stated "Everything is fine / no problems". |
| **Stage 6** | **Objection** | 55 | 55.0% | 7 | 12.7% | — | Unresolved objection (existing global consultant, no budget). |
| **Stage 7** | **Next step** | 48 | 48.0% | 7 | 14.6% | — | Refusal of report or meeting proposal. |
| **Stage 8** | **Close** | 41 | 41.0% | 0 | 0.0% | 41 (100.0%) | Full conversation conclusion reached (agreed action or polite exit). |

### Stage 8 Reconciliation Summary:
- **Reaching Stage 8:** Exactly **41 calls** (41.0% of total archive).
- **Completed Closes:** Exactly **41 calls** (100.0% of calls reaching Stage 8; 41.0% of total archive).
- **Dropped Off Before Stage 8:** Exactly **59 calls** (59.0% of total archive: 2 in S1, 7 in S2, 4 in S3, 18 in S4, 14 in S5, 7 in S6, 7 in S7).
- **Dropped at Stage 8:** Exactly **0 calls** (0.0%). Completed calls conclude the sales conversation and are strictly distinguished from dropped calls.

### Call Termination Patterns (Across All 100 Calls):
- **Mutual Polite Conclusions (52 calls, 52.0%):** Mutual *"Thank you for your time"*, confirming email/WhatsApp dispatch or callback time (including all 41 Stage 8 completions and 11 polite earlier terminal exits).
- **Prospect Terminations (34 calls, 34.0%):** Prospect disconnected line, stated *"I'm hanging up"*, or terminated abruptly after voicing resistance.
- **Interrupted / Dropped Lines (14 calls, 14.0%):** Line silence or mid-sentence carrier drops.

---

## 3. What Prospects Actually Say at Stages 2, 3, and 6

### Classification Methodology & Category Overlap:
All prospect turns following the caller's stage prompts were systematically analyzed across the 100 transcripts using keyword indexing cross-validated with turn-by-turn conversational reading.
**Non-Mutually Exclusive Categories:** Prospect response categories are **not mutually exclusive** and can overlap within a single conversational exchange. For instance, in Stage 3, a prospect may cite driving while simultaneously asking the caller to redirect to WhatsApp or email (e.g., `T087`). In Stage 6, a prospect may cite both an existing vendor relationship and an organizational lack of decision-making authority.

### Stage 2 — Purpose Reactions:
- **Primary Denominator:** 98 calls reaching at least Stage 2 (2 calls dropped at Stage 1 due to wrong contact/immediate hangup).
- **Query Sub-Denominator:** Exactly 9 calls where prospects voiced an active question or inquiry in response to the caller's purpose statement (7 scope inquiries + 2 contact sourcing queries).
- **Observed Categories & Unambiguous Denominators:**
  1. **Direct / Passive Listening Consent:** 51 calls (51/98 = 52.0% of Stage 2 calls) — Prospect acknowledged and permitted the caller to proceed (*"Tell me, please"*, *"Go ahead"*, *"Yes, tell me"*).
  2. **Scope Inquiry:** Exactly 7 calls (`T056`, `T060`, `T071`, `T078`, `T088`, `T094`, `T099`):
     - **Percentage of Stage 2 calls:** 7 / 98 = **7.1%** (Denominator = 98 calls reaching Stage 2).
     - **Percentage of voiced Stage 2 inquiries:** 7 / 9 = **77.8%** (Denominator = 9 calls voicing active inquiries).
     - Verbatim examples: `T056` (*"Sure. What is this regarding?"*), `T060` (*"What is this regarding? Tell me now."*), `T071` (*"What kind of scope of work are you looking at?"*), `T078` (*"What is this about? I'm sorry."*), `T088` (*"I mean, what is this about?"*), `T094` (*"Which company?"*), `T099` (*"You are speaking from which company?"*).
  3. **Contact Sourcing Skepticism:** Exactly 2 calls (`T081`, `T084`):
     - **Percentage of Stage 2 calls:** 2 / 98 = **2.0%** (Denominator = 98 calls reaching Stage 2).
     - **Percentage of voiced Stage 2 inquiries:** 2 / 9 = **22.2%** (Denominator = 9 calls voicing active inquiries).
     - Verbatim examples: `T081` (*"How did you get my number? I mean, from where did you get the connection?"*), `T084` (*"Okay, and where did you get my number from?"*).
  4. **Immediate Drop / Disconnect:** 7 calls (7/98 = 7.1% of Stage 2 calls) dropped immediately upon hearing the purpose without further dialogue.
  5. **Direct Transition / Dialogue Continuation:** 31 calls (31/98 = 31.6% of Stage 2 calls) where callers transitioned smoothly into Stage 3 permission or business exploration without the prospect asking an explicit question or issuing a formal listening acknowledgment.
  6. **Category Overlap:** Categories are non-mutually exclusive. In Stage 2, opening prospect turns were brief; 0 calls exhibited simultaneous scope and sourcing queries in the initial turn.

### Stage 3 — Permission Responses:
- **Denominator:** 91 calls reaching at least Stage 3 (7 calls dropped at Stage 2).
- **Observed Categories (Can overlap):**
  1. **Direct Verbal Permission:** 32 calls (35.2% of Stage 3 calls) — Prospect granted immediate permission to continue (*"Yes, tell me"*, *"Okay, tell me"*).
  2. **Physical Friction & Environmental Context:** 7 calls (7.7% of Stage 3 calls) — Prospect cited physical constraints (*"I am driving right now"*, *"Heading into a meeting"*, *"Traveling"*).
  3. **Channel Redirection:** 10 calls (11.0% of Stage 3 calls) — Prospect requested alternative media (*"Send it on WhatsApp first"*, *"Share it over email, I will check"*).
  4. **Strict Time Boundaries:** 4 calls (4.4% of Stage 3 calls) — Prospect imposed explicit limits (*"I have two minutes, tell me quickly"*, *"How much time will this take?"*).
  5. **Immediate Drop / Refusal:** 4 calls (4.4% of Stage 3 calls) terminated at Stage 3 (*"Not interested in listening"*, call drop).
  6. **Category Overlap:** Overlap occurred in 2 calls where environmental friction was combined with time boundaries or channel redirection (e.g., `T087`: driving context combined with *"How much time will you take?"*).

### Stage 6 — Objections Voiced:
- **Denominator:** 55 calls reaching at least Stage 6; 16 calls voiced explicit objections during exploration (the remaining 39 progressed directly toward next steps or had polite closures).
- **Observed Categories (Can overlap across 16 explicit objections):**
  1. **Authority & Decision-Maker Mismatch:** 10 calls (62.5% of explicit objections; 18.2% of all 55 Stage 6 calls) — Prospect stated they were not responsible for consulting or corporate strategy (*"I am not at that decision making level"*, *"Company level profit is not my KRA"*, *"Talk to the purchase manager"*).
  2. **Budget & Commercial Constraints:** 5 calls (31.2% of explicit objections; 9.1% of Stage 6 calls) — Prospect cited financial limitations or lack of advisory spend (*"We don't have budget for external advisory right now"*).
  3. **Existing Vendor / In-House Solution:** 2 calls (12.5% of explicit objections; 3.6% of Stage 6 calls) — Existing corporate arrangements cited (*"Because we are an MNC, we already have consultants at a global level"*, *"We have an in-house team"*).
  4. **Information Brush-Off / Not Seeking Partners:** 1 call (6.2% of explicit objections; 1.8% of Stage 6 calls) — Non-committal brush-off (*"Just send me an email. At this point we are not looking for new partners"*).
  5. **Category Overlap:** Multiple objections occurred in calls where authority limitations were paired with existing provider agreements.

---

## 4. Stage 5 Need Capture: Verbatim vs Paraphrase

### Methodological Definitions:
To eliminate ambiguity, research classifications in Stage 5 adhere to the following definitions:
- **Elicited Need:** A concrete operational bottleneck, capacity constraint, business goal, or structural challenge articulated by the prospect during exploration (e.g., plant running at 60% capacity, lack of skilled technical manpower, export licensing bottlenecks).
- **Verbatim Echo:** The caller explicitly mirrors the prospect's exact terminology or noun phrase in their immediate subsequent conversational turn.
- **Paraphrase:** The caller translates, summarizes, or replaces the prospect's vocabulary with generic consulting jargon or predefined pitch templates (e.g., replacing *"our plant is operating at 60% capacity"* with *"we help with operational efficiency"*).
- **Documented Prospect Quote:** The exact transcription of the prospect's stated words recorded in CRM fields or caller notes, distinct from oral dialogue.
- **Positive Next Step (Concrete Agreed Action):** An explicit, mutually agreed commitment evidenced in conversational dialogue:
  1. Specific scheduled discovery session or founder meeting (`next_step_agreed`).
  2. Mutually confirmed dispatch and agreed review of a specific profile, demo, or report via WhatsApp/email (`agreed_to_receive_report`).
  3. Mutually agreed date and time window for a callback (`follow_up`).
  *Critical Requirement:* A general or ambiguous `interested` classification does **not** count as a positive next step unless a concrete agreed action (e.g. agreed callback window, confirmed report review) is explicitly evidenced in the transcript dialogue. Vague brush-offs (*"I'll think about it"*), unconfirmed deck sends, or refusals do not qualify.

### Re-evaluation of Stage 5 Echoing & the "Doubling" Claim:
In the calls containing business challenge or need discussions (Stage 5):
- **Prospects Stating Explicit Operational Constraints:** Exactly 11 transcripts articulated concrete bottlenecks or goals (e.g., `T089`: *"The biggest challenge is manpower requirement. Skilled technical manpower."*; `T090`: *"Where should we hire from, what other markets should we look at."*).
- **The Verbatim Echo Inspection:**
  - String-level turn analysis reveals that only **1 call (`T089`)** exhibited an immediate verbatim echo by the caller (*"skilled manpower"* echoed in the subsequent turn).
  - The historical claim of *"6 of 49 calls"* was based on loose topical acknowledgment rather than strict verbatim repetition.

### Scientific Rebuttal of the "Doubled Progression" Claim:
- **Comparison Group Denominators:**
  - **Echoed Group ($N = 1$):** `T089` (Outcome: `follow_up`, agreed callback scheduled; 1/1 = 100.0% concrete agreed next step).
  - **Non-Echoed Group ($N = 10$):** 10 calls where prospects articulated explicit needs without immediate caller verbatim mirroring (`T043`, `T058`, `T081`, `T090`, `T095`, `T097`, `T098`, `T099`, and two related exploration calls):
    - *Under Strict Outcome Classification:* 3 `agreed_to_receive_report` (`T058`, `T099`, etc.), 2 `next_step_agreed` (`T095`, etc.), 1 `follow_up` (`T098`), 2 `interested` (`T081`, `T090`), 2 `not_interested` (`T043`, `T097`).
    - *Under Evidenced Agreed Action Rule:* In `T090`, the prospect agreed to receive and review a sector demo by tomorrow (*"if you have something as a demo for me, I would like to review it... I'll wait for the report"*), evidencing a concrete next step. In `T081`, the prospect accepted a callback in 2-3 days (*"Should I reach out to you after two or three days?"* -> *"Yeah, sure"*). Excluding ambiguous interest and counting only evidenced agreed actions yields 6 to 8 of 10 positive actions (60.0% to 80.0%).
- **Findings & Retraction:**
  - The sample size of the echoed group ($N = 1$) is statistically trivial and cannot support any claim that mirroring *"doubled conversion or progression"*.
  - Even comparing 100% (1/1) to 60–80% (6–8/10), the ratio is 1.25× to 1.67×, never 2.0×. More fundamentally, claiming causality from an observational dataset of 100 transcripts without a randomized controlled baseline is methodologically invalid.
  - The causal "doubling" claim remains **fully retracted**.
- **Product Grounding:** RouteLab provides a prominent verbatim note-taking field as an active-listening cognitive aid and CRM documentation hygiene tool to capture the prospect's vocabulary, **not** based on an unverified causal conversion claim.

---

## 5. Outcome Discrepancies & Taxonomy Integrity

### Reconciled Archive Discrepancies (Exactly 14 Total):
A rigorous cross-check between `index.csv` records and conversational dialogue identified **exactly 14 demonstrable discrepancies** across the 100 transcripts:

1. **The 13 `not_logged` Abandonment Cases:**
   - Exactly 13 calls in `index.csv` were marked `not_logged` despite reaching definite terminal conversational resolutions:
     - `T002`: Prospect requested a specific callback time -> Conversationally `follow_up`.
     - `T005`: Mutual discussion concluded with agreed report dispatch -> Conversationally `agreed_to_receive_report`.
     - `T019`: Prospect agreed to receive report on WhatsApp -> Conversationally `agreed_to_receive_report`.
     - `T023`: Call concluded with requested callback -> Conversationally `follow_up`.
     - `T036`: Specific follow-up day established -> Conversationally `follow_up`.
     - `T042`: Call dropped mid-sentence -> Conversationally `call_again`.
     - `T045`: Mutual closure with callback -> Conversationally `follow_up`.
     - `T046`: Prospect requested report via WhatsApp -> Conversationally `agreed_to_receive_report`.
     - `T050`: Disconnected during discussion -> Conversationally `call_again`.
     - `T052`: Terminal refusal -> Conversationally `not_interested`.
     - `T056`: Disconnected following scope query -> Conversationally `call_again`.
     - `T082`: Line dropped mid-dialogue -> Conversationally `call_again`.
     - `T094`: Concluded with agreed follow-up -> Conversationally `follow_up`.
   - **Data Quality Status:** `not_logged` represents a historical CRM logging failure, **not** a legitimate prospect outcome.

2. **The 1 Qualitative Mismatch (`T087`):**
   - In `index.csv`, `T087` was recorded as `follow_up`. However, the prospect explicitly voiced: *"I am not at that decision making level. I don't know where you got my number from, but I am not the decision maker in all these things. Company level profit is not my KRA."*
   - Per Rule 2 of the Research Methodology (`docs/research-methodology.md`), an explicit denial of decision-making authority and KRA mismatch classifies conversationally as `wrong_person` / role mismatch, even if the caller captured an email to end the call. The logged CRM outcome `follow_up` directly contradicts the conversational reality.
   - **Status of `T088`:** In `index.csv`, `T088` was recorded as `not_interested`. The prospect repeatedly cited corporate MNC global contracts and stated that local advisory would not be approved (*"not us, because of the way we are set up"*). The prospect's perfunctory *"Sure, sure, sure. Yeah, sure"* to a company deck was an exit brush-off to terminate the call. Per Rule 1 of the Research Methodology, agreeing to written material solely to exit an uncomfortable pitch after expressing resistance is classified as an objection brush-off / refusal. Thus, the recorded outcome `not_interested` accurately reflects conversational reality under the stated methodology, and `T088` is **not** an outcome discrepancy.
   - **Total Discrepancies:** Exactly **14** ($13 \text{ unlogged} + 1 \text{ qualitative mismatch } [\text{T087}] = 14$).

### Outcome Taxonomy Reconciliation:
To ensure data integrity, RouteLab enforces a strict separation:
- **Source Archive Classifications (10 Categories):** Includes historical `not_logged` as a data-quality tracking label.
- **Operational Active Call Outcomes (9 Selectable Categories):** `not_logged` is strictly excluded from UI buttons and rejected by backend Pydantic validation (HTTP 422). New calls cannot be marked closed without selecting a genuine operational outcome (`next_step_agreed`, `agreed_to_receive_report`, `interested`, `follow_up`, `call_again`, `wrong_person`, `moved_company`, `not_interested`, `do_not_call`).

---

## 6. Cumulative Stage Reach & Drop-Off Verification

Cumulative progression counts across the 100 transcripts were revalidated against `index.csv` and transcript turn indicators:
- **Stage 1 (Opening):** 100 reached (100.0%), 2 dropped (2.0%).
- **Stage 2 (Purpose):** 98 reached (98.0%), 7 dropped (7.1%).
- **Stage 3 (Permission):** 91 reached (91.0%), 4 dropped (4.4%).
- **Stage 4 (Their Business):** 87 reached (87.0%), 18 dropped (20.7%).
- **Stage 5 (Their Need):** 69 reached (69.0%), 14 dropped (20.3%).
- **Stage 6 (Objection):** 55 reached (55.0%), 7 dropped (12.7%).
- **Stage 7 (Next Step):** 48 reached (48.0%), 7 dropped (14.6%).
- **Stage 8 (Close):** 41 reached (41.0%), 0 dropped (0.0%), 41 reached completed close (100.0% of Stage 8 calls).
- **Dropped Off Before Stage 8:** Exactly 59 calls (59.0% of all calls: $2 + 7 + 4 + 18 + 14 + 7 + 7 = 59$).
All cumulative reach figures are fully supported by the archive data.

---

## 7. Limitations & Privacy Safeguards
1. **Audio Tone & Prosody:** Text transcripts lack acoustic cues (inflection, hesitation, pacing).
2. **Observational Nature:** Correlational patterns cannot establish causality.
3. **Privacy Compliance:** In accordance with repository rules, no raw audio or transcript files (`T001.txt`-`T100.txt`) are committed to version control; only statistical aggregates and synthetic scenarios are documented.
