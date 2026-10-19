import React from 'react';
import { ChevronLeft, ChevronRight, Check, Sparkles, Loader2, AlertCircle } from 'lucide-react';
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
  const progressPercent = Math.round((currentStageId / 8) * 100);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/85 backdrop-blur-xl border-t border-white/10 py-3.5 px-4 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {/* Gradient progress line at top of bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(217,70,239,0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Back Button */}
        <button
          id="prev-stage-btn"
          onClick={onPrevStage}
          disabled={currentStageId === 1}
          className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            currentStageId === 1
              ? 'opacity-25 cursor-not-allowed text-slate-500 bg-white/[0.02] border border-white/5'
              : 'text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] hover:text-white border border-white/10 active:scale-[0.97]'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">
            {prevStage ? prevStage.shortName : 'Back'}
          </span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Center: Save Status + Stage Info */}
        <div className="flex flex-col items-center space-y-0.5">
          <div className="flex items-center space-x-1.5 text-xs font-medium">
            {saveStatus === 'saving' && (
              <span className="flex items-center text-fuchsia-400">
                <Loader2 className="w-3 h-3 animate-spin mr-1" /> Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center text-emerald-400">
                <Check className="w-3 h-3 mr-1 stroke-[2.5]" /> Auto-saved
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="flex items-center text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
                Unsaved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center text-rose-400">
                <AlertCircle className="w-3 h-3 mr-1" /> Sync failed
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:block">
            Stage {currentStageId}/8 · {currentStage.shortName}
          </span>
        </div>

        {/* Next / Finish Button */}
        {isLastStage ? (
          <button
            id="finish-call-btn"
            onClick={onCompleteCall}
            className="btn-glow flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 active:scale-[0.97] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Finish & Summarize</span>
            <span className="sm:hidden">Finish</span>
          </button>
        ) : (
          <button
            id="next-stage-btn"
            onClick={onNextStage}
            className="btn-glow flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 active:scale-[0.97] transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">
              {nextStage ? nextStage.shortName : 'Next'}
            </span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </footer>
  );
}
