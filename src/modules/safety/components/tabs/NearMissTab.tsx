/**
 * Near Miss Management Tab
 * PROMPT 22 Section 14 & 15
 */

import React from 'react';
import { NearMiss } from '../../types';
import { AlertTriangle, Plus, ShieldCheck, MapPin } from 'lucide-react';

interface NearMissTabProps {
  nearMisses: NearMiss[];
  onOpenQuickReport: () => void;
}

export const NearMissTab: React.FC<NearMissTabProps> = ({ nearMisses, onOpenQuickReport }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-cyan-400" /> Pengelolaan Kejadian Near Miss (Hampir Celaka)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencegahan dini sebelum menjadi kecelakaan nyata melalui pencatatan potensi bahaya
          </p>
        </div>

        <button
          onClick={onOpenQuickReport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-950"
        >
          <Plus className="h-4 w-4" />
          <span>+ Quick Report Near Miss</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearMisses.map((nm) => (
          <div
            key={nm.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3 hover:border-cyan-500/40 transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-cyan-400 font-bold text-xs">{nm.nearMissNumber}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Risiko: {nm.riskLevel}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{nm.type}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{nm.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <p className="text-[10px] text-amber-400 font-bold uppercase">Potensi Dampak</p>
                <p className="text-slate-300 font-medium mt-0.5">{nm.potentialConsequence}</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">Kenyataan Aktual</p>
                <p className="text-slate-300 font-medium mt-0.5">{nm.actualConsequence}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-cyan-400" /> {nm.location}</span>
              <span>{new Date(nm.dateTime).toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
