/**
 * Fleet Intelligence Smart AI - Maintenance Risk Tab
 * Ranks all fleet vehicles by Maintenance Risk Score (0-100),
 * risk levels (Low, Moderate, High, Critical), trend analysis, and primary contributing factors.
 */

import React, { useState } from 'react';
import { VehicleMaintenanceProfile, MaintenanceRiskLevel } from '../../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity
} from 'lucide-react';

interface MaintenanceRiskTabProps {
  profiles: VehicleMaintenanceProfile[];
  onSelectVehicle: (profile: VehicleMaintenanceProfile) => void;
  onExplainAI: (profile: VehicleMaintenanceProfile) => void;
}

export const MaintenanceRiskTab: React.FC<MaintenanceRiskTabProps> = ({
  profiles,
  onSelectVehicle,
  onExplainAI,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('ALL');

  const filtered = profiles.filter((p) => {
    const matchesSearch = p.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.driverName.toLowerCase().includes(search.toLowerCase()) ||
      p.brandModel.toLowerCase().includes(search.toLowerCase()) ||
      p.branch.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedRiskLevel === 'ALL' || p.riskLevel === selectedRiskLevel;
    return matchesSearch && matchesLevel;
  }).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Maintenance Risk Evaluation (0-100)</h3>
            <p className="text-xs text-slate-400">
              Peringkat risiko pemeliharaan armada berdasarkan kombinasi telemetri, inspeksi, dan servis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat / supir / cabang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Level Risiko</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Risk Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Kendaraan</th>
              <th className="py-3 px-4 font-semibold">Cabang & Pengemudi</th>
              <th className="py-3 px-4 font-semibold">Skor Risiko (0-100)</th>
              <th className="py-3 px-4 font-semibold">Tren Risiko</th>
              <th className="py-3 px-4 font-semibold">Faktor Pemicu Utama</th>
              <th className="py-3 px-4 font-semibold">Status Sensor</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((profile) => {
              const isCrit = profile.riskLevel === 'CRITICAL';
              const isHigh = profile.riskLevel === 'HIGH';
              const isMod = profile.riskLevel === 'MODERATE';

              return (
                <tr key={profile.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">{profile.plateNumber}</div>
                    <div className="text-[11px] text-slate-400">{profile.brandModel}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200 font-medium">{profile.driverName}</div>
                    <div className="text-[11px] text-slate-400">{profile.branch}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold font-mono ${
                        isCrit ? 'text-rose-400' : isHigh ? 'text-orange-400' : isMod ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {profile.riskScore}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        isHigh ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                        isMod ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {profile.riskLevel}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-[11px]">
                      {profile.riskTrend === 'WORSENING' && (
                        <span className="text-rose-400 flex items-center gap-0.5 font-semibold">
                          <TrendingUp className="h-3.5 w-3.5" /> Meningkat
                        </span>
                      )}
                      {profile.riskTrend === 'IMPROVING' && (
                        <span className="text-emerald-400 flex items-center gap-0.5 font-semibold">
                          <TrendingDown className="h-3.5 w-3.5" /> Menurun
                        </span>
                      )}
                      {profile.riskTrend === 'STABLE' && (
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Minus className="h-3.5 w-3.5" /> Stabil
                        </span>
                      )}
                      {profile.riskTrend === 'VOLATILE' && (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Activity className="h-3.5 w-3.5" /> Volatile
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-slate-300 truncate">
                      {profile.activePredictions[0]?.potentialFailureMode || 'Tidak ada anomali terdeteksi'}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${profile.telemetryOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span className="text-[11px] text-slate-300 font-mono">
                        {profile.sensorReadings.batteryVoltage?.toFixed(1) || '24.5'}V • {profile.sensorReadings.coolantTempC || 88}°C
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onExplainAI(profile)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Explain AI
                      </button>
                      <button
                        onClick={() => onSelectVehicle(profile)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
