/**
 * Fleet Intelligence Smart AI - Cost Per Kilometer (Cost / KM) Intelligence View
 * PROMPT 37 - Benchmark, Fleet Average Variance & Component-level Cost/KM
 */

import React, { useState, useMemo } from 'react';
import {
  Gauge,
  TrendingDown,
  TrendingUp,
  Search,
  Fuel,
  Wrench,
  Users,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Filter,
  BarChart3,
  Truck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const CostPerKmView: React.FC = () => {
  const { costPerKmMetrics, fleetAverageCostPerKm } = useCost();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'total' | 'variance' | 'mileage'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort metrics
  const processedMetrics = useMemo(() => {
    return costPerKmMetrics
      .filter((m) => {
        const matchSearch =
          m.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
        const matchBranch = selectedBranch === 'ALL' || m.branchName === selectedBranch;
        return matchSearch && matchStatus && matchBranch;
      })
      .sort((a, b) => {
        let valA = a.totalCostPerKm;
        let valB = b.totalCostPerKm;
        if (sortBy === 'variance') {
          valA = a.varianceVsFleetAvgPercent;
          valB = b.varianceVsFleetAvgPercent;
        } else if (sortBy === 'mileage') {
          valA = a.mileageKm;
          valB = b.mileageKm;
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [costPerKmMetrics, searchTerm, selectedStatus, selectedBranch, sortBy, sortOrder]);

  // Aggregated component averages per KM
  const componentAverages = useMemo(() => {
    const count = costPerKmMetrics.length || 1;
    const avgFuel = costPerKmMetrics.reduce((sum, m) => sum + m.fuelCostPerKm, 0) / count;
    const avgMaint = costPerKmMetrics.reduce((sum, m) => sum + m.maintenanceCostPerKm, 0) / count;
    const avgDriver = costPerKmMetrics.reduce((sum, m) => sum + m.driverCostPerKm, 0) / count;
    const avgOther = costPerKmMetrics.reduce((sum, m) => sum + m.otherCostPerKm, 0) / count;

    return {
      avgFuel,
      avgMaint,
      avgDriver,
      avgOther,
      total: avgFuel + avgMaint + avgDriver + avgOther,
    };
  }, [costPerKmMetrics]);

  // Chart data: stacked bar of top vehicles
  const chartData = processedMetrics.slice(0, 10).map((m) => ({
    name: m.vehiclePlate,
    BBM: m.fuelCostPerKm,
    Bengkel: m.maintenanceCostPerKm,
    Driver: m.driverCostPerKm,
    Lainnya: m.otherCostPerKm,
    Total: m.totalCostPerKm,
  }));

  const branchList = Array.from(new Set(costPerKmMetrics.map((m) => m.branchName)));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Benchmark KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fleet Average */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Fleet Benchmark (Rata-rata)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {CostCalculationEngine.formatCurrencyIdr(fleetAverageCostPerKm)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ KM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Target efisiensi standar operasi armada konsolidasian
          </p>
        </div>

        {/* Component: Fuel / KM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya BBM Rata-rata / KM</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(componentAverages.avgFuel)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ KM</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-blue-400 font-medium">
              {Math.round((componentAverages.avgFuel / componentAverages.total) * 100)}%
            </span>
            <span>dari total biaya per kilometer</span>
          </div>
        </div>

        {/* Component: Maintenance / KM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya Bengkel / KM</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(componentAverages.avgMaint)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ KM</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-amber-400 font-medium">
              {Math.round((componentAverages.avgMaint / componentAverages.total) * 100)}%
            </span>
            <span>dari total biaya per kilometer</span>
          </div>
        </div>

        {/* Component: Driver / KM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya Driver / KM</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(componentAverages.avgDriver)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ KM</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-purple-400 font-medium">
              {Math.round((componentAverages.avgDriver / componentAverages.total) * 100)}%
            </span>
            <span>dari total biaya per kilometer</span>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart with Fleet Average Reference Line */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Komposisi Biaya per KM per Kendaraan</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualisasi kontribusi BBM, pemeliharaan bengkel, supir, dan tol vs Benchmark Armada
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500" />
              <span className="text-slate-400">Fleet Avg Benchmark</span>
            </div>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `Rp ${val.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                formatter={(val: number, name: string) => [`Rp ${val.toLocaleString()}`, name]}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <ReferenceLine
                y={fleetAverageCostPerKm}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: `Benchmark Rp ${fleetAverageCostPerKm.toLocaleString()}`,
                  fill: '#ef4444',
                  fontSize: 11,
                  position: 'top',
                }}
              />
              <Bar dataKey="BBM" stackId="a" fill="#06b6d4" />
              <Bar dataKey="Bengkel" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Driver" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Lainnya" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Table with Filtering */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari plat nomor / tipe armada..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Cabang</option>
              {branchList.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Status Efisiensi</option>
              <option value="NORMAL">Normal / Efisien</option>
              <option value="WARNING">Peringatan (&gt;10% Avg)</option>
              <option value="HIGH">Tinggi (&gt;25% Avg)</option>
              <option value="CRITICAL">Kritis (&gt;40% Avg)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Urutkan:</span>
            <button
              onClick={() => {
                if (sortBy === 'total') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else {
                  setSortBy('total');
                  setSortOrder('desc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg border ${
                sortBy === 'total'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              Total Cost {sortBy === 'total' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'variance') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else {
                  setSortBy('variance');
                  setSortOrder('desc');
                }
              }}
              className={`px-2.5 py-1 rounded-lg border ${
                sortBy === 'variance'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              Variansi {sortBy === 'variance' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4 text-right">Odometer / Jarak</th>
                <th className="py-3 px-4 text-right">BBM / KM</th>
                <th className="py-3 px-4 text-right">Bengkel / KM</th>
                <th className="py-3 px-4 text-right">Driver / KM</th>
                <th className="py-3 px-4 text-right">Lainnya / KM</th>
                <th className="py-3 px-4 text-right">Total Cost / KM</th>
                <th className="py-3 px-4 text-right">Variansi vs Avg</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {processedMetrics.map((m) => {
                const isHigher = m.varianceVsFleetAvgPercent > 0;
                return (
                  <tr key={m.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-200">
                          <Truck className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{m.vehiclePlate}</span>
                          <span className="text-[10px] text-slate-500">{m.vehicleModel}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{m.branchName}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      {m.mileageKm.toLocaleString()} KM
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-cyan-400">
                      {CostCalculationEngine.formatCurrencyIdr(m.fuelCostPerKm)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-400">
                      {CostCalculationEngine.formatCurrencyIdr(m.maintenanceCostPerKm)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-400">
                      {CostCalculationEngine.formatCurrencyIdr(m.driverCostPerKm)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {CostCalculationEngine.formatCurrencyIdr(m.otherCostPerKm)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {CostCalculationEngine.formatCurrencyIdr(m.totalCostPerKm)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={`inline-flex items-center gap-0.5 font-semibold ${
                          isHigher ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isHigher ? '+' : ''}
                        {m.varianceVsFleetAvgPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          m.status === 'NORMAL'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : m.status === 'WARNING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : m.status === 'HIGH'
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {m.status}
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
