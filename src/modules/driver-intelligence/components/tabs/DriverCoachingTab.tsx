/**
 * Driver Intelligence - Driver Coaching Tab
 * Scheduled coaching management, progress notes, and before/after score improvement tracking
 * PROMPT 21 Architecture
 */

import React, { useState } from 'react';
import { behaviorStore } from '../../services/behaviorStore';
import { CoachingStatus, DriverCoaching } from '../../types';
import {
  MessageSquare,
  Plus,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Filter,
  FileText,
} from 'lucide-react';

interface DriverCoachingTabProps {
  onOpenCreateCoaching: () => void;
}

export const DriverCoachingTab: React.FC<DriverCoachingTabProps> = ({
  onOpenCreateCoaching,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const coachings = behaviorStore.getCoachings();

  const filtered = coachings.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (st: CoachingStatus) => {
    switch (st) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'IN_PROGRESS':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'SCHEDULED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'CANCELLED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const handleComplete = (id: string) => {
    const after = prompt('Masukkan Skor Keselamatan Pengemudi Setelah Coaching (0-100):', '85');
    if (after) {
      behaviorStore.updateCoachingStatus(id, 'COMPLETED', parseInt(after) || 85, 'Sesi coaching selesai dilaksanakan dengan hasil positif.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-400" /> Program Coaching & Pendampingan Pengemudi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen jadwal instruksi, evaluasi performa pasca-coaching, dan pelacakan peningkatan skor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Semua Status Coaching</option>
            <option value="OPEN">Open</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={onOpenCreateCoaching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 text-xs font-bold shadow-md shadow-cyan-950 transition-all"
          >
            <Plus className="h-4 w-4" /> Schedule Coaching Baru
          </button>
        </div>
      </div>

      {/* Coaching List Cards */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-lg space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(c.status)}`}>
                    {c.status}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{c.category}</span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {c.id}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{c.recommendation}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <User className="h-3.5 w-3.5 text-cyan-400" /> Driver: {c.driverName}
                  </span>
                  •
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> Coach: {c.assignedToName}
                  </span>
                </p>
              </div>

              {/* Before vs After Score Delta */}
              <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">SKOR SEBELUM</span>
                  <span className="text-base font-bold text-amber-300">{c.beforeScore || '--'}</span>
                </div>

                <div className="text-center text-slate-500">➔</div>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">SKOR SESUDAH</span>
                  <span className="text-base font-bold text-emerald-400">{c.afterScore || '--'}</span>
                </div>

                {c.afterScore && c.beforeScore && (
                  <div className="pl-2 border-l border-slate-800 font-bold text-xs text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-4 w-4" /> +{c.afterScore - c.beforeScore}
                  </div>
                )}
              </div>
            </div>

            {/* Notes & Actions Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <p className="text-slate-400 italic">"{c.notes || 'Tidak ada catatan tambahan'}"</p>

              {c.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleComplete(c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Tandai Selesai (Complete)
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 font-semibold">
            Tidak ada sesi coaching yang sesuai filter
          </div>
        )}
      </div>
    </div>
  );
};
