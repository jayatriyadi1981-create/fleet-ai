/**
 * Fleet Intelligence Smart AI - Vehicle Performance Ranking & Scorecard View
 * PROMPT 36 - Sections 15 & 53
 */

import React, { useState } from 'react';
import { Truck, Award, CheckCircle2, AlertTriangle, Search, Filter, ArrowUpDown, ChevronRight, X } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { VehicleUtilizationMetric } from '../../types';

export const VehicleRankingView: React.FC = () => {
  const { vehicles } = useAnalytics();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<VehicleUtilizationMetric | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-cyan-400" />
          <span>Vehicle Performance Scorecard & Comprehensive Ranking</span>
        </h2>
        <p className="text-xs text-slate-400">
          Evaluasi multi-dimensi setiap armada: utilisasi, produktivitas, jarak tempuh, efisiensi waktu idle, dan ketersediaan teknis.
        </p>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {vehicles.slice(0, 3).map((veh, index) => {
          const rankColors = [
            'border-amber-400/40 bg-amber-950/20 text-amber-400',
            'border-slate-300/40 bg-slate-900/40 text-slate-200',
            'border-amber-700/40 bg-amber-950/10 text-amber-600',
          ];

          return (
            <div
              key={veh.vehicleId}
              onClick={() => setSelectedVehicleForModal(veh)}
              className={`rounded-2xl border p-5 backdrop-blur-md cursor-pointer transition-all hover:scale-[1.01] ${rankColors[index]}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 border border-slate-800 text-sm font-extrabold">
                  #{index + 1}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">{veh.status}</span>
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-extrabold text-white">{veh.plateNumber}</h3>
                <p className="text-xs text-slate-300">{veh.model}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Skor Produktivitas</span>
                    <span className="font-extrabold text-emerald-400 text-base">{veh.productivityScore}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tingkat Utilisasi</span>
                    <span className="font-extrabold text-cyan-400 text-base">{veh.utilizationRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Ranking Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari armada..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">Total {filteredVehicles.length} Kendaraan Terindeks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-center w-12">Rank</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Depo Cabang</th>
                <th className="px-4 py-3 text-center">Skor</th>
                <th className="px-4 py-3 text-center">Utilisasi</th>
                <th className="px-4 py-3 text-right">Trip</th>
                <th className="px-4 py-3 text-right">Jarak (Km)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredVehicles.map((veh, idx) => (
                <tr key={veh.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{veh.plateNumber}</div>
                    <div className="text-[11px] text-slate-400">{veh.model}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{veh.branchName}</td>
                  <td className="px-4 py-3 text-center font-extrabold text-emerald-400">{veh.productivityScore}</td>
                  <td className="px-4 py-3 text-center font-bold text-white">{veh.utilizationRate}%</td>
                  <td className="px-4 py-3 text-right font-medium text-white">{veh.tripCount}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-200">{veh.mileageKm.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700">
                      {veh.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedVehicleForModal(veh)}
                      className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-cyan-400 hover:bg-slate-700 transition-all"
                    >
                      Scorecard
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Scorecard Modal */}
      {selectedVehicleForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Scorecard Kendaraan: {selectedVehicleForModal.plateNumber}</h3>
                <p className="text-xs text-slate-400">{selectedVehicleForModal.model} • {selectedVehicleForModal.branchName}</p>
              </div>
              <button
                onClick={() => setSelectedVehicleForModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Skor Produktivitas</span>
                <span className="text-xl font-extrabold text-emerald-400">{selectedVehicleForModal.productivityScore} / 100</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Utilisasi Armada</span>
                <span className="text-xl font-extrabold text-cyan-400">{selectedVehicleForModal.utilizationRate}%</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Jam Beroperasi</span>
                <span className="text-base font-bold text-white">{selectedVehicleForModal.operatingHours} Jam</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Jam Idle</span>
                <span className="text-base font-bold text-amber-400">{selectedVehicleForModal.idleHours} Jam</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Jarak Tempuh</span>
                <span className="text-base font-bold text-white">{selectedVehicleForModal.mileageKm.toLocaleString()} km</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Trip Selesai</span>
                <span className="text-base font-bold text-white">{selectedVehicleForModal.tripCount} Trip</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVehicleForModal(null)}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Tutup Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
