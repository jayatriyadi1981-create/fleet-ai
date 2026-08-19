/**
 * Fleet Intelligence Smart AI - Active Trips & Live ETA Tab
 * Displays detailed live tracking telemetry, ETA predictions, ETA ranges,
 * change factor explanations, and delay risk classifications for active trips.
 */

import React, { useState } from 'react';
import { ActiveTripRouteItem, ETADelayRisk, RouteStatus } from '../../types';
import { 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Bot
} from 'lucide-react';

interface ActiveTripsETATabProps {
  trips: ActiveTripRouteItem[];
  onSelectTrip: (trip: ActiveTripRouteItem) => void;
  onOptimizeRoute?: (trip: ActiveTripRouteItem) => void;
}

export const ActiveTripsETATab: React.FC<ActiveTripsETATabProps> = ({
  trips,
  onSelectTrip,
  onOptimizeRoute,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filtered = trips.filter((t) => {
    const matchesSearch = 
      t.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.driverName.toLowerCase().includes(search.toLowerCase()) ||
      t.tripNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.routeStatus === statusFilter;
    const matchesRisk = riskFilter === 'ALL' || t.delayRisk === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari plat nomor, supir, manifest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Status Rute</option>
            <option value="ON_ROUTE">On Route</option>
            <option value="DELAYED">Delayed</option>
            <option value="DEVIATED">Deviated (Off-Corridor)</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Risiko ETA</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
                <th className="py-3 px-4">Kendaraan & Trip</th>
                <th className="py-3 px-4">Asal ➔ Tujuan</th>
                <th className="py-3 px-4">Jarak & Progres</th>
                <th className="py-3 px-4">Prediksi ETA & Rentang</th>
                <th className="py-3 px-4">Lalu Lintas & Delay</th>
                <th className="py-3 px-4">Status & Kepatuhan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((trip) => {
                const isDeviated = trip.routeStatus === 'DEVIATED';
                const isDelayed = trip.delayRisk === 'HIGH' || trip.delayRisk === 'CRITICAL';

                return (
                  <tr key={trip.tripId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold font-mono text-white text-sm">{trip.plateNumber}</div>
                      <div className="text-[11px] text-slate-400">{trip.driverName}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">{trip.tripNumber}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-200 font-semibold">{trip.destination}</div>
                      <div className="text-[11px] text-slate-400">Dari: {trip.origin}</div>
                      <div className="text-[10px] text-slate-500">Berangkat: {trip.departureTime} WIB</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${Math.round((trip.actualDistanceKm / trip.plannedDistanceKm) * 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-300">
                          {trip.actualDistanceKm}/{trip.plannedDistanceKm} km
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Sisa: <strong className="text-white font-mono">{trip.remainingDistanceKm} km</strong> • {Math.round(trip.currentSpeedKmh)} km/j
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-sm font-black font-mono text-cyan-300">{trip.predictedETA}</div>
                      <div className="text-[10px] text-slate-400">Rentang: {trip.etaRange}</div>
                      {trip.etaChangeMinutes !== 0 && (
                        <div className={`text-[10px] font-semibold mt-0.5 ${trip.etaChangeMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {trip.etaChangeMinutes > 0 ? `+${trip.etaChangeMinutes} mnt vs jadwal` : `${trip.etaChangeMinutes} mnt lebih cepat`}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${
                          trip.trafficStatus === 'SEVERE' ? 'bg-rose-500 animate-ping' :
                          trip.trafficStatus === 'HEAVY' ? 'bg-rose-500' :
                          trip.trafficStatus === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className="font-bold text-slate-200">{trip.trafficStatus}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {trip.trafficDelayMinutes > 0 ? `+${trip.trafficDelayMinutes} mnt traffic delay` : 'Lancar'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDeviated ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        isDelayed ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {trip.routeStatus}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Kepatuhan: <strong className="text-slate-200">{trip.routeComplianceScore}%</strong>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectTrip(trip)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold transition-all"
                        >
                          Peta Live
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
