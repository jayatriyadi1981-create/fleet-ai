/**
 * Fleet Intelligence Smart AI - Vehicle Fuel Ranking Tab
 * Ranks most efficient to least efficient vehicles with configurable trip thresholds
 * and baseline performance deviations.
 */

import React, { useState } from 'react';
import { VehicleFuelRankingItem } from '../../types';
import { Trophy, ArrowUpDown, Filter, Search, Sparkles, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface VehicleRankingTabProps {
  rankings: VehicleFuelRankingItem[];
  minTrips: number;
  onChangeMinTrips: (val: number) => void;
  onSelectVehicleDrilldown: (vehicleId: string) => void;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const VehicleRankingTab: React.FC<VehicleRankingTabProps> = ({
  rankings,
  minTrips,
  onChangeMinTrips,
  onSelectVehicleDrilldown,
  onExplainWithAI,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = rankings.filter(
    (r) =>
      r.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filter & Trip Threshold Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            Peringkat Efisiensi Bahan Bakar Kendaraan (Vehicle Fuel Leaderboard)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Urutan peringkat performa konsumsi bahan bakar dibandingkan target baseline jenis armada.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Filter Min. Trip:</span>
            <select
              value={minTrips}
              onChange={(e) => onChangeMinTrips(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value={1}>Minimal 1 Trip</option>
              <option value={5}>Minimal 5 Trip</option>
              <option value={10}>Minimal 10 Trip</option>
              <option value={20}>Minimal 20 Trip</option>
            </select>
          </div>

          <div className="relative w-48">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nopol/driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono">
              <tr>
                <th className="py-3.5 px-4 text-center">RANK</th>
                <th className="py-3.5 px-3">NOPOL & CABANG</th>
                <th className="py-3.5 px-3">DRIVER UTAMA</th>
                <th className="py-3.5 px-3 text-center">SKOR EFISIENSI</th>
                <th className="py-3.5 px-3 text-right">KONSUMSI (L/100KM)</th>
                <th className="py-3.5 px-3 text-right">KM / LITER</th>
                <th className="py-3.5 px-3 text-right">DEVIASI BASELINE</th>
                <th className="py-3.5 px-3 text-center">TRIP TERCATAT</th>
                <th className="py-3.5 px-4 text-center">DRILLDOWN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((item) => {
                const isTop = item.rank <= 3;
                const isWorst = item.deviationPercentage > 15;

                return (
                  <tr key={item.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono font-bold text-xs ${
                          item.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-white block">{item.plateNumber}</span>
                      <span className="text-[10px] text-slate-400">{item.branchName} • {item.vehicleType}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {item.assignedDriverName}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs ${
                          item.efficiencyScore >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.efficiencyScore >= 70
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.efficiencyScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {item.avgConsumptionL100Km}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {item.avgConsumptionKmL} km/L
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          item.deviationPercentage <= 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.deviationPercentage > 15
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.deviationPercentage > 0 ? '+' : ''}{item.deviationPercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {item.completedTripsCount} Trips
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectVehicleDrilldown(item.vehicleId)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 mx-auto transition-colors"
                      >
                        Buka Profil <ChevronRight className="h-3 w-3" />
                      </button>
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
