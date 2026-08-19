/**
 * Driver Safety Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { DriverSafetyProfile } from '../../types';

interface DriverSafetyTabProps {
  drivers: DriverSafetyProfile[];
  onOpenCoachingModal: (driver: DriverSafetyProfile) => void;
}

export const DriverSafetyTab: React.FC<DriverSafetyTabProps> = ({
  drivers,
  onOpenCoachingModal,
}) => {
  const [search, setSearch] = useState('');

  const filtered = drivers.filter(d => 
    d.driverName.toLowerCase().includes(search.toLowerCase()) ||
    d.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Driver Safety Intelligence & Transparent Scoring
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filtered.length} Pengemudi
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis transparansi skor keselamatan, faktor perilaku, kepatuhan fatigue, dan penugasan program coaching edukatif.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pengemudi, cabang..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Driver Cards / Table */}
      <div className="space-y-3">
        {filtered.map(driver => (
          <div
            key={driver.driverId}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold">
                  {driver.driverName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{driver.driverName}</h4>
                  <div className="text-[11px] text-slate-400">{driver.branch} • {driver.totalDrivingHoursLast30d} Jam Kemudi (30h)</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Skor Keselamatan</div>
                  <div className={`text-base font-bold font-mono ${
                    driver.overallSafetyScore >= 85 ? 'text-emerald-400' :
                    driver.overallSafetyScore >= 75 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {driver.overallSafetyScore} / 100
                  </div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                  driver.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  driver.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  driver.riskLevel === 'MODERATE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {driver.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Behavior & Factor Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Overspeed (30 Hari)</span>
                <div className="font-bold text-white font-mono mt-0.5">{driver.overspeedEventsLast30d} Kejadian</div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Harsh Braking</span>
                <div className="font-bold text-white font-mono mt-0.5">{driver.harshBrakingLast30d} Kejadian</div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Fatigue Alerts</span>
                <div className="font-bold text-white font-mono mt-0.5">{driver.fatigueAlertsLast30d} Peringatan</div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Histori Insiden</span>
                <div className="font-bold text-white font-mono mt-0.5">{driver.incidentsLast90d} Insiden, {driver.accidentsLast90d} Laka</div>
              </div>
            </div>

            {/* Coaching Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <div className="text-slate-300 text-[11px] truncate max-w-lg">
                <span className="text-slate-500">Rekomendasi Coaching:</span> <strong className="text-emerald-300">{driver.recommendedCoachingTopic}</strong>
              </div>
              <button
                onClick={() => onOpenCoachingModal(driver)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                {driver.isCoachingAssigned ? 'Lihat Program Coaching' : 'Tugaskan Coaching'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
