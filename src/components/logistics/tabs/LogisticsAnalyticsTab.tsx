import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Truck, 
  Scale, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
}

export const LogisticsAnalyticsTab: React.FC<Props> = ({ orders }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analitik Biaya Tonase, Revenue & Unit Economics Logistik
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Evaluasi Cost per Kg-KM, marjin keuntungan per koridor rute, utilisasi armada tronton, dan konsumsi BBM solar linehaul.
          </p>
        </div>
      </div>

      {/* Analytical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Cost Per Kg / KM</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp 48.5 / kg-km</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <TrendingDown className="w-3.5 h-3.5" /> -4.2% vs Bulan Lalu
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Gross Profit Margin</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">32.8%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +2.1% peningkatan
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Rata-rata Load Factor Linehaul</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">89.4% CBM</div>
          <p className="text-[11px] text-slate-400">Target minimal 85% tercapai</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Konsumsi BBM Armada</span>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.2 KM / Liter</div>
          <p className="text-[11px] text-slate-400">Armada Tronton & Wingbox</p>
        </div>
      </div>

      {/* Corridors Profitability Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Profitabilitas Koridor Rute Utama (Linehaul Lane Performance)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Koridor Rute</th>
                <th className="py-3 px-4">Volume Bulanan</th>
                <th className="py-3 px-4">Revenue Bruto</th>
                <th className="py-3 px-4">Biaya Operasional (BBM, Tol, Supir)</th>
                <th className="py-3 px-4">Net Margin (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {[
                { lane: 'Jakarta ➔ Bandung (Via Tol Cipularang)', volume: '48.5 Ton', rev: 142000000, opex: 92000000, margin: 35.2 },
                { lane: 'Jakarta ➔ Surabaya (Via Tol Trans Jawa)', volume: '112.0 Ton', rev: 385000000, opex: 260000000, margin: 32.5 },
                { lane: 'Jakarta ➔ Semarang (Via Pantura / Tol)', volume: '64.0 Ton', rev: 198000000, opex: 135000000, margin: 31.8 },
                { lane: 'Surabaya ➔ Denpasar Bali (Via Feri Ketapang)', volume: '32.0 Ton', rev: 115000000, opex: 78000000, margin: 32.2 },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.lane}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{row.volume}</td>
                  <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">Rp {(row.rev / 1000000).toFixed(1)} Juta</td>
                  <td className="py-3 px-4 text-slate-500">Rp {(row.opex / 1000000).toFixed(1)} Juta</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">+{row.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
