/**
 * Fleet Intelligence Smart AI - Driver Performance Analytics View
 * PROMPT 36 - Section 42
 */

import React, { useState } from 'react';
import { Users, Award, Shield, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export const DriverPerformanceView: React.FC = () => {
  const { driverProductivity } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredDrivers = driverProductivity.filter((d) => {
    const matchesSearch =
      d.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || d.fatigueRiskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-400" />
          <span>Driver Performance & Safety Matrix Intelligence</span>
        </h2>
        <p className="text-xs text-slate-400">
          Analisis holistik produktivitas pengemudi, kepatuhan keselamatan (Safety Score), tingkat risiko kelelahan (Fatigue), dan jam kerja aktif.
        </p>
      </div>

      {/* Driver Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengemudi atau depo cabang..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Tingkat Risiko</option>
              <option value="LOW">Risiko Rendah (Low)</option>
              <option value="MEDIUM">Risiko Sedang (Medium)</option>
              <option value="HIGH">Risiko Tinggi (High)</option>
              <option value="CRITICAL">Risiko Kritis (Critical)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Pengemudi</th>
                <th className="px-4 py-3">Depo Cabang</th>
                <th className="px-4 py-3 text-center">Skor Produktivitas</th>
                <th className="px-4 py-3 text-center">Safety Score</th>
                <th className="px-4 py-3 text-center">Tingkat Fatigue</th>
                <th className="px-4 py-3 text-right">Trip Selesai</th>
                <th className="px-4 py-3 text-right">Jarak Tempuh</th>
                <th className="px-4 py-3 text-right">Jam Kemudi</th>
                <th className="px-4 py-3 text-right">On-Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredDrivers.map((drv) => {
                let fatigueBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (drv.fatigueRiskLevel === 'MEDIUM') fatigueBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (drv.fatigueRiskLevel === 'HIGH' || drv.fatigueRiskLevel === 'CRITICAL')
                  fatigueBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                return (
                  <tr key={drv.driverId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">{drv.driverName}</td>
                    <td className="px-4 py-3 text-slate-300">{drv.branchName}</td>
                    <td className="px-4 py-3 text-center font-extrabold text-emerald-400 text-sm">
                      {drv.productivityScore}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-cyan-400">
                      {drv.safetyScore} / 100
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${fatigueBadge}`}>
                        {drv.fatigueRiskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">{drv.totalTrips}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-200">{drv.totalMileageKm.toLocaleString()} km</td>
                    <td className="px-4 py-3 text-right font-medium text-white">{drv.drivingHours} Jam</td>
                    <td className="px-4 py-3 text-right font-bold text-teal-400">{drv.onTimeDeliveryRate}%</td>
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
