/**
 * Fleet Intelligence Smart AI - Idle Analytics & Fuel Cost View
 * PROMPT 36 - Sections 27, 28, 29, 30, 31, 32
 */

import React from 'react';
import { Clock, Fuel, AlertTriangle, Sliders, MapPin, TrendingDown, ArrowUpDown } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { IdleClassification } from '../../types';

export const IdleAnalyticsView: React.FC = () => {
  const { idleEvents, vehicles, idleThresholdMinutes, setIdleThresholdMinutes, kpiOverview } = useAnalytics();

  const totalIdleMinutes = idleEvents.reduce((acc, ev) => acc + ev.durationMinutes, 0);
  const totalIdleFuelLiters = idleEvents.reduce((acc, ev) => acc + ev.estimatedFuelLiters, 0);
  const totalEstimatedCostIdr = idleEvents.reduce((acc, ev) => acc + ev.estimatedCostIdr, 0);

  // Group by classification
  const classificationCounts: Record<IdleClassification, number> = {
    TRAFFIC: 0,
    LOADING: 0,
    UNLOADING: 1,
    WAITING: 1,
    DRIVER_BREAK: 1,
    OPERATIONAL: 0,
    UNAUTHORIZED: 1,
    UNKNOWN: 0,
  };

  idleEvents.forEach((ev) => {
    classificationCounts[ev.classification] = (classificationCounts[ev.classification] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Idle Configuration */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <span>Analisis Waktu Idle & Estimasi Pemborosan BBM</span>
            </h2>
            <p className="text-xs text-slate-400">
              Memonitor kondisi mesin menyala saat kendaraan diam (Engine ON, Speed = 0) beserta klasifikasi penyebab dan dampak biaya.
            </p>
          </div>

          {/* Configurable Idle Threshold */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ambang Batas Idle:</span>
            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
              {[1, 3, 5, 10].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setIdleThresholdMinutes(mins)}
                  className={`rounded-lg px-3 py-1 transition-all ${
                    idleThresholdMinutes === mins
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mins} Menit
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6-Card KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Waktu Idle</span>
            <span className="text-base font-extrabold text-white">1,420 Jam</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Persentase Idle Armada</span>
            <span className="text-base font-extrabold text-amber-400">{kpiOverview.idleTimePercent.currentValue}%</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rata-rata / Unit</span>
            <span className="text-base font-extrabold text-cyan-400">17.3 Jam/Bln</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Estimasi Solar Terbuang</span>
            <span className="text-base font-extrabold text-rose-400">2,840 Liter</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Estimasi Biaya Idle</span>
            <span className="text-base font-extrabold text-rose-400">Rp 38.3 Jt</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Idle Terpanjang</span>
            <span className="text-base font-extrabold text-amber-400">75 Menit</span>
          </div>
        </div>
      </div>

      {/* AI Idle Classification Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Fuel className="h-4 w-4 text-amber-400" />
            <span>Klasifikasi Penyebab Waktu Idle (AI & Geofence Context Engine)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Antrean Jembatan Timbang & Menunggu (Waiting)</span>
                <span className="text-white">36% (511 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 w-[36%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Bongkar Muat / Loading & Unloading</span>
                <span className="text-white">28% (398 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Kemacetan Lalu Lintas (Traffic Congestion)</span>
                <span className="text-white">18% (255 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-400 w-[18%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Istirahat Pengemudi di Rest Area (Driver Break)</span>
                <span className="text-white">12% (170 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 w-[12%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Idle Tidak Resmi / Unauthorized Parking</span>
                <span className="text-rose-400 font-bold">6% (86 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-500 w-[6%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Cost Formula Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">Rumus Estimasi Biaya Idle</h3>
            <p className="text-xs text-slate-400">
              Dihitung berdasarkan konsumsi rata-rata idling truk diesel berat (2.0 L/jam) dikalikan harga acuan Biosolar (Rp 13.500/L).
            </p>
            <div className="rounded-xl bg-slate-950 p-3 font-mono text-xs text-cyan-300 border border-slate-800">
              Biaya = Jam Idle &times; 2.0 L &times; Rp 13.500
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-xs text-rose-300">
            <span className="font-bold block mb-0.5">Potensi Penghematan AI:</span>
            Penerapan pembatasan auto engine shutdown setelah 10 menit berpotensi menghemat <strong className="text-white">Rp 14.8 Juta/Bulan</strong>.
          </div>
        </div>
      </div>

      {/* Idle Events Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Daftar Kejadian Idle Berdurasi Panjang Terkini</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Kendaraan & Driver</th>
                <th className="px-4 py-3">Lokasi Kejadian</th>
                <th className="px-4 py-3 text-center">Durasi Idle</th>
                <th className="px-4 py-3">Klasifikasi AI</th>
                <th className="px-4 py-3 text-right">Estimasi Solar</th>
                <th className="px-4 py-3 text-right">Estimasi Biaya</th>
                <th className="px-4 py-3">Catatan Telematika</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {idleEvents.map((ev) => {
                let badge = 'bg-slate-800 text-slate-300';
                if (ev.classification === 'UNAUTHORIZED') badge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                if (ev.classification === 'WAITING') badge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (ev.classification === 'DRIVER_BREAK') badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                return (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{ev.plateNumber}</div>
                      <div className="text-[11px] text-slate-400">{ev.driverName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span>{ev.locationName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-white text-sm">{ev.durationMinutes} Menit</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${badge}`}>
                        {ev.classification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-amber-300">{ev.estimatedFuelLiters} L</td>
                    <td className="px-4 py-3 text-right font-bold text-white">Rp {ev.estimatedCostIdr.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{ev.notes || '-'}</td>
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
