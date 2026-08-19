/**
 * Fleet Intelligence Smart AI - Traffic Intelligence Tab
 * Monitors live road congestion segments, normal vs delayed travel times,
 * peak bottleneck hours, and impact on fleet trip durations.
 */

import React, { useState } from 'react';
import { TrafficIntelligenceSegment } from '../../types';
import { trafficIntelligenceEngine } from '../../engines/TrafficIntelligenceEngine';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  Search, 
  TrendingUp, 
  Layers, 
  MapPin, 
  CheckCircle2,
  Info
} from 'lucide-react';

export const TrafficIntelligenceTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const segments = trafficIntelligenceEngine.getAllSegments();
  const providerName = trafficIntelligenceEngine.getProviderName();

  const filtered = segments.filter((s) => 
    s.roadName.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner with Provider Status */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Segment Kepadatan Koridor Logistik Utama</h3>
            <p className="text-xs text-slate-400">
              Provider Telemetri Traffic: <span className="text-cyan-400 font-mono font-semibold">{providerName}</span>
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ruas tol atau jalan arteri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Segments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((seg) => {
          const isSevere = seg.trafficStatus === 'SEVERE';
          const isHeavy = seg.trafficStatus === 'HEAVY';

          return (
            <div key={seg.segmentId} className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSevere ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    isHeavy ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {seg.trafficStatus}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">{seg.roadName}</h4>
                  <span className="text-[11px] text-slate-400">{seg.city}</span>
                </div>
              </div>

              {/* Speed & Delay Stats */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">KECEPATAN SEGMEN</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black font-mono text-white">{seg.currentSpeedKmh}</span>
                    <span className="text-[10px] text-slate-400">/ {seg.freeFlowSpeedKmh} km/j (Free-flow)</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ESTIMASI DELAY</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black font-mono text-rose-300">+{seg.delayMinutes}</span>
                    <span className="text-[10px] text-rose-400">mnt (+{seg.delayPercentage}%)</span>
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex items-start gap-1.5">
                  <strong className="text-cyan-400 shrink-0">Dampak:</strong>
                  <span className="text-slate-300">{seg.bottleneckImpact}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <strong className="text-amber-400 shrink-0">Jam Puncak:</strong>
                  <span className="text-slate-400">{seg.peakHours}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
                {seg.historicalTrend}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
