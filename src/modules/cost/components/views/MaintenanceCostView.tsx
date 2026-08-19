/**
 * Fleet Intelligence Smart AI - Maintenance Cost View
 * PROMPT 37 - Parts, Labor, Preventive vs Corrective, Lemon Vehicle Detection
 */

import React, { useState } from 'react';
import {
  Wrench,
  Package,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  Download,
  Settings,
  Flame,
  ArrowUpRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const MaintenanceCostView: React.FC = () => {
  const { maintenanceCostMetrics, exportCurrentData, setIsSavingCalculatorModalOpen } = useCost();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMetrics = maintenanceCostMetrics.filter(
    (m) =>
      m.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.branchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMaintCost = maintenanceCostMetrics.reduce((sum, m) => sum + m.totalMaintenanceCostIdr, 0);
  const totalPartsCost = maintenanceCostMetrics.reduce((sum, m) => sum + m.partsCostIdr, 0);
  const totalLaborCost = maintenanceCostMetrics.reduce((sum, m) => sum + m.laborCostIdr, 0);
  const totalPreventive = maintenanceCostMetrics.reduce((sum, m) => sum + m.preventiveMaintenanceCostIdr, 0);
  const totalCorrective = maintenanceCostMetrics.reduce((sum, m) => sum + m.correctiveMaintenanceCostIdr, 0);

  const pmRatio = totalMaintCost > 0 ? Math.round((totalPreventive / totalMaintCost) * 100) : 40;
  const cmRatio = 100 - pmRatio;

  // Breakdown data for charts
  const pmVsCmData = [
    { name: 'Preventive (Servis Terjadwal)', value: totalPreventive, color: '#10b981' },
    { name: 'Corrective (Perbaikan Rusak)', value: totalCorrective, color: '#ef4444' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Biaya Pemeliharaan</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{CostCalculationEngine.formatIdr(totalMaintCost)}</div>
          <div className="text-xs text-slate-400 mt-2">
            Porsi terhadap TOC: <strong className="text-amber-400">23.0%</strong>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Rasio Suku Cadang vs Jasa</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white mt-2">
            Spareparts {Math.round((totalPartsCost / (totalMaintCost || 1)) * 100)}% / Jasa {Math.round((totalLaborCost / (totalMaintCost || 1)) * 100)}%
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Parts: {CostCalculationEngine.formatCompactIdr(totalPartsCost)} | Jasa: {CostCalculationEngine.formatCompactIdr(totalLaborCost)}
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Preventive vs Corrective (PM/CM)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white mt-2">
            <span className="text-emerald-400">PM {pmRatio}%</span> vs <span className="text-rose-400">CM {cmRatio}%</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">Target industri: PM &gt; 75%</div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Unit Peringatan Biaya Servis</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">1 Unit Kritis</div>
          <div className="text-xs text-slate-400 mt-2">B 9204 PQR (4x perbaikan darurat)</div>
        </div>
      </div>

      {/* Warning Box for Recurring Issue / Lemon Unit */}
      <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Peringatan Armada: B 9204 PQR Mengalami Biaya Perbaikan Korektif Rp 10,8 Jt (4705 IDR/KM)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Unit mengalami 4 kali perbaikan mendadak dalam 30 hari. Rekomendasi AI: Lakukan audit komprehensif sistem transmisi & pendingin atau evaluasi pergantian unit (TCO replacement).
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsSavingCalculatorModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-md shadow-rose-600/20"
        >
          Simulasi Konversi PM
        </button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PM vs CM Donut */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-sm font-semibold text-white">Rasio Biaya Servis Terjadwal vs Darurat</h3>
            <p className="text-xs text-slate-400 mt-0.5">PM (Preventive) vs Corrective Breakdown</p>

            <div className="h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pmVsCmData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pmVsCmData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                        Number(value)
                      ),
                      'Total',
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-700/60 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Preventive Maintenance:
              </span>
              <strong className="text-emerald-400">{CostCalculationEngine.formatCompactIdr(totalPreventive)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Corrective Repair:
              </span>
              <strong className="text-rose-400">{CostCalculationEngine.formatCompactIdr(totalCorrective)}</strong>
            </div>
          </div>
        </div>

        {/* Maintenance Cost per Vehicle Model (2 cols) */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 lg:col-span-2 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Biaya Pemeliharaan Berdasarkan Komponen per Kendaraan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Komparasi Suku Cadang (Parts), Jasa (Labor), dan Biaya Darurat</p>

            <div className="h-60 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={maintenanceCostMetrics.map((m) => ({
                    plate: m.vehiclePlate,
                    parts: m.partsCostIdr / 1000000,
                    labor: m.laborCostIdr / 1000000,
                    emergency: m.emergencyRepairCostIdr / 1000000,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="plate" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`Rp ${val} Jt`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="parts" name="Suku Cadang (Jt)" fill="#eab308" stackId="a" />
                  <Bar dataKey="labor" name="Jasa Teknisi (Jt)" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="emergency" name="Darurat / Derek (Jt)" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700/60 text-xs text-slate-400">
            Unit dengan biaya perbaikan preventif tinggi memiliki rasio mogok di jalan mendekati 0%.
          </div>
        </div>
      </div>

      {/* Maintenance Breakdown Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60">
          <div>
            <h3 className="text-sm font-semibold text-white">Buku Register Pemeliharaan & Servis Kendaraan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Rekapitulasi riwayat work order dan komponen biaya bengkel</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari plat / cabang / tipe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-60"
              />
            </div>
            <button
              onClick={() => exportCurrentData('CSV')}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Ekspor CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4 text-center">Work Orders</th>
                <th className="py-3 px-4">Suku Cadang (Parts)</th>
                <th className="py-3 px-4">Jasa (Labor)</th>
                <th className="py-3 px-4">Preventive (PM)</th>
                <th className="py-3 px-4">Corrective (CM)</th>
                <th className="py-3 px-4">Total Biaya Servis</th>
                <th className="py-3 px-4">Biaya / KM</th>
                <th className="py-3 px-4 text-center">Status Pemeliharaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredMetrics.map((m) => (
                <tr key={m.vehicleId} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{m.vehiclePlate}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{m.vehicleModel}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{m.branchName}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-white">{m.workOrdersCount} WO</td>
                  <td className="py-3.5 px-4 text-yellow-400 font-medium">{CostCalculationEngine.formatIdr(m.partsCostIdr)}</td>
                  <td className="py-3.5 px-4 text-blue-400 font-medium">{CostCalculationEngine.formatIdr(m.laborCostIdr)}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-medium">{CostCalculationEngine.formatIdr(m.preventiveMaintenanceCostIdr)}</td>
                  <td className="py-3.5 px-4 text-rose-400 font-medium">{CostCalculationEngine.formatIdr(m.correctiveMaintenanceCostIdr)}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{CostCalculationEngine.formatIdr(m.totalMaintenanceCostIdr)}</td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-300">
                    Rp {m.costPerKmIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {m.highCostWarning ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" /> Rekuren / Lemon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Terawat Normal
                      </span>
                    )}
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
