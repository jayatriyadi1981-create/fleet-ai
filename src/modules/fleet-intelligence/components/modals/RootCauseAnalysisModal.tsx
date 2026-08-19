/**
 * Fleet Intelligence Smart AI - Root Cause Analysis Modal (Prompt 28)
 * Investigasi kausal multi-level: Perubahan Metrik -> Faktor Terkorelasi ->
 * Pola Historis -> Entitas Terkena Dampak -> Peringkat Akar Masalah.
 */

import React from 'react';
import { X, Sparkles, AlertOctagon, ArrowDown, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RootCauseInvestigation } from '../../types';

interface RootCauseAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigation: RootCauseInvestigation | null;
}

export const RootCauseAnalysisModal: React.FC<RootCauseAnalysisModalProps> = ({
  isOpen,
  onClose,
  investigation,
}) => {
  if (!isOpen || !investigation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <AlertOctagon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Investigasi Akar Masalah (Root Cause Analysis)</h3>
              <p className="text-xs text-slate-400">Pohon penalaran kausal AI berbasis korelasi telematika</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Level 1: Metric Changed */}
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
                Deviasi Metrik Utama Terdeteksi
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{investigation.metricChanged}</h4>
            </div>
            <span className="text-xl font-black font-mono text-rose-300">
              {investigation.changeValue}
            </span>
          </div>

          {/* Level 2: Correlated Telematics Factors */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Faktor Telematika Berkorelasi Kuat
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {investigation.correlatedFactors.map((f, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-semibold text-cyan-300 text-center">
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Level 3: Historical Pattern */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300">
            <strong className="text-slate-400 block mb-1 uppercase text-[10px] tracking-wider">
              Pola Historis & Siklus:
            </strong>
            {investigation.historicalPattern}
          </div>

          {/* Level 4: Affected Entities */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1.5">
            <strong className="text-slate-400 block uppercase text-[10px] tracking-wider mb-1">
              Entitas Terkena Dampak Langsung:
            </strong>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 text-[11px]">Kendaraan:</span>
              {investigation.affectedEntities.vehicles.map((v, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-cyan-300 font-bold text-[11px]">
                  {v}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-slate-500 text-[11px]">Pengemudi:</span>
              {investigation.affectedEntities.drivers.map((d, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Level 5: Ranked Root Causes */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Peringkat Kemungkinan Akar Masalah (Ranked Root Causes)
            </span>
            <div className="space-y-2.5">
              {investigation.rankedCauses.map((rc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white font-semibold">{rc.cause}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rc.probability === 'Likely contributor' ? 'bg-rose-500/20 text-rose-300' :
                      rc.probability === 'Possible contributor' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {rc.probability}
                    </span>
                  </div>
                  <ul className="space-y-1 mt-1.5">
                    {rc.evidence.map((ev, i) => (
                      <li key={i} className="text-slate-400 text-[11px] flex items-center gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
