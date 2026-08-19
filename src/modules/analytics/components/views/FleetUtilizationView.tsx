/**
 * Fleet Intelligence Smart AI - Fleet Utilization View
 * PROMPT 36 - Sections 7, 8, 9, 10, 11, 12
 */

import React, { useState } from 'react';
import {
  PieChart,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { UtilizationFormulaType, UnderutilizedStatus } from '../../types';

export const FleetUtilizationView: React.FC = () => {
  const {
    vehicles,
    utilizationFormula,
    setUtilizationFormula,
    underutilizedThreshold,
    setUnderutilizedThreshold,
    setIsWhatIfModalOpen,
    setActiveTab,
  } = useAnalytics();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const underutilizedCount = vehicles.filter(
    (v) => v.status === 'UNDERUTILIZED' || v.status === 'CRITICAL_UNDERUTILIZED'
  ).length;
  const overutilizedCount = vehicles.filter((v) => v.status === 'OVERUTILIZED').length;
  const healthyCount = vehicles.filter((v) => v.status === 'HEALTHY').length;

  const totalOperatingHours = vehicles.reduce((acc, v) => acc + v.operatingHours, 0);
  const totalIdleHours = vehicles.reduce((acc, v) => acc + v.idleHours, 0);
  const totalDowntimeHours = vehicles.reduce((acc, v) => acc + v.downtimeHours, 0);
  const totalOfflineHours = vehicles.reduce((acc, v) => acc + v.offlineHours, 0);
  const grandTotalHours = totalOperatingHours + totalIdleHours + totalDowntimeHours + totalOfflineHours;

  const opPercent = Math.round((totalOperatingHours / (grandTotalHours || 1)) * 1000) / 10;
  const idlePercent = Math.round((totalIdleHours / (grandTotalHours || 1)) * 1000) / 10;
  const dtPercent = Math.round((totalDowntimeHours / (grandTotalHours || 1)) * 1000) / 10;
  const offPercent = Math.round((totalOfflineHours / (grandTotalHours || 1)) * 1000) / 10;

  return (
    <div className="space-y-6">
      {/* Top Banner & Formula Config */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 text-cyan-400" />
              <span>Analisis Utilisasi Armada & Konfigurasi Formula</span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluasi waktu aktif vs tidak aktif, deteksi underutilized, dan cegah kelelahan armada overutilized.
            </p>
          </div>

          {/* Formula Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Metode Formula:</span>
            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              {(['TIME_BASED', 'DISTANCE_BASED', 'TRIP_BASED'] as UtilizationFormulaType[]).map((formula) => (
                <button
                  key={formula}
                  onClick={() => setUtilizationFormula(formula)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    utilizationFormula === formula
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {formula === 'TIME_BASED' && 'Time-Based (Jam)'}
                  {formula === 'DISTANCE_BASED' && 'Distance-Based (Km)'}
                  {formula === 'TRIP_BASED' && 'Trip-Based (Frekuensi)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Threshold Slider & Quick Summary */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 pt-1">
          <div className="space-y-2 rounded-xl bg-slate-950/60 p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Batas Minimum Utilisasi (Threshold):</span>
              <span className="font-bold text-cyan-400">{underutilizedThreshold}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="80"
              step="5"
              value={underutilizedThreshold}
              onChange={(e) => setUnderutilizedThreshold(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Kendaraan di bawah <strong className="text-white">{underutilizedThreshold}%</strong> dikategorikan <em>Underutilized</em>.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold text-slate-400">Distribusi Utilisasi</span>
              <div className="mt-1 flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-bold">{healthyCount} Sehat</span>
                <span className="text-amber-400 font-bold">{underutilizedCount} Rendah</span>
                <span className="text-purple-400 font-bold">{overutilizedCount} Tinggi</span>
              </div>
            </div>
            {underutilizedCount > 0 && (
              <button
                onClick={() => setIsWhatIfModalOpen(true)}
                className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
              >
                <Sparkles className="h-3 w-3" />
                <span>Simulasi Relokasi</span>
              </button>
            )}
          </div>

          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] uppercase font-semibold text-slate-400">Status Waktu Operasional Total</span>
            <div className="mt-1 flex items-center gap-2 text-xs font-bold">
              <span className="text-emerald-400">Operasi {opPercent}%</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400">Idle {idlePercent}%</span>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400">Servis {dtPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Alokasi Waktu Jam Armada (Total {grandTotalHours.toLocaleString()} Jam Tersedia)
        </h3>
        <div className="h-4 rounded-full bg-slate-950 overflow-hidden flex shadow-inner">
          <div style={{ width: `${opPercent}%` }} className="h-full bg-emerald-500" title={`Operasi: ${opPercent}%`} />
          <div style={{ width: `${idlePercent}%` }} className="h-full bg-amber-400" title={`Idle: ${idlePercent}%`} />
          <div style={{ width: `${dtPercent}%` }} className="h-full bg-rose-500" title={`Maintenance: ${dtPercent}%`} />
          <div style={{ width: `${offPercent}%` }} className="h-full bg-slate-600" title={`Offline: ${offPercent}%`} />
        </div>
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Operasional Aktif ({opPercent}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Mesin On / Idle ({idlePercent}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Pemeliharaan / Downtime ({dtPercent}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-600" /> Standby / Offline ({offPercent}%)</span>
        </div>
      </div>

      {/* Vehicle Utilization Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        {/* Table Controls */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor polisi, tipe, atau depo..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="HEALTHY">Sehat (Healthy)</option>
              <option value="UNDERUTILIZED">Underutilized (&lt;{underutilizedThreshold}%)</option>
              <option value="CRITICAL_UNDERUTILIZED">Kritis (&lt;{underutilizedThreshold * 0.75}%)</option>
              <option value="OVERUTILIZED">Overutilized (&gt;95%)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Cabang / Divisi</th>
                <th className="px-4 py-3 text-center">Tingkat Utilisasi</th>
                <th className="px-4 py-3 text-right">Jam Operasi</th>
                <th className="px-4 py-3 text-right">Jam Idle</th>
                <th className="px-4 py-3 text-right">Downtime</th>
                <th className="px-4 py-3 text-right">Jarak (Km)</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredVehicles.map((veh) => {
                let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                let label = 'Healthy';

                if (veh.status === 'CRITICAL_UNDERUTILIZED') {
                  badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                  label = 'Critical Low';
                } else if (veh.status === 'UNDERUTILIZED') {
                  badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  label = 'Underutilized';
                } else if (veh.status === 'OVERUTILIZED') {
                  badgeClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                  label = 'Overutilized';
                }

                return (
                  <tr key={veh.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{veh.plateNumber}</div>
                      <div className="text-[11px] text-slate-400">{veh.model}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200">{veh.branchName}</div>
                      <div className="text-[11px] text-slate-500">{veh.department}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-bold text-white text-sm">{veh.utilizationRate}%</div>
                      <div className="h-1.5 w-16 mx-auto rounded-full bg-slate-800 overflow-hidden mt-1">
                        <div
                          style={{ width: `${Math.min(100, veh.utilizationRate)}%` }}
                          className={`h-full ${
                            veh.utilizationRate > 90
                              ? 'bg-purple-400'
                              : veh.utilizationRate > 70
                              ? 'bg-cyan-400'
                              : 'bg-amber-400'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">{veh.operatingHours}j</td>
                    <td className="px-4 py-3 text-right text-amber-300 font-medium">{veh.idleHours}j</td>
                    <td className="px-4 py-3 text-right text-rose-300 font-medium">{veh.downtimeHours}j</td>
                    <td className="px-4 py-3 text-right font-bold text-white">{veh.mileageKm.toLocaleString()}</td>
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
