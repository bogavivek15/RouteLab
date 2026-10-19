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
import { Phone, Sparkles, History, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20">
      {/* Top Navbar */}
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
        <>
          {/* 8-Stage Progress Stepper */}
          <StageProgress
            currentStage={currentStageId}
            furthestStage={activeCall?.furthest_stage || 1}
            onSelectStage={(id) => navigateToStage(id)}
          />

          {/* Main Calling Screen Stage Card */}
          <main className="flex-1">
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
        </>
      ) : (
        /* Standby / Calling Dashboard Hero */
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center space-y-8 py-10">
            <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-200 text-brand-700 px-3 py-1 rounded-full text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Grounded in 100 Cold-Call Transcripts</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
                The screen you keep open during a cold call.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                Understand the stage at a glance, listen without losing focus, capture the prospect's exact words, and track outcomes with single-tap controls.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                id="hero-start-call-btn"
                onClick={() => setIsNewCallOpen(true)}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-xl shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Start Cold Call</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="w-full sm:w-auto px-6 py-4 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <History className="w-4 h-4 text-slate-500" />
                <span>View Call History</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  8 Official Stages
                </span>
                <p className="text-xs text-slate-500">
                  From Opening to Permission, Their Need, and Close with evidence-based guidance.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Single-Tap Outcomes
                </span>
                <p className="text-xs text-slate-500">
                  Four stage-specific choices per stage so you can log what happened while speaking.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  AI Post-Call Summary
                </span>
                <p className="text-xs text-slate-500">
                  Synthesize stated needs, objections, and agreed next steps via server-side Gemini.
                </p>
              </div>
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
