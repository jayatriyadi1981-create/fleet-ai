/**
 * Route Safety Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  Navigation, 
  Sparkles, 
  Search, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Moon,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { RouteSafetyProfile } from '../../types';

interface RouteSafetyTabProps {
  routes: RouteSafetyProfile[];
}

export const RouteSafetyTab: React.FC<RouteSafetyTabProps> = ({ routes }) => {
  const [search, setSearch] = useState('');

  const filtered = routes.filter(r =>
    r.routeName.toLowerCase().includes(search.toLowerCase()) ||
    r.origin.toLowerCase().includes(search.toLowerCase()) ||
    r.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Route Safety Intelligence & Corridor Risk
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filtered.length} Koridor Rute
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis risiko koridor rute, frekuensi kecelakaan historis, rasio insiden shift malam, dan panduan mitigasi keselamatan berkendara.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari rute, origin, destinasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div
            key={r.routeId}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-800 text-purple-400 font-mono text-xs font-bold flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{r.routeName}</h4>
                  <div className="text-[11px] text-slate-400">{r.origin} ➔ {r.destination} • {r.totalTripsCompleted} Trip Selesai</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Skor Keselamatan Rute</div>
                  <div className={`text-base font-bold font-mono ${
                    r.safetyScore >= 85 ? 'text-emerald-400' :
                    r.safetyScore >= 75 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {r.safetyScore} / 100
                  </div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                  r.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  r.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {r.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Histori Kecelakaan & Insiden</span>
                <div className="font-bold text-white font-mono mt-0.5">{r.historicalAccidentsCount} Laka, {r.historicalIncidentsCount} Insiden</div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Kejadian Near-Miss</span>
                <div className="font-bold text-white font-mono mt-0.5">{r.nearMissCount} Kejadian Tercatat</div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Hotspot Teridentifikasi</span>
                <div className="font-bold text-red-400 font-mono mt-0.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {r.identifiedHotspotsCount} Titik Rawan
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] text-slate-400">Rasio Insiden Malam Hari</span>
                <div className="font-bold text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5" /> {r.nightIncidentRatioPct}% Shift Malam
                </div>
              </div>
            </div>

            {/* Guidance */}
            <div className="p-2.5 rounded bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Panduan Keselamatan Koridor: <strong className="text-white">{r.recommendedSafetyGuidance}</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
