import React, { useState, useEffect } from 'react';
import { History, X, Search, Sparkles, Eye, Clock, PhoneForwarded } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      loadCalls();
    }
  }, [isOpen]);

  const loadCalls = async () => {
    setLoading(true);
    try {
      const data = await api.listCalls();
      setCalls(data || []);
    } catch (err) {
      console.error('Failed to load call history:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Call History & Furthest Stages</h2>
              <p className="text-xs text-slate-500">Inspect past call outcomes, stage progression, and AI summaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by prospect name, company, or outcome..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Call List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading past call records...
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No call records found</p>
              <p className="text-xs">Start a call from the main screen to begin recording outcomes.</p>
            </div>
          ) : (
            filteredCalls.map((call) => (
              <div
                key={call.id}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {call.prospect_name || 'Prospective Lead'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {call.prospect_company || 'Cold Call'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        call.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {call.status === 'completed' ? 'Closed' : 'In Progress'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {formatDate(call.created_at)}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                      Reached Stage {call.furthest_stage}: {getStageName(call.furthest_stage)}
                    </span>
                    {call.final_outcome && (
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        Outcome: {call.final_outcome}
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
                      className="px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg flex items-center space-x-1"
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
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
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
