/**
 * Fleet Intelligence Smart AI - Branch Health Heatmap Widget (Prompt 28)
 */

import React from 'react';
import { Building2, Sparkles, AlertCircle, ArrowUpRight, CheckCircle } from 'lucide-react';
import { BranchHealthHeatmapItem } from '../../types';

interface BranchHealthHeatmapProps {
  branches: BranchHealthHeatmapItem[];
  onSelectBranch?: (branchId: string) => void;
  onCompareBranches?: () => void;
}

export const BranchHealthHeatmap: React.FC<BranchHealthHeatmapProps> = ({
  branches,
  onSelectBranch,
  onCompareBranches,
}) => {
  const getCategoryColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-400" />
            <span>Branch Health & Operational Heatmap</span>
          </h3>
          <p className="text-xs text-slate-400">
            Perbandingan performa kesehatan dan kepatuhan antar cabang operasional
          </p>
        </div>

        {onCompareBranches && (
          <button
            onClick={onCompareBranches}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Bandingkan Cabang</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {branches.map((b) => (
          <div
            key={b.branchId}
            onClick={() => onSelectBranch?.(b.branchId)}
            className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-900"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{b.branchName}</h4>
                <span className="text-[10px] text-slate-400">{b.city} • {b.vehiclesCount} Unit</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${getCategoryColor(b.healthScore)}`}>
                {b.healthScore}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-900 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Utilisasi:</span>
                <span className="font-semibold text-slate-200">{b.utilizationRate}%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Safety Score:</span>
                <span className="font-semibold text-emerald-400">{b.safetyScore}/100</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Anomali Terbuka:</span>
                <span className={`font-semibold ${b.anomaliesCount > 2 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {b.anomaliesCount} Kasus
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
