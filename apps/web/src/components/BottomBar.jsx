import React from 'react';
import { ChevronLeft, ChevronRight, Check, Sparkles, Loader2 } from 'lucide-react';
import { STAGES } from '../data/stages';

export default function BottomBar({
  currentStageId,
  onPrevStage,
  onNextStage,
  onCompleteCall,
  saveStatus // 'saved', 'saving', 'unsaved', 'error'
}) {
  const currentStage = STAGES.find(s => s.id === currentStageId) || STAGES[0];
  const prevStage = STAGES.find(s => s.id === currentStageId - 1);
  const nextStage = STAGES.find(s => s.id === currentStageId + 1);
  const isLastStage = currentStageId === 8;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 z-20 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Back Button */}
        <button
          id="prev-stage-btn"
          onClick={onPrevStage}
          disabled={currentStageId === 1}
          className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            currentStageId === 1
              ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-100'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">
            Back{prevStage ? `: ${prevStage.shortName}` : ''}
          </span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Save Status Indicator */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
          {saveStatus === 'saving' && (
            <span className="flex items-center text-brand-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center text-emerald-600">
              <Check className="w-3.5 h-3.5 mr-1 stroke-[2.5]" /> Saved
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="text-amber-600">● Unsaved edits</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-rose-600">⚠️ Save failed (retrying)</span>
          )}
        </div>

        {/* Next / Finish Button */}
        {isLastStage ? (
          <button
            id="finish-call-btn"
            onClick={onCompleteCall}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Finish & Summarize</span>
          </button>
        ) : (
          <button
            id="next-stage-btn"
            onClick={onNextStage}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-md shadow-slate-900/10 transition-all"
          >
            <span>Next{nextStage ? `: ${nextStage.shortName}` : ''}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </footer>
  );
}
