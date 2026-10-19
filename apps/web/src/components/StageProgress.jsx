import React from 'react';
import { Check } from 'lucide-react';
import { STAGES } from '../data/stages';

export default function StageProgress({ currentStage, furthestStage, onSelectStage }) {
  const progressPercent = Math.round(((currentStage - 1) / 7) * 100);

  return (
    <div className="bg-slate-950/70 backdrop-blur-xl border-b border-white/10 py-3 px-4 relative z-20">
      <div className="max-w-5xl mx-auto">
        {/* Mobile progress bar */}
        <div className="sm:hidden mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-fuchsia-400">
              Stage {currentStage} of 8
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {progressPercent}% completed
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Desktop stepper */}
        <div className="flex items-center justify-between relative">
          {/* Background connecting line */}
          <div className="absolute left-6 right-6 top-[18px] sm:top-[20px] h-0.5 bg-white/10 -z-10" />
          
          {/* Active progress line */}
          <div
            className="absolute left-6 top-[18px] sm:top-[20px] h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 -z-[5] transition-all duration-500 ease-out rounded-full shadow-[0_0_12px_rgba(232,121,249,0.5)]"
            style={{ width: `${Math.max(0, ((currentStage - 1) / 7) * 100)}%` }}
          />

          {STAGES.map((stage) => {
            const isCurrent = stage.id === currentStage;
            const isCompleted = stage.id < currentStage || (stage.id <= furthestStage && !isCurrent);

            return (
              <button
                key={stage.id}
                id={`stage-step-${stage.id}`}
                onClick={() => onSelectStage(stage.id)}
                className="flex flex-col items-center group relative z-10 focus:outline-none cursor-pointer"
                title={`${stage.name} — Stage ${stage.id}`}
              >
                {/* Badge Circle */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-brand text-white ring-4 ring-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.5)] scale-110'
                      : isCompleted
                      ? 'bg-white/10 border border-fuchsia-400/40 text-fuchsia-300 shadow-sm hover:border-fuchsia-400 hover:scale-105'
                      : 'bg-white/[0.04] border border-white/10 text-slate-500 hover:border-white/25 hover:text-slate-300 hover:scale-105'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    stage.id
                  )}
                </div>

                {/* Stage Label */}
                <span
                  className={`mt-1.5 text-[10px] sm:text-xs font-medium tracking-tight hidden sm:block max-w-[85px] text-center truncate transition-colors duration-200 ${
                    isCurrent
                      ? 'text-white font-bold'
                      : isCompleted
                      ? 'text-fuchsia-300 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.shortName}
                </span>

                {/* Hover tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-white/15 text-slate-100 text-[10px] font-medium rounded-lg shadow-elevated opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
                  {stage.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
