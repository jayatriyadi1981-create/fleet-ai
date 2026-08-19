/**
 * Fleet Intelligence Smart AI - Route Corridor Cost Intelligence View
 * PROMPT 37 - Route Profitability, Tolls, Fuel Consumption by Corridor
 */

import React, { useState, useMemo } from 'react';
import {
  GitFork,
  MapPin,
  Navigation,
  DollarSign,
  Gauge,
  CreditCard,
  Fuel,
  Award,
  Search,
  ArrowRight,
  TrendingUp,
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

export const RouteCostView: React.FC = () => {
  const { routeCostMetrics } = useCost();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered routes
  const filteredRoutes = useMemo(() => {
    return routeCostMetrics.filter(
      (r) =>
        r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [routeCostMetrics, searchTerm]);

  // Aggregated totals
  const summary = useMemo(() => {
    const totalCost = filteredRoutes.reduce((sum, r) => sum + r.totalCostIdr, 0);
    const totalTrips = filteredRoutes.reduce((sum, r) => sum + r.tripsCount, 0);
    const totalDistance = filteredRoutes.reduce((sum, r) => sum + r.distanceKm * r.tripsCount, 0);
    const totalToll = filteredRoutes.reduce((sum, r) => sum + r.tollCostIdr, 0);

    const avgCostPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;

    return {
      totalCost,
      totalTrips,
      totalDistance,
      totalToll,
      avgCostPerKm,
      routeCount: filteredRoutes.length,
    };
  }, [filteredRoutes]);

  // Chart data: stacked bar of route cost components
  const chartData = filteredRoutes.map((r) => ({
    name: r.routeName.replace('Koridor ', '').replace('Express', 'Exp'),
    BBM: r.fuelCostIdr,
    Tol: r.tollCostIdr,
    Driver: r.driverAllocatedIdr,
    Bengkel: r.maintenanceAllocatedIdr,
    Total: r.totalCostIdr,
    costPerKm: r.costPerKmIdr,
  }));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Route Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Beban Koridor Rute</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.totalCost)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{summary.routeCount} Koridor Aktif</span>
            <span>• {summary.totalTrips} Total Trips</span>
          </div>
        </div>

        {/* Avg Route Cost / KM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rata-rata Biaya Koridor / KM</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {CostCalculationEngine.formatCurrencyIdr(summary.avgCostPerKm)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Konsisten pada batas efisiensi trayek logistik
          </p>
        </div>

        {/* Total Toll Expenses */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Biaya Tol Trans-Jawa / Tol Kota</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.totalToll)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">
              {summary.totalCost > 0 ? `${Math.round((summary.totalToll / summary.totalCost) * 100)}%` : '0%'}
            </span>
            <span>dari total biaya koridor rute</span>
          </div>
        </div>

        {/* Most Efficient Route */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Koridor Ter-Efisien</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {filteredRoutes[0]?.routeName || 'Jakarta - Surabaya Express'}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">
              Skor: {filteredRoutes[0]?.efficiencyScore || 90}/100
            </span>
            <span>• {CostCalculationEngine.formatCurrencyIdr(filteredRoutes[0]?.costPerKmIdr || 4800)}/KM</span>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Alokasi Biaya per Koridor Rute Utama</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Komposisi belanja BBM, tarif tol, uang supir & alokasi servis per rute
            </p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 15, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
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
              <Bar dataKey="BBM" stackId="a" fill="#06b6d4" />
              <Bar dataKey="Tol" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Driver" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Bengkel" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Route Corridor Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari rute, asal, tujuan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <span className="text-xs text-slate-400">{filteredRoutes.length} Koridor Ditemukan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Nama Koridor Rute</th>
                <th className="py-3 px-4">Origin → Destination</th>
                <th className="py-3 px-4 text-right">Jarak Satu Arah</th>
                <th className="py-3 px-4 text-right">Frekuensi Trip</th>
                <th className="py-3 px-4 text-right">Total BBM</th>
                <th className="py-3 px-4 text-right">Total Tol</th>
                <th className="py-3 px-4 text-right">Total Biaya</th>
                <th className="py-3 px-4 text-right">Cost / KM</th>
                <th className="py-3 px-4 text-right">Cost / Trip</th>
                <th className="py-3 px-4 text-center">Skor Efisiensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredRoutes.map((r) => (
                <tr key={r.routeId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{r.routeName}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span>{r.origin}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                      <span>{r.destination}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200">{r.distanceKm} KM</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">{r.tripsCount}</td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-400">
                    {CostCalculationEngine.formatCurrencyIdr(r.fuelCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">
                    {CostCalculationEngine.formatCurrencyIdr(r.tollCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {CostCalculationEngine.formatCurrencyIdr(r.totalCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-300">
                    {CostCalculationEngine.formatCurrencyIdr(r.costPerKmIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200">
                    {CostCalculationEngine.formatCurrencyIdr(r.costPerTripIdr)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.efficiencyScore >= 88
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {r.efficiencyScore}/100
                    </span>
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
