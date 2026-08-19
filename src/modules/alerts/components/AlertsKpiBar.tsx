/**
 * Fleet Intelligence Smart AI - Alerts KPI Bar Component
 */

import React from 'react';
import { AlertKPIs } from '../types';
import {
  Bell,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface AlertsKpiBarProps {
  kpis: AlertKPIs;
  selectedSeverityFilter: string;
  onSelectSeverityFilter: (severity: string) => void;
}

export const AlertsKpiBar: React.FC<AlertsKpiBarProps> = ({
  kpis,
  selectedSeverityFilter,
  onSelectSeverityFilter,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* Active Alerts */}
      <button
        onClick={() => onSelectSeverityFilter('ALL')}
        className={`p-3 rounded-2xl border text-left transition-all ${
          selectedSeverityFilter === 'ALL'
            ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
          <span>Active Alerts</span>
          <Bell className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="text-xl font-bold text-white mt-1">{kpis.activeCount}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Semua Peringatan</div>
      </button>

      {/* Critical */}
      <button
        onClick={() => onSelectSeverityFilter('CRITICAL')}
        className={`p-3 rounded-2xl border text-left transition-all ${
          selectedSeverityFilter === 'CRITICAL'
            ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/20'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-rose-400 text-[10px] font-semibold uppercase">
          <span>Critical</span>
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>
        <div className="text-xl font-bold text-rose-400 mt-1">{kpis.criticalCount}</div>
        <div className="text-[10px] text-rose-300/60 mt-0.5">Perlu Tindakan</div>
      </button>

      {/* High */}
      <button
        onClick={() => onSelectSeverityFilter('HIGH')}
        className={`p-3 rounded-2xl border text-left transition-all ${
          selectedSeverityFilter === 'HIGH'
            ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/20'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-amber-400 text-[10px] font-semibold uppercase">
          <span>High</span>
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div className="text-xl font-bold text-amber-400 mt-1">{kpis.highCount}</div>
        <div className="text-[10px] text-amber-300/60 mt-0.5">Prioritas Tinggi</div>
      </button>

      {/* Medium */}
      <button
        onClick={() => onSelectSeverityFilter('MEDIUM')}
        className={`p-3 rounded-2xl border text-left transition-all ${
          selectedSeverityFilter === 'MEDIUM'
            ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-500/20'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-sky-400 text-[10px] font-semibold uppercase">
          <span>Medium</span>
          <Info className="w-3.5 h-3.5" />
        </div>
        <div className="text-xl font-bold text-sky-400 mt-1">{kpis.mediumCount}</div>
        <div className="text-[10px] text-sky-300/60 mt-0.5">Pengawasan Biasa</div>
      </button>

      {/* Low */}
      <button
        onClick={() => onSelectSeverityFilter('LOW')}
        className={`p-3 rounded-2xl border text-left transition-all ${
          selectedSeverityFilter === 'LOW'
            ? 'bg-slate-800 border-slate-600 shadow-lg'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold uppercase">
          <span>Low</span>
          <Info className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <div className="text-xl font-bold text-slate-300 mt-1">{kpis.lowCount}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Informasional</div>
      </button>

      {/* Acknowledged */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-left">
        <div className="flex items-center justify-between text-indigo-400 text-[10px] font-semibold uppercase">
          <span>Acknowledged</span>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <div className="text-xl font-bold text-indigo-300 mt-1">{kpis.acknowledgedCount}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Ditanggapi</div>
      </div>

      {/* Escalated */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-left">
        <div className="flex items-center justify-between text-purple-400 text-[10px] font-semibold uppercase">
          <span>Escalated</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
        <div className="text-xl font-bold text-purple-300 mt-1">{kpis.escalatedCount}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Dieskalasi</div>
      </div>

      {/* Avg SLA Time */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-left">
        <div className="flex items-center justify-between text-emerald-400 text-[10px] font-semibold uppercase">
          <span>Avg Response</span>
          <Clock className="w-3.5 h-3.5" />
        </div>
        <div className="text-xl font-bold text-emerald-400 mt-1">{kpis.avgResponseTimeMinutes} m</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Waktu Tanggap SLA</div>
      </div>
    </div>
  );
};
