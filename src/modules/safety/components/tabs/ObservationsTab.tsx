/**
 * Safety Observation Tab
 * PROMPT 22 Section 18 & 19
 */

import React from 'react';
import { SafetyObservation } from '../../types';
import { ShieldCheck, Plus, CheckCircle2, Eye } from 'lucide-react';

interface ObservationsTabProps {
  observations: SafetyObservation[];
  onOpenReportModal: () => void;
}

export const ObservationsTab: React.FC<ObservationsTabProps> = ({ observations, onOpenReportModal }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Observasi Keselamatan (Safety Observation)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencatatan perilaku keselamatan positif maupun kondisi kerja berisiko
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>+ Observasi Safety</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {observations.map((obs) => (
          <div
            key={obs.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-cyan-400 font-bold text-xs">{obs.observationNumber}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                  obs.category === 'GOOD_SAFETY_BEHAVIOR'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {obs.category.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs font-bold text-white">{obs.type}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{obs.description}</p>

            <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-[11px]">
              <strong className="text-cyan-400 font-bold">Rekomendasi:</strong> {obs.recommendation}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span>{obs.location}</span>
              <span className="font-bold text-emerald-400">{obs.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
