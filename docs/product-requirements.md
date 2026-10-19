# CallFlow — Product Requirements

## Source: Official Structure (Reading 1 of 3)
URL: https://sainikpuri.deepthought.education/fde-hyderabad-v2/structure

## The Eight Official Stages

| # | Stage Name | Purpose |
|---|---|---|
| 1 | **Opening** | Reach the right person and say who you are. The prospect decides in the first ten seconds whether this call is worth a minute. |
| 2 | **Purpose** | Say in one or two sentences why you called, in words the prospect can repeat to a colleague. A purpose they cannot repeat is a purpose they did not hear. |
| 3 | **Permission** | Find out whether they are willing to talk now. A clear yes, a clear no, or a time to call back are all good outcomes. Talking on without one is not. |
| 4 | **Their business** | Ask about their company and their work before saying anything about yours. People talk about what they do; they rarely listen to what you do. |
| 5 | **Their need, in their words** | Hear what they are trying to do or struggling with, in their own words. This is the one stage where the caller writes down exactly what was said. |
| 6 | **Objection** | Hear the reason for a no and understand it. A reason you understand can be answered on this call or the next; a reason you talked over cannot. |
| 7 | **Next step** | Agree one concrete thing: a document on WhatsApp or email, a call at a named time, a meeting. One thing, named, with a time or a channel. |
| 8 | **Close** | End the call clearly and record what happened: the outcome, the next step, and the prospect's words from stage 5. The record is what the next call is built on. |

## Per-Stage "What Tends to Happen" (from official source)

### Stage 1 — Opening
- A switchboard or an assistant answers and asks what it is about
- The person answers but is somewhere else: driving, in a meeting, at lunch
- The number belongs to somebody who left the company a year ago

### Stage 2 — Purpose
- They ask what the company does, often twice, because the first answer was a label
- They ask where you got their number
- They guess it is a sales call and say so

### Stage 3 — Permission
- Call me after two, call me tomorrow, send it on WhatsApp first
- A short yes, and then they go quiet and wait
- They keep talking without answering, which is not a yes

### Stage 4 — Their business
- They answer in one line and wait for the pitch
- They correct you: they do not make that, they are not that size, that is a different division
- They ask you to tell them about yourself first

### Stage 5 — Their need, in their words
- They name a goal: a new market, a new product line, a plant running below capacity
- They say everything is fine and there is nothing they need
- They turn it around and ask what you can do for a company like theirs

### Stage 6 — Objection
- We already have an agency, a consultant, an in-house team
- Not the right person; speak to marketing, speak to the owner
- Send something in writing and we will see

### Stage 7 — Next step
- A yes to receiving a document, which may be politeness rather than interest
- A time named by them, which is worth more than a time proposed by you
- A referral to a colleague, with or without a number

### Stage 8 — Close
- The call ends mid-sentence, because the line dropped or they hung up
- A warm goodbye after a no, which is still a no
- The caller logs an outcome that does not match what was said on the call

## Reference Screen Design Elements (Reading 2 of 3)

The reference screen shows Stage 2 (Purpose) for a fictional company "ClinicBooks":

1. **Header bar**: Product name + call timer
2. **Prospect info**: Name, role, company, call type (first call)
3. **Stage progress bar**: Numbers 1-8, completed stages dark, current stage blue, future stages outlined
4. **Stage display**: "Stage 2 of 8" label, stage name "Purpose", one-line purpose description
5. **"She may say" section**: 3 example prospect responses with left blue border
6. **"What happened" section**: 4 tap buttons in 2×2 grid, one selected (blue)
7. **"Her words" section**: Single free-text box for the prospect's own words
8. **Navigation**: "Next: [stage name]" button (dark) + "End call" button (outlined)

### Call History Screen (also from reference)
- List of past calls showing: prospect name/company, brief note, stage reached (by name), timestamp
- Example entries showing various stages reached (Next step, Opening, Objection, Their need)

## Transcript Archive (Reading 3 of 3)

- 100 transcripts (T001–T100), all readable
- Fictional company: Meridian Growth Partners (Hyderabad)
- Callers: Priya, Divya, Meera, Sana, Arjun, Anjali, Rohit, Rachel, and others
- Prospects: owners, directors, CEOs of Indian companies across industries

### Outcome Distribution (from index.csv)
| Outcome | Count |
|---|---|
| agreed_to_receive_report | 14 |
| follow_up | 14 |
| not_interested | 14 |
| not_logged | 13 |
| next_step_agreed | 11 |
| do_not_call | 10 |
| wrong_person | 8 |
| interested | 7 |
| moved_company | 5 |
| call_again | 4 |

## Stage-Specific Outcome Choices (designed from official + transcript evidence)

### Stage 1 — Opening
- Reached the right person
- Gatekeeper / reception answered
- Person unavailable (busy, driving, meeting)
- Wrong number / person left company

### Stage 2 — Purpose
- Asked what we do
- Asked where we got the number
- Said it is a sales call
- Let me go on

### Stage 3 — Permission
- Gave permission to talk now
- Asked to call back later
- Asked to send info first (WhatsApp/email)
- Did not answer clearly

### Stage 4 — Their business
- Described their business
- Corrected my assumption
- Asked about us first
- Gave a one-line answer

### Stage 5 — Their need, in their words
- Named a specific goal or need
- Said everything is fine
- Asked what we can do for them
- Did not share a need

### Stage 6 — Objection
- Already have a provider/consultant
- Not the right person / redirected
- Asked for written information
- Not interested / no budget

### Stage 7 — Next step
- Agreed to receive a document
- Set a specific time for next call
- Referred to a colleague
- No commitment made

### Stage 8 — Close
- Call ended with agreed next step
- Warm goodbye, no next step
- Call dropped / hung up
- Need to follow up later
