/**
 * Investigation Management Tab
 * PROMPT 22 Section 27 - 30
 */

import React, { useState } from 'react';
import { Investigation } from '../../types';
import { Search, Clock, Users, GitCommit, CheckCircle2, ArrowRight } from 'lucide-react';

interface InvestigationsTabProps {
  investigations: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
}

export const InvestigationsTab: React.FC<InvestigationsTabProps> = ({ investigations, onSelectInvestigation }) => {
  const [search, setSearch] = useState('');

  const filtered = investigations.filter(
    (inv) =>
      inv.investigationNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.summary.toLowerCase().includes(search.toLowerCase()) ||
      inv.leadInvestigatorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="h-4 w-4 text-purple-400" /> Manajemen Penyelidikan Insiden (Investigations)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Proses penyelidikan formal 8 tahapan untuk pengumpulan bukti dan penentuan akar masalah (Root Cause)
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. investigasi, ketua..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            onClick={() => onSelectInvestigation(inv)}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3 hover:border-purple-500/50 cursor-pointer transition-colors shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan-400 font-bold text-xs">{inv.investigationNumber}</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-300">
                  {inv.caseNumber}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {inv.status}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{inv.summary}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{inv.findings}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800 text-slate-400">
              <span>Ketua Penyelidik: <strong className="text-white">{inv.leadInvestigatorName}</strong></span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-purple-400" /> Target: {new Date(inv.targetDate).toLocaleDateString('id-ID')}</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">Buka Workspace Penyelidikan <ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
