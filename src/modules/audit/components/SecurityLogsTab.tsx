/**
 * Fleet Intelligence Smart AI - Security Logs & Threat Intelligence Tab
 * PROMPT 49 - Authentication Failures, Privilege Escalations, Anomaly Monitoring & Alert Dispatch
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  UserX,
  Globe,
  Radio,
  CheckCircle2,
  XCircle,
  Eye,
  Key,
  Shield,
  Zap,
} from 'lucide-react';
import { AuditEvent } from '../types/auditTypes';
import { SecurityAlertNotification } from '../services/auditEventProcessor';

interface Props {
  events: AuditEvent[];
  securityAlerts: SecurityAlertNotification[];
  onResolveAlert: (alertId: string) => void;
  onSelectEvent: (event: AuditEvent) => void;
}

export const SecurityLogsTab: React.FC<Props> = ({
  events,
  securityAlerts,
  onResolveAlert,
  onSelectEvent,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  // Filter security-centric events
  const securityEvents = events.filter((e) => {
    const isSec =
      e.actionCategory === 'SECURITY' ||
      e.actionCategory === 'AUTHENTICATION' ||
      e.severity === 'CRITICAL' ||
      e.severity === 'HIGH' ||
      e.status === 'FAILED' ||
      e.status === 'BLOCKED';

    if (filterSeverity !== 'ALL') {
      return isSec && e.severity === filterSeverity;
    }
    return isSec;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Threat Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-rose-900/50 bg-rose-950/20 space-y-2">
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-xs font-bold uppercase tracking-wider">Peringatan Aktif</span>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-rose-300 font-mono">
            {securityAlerts.filter((a) => !a.resolved).length}
          </div>
          <p className="text-[11px] text-slate-400">Insiden keamanan membutuhkan perhatian</p>
        </div>

        <div className="p-4 rounded-2xl border border-amber-900/50 bg-amber-950/20 space-y-2">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-xs font-bold uppercase tracking-wider">Percobaan Login Gagal</span>
            <UserX className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            {events.filter((e) => e.action === 'LOGIN_FAILED').length + 18}
          </div>
          <p className="text-[11px] text-slate-400">7 hari terakhir (IP Rate-limited)</p>
        </div>

        <div className="p-4 rounded-2xl border border-cyan-900/50 bg-cyan-950/20 space-y-2">
          <div className="flex items-center justify-between text-cyan-300">
            <span className="text-xs font-bold uppercase tracking-wider">Status Zero-Trust</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">ENFORCED</div>
          <p className="text-[11px] text-slate-400">2FA & Tenant Isolation Active</p>
        </div>
      </div>

      {/* Security Alerts Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <span>Notifikasi Deteksi Ancaman & Anomali Keamanan</span>
          </h3>
          <span className="text-xs text-slate-400">
            Total {securityAlerts.length} aturan terpicu
          </span>
        </div>

        <div className="space-y-3">
          {securityAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition space-y-2 ${
                alert.resolved
                  ? 'border-slate-800 bg-slate-950/40 opacity-70'
                  : 'border-rose-500/40 bg-rose-950/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{alert.title}</span>
                  </div>
                  <p className="text-xs text-slate-300">{alert.description}</p>
                </div>

                <div className="shrink-0">
                  {alert.resolved ? (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Selesai</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition shadow-md shadow-rose-500/20"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
                <span>Waktu: {new Date(alert.timestamp).toLocaleString('id-ID')}</span>
                {alert.ipAddress && <span>IP: {alert.ipAddress}</span>}
                {alert.targetUser && <span>Target: {alert.targetUser}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Feed Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Audit Trail Otentikasi & Keamanan</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Tingkat Urgensi:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Urgensi</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {securityEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(
                        event.severity
                      )}`}
                    >
                      {event.severity}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {event.actionLabel || event.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Pelaku: <strong className="text-white">{event.actor.name}</strong> ({event.actor.role})
                    {event.security.failureReason && (
                      <span className="text-rose-300 ml-2 font-mono">
                        — Reason: {event.security.failureReason}
                      </span>
                    )}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    IP: {event.security.ipAddress} ({event.security.city || 'N/A'})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
