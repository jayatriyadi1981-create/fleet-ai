/**
 * Fleet Intelligence Smart AI - Live Route Intelligence Map
 * Renders Planned Route, Actual Trajectory, Alternative Route, Allowed Corridor,
 * Traffic Congestion Segments, Deviation Markers, Waypoints, and Live Vehicle Markers.
 */

import React, { useState } from 'react';
import { 
  ActiveTripRouteItem, 
  AlternativeRouteOption, 
  RouteDeviationEvent, 
  TrafficIntelligenceSegment 
} from '../types';
import { 
  Navigation, 
  AlertTriangle, 
  MapPin, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Compass, 
  ShieldAlert, 
  TrendingUp,
  Info,
  Sparkles,
  Route,
  Clock,
  Gauge
} from 'lucide-react';

interface LiveRouteMapProps {
  trip?: ActiveTripRouteItem | null;
  allTrips?: ActiveTripRouteItem[];
  alternativeRoute?: AlternativeRouteOption | null;
  activeDeviation?: RouteDeviationEvent | null;
  trafficSegments?: TrafficIntelligenceSegment[];
  onSelectTrip?: (trip: ActiveTripRouteItem) => void;
  onRequestReroute?: (trip: ActiveTripRouteItem) => void;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  trip,
  allTrips = [],
  alternativeRoute,
  activeDeviation,
  trafficSegments = [],
  onSelectTrip,
  onRequestReroute,
}) => {
  const [showTraffic, setShowTraffic] = useState(true);
  const [showPlanned, setShowPlanned] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [showDeviations, setShowDeviations] = useState(true);
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeTrip = trip || allTrips[0] || null;

  return (
    <div className={`relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-xl' : 'w-full h-[520px]'
    }`}>
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold font-mono text-white">
            {activeTrip ? `${activeTrip.plateNumber} • ${activeTrip.tripNumber}` : 'ARMADA AKTIF • LIVE TELEMATIKA'}
          </span>
        </div>

        {activeTrip?.routeStatus === 'DEVIATED' && (
          <div className="bg-rose-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-600/60 shadow-lg flex items-center gap-1.5 text-rose-300 text-xs font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Deviasi 420m (Off-Corridor)</span>
          </div>
        )}

        {activeTrip?.delayRisk === 'HIGH' && (
          <div className="bg-amber-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-600/60 shadow-lg flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5" />
            <span>ETA Mundur (+{activeTrip.etaChangeMinutes} mnt)</span>
          </div>
        )}
      </div>

      {/* Layer Toggles & Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-1">
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              showTraffic ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Traffic Layer"
          >
            Lalu Lintas
          </button>
          <button
            onClick={() => setShowPlanned(!showPlanned)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              showPlanned ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Planned Route"
          >
            Rencana
          </button>
          <button
            onClick={() => setShowActual(!showActual)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              showActual ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Actual GPS Path"
          >
            Aktual
          </button>
          <button
            onClick={() => setShowDeviations(!showDeviations)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              showDeviations ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Deviation Markers"
          >
            Deviasi
          </button>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white shadow-lg transition-all"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* SVG Stylized Interactive Map Canvas */}
      <div className="w-full h-full relative flex items-center justify-center bg-radial-at-c from-slate-900 via-slate-950 to-slate-950">
        <svg className="w-full h-full absolute inset-0 opacity-90" viewBox="0 0 1000 600" preserveAspectRatio="none">
          {/* Map Grid and Topography Background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="plannedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="actualGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="altGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Regional Landmass Outlines & River paths (Stylized Jakarta - Bandung Corridor) */}
          <path
            d="M 50 120 Q 200 80 450 140 T 900 180"
            fill="none"
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M 120 450 Q 400 380 750 480"
            fill="none"
            stroke="rgba(30, 41, 59, 0.6)"
            strokeWidth="28"
            strokeLinecap="round"
          />

          {/* Traffic Congestion Segments Layer */}
          {showTraffic && (
            <g id="traffic-layer">
              {/* Cikunir bottleneck (Red) */}
              <path
                d="M 280 230 Q 340 245 420 270"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Arteri Kalimalang (Orange) */}
              <path
                d="M 280 230 Q 320 280 390 295"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Cipali / Cikampek Utama (Green) */}
              <path
                d="M 420 270 Q 600 320 850 410"
                fill="none"
                stroke="#10b981"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          )}

          {/* Allowed Route Corridor (300m buffer) */}
          {showPlanned && (
            <path
              d="M 120 180 Q 260 210 420 270 T 880 430"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="28"
              strokeLinecap="round"
              strokeOpacity="0.12"
            />
          )}

          {/* Planned Route Line */}
          {showPlanned && (
            <path
              d="M 120 180 Q 260 210 420 270 T 880 430"
              fill="none"
              stroke="url(#plannedGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8 4"
            />
          )}

          {/* Alternative Route (if available) */}
          {alternativeRoute && (
            <path
              d="M 120 180 Q 240 130 520 210 T 880 430"
              fill="none"
              stroke="url(#altGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 6"
              opacity="0.9"
            />
          )}

          {/* Actual GPS Trajectory Line */}
          {showActual && (
            <path
              d="M 120 180 Q 220 195 280 230 L 330 285"
              fill="none"
              stroke="url(#actualGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          )}

          {/* Deviation Breakout Line */}
          {showDeviations && activeTrip?.routeStatus === 'DEVIATED' && (
            <g id="deviation-highlight">
              <line
                x1="280"
                y1="230"
                x2="330"
                y2="285"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx="330" cy="285" r="18" fill="#f43f5e" fillOpacity="0.2" className="animate-ping" />
              <circle cx="330" cy="285" r="8" fill="#f43f5e" />
              <text x="345" y="290" fill="#fda4af" fontSize="11" fontWeight="bold" fontFamily="monospace">
                X DEVIASI 420m (Off-Corridor)
              </text>
            </g>
          )}

          {/* Origin Marker */}
          <g transform="translate(120, 180)">
            <circle r="12" fill="#0284c7" fillOpacity="0.4" />
            <circle r="6" fill="#38bdf8" />
            <text x="14" y="4" fill="#bae6fd" fontSize="11" fontWeight="bold">
              {activeTrip?.origin || 'DC Cakung Jakarta'}
            </text>
          </g>

          {/* Waypoints */}
          {showWaypoints && (
            <>
              <g transform="translate(420, 270)">
                <circle r="7" fill="#6366f1" />
                <circle r="3" fill="#ffffff" />
                <text x="12" y="4" fill="#c7d2fe" fontSize="10">
                  WP1: Cikunir / KM 57
                </text>
              </g>
              <g transform="translate(640, 345)">
                <circle r="7" fill="#6366f1" />
                <circle r="3" fill="#ffffff" />
                <text x="12" y="4" fill="#c7d2fe" fontSize="10">
                  WP2: Cipularang KM 94
                </text>
              </g>
            </>
          )}

          {/* Destination Marker */}
          <g transform="translate(880, 430)">
            <circle r="14" fill="#10b981" fillOpacity="0.3" />
            <circle r="7" fill="#10b981" />
            <text x="-120" y="24" fill="#a7f3d0" fontSize="11" fontWeight="bold">
              {activeTrip?.destination || 'Hub Gedebage Bandung'}
            </text>
          </g>

          {/* Current Live Vehicle Marker */}
          <g transform="translate(330, 285)">
            <circle r="22" fill="#3b82f6" fillOpacity="0.25" className="animate-pulse" />
            <circle r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <polygon points="0,-6 5,5 -5,5" fill="#ffffff" transform="rotate(115)" />
          </g>
        </svg>

        {/* Live Vehicle Telematics Floating Card */}
        {activeTrip && (
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/80 shadow-2xl max-w-sm w-full">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black font-mono text-white tracking-wide">{activeTrip.plateNumber}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {activeTrip.vehicleType.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{activeTrip.driverName} • {activeTrip.branch}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Rute</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  activeTrip.routeStatus === 'ON_ROUTE' ? 'bg-emerald-500/20 text-emerald-300' :
                  activeTrip.routeStatus === 'DEVIATED' ? 'bg-rose-500/20 text-rose-300' :
                  'bg-amber-500/20 text-amber-300'
                }`}>
                  {activeTrip.routeStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 text-center">
              <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">PREDIKSI ETA</span>
                <span className="text-sm font-black font-mono text-cyan-300">{activeTrip.predictedETA}</span>
                <span className="text-[9px] text-slate-400 block">{activeTrip.etaRange}</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">SISA JARAK</span>
                <span className="text-sm font-black font-mono text-white">{activeTrip.remainingDistanceKm} km</span>
                <span className="text-[9px] text-slate-400 block">dari {activeTrip.plannedDistanceKm} km</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold">LALU LINTAS</span>
                <span className={`text-xs font-bold block mt-0.5 ${
                  activeTrip.trafficStatus === 'HEAVY' || activeTrip.trafficStatus === 'SEVERE' ? 'text-rose-400' :
                  activeTrip.trafficStatus === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {activeTrip.trafficStatus}
                </span>
                <span className="text-[9px] text-slate-400 block">+{activeTrip.trafficDelayMinutes} mnt delay</span>
              </div>
            </div>

            {onRequestReroute && activeTrip.routeStatus === 'DEVIATED' && (
              <button
                onClick={() => onRequestReroute(activeTrip)}
                className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold py-2 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Optimasi Rute Pemulihan (Reroute)
              </button>
            )}
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 shadow-lg text-[10px] text-slate-300 space-y-1 hidden md:block">
          <div className="flex items-center gap-2">
            <span className="h-2 w-5 rounded bg-gradient-to-r from-cyan-500 to-blue-500" />
            <span>Rute Rencana (Koridor 300m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-5 rounded bg-blue-500" />
            <span>Lintasan Aktual GPS</span>
          </div>
          {alternativeRoute && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-5 rounded bg-emerald-500" />
              <span>Rute Rekomendasi AI</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Titik Deviasi Jalur</span>
          </div>
        </div>
      </div>
    </div>
  );
};
