/**
 * Incident Management Tab
 * PROMPT 22 Section 11 - 13
 */

import React, { useState } from 'react';
import { Incident } from '../../types';
import { AlertTriangle, Search, Plus, Eye, Download } from 'lucide-react';

interface IncidentsTabProps {
  incidents: Incident[];
  onOpenReportModal: () => void;
}

export const IncidentsTab: React.FC<IncidentsTabProps> = ({ incidents, onOpenReportModal }) => {
  const [search, setSearch] = useState('');

  const filtered = incidents.filter(
    (inc) =>
      inc.incidentNumber.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      (inc.driverName && inc.driverName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header Search & Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. insiden, deskripsi..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-950"
          >
            <Plus className="h-4 w-4" />
            <span>+ Laporkan Insiden</span>
          </button>
        </div>
      </div>

      {/* Incident Cards / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3 hover:border-amber-500/40 transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-cyan-400 font-bold text-xs">{inc.incidentNumber}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {inc.severity}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-white">{inc.type} • {inc.location}</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{inc.description}</p>
            </div>

            <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-[11px] space-y-1">
              <p className="text-slate-300 font-semibold"><strong className="text-amber-400">Dampak:</strong> {inc.impact}</p>
              <p className="text-slate-400"><strong className="text-slate-300">Pengemudi:</strong> {inc.driverName} ({inc.vehiclePlate})</p>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-slate-400">{new Date(inc.dateTime).toLocaleString('id-ID')}</span>
              <span className="font-bold text-emerald-400">{inc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
