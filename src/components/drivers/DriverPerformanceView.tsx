/**
 * Fleet Intelligence Smart AI - Driver Performance & Safety Analytics View
 * Leaderboard, Telemetry-Linked Safety Events (Speeding, Harsh Braking), and Risk Classification
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Award,
  TrendingUp,
  AlertTriangle,
  Clock,
  Gauge,
  Flame,
  UserCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { DriverExtended, DriverSafetyEvent } from '../../types/driver';
import { DriverService } from '../../services/driverService';

interface DriverPerformanceViewProps {
  onSelectDriver: (driverId: string) => void;
}

export const DriverPerformanceView: React.FC<DriverPerformanceViewProps> = ({ onSelectDriver }) => {
  const [drivers, setDrivers] = useState<DriverExtended[]>([]);
  const [safetyEvents, setSafetyEvents] = useState<DriverSafetyEvent[]>([]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const loadPerformance = async () => {
      const res = await DriverService.listDrivers({ page: 1, pageSize: 50 });
      setDrivers(res.drivers);

      const allEvents: DriverSafetyEvent[] = [];
      for (const d of res.drivers) {
        const events = await DriverService.getSafetyEventsByDriver(d.driverId);
        allEvents.push(...events);
      }
      setSafetyEvents(allEvents);
    };
    loadPerformance();
  }, [timeframe]);

  const sortedDrivers = [...drivers].sort((a, b) => b.safetyScore - a.safetyScore);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Rata-rata Safety Score Armada
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            88.6 <span className="text-xs font-normal text-slate-500">/ 100</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Insiden Speeding
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {safetyEvents.filter((e) => e.type === 'speeding').length} <span className="text-xs font-normal text-slate-500">Kejadian</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Harsh Braking & Accel
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
            {safetyEvents.filter((e) => e.type === 'harsh_braking' || e.type === 'harsh_acceleration').length}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Driver Teladan (Score &gt; 90)
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
            {drivers.filter((d) => d.safetyScore >= 90).length} <span className="text-xs font-normal text-slate-500">Orang</span>
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Peringkat Keselamatan Berkemudi (Safety Score Leaderboard)
          </h3>

          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeframe === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Pengemudi</th>
                <th className="px-4 py-3">Cabang</th>
                <th className="px-4 py-3">Total Jarak (KM)</th>
                <th className="px-4 py-3">Safety Score</th>
                <th className="px-4 py-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {sortedDrivers.map((driver, idx) => (
                <tr key={driver.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                    #{idx + 1}
                  </td>

                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                    <button
                      onClick={() => onSelectDriver(driver.driverId)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                    >
                      {driver.fullName}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {driver.branchName}
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-800 dark:text-slate-200">
                    {driver.totalDistanceKm.toLocaleString()} KM
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            driver.safetyScore >= 90
                              ? 'bg-emerald-500'
                              : driver.safetyScore >= 80
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${driver.safetyScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {driver.safetyScore}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectDriver(driver.driverId)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Lihat Analisis</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
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
