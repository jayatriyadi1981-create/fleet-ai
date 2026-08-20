import React, { useState } from 'react';
import { VehicleAlertRecord } from '../../../types/vehicle';
import { ShieldAlert, AlertTriangle, CheckCircle2, MapPin, Gauge, Bell, ShieldCheck, User } from 'lucide-react';

interface SafetyTabProps {
  vehicleId: string;
  alerts: VehicleAlertRecord[];
  onResolveAlert: (alertId: string, resolutionNote: string) => Promise<void>;
}

export const SafetyTab: React.FC<SafetyTabProps> = ({ vehicleId, alerts, onResolveAlert }) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unresolvedAlerts = alerts.filter((a) => !a.isResolved);
  const resolvedAlerts = alerts.filter((a) => a.isResolved);

  const overspeedCount = alerts.filter((a) => a.alertType === 'overspeed').length;
  const harshBrakeCount = alerts.filter((a) => a.alertType === 'harsh_braking').length;
  const idleCount = alerts.filter((a) => a.alertType === 'idle_excess').length;

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertId || !resolutionNote) return;

    try {
      setIsSubmitting(true);
      await onResolveAlert(selectedAlertId, resolutionNote);
      setSelectedAlertId(null);
      setResolutionNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Score & KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driver Safety Score</p>
          <p className="text-xl font-mono font-bold text-emerald-400">94 / 100</p>
          <p className="text-[10px] text-cyan-400">Peringkat: Sangat Baik (A)</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overspeed Events</p>
          <p className="text-xl font-mono font-bold text-amber-400">{overspeedCount} Kasus</p>
          <p className="text-[10px] text-slate-400">Ambang Batas: 80 KM/H</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harsh Braking / Accel</p>
          <p className="text-xl font-mono font-bold text-emerald-400">{harshBrakeCount} Kejadian</p>
          <p className="text-[10px] text-slate-400">Deselerasi Aman</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Idle Berlebih (&gt;20m)</p>
          <p className="text-xl font-mono font-bold text-cyan-300">{idleCount} Kejadian</p>
          <p className="text-[10px] text-slate-400">Sensor Ignition On</p>
        </div>
      </div>

      {/* Alerts Log List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              Telematika Peringatan Keselamatan & Pelanggaran
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {unresolvedAlerts.length} Belum Diselesaikan • {resolvedAlerts.length} Selesai Ditangani
            </p>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-2">
            <ShieldCheck className="mx-auto h-8 w-8 text-emerald-500" />
            <p className="text-xs text-slate-400">Tidak ada alarm pelanggaran atau insiden keselamatan terdeteksi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border p-4 space-y-3 transition-all ${
                  alert.isResolved
                    ? 'border-slate-800 bg-slate-950/60 opacity-80'
                    : 'border-rose-500/30 bg-rose-950/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : alert.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      ● {alert.severity}
                    </span>
                    <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(alert.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{alert.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex flex-wrap items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      {alert.locationAddress}
                    </span>
                    {alert.speedAtEvent !== undefined && alert.speedAtEvent > 0 && (
                      <span className="flex items-center gap-1 font-mono text-amber-400">
                        <Gauge className="h-3.5 w-3.5" />
                        {alert.speedAtEvent} KM/H
                      </span>
                    )}
                  </div>

                  {alert.isResolved ? (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Selesai: {alert.resolutionNote}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAlertId(alert.id)}
                      className="rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 text-xs font-bold hover:bg-cyan-500/30"
                    >
                      Selesaikan Peringatan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {selectedAlertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Selesaikan Peringatan Keselamatan
            </h3>

            <form onSubmit={handleResolve} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Tindak Lanjut / Investigasi
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Driver telah ditegur dan diberikan briefing kepatuhan batas kecepatan tol."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAlertId(null)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Selesai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
