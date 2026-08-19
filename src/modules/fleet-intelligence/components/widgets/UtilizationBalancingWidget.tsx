/**
 * Fleet Intelligence Smart AI - Utilization & Balancing Widget (Prompt 28)
 */

import React from 'react';
import { Gauge, TrendingUp, AlertTriangle, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FleetUtilizationData } from '../../types';

interface UtilizationBalancingWidgetProps {
  utilization: FleetUtilizationData;
  onExplainUtilization?: () => void;
  onSelectVehicle?: (vehicleId: string) => void;
}

export const UtilizationBalancingWidget: React.FC<UtilizationBalancingWidgetProps> = ({
  utilization,
  onExplainUtilization,
  onSelectVehicle,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Gauge className="h-4 w-4 text-cyan-400" />
            <span>Fleet Utilization & Load Balancing</span>
          </h3>
          <p className="text-xs text-slate-400">
            {utilization.formulaDescription}
          </p>
        </div>

        {onExplainUtilization && (
          <button
            onClick={onExplainUtilization}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explain with AI</span>
          </button>
        )}
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Tingkat Utilisasi</span>
          <span className="text-2xl font-black font-mono text-cyan-400">{utilization.utilizationRate}%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Kategori: {utilization.category}</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Armada Bergerak</span>
          <span className="text-2xl font-black font-mono text-emerald-400">{utilization.activeVehicles} Unit</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">dari {utilization.totalVehicles} total</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Total Jam Kerja</span>
          <span className="text-2xl font-black font-mono text-white">{utilization.totalDrivingHours} Jam</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Trip: {utilization.totalTripHours} Jam</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-center">
          <span className="text-[11px] text-slate-400 block">Ketersediaan Armada</span>
          <span className="text-2xl font-black font-mono text-amber-400">{utilization.averageAvailabilityPercent}%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{utilization.idleVehicles} Unit Idle</span>
        </div>
      </div>

      {/* Balancing & AI Recommendations */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5 mb-4">
        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-1.5">
          <Sparkles className="h-4 w-4" />
          <span>AI Load Balancing Assistant</span>
        </span>
        <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
          {utilization.balancingRecommendation.summary}
        </p>
        <ul className="space-y-1">
          {utilization.balancingRecommendation.suggestedActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Underutilized vs Overutilized Vehicles Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Underutilized (< 30%) */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span>Kendaraan Kurang Dimanfaatkan (Underutilized &lt; 30%)</span>
          </span>
          <div className="space-y-2">
            {utilization.underutilizedVehicles.map((v) => (
              <div key={v.vehicleId} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => onSelectVehicle?.(v.vehicleId)}
                    className="font-mono font-bold text-cyan-400 hover:underline"
                  >
                    {v.plateNumber}
                  </button>
                  <span className="font-mono font-semibold text-rose-400">Utilisasi: {v.utilizationPercent}%</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-1">{v.recommendedAction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Overutilized (> 85%) */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>Kendaraan Beban Sangat Tinggi (Overutilized &gt; 85%)</span>
          </span>
          <div className="space-y-2">
            {utilization.overutilizedVehicles.map((v) => (
              <div key={v.vehicleId} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => onSelectVehicle?.(v.vehicleId)}
                    className="font-mono font-bold text-amber-400 hover:underline"
                  >
                    {v.plateNumber}
                  </button>
                  <span className="font-mono font-semibold text-amber-300">Utilisasi: {v.utilizationPercent}%</span>
                </div>
                <div className="space-y-0.5 text-[11px] text-slate-400">
                  {v.potentialRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-slate-400">
                      <span className="text-amber-500">•</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
