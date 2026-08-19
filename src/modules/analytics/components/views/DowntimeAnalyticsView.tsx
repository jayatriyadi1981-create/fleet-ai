/**
 * Fleet Intelligence Smart AI - Downtime & Reliability Analytics View
 * PROMPT 36 - Sections 33, 34, 35, 36, 37, 38, 39, 40
 */

import React from 'react';
import { AlertTriangle, Wrench, ShieldAlert, CheckCircle2, Clock, Activity, FileText } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const DowntimeAnalyticsView: React.FC = () => {
  const { downtimeEvents, kpiOverview, snapshots } = useAnalytics();

  const totalDowntimeHours = 594;
  const downtimeEventsCount = 38;
  const totalRepairsCount = 28;
  const mttr = kpiOverview.mttrHours.currentValue; // 18.5 hours
  const mtbf = kpiOverview.mtbfHours.currentValue; // 280 hours
  const availabilityRate = kpiOverview.vehicleAvailabilityPercent.currentValue; // 93.8%

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Row */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              <span>Analisis Downtime & Keandalan Armada (Reliability Intelligence)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluasi waktu henti tidak terjadwal, efektivitas perbaikan bengkel (MTTR), dan keandalan antar-kerusakan (MTBF).
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Ketersediaan Armada: {availabilityRate}%</span>
          </div>
        </div>

        {/* 6-Card KPI Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Downtime</span>
            <span className="text-base font-extrabold text-white">{totalDowntimeHours} Jam</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rasio Downtime</span>
            <span className="text-base font-extrabold text-rose-400">{kpiOverview.downtimePercent.currentValue}%</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Kejadian Breakdown</span>
            <span className="text-base font-extrabold text-amber-400">{downtimeEventsCount} Insiden</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">MTTR (Rata-rata Servis)</span>
            <span className="text-base font-extrabold text-cyan-400">{mttr} Jam</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">MTBF (Antar-Kerusakan)</span>
            <span className="text-base font-extrabold text-teal-400">{mtbf} Jam</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Ketersediaan (Availability)</span>
            <span className="text-base font-extrabold text-emerald-400">{availabilityRate}%</span>
          </div>
        </div>
      </div>

      {/* Cause Breakdown & MTTR / MTBF Explanation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Downtime Cause Distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wrench className="h-4 w-4 text-cyan-400" />
            <span>Distribusi Penyebab Downtime Armada</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Pemeliharaan Terjadwal / Periodic Maintenance</span>
                <span className="text-white">42% (249 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 w-[42%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Kerusakan Mekanikal / Mechanical Breakdown</span>
                <span className="text-rose-400 font-bold">21% (124 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-500 w-[21%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Perangkat GPS / Sensor IoT Telematika</span>
                <span className="text-white">9% (53 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 w-[9%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Insiden Lalu Lintas / Kecelakaan Ringan</span>
                <span className="text-white">8% (47 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-400 w-[8%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Ketidakhadiran Driver / Driver Unavailable</span>
                <span className="text-white">6% (35 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-400 w-[6%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Administratif, KIR, STNK & Lainnya</span>
                <span className="text-white">14% (83 Jam)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-500 w-[14%]" />
              </div>
            </div>
          </div>
        </div>

        {/* MTTR & MTBF Definition Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Metrik Keandalan Teknis</span>
            </h3>

            <div className="rounded-xl bg-slate-950 p-3 space-y-1.5 border border-slate-800 text-xs">
              <span className="font-bold text-cyan-400">MTTR (Mean Time To Repair):</span>
              <p className="text-slate-300">
                Rata-rata durasi bengkel menyelesaikan perbaikan hingga armada siap jalan kembali (<strong className="text-white">18.5 Jam</strong>).
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 space-y-1.5 border border-slate-800 text-xs">
              <span className="font-bold text-teal-400">MTBF (Mean Time Between Failures):</span>
              <p className="text-slate-300">
                Rata-rata jam operasional aktif antar satu insiden breakdown ke breakdown berikutnya (<strong className="text-white">280 Jam</strong>).
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-300">
            <span className="font-bold block mb-0.5">Koneksi Predictive Maintenance:</span>
            Integrasi dengan AI PROMPT 31 memprediksi 2 unit berpotensi breakdown sebelum 50 jam operasi.
          </div>
        </div>
      </div>

      {/* Downtime Events Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <span>Catatan Insiden Downtime & Work Order Terkini</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Penyebab Utama</th>
                <th className="px-4 py-3 text-center">Durasi Henti</th>
                <th className="px-4 py-3">Work Order</th>
                <th className="px-4 py-3 text-right">Biaya Servis</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {downtimeEvents.map((dt) => (
                <tr key={dt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{dt.plateNumber}</div>
                    <div className="text-[11px] text-slate-500">{dt.branchName}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-300">{dt.category}</td>
                  <td className="px-4 py-3 text-slate-200">{dt.primaryCause}</td>
                  <td className="px-4 py-3 text-center font-bold text-rose-400">{dt.durationHours} Jam</td>
                  <td className="px-4 py-3 font-mono text-cyan-400 text-[11px]">{dt.workOrderId || '-'}</td>
                  <td className="px-4 py-3 text-right font-bold text-white">
                    Rp {dt.costEstimatedIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        dt.resolved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {dt.resolved ? 'Resolved' : 'Ongoing Repair'}
                    </span>
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
