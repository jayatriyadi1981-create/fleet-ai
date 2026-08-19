/**
 * Fleet Intelligence Smart AI - Fleet Productivity View
 * PROMPT 36 - Sections 13, 14, 15
 */

import React, { useState } from 'react';
import {
  Award,
  Sliders,
  TrendingUp,
  CheckCircle2,
  Truck,
  Users,
  Navigation,
  Clock,
  Filter,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { ProductivityWeightConfig } from '../../types';

export const FleetProductivityView: React.FC = () => {
  const { vehicles, productivityWeights, setProductivityWeights, kpiOverview } = useAnalytics();

  const [sortCriteria, setSortCriteria] = useState<'BEST' | 'LOWEST' | 'MOST_UTILIZED' | 'HIGHEST_MILEAGE' | 'HIGHEST_DOWNTIME'>('BEST');
  const [isAdjustingWeights, setIsAdjustingWeights] = useState(false);

  const [localWeights, setLocalWeights] = useState<ProductivityWeightConfig>(productivityWeights);

  const handleApplyWeights = () => {
    setProductivityWeights(localWeights);
    setIsAdjustingWeights(false);
  };

  const handleResetWeights = () => {
    const defaultWeights: ProductivityWeightConfig = {
      utilizationWeight: 0.3,
      tripCompletionWeight: 0.2,
      onTimeWeight: 0.2,
      idleWeight: 0.1,
      downtimeWeight: 0.1,
      availabilityWeight: 0.1,
    };
    setLocalWeights(defaultWeights);
    setProductivityWeights(defaultWeights);
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    switch (sortCriteria) {
      case 'BEST':
        return b.productivityScore - a.productivityScore;
      case 'LOWEST':
        return a.productivityScore - b.productivityScore;
      case 'MOST_UTILIZED':
        return b.utilizationRate - a.utilizationRate;
      case 'HIGHEST_MILEAGE':
        return b.mileageKm - a.mileageKm;
      case 'HIGHEST_DOWNTIME':
        return b.downtimeHours - a.downtimeHours;
      default:
        return b.productivityScore - a.productivityScore;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Row */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-400" />
              <span>Fleet Productivity Intelligence & Weighted Scoring</span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluasi kinerja komprehensif armada berdasarkan penyelesaian trip, jarak tempuh, kepatuhan jadwal, dan ketersediaan unit.
            </p>
          </div>

          <button
            onClick={() => setIsAdjustingWeights(!isAdjustingWeights)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500 hover:text-white transition-all self-start lg:self-auto"
          >
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span>{isAdjustingWeights ? 'Tutup Konfigurator Bobot' : 'Atur Bobot Penilaian'}</span>
          </button>
        </div>

        {/* Weight Adjustment Drawer */}
        {isAdjustingWeights && (
          <div className="rounded-xl border border-cyan-500/30 bg-slate-950 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-cyan-400">
                Formula Bobot Skor Produktivitas (Total Bobot: 100%)
              </span>
              <button
                onClick={handleResetWeights}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Bobot Default</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Utilisasi: {Math.round(localWeights.utilizationWeight * 100)}%</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={localWeights.utilizationWeight}
                  onChange={(e) => setLocalWeights({ ...localWeights, utilizationWeight: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Trip Selesai: {Math.round(localWeights.tripCompletionWeight * 100)}%</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={localWeights.tripCompletionWeight}
                  onChange={(e) => setLocalWeights({ ...localWeights, tripCompletionWeight: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Ketepatan Waktu: {Math.round(localWeights.onTimeWeight * 100)}%</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={localWeights.onTimeWeight}
                  onChange={(e) => setLocalWeights({ ...localWeights, onTimeWeight: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Faktor Idle: {Math.round(localWeights.idleWeight * 100)}%</span>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={localWeights.idleWeight}
                  onChange={(e) => setLocalWeights({ ...localWeights, idleWeight: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Faktor Downtime: {Math.round(localWeights.downtimeWeight * 100)}%</span>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={localWeights.downtimeWeight}
                  onChange={(e) => setLocalWeights({ ...localWeights, downtimeWeight: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px]">Ketersediaan: {Math.round(localWeights.availabilityWeight * 100)}%</span>
                <input
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.05"
                  value={localWeights.availabilityWeight}
                  onChange={(e) => setLocalWeights({ ...localWeights, availabilityWeight: Number(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleApplyWeights}
                className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Terapkan Pembobotan
              </button>
            </div>
          </div>
        )}

        {/* Productivity KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Trip Selesai</span>
            <span className="text-base font-extrabold text-white">{kpiOverview.completedTripsCount.currentValue.toLocaleString()}</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Trip / Kendaraan</span>
            <span className="text-base font-extrabold text-cyan-400">34.6 Trip</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Jarak / Kendaraan</span>
            <span className="text-base font-extrabold text-emerald-400">1,566 km</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">On-Time Delivery</span>
            <span className="text-base font-extrabold text-teal-400">94.6%</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Jam Operasi / Unit</span>
            <span className="text-base font-extrabold text-indigo-400">7.2 Jam/Hari</span>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Skor Armada Total</span>
            <span className="text-base font-extrabold text-amber-400">86.2 / 100</span>
          </div>
        </div>
      </div>

      {/* Vehicle Productivity Ranking Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 bg-slate-950/40">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Ranking Produktivitas Kendaraan</span>
            </h3>
            <p className="text-xs text-slate-400">Peringkat unit berdasarkan kombinasi pembobotan dinamis</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'BEST', label: 'Performa Terbaik' },
              { key: 'LOWEST', label: 'Performa Terendah' },
              { key: 'MOST_UTILIZED', label: 'Utilisasi Tertinggi' },
              { key: 'HIGHEST_MILEAGE', label: 'Jarak Tertinggi' },
              { key: 'HIGHEST_DOWNTIME', label: 'Downtime Tertinggi' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSortCriteria(f.key as any)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  sortCriteria === f.key
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-center w-12">Rank</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Driver Utama</th>
                <th className="px-4 py-3 text-center">Skor Produktivitas</th>
                <th className="px-4 py-3 text-center">Utilisasi</th>
                <th className="px-4 py-3 text-right">Trip Selesai</th>
                <th className="px-4 py-3 text-right">Total Jarak</th>
                <th className="px-4 py-3 text-right">Idle Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedVehicles.map((veh, index) => {
                const rankNum = index + 1;
                let rankBadge = 'bg-slate-800 text-slate-300';
                if (rankNum === 1) rankBadge = 'bg-amber-400 text-slate-950 font-extrabold shadow-sm';
                else if (rankNum === 2) rankBadge = 'bg-slate-300 text-slate-950 font-extrabold';
                else if (rankNum === 3) rankBadge = 'bg-amber-700 text-white font-extrabold';

                return (
                  <tr key={veh.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${rankBadge}`}>
                        {rankNum}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{veh.plateNumber}</div>
                      <div className="text-[11px] text-slate-400">{veh.model}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">{veh.primaryAssignedDriver || 'Rotasi Driver'}</div>
                      <div className="text-[11px] text-slate-500">{veh.branchName}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-base font-extrabold text-emerald-400">{veh.productivityScore}</span>
                      <span className="text-[10px] text-slate-500 block">/ 100</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-white">{veh.utilizationRate}%</td>
                    <td className="px-4 py-3 text-right font-medium text-white">{veh.tripCount} Trip</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-200">{veh.mileageKm.toLocaleString()} km</td>
                    <td className="px-4 py-3 text-right font-medium text-amber-300">{veh.idleHours} Jam</td>
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
