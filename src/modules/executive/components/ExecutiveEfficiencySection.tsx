/**
 * Fleet Intelligence Smart AI - Executive Fleet Efficiency Section
 * PROMPT 38 - Utilization, Availability, Active %, Idle %, Downtime % & Fleet Health Classification
 */

import React, { useState } from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Gauge,
  Truck,
  RotateCcw,
  Layers,
} from 'lucide-react';

export const ExecutiveEfficiencySection: React.FC = () => {
  const { efficiency } = useExecutive();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HEALTHY' | 'ATTENTION' | 'WARNING' | 'CRITICAL'>('ALL');

  const health = efficiency.healthCounts;

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Fleet Efficiency & Availability Index
            </h3>
            <p className="text-xs text-slate-500">
              Tingkat kesiapan, pemanfaatan ritase, dan klasifikasi kesehatan unit armada.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span>Skor Efisiensi:</span>
          <strong className="text-blue-600 font-bold text-sm">{efficiency.efficiencyScore}%</strong>
        </div>
      </div>

      {/* Metrics Row: 5 Key Performance Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Fleet Utilization
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-slate-900">{efficiency.fleetUtilizationRate}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target: &gt;85% (Optimal)</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Vehicle Availability
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-emerald-600">{efficiency.vehicleAvailabilityRate}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Siap Operasi di Pool</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Vehicles
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-blue-600">{efficiency.vehicleActivePct}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sedang Jalan / Muat</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Engine Idle Rate
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-extrabold ${efficiency.idlePct > 15 ? 'text-amber-600' : 'text-slate-900'}`}>
              {efficiency.idlePct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Waktu Tunggu Mesin ON</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Downtime Rate
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-extrabold ${efficiency.downtimePct > 8 ? 'text-rose-600' : 'text-slate-900'}`}>
              {efficiency.downtimePct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Perbaikan & Grounded</p>
        </div>
      </div>

      {/* Fleet Health Classification Tier Cards */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Distribusi Kesehatan Unit Armada ({health.total} Total Unit)
          </span>
          <span className="text-[11px] text-slate-400">Klik kartu untuk menyaring daftar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Healthy Card */}
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'HEALTHY' ? 'ALL' : 'HEALTHY')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedFilter === 'HEALTHY'
                ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                : 'bg-emerald-50/30 border-emerald-200/70 hover:bg-emerald-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Healthy
              </span>
              <span className="text-xl font-black text-emerald-700">{health.healthy}</span>
            </div>
            <p className="text-[11px] text-emerald-700/80 mt-1">
              Unit siap jalan, sensor IoT normal, tidak ada isu overdue servis.
            </p>
          </button>

          {/* Attention Card */}
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'ATTENTION' ? 'ALL' : 'ATTENTION')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedFilter === 'ATTENTION'
                ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                : 'bg-blue-50/30 border-blue-200/70 hover:bg-blue-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Attention
              </span>
              <span className="text-xl font-black text-blue-700">{health.attention}</span>
            </div>
            <p className="text-[11px] text-blue-700/80 mt-1">
              Jadwal servis due soon (&lt;500 KM) atau durasi idle sedikit di atas target.
            </p>
          </button>

          {/* Warning Card */}
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'WARNING' ? 'ALL' : 'WARNING')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedFilter === 'WARNING'
                ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                : 'bg-amber-50/30 border-amber-200/70 hover:bg-amber-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Warning
              </span>
              <span className="text-xl font-black text-amber-700">{health.warning}</span>
            </div>
            <p className="text-[11px] text-amber-700/80 mt-1">
              Konsumsi BBM boros / deviasi kecepatan koridor sering terjadi.
            </p>
          </button>

          {/* Critical Card */}
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedFilter === 'CRITICAL'
                ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                : 'bg-rose-50/30 border-rose-200/70 hover:bg-rose-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Critical
              </span>
              <span className="text-xl font-black text-rose-700">{health.critical}</span>
            </div>
            <p className="text-[11px] text-rose-700/80 mt-1">
              Overdue servis kritis / grounded maintenance / anomali sensor BBM.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
