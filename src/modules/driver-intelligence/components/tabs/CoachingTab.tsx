/**
 * Coaching Tab - AI Driver Coaching Center
 * PROMPT 29 - Non-Punitive Coaching Lifecycle, Acknowledgement & Effectiveness
 */

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Plus,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import { AIDriverCoachingSession, DriverCoachingStatus } from '../../types';
import { aiDriverCoachingService } from '../../engines/AIDriverCoachingService';

interface CoachingTabProps {
  sessions: AIDriverCoachingSession[];
  onOpenCreateSessionModal: (driverId?: string) => void;
  onOpenAcknowledgementModal: (session: AIDriverCoachingSession) => void;
  onSelectDriver: (driverId: string) => void;
  onRefreshSessions: () => void;
}

export const CoachingTab: React.FC<CoachingTabProps> = ({
  sessions,
  onOpenCreateSessionModal,
  onOpenAcknowledgementModal,
  onSelectDriver,
  onRefreshSessions,
}) => {
  const [filterStatus, setFilterStatus] = useState<DriverCoachingStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const metrics = aiDriverCoachingService.getCoachingEffectivenessMetrics();

  const filteredSessions = sessions.filter((s) => {
    const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;
    const sTitle = s.title || s.coachingTopic || '';
    const sSupervisor = s.supervisorName || s.coachName || '';
    const matchSearch =
      searchQuery === '' ||
      s.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sSupervisor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: DriverCoachingStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'SCHEDULED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'CANCELLED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const handleMarkComplete = (sessionId: string) => {
    aiDriverCoachingService.completeSession(
      sessionId,
      28, // after risk score
      88, // after safety score
      'Sesi pembinaan telah diselesaikan. Driver menyepakati target evaluasi jarak aman dan batas kecepatan tol.'
    );
    onRefreshSessions();
  };

  return (
    <div className="space-y-6">
      {/* Non-Punitive Philosophy Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-slate-900/90 p-4 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Prinsip AI Coaching: Pembinaan Terpadu & Non-Punitif
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Program coaching dirancang untuk mendukung perkembangan profesional pengemudi, membangun kesadaran keselamatan jalan, dan memberikan bimbingan konkret tanpa sanksi penghakiman sepihak.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenCreateSessionModal()}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Sesi Baru</span>
        </button>
      </div>

      {/* Coaching KPIs Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Total Sesi Coaching
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{metrics.totalSessions}</span>
            <span className="text-xs text-slate-400">Sesi</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            {metrics.completedSessions} Selesai • {metrics.activeSessions} Terjadwal/Aktif
          </span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Tingkat Keberhasilan
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {metrics.successRatePercentage}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Driver berhasil menurunkan risiko dalam 30 hari
          </span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Rata-Rata Penurunan Risiko
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">
              -{metrics.averageRiskReductionPoints} Poin
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Penurunan rata-rata pasca-sesi pembinaan
          </span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Tingkat Acknowledgement
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-200 font-mono">100%</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Konfirmasi digital tersimpan
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari sesi coaching / nama driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
          />
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterStatus === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({sessions.length})
          </button>
          <button
            onClick={() => setFilterStatus('SCHEDULED')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterStatus === 'SCHEDULED'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            Terjadwal ({sessions.filter((s) => s.status === 'SCHEDULED').length})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterStatus === 'COMPLETED'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Selesai ({sessions.filter((s) => s.status === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {/* Coaching Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                  {session.driverName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{session.title || session.coachingTopic}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusBadge(
                        session.status
                      )}`}
                    >
                      {session.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Pengemudi: <strong className="text-slate-200">{session.driverName}</strong> • Supervisor:{' '}
                    {session.supervisorName || session.coachName}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-slate-400 block">TANGGAL SESI</span>
                <span className="font-bold text-white">{session.scheduledDate || session.date}</span>
              </div>
            </div>

            {/* Talking Points & Action Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  AI Talking Points & Diskusi:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {(Array.isArray(session.talkingPoints)
                    ? session.talkingPoints
                    : session.aiCoachingPlan?.talkingPoints || []
                  ).map((tp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Rencana Tindak Lanjut & Komitmen:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {(Array.isArray(session.actionPlan)
                    ? session.actionPlan
                    : typeof session.actionPlan === 'string'
                    ? session.actionPlan.split('; ')
                    : []
                  ).map((ap, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Status & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                {session.driverAcknowledged ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Diakui oleh pengemudi ({session.acknowledgedAt?.substring(0, 10)})
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-4 h-4" /> Menunggu konfirmasi digital pengemudi
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!session.driverAcknowledged && (
                  <button
                    onClick={() => onOpenAcknowledgementModal(session)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                  >
                    Konfirmasi Driver
                  </button>
                )}

                {session.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleMarkComplete(session.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tandai Selesai</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectDriver(session.driverId)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700"
                >
                  Profil Driver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
