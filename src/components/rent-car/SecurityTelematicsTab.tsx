/**
 * Fleet Intelligence Smart AI - Rental Security, Geofencing & Anti-Theft Center
 */

import React, { useState } from 'react';
import { RentalVehicle, RentalTelemetryAlert } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  Zap, 
  Clock, 
  Check, 
  Layers,
  Bell,
  Gauge
} from 'lucide-react';

interface SecurityTelematicsTabProps {
  vehicles: RentalVehicle[];
  alerts: RentalTelemetryAlert[];
  onOpenImmobilizerModal: (vehicle: RentalVehicle) => void;
  onRefresh: () => void;
}

export const SecurityTelematicsTab: React.FC<SecurityTelematicsTabProps> = ({
  vehicles,
  alerts,
  onOpenImmobilizerModal,
  onRefresh
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    return filterSeverity === 'all' || a.severity === filterSeverity;
  });

  const handleResolveAlert = (alertId: string) => {
    rentCarService.resolveAlert(alertId, 'Petugas Command Center');
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Top Threat & Security Status Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Security Alerts Aktif</div>
            <div className="text-xl font-bold text-white font-mono">
              {alerts.filter(a => !a.resolved).length} <span className="text-xs font-normal text-rose-400">Insiden Terdeteksi</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">GPS Anti-Jammer Signal</div>
            <div className="text-xl font-bold text-white font-mono">
              100% <span className="text-xs font-normal text-emerald-400">Online 4G LTE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Starter Immobilizer Terkunci</div>
            <div className="text-xl font-bold text-white font-mono">
              {vehicles.filter(v => v.remoteImmobilizerStatus === 'locked').length} <span className="text-xs font-normal text-amber-400">Unit Terkunci</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Security Alerts Stream & Geofence Corridor Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Alerts Stream */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Log Ancaman & Pelanggaran Geofence Real-Time
              </h3>
            </div>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none"
            >
              <option value="all">Semua Tingkat Keparahan</option>
              <option value="critical">Critical (Bahaya Tinggi)</option>
              <option value="warning">Warning (Peringatan)</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/90 border border-slate-800 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <span>Semua unit berada dalam koridor aman dan tidak ada alarm pelanggaran aktif.</span>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const targetVehicle = vehicles.find((v) => v.id === alert.vehicleId);

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border transition-all ${
                      alert.resolved
                        ? 'bg-slate-900/50 border-slate-800 opacity-60'
                        : alert.severity === 'critical'
                          ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/20'
                          : 'bg-amber-950/20 border-amber-500/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl mt-0.5 ${
                          alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wide">
                              {alert.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                              {alert.plateNumber}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              alert.severity === 'critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                            }`}>
                              {alert.severity}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1">
                            {alert.message}
                          </p>

                          <div className="text-[10px] text-slate-500 font-mono mt-1.5 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {alert.location.address || `Lat: ${alert.location.lat.toFixed(4)}, Lng: ${alert.location.lng.toFixed(4)}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> {new Date(alert.timestamp).toLocaleTimeString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Immobilize / Resolve Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {targetVehicle && !alert.resolved && (
                          <button
                            onClick={() => onOpenImmobilizerModal(targetVehicle)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition-all flex items-center gap-1.5 shadow-md shadow-rose-950"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Immobilize</span>
                          </button>
                        )}

                        {!alert.resolved && (
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Selesai</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Geofence Corridor Matrix */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Pengaturan Koridor Geofence Sewa
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center justify-between">
                  <span>Jabodetabek Metro (Default)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">AKTIF</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Batas radius toleransi 45 km dari Monas / Bandara Soekarno Hatta. Alarm menyala otomatis jika unit menyeberang ke luar tol Cikampek Km 70.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center justify-between">
                  <span>Jawa & Bali Inter-City Tour</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">AKTIF</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Khusus paket All-In / Long-distance trip koridor Tol Trans Jawa (Jakarta - Surabaya - Denpasar).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center justify-between">
                  <span>Night Guard Parking Detector</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">24:00 - 05:00</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Deteksi otomatis jika kendaraan parkir di area rawan lebih dari 3 jam pada malam hari tanpa aktivitas mesin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
