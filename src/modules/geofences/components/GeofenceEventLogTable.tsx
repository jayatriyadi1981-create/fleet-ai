/**
 * Fleet Intelligence Smart AI - Geofence Event History Table Component
 * Real-time event log viewer for ENTER, EXIT & DWELL detection events
 */

import React from 'react';
import { GeofenceEvent } from '../geofenceTypes';
import {
  Clock,
  ArrowRightLeft,
  Truck,
  User,
  MapPin,
  AlertTriangle,
  FileText,
  Calendar
} from 'lucide-react';

interface GeofenceEventLogTableProps {
  events: GeofenceEvent[];
  onSelectVehicle?: (vehicleId: string) => void;
  onSelectDriver?: (driverId: string) => void;
  onSelectTrip?: (tripId: string) => void;
}

export const GeofenceEventLogTable: React.FC<GeofenceEventLogTableProps> = ({
  events,
  onSelectVehicle,
  onSelectDriver,
  onSelectTrip
}) => {
  if (events.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-400">Belum ada riwayat aktivitas event terdeteksi pada geofence ini.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Riwayat Event Geofence ({events.length} Event)
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Waktu Event</th>
              <th className="py-3 px-3">Tipe Event</th>
              <th className="py-3 px-3">Armada & Pengemudi</th>
              <th className="py-3 px-3">Geofence Kawasan</th>
              <th className="py-3 px-3">Durasi Dwell</th>
              <th className="py-3 px-3">Trip Operasional</th>
              <th className="py-3 px-3">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {events.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                {/* Time */}
                <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                  {new Date(evt.timestamp).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>

                {/* Event Type Badge */}
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      evt.eventType === 'ENTER'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : evt.eventType === 'EXIT'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}
                  >
                    {evt.eventType}
                  </span>
                </td>

                {/* Vehicle & Driver */}
                <td className="py-3 px-3">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => onSelectVehicle && onSelectVehicle(evt.vehicleId)}
                      className="font-bold text-white hover:text-cyan-400 block"
                    >
                      {evt.vehiclePlate}
                    </button>
                    <span className="text-[10px] text-slate-400 block">
                      {evt.driverName || 'Driver Unassigned'}
                    </span>
                  </div>
                </td>

                {/* Geofence Name */}
                <td className="py-3 px-3 font-semibold text-slate-200">
                  {evt.geofenceName}
                </td>

                {/* Dwell Duration */}
                <td className="py-3 px-3 font-mono text-purple-300 font-bold">
                  {evt.dwellDurationMinutes ? `${evt.dwellDurationMinutes} menit` : '-'}
                </td>

                {/* Trip */}
                <td className="py-3 px-3">
                  {evt.tripNumber ? (
                    <button
                      onClick={() => onSelectTrip && evt.tripId && onSelectTrip(evt.tripId)}
                      className="text-[11px] font-mono font-bold text-blue-400 hover:underline"
                    >
                      {evt.tripNumber}
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500">-</span>
                  )}
                </td>

                {/* Severity */}
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${
                      evt.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : evt.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {evt.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
