/**
 * Fleet Intelligence Smart AI - Route Fuel Analysis Tab
 * Analyzes route corridors, elevation profiles, traffic congestion points,
 * and cost per trip comparisons.
 */

import React from 'react';
import { RouteFuelAnalysisItem } from '../../types';
import { Waypoints, MapPin, TrendingUp, Sparkles, Navigation, Clock } from 'lucide-react';

interface RouteAnalysisTabProps {
  routeAnalysis: RouteFuelAnalysisItem[];
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const RouteAnalysisTab: React.FC<RouteAnalysisTabProps> = ({
  routeAnalysis,
  onExplainWithAI,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Waypoints className="h-4 w-4 text-cyan-400" />
          Analisis Efisiensi Konsumsi Koridor Rute (Route Fuel Benchmarking)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Menilai dampak topografi tanjakan jalan, kemacetan perkotaan, dan jalur tol vs arteri terhadap biaya bahan bakar per perjalanan.
        </p>
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routeAnalysis.map((route) => {
          const isElevated = route.deviationPercentage > 10;

          return (
            <div
              key={route.routeId}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {route.terrainProfile}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">{route.routeName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                    <span>{route.origin}</span>
                    <span>→</span>
                    <span>{route.destination}</span>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <span className="text-[10px] text-slate-400 block">Jarak Rute</span>
                  <span className="text-xs font-bold text-white">{route.distanceKm} km</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Rata-rata Konsumsi</span>
                  <span className="font-bold text-white text-xs">{route.avgConsumptionL100Km} L/100km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Deviasi vs Baseline</span>
                  <span className={`font-bold text-xs ${isElevated ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {route.deviationPercentage > 0 ? '+' : ''}{route.deviationPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Biaya BBM / Trip</span>
                  <span className="font-bold text-cyan-400 text-xs">
                    Rp {(route.avgFuelCostPerTripIdr / 1000).toFixed(0)} rb
                  </span>
                </div>
              </div>

              {/* AI Observation */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300">
                <p className="leading-snug">{route.aiObservation}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">
                  {route.totalTripsRecorded} Total Perjalanan Terekam
                </span>
                <button
                  onClick={() => onExplainWithAI('CONSUMPTION', `Analisis Rute ${route.routeName}`)}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Optimasi Rute AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
