import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import StageProgress from './components/StageProgress';
import StageCard from './components/StageCard';
import BottomBar from './components/BottomBar';
import EndCallModal from './components/EndCallModal';
import NewCallModal from './components/NewCallModal';
import CallHistoryModal from './components/CallHistoryModal';
import CallSummaryModal from './components/CallSummaryModal';
import { api } from './api';
import { STAGES } from './data/stages';
import { Phone, Sparkles, History, ArrowRight, ShieldCheck, Zap, Compass, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Application State
  const [activeCall, setActiveCall] = useState(null);
  const [currentStageId, setCurrentStageId] = useState(1);
  const [stageResults, setStageResults] = useState({});
  const [callSeconds, setCallSeconds] = useState(0);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved' | 'error'
  const [backendStatus, setBackendStatus] = useState('checking');

  // Modal Visibility
  const [isEndCallOpen, setIsEndCallOpen] = useState(false);
  const [isNewCallOpen, setIsNewCallOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summaryTargetCallId, setSummaryTargetCallId] = useState(null);
  const [latestSummary, setLatestSummary] = useState(null);

  // Debounce ref for auto-saving typed notes
  const saveTimeoutRef = useRef(null);
  const activeCallRef = useRef(activeCall);
  activeCallRef.current = activeCall;

  // Check Backend Health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await api.getHealth();
      setBackendStatus(res.status);
    } catch (_) {
      setBackendStatus('offline');
    }
  };

  // Call timer interval
  useEffect(() => {
    let interval = null;
    if (activeCall && activeCall.status === 'in_progress') {
      interval = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Start New Call
  const handleStartCall = async ({ prospect_name, prospect_company }) => {
    try {
      setSaveStatus('saving');
      const newCall = await api.startCall({ prospect_name, prospect_company });
      setActiveCall(newCall);
      setCurrentStageId(1);
      setStageResults({});
      setCallSeconds(0);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to start call:', err);
      alert(`Could not start call: ${err.message}`);
      setSaveStatus('error');
    }
  };

  // Load existing call into screen (e.g. from history resume)
  const handleResumeCall = async (callId) => {
    try {
      setSaveStatus('saving');
      const callData = await api.getCall(callId);
      setActiveCall(callData);
      setCurrentStageId(callData.current_stage || 1);

      // Populate stageResults map
      const map = {};
      if (callData.stage_results) {
        callData.stage_results.forEach((r) => {
          map[r.stage_number] = {
            outcome: r.outcome,
            prospect_words: r.prospect_words,
            notes: r.notes
          };
        });
      }
      setStageResults(map);

      // Compute elapsed seconds if still in progress
      if (callData.status === 'in_progress' && callData.started_at) {
        const elapsed = Math.floor((new Date() - new Date(callData.started_at)) / 1000);
        setCallSeconds(Math.max(0, elapsed));
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to resume call:', err);
      alert(`Could not load call: ${err.message}`);
    }
  };

  // Persist stage result to backend
  const persistStage = useCallback(
    async (stageId, dataToSave) => {
      const call = activeCallRef.current;
      if (!call) return;

      setSaveStatus('saving');
      try {
        const updatedCall = await api.updateStageResult(call.id, stageId, dataToSave);
        setActiveCall(updatedCall);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
        setSaveStatus('error');
      }
    },
    []
  );

  // Handle outcome click (Immediate Save)
  const handleOutcomeChange = (newOutcome) => {
    const existing = stageResults[currentStageId] || {};
    const updated = { ...existing, outcome: newOutcome };
    setStageResults((prev) => ({ ...prev, [currentStageId]: updated }));
    persistStage(currentStageId, updated);
  };

  // Handle Prospect's words input (Debounced Save)
  const handleProspectWordsChange = (words) => {
    const existing = stageResults[currentStageId] || {};
    const updated = { ...existing, prospect_words: words };
    setStageResults((prev) => ({ ...prev, [currentStageId]: updated }));
    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      persistStage(currentStageId, updated);
    }, 600);
  };

  // Handle notes input (Debounced Save)
  const handleNotesChange = (notes) => {
    const existing = stageResults[currentStageId] || {};
    const updated = { ...existing, notes };
    setStageResults((prev) => ({ ...prev, [currentStageId]: updated }));
    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      persistStage(currentStageId, updated);
    }, 600);
  };

  // Stage Navigation with flush
  const navigateToStage = (nextId) => {
    if (nextId < 1 || nextId > 8) return;

    // Flush any pending unsaved debounce edits
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      const currentData = stageResults[currentStageId] || {};
      persistStage(currentStageId, currentData);
    }

    setCurrentStageId(nextId);
  };

  // Confirm End Call
  const handleConfirmEndCall = async (finalOutcome) => {
    if (!activeCall) return;

    try {
      setSaveStatus('saving');
      const closedCall = await api.closeCall(activeCall.id, finalOutcome);
      setActiveCall(closedCall);
      setSaveStatus('saved');
      setIsEndCallOpen(false);

      // Open Post-Call Summary Modal
      setLatestSummary(null);
      setSummaryTargetCallId(closedCall.id);
      setIsSummaryOpen(true);
    } catch (err) {
      console.error('Failed to close call:', err);
      alert(`Failed to close call: ${err.message}`);
      setSaveStatus('error');
    }
  };

  // Inspect any call from History
  const handleInspectCall = (callId) => {
    setSummaryTargetCallId(callId);
    setLatestSummary(null);
    setIsSummaryOpen(true);
  };

  const currentStageObj = STAGES.find((s) => s.id === currentStageId) || STAGES[0];
  const currentStageResult = stageResults[currentStageId] || {};

  return (
    <div className="min-h-screen flex flex-col bg-aurora text-slate-100 relative selection:bg-fuchsia-500/30">
      {/* Top ambient aurora blur light */}
      <div className="aurora-blur" />

      {/* Top Navigation */}
      <Navbar
        activeCall={activeCall}
        callSeconds={callSeconds}
        formatTime={formatTime}
        onEndCallClick={() => setIsEndCallOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onStartNewCall={() => setIsNewCallOpen(true)}
        backendStatus={backendStatus}
      />

      {activeCall && activeCall.status === 'in_progress' ? (
        <div className="flex-1 flex flex-col pb-24 relative z-10">
          {/* 8-Stage Progress Stepper */}
          <StageProgress
            currentStage={currentStageId}
            furthestStage={activeCall?.furthest_stage || 1}
            onSelectStage={(id) => navigateToStage(id)}
          />

          {/* Main Calling Screen Stage Card */}
          <main className="flex-1 px-4 py-4 sm:py-6">
            <StageCard
              stage={currentStageObj}
              stageResult={currentStageResult}
              onOutcomeChange={handleOutcomeChange}
              onProspectWordsChange={handleProspectWordsChange}
              onNotesChange={handleNotesChange}
              prospectName={activeCall.prospect_name}
              prospectCompany={activeCall.prospect_company}
            />
          </main>

          {/* Sticky Bottom Navigation Bar */}
          <BottomBar
            currentStageId={currentStageId}
            onPrevStage={() => navigateToStage(currentStageId - 1)}
            onNextStage={() => navigateToStage(currentStageId + 1)}
            onCompleteCall={() => setIsEndCallOpen(true)}
            saveStatus={saveStatus}
          />
        </div>
      ) : (
        /* Standby / Calling Dashboard Hero (Dialit.ai inspired aesthetic) */
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-auto">
          <div className="max-w-4xl w-full text-center space-y-8 py-8 sm:py-16">

            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2.5 bg-white/[0.04] border border-white/10 hover:border-white/20 text-slate-300 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-glow-sm transition-all">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Grounded in 100 Cold-Call Transcripts</span>
              <span className="text-white/20">|</span>
              <span className="text-amber-300 font-semibold">Stage-by-Stage Cockpit</span>
            </div>

            {/* Hero Title with dialit style iridescent gradient */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight font-heading leading-[1.1]">
                Introducing RouteLab. <br />
                <span className="gradient-dialit">
                  Cold calls that actually convert.
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
                Design, steer, and navigate high-velocity sales conversations in real time. Handle objections with proven scripts, capture prospect words, and generate instant AI debriefs.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                id="hero-start-call-btn"
                onClick={() => setIsNewCallOpen(true)}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white btn-glow rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer"
              >
                <Phone className="w-5 h-5 text-white" />
                <span>Start Live Cold Call</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="w-full sm:w-auto px-7 py-4 text-base font-semibold btn-outline-glow rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <History className="w-4 h-4 text-slate-400" />
                <span>Call Archive & Analytics</span>
              </button>
            </div>

            {/* 3 Core Value Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 text-left">
              <div className="glass-card glass-card-hover p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1.5 font-heading">
                  8-Stage Guided Cockpit
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  From Opener to Permission, Problem Exploration, and Close — know exactly what to say next at any second.
                </p>
              </div>

              <div className="glass-card glass-card-hover p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1.5 font-heading">
                  Single-Tap Outcome Logging
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Four stage-specific response choices per stage. Capture what happened without losing conversation rhythm.
                </p>
              </div>

              <div className="glass-card glass-card-hover p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1.5 font-heading">
                  Server-Side AI Debrief
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated intelligence extracts stated pains, objections, agreed next steps, and rep performance scores in seconds.
                </p>
              </div>
            </div>

            {/* Trust bar */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero manual post-call notes</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>FastAPI + Supabase real-time sync</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Mobile responsive companion</span>
              </span>
            </div>

          </div>
        </main>
      )}

      {/* Modals */}
      <EndCallModal
        isOpen={isEndCallOpen}
        onClose={() => setIsEndCallOpen(false)}
        onConfirmEnd={handleConfirmEndCall}
        currentStage={currentStageId}
      />

      <NewCallModal
        isOpen={isNewCallOpen}
        onClose={() => setIsNewCallOpen(false)}
        onStartCall={handleStartCall}
      />

      <CallHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onInspectCall={handleInspectCall}
        onResumeCall={handleResumeCall}
      />

      <CallSummaryModal
        callId={summaryTargetCallId}
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        initialSummary={latestSummary}
      />
    </div>
  );
}
