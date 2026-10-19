# CallFlow — 6-to-8 Minute Video Demo Walkthrough Script

## Video Guidelines & Technical Setup
- **Target Duration:** 6 minutes 30 seconds to 8 minutes
- **Recording Requirements:** Screen share with visible webcam camera overlay in the corner.
- **Microphone:** Clear audio without background noise.
- **Google Drive Sharing:** Upload video to Google Drive, set access permission to **"Anyone with the link can view"**, and include the public link in the final submission.

---

## Timestamped Presentation Script

### 00:00 – 00:45 | 1. Introduction & The Cold-Call Problem
- **What to show on screen:** CallFlow Landing Page (`http://localhost:5173/` or production URL).
- **Spoken script:**
  > "Hello everyone. Today I'm presenting CallFlow — the live companion screen designed specifically for cold callers while actively speaking with prospects.
  > In a high-stakes cold call, callers have less than 10 seconds to establish trust. Juggling spreadsheets, CRMs, and dense scripts distracts the caller from actively listening.
  > CallFlow solves this by giving the caller a focused, glanceable HUD that tracks the call's exact stage, provides real-world objection guidance, captures the prospect's exact words with zero friction, and summarizes the call immediately after."

---

### 00:45 – 01:30 | 2. Evidence Grounding & 8-Stage Architecture
- **What to show on screen:** Point to the 8-stage progress stepper and brief intro pill.
- **Spoken script:**
  > "CallFlow is not built on guesswork. It is strictly grounded in the official eight-stage methodology and an empirical analysis of 100 cold-call transcripts from Meridian Growth Partners:
  > Stage 1 Opening, Stage 2 Purpose, Stage 3 Permission, Stage 4 Their business, Stage 5 Their need in their own words, Stage 6 Objection, Stage 7 Next step, and Stage 8 Close.
  > The user interface directly follows the official ClinicBooks reference screen: a live call timer, structured guidance, quick-tap outcomes, and a dedicated quotation box."

---

### 01:30 – 02:45 | 3. Starting a Call & Opening Stages (Stages 1–3)
- **What to show on screen:** Click "Start Cold Call". Enter "Dr. Arvind Rao", Company "Apex Diagnostics". Click "Open Call Screen".
- **Spoken script:**
  > "Let's simulate a live call. I click 'Start Cold Call' and enter Dr. Arvind Rao at Apex Diagnostics.
  > Immediately, the call screen opens and our live call timer starts in the top bar.
  > We begin at Stage 1: Opening. The purpose is crystal clear: reach the right person and say who you are within 10 seconds.
  > Under 'She may say', we see real prospect behaviors from our transcript analysis: gatekeeper interception, driving, or ex-employees.
  > The doctor answers. I tap 'Reached the right person'—notice the instant auto-save indicator in the bottom bar—and type his words: 'Yes, this is Dr. Rao speaking.'
  > I click 'Next: Purpose' to move to Stage 2. He asks what we do. I tap 'Asked what we do', enter his question, and advance to Stage 3 Permission, where he grants permission to talk."

---

### 02:45 – 04:15 | 4. The Critical Stage 5 & Non-Linear Navigation
- **What to show on screen:** Jump to Stage 5 using the progress stepper. Enter Stage 5 outcome and exact quotes. Then click back to Stage 2 to demonstrate state preservation.
- **Spoken script:**
  > "Cold calls rarely follow a rigid straight line. The doctor interrupts to explain his laboratory challenges.
  > Using CallFlow's 8-stage stepper, I jump straight to Stage 5: 'Their need, in their words'.
  > Stage 5 has an amber highlight because this is the single most important stage where callers must record exact quotes.
  > I select 'Named a specific goal or need' and capture Dr. Rao's verbatim quote: 'Our turnaround time is 48 hours and we lose patients to Apollo.'
  > Now watch this: I jump back to Stage 2 to review our purpose notes. Notice that all previously entered data, selected outcomes, and prospect words are completely preserved. And crucially, our backend maintains the furthest stage reached at Stage 5, ensuring call analytics never regress."

---

### 04:15 – 05:30 | 5. Wrapping Up the Call & AI Post-Call Summary
- **What to show on screen:** Click "End Call". Select "Agreed to receive report / info". Confirm. Show the AI Post-Call Summary modal.
- **Spoken script:**
  > "The prospect agrees to review our diagnostic workflow report on WhatsApp.
  > I click 'End Call'. The wrap-up modal allows me to select the final outcome from our 8 standardized transcript categories: 'Agreed to receive report / info'.
  > Upon confirming, the call is closed and CallFlow immediately launches our Post-Call AI Summary.
  > Powered by server-side Google Gemini with a robust deterministic fallback, it synthesizes the entire conversation into a clean executive summary:
  > - Overview of the conversation
  > - Stated Needs: accurately pulling Dr. Rao's 48-hour bottleneck quote
  > - Objections and Agreed Next Steps
  > - Recommended follow-up actions for the sales rep.
  > Notice that call saving and closing never block on the AI—if offline, CallFlow seamlessly provides an evidence-based deterministic fallback."

---

### 05:30 – 06:45 | 6. Call History & Inspection
- **What to show on screen:** Close summary modal. Click "Call History" in the navbar. Inspect Dr. Arvind Rao's record.
- **Spoken script:**
  > "Next, let's look at the Call History dashboard.
  > Every call is persistently saved with its timestamp, company name, furthest stage reached (here Stage 5), and final outcome.
  > Callers or sales managers can click 'Inspect' at any time to open the full call record, review every recorded stage note, or re-read the AI summary before making their scheduled callback."

---

### 06:45 – 07:45 | 7. Architecture, Security & Verification
- **What to show on screen:** Show terminal with running backend / pytest results and repository layout.
- **Spoken script:**
  > "Under the hood, CallFlow uses a clean, secure architecture:
  > - React 19 and Vite with Tailwind CSS for high responsiveness and low cognitive load.
  > - Python 3.11 with FastAPI for robust async REST endpoints.
  > - Supabase PostgreSQL with schema migrations committed in `supabase/schema.sql`.
  > - Strict security: zero secrets exposed in frontend code, gitignored `.env` files, and backend-only LLM credentials.
  > - We ran comprehensive testing across all seven testing categories: unit tests, integration tests, contract validation, resilience testing, and automated browser end-to-end verification. All 9 automated tests passed in under 3 seconds."

---

### 07:45 – 08:00 | 8. Conclusion
- **Spoken script:**
  > "CallFlow turns the chaos of cold calling into a structured, reliable process that helps callers listen better and close more next steps.
  > Thank you!"

---

## Exact Recording & Sharing Checklist for User
1. **Tool:** Use Loom, OBS, or Zoom to record screen + webcam overlay.
2. **Recording Time:** Ensure the recording runs between 6:00 and 8:00 minutes.
3. **Upload:** Upload the MP4/recording to Google Drive.
4. **Permissions:**
   - Right-click file in Google Drive -> **Share** -> **General Access** -> Select **"Anyone with the link"** (Role: Viewer).
5. **Copy Link:** Paste the link into the final submission document.
