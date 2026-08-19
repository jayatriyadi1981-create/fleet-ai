/**
 * Fleet Intelligence Smart AI - Master Geofence Table Component
 * Displays interactive list of geofences with geometry badges, assigned vehicles, alerts & action buttons
 */

import React from 'react';
import { Geofence, GeofenceEvent } from '../geofenceTypes';
import { geofenceGeometryService } from '../services/geofenceGeometryService';
import {
  MapPin,
  Circle,
  Hexagon,
  Eye,
  Edit,
  Trash2,
  Clock,
  ShieldAlert,
  Download,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Layers,
  Truck
} from 'lucide-react';

interface GeofenceTableProps {
  geofences: Geofence[];
  events: GeofenceEvent[];
  onSelectGeofence: (geofenceId: string) => void;
  onEditGeofence: (geofenceId: string) => void;
  onViewEvents: (geofenceId: string) => void;
  onDeleteGeofence: (geofenceId: string) => void;
  onExportGeoJSONSingle?: (geofence: Geofence) => void;
}

export const GeofenceTable: React.FC<GeofenceTableProps> = ({
  geofences,
  events,
  onSelectGeofence,
  onEditGeofence,
  onViewEvents,
  onDeleteGeofence,
  onExportGeoJSONSingle
}) => {
  if (geofences.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Tidak Ada Geofence Ditemukan</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Tidak ada perimeter geofence yang cocok dengan kriteria pencarian Anda. Buat geofence baru untuk memulai pemantauan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Nama & Kode Geofence</th>
              <th className="py-3.5 px-3">Tipe & Kategori</th>
              <th className="py-3.5 px-3">Lokasi / Alamat</th>
              <th className="py-3.5 px-3">Radius / Luas Area</th>
              <th className="py-3.5 px-3">Penugasan Armada</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Last Event</th>
              <th className="py-3.5 px-3">Rules & Alerts</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {geofences.map((geofence) => {
              // Calculate Area or Radius display
              let areaText = '';
              if (geofence.type === 'CIRCLE') {
                areaText = `Radius: ${geofence.radiusMeters} m`;
              } else {
                const sqMeters = geofenceGeometryService.calculatePolygonAreaSquareMeters(geofence.polygonCoordinates);
                areaText = sqMeters > 10000 ? `${(sqMeters / 10000).toFixed(1)} Hektar` : `${sqMeters.toLocaleString('id-ID')} m²`;
              }

              // Get last event
              const lastEvt = events.find((e) => e.geofenceId === geofence.id);

              return (
                <tr
                  key={geofence.id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Name & Code */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 border border-white/30"
                        style={{ backgroundColor: geofence.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectGeofence(geofence.id)}
                            className="font-bold text-white hover:text-blue-400 text-xs transition-colors"
                          >
                            {geofence.name}
                          </button>
                          {geofence.priority === 'CRITICAL' && (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800 rounded">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                          {geofence.code}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type & Category */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300">
                        {geofence.type === 'CIRCLE' ? (
                          <Circle className="w-3 h-3 text-blue-400" />
                        ) : (
                          <Hexagon className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>{geofence.type}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {geofence.category}
                      </span>
                    </div>
                  </td>

                  {/* Location / Address */}
                  <td className="py-3.5 px-3 max-w-[200px]">
                    <div className="truncate text-xs font-medium text-slate-300" title={geofence.address || 'Tanpa Alamat'}>
                      {geofence.address || 'Koordinat terdaftar'}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {geofence.center.lat.toFixed(4)}, {geofence.center.lng.toFixed(4)}
                    </span>
                  </td>

                  {/* Radius / Area */}
                  <td className="py-3.5 px-3 font-mono text-xs text-blue-300 font-semibold">
                    {areaText}
                  </td>

                  {/* Vehicles Assigned */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>
                        {geofence.assignment.assignmentType === 'ALL'
                          ? 'Semua Armada (All)'
                          : geofence.assignment.vehicleGroupNames?.join(', ') || 'Grup Khusus'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        geofence.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          geofence.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                      {geofence.status}
                    </span>
                  </td>

                  {/* Last Event */}
                  <td className="py-3.5 px-3 text-[11px]">
                    {lastEvt ? (
                      <div>
                        <span
                          className={`font-bold ${
                            lastEvt.eventType === 'ENTER'
                              ? 'text-emerald-400'
                              : lastEvt.eventType === 'EXIT'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {lastEvt.eventType}
                        </span>
                        <span className="text-slate-400 block text-[10px]">
                          {lastEvt.vehiclePlate} • {new Date(lastEvt.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[10px]">Belum ada event</span>
                    )}
                  </td>

                  {/* Rules & Alerts */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-[10px]">
                      {geofence.entryEnabled && (
                        <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-900">
                          ENTER
                        </span>
                      )}
                      {geofence.exitEnabled && (
                        <span className="px-1.5 py-0.5 bg-amber-950 text-amber-400 rounded border border-amber-900">
                          EXIT
                        </span>
                      )}
                      {geofence.dwellEnabled && (
                        <span className="px-1.5 py-0.5 bg-purple-950 text-purple-400 rounded border border-purple-900">
                          DWELL ({geofence.dwellThresholdMinutes}m)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectGeofence(geofence.id)}
                        title="Lihat Peta & Detail"
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onViewEvents(geofence.id)}
                        title="Riwayat Event Geofence"
                        className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/80 rounded-lg transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEditGeofence(geofence.id)}
                        title="Edit Geofence"
                        className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/80 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteGeofence(geofence.id)}
                        title="Hapus Geofence"
                        className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
