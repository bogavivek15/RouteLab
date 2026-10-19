import React, { useState, useEffect } from 'react';
import {
  Sparkles, X, AlertCircle, Quote, Loader2,
  Target, ShieldAlert, ArrowRight, Clipboard, Check,
  TrendingUp, MessageCircle, Zap, Copy
} from 'lucide-react';
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
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (isOpen && callId) {
      setSummaryData(initialSummary || null);
      loadCallDetails();
    } else {
      setSummaryData(null);
      setCall(null);
    }
  }, [isOpen, callId, initialSummary]);

  const loadCallDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCall(callId);
      setCall(data);

      // Automatically fetch/generate the summary
      if (!initialSummary) {
        setSummarizing(true);
        try {
          const res = await api.summarizeCall(callId);
          setSummaryData(res);
        } catch (sumErr) {
          console.warn('Auto-summary failed, checking saved summary:', sumErr);
          if (data.summary) {
            setSummaryData({
              call_id: callId,
              source: 'saved_record',
              summary: data.summary
            });
          }
        } finally {
          setSummarizing(false);
        }
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
      const updated = await api.getCall(callId);
      setCall(updated);
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setSummarizing(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullSummary = () => {
    if (!summaryData || !call) return;
    const text = [
      `RouteLab Call Summary — ${call.prospect_name || 'Prospect'}`,
      `Company: ${call.prospect_company || 'N/A'}`,
      `Furthest Stage: ${call.furthest_stage}/8`,
      `Final Outcome: ${call.final_outcome || 'In Progress'}`,
      '',
      `Overview: ${summaryData.summary}`,
      '',
      `Stated Need: ${summaryData.stated_needs || 'None recorded'}`,
      `Objections: ${summaryData.objections || 'None recorded'}`,
      `Next Step: ${summaryData.agreed_next_step || 'None agreed'}`,
      `Recommended Action: ${summaryData.follow_up_actions || 'Review notes'}`,
      '',
      summaryData.call_score ? `Call Score: ${summaryData.call_score}/10` : '',
      summaryData.coaching_insight ? `Coaching: ${summaryData.coaching_insight}` : '',
      summaryData.follow_up_script ? `Follow-up Opener: ${summaryData.follow_up_script}` : '',
    ].filter(Boolean).join('\n');
    copyToClipboard(text, 'full');
  };

  if (!isOpen) return null;

  // Compute a call score based on available data
  const computeCallScore = () => {
    if (summaryData?.call_score) return summaryData.call_score;
    if (!call) return null;
    let score = 0;
    const fs = call.furthest_stage || 1;
    score += Math.min(fs * 1.0, 8);  // Max 8 pts for stages
    if (call.final_outcome && !['not_interested', 'do_not_call', 'wrong_person'].includes(call.final_outcome)) {
      score += 2;
    }
    return Math.min(Math.round(score), 10);
  };

  const callScore = computeCallScore();

  // Sentiment badge configuration
  const getSentiment = () => {
    if (summaryData?.prospect_sentiment) return summaryData.prospect_sentiment;
    if (!call) return 'neutral';
    const outcome = call.final_outcome || '';
    if (['agreed_to_receive_report', 'next_step_agreed', 'interested'].includes(outcome)) return 'positive';
    if (['not_interested', 'do_not_call'].includes(outcome)) return 'negative';
    return 'neutral';
  };

  const sentiment = getSentiment();
  const sentimentConfig = {
    positive: { label: 'Receptive', color: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: '😊' },
    neutral:  { label: 'Neutral',   color: 'text-cyan-300',    bg: 'bg-cyan-500/15',    border: 'border-cyan-500/30',    icon: '😐' },
    negative: { label: 'Guarded',   color: 'text-rose-300',    bg: 'bg-rose-500/15',    border: 'border-rose-500/30',    icon: '🛡️' },
  };
  const sentCfg = sentimentConfig[sentiment] || sentimentConfig.neutral;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md modal-overlay">
      <div className="bg-[#0c0d16]/95 border border-white/15 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl modal-content text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-glow-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white font-heading">AI Call Summary & Intelligence</h2>
                {summaryData && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    summaryData.source === 'llm'
                      ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                      : 'bg-white/10 text-slate-300 border border-white/10'
                  }`}>
                    {summaryData.source === 'llm' ? 'Gemini AI Debrief' : 'Evidence Summary'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {call?.prospect_name || 'Prospect'} · {call?.prospect_company || 'Cold Call'} · Stage {call?.furthest_stage || 1}/8
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-white/20 border-t-fuchsia-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading call intelligence...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Summary loading state */}
              {summarizing && !summaryData && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center space-y-3 shadow-inner">
                  <div className="w-10 h-10 mx-auto bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-sm">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Synthesizing Call Intelligence...</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Gemini AI is analyzing stage outcomes, prospect statements, and conversation flow to produce structured insights.
                  </p>
                  <div className="flex items-center justify-center space-x-1.5 pt-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>
              )}

              {/* Summary Block */}
              {summaryData ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Score + Sentiment Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Call Score */}
                    {callScore !== null && (
                      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
                        <div className="relative w-14 h-14 mx-auto mb-2">
                          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <circle
                              cx="28" cy="28" r="24" fill="none"
                              stroke="url(#scoreGradient)"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${callScore * 15.08} 150.8`}
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="50%" stopColor="#d946ef" />
                                <stop offset="100%" stopColor="#f59e0b" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
                            {callScore}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Call Score</span>
                      </div>
                    )}

                    {/* Sentiment */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                      <span className="text-2xl mb-1">{sentCfg.icon}</span>
                      <span className={`text-xs font-bold ${sentCfg.color} ${sentCfg.bg} ${sentCfg.border} border px-2.5 py-0.5 rounded-full`}>
                        {sentCfg.label}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1.5">Prospect Stance</span>
                    </div>

                    {/* Stage Reached */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black gradient-dialit mb-1">
                        {call?.furthest_stage || 1}/8
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stages Reached</span>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Executive Call Overview</span>
                      </h3>
                      <button
                        onClick={copyFullSummary}
                        className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        {copiedField === 'full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'full' ? 'Copied' : 'Copy All'}</span>
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-normal">
                      {summaryData.summary}
                    </p>
                  </div>

                  {/* 4 Insight Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Stated Needs */}
                    <InsightCard
                      icon={<Target className="w-3.5 h-3.5" />}
                      label="Stated Need / Goal"
                      accent="cyan"
                      value={summaryData.stated_needs || 'No specific need recorded'}
                      italic
                      onCopy={() => copyToClipboard(summaryData.stated_needs || '', 'needs')}
                      copied={copiedField === 'needs'}
                    />

                    {/* Objections */}
                    <InsightCard
                      icon={<ShieldAlert className="w-3.5 h-3.5" />}
                      label="Objection Voiced"
                      accent="amber"
                      value={summaryData.objections || 'No objections recorded'}
                      onCopy={() => copyToClipboard(summaryData.objections || '', 'objections')}
                      copied={copiedField === 'objections'}
                    />

                    {/* Agreed Next Step */}
                    <InsightCard
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      label="Agreed Next Step"
                      accent="emerald"
                      value={summaryData.agreed_next_step || 'No next step confirmed'}
                      bold
                      onCopy={() => copyToClipboard(summaryData.agreed_next_step || '', 'nextstep')}
                      copied={copiedField === 'nextstep'}
                    />

                    {/* Follow-up Action */}
                    <InsightCard
                      icon={<Zap className="w-3.5 h-3.5" />}
                      label="Recommended Action"
                      accent="fuchsia"
                      value={summaryData.follow_up_actions || 'Review call notes prior to next outreach.'}
                      onCopy={() => copyToClipboard(summaryData.follow_up_actions || '', 'action')}
                      copied={copiedField === 'action'}
                    />
                  </div>

                  {/* Coaching Insight (if available from LLM) */}
                  {summaryData.coaching_insight && (
                    <div className="bg-white/[0.03] border-l-4 border-fuchsia-500 border border-white/10 rounded-2xl p-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-fuchsia-300 mb-1.5 flex items-center space-x-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span>Caller Coaching Insight</span>
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed font-normal">{summaryData.coaching_insight}</p>
                    </div>
                  )}

                  {/* Follow-up Script (if available from LLM) */}
                  {summaryData.follow_up_script && (
                    <div className="bg-gradient-to-r from-amber-950/30 to-fuchsia-950/20 border border-amber-500/30 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Personalized Follow-up Opener</span>
                        </h3>
                        <button
                          onClick={() => copyToClipboard(summaryData.follow_up_script, 'script')}
                          className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          {copiedField === 'script' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'script' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-sm text-amber-100 italic leading-relaxed">
                        "{summaryData.follow_up_script}"
                      </p>
                    </div>
                  )}
                </div>
              ) : !summarizing ? (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-sm">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm font-heading">Generate AI Call Debrief</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Synthesize stated needs, objections, and agreed next steps with coaching insights and a tailored follow-up script.
                  </p>
                  <button
                    id="generate-summary-btn"
                    onClick={handleGenerateSummary}
                    disabled={summarizing}
                    className="btn-glow px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-glow-sm hover:shadow-glow transition-all active:scale-[0.97] inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Run AI Debrief</span>
                  </button>
                </div>
              ) : null}

              {/* Recorded Stage Results Breakdown */}
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recorded Stage Milestones ({call?.stage_results?.length || 0})
                </h3>
                {call?.stage_results?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No stage notes recorded for this call.</p>
                ) : (
                  call?.stage_results?.map((res) => {
                    const st = STAGES.find(s => s.id === res.stage_number);
                    return (
                      <div
                        key={res.stage_number}
                        className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-md bg-gradient-brand text-white flex items-center justify-center text-[10px] font-bold shadow-glow-sm">
                              {res.stage_number}
                            </span>
                            <span>{st?.name || 'Stage'}</span>
                          </span>
                          {res.outcome && (
                            <span className="font-semibold text-fuchsia-300 bg-fuchsia-500/10 px-2.5 py-0.5 rounded-full border border-fuchsia-500/20 text-[11px]">
                              {res.outcome}
                            </span>
                          )}
                        </div>

                        {res.prospect_words && (
                          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 flex items-start space-x-2">
                            <Quote className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <p className="text-slate-200 italic">"{res.prospect_words}"</p>
                          </div>
                        )}

                        {res.notes && (
                          <p className="text-slate-400">
                            <span className="font-semibold text-slate-300">Notes:</span> {res.notes}
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
        <div className="p-4 border-t border-white/10 bg-black/40 rounded-b-2xl flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Status: <span className="font-semibold text-white">{call?.status === 'completed' ? 'Completed' : 'In Progress'}</span>
            {call?.final_outcome && (
              <> · Outcome: <span className="font-semibold text-white">{call.final_outcome.replace(/_/g, ' ')}</span></>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-white/10 border border-white/15 hover:bg-white/20 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Insight Card sub-component with dark theme
function InsightCard({ icon, label, accent, value, italic, bold, onCopy, copied }) {
  const accentMap = {
    cyan:    { border: 'border-l-cyan-400',    label: 'text-cyan-300',    icon: 'text-cyan-400' },
    amber:   { border: 'border-l-amber-400',   label: 'text-amber-300',   icon: 'text-amber-400' },
    emerald: { border: 'border-l-emerald-400', label: 'text-emerald-300', icon: 'text-emerald-400' },
    fuchsia: { border: 'border-l-fuchsia-400', label: 'text-fuchsia-300', icon: 'text-fuchsia-400' },
  };
  const ac = accentMap[accent] || accentMap.cyan;

  return (
    <div className={`bg-white/[0.03] border border-white/10 rounded-xl p-4 border-l-4 ${ac.border} group transition-all duration-200 hover:border-white/20`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${ac.label} flex items-center space-x-1.5`}>
          <span className={ac.icon}>{icon}</span>
          <span>{label}</span>
        </span>
        <button
          onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Copy"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <p className={`text-xs sm:text-sm text-slate-200 leading-relaxed ${italic ? 'italic text-slate-300' : ''} ${bold ? 'font-semibold text-white' : ''}`}>
        {italic ? `"${value}"` : value}
      </p>
    </div>
  );
}
