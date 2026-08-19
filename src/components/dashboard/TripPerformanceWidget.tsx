/**
 * Fleet Intelligence Smart AI - Trip & Operational Performance Widget
 * PROMPT 8 - Trip Progress Breakdown, On-Time Performance & Distance Metrics
 */

import React from 'react';
import { 
  Navigation2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { TripSummary } from '../../types/dashboard';
import { formatNumberIdr } from '../../services/dashboardService';

interface TripPerformanceWidgetProps {
  summary: TripSummary | null;
  isLoading: boolean;
  onOpenTripsPage: () => void;
}

export const TripPerformanceWidget: React.FC<TripPerformanceWidgetProps> = ({
  summary,
  isLoading,
  onOpenTripsPage,
}) => {
  if (isLoading || !summary) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 animate-pulse h-64">
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
        <div className="grid grid-cols-4 gap-2 h-16 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl h-full space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Navigation2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Trips & Performa Operasional SPJ</h3>
            <p className="text-[11px] text-slate-400">Monitoring status surat perintah jalan (SPJ) & estimasi kedatangan (ETA)</p>
          </div>
        </div>

        <button
          onClick={onOpenTripsPage}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
        >
          <span>Buka SPJ Trips</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Operational Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 items-center">
        {/* On-Time Performance Metric */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On-Time Performance</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-cyan-400">{summary.onTimePerformancePercent}%</span>
          </div>
          <p className="text-[10px] text-slate-400">Target ketepatan waktu pengiriman logistik</p>
        </div>

        {/* Distance & Utilization Grid */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-2.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Jarak Tempuh Hari Ini</span>
            <span className="text-base font-black text-white">{formatNumberIdr(summary.distanceTodayKm)} KM</span>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-2.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Utilisasi Armada</span>
            <span className="text-base font-black text-emerald-400">{summary.fleetUtilizationPercent}%</span>
          </div>
        </div>
      </div>

      {/* Trip Status Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">In Progress</span>
            <span className="font-bold text-white">{summary.inProgress} Trips</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Completed</span>
            <span className="font-bold text-white">{summary.completed} Trips</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Delayed</span>
            <span className="font-bold text-amber-400">{summary.delayed} Trips</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800 p-2.5 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
            <Navigation2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Scheduled</span>
            <span className="font-bold text-white">{summary.scheduled} Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
