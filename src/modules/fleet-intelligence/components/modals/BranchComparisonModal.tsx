/**
 * Fleet Intelligence Smart AI - Branch Comparison Modal (Prompt 28)
 */

import React from 'react';
import { X, Sparkles, Building2, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { BranchComparisonData } from '../../types';

interface BranchComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BranchComparisonData;
}

export const BranchComparisonModal: React.FC<BranchComparisonModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Komparasi Performa Antar Cabang</h3>
              <p className="text-xs text-slate-400">{data.branchA.name} vs {data.branchB.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Comparative Analysis */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span>AI Comparative Analysis</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {data.comparativeAnalysis}
            </p>
          </div>

          {/* Side-by-side Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3.5">Indikator</th>
                  <th className="py-2.5 px-3.5 text-cyan-300 font-bold">{data.branchA.name}</th>
                  <th className="py-2.5 px-3.5 text-amber-300 font-bold">{data.branchB.name}</th>
                  <th className="py-2.5 px-3.5 text-center">Keunggulan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3.5 font-medium text-slate-300">Fleet Health Score</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-white">{data.branchA.healthScore} / 100</td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-300">{data.branchB.healthScore} / 100</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                      +13 Poin (Cabang A)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3.5 font-medium text-slate-300">Tingkat Utilisasi</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-white">{data.branchA.utilization}%</td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-300">{data.branchB.utilization}%</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                      +18% (Cabang A)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3.5 font-medium text-slate-300">Efisiensi BBM</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-white">{data.branchA.fuelKmPerL} km/L</td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-300">{data.branchB.fuelKmPerL} km/L</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                      +0.47 km/L (Cabang A)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3.5 font-medium text-slate-300">Safety Score</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-white">{data.branchA.safetyScore} / 100</td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-300">{data.branchB.safetyScore} / 100</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                      +11 Poin (Cabang A)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3.5 font-medium text-slate-300">Anomali Terbuka</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-emerald-400">{data.branchA.anomaliesCount} Kasus</td>
                  <td className="py-2.5 px-3.5 font-mono text-rose-400 font-bold">{data.branchB.anomaliesCount} Kasus</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                      Lebih Sedikit (Cabang A)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
