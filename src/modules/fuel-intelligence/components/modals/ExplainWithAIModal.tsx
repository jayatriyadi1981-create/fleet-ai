/**
 * Fleet Intelligence Smart AI - Explain With AI Modal
 * Deep-dive conversational telematics explanation explaining root cause,
 * contributing factors, evidence quality, and actionable operator guidance.
 */

import React from 'react';
import { Sparkles, X, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export interface ExplainAIContent {
  title: string;
  category: 'CONSUMPTION' | 'EFFICIENCY' | 'COST' | 'ANOMALY' | 'PREDICTION' | 'THEFT';
  subject: string;
  whatHappened: string;
  whyFlagged: string;
  evidence: string[];
  dataReliability: 'HIGH' | 'MEDIUM' | 'LIMITED';
  reliabilityReason: string;
  recommendedOperatorAction: string;
}

interface ExplainWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ExplainAIContent | null;
}

export const ExplainWithAIModal: React.FC<ExplainWithAIModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">AI Telematics Root Cause Explanation</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {content.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">{content.subject}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: What Happened? */}
          <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5" />
              <span>1. Apa yang Terjadi? (What happened?)</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {content.whatHappened}
            </p>
          </div>

          {/* Section 2: Why was it flagged? */}
          <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>2. Mengapa Ditandai Oleh AI? (Why was it flagged?)</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {content.whyFlagged}
            </p>
          </div>

          {/* Section 3: Evidence */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>3. Bukti Telemetri Pendukung (Supporting Evidence)</span>
            </div>
            <ul className="space-y-2">
              {content.evidence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Data Reliability */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-white block">Kualitas & Keandalan Data</span>
                <span className="text-[11px] text-slate-400">{content.reliabilityReason}</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                content.dataReliability === 'HIGH'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : content.dataReliability === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              Reliability: {content.dataReliability}
            </span>
          </div>

          {/* Section 5: Operator Next Steps */}
          <div className="space-y-2 bg-cyan-950/30 p-4 rounded-xl border border-cyan-500/30">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
              <ArrowRight className="h-3.5 w-3.5" />
              <span>4. Rekomendasi Tindakan Operator (Action Next Step)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              {content.recommendedOperatorAction}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono">
            Generated by AI Core & Telematics Engine • Audited
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-950"
          >
            Tutup Penjelasan
          </button>
        </div>
      </div>
    </div>
  );
};
