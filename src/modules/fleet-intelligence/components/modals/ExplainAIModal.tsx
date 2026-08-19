/**
 * Fleet Intelligence Smart AI - Explain with AI Modal (Prompt 28)
 * Menyajikan penjelasan mendalam berbasis telematika, penalaran logis,
 * bukti pendukung, dan tindakan yang disarankan.
 */

import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ExplainAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  metricName?: string;
  scoreOrValue?: string | number;
  explanation: string;
  contributingFactors?: Array<{ name: string; impact: string; detail: string }>;
  evidence?: string[];
  recommendations?: string[];
}

export const ExplainAIModal: React.FC<ExplainAIModalProps> = ({
  isOpen,
  onClose,
  title,
  metricName,
  scoreOrValue,
  explanation,
  contributingFactors = [],
  evidence = [],
  recommendations = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">AI Reasoning & Explainability</h3>
              <p className="text-xs text-slate-400">{title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Main Value Banner */}
          {scoreOrValue && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-cyan-300 font-semibold uppercase tracking-wider block">
                  Metrik Dianalisis: {metricName || 'Indikator Utama'}
                </span>
                <span className="text-xs text-slate-300">Dihitung otomatis dari data telematika 24 jam terakhir</span>
              </div>
              <span className="text-2xl font-black font-mono text-white">{scoreOrValue}</span>
            </div>
          )}

          {/* Core Explanation */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Penjelasan Logis AI (Reasoning Chain)
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {explanation}
            </div>
          </div>

          {/* Contributing Factors */}
          {contributingFactors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Faktor Penentu & Bobot Pengaruh
              </h4>
              <div className="space-y-2">
                {contributingFactors.map((f, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-white font-semibold block">{f.name}</strong>
                      <span className="text-slate-400 text-[11px]">{f.detail}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 shrink-0">
                      {f.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Telematics Evidence */}
          {evidence.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Bukti Telemetri Sensor
              </h4>
              <ul className="space-y-1.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                {evidence.map((ev, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Langkah Tindak Lanjut yang Direkomendasikan
              </h4>
              <div className="space-y-1.5">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Faktual & Terverifikasi Model Telematika Deterministik</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
