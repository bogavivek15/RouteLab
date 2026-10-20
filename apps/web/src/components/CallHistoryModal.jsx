import React, { useState, useEffect, useCallback } from 'react';
import { History, X, Search, Eye, Clock, PhoneForwarded, Inbox } from 'lucide-react';
import { api } from '../api';
import { STAGES } from '../data/stages';

export default function CallHistoryModal({
  isOpen,
  onClose,
  onInspectCall,
  onResumeCall
}) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCalls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listCalls();
      setCalls(data || []);
    } catch (err) {
      console.error('Failed to load call history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadCalls();
    }
  }, [isOpen, loadCalls]);

  if (!isOpen) return null;

  const filteredCalls = calls.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.prospect_name && c.prospect_name.toLowerCase().includes(term)) ||
      (c.prospect_company && c.prospect_company.toLowerCase().includes(term)) ||
      (c.final_outcome && c.final_outcome.toLowerCase().includes(term))
    );
  });

  const getStageName = (num) => {
    const st = STAGES.find(s => s.id === num);
    return st ? st.name : `Stage ${num}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay">
      <div className="bg-[#0c0d16]/95 border border-white/15 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl modal-content text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white shadow-md">
              <History className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading">Call History & Intelligence</h2>
              <p className="text-xs text-slate-400">
                {filteredCalls.length} {filteredCalls.length === 1 ? 'record' : 'records'} logged
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white/[0.02] border-b border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by prospect, company, or outcome..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-black/40 border border-white/15 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        {/* Call List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-white/20 border-t-fuchsia-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading call records...</p>
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                <Inbox className="w-7 h-7 text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-200">No call records found</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Start a new call from the main screen to begin recording outcomes and generating AI summaries.
              </p>
            </div>
          ) : (
            filteredCalls.map((call) => (
              <div
                key={call.id}
                className="bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] rounded-xl p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-glow-sm">
                      {(call.prospect_name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-white text-sm truncate">
                      {call.prospect_name || 'Active Call'}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">·</span>
                    <span className="text-xs font-medium text-slate-400 truncate hidden sm:inline">
                      {call.prospect_company || 'Cold Outreach'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        call.status === 'completed'
                          ? 'bg-white/10 text-slate-300 border border-white/10'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {call.status === 'completed' ? 'Closed' : 'Live'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-500" />
                      {formatDate(call.created_at)}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="font-medium text-fuchsia-300 bg-fuchsia-500/10 px-2 py-0.5 rounded-md border border-fuchsia-500/20">
                      Stage {call.furthest_stage}: {getStageName(call.furthest_stage)}
                    </span>
                    {call.final_outcome && (
                      <span className="font-medium text-slate-300 bg-white/5 px-2 py-0.5 rounded-md hidden sm:inline border border-white/5">
                        {call.final_outcome.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {call.status === 'in_progress' && (
                    <button
                      onClick={() => {
                        onResumeCall(call.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 rounded-lg flex items-center space-x-1 border border-cyan-500/30 transition-colors cursor-pointer"
                    >
                      <PhoneForwarded className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </button>
                  )}
                  <button
                    id={`inspect-call-${call.id}`}
                    onClick={() => {
                      onInspectCall(call.id);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
