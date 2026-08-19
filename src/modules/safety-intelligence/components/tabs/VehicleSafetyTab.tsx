/**
 * Vehicle Safety Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  Truck, 
  Sparkles, 
  Search, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Activity,
  Disc,
  BatteryCharging
} from 'lucide-react';
import { VehicleSafetyProfile } from '../../types';

interface VehicleSafetyTabProps {
  vehicles: VehicleSafetyProfile[];
}

export const VehicleSafetyTab: React.FC<VehicleSafetyTabProps> = ({ vehicles }) => {
  const [search, setSearch] = useState('');

  const filtered = vehicles.filter(v =>
    v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Vehicle Safety Intelligence & Component Health
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filtered.length} Armada
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrasi riwayat pemeliharaan (P31) dan hasil checklist inspeksi (P26) untuk pencegahan kegagalan mekanis.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari plat nomor, tipe armada..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(veh => (
          <div
            key={veh.vehicleId}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{veh.plateNumber} ({veh.model})</h4>
                  <div className="text-[11px] text-slate-400">{veh.vehicleType} • {veh.branch}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Skor Keselamatan Armada</div>
                  <div className={`text-base font-bold font-mono ${
                    veh.overallSafetyScore >= 85 ? 'text-emerald-400' :
                    veh.overallSafetyScore >= 75 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {veh.overallSafetyScore} / 100
                  </div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                  veh.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  veh.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {veh.riskLevel}
                </span>
              </div>
            </div>

            {/* Component Health Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Sistem Rem</span>
                  <div className="font-bold text-white text-[11px]">{veh.brakeConditionStatus}</div>
                </div>
                <Disc className={`w-4 h-4 ${
                  veh.brakeConditionStatus === 'DEGRADED' ? 'text-red-400' :
                  veh.brakeConditionStatus === 'ATTENTION_REQUIRED' ? 'text-amber-400' : 'text-emerald-400'
                }`} />
              </div>

              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Kondisi Ban</span>
                  <div className="font-bold text-white text-[11px]">{veh.tireConditionStatus}</div>
                </div>
                <Activity className={`w-4 h-4 ${
                  veh.tireConditionStatus === 'WORN' ? 'text-red-400' :
                  veh.tireConditionStatus === 'FAIR' ? 'text-amber-400' : 'text-emerald-400'
                }`} />
              </div>

              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Status Baterai/Aki</span>
                  <div className="font-bold text-white text-[11px]">{veh.batteryStatus}</div>
                </div>
                <BatteryCharging className={`w-4 h-4 ${
                  veh.batteryStatus === 'REPLACE_SOON' ? 'text-red-400' : 'text-emerald-400'
                }`} />
              </div>

              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Temuan Inspeksi (P26)</span>
                  <div className="font-bold text-white text-[11px]">{veh.inspectionFailureCount30d} Kegagalan Checklist</div>
                </div>
                <Wrench className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-2.5 rounded bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Rekomendasi Pemeliharaan: <strong className="text-white">{veh.recommendedAction}</strong></span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Maintenance Risk Index: {veh.maintenanceRiskScore}%</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
