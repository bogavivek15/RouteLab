import React from 'react';
import { Check } from 'lucide-react';
import { STAGES } from '../data/stages';

export default function StageProgress({ currentStage, furthestStage, onSelectStage }) {
  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 shadow-sm">
      <div className="max-w-5xl mx-auto">
        {/* Stepper container */}
        <div className="flex items-center justify-between relative">
          {/* Background Connecting line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />

          {STAGES.map((stage) => {
            const isCurrent = stage.id === currentStage;
            const isCompleted = stage.id < currentStage || (stage.id <= furthestStage && !isCurrent);
            const isFuture = stage.id > furthestStage && !isCurrent;

            return (
              <button
                key={stage.id}
                id={`stage-step-${stage.id}`}
                onClick={() => onSelectStage(stage.id)}
                className="flex flex-col items-center group relative z-10 focus:outline-none"
                title={`${stage.name} - Stage ${stage.id}`}
              >
                {/* Badge Circle */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-white border-2 border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'
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
                  className={`mt-1.5 text-[11px] sm:text-xs font-medium tracking-tight hidden sm:block max-w-[85px] text-center truncate ${
                    isCurrent
                      ? 'text-brand-700 font-bold'
                      : isCompleted
                      ? 'text-slate-800 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
