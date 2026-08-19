/**
 * Fleet Intelligence Smart AI - Active Alerts Center Tab Component
 */

import React, { useState } from 'react';
import { Alert, ResolutionCode } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowUpRight,
  Filter,
  Search,
  Truck,
  UserCheck,
  Globe,
  Radio,
  XCircle,
} from 'lucide-react';

interface ActiveAlertsTabProps {
  alerts: Alert[];
  severityFilter: string;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string, code: ResolutionCode, note: string) => void;
  onEscalate: (alertId: string) => void;
  onOpenDetail: (alert: Alert) => void;
  onLiveTracking: (alert: Alert) => void;
}

export const ActiveAlertsTab: React.FC<ActiveAlertsTabProps> = ({
  alerts,
  severityFilter,
  onAcknowledge,
  onResolve,
  onEscalate,
  onOpenDetail,
  onLiveTracking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  // Resolve Modal State
  const [resolveModalAlert, setResolveModalAlert] = useState<Alert | null>(null);
  const [resolutionCode, setResolutionCode] = useState<ResolutionCode>('NORMAL_OPERATION');
  const [resolutionNote, setResolutionNote] = useState('');

  // Panic / SOS Alerts
  const panicAlerts = alerts.filter((a) => a.type === 'PANIC' && a.status === 'ACTIVE');

  // Filter & Sort
  const filteredAlerts = alerts.filter((a) => {
    if (a.status === 'RESOLVED' || a.status === 'DISMISSED') return false;

    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (selectedTypeFilter !== 'ALL' && a.type !== selectedTypeFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPlate = a.vehiclePlate.toLowerCase().includes(q);
      const matchDriver = (a.driverName || '').toLowerCase().includes(q);
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchLocation = (a.locationName || '').toLowerCase().includes(q);
      return matchPlate || matchDriver || matchTitle || matchLocation;
    }

    return true;
  });

  // Sort: Severity Order (CRITICAL -> HIGH -> MEDIUM -> LOW) then TriggeredAt DESC
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const sevOrder: Record<string, number> = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4, INFO: 5 };
    const diff = (sevOrder[a.severity] || 5) - (sevOrder[b.severity] || 5);
    if (diff !== 0) return diff;
    return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime();
  });

  const handleConfirmResolve = () => {
    if (resolveModalAlert) {
      onResolve(resolveModalAlert.id, resolutionCode, resolutionNote);
      setResolveModalAlert(null);
      setResolutionNote('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Panic Emergency Banner if SOS Active */}
      {panicAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-red-950/90 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-rose-950/50 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-600 rounded-xl text-white shadow-lg">
              <Radio className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  EMERGENCY SOS PANIC
                </span>
                <span className="text-xs text-rose-200 font-mono">
                  {panicAlerts.length} SOS AKTIF
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Panggilan Darurat Tombol SOS Kabin Ditekan!
              </h2>
              <p className="text-xs text-rose-200/90 mt-1">
                Driver <strong className="text-white">{panicAlerts[0].driverName}</strong> ({panicAlerts[0].vehiclePlate}) membutuhkan pertolongan darurat di lokasi: {panicAlerts[0].locationName}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onLiveTracking(panicAlerts[0])}
              className="flex-1 sm:flex-initial px-4 py-2 bg-white text-rose-950 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
            >
              <Globe className="w-4 h-4" />
              Lacak Posisi GPS Live
            </button>
            <button
              onClick={() => onAcknowledge(panicAlerts[0].id)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Tanggap Sinyal
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari plat nomor, driver, lokasi, atau nama alert..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Semua Jenis Alert</option>
            <option value="OVERSPEED">Overspeed</option>
            <option value="IDLE">Excessive Idle</option>
            <option value="DEVICE_OFFLINE">GPS Offline</option>
            <option value="GEOFENCE">Geofence Violation</option>
            <option value="ROUTE_DEVIATION">Route Deviation</option>
            <option value="IGNITION">Unauthorized Ignition</option>
            <option value="TEMPERATURE">Cold-Chain Temp</option>
            <option value="PANIC">SOS Panic Button</option>
          </select>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {sortedAlerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md ${
              alt.severity === 'CRITICAL'
                ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50 shadow-lg shadow-rose-950/20'
                : alt.severity === 'HIGH'
                ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Left Info */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                    alt.severity === 'CRITICAL'
                      ? 'bg-rose-500 text-white'
                      : alt.severity === 'HIGH'
                      ? 'bg-amber-500 text-slate-950'
                      : alt.severity === 'MEDIUM'
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {alt.severity}
                </span>

                <span className="font-mono font-bold text-sm text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                  {alt.vehiclePlate}
                </span>

                {alt.driverName && (
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    {alt.driverName}
                  </span>
                )}

                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(alt.triggeredAt).toLocaleTimeString('id-ID')} WIB
                </span>
              </div>

              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {alt.title}
                {alt.status === 'ACKNOWLEDGED' && (
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    ACKNOWLEDGED ({alt.acknowledgedBy})
                  </span>
                )}
                {alt.status === 'ESCALATED' && (
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                    ESCALATED (Level {alt.escalationLevel})
                  </span>
                )}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {alt.locationName}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Rule: {alt.ruleName || alt.type}
                </span>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0 w-full md:w-auto justify-end">
              <button
                onClick={() => onLiveTracking(alt)}
                title="Lacak di Peta GPS"
                className="p-2 bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 rounded-xl transition-all"
              >
                <Globe className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenDetail(alt)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
              >
                Detail
              </button>

              {alt.status === 'ACTIVE' && (
                <button
                  onClick={() => onAcknowledge(alt.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Acknowledge
                </button>
              )}

              <button
                onClick={() => setResolveModalAlert(alt)}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all"
              >
                Resolve
              </button>

              {alt.severity === 'CRITICAL' && (
                <button
                  onClick={() => onEscalate(alt.id)}
                  title="Eskalasi ke Manajemen"
                  className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {sortedAlerts.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
            <h3 className="text-base font-bold text-white">Tidak Ada Peringatan Aktif</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Seluruh armada beroperasi secara normal tanpa adanya pelanggaran aturan atau sinyal bahaya.
            </p>
          </div>
        )}
      </div>

      {/* Resolve Dialog Modal */}
      {resolveModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Penyelesaian Alert (Resolve)</h3>
              <button
                onClick={() => setResolveModalAlert(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Selesaikan peringatan untuk armada <strong className="text-white">{resolveModalAlert.vehiclePlate}</strong>: {resolveModalAlert.title}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Kode Penyelesaian (Resolution Code)</label>
                <select
                  value={resolutionCode}
                  onChange={(e) => setResolutionCode(e.target.value as ResolutionCode)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="NORMAL_OPERATION">Operasi Normal (Issue Resolved)</option>
                  <option value="FALSE_POSITIVE">False Positive (Toleransi Sistem)</option>
                  <option value="DRIVER_CONTACTED">Driver Sudah Dihubungi & Diperingatkan</option>
                  <option value="ISSUE_FIXED">Masalah Perangkat/Kendaraan Diperbaiki</option>
                  <option value="DEVICE_RECOVERED">GPS Device Online Kembali</option>
                  <option value="ROUTE_CORRECTED">Driver Kembali ke Rute Resmi</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Catatan Penanganan / Tindakan</label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Masukkan catatan penanganan dari tim operasi/dispatcher..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResolveModalAlert(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                Simpan & Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
