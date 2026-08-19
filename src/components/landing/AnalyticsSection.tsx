import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-bold text-purple-300 mb-4">
            <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
            <span>Exec & Operational Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Data Armada Menjadi Insight Bisnis.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Grafik interaktif untuk mengukur efisiensi utilitas armada, biaya per kilometer, dan performa pengemudi secara transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">UTILITAS ARMADA (UTILIZATION)</span>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Rata-rata Utilitas Hari Ini</span>
                <span className="font-bold text-purple-400">84.5%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[84.5%]" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">1,085 dari 1,284 unit beroperasi aktif memenuhi order pengiriman.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">TOTAL DISTANSI KILOMETER</span>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Jarak Tempuh Bulan Ini</span>
                <span className="font-bold text-cyan-400">842,910 km</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[78%]" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Peningkatan jarak tempuh efisien +8.4% dengan rute hemat.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">DISTRIBUSI BIAYA OPERASIONAL</span>
              <PieChart className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>BBM Solar</span>
                <span className="font-bold text-emerald-400">42%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Gaji & Uang Jalan Driver</span>
                <span className="font-bold text-blue-400">32%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Maintenance & Sparepart</span>
                <span className="font-bold text-amber-400">16%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
