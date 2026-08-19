/**
 * Fleet Intelligence Smart AI - Trip Performance Analytics View
 * PROMPT 36 - Sections 20, 21, 22, 23, 24, 25, 26
 */

import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const TripAnalyticsView: React.FC = () => {
  const { tripAnalytics, kpiOverview } = useAnalytics();
  const [viewBy, setViewBy] = useState<'TRIP' | 'VEHICLE' | 'DRIVER' | 'ROUTE'>('TRIP');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = tripAnalytics.filter((t) => {
    return (
      t.tripCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.routeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalTrips = 2841;
  const completedTrips = 2636;
  const delayedTrips = 142;
  const cancelledTrips = 48;
  const inProgressTrips = 15;
  const completionRate = Math.round((completedTrips / totalTrips) * 1000) / 10;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Summary */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-400" />
              <span>Trip Performance & Variance Analytics</span>
            </h2>
            <p className="text-xs text-slate-400">
              Analisis tingkat keberhasilan trip (Completion Rate), variansi jarak tempuh (Planned vs Actual), dan efisiensi rute pengiriman.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Tampilan Dimensi:</span>
            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
              {(['TRIP', 'VEHICLE', 'DRIVER', 'ROUTE'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewBy(mode)}
                  className={`rounded-lg px-3 py-1 transition-all ${
                    viewBy === mode ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'TRIP' && 'Daftar Trip'}
                  {mode === 'VEHICLE' && 'Per Unit'}
                  {mode === 'DRIVER' && 'Per Driver'}
                  {mode === 'ROUTE' && 'Per Rute'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6-Card KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Rencana Trip</span>
            <span className="text-base font-extrabold text-white">{totalTrips.toLocaleString()}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Trip Selesai</span>
            <span className="text-base font-extrabold text-emerald-400">{completedTrips.toLocaleString()}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Completion Rate</span>
            <span className="text-base font-extrabold text-teal-400">{completionRate}%</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Trip Terlambat</span>
            <span className="text-base font-extrabold text-amber-400">{delayedTrips}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Trip Dibatalkan</span>
            <span className="text-base font-extrabold text-rose-400">{cancelledTrips}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rata-rata Efisiensi</span>
            <span className="text-base font-extrabold text-cyan-400">92.4 / 100</span>
          </div>
        </div>
      </div>

      {/* Planned vs Actual Variance Showcase */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3 shadow-xl">
          <h3 className="text-xs font-bold uppercase text-slate-300 flex items-center justify-between">
            <span>Variansi Jarak (Distance Variance)</span>
            <span className="text-emerald-400 font-bold">+1.8% Rata-rata</span>
          </h3>
          <p className="text-xs text-slate-400">
            Perbandingan total jarak tempuh nyata GPS terhadap estimasi jarak rute optimal.
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Rencana Rute Optimal:</span>
              <span className="text-white font-semibold">126,150 km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Realisasi Lapangan:</span>
              <span className="text-cyan-400 font-bold">128,420 km</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1.5">
              <span className="text-slate-400">Selisih Deviasi Jarak:</span>
              <span className="text-amber-400 font-bold">+2,270 km (1.8%)</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3 shadow-xl">
          <h3 className="text-xs font-bold uppercase text-slate-300 flex items-center justify-between">
            <span>Variansi Durasi Waktu (Duration Variance)</span>
            <span className="text-teal-400 font-bold">-4.2% Lebih Cepat</span>
          </h3>
          <p className="text-xs text-slate-400">
            Perbandingan total jam berkendara nyata terhadap durasi standar SLA penugasan.
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Rencana Waktu SLA:</span>
              <span className="text-white font-semibold">9,850 Jam</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Realisasi Jam Perjalanan:</span>
              <span className="text-emerald-400 font-bold">9,436 Jam</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1.5">
              <span className="text-slate-400">Efisiensi Waktu:</span>
              <span className="text-emerald-400 font-bold">-414 Jam Hemat</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3 shadow-xl">
          <h3 className="text-xs font-bold uppercase text-slate-300 flex items-center justify-between">
            <span>Ketepatan ETA (Arrival Variance)</span>
            <span className="text-cyan-400 font-bold">94.6% Tepat Waktu</span>
          </h3>
          <p className="text-xs text-slate-400">
            Persentase kedatangan di depo/customer dalam jendela toleransi &plusmn;15 menit.
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Tepat Waktu / Lebih Awal:</span>
              <span className="text-emerald-400 font-bold">2,688 Trip</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Terlambat &gt; 30 Menit:</span>
              <span className="text-rose-400 font-bold">153 Trip</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1.5">
              <span className="text-slate-400">Penyebab Keterlambatan:</span>
              <span className="text-slate-200">Macet Tol & Antrean Bongkar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode trip, driver, plat nomor, atau rute..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">Menampilkan {filteredTrips.length} sampel trip terkini</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Kode Trip</th>
                <th className="px-4 py-3">Kendaraan & Driver</th>
                <th className="px-4 py-3">Rute & Koridor</th>
                <th className="px-4 py-3 text-right">Rencana vs Nyata Jarak</th>
                <th className="px-4 py-3 text-right">Rencana vs Nyata Waktu</th>
                <th className="px-4 py-3 text-center">Efisiensi</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTrips.map((trip) => {
                let badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (trip.status === 'DELAYED') badge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (trip.status === 'CANCELLED' || trip.status === 'FAILED')
                  badge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                return (
                  <tr key={trip.tripId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">{trip.tripCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{trip.plateNumber}</div>
                      <div className="text-[11px] text-slate-400">{trip.driverName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">{trip.routeName}</div>
                      <div className="text-[11px] text-slate-500">
                        {trip.origin} &rarr; {trip.destination}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-white">{trip.actualDistanceKm} km</div>
                      <div className="text-[10px] text-slate-400">Rencana: {trip.plannedDistanceKm} km</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-white">{Math.floor(trip.actualDurationMinutes / 60)}j {trip.actualDurationMinutes % 60}m</div>
                      <div className="text-[10px] text-slate-400">Rencana: {Math.floor(trip.plannedDurationMinutes / 60)}j {trip.plannedDurationMinutes % 60}m</div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-400">{trip.efficiencyScore}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${badge}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
