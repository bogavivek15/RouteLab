import React, { useState } from 'react';
import { PhoneOff, X, AlertTriangle } from 'lucide-react';
import { FINAL_OUTCOMES } from '../data/stages';

export default function EndCallModal({ isOpen, onClose, onConfirmEnd, currentStage }) {
  const [selectedOutcome, setSelectedOutcome] = useState('agreed_to_receive_report');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay">
      <div className="bg-[#0c0d16]/95 border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl modal-content text-slate-100">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-danger flex items-center justify-center text-white shadow-md">
              <PhoneOff className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white text-lg font-heading">Wrap Up & End Call</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-start space-x-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">
              Ending call at <span className="font-bold text-white">Stage {currentStage}</span>. Record the final outcome to save this call record.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Final Outcome
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {FINAL_OUTCOMES.map((item) => (
                <label
                  key={item.value}
                  className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all duration-200 ${
                    selectedOutcome === item.value
                      ? 'border-fuchsia-500 bg-fuchsia-950/60 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="final_outcome"
                    value={item.value}
                    checked={selectedOutcome === item.value}
                    onChange={() => setSelectedOutcome(item.value)}
                    className="accent-fuchsia-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="confirm-end-call-btn"
            type="button"
            onClick={() => onConfirmEnd(selectedOutcome)}
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-danger rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.97] cursor-pointer"
          >
            Confirm & Save Call
          </button>
        </div>
      </div>
    </div>
  );
}
