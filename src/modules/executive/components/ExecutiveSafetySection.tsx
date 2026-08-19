/**
 * Fleet Intelligence Smart AI - Executive Safety Section
 * PROMPT 38 - Safety Score, Accidents, Behavior Telematics, Fatigue, and Critical Safety Alerts
 */

import React, { useState } from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Activity,
  AlertOctagon,
  Eye,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { SafetyCriticalAlertItem } from '../types';

export const ExecutiveSafetySection: React.FC = () => {
  const { safety } = useExecutive();
  const [selectedAlert, setSelectedAlert] = useState<SafetyCriticalAlertItem | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Fleet Safety, Driver Behavior & Compliance
            </h3>
            <p className="text-xs text-slate-500">
              Monitoring tingkat kepatuhan keselamatan berkendara, zero-accident record, dan insiden kritis.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span>Skor Keselamatan:</span>
          <strong className="text-indigo-700 font-bold text-sm">{safety.safetyScore}/100</strong>
        </div>
      </div>

      {/* Safety Matrix Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 my-5">
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Accidents
          </span>
          <div className="text-xl font-black text-emerald-700 mt-0.5">{safety.accidentsCount}</div>
          <p className="text-[10px] text-emerald-600 font-medium">Zero Fatal Incident</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Incidents Minor
          </span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{safety.incidentsCount}</div>
          <p className="text-[10px] text-slate-400">Kerusakan ringan</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Near Miss
          </span>
          <div className="text-xl font-black text-amber-700 mt-0.5">{safety.nearMissCount}</div>
          <p className="text-[10px] text-slate-400">Hampir tabrakan</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Overspeed
          </span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{safety.overspeedCount}</div>
          <p className="text-[10px] text-emerald-600 font-medium">-34% vs bln lalu</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Harsh Braking
          </span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{safety.harshBrakingCount}</div>
          <p className="text-[10px] text-slate-400">Rem mendadak</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Harsh Accel
          </span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{safety.harshAccelerationCount}</div>
          <p className="text-[10px] text-slate-400">Gas mendadak</p>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/70">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
            Fatigue Alerts
          </span>
          <div className="text-xl font-black text-rose-700 mt-0.5">{safety.fatigueAlertsCount}</div>
          <p className="text-[10px] text-rose-600 font-medium">Microsleep risk</p>
        </div>
      </div>

      {/* Critical Safety Alerts Widget */}
      {safety.criticalAlerts.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Peringatan Keselamatan Kritis Aktif (Memerlukan Tindakan)
            </span>
          </div>

          <div className="space-y-2.5">
            {safety.criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0 mt-0.5">
                    <AlertOctagon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{alert.plateNumber}</span>
                      <span className="text-xs text-slate-500">• Driver: <strong>{alert.driverName}</strong></span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold border border-rose-200">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-1">
                      {alert.event}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Lokasi: {alert.location} • {alert.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                    alert.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.status === 'RESOLVED' ? 'Resolved' : 'Investigating'}
                  </span>
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Detail</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h4 className="text-base font-bold text-slate-900">Detail Peringatan Keselamatan</h4>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Polisi:</span>
                  <strong className="text-slate-800">{selectedAlert.plateNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pengemudi:</span>
                  <strong className="text-slate-800">{selectedAlert.driverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lokasi Kejadian:</span>
                  <strong className="text-slate-800">{selectedAlert.location}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Telemetri:</span>
                  <strong className="text-slate-800">{selectedAlert.timestamp}</strong>
                </div>
                {selectedAlert.speedKmh && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kecepatan Tercatat:</span>
                    <strong className="text-rose-600">{selectedAlert.speedKmh} km/jam (Batas: {selectedAlert.speedLimitKmh} km/jam)</strong>
                  </div>
                )}
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="font-bold text-rose-900 block mb-1">Rekomendasi Tindakan Eksekutif:</span>
                <p className="text-rose-800">
                  Tugaskan Fleet Safety Officer untuk memanggil pengemudi dan melakukan briefing defensif sebelum penugasan trip berikutnya.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
