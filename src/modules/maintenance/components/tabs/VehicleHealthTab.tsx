/**
 * Fleet Intelligence Smart AI - Vehicle Health Tab
 * PROMPT 25 - Deep Vehicle Health Assessment & Telemetry Signal Monitoring
 */

import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Truck,
  Zap,
  Gauge,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { MOCK_VEHICLE_HEALTH } from '../../data/mockMaintenanceData';
import { VehicleHealth, VehicleHealthStatus } from '../../types';

interface VehicleHealthTabProps {
  onSelectVehicle: (vehicleId: string) => void;
}

export const VehicleHealthTab: React.FC<VehicleHealthTabProps> = ({ onSelectVehicle }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VehicleHealthStatus>('ALL');

  const filteredVehicles = MOCK_VEHICLE_HEALTH.filter((v) => {
    const matchSearch =
      v.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: VehicleHealthStatus) => {
    switch (status) {
      case 'HEALTHY':
        return <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">HEALTHY</span>;
      case 'GOOD':
        return <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">GOOD</span>;
      case 'ATTENTION':
        return <span className="bg-amber-950/80 text-amber-400 border border-amber-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">ATTENTION</span>;
      case 'AT_RISK':
        return <span className="bg-orange-950/80 text-orange-400 border border-orange-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold">AT RISK</span>;
      case 'CRITICAL':
        return <span className="bg-rose-950/80 text-rose-400 border border-rose-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">CRITICAL</span>;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500';
    if (score >= 80) return 'text-cyan-400 bg-cyan-500';
    if (score >= 65) return 'text-amber-400 bg-amber-500';
    if (score >= 50) return 'text-orange-400 bg-orange-500';
    return 'text-rose-400 bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            Kesehatan Fisik & Telemetri Armada (Vehicle Health)
          </h2>
          <p className="text-xs text-slate-400">
            Skor kesehatan multivariat (0–100) dihitung secara real-time berdasarkan kepatuhan servis, riwayat kerusakan, telemetri sensor OBD, dan kebiasaan pengemudi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari Plat / Tipe Kendaraan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-56 sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="HEALTHY">Healthy (90+)</option>
            <option value="GOOD">Good (80-89)</option>
            <option value="ATTENTION">Attention (65-79)</option>
            <option value="AT_RISK">At Risk (50-64)</option>
            <option value="CRITICAL">Critical (&lt;50)</option>
          </select>
        </div>
      </div>

      {/* Vehicle Health Grid / Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Kendaraan</th>
                <th className="p-4">Skor Kesehatan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Jadwal Servis (Last / Next)</th>
                <th className="p-4">Odometer & Jam Mesin</th>
                <th className="p-4">Isu Terbuka</th>
                <th className="p-4">Biaya Operasional (BBM + Servis)</th>
                <th className="p-4">AI Risk</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredVehicles.map((veh) => {
                const scoreColorClass = getScoreColor(veh.healthScore);
                const textColor = scoreColorClass.split(' ')[0];
                const barColor = scoreColorClass.split(' ')[1];

                return (
                  <tr
                    key={veh.vehicleId}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onSelectVehicle(veh.vehicleId)}
                  >
                    {/* Vehicle */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{veh.vehiclePlate}</span>
                          <span className="text-[11px] text-slate-400">{veh.brand} {veh.model}</span>
                        </div>
                      </div>
                    </td>

                    {/* Health Score */}
                    <td className="p-4">
                      <div className="space-y-1.5 w-28">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className={textColor}>{veh.healthScore}</span>
                          <span className="text-[10px] text-slate-500">/ 100</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${veh.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(veh.status)}
                    </td>

                    {/* Last / Next Service */}
                    <td className="p-4 text-xs">
                      <div className="text-slate-300">
                        <span className="text-slate-500 block text-[10px]">Terakhir: {veh.lastService}</span>
                        <span className={`font-semibold ${veh.nextService.includes('OVERDUE') ? 'text-rose-400 font-bold' : 'text-white'}`}>
                          Berikutnya: {veh.nextService}
                        </span>
                      </div>
                    </td>

                    {/* Odometer & Engine Hours */}
                    <td className="p-4">
                      <div className="text-slate-200">
                        <span className="font-mono font-bold block">{veh.mileageKm.toLocaleString()} KM</span>
                        <span className="text-[10px] text-slate-400">{veh.engineHours} Jam Kerja</span>
                      </div>
                    </td>

                    {/* Open Issues */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {veh.criticalIssuesCount > 0 ? (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800/50 px-2 py-0.5 rounded text-[11px] font-bold">
                            {veh.criticalIssuesCount} Kritis
                          </span>
                        ) : veh.openIssuesCount > 0 ? (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {veh.openIssuesCount} Minor
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Normal
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Operating Cost */}
                    <td className="p-4">
                      <div className="text-xs">
                        <span className="font-bold text-emerald-400 block">
                          Rp {((veh.totalOperatingCostIdr || veh.maintenanceCostIdr) / 1000000).toFixed(1)} Juta
                        </span>
                        <span className="text-[10px] text-slate-500">
                          (Rp {veh.costPerKm?.toLocaleString()}/KM)
                        </span>
                      </div>
                    </td>

                    {/* AI Risk */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        veh.aiRisk === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        veh.aiRisk === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                        veh.aiRisk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {veh.aiRisk}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVehicle(veh.vehicleId);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span>Detail</span>
                        <ChevronRight className="h-3.5 w-3.5" />
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
