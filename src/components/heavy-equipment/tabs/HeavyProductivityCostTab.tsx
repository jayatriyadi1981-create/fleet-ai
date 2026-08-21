import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Gauge, 
  PieChart as PieIcon, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Calendar, 
  Fuel, 
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { 
  EquipmentProductivityMetric, 
  HeavyEquipmentAsset, 
  ConstructionProject, 
  HeavyRentalBilling 
} from '../../../modules/heavy-equipment/types';

interface Props {
  productivityMetrics: EquipmentProductivityMetric[];
  equipments: HeavyEquipmentAsset[];
  projects: ConstructionProject[];
  rentalBillings: HeavyRentalBilling[];
}

export const HeavyProductivityCostTab: React.FC<Props> = ({
  productivityMetrics,
  equipments,
  projects,
  rentalBillings
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'PRODUCTIVITY' | 'COST_PROFIT'>('PRODUCTIVITY');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');

  // Calculate fleet financial metrics
  const totalFleetRevenue = equipments.reduce((acc, curr) => acc + curr.revenueGeneratedIdr, 0);
  const totalFleetOperatingCost = equipments.reduce((acc, curr) => acc + (curr.operatingCostPerHourIdr * curr.hourMeter), 0);
  const totalFleetProfit = totalFleetRevenue - totalFleetOperatingCost;
  const avgProfitMarginPct = ((totalFleetProfit / (totalFleetRevenue || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Produktivitas & Analisis Finansial Alat Berat (Productivity & Cost)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Evaluasi output kerja (BCM/Jam, Ton/Jam, Ritase Dump Truck, Crane Lifts) serta profitabilitas margin alat dan biaya operasional per satuan volume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubtab('PRODUCTIVITY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubtab === 'PRODUCTIVITY'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Output Produktivitas (m³/h, Ton)
            </button>
            <button
              onClick={() => setActiveSubtab('COST_PROFIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubtab === 'COST_PROFIT'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Profitabilitas & Cost per BCM
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Rata-rata Produktivitas Fleet</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            106.7% <span className="text-xs text-slate-400 font-normal">vs Target</span>
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Total Volume Digali (BCM)</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {(projects.reduce((acc, curr) => acc + curr.achievedVolumeBcm, 0) / 1000000).toFixed(2)} Juta <span className="text-xs text-slate-400 font-normal">BCM</span>
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Total Revenue Armada</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            Rp {(totalFleetRevenue / 1000000000).toFixed(2)} Miliar
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Rata-rata Net Profit Margin</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {avgProfitMarginPct}% <span className="text-xs text-slate-400 font-normal">EBITDA</span>
          </p>
        </div>
      </div>

      {/* Subtab 1: Productivity Details */}
      {activeSubtab === 'PRODUCTIVITY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productivityMetrics.map((pm) => (
              <div
                key={pm.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-base">{pm.equipmentCode}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {pm.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{pm.projectName}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Pencapaian Target</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                      <ArrowUpRight className="w-4 h-4" />
                      {pm.productivityPct}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-500 block">Output Aktual / Jam</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      {pm.actualUnitPerHour} {pm.volumeM3 ? 'm³/h' : pm.tonnageTons ? 'Ton/h' : 'Unit/h'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-500 block">Target Desain / Jam</span>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300 mt-0.5 block">
                      {pm.targetUnitPerHour} {pm.volumeM3 ? 'm³/h' : pm.tonnageTons ? 'Ton/h' : 'Unit/h'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-500 block">Siklus / Ritase</span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                      {pm.cycleCount || pm.liftCount || 0} Cycles
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Efisiensi Siklus Muat & Gali</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{pm.productivityPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(pm.productivityPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Cost & Profitability per Unit */}
      {activeSubtab === 'COST_PROFIT' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tabel Profitabilitas & Biaya Operasional per Alat Berat (Unit P&L)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Unit Alat Berat</th>
                  <th className="p-3.5">Total HM Kerja</th>
                  <th className="p-3.5">Tarif Sewa / Jam</th>
                  <th className="p-3.5">Operating Cost / Jam</th>
                  <th className="p-3.5">Total Revenue (IDR)</th>
                  <th className="p-3.5">Total Est. Cost (IDR)</th>
                  <th className="p-3.5">Net Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {equipments.map((eq) => {
                  const totalRev = eq.revenueGeneratedIdr;
                  const totalCost = eq.operatingCostPerHourIdr * eq.hourMeter;
                  const profit = totalRev - totalCost;
                  const marginPct = ((profit / (totalRev || 1)) * 100).toFixed(1);

                  return (
                    <tr key={eq.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{eq.code}</span>
                        <span className="text-[11px] text-slate-500">{eq.name}</span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {eq.hourMeter.toLocaleString('id-ID', { maximumFractionDigits: 1 })} HM
                      </td>
                      <td className="p-3.5">
                        Rp {eq.rentalHourlyRate.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5">
                        Rp {eq.operatingCostPerHourIdr.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 font-semibold text-blue-600 dark:text-blue-400">
                        Rp {totalRev.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-rose-600 dark:text-rose-400">
                        Rp {totalCost.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                          {marginPct}% Net
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
