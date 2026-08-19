/**
 * Fleet Intelligence Smart AI - Historical Route Performance Tab
 * Displays route reliability scores (0-100), historical trip statistics,
 * bottleneck KM markers, hourly duration profiles, and day-of-week intelligence.
 */

import React, { useState } from 'react';
import { HistoricalRouteItem } from '../../types';
import { historicalRouteEngine } from '../../engines/HistoricalRouteEngine';
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const HistoricalPerformanceTab: React.FC = () => {
  const routes = historicalRouteEngine.getAllHistoricalRoutes();
  const [selectedRoute, setSelectedRoute] = useState<HistoricalRouteItem>(routes[0]);

  return (
    <div className="space-y-6">
      {/* Route Selector Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((rt) => {
          const isSelected = rt.routeId === selectedRoute.routeId;

          return (
            <div
              key={rt.routeId}
              onClick={() => setSelectedRoute(rt)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-xl ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {rt.totalTripsAnalyzed} Trip Dianalisis
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  Skor: {rt.routePerformanceScore}/100
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 leading-snug">{rt.routeName}</h4>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="text-slate-400">
                  Avg Waktu: <strong className="text-slate-200 font-mono">{rt.avgDurationMinutes} mnt</strong>
                </div>
                <div className="text-slate-400">
                  On-Time: <strong className="text-emerald-400 font-mono">{rt.onTimeRatePercentage}%</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Route Detailed Drilldown */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-500 text-slate-950 uppercase">
                {selectedRoute.reliabilityCategory}
              </span>
              <h3 className="text-base font-bold text-white">{selectedRoute.routeName}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {selectedRoute.origin} ➔ {selectedRoute.destination} ({selectedRoute.avgDistanceKm} km)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tingkat On-Time</span>
              <span className="text-lg font-black font-mono text-emerald-400">{selectedRoute.onTimeRatePercentage}%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tingkat Deviasi</span>
              <span className="text-lg font-black font-mono text-cyan-400">{selectedRoute.deviationRatePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Bottlenecks Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Titik Hambatan / Bottleneck Koridor (KM Marker)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedRoute.bottlenecks.map((bn) => (
              <div key={bn.id} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{bn.locationLabel}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    +{bn.averageDelayMinutes} mnt delay
                  </span>
                </div>
                <p className="text-slate-400">{bn.dominantCause}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300">
                  <strong>Rekomendasi AI: </strong> {bn.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Profile & Day of Week Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Hourly Duration Profile */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-cyan-400" /> Profil Durasi Berdasarkan Jam Keberangkatan
            </h4>

            <div className="space-y-2 text-xs">
              {selectedRoute.hourlyTimeProfile.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="font-mono text-slate-300">{h.hour}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white">{h.avgDurationMinutes} Menit</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      h.trafficLevel === 'SEVERE' || h.trafficLevel === 'HEAVY' ? 'bg-rose-500/20 text-rose-300' :
                      h.trafficLevel === 'MODERATE' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {h.trafficLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day of Week Intelligence */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-400" /> Pola Risiko Keterlambatan Hari Kerja (Day-of-Week)
            </h4>

            <div className="space-y-2 text-xs">
              {selectedRoute.dayOfWeekIntelligence.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="font-bold text-slate-200">{d.day}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Rata-rata delay: <strong className="text-white font-mono">+{d.avgDelayMinutes} mnt</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.delayFrequency === 'HIGH' ? 'bg-rose-500/20 text-rose-300' :
                      d.delayFrequency === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {d.delayFrequency} Frequency
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
