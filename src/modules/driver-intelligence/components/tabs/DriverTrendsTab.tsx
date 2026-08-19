/**
 * Driver Trends Tab - Multi-Period Trend & Risk Delta Analysis
 * PROMPT 29 - 7d / 30d / 90d Historical Trajectory & Verified Evidence
 */

import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { DriverIntelligenceFullProfile } from '../../engines/DriverIntelligenceService';
import { DriverIntelligencePeriod } from '../../types';

interface DriverTrendsTabProps {
  selectedProfile: DriverIntelligenceFullProfile;
  allDrivers: { id: string; name: string; vehiclePlate: string }[];
  onSelectDriverId: (id: string) => void;
  period: DriverIntelligencePeriod;
  onPeriodChange: (p: DriverIntelligencePeriod) => void;
}

export const DriverTrendsTab: React.FC<DriverTrendsTabProps> = ({
  selectedProfile,
  allDrivers,
  onSelectDriverId,
  period,
  onPeriodChange,
}) => {
  const trend = selectedProfile.trend;
  const history = trend.history;

  return (
    <div className="space-y-6">
      {/* Header with Driver & Period Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Analisis Tren & Perubahan Risiko (Trajectory)
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                trend.direction === 'IMPROVING'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : trend.direction === 'DECLINING'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Tren: {trend.direction}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Memonitor efektivitas perbaikan perilaku mengemudi setelah sesi coaching dan konsistensi keselamatan.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Period Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onPeriodChange('7_DAYS')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                period === '7_DAYS'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7H
            </button>
            <button
              onClick={() => onPeriodChange('30_DAYS')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                period === '30_DAYS'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30H
            </button>
            <button
              onClick={() => onPeriodChange('90_DAYS')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                period === '90_DAYS'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              90H
            </button>
          </div>

          {/* Driver Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedProfile.driverId}
              onChange={(e) => onSelectDriverId(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
            >
              {allDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.vehiclePlate})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Delta Comparison Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Skor Risiko Awal Periode
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-300 font-mono">
              {trend.score30DaysAgo}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Baseline awal periode evaluasi</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Skor Risiko Terkini
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black font-mono ${
                trend.scoreToday > 50 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {trend.scoreToday}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Evaluasi telemetri live hari ini</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
            Delta Perubahan Risiko
          </span>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span
              className={`text-2xl font-black ${
                trend.scoreChange < 0
                  ? 'text-emerald-400'
                  : trend.scoreChange > 0
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {trend.scoreChange > 0 ? `+${trend.scoreChange}` : trend.scoreChange} Poin
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {trend.scoreChange < 0
              ? 'Penurunan risiko keselamatan (Positif)'
              : trend.scoreChange > 0
              ? 'Peningkatan risiko (Memerlukan coaching)'
              : 'Profil stabil'}
          </span>
        </div>
      </div>

      {/* Trajectory Visual Table / Points */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Riwayat Titik Data Telematika ({history.length} Checkpoints)
            </h3>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <th className="py-2.5 px-3">TANGGAL</th>
                <th className="py-2.5 px-3">RISK SCORE</th>
                <th className="py-2.5 px-3">SAFETY SCORE</th>
                <th className="py-2.5 px-3">PERFORMA</th>
                <th className="py-2.5 px-3">INSIDEN TELEMETRI</th>
                <th className="py-2.5 px-3">JARAK TEMPUH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-300 font-semibold">{row.date}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-bold ${
                        row.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {row.riskScore}/100
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{row.safetyScore}/100</td>
                  <td className="py-2.5 px-3 text-cyan-400">{row.performanceScore}/100</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        row.eventCount > 3
                          ? 'bg-rose-500/20 text-rose-300 font-bold'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {row.eventCount} kejadian
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{row.distanceKm} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Trend Summary Narrative */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Analisis Tren AI Terpadu</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          {trend.riskChangeSummary}
        </p>
      </div>
    </div>
  );
};
