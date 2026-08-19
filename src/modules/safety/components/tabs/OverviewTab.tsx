/**
 * Safety Overview Dashboard Tab
 * PROMPT 22 Section 4 & 5
 */

import React from 'react';
import { Accident, Incident, NearMiss, CorrectiveAction, Investigation, SafetyEvent } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  Search,
  Plus,
  FileText,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface OverviewTabProps {
  accidents: Accident[];
  incidents: Incident[];
  nearMisses: NearMiss[];
  capas: CorrectiveAction[];
  investigations: Investigation[];
  safetyEvents: SafetyEvent[];
  safetyScore: number;
  onOpenReportAccident: () => void;
  onOpenReportIncident: () => void;
  onOpenReportNearMiss: () => void;
  onOpenReportObservation: () => void;
  onSelectTab: (tabKey: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  accidents,
  incidents,
  nearMisses,
  capas,
  investigations,
  safetyEvents,
  safetyScore,
  onOpenReportAccident,
  onOpenReportIncident,
  onOpenReportNearMiss,
  onOpenReportObservation,
  onSelectTab
}) => {
  const openInvestigationsCount = investigations.filter(i => i.status !== 'CLOSED').length;
  const openCapasCount = capas.filter(c => c.status !== 'CLOSED' && c.status !== 'VERIFIED').length;
  const overdueCapasCount = capas.filter(c => c.status === 'OVERDUE').length;

  return (
    <div className="space-y-6">
      {/* Quick Action Floating Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Safety Quick Reporting</h3>
            <p className="text-[11px] text-slate-400">Laporkan insiden atau potensi bahaya secara cepat berbasis GPS</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenReportAccident}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-all shadow-md shadow-rose-950"
          >
            <Plus className="h-4 w-4" />
            <span>+ Lapor Kecelakaan</span>
          </button>
          <button
            onClick={onOpenReportIncident}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-950"
          >
            <Plus className="h-4 w-4" />
            <span>+ Lapor Insiden</span>
          </button>
          <button
            onClick={onOpenReportNearMiss}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-950"
          >
            <Plus className="h-4 w-4" />
            <span>+ Lapor Near Miss</span>
          </button>
          <button
            onClick={onOpenReportObservation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Observasi Safety</span>
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div
          onClick={() => onSelectTab('accidents')}
          className="rounded-2xl border border-rose-500/30 bg-slate-900/80 p-4 backdrop-blur-md cursor-pointer hover:border-rose-500 transition-all shadow-lg"
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Kecelakaan (Accidents)</p>
          <p className="text-2xl font-extrabold text-rose-400 mt-1">{accidents.length}</p>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-rose-400 font-bold">● High Risk</span> 12 Kasus
          </p>
        </div>

        <div
          onClick={() => onSelectTab('incidents')}
          className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-4 backdrop-blur-md cursor-pointer hover:border-amber-500 transition-all shadow-lg"
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Insiden (Incidents)</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{incidents.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">28 Kejadian Operasional</p>
        </div>

        <div
          onClick={() => onSelectTab('near-miss')}
          className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-4 backdrop-blur-md cursor-pointer hover:border-cyan-500 transition-all shadow-lg"
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Near Miss</p>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">{nearMisses.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">46 Hampir Celaka</p>
        </div>

        <div
          onClick={() => onSelectTab('investigations')}
          className="rounded-2xl border border-purple-500/30 bg-slate-900/80 p-4 backdrop-blur-md cursor-pointer hover:border-purple-500 transition-all shadow-lg"
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Penyelidikan Aktif</p>
          <p className="text-2xl font-extrabold text-purple-400 mt-1">{openInvestigationsCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Team Assigned</p>
        </div>

        <div
          onClick={() => onSelectTab('corrective-actions')}
          className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-4 backdrop-blur-md cursor-pointer hover:border-amber-500 transition-all shadow-lg"
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Open CAPA</p>
          <p className="text-2xl font-extrabold text-amber-300 mt-1">{openCapasCount}</p>
          <p className="text-[10px] text-rose-400 font-bold mt-1">{overdueCapasCount} Overdue</p>
        </div>

        <div
          onClick={() => onSelectTab('score')}
          className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4 backdrop-blur-md cursor-pointer hover:border-emerald-500 transition-all shadow-lg"
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Fleet Safety Score</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{safetyScore} / 100</p>
          <p className="text-[10px] text-emerald-300 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +4.2% (Safe Fleet)
          </p>
        </div>
      </div>

      {/* Overview Dashboard Content: Safety Score Trend & Risk Hotspots */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Risk Hotspots & Live Telemetry Safety Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Risk Hotspots & Pemetaan Hazard Lokasi</h3>
              </div>
              <button
                onClick={() => onSelectTab('analytics')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Lihat Analitik Penuh <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Hotspot List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">HOTSPOT 1 (Tinggi)</p>
                <p className="font-bold text-white mt-1 text-xs">Tol Jakarta-Cikampek KM 26A</p>
                <p className="text-[11px] text-rose-400 font-semibold mt-1">8 Kejadian Pengereman Mendadak</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">HOTSPOT 2 (Sedang)</p>
                <p className="font-bold text-white mt-1 text-xs">Pantura Subang KM 104</p>
                <p className="text-[11px] text-amber-400 font-semibold mt-1">4 Peringatan Fatigue Driver</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">HOTSPOT 3 (Ringan)</p>
                <p className="font-bold text-white mt-1 text-xs">Loading Dock Cikarang</p>
                <p className="text-[11px] text-cyan-400 font-semibold mt-1">2 Near Miss Manuver Mundur</p>
              </div>
            </div>
          </div>

          {/* Recent Safety Events Telemetry Log */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" /> Deteksi Event Telemetri Otomatis (Real-Time Safety Events)
              </h3>
            </div>

            <div className="space-y-2.5">
              {safetyEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 font-bold text-[10px] border border-rose-500/20">
                      {ev.confidenceScore}%
                    </span>
                    <div>
                      <p className="font-bold text-white">{ev.eventType} • {ev.vehiclePlate}</p>
                      <p className="text-[11px] text-slate-400">{ev.driverName} • {new Date(ev.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ev.status}
                    </span>
                    {ev.linkedAccidentId && (
                      <button
                        onClick={() => onSelectTab('accidents')}
                        className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-bold hover:underline"
                      >
                        Terhubung Kecelakaan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Open Investigations & Safety Score Component */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" /> Penyelidikan Aktif (Open Investigations)
            </h3>

            <div className="space-y-3">
              {investigations.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onSelectTab('investigations')}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">{inv.investigationNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {inv.status}
                    </span>
                  </div>
                  <p className="font-bold text-white leading-snug">{inv.summary}</p>
                  <p className="text-[11px] text-slate-400">Lead: {inv.leadInvestigatorName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
