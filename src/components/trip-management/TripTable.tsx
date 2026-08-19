/**
 * Fleet Intelligence Smart AI - Planned Trip Table & Mobile List View
 * PROMPT 15 — Table displaying planned trips, quick operational actions & state badges
 */

import React from 'react';
import { PlannedTrip, PlannedTripStatus, TripPriority } from '../../modules/trips/plannedTripTypes';
import { TripStatusTransitionService } from '../../modules/trips/services/tripStatusService';
import {
  MapPin,
  Clock,
  Truck,
  User,
  AlertTriangle,
  Play,
  Send,
  Eye,
  MoreVertical,
  XCircle,
  Edit3,
  ExternalLink,
  Route,
} from 'lucide-react';

interface TripTableProps {
  trips: PlannedTrip[];
  selectedTripId: string | null;
  onSelectTrip: (trip: PlannedTrip) => void;
  onEditTrip: (trip: PlannedTrip) => void;
  onDispatchTrip: (trip: PlannedTrip) => void;
  onStartTrip: (trip: PlannedTrip) => void;
  onCancelTrip: (trip: PlannedTrip) => void;
  onTrackLive: (vehicleId: string) => void;
  onViewHistory: (actualTripId: string) => void;
}

export const TripTable: React.FC<TripTableProps> = ({
  trips,
  selectedTripId,
  onSelectTrip,
  onEditTrip,
  onDispatchTrip,
  onStartTrip,
  onCancelTrip,
  onTrackLive,
  onViewHistory,
}) => {
  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-2xs">
        <Route className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-900">Tidak Ada Trip Terencana</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
          Belum ada jadwal perjalanan yang cocok dengan filter pencarian Anda. Silakan atur ulang filter atau buat trip operasional baru.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Trip # & Ref</th>
              <th className="py-3 px-4">Kendaraan & Driver</th>
              <th className="py-3 px-4">Rute (Origin → Destination)</th>
              <th className="py-3 px-4">Jadwal & Live ETA</th>
              <th className="py-3 px-4">Status & Priority</th>
              <th className="py-3 px-4 text-right">Aksi Operasional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {trips.map((trip) => {
              const badgeStyle = TripStatusTransitionService.getStatusBadgeStyle(trip.status);
              const badgeLabel = TripStatusTransitionService.getStatusLabel(trip.status);

              const isSelected = selectedTripId === trip.id;
              const hasDelay =
                trip.status === 'IN_TRANSIT' &&
                trip.plannedEta &&
                trip.currentEta &&
                new Date(trip.currentEta).getTime() - new Date(trip.plannedEta).getTime() > 10 * 60 * 1000;

              return (
                <tr
                  key={trip.id}
                  onClick={() => onSelectTrip(trip)}
                  className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 font-medium' : ''
                  }`}
                >
                  {/* Trip # & Ref */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-gray-900 text-xs">{trip.tripNumber}</div>
                    {trip.referenceNumber && (
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">Ref: {trip.referenceNumber}</div>
                    )}
                    {trip.customerName && (
                      <div className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">{trip.customerName}</div>
                    )}
                  </td>

                  {/* Vehicle & Driver */}
                  <td className="py-3 px-4 align-top space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                      <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{trip.vehiclePlate || 'Belum Ditunjuk'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{trip.driverName || 'Belum Ditunjuk'}</span>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="py-3 px-4 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{trip.origin.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="line-clamp-1 font-semibold">{trip.destination.name}</span>
                      </div>
                      {trip.waypoints.length > 0 && (
                        <div className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block">
                          +{trip.waypoints.length} Waypoint Singgah
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Schedule & ETA */}
                  <td className="py-3 px-4 align-top space-y-1">
                    <div className="text-gray-900 font-mono text-[11px]">
                      Tgl: {trip.scheduledDate} ({trip.distanceKm} KM)
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        ETA:{' '}
                        {trip.currentEta
                          ? new Date(trip.currentEta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '-'}
                      </span>
                    </div>
                    {hasDelay && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Delay +17 mnt</span>
                      </div>
                    )}
                  </td>

                  {/* Status & Priority */}
                  <td className="py-3 px-4 align-top space-y-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                    >
                      {badgeLabel}
                    </span>

                    <div>
                      <span
                        className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                          trip.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : trip.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {trip.priority}
                      </span>
                    </div>
                  </td>

                  {/* Quick Actions */}
                  <td className="py-3 px-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Detail */}
                      <button
                        onClick={() => onSelectTrip(trip)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail Operational"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Dispatch button */}
                      {['PLANNED', 'ASSIGNED', 'READY'].includes(trip.status) && (
                        <button
                          onClick={() => onDispatchTrip(trip)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-[11px] font-bold shadow-2xs transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      )}

                      {/* Live Track */}
                      {trip.status === 'IN_TRANSIT' && trip.vehicleId && (
                        <button
                          onClick={() => onTrackLive(trip.vehicleId)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold shadow-2xs transition-all animate-pulse"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Live Track</span>
                        </button>
                      )}

                      {/* View History */}
                      {trip.status === 'COMPLETED' && (
                        <button
                          onClick={() => onViewHistory(trip.actualTripId || 'trp-001')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-bold shadow-2xs transition-all"
                        >
                          <Route className="w-3 h-3" />
                          <span>History</span>
                        </button>
                      )}

                      {/* Edit */}
                      {['DRAFT', 'PLANNED', 'ASSIGNED'].includes(trip.status) && (
                        <button
                          onClick={() => onEditTrip(trip)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Trip"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Cancel */}
                      {!['COMPLETED', 'CANCELLED', 'FAILED'].includes(trip.status) && (
                        <button
                          onClick={() => onCancelTrip(trip)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Batalkan Trip"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Cards View */}
      <div className="block lg:hidden divide-y divide-gray-200">
        {trips.map((trip) => {
          const badgeStyle = TripStatusTransitionService.getStatusBadgeStyle(trip.status);
          const badgeLabel = TripStatusTransitionService.getStatusLabel(trip.status);

          return (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className="p-4 space-y-3 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 text-sm">{trip.tripNumber}</span>
                  {trip.referenceNumber && (
                    <span className="text-xs text-gray-500 font-mono ml-2">Ref: {trip.referenceNumber}</span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                >
                  {badgeLabel}
                </span>
              </div>

              {/* Route */}
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-gray-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{trip.origin.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{trip.destination.name}</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Kendaraan:</span>
                  <span className="font-semibold text-gray-900">{trip.vehiclePlate || 'Belum Ditunjuk'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Driver:</span>
                  <span className="font-semibold text-gray-900">{trip.driverName || 'Belum Ditunjuk'}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-[11px] text-gray-500 font-mono">
                  Jadwal: {trip.scheduledDate} ({trip.distanceKm} KM)
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrip(trip);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg"
                >
                  Detail & Peta
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
