/**
 * Fleet Intelligence Smart AI - Driver Safety Score Widget
 * PROMPT 8 - Safety Score Breakdown, Top Drivers & Drivers Requiring Attention
 */

import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  UserCheck, 
  AlertCircle, 
  Gauge, 
  Zap, 
  Clock, 
  ChevronRight,
  User
} from 'lucide-react';
import { DriverScoreSummary } from '../../types/dashboard';

interface DriverSafetyWidgetProps {
  summary: DriverScoreSummary | null;
  isLoading: boolean;
  onOpenDriverProfile: (driverId: string) => void;
  onOpenDriversList: () => void;
}

export const DriverSafetyWidget: React.FC<DriverSafetyWidgetProps> = ({
  summary,
  isLoading,
  onOpenDriverProfile,
  onOpenDriversList,
}) => {
  if (isLoading || !summary) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 animate-pulse h-80">
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
        <div className="h-24 bg-slate-800 rounded-xl" />
        <div className="h-32 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl h-full space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Driver Safety & Performance Score</h3>
            <p className="text-[11px] text-slate-400">Rata-rata skor pengemudi & analisis faktor risiko operasional</p>
          </div>
        </div>

        <button
          onClick={onOpenDriversList}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
        >
          Lihat Semua Driver
        </button>
      </div>

      {/* Main Score Banner & Factor Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 items-center">
        {/* Overall Average Score Badge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Driver Score</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-emerald-400">{summary.averageScore}</span>
            <span className="text-sm font-bold text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <TrendingUp className="h-3 w-3" />
            <span>↑ {summary.scoreTrendVsLastWeekPercent}% vs minggu lalu</span>
          </div>
        </div>

        {/* Safety Factors Overview Grid */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-2">
            <p className="text-[10px] text-slate-400">Overspeed Events</p>
            <p className="font-bold text-amber-400">{summary.factorBreakdown.speedingEvents} kejadian</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-2">
            <p className="text-[10px] text-slate-400">Harsh Braking</p>
            <p className="font-bold text-rose-400">{summary.factorBreakdown.harshBrakingEvents} kejadian</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-2">
            <p className="text-[10px] text-slate-400">Harsh Acceleration</p>
            <p className="font-bold text-sky-400">{summary.factorBreakdown.harshAccelerationEvents} kejadian</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-2">
            <p className="text-[10px] text-slate-400">Durasi Idle Berlebih</p>
            <p className="font-bold text-slate-300">{summary.factorBreakdown.excessiveIdleMinutes} Menit</p>
          </div>
        </div>
      </div>

      {/* Two Columns: Top Drivers & Drivers Requiring Attention */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Top Drivers */}
        <div className="space-y-2 rounded-xl bg-slate-950/60 border border-slate-800 p-3">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Top Drivers High Score</span>
          </h4>
          <div className="space-y-1.5">
            {summary.topDrivers.slice(0, 3).map((drv, idx) => (
              <div
                key={drv.id}
                onClick={() => onOpenDriverProfile(drv.id)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/60 hover:border-emerald-500/40 text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-slate-400 text-[11px] w-4">{idx + 1}.</span>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{drv.name}</p>
                    <p className="text-[10px] text-slate-400">{drv.tripsCompleted} Trips • {drv.assignedVehiclePlate}</p>
                  </div>
                </div>
                <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-xs">
                  {drv.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Drivers Requiring Attention */}
        <div className="space-y-2 rounded-xl bg-slate-950/60 border border-slate-800 p-3">
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Drivers Requiring Attention</span>
          </h4>
          <div className="space-y-1.5">
            {summary.driversAtRisk.slice(0, 2).map((drv) => (
              <div
                key={drv.id}
                onClick={() => onOpenDriverProfile(drv.id)}
                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/60 hover:border-amber-500/40 text-xs transition-colors cursor-pointer"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-white truncate">{drv.name}</p>
                    <span className="font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded text-[10px] border border-amber-500/20">
                      Score: {drv.score}
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-300 line-clamp-1">{drv.primaryRiskReason}</p>
                </div>
                <button className="shrink-0 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[10px] font-bold text-cyan-400 border border-slate-700">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
