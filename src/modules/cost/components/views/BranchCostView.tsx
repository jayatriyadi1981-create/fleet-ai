/**
 * Fleet Intelligence Smart AI - Branch & Depot Cost Intelligence View
 * PROMPT 37 - Depot Benchmarking, Efficiency Ranking & Multi-Branch Cost Allocation
 */

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Truck,
  Users,
  Gauge,
  Navigation,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Award,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const BranchCostView: React.FC = () => {
  const { branchCostMetrics } = useCost();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'efficiency' | 'cost' | 'costPerKm'>('efficiency');

  // Filtered and sorted branch list
  const processedBranches = useMemo(() => {
    return branchCostMetrics
      .filter(
        (b) =>
          b.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'cost') return b.totalCostIdr - a.totalCostIdr;
        if (sortBy === 'costPerKm') return b.costPerKmIdr - a.costPerKmIdr;
        return b.costEfficiencyScore - a.costEfficiencyScore;
      });
  }, [branchCostMetrics, searchTerm, sortBy]);

  // Aggregate fleet summary across branches
  const summary = useMemo(() => {
    const totalCost = branchCostMetrics.reduce((sum, b) => sum + b.totalCostIdr, 0);
    const totalVehicles = branchCostMetrics.reduce((sum, b) => sum + b.vehicleCount, 0);
    const totalDrivers = branchCostMetrics.reduce((sum, b) => sum + b.driverCount, 0);
    const totalMileage = branchCostMetrics.reduce((sum, b) => sum + b.mileageKm, 0);
    const avgEfficiency =
      branchCostMetrics.reduce((sum, b) => sum + b.costEfficiencyScore, 0) / (branchCostMetrics.length || 1);

    return {
      totalCost,
      totalVehicles,
      totalDrivers,
      totalMileage,
      avgEfficiency: Math.round(avgEfficiency),
      branchCount: branchCostMetrics.length,
    };
  }, [branchCostMetrics]);

  // Bar chart comparing Cost / KM and Efficiency Score
  const chartData = branchCostMetrics.map((b) => ({
    name: b.branchName.replace('Depo ', '').replace('Cabang ', ''),
    costPerKm: b.costPerKmIdr,
    efficiencyScore: b.costEfficiencyScore,
    totalCostMilyar: Number((b.totalCostIdr / 1000000).toFixed(1)),
  }));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Branch Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost Across Branches */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Biaya Seluruh Cabang</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.totalCost)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{summary.branchCount} Depo Aktif</span>
            <span>• {summary.totalVehicles} Total Unit</span>
          </div>
        </div>

        {/* Average Branch Efficiency */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rata-rata Skor Efisiensi Cabang</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{summary.avgEfficiency}/100</div>
          <p className="text-[11px] text-slate-400 mt-2">
            Skor komposit produktivitas vs beban biaya operasional
          </p>
        </div>

        {/* Fleet Distance */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Akumulasi Jarak Tempuh Depo</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {summary.totalMileage.toLocaleString()} KM
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Didukung oleh {summary.totalDrivers} driver terdaftar</p>
        </div>

        {/* Best Performing Depot */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Depo Ter-Efisien (Rank #1)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {processedBranches[0]?.branchName || 'Cabang Surabaya'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">
              {processedBranches[0]?.costEfficiencyScore || 92} Poin
            </span>
            <span>• {CostCalculationEngine.formatCurrencyIdr(processedBranches[0]?.costPerKmIdr || 4850)}/KM</span>
          </div>
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Perbandingan Biaya per KM Antar Cabang & Depo</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluasi disparitas biaya logistik regional dan efisiensi konsumsi per kilometer
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('efficiency')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                sortBy === 'efficiency'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Sort: Skor Efisiensi
            </button>
            <button
              onClick={() => setSortBy('costPerKm')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                sortBy === 'costPerKm'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Sort: Cost/KM
            </button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `Rp ${val.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                formatter={(val: number, name: string) => [
                  name === 'costPerKm' ? CostCalculationEngine.formatCurrencyIdr(val) : val,
                  name === 'costPerKm' ? 'Cost / KM' : name,
                ]}
              />
              <Bar dataKey="costPerKm" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.costPerKm > 5500 ? '#f59e0b' : '#06b6d4'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari cabang atau kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <span className="text-xs text-slate-400">{processedBranches.length} Cabang Terdata</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Nama Depo / Cabang</th>
                <th className="py-3 px-4">Kota</th>
                <th className="py-3 px-4 text-center">Unit / Driver</th>
                <th className="py-3 px-4 text-right">Ritase Trip</th>
                <th className="py-3 px-4 text-right">Biaya BBM</th>
                <th className="py-3 px-4 text-right">Biaya Bengkel</th>
                <th className="py-3 px-4 text-right">Total Biaya</th>
                <th className="py-3 px-4 text-right">Cost / KM</th>
                <th className="py-3 px-4 text-center">Skor Efisiensi</th>
                <th className="py-3 px-4 text-center">Utilisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {processedBranches.map((b) => (
                <tr key={b.branchId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs">
                        #{b.efficiencyRank}
                      </div>
                      <span className="font-semibold text-white">{b.branchName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{b.city}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-white font-semibold">{b.vehicleCount}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-slate-300">{b.driverCount}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200">{b.tripsCount}</td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-400">
                    {CostCalculationEngine.formatCurrencyIdr(b.fuelCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">
                    {CostCalculationEngine.formatCurrencyIdr(b.maintenanceCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {CostCalculationEngine.formatCurrencyIdr(b.totalCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-cyan-300">
                    {CostCalculationEngine.formatCurrencyIdr(b.costPerKmIdr)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.costEfficiencyScore >= 85
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : b.costEfficiencyScore >= 75
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {b.costEfficiencyScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-200">
                    {b.utilizationRatePercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
