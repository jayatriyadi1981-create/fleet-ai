/**
 * Fleet Intelligence Smart AI - Fuel Cost Analysis Tab
 * Multi-dimensional financial analysis of fuel expenditure, cost per km,
 * cost per trip, avoidable fuel waste, and branch expenditure breakdown.
 */

import React from 'react';
import { FuelCostBreakdown } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Building2, Truck, Sparkles, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CostAnalysisTabProps {
  costBreakdown: FuelCostBreakdown;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const CostAnalysisTab: React.FC<CostAnalysisTabProps> = ({
  costBreakdown,
  onExplainWithAI,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Cost Summary Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Total Pengeluaran BBM</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              Rp {(costBreakdown.totalCostIdr / 1000000).toFixed(1)} Jt
            </span>
          </div>
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +{costBreakdown.changePercentage}% vs periode lalu
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Biaya Per Kilometer</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              Rp {costBreakdown.costPerKmIdr}
            </span>
            <span className="text-xs font-mono text-slate-400">/ km</span>
          </div>
          <span className="text-xs text-slate-400">Target armada: ≤ Rp 1.150/km</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Rata-rata Biaya Per Trip</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              Rp {(costBreakdown.costPerTripIdr / 1000).toFixed(0)} rb
            </span>
            <span className="text-xs font-mono text-slate-400">/ trip</span>
          </div>
          <span className="text-xs text-slate-400">Total 279 Perjalanan</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Potensi Pemborosan BBM</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              Rp {(costBreakdown.estimatedAvoidableWasteCostIdr / 1000000).toFixed(2)} Jt
            </span>
          </div>
          <span className="text-xs text-rose-400 font-semibold">Idling + Gas Agresif</span>
        </div>
      </div>

      {/* 2. Charts: Cost by Vehicle Type & Branch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by Vehicle Type */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-400" />
              Alokasi Biaya BBM Per Kategori Kendaraan
            </h4>
          </div>
          <div className="space-y-3">
            {costBreakdown.costByVehicleType.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.type}</span>
                  <span className="font-mono font-bold text-white">
                    Rp {(item.totalCostIdr / 1000000).toFixed(2)} Jt ({item.volumeLiters.toLocaleString()} L)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Biaya Operasional: Rp {item.avgCostPerKm}/km</span>
                  <span className="text-cyan-400">
                    {Math.round((item.totalCostIdr / costBreakdown.totalCostIdr) * 100)}% Total Fleet
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost by Branch */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              Distribusi Pengeluaran Per Cabang & Depo
            </h4>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBreakdown.costByBranch}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="branchName" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: number) => [`Rp ${(val / 1000000).toFixed(2)} Jt`, 'Total Biaya']}
                />
                <Bar dataKey="totalCostIdr" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            *HQ Jakarta mencatat alokasi terbesar (44.5%) sejalan dengan volume armada wingbox lintas provinsi.
          </p>
        </div>
      </div>

      {/* 3. Top Costliest Vehicles Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Kendaraan Dengan Biaya BBM Tertinggi</h4>
          <button
            onClick={() => onExplainWithAI('COST', 'Analisis Kendaraan Berbiaya BBM Tertinggi')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Cost Optimization Insights
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-4">KENDARAAN</th>
                <th className="py-3 px-3 text-right">TOTAL PENGELUARAN (IDR)</th>
                <th className="py-3 px-3 text-right">BIAYA PER KM</th>
                <th className="py-3 px-3 text-right">TOTAL DISTANSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {costBreakdown.topCostliestVehicles.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-white">{v.plateNumber}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    Rp {v.totalCostIdr.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                    Rp {v.costPerKm}/km
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">
                    {v.distanceKm.toLocaleString()} km
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
