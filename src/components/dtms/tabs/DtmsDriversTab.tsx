import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Award,
  Eye,
  Clock,
  Phone,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { DumpTruckDriver } from '../../../modules/dtms/types';

export const DtmsDriversTab: React.FC = () => {
  const [drivers] = useState<DumpTruckDriver[]>(dtmsService.getDrivers());

  return (
    <div id="dtms-drivers-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Roster Operator Dump Truck & AI Fatigue Radar (DSS)</span>
          </h2>
          <p className="text-xs text-slate-400">Database sertifikasi KIMPER tambang, SIM B2 Umum, deteksi kantuk (yawning/microsleep), dan insentif ritase</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Total Operator Aktif:</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">114 Driver Shift 1 & 2</span>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {drivers.map((d) => (
          <div key={d.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">{d.badgeNumber}</span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{d.name}</h3>
                <div className="text-[11px] text-slate-400">{d.assignedTruckHull}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400">{d.safetyScorePct}%</span>
                <div className="text-[10px] text-slate-400">Safety Score</div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">No. KIMPER</span>
                <span className="font-mono text-amber-300 font-bold">{d.kimperNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Masa Berlaku</span>
                <span className="text-slate-300">{d.kimperExpiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lisensi</span>
                <span className="text-slate-300">{d.simType}</span>
              </div>
            </div>

            {/* Fatigue & DSS Radar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>Skor Fatigue DSS</span>
                </span>
                <span className={`font-bold ${d.fatigueScorePct > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {d.fatigueScorePct}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.fatigueScorePct > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${d.fatigueScorePct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400">Ritase Hari Ini</span>
                <div className="font-bold text-slate-200">{d.todayRitsCompleted} Rits ({d.todayTonnageHauled} T)</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Insentif</span>
                <div className="font-bold text-emerald-400">Rp {d.incentiveBonusRp.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
