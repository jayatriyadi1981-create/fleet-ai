/**
 * Fleet Intelligence Smart AI - Maintenance Cost Analysis Tab
 * Visualizes maintenance expenses, cost per KM, breakdown of spending by component,
 * and cost outliers exceeding fleet average thresholds.
 */

import React from 'react';
import { MaintenanceCostAnalysis } from '../../types';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  PieChart as PieIcon, 
  BarChart3, 
  Coins,
  Wrench
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface MaintenanceCostTabProps {
  costData: MaintenanceCostAnalysis;
}

export const MaintenanceCostTab: React.FC<MaintenanceCostTabProps> = ({ costData }) => {
  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Total Biaya Pemeliharaan YTD</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            Rp {costData.totalCostPeriod.toLocaleString('id-ID')}
          </span>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-400 font-semibold">
            <TrendingDown className="h-3.5 w-3.5" /> -{Math.abs(costData.costTrendPercentage)}% vs Periode Lalu
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Rata-rata Biaya per Kendaraan</span>
          <span className="text-2xl font-bold font-mono text-cyan-300 mt-1 block">
            Rp {costData.averageCostPerVehicle.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Target Efisiensi: &lt; Rp 18.000.000 / unit
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Rata-rata Cost Per KM</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-white">
              Rp {costData.averageCostPerKm.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400">/ km</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-2 block font-semibold">
            Standar Industri Logistik Indonesia: Rp 150/km
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Estimasi Kerugian Downtime Bengkel</span>
          <span className="text-2xl font-bold font-mono text-amber-300 mt-1 block">
            Rp {costData.downtimeCostEstimated.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Akumulasi {costData.totalDowntimeHours} Jam Kendaraan Tidak Operasi
          </span>
        </div>
      </div>

      {/* Charts: Cost by Component & Cost by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cost by Component */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            Distribusi Biaya per Komponen Suku Cadang
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData.costByComponent} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="componentName" stroke="#64748b" fontSize={10} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Total Biaya']}
                />
                <Bar dataKey="totalCost" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost by Maintenance Type */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-indigo-400" />
            Rasio Jenis Pemeliharaan (Preventif vs Korektif vs Breakdown)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData.costByMaintenanceType}
                  dataKey="cost"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {costData.costByMaintenanceType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Biaya']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Cost Outlier Vehicles */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          Kendaraan dengan Biaya Pemeliharaan Tertinggi (Cost Outliers)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Kendaraan</th>
                <th className="py-2.5 px-4 font-semibold">Cabang</th>
                <th className="py-2.5 px-4 font-semibold">Total Pengeluaran YTD</th>
                <th className="py-2.5 px-4 font-semibold">Cost Per KM</th>
                <th className="py-2.5 px-4 font-semibold">Selisih vs Rata-rata Armada</th>
                <th className="py-2.5 px-4 font-semibold">Faktor Pemicu Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {costData.topCostOutlierVehicles.map((outlier) => (
                <tr key={outlier.vehicleId} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-white">{outlier.plateNumber}</td>
                  <td className="py-3 px-4 text-slate-300">{outlier.branch}</td>
                  <td className="py-3 px-4 font-mono text-white font-semibold">
                    Rp {outlier.totalCost.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300">
                    Rp {outlier.costPerKm} / km
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-400">
                    +{outlier.percentageAboveAverage}% Di Atas Rata-rata
                  </td>
                  <td className="py-3 px-4 text-slate-300">{outlier.primaryCostDriver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
