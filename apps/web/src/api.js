/**
 * Unified API Client for CallFlow Frontend
 * Communicates with the CallFlow backend API.
 */

const API_BASE_URL =
  import.meta.env.VITE_ROUTELAB_API_BASE_URL ||
  import.meta.env.VITE_CALLFLOW_API_BASE_URL ||
  "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMsg = `Server error: ${res.status}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.detail || errorMsg;
      } catch {
        // Fallback to HTTP status error text if response is not JSON
      }
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on [${options.method || "GET"} ${url}]:`, err);
    throw err;
  }
}

export const api = {
  // Health check
  getHealth: () => request("/health"),

  // Start new call
  startCall: ({ prospect_name, prospect_company } = {}) =>
    request("/calls", {
      method: "POST",
      body: JSON.stringify({
        prospect_name: prospect_name || null,
        prospect_company: prospect_company || null
      })
    }),

  // List all calls
  listCalls: () => request("/calls"),

  // Get single call with its stage results
  getCall: (callId) => request(`/calls/${callId}`),

  // Save or update stage result (1-8)
  updateStageResult: (callId, stageNumber, { outcome, prospect_words, notes }) =>
    request(`/calls/${callId}/stages/${stageNumber}`, {
      method: "PUT",
      body: JSON.stringify({
        outcome: outcome || null,
        prospect_words: prospect_words || null,
        notes: notes || null
      })
    }),

  // Close call with final outcome
  closeCall: (callId, final_outcome) =>
    request(`/calls/${callId}/close`, {
      method: "POST",
      body: JSON.stringify({ final_outcome })
    }),

  // Generate or retrieve post-call summary (LLM or deterministic fallback)
  summarizeCall: (callId) =>
    request(`/calls/${callId}/summarize`, {
      method: "POST"
    })
};
