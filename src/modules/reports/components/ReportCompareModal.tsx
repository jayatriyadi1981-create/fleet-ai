/**
 * Fleet Intelligence Smart AI - Comparative Period Analytics Modal
 * PROMPT 39 - Side-by-side Variance Modeling & Comparative AI Insights
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import { ReportComparisonService } from '../services/ReportComparisonService';
import {
  GitCompare,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ReportCompareModal: React.FC = () => {
  const { isCompareModalOpen, setIsCompareModalOpen } = useReports();

  const [periodA, setPeriodA] = useState('Agustus 2026 (Bulan Ini)');
  const [periodB, setPeriodB] = useState('Juli 2026 (Bulan Lalu)');

  if (!isCompareModalOpen) return null;

  const comparison = ReportComparisonService.comparePeriods(periodA, periodB);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Komparasi Performa Lintas Periode</h3>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>

        {/* Period Selector Controls */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Periode Utama (A)</label>
            <select
              value={periodA}
              onChange={e => setPeriodA(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="Agustus 2026 (Bulan Ini)">Agustus 2026 (Bulan Ini)</option>
              <option value="Minggu Ini (W33 2026)">Minggu Ini (W33 2026)</option>
              <option value="Kuartal 3 (Q3 2026)">Kuartal 3 (Q3 2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Periode Pembanding (B)</label>
            <select
              value={periodB}
              onChange={e => setPeriodB(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              <option value="Juli 2026 (Bulan Lalu)">Juli 2026 (Bulan Lalu)</option>
              <option value="Minggu Lalu (W32 2026)">Minggu Lalu (W32 2026)</option>
              <option value="Kuartal 2 (Q2 2026)">Kuartal 2 (Q2 2026)</option>
            </select>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>AI Comparative Synthesis</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-serif">
            {comparison.aiComparisonInsight}
          </p>
        </div>

        {/* Metrics Variance Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Indikator Kinerja</th>
                <th className="py-2.5 px-3 text-right">{comparison.periodA.label}</th>
                <th className="py-2.5 px-3 text-right">{comparison.periodB.label}</th>
                <th className="py-2.5 px-3 text-right">Variansi (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {comparison.metrics.map(m => {
                const isPositive = m.isPositiveGood ? m.variancePct >= 0 : m.variancePct <= 0;
                return (
                  <tr key={m.key} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-white">{m.label}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-cyan-300">
                      {m.format === 'currency' ? `Rp ${m.valueA.toLocaleString('id-ID')}` :
                       m.format === 'percentage' ? `${m.valueA}%` : m.valueA}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                      {m.format === 'currency' ? `Rp ${m.valueB.toLocaleString('id-ID')}` :
                       m.format === 'percentage' ? `${m.valueB}%` : m.valueB}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <span className={`flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.variancePct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{m.variancePct >= 0 ? `+${m.variancePct}%` : `${m.variancePct}%`}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
