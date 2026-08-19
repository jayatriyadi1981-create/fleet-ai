/**
 * Fleet Intelligence Smart AI - Executive Productivity Section
 * PROMPT 38 - Operational volume, trip completion rate, delivery SLA & asset productivity
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  TrendingUp,
  CheckCircle2,
  Navigation,
  PackageCheck,
  Calendar,
  Truck,
  Users,
  Compass,
} from 'lucide-react';

export const ExecutiveProductivitySection: React.FC = () => {
  const { productivity } = useExecutive();

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Operational Fleet Productivity & SLA
            </h3>
            <p className="text-xs text-slate-500">
              Volume penyelesaian tugas ritase kargo, ketepatan waktu pengiriman, dan utilisasi jam kerja.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span>Tingkat Penyelesaian Ritase:</span>
          <strong className="text-purple-700 font-bold text-sm">{productivity.tripCompletionRate}%</strong>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Ritase Selesai
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-slate-900">{productivity.completedTrips}</span>
            <span className="text-xs text-slate-400 font-normal">/ {productivity.totalTrips} rit</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {productivity.tripCompletionRate}% Sukses
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Drop Point Delivery
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-purple-700">{productivity.completedDeliveries.toLocaleString('id-ID')}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Rata-rata {productivity.deliveriesPerDay} drop/hari
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Ritase Per Kendaraan
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-slate-900">{productivity.tripsPerVehicle}</span>
            <span className="text-xs text-slate-400 font-normal">rit/unit</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target: &gt;16 rit/bln</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Ritase Per Pengemudi
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-slate-900">{productivity.tripsPerDriver}</span>
            <span className="text-xs text-slate-400 font-normal">rit/driver</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Rasio beban kerja seimbang</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Jarak Tempuh
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-blue-700">
              {Math.round(productivity.totalDistanceKm / 1000)}k
            </span>
            <span className="text-xs text-slate-400 font-normal">KM</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{productivity.utilizationHours} Jam Operasi</p>
        </div>
      </div>

      {/* Weekly Trend Bar representation */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
          Tren Ritase & Utilisasi Mingguan (Weekly Productivity Timeline)
        </span>
        <div className="grid grid-cols-4 gap-3">
          {productivity.trendData.map((t, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-purple-50/40 border border-purple-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-purple-900">{t.period}</span>
                <span className="text-purple-700 font-semibold">{t.trips} Rit</span>
              </div>
              <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, (t.trips / 140) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{t.deliveries} drop</span>
                <span className="font-medium text-slate-700">{t.utilizationPct}% util</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
