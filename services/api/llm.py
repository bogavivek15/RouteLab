import json
from typing import Any, Dict
from services.api.config import settings

def generate_fallback_summary(call: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministic fallback when LLM API is unavailable, unconfigured, or timed out.
    Clearly labeled as fallback, adhering strictly to recorded stage results.
    """
    stage_results = call.get("stage_results", [])
    stages_by_num = {s["stage_number"]: s for s in stage_results}

    # Extract observed data directly from stages
    prospect_name = call.get("prospect_name") or "The prospect"
    company = call.get("prospect_company") or "their company"
    final_outcome = call.get("final_outcome") or "In Progress"

    # Needs (Stage 5)
    s5 = stages_by_num.get(5, {})
    stated_needs = s5.get("prospect_words") or s5.get("notes") or "No specific need recorded during the call."

    # Objections (Stage 6)
    s6 = stages_by_num.get(6, {})
    objections = s6.get("outcome") or s6.get("prospect_words") or s6.get("notes") or "No objections recorded."

    # Next step (Stage 7)
    s7 = stages_by_num.get(7, {})
    agreed_next_step = s7.get("outcome") or s7.get("notes") or s7.get("prospect_words") or "No next step confirmed."

    furthest = call.get("furthest_stage", 1)
    summary_text = (
        f"[Deterministic Fallback] Call with {prospect_name} at {company} reached Stage {furthest} of 8. "
        f"Final logged outcome: {final_outcome}. "
    )
    if s5.get("prospect_words"):
        summary_text += f"Prospect stated: '{s5['prospect_words']}'. "

    return {
        "call_id": call["id"],
        "source": "fallback",
        "summary": summary_text,
        "stated_needs": stated_needs,
        "objections": objections,
        "agreed_next_step": agreed_next_step,
        "follow_up_actions": f"Review stage notes prior to next contact. Final outcome logged: {final_outcome}."
    }


async def generate_call_summary(call: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates a post-call summary using Google Gemini API if configured.
    Falls back gracefully to deterministic analysis on any error, timeout, or missing key.
    """
    if not settings.LLM_API_KEY:
        return generate_fallback_summary(call)

    # Prepare sanitized context for LLM
    stages_summary = []
    for s in call.get("stage_results", []):
        stages_summary.append(
            f"Stage {s['stage_number']}: Outcome: '{s.get('outcome') or 'N/A'}', "
            f"Prospect's words: '{s.get('prospect_words') or 'N/A'}', Notes: '{s.get('notes') or 'N/A'}'"
        )

    context_str = "\n".join(stages_summary)
    prompt = f"""
You are an objective sales analyst assisting a cold caller.
Analyze this cold call record and provide a concise, factual summary.
CRITICAL RULES:
- Never fabricate prospect statements or assume agreements not recorded.
- Rely ONLY on the prospect's actual words and caller notes provided below.
- Keep the summary to 2-3 clear sentences.

CALL RECORD:
Prospect Name: {call.get('prospect_name') or 'Unknown'}
Company: {call.get('prospect_company') or 'Unknown'}
Furthest Stage Reached: {call.get('furthest_stage', 1)} of 8
Final Outcome: {call.get('final_outcome') or 'In Progress'}

STAGE NOTES:
{context_str}

Respond in strict JSON with these exact keys:
{{
  "summary": "2-3 sentence factual overview of what transpired",
  "stated_needs": "Specific goals or problems stated by prospect, or 'None stated'",
  "objections": "Direct objections or hesitations voiced, or 'None recorded'",
  "agreed_next_step": "Specific agreed follow-up (document, time, meeting), or 'None agreed'",
  "follow_up_actions": "Recommended immediate caller action"
}}
"""

    def _call_gemini_sync() -> Dict[str, Any]:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.LLM_API_KEY)
        response = client.models.generate_content(
            model=settings.LLM_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )

        text = (response.text or "").strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        parsed = json.loads(text)
        return {
            "call_id": call["id"],
            "source": "llm",
            "summary": parsed.get("summary", ""),
            "stated_needs": parsed.get("stated_needs"),
            "objections": parsed.get("objections"),
            "agreed_next_step": parsed.get("agreed_next_step"),
            "follow_up_actions": parsed.get("follow_up_actions")
        }

    try:
        import asyncio
        return await asyncio.wait_for(asyncio.to_thread(_call_gemini_sync), timeout=6.0)
    except Exception as e:
        print(f"LLM generation failed ({type(e).__name__}: {e}). Falling back to deterministic summary.")
        fallback = generate_fallback_summary(call)
        fallback["source"] = f"fallback (provider error: {type(e).__name__})"
        return fallback
