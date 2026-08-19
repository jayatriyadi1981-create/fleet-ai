/**
 * Fleet Intelligence Smart AI - Cost Trends & Budget Variance Intelligence View
 * PROMPT 37 - Budget Variance Analysis, Over-budget Alerts & Historical Spend Trajectory
 */

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const CostTrendsBudgetView: React.FC = () => {
  const { budgetVariances } = useCost();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filtered variances
  const filteredVariances = useMemo(() => {
    return budgetVariances.filter((b) => {
      if (selectedStatus === 'ALL') return true;
      return b.status === selectedStatus;
    });
  }, [budgetVariances, selectedStatus]);

  // Aggregated summary
  const summary = useMemo(() => {
    const totalBudget = budgetVariances.reduce((sum, b) => sum + b.budgetIdr, 0);
    const totalActual = budgetVariances.reduce((sum, b) => sum + b.actualIdr, 0);
    const totalForecast = budgetVariances.reduce((sum, b) => sum + b.forecastIdr, 0);
    const totalVariance = totalActual - totalBudget;
    const variancePercent = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

    const overBudgetCount = budgetVariances.filter((b) => b.status === 'OVER_BUDGET').length;

    return {
      totalBudget,
      totalActual,
      totalForecast,
      totalVariance,
      variancePercent,
      overBudgetCount,
    };
  }, [budgetVariances]);

  // Historical 6-month trend data
  const monthlyTrendData = [
    { month: 'Mar', actual: 395000000, budget: 410000000, forecast: 400000000 },
    { month: 'Apr', actual: 412000000, budget: 410000000, forecast: 410000000 },
    { month: 'Mei', actual: 438000000, budget: 415000000, forecast: 425000000 },
    { month: 'Jun', actual: 405000000, budget: 415000000, forecast: 410000000 },
    { month: 'Jul', actual: 420000000, budget: 415000000, forecast: 418000000 },
    { month: 'Agu (Bulan Ini)', actual: 428500000, budget: 415000000, forecast: 432000000 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Budget Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Anggaran (Budget)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.totalBudget)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Plafon anggaran resmi yang disetujui manajemen</p>
        </div>

        {/* Total Actual Spend */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Realisasi Pengeluaran (Actual)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {CostCalculationEngine.formatCurrencyIdr(summary.totalActual)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Total belanja operasional tercatat s.d saat ini</p>
        </div>

        {/* Net Variance */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Variansi Anggaran Bersih</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                summary.totalVariance > 0
                  ? 'bg-rose-500/10 text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {summary.totalVariance > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
          <div
            className={`text-2xl font-bold font-mono ${
              summary.totalVariance > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {summary.totalVariance > 0 ? '+' : ''}
            {CostCalculationEngine.formatCurrencyIdr(summary.totalVariance)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span
              className={`font-semibold ${summary.totalVariance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}
            >
              {summary.variancePercent > 0 ? '+' : ''}
              {summary.variancePercent.toFixed(1)}%
            </span>
            <span>vs total alokasi budget</span>
          </div>
        </div>

        {/* Over-budget categories count */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Kategori Melebihi Budget</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{summary.overBudgetCount} Pos Biaya</div>
          <p className="text-[11px] text-slate-400 mt-2">Memerlukan evaluasi efisiensi pengeluaran segera</p>
        </div>
      </div>

      {/* Monthly Actual vs Budget vs Forecast Multi-Line Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Tren Realisasi vs Target Anggaran (6 Bulan)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historis realisasi belanja bulanan, batas anggaran disetujui, dan estimasi akhir bulan
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyTrendData} margin={{ top: 10, right: 15, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                formatter={(val: number, name: string) => [CostCalculationEngine.formatCurrencyIdr(val), name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="actual" name="Realisasi Aktual" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Line
                type="monotone"
                dataKey="budget"
                name="Plafon Anggaran"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Proyeksi AI"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Variances Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Tabel Rincian Variansi per Kategori Anggaran
            </h4>
            <p className="text-[11px] text-slate-400">Analisis deviasi nominal dan persentase serapan belanja</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="UNDER_BUDGET">Di Bawah Anggaran (Efisien)</option>
              <option value="ON_TRACK">Sesuai Anggaran (On Track)</option>
              <option value="OVER_BUDGET">Melebihi Anggaran (Over)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Pos Kategori Biaya</th>
                <th className="py-3 px-4 text-right">Plafon Budget</th>
                <th className="py-3 px-4 text-right">Realisasi Aktual</th>
                <th className="py-3 px-4 text-right">Proyeksi AI</th>
                <th className="py-3 px-4 text-right">Selisih (Variance)</th>
                <th className="py-3 px-4 text-right">% Deviasi</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredVariances.map((b) => {
                const isOver = b.varianceIdr > 0;
                return (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{b.categoryLabel}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {CostCalculationEngine.formatCurrencyIdr(b.budgetIdr)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-cyan-400">
                      {CostCalculationEngine.formatCurrencyIdr(b.actualIdr)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {CostCalculationEngine.formatCurrencyIdr(b.forecastIdr)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      <span className={isOver ? 'text-rose-400' : 'text-emerald-400'}>
                        {isOver ? '+' : ''}
                        {CostCalculationEngine.formatCurrencyIdr(b.varianceIdr)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={isOver ? 'text-rose-400' : 'text-emerald-400'}>
                        {b.variancePercent > 0 ? '+' : ''}
                        {b.variancePercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'UNDER_BUDGET'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : b.status === 'ON_TRACK'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {b.status === 'UNDER_BUDGET' && 'Under Budget'}
                        {b.status === 'ON_TRACK' && 'On Track'}
                        {b.status === 'OVER_BUDGET' && 'Over Budget'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
