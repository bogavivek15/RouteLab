import React from 'react';
import { Quote, MessageSquare, Check, HelpCircle } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Prospect & Stage Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-bold tracking-wider text-brand-600 uppercase">
              Stage {stage.id} of 8
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {stage.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            <span className="font-semibold text-slate-900">{prospectName || 'Prospect'}</span>
            <span>•</span>
            <span className="text-slate-500">{prospectCompany || 'Cold Call'}</span>
          </div>
        </div>

        {/* Stage Purpose Statement */}
        <div className="mt-4 flex items-start space-x-2.5">
          <HelpCircle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            {stage.purpose}
          </p>
        </div>
      </div>

      {/* "She may say" Guidance Section */}
      <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/40 rounded-2xl p-5 border-l-4 border-brand-500 border-y border-r border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Quote className="w-4 h-4 text-brand-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-800">
            She may say / What tends to happen
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stage.sheMaySay.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-sm p-3.5 rounded-xl border border-blue-100/80 shadow-xs flex items-start space-x-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-800 italic leading-snug">
                "{item}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* "What happened" 4-Tap Outcome Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            What happened
          </h2>
          <span className="text-xs text-slate-400">Select one outcome</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stage.outcomes.map((outcome, idx) => {
            const isSelected = currentOutcome === outcome;
            return (
              <button
                key={idx}
                id={`outcome-btn-${idx}`}
                type="button"
                onClick={() => onOutcomeChange(outcome)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left font-semibold text-sm transition-all duration-150 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-900 shadow-sm ring-1 ring-brand-500'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{outcome}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 ml-2">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* "Her words" / Prospect's Words Input */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="prospect-words-input"
              className="flex items-center space-x-1.5 text-sm font-bold uppercase tracking-wider text-slate-800"
            >
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span>Her words / Prospect's actual words</span>
            </label>
            {stage.id === 5 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Critical Stage: Record exact quotes
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Capture what the prospect said in their own vocabulary (especially goals, pain points, or exact objections).
          </p>
          <textarea
            id="prospect-words-input"
            rows={3}
            value={prospectWords}
            onChange={(e) => onProspectWordsChange(e.target.value)}
            placeholder="Type or paste the prospect's exact words here..."
            className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50/60 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder-slate-400 transition-colors"
          />
        </div>

        {/* Internal Caller Notes */}
        <div>
          <label
            htmlFor="caller-notes-input"
            className="text-xs font-semibold text-slate-600 block mb-1"
          >
            Caller Notes (Optional Context)
          </label>
          <input
            id="caller-notes-input"
            type="text"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="e.g. Next call scheduled, spoke with assistant first, etc."
            className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50/60 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
