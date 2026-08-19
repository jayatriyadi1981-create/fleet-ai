/**
 * Fleet Intelligence Smart AI - Period Comparison Modal (Prompt 28)
 */

import React from 'react';
import { X, Sparkles, TrendingUp, TrendingDown, Minus, Calendar, ShieldCheck } from 'lucide-react';
import { PeriodComparisonData } from '../../types';

interface PeriodComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PeriodComparisonData;
}

export const PeriodComparisonModal: React.FC<PeriodComparisonModalProps> = ({
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
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Perbandingan Antar Periode Telematika</h3>
              <p className="text-xs text-slate-400">{data.periodCurrent} vs {data.periodPrevious}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* AI Explanation Summary */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span>AI Trend Interpretation</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {data.aiExplanation}
            </p>
          </div>

          {/* Metric Comparison Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3.5">Metrik Operasional</th>
                  <th className="py-2.5 px-3.5">Periode Saat Ini</th>
                  <th className="py-2.5 px-3.5">Periode Lalu</th>
                  <th className="py-2.5 px-3.5 text-right">Perubahan (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                {data.metrics.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-200">{m.name}</td>
                    <td className="py-2.5 px-3.5 font-mono text-cyan-300 font-bold">{m.currentValue}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-400">{m.previousValue}</td>
                    <td className="py-2.5 px-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        m.isPositiveChange ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {m.changePercent > 0 ? `+${m.changePercent}%` : `${m.changePercent}%`}
                      </span>
                    </td>
                  </tr>
                ))}
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
