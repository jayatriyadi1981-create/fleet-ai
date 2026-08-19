/**
 * Fleet Intelligence Smart AI - Trip Summary & Analytics Card
 * PROMPT 14 — Metrics Grid (Distance, Duration, Moving, Stopped, Idle, Avg/Max Speed)
 */

import React from 'react';
import { DetailedTrip } from '../../modules/trips/types';
import { Route, Clock, Gauge, Zap, Fuel, User, MapPin, AlertCircle, Award } from 'lucide-react';

interface TripSummaryCardProps {
  trip: DetailedTrip;
  onOpenAiSummary: () => void;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ trip, onOpenAiSummary }) => {
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}j ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-5">
      {/* Header & AI Insights Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">{trip.tripNumber}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {trip.vehiclePlate}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{trip.vehicleName}</p>
        </div>

        <button
          onClick={onOpenAiSummary}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all"
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Analisis AI & Anomali</span>
        </button>
      </div>

      {/* Primary 6 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Distance */}
        <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-blue-700 text-xs font-medium">
            <Route className="w-3.5 h-3.5" />
            <span>Total Jarak</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mt-1">{trip.distanceKm} KM</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Odo: {trip.odometerDistanceKm || trip.distanceKm} KM</div>
        </div>

        {/* Metric 2: Total Duration */}
        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Total Durasi</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mt-1">{formatDuration(trip.durationSeconds)}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Mulai - Selesai</div>
        </div>

        {/* Metric 3: Moving Time */}
        <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>Durasi Jalan</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mt-1">{formatDuration(trip.movingDurationSeconds)}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">
            {Math.round((trip.movingDurationSeconds / trip.durationSeconds) * 100)}% dari total
          </div>
        </div>

        {/* Metric 4: Stopped & Idle */}
        <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Idle / Diam</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mt-1">{formatDuration(trip.idleDurationSeconds)}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">{trip.stopsCount} Pemberhentian</div>
        </div>

        {/* Metric 5: Average Speed */}
        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
            <Gauge className="w-3.5 h-3.5 text-blue-500" />
            <span>Kecepatan Rata2</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mt-1">{trip.averageSpeedKmH} KM/H</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Saat Bergerak</div>
        </div>

        {/* Metric 6: Max Speed */}
        <div className={`p-3 rounded-lg border ${trip.maxSpeedKmH > 100 ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`flex items-center gap-1.5 text-xs font-medium ${trip.maxSpeedKmH > 100 ? 'text-rose-700' : 'text-gray-600'}`}>
            <Gauge className="w-3.5 h-3.5" />
            <span>Kecepatan Maks</span>
          </div>
          <div className={`text-lg font-bold mt-1 ${trip.maxSpeedKmH > 100 ? 'text-rose-700' : 'text-gray-900'}`}>
            {trip.maxSpeedKmH} KM/H
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Batas Tol: 100 KM/H</div>
        </div>
      </div>

      {/* Driver & Fuel Logistics Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
        {/* Driver Card */}
        <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-lg border border-gray-200">
          {trip.driverPhoto ? (
            <img src={trip.driverPhoto} alt={trip.driverName} className="w-10 h-10 rounded-full object-cover border border-gray-300" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {trip.driverName ? trip.driverName.charAt(0) : 'D'}
            </div>
          )}
          <div>
            <div className="text-xs text-gray-500">Pengemudi Bertugas</div>
            <div className="text-sm font-semibold text-gray-900">{trip.driverName || 'Belum diassign'}</div>
            <div className="text-[11px] text-gray-500">{trip.driverPhone}</div>
          </div>
        </div>

        {/* Fuel & Efficiency */}
        <div className="flex items-center justify-between bg-amber-50/50 p-3 rounded-lg border border-amber-200/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-800 font-medium">Konsumsi Solar (Est)</div>
              <div className="text-sm font-bold text-gray-900">{trip.fuelConsumedLiters || 28.0} Liter</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-500">Rata-Rata Rasio</div>
            <div className="text-xs font-bold text-gray-900">
              {((trip.distanceKm || 50) / (trip.fuelConsumedLiters || 25)).toFixed(2)} KM / Liter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
