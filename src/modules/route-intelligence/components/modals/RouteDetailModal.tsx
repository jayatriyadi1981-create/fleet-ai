/**
 * Fleet Intelligence Smart AI - Route Detail & Waypoint Drilldown Modal
 * Shows complete trip manifest, planned vs actual telemetry, waypoint timeline,
 * driver details, and deviation event history.
 */

import React from 'react';
import { ActiveTripRouteItem } from '../../types';
import { 
  X, 
  Navigation, 
  MapPin, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Truck,
  Gauge
} from 'lucide-react';

interface RouteDetailModalProps {
  trip: ActiveTripRouteItem | null;
  onClose: () => void;
}

export const RouteDetailModal: React.FC<RouteDetailModalProps> = ({ trip, onClose }) => {
  if (!trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-5 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black font-mono text-white">{trip.plateNumber}</h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">[{trip.tripNumber}]</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{trip.vehicleType} • {trip.branch}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Route Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">PREDIKSI ETA</span>
            <span className="text-base font-black font-mono text-cyan-300">{trip.predictedETA}</span>
            <span className="text-[10px] text-slate-400 block">{trip.etaRange}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">STATUS RUTE</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-1 ${
              trip.routeStatus === 'ON_ROUTE' ? 'bg-emerald-500/20 text-emerald-300' :
              trip.routeStatus === 'DEVIATED' ? 'bg-rose-500/20 text-rose-300' :
              'bg-amber-500/20 text-amber-300'
            }`}>
              {trip.routeStatus}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">JARAK DITEMPUH</span>
            <span className="text-sm font-black font-mono text-white">{trip.actualDistanceKm} / {trip.plannedDistanceKm} km</span>
            <span className="text-[10px] text-slate-400 block">Sisa: {trip.remainingDistanceKm} km</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">KONSUMSI BBM</span>
            <span className="text-sm font-black font-mono text-amber-300">{trip.fuelConsumedLiters} / {trip.fuelEstimatedLiters} L</span>
            <span className="text-[10px] text-slate-400 block">Solar B35</span>
          </div>
        </div>

        {/* Current Location & Status */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <MapPin className="h-4 w-4" />
              <span>Posisi Terakhir Telematika</span>
            </div>
            <span className="text-slate-400 font-mono">Kecepatan: {trip.currentSpeedKmh} km/j (Heading {trip.heading}°)</span>
          </div>
          <p className="text-slate-200">{trip.currentLocation.address}</p>
        </div>

        {/* Waypoints Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-cyan-400" /> Titik Check-Point & Waypoints Koridor
          </h4>

          <div className="space-y-2">
            {trip.waypoints.map((wp) => (
              <div
                key={wp.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  wp.reached
                    ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                    : 'bg-slate-950 border-cyan-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    wp.reached ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {wp.order}
                  </div>
                  <div>
                    <span className="font-semibold text-white">{wp.name}</span>
                  </div>
                </div>

                <div className="text-right">
                  {wp.reached ? (
                    <span className="text-emerald-400 font-mono">Tercapai pada: {wp.reachedAt} WIB</span>
                  ) : (
                    <span className="text-cyan-300 font-mono">Estimasi: {wp.estimatedArrival} WIB</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ETA Change Factors */}
        {trip.etaChangeFactors.length > 0 && (
          <div className="p-3.5 bg-amber-950/20 rounded-xl border border-amber-500/30 text-xs space-y-1.5">
            <span className="text-amber-400 font-bold block">Faktor Penyebab Perubahan ETA:</span>
            {trip.etaChangeFactors.map((f, idx) => (
              <div key={idx} className="text-slate-300 flex items-start gap-1">
                <span>•</span> <span>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
