/**
 * Fleet Intelligence Smart AI - Fuel Analytics Tab
 * PROMPT 24 - Recharts Data Visualizations, Vehicle/Driver Efficiency Rankings & Heatmaps
 */

import React from 'react';
import { BarChart3, Award, Flame, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const rankingData = [
  { vehicle: 'B 9876 XYZ', kmPerLiter: 3.8, status: 'Efisien' },
  { vehicle: 'B 1234 ABC', kmPerLiter: 3.15, status: 'Boros' },
  { vehicle: 'L 5678 FG', kmPerLiter: 3.65, status: 'Efisien' },
  { vehicle: 'H 9012 AB', kmPerLiter: 4.10, status: 'Efisien' },
];

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Ranking Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" /> Peringkat Efisiensi Konsumsi Kendaraan (KM/Liter)
            </h3>
            <span className="text-xs text-slate-400">Target &gt; 3.5 KM/L</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="vehicle" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="kmPerLiter" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap / Driving Habits Impact */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" /> Matriks Dampak Idling & Gaya Mengemudi Terhadap BBM
            </h3>
            <span className="text-xs text-cyan-400">AI Heatmap</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Waktu Idle Mesin Nyala Berlebihan (&gt;30 Menit)</span>
                <p className="text-slate-400 text-[11px]">Membuang rata-rata 1.8 Liter BBM/jam per kendaraan.</p>
              </div>
              <span className="text-rose-400 font-extrabold text-sm">-12.4% Efisiensi</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Akselelerasi & Pengereman Mendadak (Harsh Driving)</span>
                <p className="text-slate-400 text-[11px]">Meningkatkan injeksi bahan bakar secara mendadak.</p>
              </div>
              <span className="text-amber-400 font-extrabold text-sm">-8.2% Efisiensi</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">Tekanan Angin Ban Di Bawah Standar (Low Tire Pressure)</span>
                <p className="text-slate-400 text-[11px]">Memperbesar friksi roda dengan permukaan aspal.</p>
              </div>
              <span className="text-amber-400 font-extrabold text-sm">-4.1% Efisiensi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
