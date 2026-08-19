/**
 * Fleet Intelligence Smart AI - Branch Comparison Analytics View
 * PROMPT 36 - Section 41
 */

import React from 'react';
import { Building2, TrendingUp, Award, PieChart, Navigation, Clock, AlertTriangle } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const BranchAnalyticsView: React.FC = () => {
  const { branchMatrices } = useAnalytics();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Building2 className="h-5 w-5 text-cyan-400" />
          <span>Multi-Branch & Regional Depot Performance Benchmark</span>
        </h2>
        <p className="text-xs text-slate-400">
          Komparasi performa operasional antar-depo cabang perusahaan untuk standardisasi SLA dan relokasi unit optimal.
        </p>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branchMatrices.map((b) => (
          <div
            key={b.branchId}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">{b.branchName}</h3>
                <span className="text-xs text-slate-400">{b.totalVehicles} Unit Kendaraan</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Produktivitas</span>
                <span className="text-lg font-extrabold text-emerald-400">{b.productivityScore} / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Utilisasi Armada</span>
                <span className="font-bold text-cyan-400 text-sm">{b.utilizationRate}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Ketersediaan Unit</span>
                <span className="font-bold text-teal-400 text-sm">{b.fleetAvailabilityPercent}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Jarak Tempuh</span>
                <span className="font-semibold text-white">{b.totalMileageKm.toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Trip Selesai</span>
                <span className="font-semibold text-white">{b.completedTrips} Trip</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Persentase Idle</span>
                <span className="font-semibold text-amber-400">{b.idlePercent}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Rasio Downtime</span>
                <span className="font-semibold text-rose-400">{b.downtimePercent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-400" />
            <span>Matriks Lengkap Komparasi Cabang</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Depo Cabang</th>
                <th className="px-4 py-3 text-right">Armada</th>
                <th className="px-4 py-3 text-center">Utilisasi</th>
                <th className="px-4 py-3 text-center">Skor Produktivitas</th>
                <th className="px-4 py-3 text-right">Jarak (Km)</th>
                <th className="px-4 py-3 text-right">Trip Selesai</th>
                <th className="px-4 py-3 text-right">Idle %</th>
                <th className="px-4 py-3 text-right">Downtime %</th>
                <th className="px-4 py-3 text-center">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {branchMatrices.map((b) => (
                <tr key={b.branchId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{b.branchName}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-200">{b.totalVehicles}</td>
                  <td className="px-4 py-3 text-center font-bold text-cyan-400">{b.utilizationRate}%</td>
                  <td className="px-4 py-3 text-center font-extrabold text-emerald-400">{b.productivityScore}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-200">{b.totalMileageKm.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-white">{b.completedTrips}</td>
                  <td className="px-4 py-3 text-right font-medium text-amber-300">{b.idlePercent}%</td>
                  <td className="px-4 py-3 text-right font-medium text-rose-300">{b.downtimePercent}%</td>
                  <td className="px-4 py-3 text-center font-bold text-teal-400">{b.fleetAvailabilityPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
