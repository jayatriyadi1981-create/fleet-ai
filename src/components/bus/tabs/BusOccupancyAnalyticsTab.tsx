import React from 'react';
import { BusFleetKPIs, BusTrip } from '../../../modules/bus/types';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  Award, 
  PieChart, 
  Layers
} from 'lucide-react';

interface Props {
  kpis: BusFleetKPIs;
  trips: BusTrip[];
}

export const BusOccupancyAnalyticsTab: React.FC<Props> = ({ kpis, trips }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Analitik Okupansi Kursi, RASK & Profitabilitas Trayek
        </h3>
        <p className="text-xs text-slate-500">Evaluasi performa load factor per kelas bus, revenue per available seat-kilometer, dan utilisasi armada</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Rata-Rata Load Factor</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {kpis.averageOccupancyRatePct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target bulanan: 85.0%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">RASK (Rev / Seat-Km)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            Rp 680
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">+14% vs rata-rata industri</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Margin Laba per Ritase</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            34.2%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Setelah potong UJS, BBM & Tol</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Utilisasi Armada Harian</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            91.5%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Hanya 2 unit dalam perbaikan rutin</p>
        </div>
      </div>

      {/* Class Comparison Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Performa Okupansi Berdasarkan Kelas Layanan Bus</h4>
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-800 dark:text-slate-200">Sleeper Suites Class (22 Seats)</span>
              <span className="text-emerald-600 font-bold">95.4% Okupansi • Rp 480.000/tiket</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[95%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-800 dark:text-slate-200">Double Decker First Class (36 Seats)</span>
              <span className="text-blue-600 font-bold">97.2% Okupansi • Rp 395.000/tiket</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full w-[97%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-800 dark:text-slate-200">Executive AC 2-2 (32 Seats)</span>
              <span className="text-indigo-600 font-bold">90.6% Okupansi • Rp 240.000/tiket</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full w-[90%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-slate-800 dark:text-slate-200">Charter Bus Pariwisata</span>
              <span className="text-amber-600 font-bold">100% Kontrak Penuh (Rombongan)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full w-[100%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
