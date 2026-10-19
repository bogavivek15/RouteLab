import React, { useState } from 'react';
import { PhoneCall, X, Building, User, ArrowRight } from 'lucide-react';

export default function NewCallModal({ isOpen, onClose, onStartCall }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onStartCall({
        prospect_name: name.trim() || 'Prospective Lead',
        prospect_company: company.trim() || 'Target Account'
      });
      setName('');
      setCompany('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay">
      <div className="bg-[#0c0d16]/95 border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl modal-content text-slate-100">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-glow-sm">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white text-lg font-heading">Start New Cold Call</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-slate-400">
            Enter prospect details before initiating the call. Both fields are optional.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Prospect Name / Role
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="prospect-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma (Director)"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm text-white bg-black/40 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Company / Clinic Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="prospect-company-input"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. City Health Clinic"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm text-white bg-black/40 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 placeholder-slate-500 transition-all"
              />
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
              id="confirm-start-call-btn"
              type="submit"
              disabled={loading}
              className="btn-glow px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-glow-sm hover:shadow-glow transition-all active:scale-[0.97] flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{loading ? 'Starting...' : 'Open Call Cockpit'}</span>
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
