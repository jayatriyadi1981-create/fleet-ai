/**
 * Fleet Intelligence Smart AI - Route Intelligence Overview Tab
 * Executive summary, live tracking map integration, real-time ETA alerts,
 * active route bottlenecks, and proactive AI recommendations.
 */

import React from 'react';
import { 
  ActiveTripRouteItem, 
  RouteIntelligenceKPIs, 
  AIRouteRecommendation, 
  TrafficIntelligenceSegment 
} from '../../types';
import { LiveRouteMap } from '../LiveRouteMap';
import { 
  Navigation, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Fuel, 
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Bot
} from 'lucide-react';

interface OverviewTabProps {
  kpis: RouteIntelligenceKPIs;
  activeTrips: ActiveTripRouteItem[];
  trafficSegments: TrafficIntelligenceSegment[];
  recommendations: AIRouteRecommendation[];
  onSelectTrip: (trip: ActiveTripRouteItem) => void;
  onExplainAI: (rec: AIRouteRecommendation) => void;
  onNavigateTab: (tabKey: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kpis,
  activeTrips,
  trafficSegments,
  recommendations,
  onSelectTrip,
  onExplainAI,
  onNavigateTab,
}) => {
  const selectedTrip = activeTrips[0] || null;
  const criticalDeviations = activeTrips.filter((t) => t.routeStatus === 'DEVIATED');
  const delayedTrips = activeTrips.filter((t) => t.delayRisk === 'HIGH' || t.delayRisk === 'CRITICAL');

  return (
    <div className="space-y-6">
      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">PERJALANAN AKTIF</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Navigation className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">{kpis.activeTripsCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">{kpis.onTimeRate}% On-Time</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Armada dalam manifest & routing aktif</p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">RISIKO DELAY & ETA</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-amber-300">{kpis.etaRiskCount}</span>
            <span className="text-xs text-amber-400 font-semibold">Avg +{kpis.averageDelayMinutes} mnt</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akurasi prediksi model ETA: {kpis.averageEtaAccuracy}%</p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">DEVIASI RUTE (OFF-ROUTE)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-rose-300">{kpis.activeDeviationsCount}</span>
            <span className="text-xs text-rose-400 font-semibold">{criticalDeviations.length} Active Alert</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ambang batas koridor geofence: 300 meter</p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">EFISIENSI RUTE ARMADA</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-300">{kpis.routeEfficiencyScore}/100</span>
            <span className="text-xs text-emerald-400 font-semibold">Skor Tinggi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Kepatuhan rute koridor: {kpis.routeComplianceScore}%</p>
        </div>
      </div>

      {/* Live Route Intelligence Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Peta Live Telematika, Koridor & Deteksi Deviasi
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Pembaruan GPS real-time • Sinkronisasi CAN-Bus 5 detik
          </span>
        </div>

        <LiveRouteMap
          trip={selectedTrip}
          allTrips={activeTrips}
          trafficSegments={trafficSegments}
          onSelectTrip={onSelectTrip}
        />
      </div>

      {/* Two Columns: Live ETA Monitor & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active ETA & Delay Watchlist */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Monitoring Perubahan ETA & Risiko Keterlambatan</h4>
              </div>
              <button
                onClick={() => onNavigateTab('ACTIVE_TRIPS')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Lihat Semua ({activeTrips.length}) <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60 mt-3 space-y-3">
              {activeTrips.slice(0, 3).map((trip) => (
                <div 
                  key={trip.tripId} 
                  onClick={() => onSelectTrip(trip)}
                  className="pt-3 first:pt-0 cursor-pointer hover:bg-slate-800/40 p-2 rounded-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold font-mono text-white">{trip.plateNumber}</span>
                      <span className="text-xs text-slate-400 ml-2">• {trip.destination}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      trip.delayRisk === 'HIGH' || trip.delayRisk === 'CRITICAL' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {trip.delayRisk === 'HIGH' || trip.delayRisk === 'CRITICAL' ? `Delay +${trip.etaChangeMinutes} mnt` : 'Tepat Waktu'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div className="text-slate-400">
                      ETA Prediksi: <strong className="text-cyan-300 font-mono">{trip.predictedETA}</strong>
                    </div>
                    <div className="text-slate-400">
                      Sisa Jarak: <strong className="text-slate-200 font-mono">{trip.remainingDistanceKm} km</strong>
                    </div>
                    <div className="text-slate-400 text-right">
                      Lalu Lintas: <strong className="text-amber-300">{trip.trafficStatus}</strong>
                    </div>
                  </div>

                  {trip.etaChangeFactors.length > 0 && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">
                      Faktor: {trip.etaChangeFactors[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Proactive AI Route Recommendations */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Rekomendasi Rute & Reroute AI</h4>
              </div>
              <button
                onClick={() => onNavigateTab('AI_ADVISOR')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                AI Route Advisor <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {recommendations.slice(0, 2).map((rec) => (
                <div key={rec.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {rec.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-200 mt-1">{rec.title}</h5>
                    </div>
                    <span className="text-[10px] text-slate-400">{rec.confidence} Confidence</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{rec.why}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] truncate max-w-[240px]">
                      Trade-off: {rec.tradeOffs}
                    </span>
                    <button
                      onClick={() => onExplainAI(rec)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-[11px] transition-all"
                    >
                      Buka Bukti AI
                    </button>
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
