/**
 * Fleet Intelligence Smart AI - Mileage Analytics & Reconciliation View
 * PROMPT 36 - Sections 16, 17, 18, 19
 */

import React, { useState } from 'react';
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Search,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const MileageAnalyticsView: React.FC = () => {
  const { mileageReconciliations, kpiOverview, snapshots, setActiveTab } = useAnalytics();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredReconciliations = mileageReconciliations.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const needsReviewCount = mileageReconciliations.filter((r) => r.status === 'NEEDS_REVIEW').length;
  const anomalyCount = mileageReconciliations.filter((r) => r.status === 'FLAGGED_ANOMALY').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Row */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-400" />
              <span>Analitik Jarak Tempuh & Rekonsiliasi Odometer Telematika</span>
            </h2>
            <p className="text-xs text-slate-400">
              Validasi akurasi jarak tempuh telematika GPS vs sensor CANBus Odometer vs Surat Jalan trip.
            </p>
          </div>

          {(needsReviewCount > 0 || anomalyCount > 0) && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>{needsReviewCount + anomalyCount} Rekonsiliasi Perlu Ditinjau</span>
            </div>
          )}
        </div>

        {/* Mileage KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Jarak Tempuh</span>
            <span className="text-base font-extrabold text-white">
              {kpiOverview.totalMileageKm.currentValue.toLocaleString()} km
            </span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rata-rata / Unit</span>
            <span className="text-base font-extrabold text-blue-400">1,566 km</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rata-rata / Trip</span>
            <span className="text-base font-extrabold text-cyan-400">45.2 km</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rata-rata / Driver</span>
            <span className="text-base font-extrabold text-emerald-400">1,480 km</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Jarak Harian Armada</span>
            <span className="text-base font-extrabold text-teal-400">4,280 km/Hari</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Tingkat Akurasi GPS</span>
            <span className="text-base font-extrabold text-emerald-400">98.4%</span>
          </div>
        </div>
      </div>

      {/* Mileage Trend Visualizer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span>Tren Jarak Tempuh Harian Armada (Km)</span>
          </h3>
          <span className="text-xs text-slate-400">30 Hari Terakhir</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-1.5 border-b border-slate-800 px-2 pt-2">
          {snapshots.slice(-25).map((snap, idx) => (
            <div key={idx} className="group relative flex flex-col items-center flex-1 h-full justify-end">
              <div className="absolute -top-8 hidden group-hover:flex flex-col items-center bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-white shadow-xl z-20 whitespace-nowrap">
                <span>{snap.date}: {snap.mileageKm.toLocaleString()} km</span>
              </div>
              <div
                style={{ height: `${(snap.mileageKm / 6000) * 100}%` }}
                className="w-full max-w-[18px] rounded-t bg-gradient-to-t from-blue-700 to-cyan-400 group-hover:brightness-125 transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-1">
          <span>Awal Periode</span>
          <span>Rata-rata: ~4,200 km / Hari</span>
          <span>Hari Ini</span>
        </div>
      </div>

      {/* Mileage Reconciliation Discrepancy Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl space-y-0">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 bg-slate-950/40">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-cyan-400" />
              <span>Tabel Rekonsiliasi Jarak GPS vs Trip Waypoints</span>
            </h3>
            <p className="text-xs text-slate-400">
              Deteksi selisih jarak tempuh nyata vs estimasi rute penugasan untuk mencegah deviasi dan manipulasi klaim BBM
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Status Rekonsiliasi</option>
              <option value="VERIFIED">Terverifikasi (Verified)</option>
              <option value="NEEDS_REVIEW">Perlu Review (Needs Review)</option>
              <option value="FLAGGED_ANOMALY">Anomali Terdeteksi (Flagged)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Tanggal Log</th>
                <th className="px-4 py-3 text-right">Jarak GPS</th>
                <th className="px-4 py-3 text-right">Jarak Surat Jalan</th>
                <th className="px-4 py-3 text-right">Selisih (Discrepancy)</th>
                <th className="px-4 py-3 text-center">Confidence</th>
                <th className="px-4 py-3">Sumber Data</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredReconciliations.map((rec) => {
                let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                let label = 'Verified';

                if (rec.status === 'FLAGGED_ANOMALY') {
                  badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                  label = 'Flagged Anomaly';
                } else if (rec.status === 'NEEDS_REVIEW') {
                  badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  label = 'Needs Review';
                }

                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">{rec.plateNumber}</td>
                    <td className="px-4 py-3 text-slate-400">{rec.date}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">{rec.gpsDistanceKm} km</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-300">{rec.tripDistanceKm} km</td>
                    <td className="px-4 py-3 text-right font-bold">
                      <span className={rec.differenceKm > 15 ? 'text-rose-400' : 'text-emerald-400'}>
                        {rec.differenceKm > 0 ? `+${rec.differenceKm} km` : `${rec.differenceKm} km`} ({rec.percentDiscrepancy}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-slate-200">{Math.round(rec.confidenceScore * 100)}%</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{rec.source}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${badgeClass}`}>
                        {label}
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
