import React, { useState } from 'react';
import { Quote, MessageSquare, Check, HelpCircle, Lightbulb, AlertTriangle, ChevronDown } from 'lucide-react';

export default function StageCard({
  stage,
  stageResult,
  onOutcomeChange,
  onProspectWordsChange,
  onNotesChange,
  prospectName,
  prospectCompany
}) {
  const currentOutcome = stageResult?.outcome || '';
  const prospectWords = stageResult?.prospect_words || '';
  const notes = stageResult?.notes || '';
  const [showGuidance, setShowGuidance] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-fade-in text-slate-100">
      {/* Prospect & Stage Banner */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-card border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10 gap-2">
          <div>
            <span className="inline-flex items-center text-[11px] font-bold tracking-wider text-fuchsia-400 uppercase bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-0.5 rounded-full">
              Stage {stage.id} of 8 · Guided Step
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 font-heading">
              {stage.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 bg-white/[0.04] px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-auto">
            <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-glow-sm">
              {(prospectName || 'P').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-white block truncate">{prospectName || 'Prospect'}</span>
              <span className="text-[11px] text-slate-400 block truncate">{prospectCompany || 'Cold Call'}</span>
            </div>
          </div>
        </div>

        {/* Stage Purpose Statement */}
        <div className="mt-4 flex items-start space-x-3 bg-white/[0.03] rounded-xl p-3.5 border border-white/10">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            {stage.purpose}
          </p>
        </div>
      </div>

      {/* "She may say" Guidance Section — Collapsible */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-card border border-white/10">
        <button
          type="button"
          onClick={() => setShowGuidance(!showGuidance)}
          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.03] transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center shadow-glow-sm">
              <Quote className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              She may say / What tends to happen
            </h2>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showGuidance ? 'rotate-180' : ''}`}
          />
        </button>
        
        {showGuidance && (
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stage.sheMaySay.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.03] p-3.5 rounded-xl border border-white/5 flex items-start space-x-2.5 hover:border-white/15 hover:bg-white/[0.05] transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-snug">
                    "{item}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* "What happened" 4-Tap Outcome Grid */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-card border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            What happened
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Single tap to log outcome</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {stage.outcomes.map((outcome, idx) => {
            const isSelected = currentOutcome === outcome;
            return (
              <button
                key={idx}
                id={`outcome-btn-${idx}`}
                type="button"
                onClick={() => onOutcomeChange(outcome)}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 text-left font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? 'border-fuchsia-500 bg-gradient-to-r from-fuchsia-950/70 to-purple-950/60 text-white shadow-[0_0_20px_rgba(217,70,239,0.35)]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{outcome}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-gradient-brand text-white flex items-center justify-center shrink-0 ml-2 shadow-glow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* "Her words" / Prospect's Words Input */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-card border border-white/10 space-y-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1.5 gap-1">
            <label
              htmlFor="prospect-words-input"
              className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-slate-200"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Prospect's actual words</span>
            </label>
            <div className="flex items-center space-x-2">
              {stage.id === 5 && (
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Crucial — Record exact problem words</span>
                </span>
              )}
              {prospectWords.length > 0 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {prospectWords.length} chars
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            Capture what the prospect said in their own vocabulary (especially goals, pain points, or exact objections).
          </p>
          <textarea
            id="prospect-words-input"
            rows={3}
            value={prospectWords}
            onChange={(e) => onProspectWordsChange(e.target.value)}
            placeholder="Type or paste the prospect's exact words here..."
            className="w-full px-4 py-3 text-sm text-slate-100 bg-black/40 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500 placeholder-slate-500 transition-all resize-none shadow-inner"
            style={{ minHeight: '84px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* Internal Caller Notes */}
        <div>
          <label
            htmlFor="caller-notes-input"
            className="text-xs font-semibold text-slate-400 block mb-1"
          >
            Caller Notes (Optional Context)
          </label>
          <input
            id="caller-notes-input"
            type="text"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="e.g. Next call scheduled, spoke with assistant first, etc."
            className="w-full px-3.5 py-2.5 text-xs text-slate-200 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 placeholder-slate-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
