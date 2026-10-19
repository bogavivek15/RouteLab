import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle, Quote, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../api';
import { STAGES } from '../data/stages';

export default function CallSummaryModal({
  callId,
  isOpen,
  onClose,
  initialSummary
}) {
  const [call, setCall] = useState(null);
  const [summaryData, setSummaryData] = useState(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && callId) {
      loadCallDetails();
    }
  }, [isOpen, callId]);

  const loadCallDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCall(callId);
      setCall(data);
      if (data.summary && !summaryData) {
        setSummaryData({
          call_id: callId,
          source: 'saved_record',
          summary: data.summary
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load call details');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setSummarizing(true);
    setError(null);
    try {
      const res = await api.summarizeCall(callId);
      setSummaryData(res);
      // Refresh call record to reflect updated summary in DB
      const updated = await api.getCall(callId);
      setCall(updated);
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setSummarizing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">Post-Call AI Summary & Inspection</h2>
                {summaryData && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    summaryData.source === 'llm'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {summaryData.source === 'llm' ? 'Gemini 2.0' : 'Evidence Summary'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {call?.prospect_name || 'Prospect'} • {call?.prospect_company || 'Cold Call'} • Furthest Stage: {call?.furthest_stage || 1} of 8
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading call details...
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Summary Block */}
              {summaryData ? (
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Call Overview
                    </h3>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {summaryData.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* Stated Needs */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block mb-1">
                        Stated Need (Prospect's Words)
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 italic">
                        "{summaryData.stated_needs || 'No specific need recorded'}"
                      </p>
                    </div>

                    {/* Objections */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                        Objection Voiced
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800">
                        {summaryData.objections || 'No objections recorded'}
                      </p>
                    </div>

                    {/* Agreed Next Step */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                        Agreed Next Step
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-semibold">
                        {summaryData.agreed_next_step || 'No next step confirmed'}
                      </p>
                    </div>

                    {/* Follow-up Action */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                        Recommended Action
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800">
                        {summaryData.follow_up_actions || 'Review call notes prior to next outreach.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3">
                  <Sparkles className="w-8 h-8 mx-auto text-brand-500" />
                  <h3 className="font-bold text-slate-900 text-sm">Post-Call AI Summary</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Generate a structured synthesis of the prospect's needs, objections, and agreed next steps using server-side Gemini.
                  </p>
                  <button
                    id="generate-summary-btn"
                    onClick={handleGenerateSummary}
                    disabled={summarizing}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all inline-flex items-center space-x-1.5"
                  >
                    {summarizing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing Call Notes...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate AI Summary</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Recorded Stage Results Breakdown */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recorded Stage Notes ({call?.stage_results?.length || 0} stages recorded)
                </h3>
                {call?.stage_results?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No stage notes recorded for this call.</p>
                ) : (
                  call?.stage_results?.map((res) => {
                    const st = STAGES.find(s => s.id === res.stage_number);
                    return (
                      <div
                        key={res.stage_number}
                        className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            Stage {res.stage_number}: {st?.name || 'Stage'}
                          </span>
                          {res.outcome && (
                            <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                              {res.outcome}
                            </span>
                          )}
                        </div>

                        {res.prospect_words && (
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start space-x-1.5">
                            <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-slate-800 italic">"{res.prospect_words}"</p>
                          </div>
                        )}

                        {res.notes && (
                          <p className="text-slate-500">
                            <span className="font-semibold text-slate-600">Notes:</span> {res.notes}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Final Status: <span className="font-semibold text-slate-800">{call?.status || 'In Progress'}</span> • Final Outcome: <span className="font-semibold text-slate-800">{call?.final_outcome || 'N/A'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
