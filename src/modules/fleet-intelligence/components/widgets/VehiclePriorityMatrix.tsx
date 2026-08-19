/**
 * Fleet Intelligence Smart AI - Vehicle Priority Matrix (Prompt 28)
 * 2x2 Quadrant Matrix (Performance vs Risk)
 * Quadrant 1: High Performance, Low Risk (Star Fleet)
 * Quadrant 2: High Performance, High Risk (Overworked Risk - Potential Burnout)
 * Quadrant 3: Low Performance, Low Risk (Underutilized Potential)
 * Quadrant 4: Low Performance, High Risk (Critical Attention Required)
 */

import React from 'react';
import { ShieldAlert, Star, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { VehiclePerformanceItem } from '../../types';

interface VehiclePriorityMatrixProps {
  vehicles: VehiclePerformanceItem[];
  onSelectVehicle?: (vehicleId: string) => void;
  onExplainMatrix?: () => void;
}

export const VehiclePriorityMatrix: React.FC<VehiclePriorityMatrixProps> = ({
  vehicles,
  onSelectVehicle,
  onExplainMatrix,
}) => {
  // Categorize vehicles into 4 quadrants
  // Performance threshold = 75, Risk High threshold = (riskLevel === 'HIGH' || riskLevel === 'CRITICAL')
  const starFleet = vehicles.filter(
    (v) => v.performanceScore >= 75 && (v.riskLevel === 'LOW' || v.riskLevel === 'MEDIUM')
  );
  const overworked = vehicles.filter(
    (v) => v.performanceScore >= 75 && (v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL')
  );
  const underutilized = vehicles.filter(
    (v) => v.performanceScore < 75 && (v.riskLevel === 'LOW' || v.riskLevel === 'MEDIUM')
  );
  const criticalAttention = vehicles.filter(
    (v) => v.performanceScore < 75 && (v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL')
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Vehicle Priority Matrix (2×2 Performance vs Risk)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Pemetaan kuadran pintar untuk memprioritaskan alokasi perawatan dan beban armada
          </p>
        </div>

        {onExplainMatrix && (
          <button
            onClick={onExplainMatrix}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Matrix Insight</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Quadrant 2: High Performance, High Risk */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/15 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Overworked / Beban Tinggi ({overworked.length} Unit)</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              High Perf • High Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5">
            Utilisasi & produktivitas sangat tinggi namun berisiko keausan dini / fatigue.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {overworked.slice(0, 4).map((v) => (
              <button
                key={v.vehicleId}
                onClick={() => onSelectVehicle?.(v.vehicleId)}
                className="px-2 py-1 rounded bg-slate-900 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300 hover:bg-amber-950/60"
              >
                {v.plateNumber} ({v.performanceScore})
              </button>
            ))}
          </div>
        </div>

        {/* Quadrant 1: High Performance, Low Risk */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/15 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              <span>Star Fleet / Performa Prima ({starFleet.length} Unit)</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              High Perf • Low Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5">
            Kondisi operasional optimal, hemat BBM, dan kepatuhan servis sempurna.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {starFleet.slice(0, 4).map((v) => (
              <button
                key={v.vehicleId}
                onClick={() => onSelectVehicle?.(v.vehicleId)}
                className="px-2 py-1 rounded bg-slate-900 border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-300 hover:bg-emerald-950/60"
              >
                {v.plateNumber} ({v.performanceScore})
              </button>
            ))}
          </div>
        </div>

        {/* Quadrant 4: Low Performance, High Risk */}
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/15 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" />
              <span>Prioritas Kritis / Critical Attention ({criticalAttention.length} Unit)</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              Low Perf • High Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5">
            Performa buruk disertai risiko overdue servis, GPS offline, atau anomali fatal.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {criticalAttention.slice(0, 4).map((v) => (
              <button
                key={v.vehicleId}
                onClick={() => onSelectVehicle?.(v.vehicleId)}
                className="px-2 py-1 rounded bg-slate-900 border border-rose-500/40 text-[11px] font-mono font-bold text-rose-300 hover:bg-rose-950/60"
              >
                {v.plateNumber} ({v.performanceScore})
              </button>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Low Performance, Low Risk */}
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/15 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4" />
              <span>Underutilized / Potensi Utilisasi ({underutilized.length} Unit)</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              Low Perf • Low Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5">
            Kondisi kendaraan sehat namun jarang ditugaskan trip produktif.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {underutilized.slice(0, 4).map((v) => (
              <button
                key={v.vehicleId}
                onClick={() => onSelectVehicle?.(v.vehicleId)}
                className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300 hover:bg-cyan-950/60"
              >
                {v.plateNumber} ({v.performanceScore})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
