/**
 * Fleet Intelligence Smart AI - Maintenance Cost & Budget Analytics Tab
 * PROMPT 25 - Finance Integration, Cost per KM & Total Operating Cost
 */

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Building,
  Fuel,
  Wrench,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { MOCK_BUDGETS, MOCK_OVERVIEW_KPIS, MOCK_VEHICLE_HEALTH } from '../../data/mockMaintenanceData';

export const CostTab: React.FC = () => {
  const kpi = MOCK_OVERVIEW_KPIS;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-cyan-400" />
          Analisis Finansial, Biaya Pemeliharaan & Anggaran Depo
        </h2>
        <p className="text-xs text-slate-400">
          Integrasi penuh dengan modul Finance & BBM: Pelacakan Cost per KM, rasio Preventive vs Corrective, dan Realisasi Budget per Cabang.
        </p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Biaya Pemeliharaan (YTD)</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            Rp {(kpi.totalMaintenanceCost / 1000000).toFixed(0)} Juta
          </p>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span>Spare Parts: <strong className="text-cyan-300">Rp {(kpi.partsCost / 1000000).toFixed(0)} Jt</strong></span>
            <span>Jasa: <strong className="text-purple-300">Rp {(kpi.laborCost / 1000000).toFixed(0)} Jt</strong></span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rata-rata Biaya / KM</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            Rp {kpi.avgCostPerKm.toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-slate-500 mt-2 block">
            Target Efisiensi: &lt; Rp 2.200 / KM
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rasio Preventive vs Corrective</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400">60.5%</span>
            <span className="text-xs text-slate-400">/ 39.5%</span>
          </div>
          <div className="w-full bg-amber-500 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-500 h-full" style={{ width: '60.5%' }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Ideal: &gt; 70% Preventive</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rata-rata Biaya / Kendaraan</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            Rp {(kpi.avgCostPerVehicle / 1000000).toFixed(1)} Juta
          </p>
          <span className="text-[10px] text-slate-500 mt-2 block">
            Total 24 Unit Armada Aktif
          </span>
        </div>
      </div>

      {/* Branch Budget vs Actual Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building className="h-4 w-4 text-cyan-400" />
          Realisasi Anggaran Pemeliharaan per Cabang & Depo (Agustus 2026)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Cabang / Depo</th>
                <th className="p-3">Alokasi Budget (IDR)</th>
                <th className="p-3">Realisasi Aktual</th>
                <th className="p-3">Sisa / Defisit</th>
                <th className="p-3">Variansi (%)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {MOCK_BUDGETS.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">{b.branchName}</td>
                  <td className="p-3">Rp {(b.budgetAmount / 1000000).toFixed(1)} Jt</td>
                  <td className="p-3 font-bold text-cyan-300">Rp {(b.actualAmount / 1000000).toFixed(1)} Jt</td>
                  <td className="p-3">
                    Rp {((b.budgetAmount - b.actualAmount) / 1000000).toFixed(1)} Jt
                  </td>
                  <td className={`p-3 font-bold ${b.variancePct <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {b.variancePct > 0 ? `+${b.variancePct}%` : `${b.variancePct}%`}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.variancePct <= 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                    }`}>
                      {b.variancePct <= 0 ? 'ON BUDGET' : 'OVER BUDGET'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Module Integration: Total Operating Cost (Fuel + Maintenance) */}
      <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/20 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fuel className="h-4 w-4 text-cyan-400" />
              Total Operating Cost (BBM + Pemeliharaan) per Kendaraan
            </h3>
            <p className="text-xs text-slate-400">
              Penggabungan riwayat pengisian solar dari modul Fuel Management dengan invoice perbaikan bengkel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {MOCK_VEHICLE_HEALTH.slice(0, 3).map((v) => (
            <div key={v.vehicleId} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{v.vehiclePlate}</span>
                <span className="text-[10px] text-slate-400">{v.brand}</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span>Biaya Bahan Bakar:</span>
                  <span className="font-semibold text-cyan-300">Rp {((v.fuelCostIdr || 0) / 1000000).toFixed(1)} Jt</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Pemeliharaan:</span>
                  <span className="font-semibold text-purple-300">Rp {(v.maintenanceCostIdr / 1000000).toFixed(1)} Jt</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                  <span className="text-white">Total Biaya Operasi:</span>
                  <span className="text-emerald-400">Rp {((v.totalOperatingCostIdr || 0) / 1000000).toFixed(1)} Jt</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
