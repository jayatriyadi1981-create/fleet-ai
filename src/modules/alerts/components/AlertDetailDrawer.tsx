/**
 * Fleet Intelligence Smart AI - Alert Detail Drawer Component
 */

import React from 'react';
import { Alert } from '../types';
import { alertEventService } from '../services/alertEventService';
import { alertNotificationService } from '../services/alertNotificationService';
import { alertWebhookService } from '../services/alertWebhookService';
import {
  X,
  Truck,
  UserCheck,
  Cpu,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Send,
  History,
  Route,
  Package,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

interface AlertDetailDrawerProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onEscalate: (alertId: string) => void;
  onLiveTracking: (alert: Alert) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  alert,
  isOpen,
  onClose,
  onAcknowledge,
  onResolve,
  onEscalate,
  onLiveTracking,
}) => {
  if (!isOpen || !alert) return null;

  const events = alertEventService.getEventsForAlert(alert.id);
  const notifLogs = alertNotificationService.getLogsForAlert(alert.id);
  const webhookLogs = alertWebhookService.getLogsForAlert(alert.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : alert.severity === 'HIGH'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}
            >
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{alert.title}</h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    alert.status === 'ACTIVE'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : alert.status === 'ACKNOWLEDGED'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {alert.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pemicu: <strong className="text-slate-200">{alert.ruleName || alert.type}</strong> • Severity: {alert.severity}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 text-xs text-slate-300">
          {/* Action Header Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Waktu Kejadian</span>
              <div className="font-mono text-sm font-bold text-white mt-0.5">
                {new Date(alert.triggeredAt).toLocaleString('id-ID')} WIB
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onLiveTracking(alert)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                Live Map GPS
              </button>

              {alert.status === 'ACTIVE' && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Acknowledge
                </button>
              )}

              {alert.status !== 'RESOLVED' && (
                <button
                  onClick={() => onResolve(alert.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all"
                >
                  Resolve
                </button>
              )}

              {alert.severity === 'CRITICAL' && alert.status !== 'RESOLVED' && (
                <button
                  onClick={() => onEscalate(alert.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl transition-all"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Eskalasi
                </button>
              )}
            </div>
          </div>

          {/* Description & Threshold Snapshot */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-white text-xs">Pesan Peringatan & Nilai Ambang Batas</h3>
            <p className="text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
              {alert.message}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Nilai Terdeteksi:</span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  {String(alert.triggerValue)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Batas Ambang Toleransi:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {String(alert.thresholdValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Related Entities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle & Driver */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Truck className="w-4 h-4 text-emerald-400" />
                Armada & Pengemudi
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plat Nomor:</span>
                  <span className="font-bold text-white font-mono">{alert.vehiclePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-semibold text-slate-200">{alert.driverName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IMEI GPS:</span>
                  <span className="font-mono text-slate-400">{alert.imeiMasked || '••••••••••9821'}</span>
                </div>
              </div>
            </div>

            {/* Trip & Delivery */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Package className="w-4 h-4 text-indigo-400" />
                Trip & Kargo Terkait
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Trip:</span>
                  <span className="font-mono text-indigo-400 font-bold">{alert.tripNumber || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Pengiriman:</span>
                  <span className="font-mono text-emerald-400 font-bold">{alert.deliveryNumber || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rute Aktif:</span>
                  <span className="truncate max-w-[140px] text-slate-300">{alert.routeName || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <MapPin className="w-4 h-4 text-rose-400" />
              Lokasi GPS Pemicu Kejadian
            </h4>
            <div className="space-y-1">
              <div className="text-slate-200 font-medium">{alert.locationName}</div>
              <div className="font-mono text-slate-400 text-[11px]">
                Koordinat: {alert.latitude}, {alert.longitude}
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <History className="w-4 h-4 text-amber-400" />
              Jejak Audit Aktivitas (Audit Timeline)
            </h4>

            <div className="relative pl-4 border-l-2 border-slate-800 space-y-4 text-xs">
              {events.map((evt) => (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white capitalize">{evt.eventType}</span>
                    <span className="text-[10px] text-slate-500">{new Date(evt.timestamp).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Oleh: {evt.actorName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Logs */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Send className="w-4 h-4 text-sky-400" />
              Log Pengiriman Notifikasi & Webhook ({notifLogs.length})
            </h4>

            <div className="space-y-2">
              {notifLogs.map((nl) => (
                <div key={nl.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-indigo-400">{nl.channel}</span>
                    <span className="text-slate-400 block mt-0.5">{nl.recipient}</span>
                  </div>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {nl.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
