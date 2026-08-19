/**
 * Fleet Intelligence Smart AI - Total Operating Cost (TOC) Intelligence View
 * PROMPT 37 - Fixed vs Variable Cost Architecture, Category Breakdown & Financial Structure
 */

import React, { useState, useMemo } from 'react';
import {
  PieChart as PieChartIcon,
  Layers,
  DollarSign,
  TrendingUp,
  Percent,
  Shield,
  Fuel,
  Wrench,
  Users,
  CreditCard,
  Building2,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const OperatingCostTOCView: React.FC = () => {
  const { totalOperatingCostSummary, categories, costRecords, setIsAddCostModalOpen } = useCost();
  const [selectedCostType, setSelectedCostType] = useState<'ALL' | 'FIXED' | 'VARIABLE' | 'SEMI_VARIABLE'>('ALL');

  // Fixed vs Variable vs Semi-Variable
  const { totalIdr, fixedTotalIdr, variableTotalIdr, semiVariableTotalIdr, byCategory } =
    totalOperatingCostSummary;

  const fixedPct = totalIdr > 0 ? Math.round((fixedTotalIdr / totalIdr) * 100) : 28;
  const variablePct = totalIdr > 0 ? Math.round((variableTotalIdr / totalIdr) * 100) : 62;
  const semiVariablePct = totalIdr > 0 ? 100 - fixedPct - variablePct : 10;

  // Donut data for TOC types
  const typeDonutData = [
    { name: 'Variable Costs (BBM, Tol, Ban)', value: variableTotalIdr || 264000000, color: '#06b6d4' },
    { name: 'Fixed Costs (Pajak, Asuransi, GPS, Depresiasi)', value: fixedTotalIdr || 120000000, color: '#3b82f6' },
    { name: 'Semi-Variable Costs (Lembur, Servis Darurat)', value: semiVariableTotalIdr || 44500000, color: '#f59e0b' },
  ];

  // Category breakdown table & chart data
  const categoryChartData = useMemo(() => {
    const list = [
      { name: 'BBM & Solar', key: 'FUEL', value: byCategory.FUEL || 184500000, color: '#06b6d4' },
      { name: 'Gaji & Driver', key: 'DRIVER', value: byCategory.DRIVER || 107500000, color: '#3b82f6' },
      { name: 'Pemeliharaan', key: 'MAINTENANCE', value: byCategory.MAINTENANCE || 56400000, color: '#f59e0b' },
      { name: 'Tol & Parkir', key: 'TOLL', value: byCategory.TOLL || 38200000, color: '#10b981' },
      { name: 'Ban & Velg', key: 'TYRES', value: byCategory.TYRES || 22400000, color: '#f97316' },
      { name: 'Asuransi & STNK', key: 'INSURANCE', value: (byCategory.INSURANCE || 8400000) + (byCategory.TAX || 6000000), color: '#8b5cf6' },
      { name: 'IoT & Telematics', key: 'GPS_DEVICE', value: byCategory.GPS_DEVICE || 5100000, color: '#ec4899' },
      { name: 'Lain-lain', key: 'OTHER', value: byCategory.OTHER || 8400000, color: '#64748b' },
    ];
    return list.sort((a, b) => b.value - a.value);
  }, [byCategory]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Cost Structure KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total TOC */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Operating Cost (TOC)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(totalIdr || 428500000)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Konsolidasi total belanja operasional periode berjalan
          </p>
        </div>

        {/* Variable Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya Variabel (Volumetrik)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {CostCalculationEngine.formatCurrencyIdr(variableTotalIdr || 264000000)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{variablePct}%</span>
            <span>dari total TOC (berfluktuasi dgn jarak & ritase)</span>
          </div>
        </div>

        {/* Fixed Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya Tetap (Fixed Cost)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {CostCalculationEngine.formatCurrencyIdr(fixedTotalIdr || 120000000)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-blue-400 font-semibold">{fixedPct}%</span>
            <span>dari total TOC (tetap terbebani walau armada idle)</span>
          </div>
        </div>

        {/* Semi-Variable Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya Semi-Variabel</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {CostCalculationEngine.formatCurrencyIdr(semiVariableTotalIdr || 44500000)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{semiVariablePct}%</span>
            <span>dari total TOC (lembur & perbaikan darurat)</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Pareto / Ranking Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Distribusi Belanja Berdasarkan Kategori Biaya</h3>
              <p className="text-xs text-slate-400 mt-0.5">Analisis porsi pos anggaran dalam operasional armada</p>
            </div>
            <button
              onClick={() => setIsAddCostModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Biaya</span>
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: 15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  formatter={(val: number) => [CostCalculationEngine.formatCurrencyIdr(val), 'Total Belanja']}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Structure Donut */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Struktur Karakter Biaya</h3>
            <p className="text-xs text-slate-400 mt-0.5">Variabel vs Tetap vs Semi-Variabel</p>
          </div>

          <div className="h-48 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  formatter={(val: number) => [CostCalculationEngine.formatCurrencyIdr(val), 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {typeDonutData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name.split(' ')[0]} {item.name.split(' ')[1]}</span>
                </div>
                <span className="text-white font-mono font-semibold">
                  {totalIdr > 0 ? `${Math.round((item.value / totalIdr) * 100)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Ledger & Management Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Daftar Pos Kategori Biaya & Ambang Batas Approval
            </h4>
            <p className="text-[11px] text-slate-400">
              Pengaturan sifat biaya dan batas nominal transaksi yang memerlukan persetujuan manajemen
            </p>
          </div>
          <span className="text-xs text-slate-400">{categories.length} Pos Kategori Aktif</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Nama Pos Kategori</th>
                <th className="py-3 px-4">Sifat Beban</th>
                <th className="py-3 px-4 text-right">Ambang Approval (Threshold)</th>
                <th className="py-3 px-4 text-right">Realisasi Pengeluaran</th>
                <th className="py-3 px-4 text-right">Porsi TOC</th>
                <th className="py-3 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {categories.map((cat) => {
                const catSpent = byCategory[cat.key] || 0;
                const pct = totalIdr > 0 ? ((catSpent / totalIdr) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.colorHex }}
                        />
                        <span className="font-semibold text-white">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {cat.defaultType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-400">
                      {CostCalculationEngine.formatCurrencyIdr(cat.requiresApprovalThreshold)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {CostCalculationEngine.formatCurrencyIdr(catSpent)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-cyan-400 font-medium">
                      {pct}%
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{cat.description}</td>
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
