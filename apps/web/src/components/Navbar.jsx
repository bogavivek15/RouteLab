import React from 'react';
import { Phone, Clock, History, PlusCircle, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({
  activeCall,
  callSeconds,
  formatTime,
  onEndCallClick,
  onOpenHistory,
  onStartNewCall,
  backendStatus
}) {
  // Timer milestone colors: normal → warm → hot
  const getTimerColor = () => {
    if (callSeconds >= 600) return 'text-rose-400'; // 10min+
    if (callSeconds >= 300) return 'text-amber-400'; // 5min+
    if (callSeconds >= 120) return 'text-sky-400';   // 2min+
    return 'text-emerald-400';
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-amber-500 flex items-center justify-center text-white shadow-glow-sm">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            {/* Dialit style orange dot accent */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white font-heading">
                RouteLab<span className="text-amber-400"></span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-400/20">
                Live Guide
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Cold calls that convert.</p>
          </div>
        </div>

        {/* Center: Active Call Info & Timer */}
        {activeCall && activeCall.status === 'in_progress' ? (
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 text-white px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              <span className={`font-mono font-bold tracking-wider ${getTimerColor()} transition-colors duration-500`}>
                {formatTime(callSeconds)}
              </span>
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                {activeCall.prospect_name || 'Active Call'}
              </span>
              <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                {activeCall.prospect_company || 'Cold Outreach'}
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2 text-xs">
            {backendStatus === 'healthy' ? (
              <span className="flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                <Wifi className="w-3 h-3 mr-1.5" /> System Ready
              </span>
            ) : (
              <span className="flex items-center text-amber-400 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                <WifiOff className="w-3 h-3 mr-1.5" /> {backendStatus || 'Connecting...'}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            id="history-btn"
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {activeCall && activeCall.status === 'in_progress' ? (
            <button
              id="end-call-btn"
              onClick={onEndCallClick}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 hover:border-rose-400/50 rounded-xl transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 rotate-[135deg]" />
              <span>End Call</span>
            </button>
          ) : (
            <button
              id="new-call-btn"
              onClick={onStartNewCall}
              className="btn-glow flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white rounded-xl shadow-glow-sm hover:shadow-glow transition-all active:scale-[0.97] cursor-pointer"
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
