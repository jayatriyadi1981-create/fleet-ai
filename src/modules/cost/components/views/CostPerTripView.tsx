/**
 * Fleet Intelligence Smart AI - Cost Per Trip & Per Delivery Intelligence View
 * PROMPT 37 - Trip Economics, Tolls, Multi-drop Delivery & Route Efficiency
 */

import React, { useState, useMemo } from 'react';
import {
  Navigation,
  Search,
  DollarSign,
  Truck,
  MapPin,
  Package,
  Layers,
  Fuel,
  CreditCard,
  Building2,
  TrendingUp,
  ArrowRight,
  Receipt,
  FileSpreadsheet,
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
import { CostPerTripMetric } from '../../types';

export const CostPerTripView: React.FC = () => {
  const { costPerTripMetrics, fleetAverageCostPerTrip } = useCost();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string>('ALL');

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return costPerTripMetrics.filter((t) => {
      const matchSearch =
        t.tripCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRoute = selectedRoute === 'ALL' || t.routeName === selectedRoute;
      return matchSearch && matchRoute;
    });
  }, [costPerTripMetrics, searchTerm, selectedRoute]);

  // Aggregated totals
  const summary = useMemo(() => {
    const totalCost = filteredTrips.reduce((sum, t) => sum + t.totalCostIdr, 0);
    const totalFuel = filteredTrips.reduce((sum, t) => sum + t.fuelCostIdr, 0);
    const totalToll = filteredTrips.reduce((sum, t) => sum + t.tollCostIdr, 0);
    const totalDriver = filteredTrips.reduce((sum, t) => sum + t.driverCostIdr, 0);
    const totalDeliveries = filteredTrips.reduce((sum, t) => sum + t.deliveriesCount, 0);
    const totalKm = filteredTrips.reduce((sum, t) => sum + t.distanceKm, 0);

    const avgCostPerTrip = filteredTrips.length > 0 ? totalCost / filteredTrips.length : 0;
    const avgCostPerDrop = totalDeliveries > 0 ? totalCost / totalDeliveries : 0;
    const avgCostPerKm = totalKm > 0 ? totalCost / totalKm : 0;

    return {
      totalCost,
      totalFuel,
      totalToll,
      totalDriver,
      totalDeliveries,
      totalKm,
      avgCostPerTrip,
      avgCostPerDrop,
      avgCostPerKm,
      tripCount: filteredTrips.length,
    };
  }, [filteredTrips]);

  // Chart data: Top trips breakdown
  const chartData = filteredTrips.slice(0, 8).map((t) => ({
    name: t.tripCode,
    BBM: t.fuelCostIdr,
    UangJalan: t.driverCostIdr,
    Tol: t.tollCostIdr,
    AlokasiBengkel: t.maintenanceAllocatedIdr,
    Total: t.totalCostIdr,
  }));

  const routeList = Array.from(new Set(costPerTripMetrics.map((t) => t.routeName)));

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trip Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Pengeluaran Trip</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.totalCost)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{summary.tripCount} Perjalanan</span>
            <span>• {summary.totalKm.toLocaleString()} KM Total</span>
          </div>
        </div>

        {/* Avg Cost per Trip */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rata-rata Biaya / Trip</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {CostCalculationEngine.formatCurrencyIdr(summary.avgCostPerTrip)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Benchmark armada: {CostCalculationEngine.formatCurrencyIdr(fleetAverageCostPerTrip)}
          </p>
        </div>

        {/* Cost per Drop / Delivery Stop */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya per Titik Drop (Delivery)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {CostCalculationEngine.formatCurrencyIdr(summary.avgCostPerDrop)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>Total Deliveries: </span>
            <span className="text-white font-semibold">{summary.totalDeliveries} Titik Kirim</span>
          </div>
        </div>

        {/* Tolls & Direct Expenses */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Biaya Tol Trans-Jawa & Parkir</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.totalToll)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>BBM Trip: </span>
            <span className="text-cyan-400 font-medium">
              {CostCalculationEngine.formatCurrencyIdr(summary.totalFuel)}
            </span>
          </div>
        </div>
      </div>

      {/* Trip Economics Stacked Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Struktur Biaya per Trip Operasional</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rincian BBM aktual, uang jalan/supir, kartu tol elektronik, dan alokasi pemeliharaan berkala
            </p>
          </div>
          <span className="text-xs text-slate-400">8 Trip Terakhir</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 15, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                formatter={(val: number, name: string) => [CostCalculationEngine.formatCurrencyIdr(val), name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="BBM" stackId="a" fill="#06b6d4" />
              <Bar dataKey="UangJalan" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Tol" stackId="a" fill="#f59e0b" />
              <Bar dataKey="AlokasiBengkel" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode trip, armada, supir, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Koridor Rute</option>
              {routeList.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Total <span className="text-white font-semibold">{filteredTrips.length}</span> Trip Tercatat
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Trip Code</th>
                <th className="py-3 px-4">Kendaraan & Driver</th>
                <th className="py-3 px-4">Rute & Pelanggan</th>
                <th className="py-3 px-4 text-right">Jarak</th>
                <th className="py-3 px-4 text-right">BBM</th>
                <th className="py-3 px-4 text-right">Tol & Parkir</th>
                <th className="py-3 px-4 text-right">Supir & Tunj.</th>
                <th className="py-3 px-4 text-right">Total Trip</th>
                <th className="py-3 px-4 text-right">Cost / KM</th>
                <th className="py-3 px-4 text-right">Cost / Drop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredTrips.map((trip) => (
                <tr key={trip.tripId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-cyan-400 block">{trip.tripCode}</span>
                    <span className="text-[10px] text-slate-500">{trip.deliveriesCount} Titik Kirim</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{trip.vehiclePlate}</span>
                    <span className="text-[10px] text-slate-400">{trip.driverName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-200 block">{trip.routeName}</span>
                    <span className="text-[10px] text-slate-400">{trip.customerName}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200">
                    {trip.distanceKm.toLocaleString()} KM
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-400">
                    {CostCalculationEngine.formatCurrencyIdr(trip.fuelCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">
                    {CostCalculationEngine.formatCurrencyIdr(trip.tollCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-blue-400">
                    {CostCalculationEngine.formatCurrencyIdr(trip.driverCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {CostCalculationEngine.formatCurrencyIdr(trip.totalCostIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    {CostCalculationEngine.formatCurrencyIdr(trip.costPerKmIdr)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-emerald-400">
                    {trip.costPerDeliveryIdr
                      ? CostCalculationEngine.formatCurrencyIdr(trip.costPerDeliveryIdr)
                      : '-'}
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
