import React from 'react';
import { Phone, Clock, History, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({
  activeCall,
  callSeconds,
  formatTime,
  onEndCallClick,
  onOpenHistory,
  onStartNewCall,
  backendStatus
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-heading">
                CallFlow
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Live Companion
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Cold-call execution & stage tracker</p>
          </div>
        </div>

        {/* Center: Active Call Info & Timer */}
        {activeCall && activeCall.status === 'in_progress' ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-full text-sm font-medium shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Clock className="w-4 h-4 text-slate-300 ml-1" />
              <span className="font-mono font-semibold tracking-wider text-emerald-400">
                {formatTime(callSeconds)}
              </span>
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800">
                {activeCall.prospect_name || 'Prospect'}
              </span>
              <span className="text-[11px] text-slate-500 truncate max-w-[160px]">
                {activeCall.prospect_company || 'Cold Call'}
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <span className="text-slate-500">API Status:</span>
            {backendStatus === 'healthy' ? (
              <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready
              </span>
            ) : (
              <span className="flex items-center text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {backendStatus || 'Checking...'}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            id="history-btn"
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Call History</span>
          </button>

          {activeCall && activeCall.status === 'in_progress' ? (
            <button
              id="end-call-btn"
              onClick={onEndCallClick}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 rotate-[135deg]" />
              <span>End Call</span>
            </button>
          ) : (
            <button
              id="new-call-btn"
              onClick={onStartNewCall}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-all shadow-md shadow-brand-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Call</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
