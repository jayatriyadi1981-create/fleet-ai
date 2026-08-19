/**
 * Fleet Intelligence Smart AI - Trip History List
 * PROMPT 14 — Responsive Table & Mobile Cards for Trip Browsing
 */

import React from 'react';
import { DetailedTrip } from '../../modules/trips/types';
import { Play, MapPin, Clock, Gauge, ArrowRight, User, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TripHistoryListProps {
  trips: DetailedTrip[];
  selectedTripId: string | null;
  onSelectTrip: (trip: DetailedTrip) => void;
  onPlayTrip: (trip: DetailedTrip) => void;
  onOpenAiSummary: (trip: DetailedTrip) => void;
}

export const TripHistoryList: React.FC<TripHistoryListProps> = ({
  trips,
  selectedTripId,
  onSelectTrip,
  onPlayTrip,
  onOpenAiSummary,
}) => {
  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center my-4">
        <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-3 animate-bounce" />
        <h3 className="text-sm font-semibold text-gray-900">Tidak ada data perjalanan ditemukan</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          Coba sesuaikan kata kunci pencarian, ubah rentang tanggal, atau pilih filter armada lain.
        </p>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}j ${mins}m`;
    return `${mins} menit`;
  };

  const getStatusBadge = (status: DetailedTrip['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Aktif (Sedang Jalan)
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Selesai
          </span>
        );
      case 'INCOMPLETE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Tidak Lengkap
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">No Trip / Kendaraan</th>
              <th className="py-3 px-4">Pengemudi</th>
              <th className="py-3 px-4">Rute (Asal → Tujuan)</th>
              <th className="py-3 px-4 text-center">Jarak & Durasi</th>
              <th className="py-3 px-4 text-center">Kecepatan Maks</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trips.map((trip) => {
              const isSelected = selectedTripId === trip.id;
              return (
                <tr
                  key={trip.id}
                  onClick={() => onSelectTrip(trip)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 font-medium' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Trip / Vehicle */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">{trip.tripNumber}</div>
                    <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-gray-800">
                        {trip.vehiclePlate}
                      </span>
                      <span className="truncate max-w-[130px] text-[11px]">{trip.vehicleName}</span>
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {trip.driverPhoto ? (
                        <img
                          src={trip.driverPhoto}
                          alt={trip.driverName}
                          className="w-7 h-7 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {trip.driverName ? trip.driverName.charAt(0) : 'D'}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{trip.driverName || 'Belum diassign'}</div>
                        <div className="text-[11px] text-gray-400">{trip.driverPhone || '-'}</div>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4 max-w-[280px]">
                    <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                      <span className="truncate max-w-[110px]" title={trip.startAddress}>
                        {trip.startAddress.split(',')[0]}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate max-w-[110px]" title={trip.endAddress}>
                        {trip.endAddress.split(',')[0]}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Mulai: {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Distance & Duration */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="font-semibold text-gray-900">{trip.distanceKm} km</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {formatDuration(trip.durationSeconds)}
                    </div>
                  </td>

                  {/* Max Speed */}
                  <td className="py-3.5 px-4 text-center">
                    <div className={`font-semibold ${trip.maxSpeedKmH > 100 ? 'text-rose-600' : 'text-gray-900'}`}>
                      {trip.maxSpeedKmH} km/h
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Rata2: {trip.averageSpeedKmH} km/h</div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">{getStatusBadge(trip.status)}</td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPlayTrip(trip)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold transition-colors shadow-2xs"
                        title="Putar Playback Rute"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Playback</span>
                      </button>
                      <button
                        onClick={() => onOpenAiSummary(trip)}
                        className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-[11px] font-medium transition-colors"
                        title="Lihat AI Intelligence Summary"
                      >
                        AI Insight
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
  );
};
