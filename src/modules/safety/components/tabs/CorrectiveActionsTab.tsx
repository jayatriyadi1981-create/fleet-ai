/**
 * Corrective Actions (CAPA) Tab
 * PROMPT 22 Section 46 - 53 & 103
 */

import React, { useState } from 'react';
import { CorrectiveAction, CAPAStatus, CAPAPriority } from '../../types';
import { GitCommit, Search, CheckCircle2, AlertTriangle, Clock, User, ShieldCheck } from 'lucide-react';

interface CorrectiveActionsTabProps {
  capas: CorrectiveAction[];
  onVerifyCAPA: (id: string) => void;
  onCloseCAPA: (id: string) => void;
}

export const CorrectiveActionsTab: React.FC<CorrectiveActionsTabProps> = ({ capas, onVerifyCAPA, onCloseCAPA }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = capas.filter((c) => {
    const matchSearch =
      c.actionNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedToName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getPriorityBadge = (priority: CAPAPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-amber-400" /> Tindakan Korektif & Preventif (CAPA Management)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen penugasan, batas waktu (due date), eskalasi keterlambatan, dan verifikasi penyelesaian
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-60">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari no. CAPA, penanggung jawab..."
              className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="OPEN">OPEN</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
        </div>
      </div>

      {/* CAPA List */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const isOverdue = c.status === 'OVERDUE';
          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 backdrop-blur-md space-y-3 shadow-lg transition-all ${
                isOverdue
                  ? 'border-rose-500/50 bg-rose-950/10'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-400 font-bold text-xs">{c.actionNumber}</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-300">
                    Sumber: {c.sourceNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getPriorityBadge(c.priority)}`}>
                    {c.priority}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isOverdue && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <AlertTriangle className="h-3 w-3" /> OVERDUE
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700">
                    {c.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{c.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{c.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Akar Masalah (Root Cause)</p>
                  <p className="text-slate-300 font-medium">{c.rootCause}</p>
                </div>

                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Penanggung Jawab & Tenggat</p>
                  <p className="text-white font-bold">{c.assignedToName} ({c.departmentName})</p>
                  <p className="text-[11px] text-slate-400">DueDate: {new Date(c.dueDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {/* Actions & Verification */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px]">Dibuat: {new Date(c.createdAt).toLocaleDateString('id-ID')}</span>

                <div className="flex items-center gap-2">
                  {c.status === 'PENDING_VERIFICATION' && (
                    <button
                      onClick={() => onVerifyCAPA(c.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> Verifikasi CAPA
                    </button>
                  )}
                  {c.status !== 'CLOSED' && (
                    <button
                      onClick={() => onCloseCAPA(c.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                    >
                      Tutup (Close)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
