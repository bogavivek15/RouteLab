import React, { useState } from 'react';
import { PhoneOff, X, AlertTriangle } from 'lucide-react';
import { FINAL_OUTCOMES } from '../data/stages';

export default function EndCallModal({ isOpen, onClose, onConfirmEnd, currentStage }) {
  const [selectedOutcome, setSelectedOutcome] = useState('agreed_to_receive_report');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-rose-600">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <PhoneOff className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Wrap Up & End Call</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-600">
            Ending call at <span className="font-bold text-slate-900">Stage {currentStage}</span>. Record the final outcome to save this call record.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Final Outcome
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {FINAL_OUTCOMES.map((item) => (
                <label
                  key={item.value}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${
                    selectedOutcome === item.value
                      ? 'border-brand-600 bg-brand-50/60 text-brand-900 ring-1 ring-brand-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="final_outcome"
                    value={item.value}
                    checked={selectedOutcome === item.value}
                    onChange={() => setSelectedOutcome(item.value)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            id="confirm-end-call-btn"
            type="button"
            onClick={() => onConfirmEnd(selectedOutcome)}
            className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all"
          >
            Confirm & Save Call
          </button>
        </div>
      </div>
    </div>
  );
}
