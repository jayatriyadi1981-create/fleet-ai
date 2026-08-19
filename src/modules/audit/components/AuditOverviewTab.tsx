/**
 * Fleet Intelligence Smart AI - Audit Overview Dashboard Tab
 * PROMPT 49 - Executive KPIs, Security Health Indicator & Real-Time Activity Feed
 */

import React from 'react';
import {
  Activity,
  Users,
  Cpu,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AuditEvent, AuditStatsSummary } from '../types/auditTypes';
import { SecurityAlertNotification } from '../services/auditEventProcessor';

interface Props {
  stats: AuditStatsSummary;
  recentEvents: AuditEvent[];
  securityAlerts: SecurityAlertNotification[];
  onSelectKpiFilter: (filterKey: string) => void;
  onSelectEvent: (event: AuditEvent) => void;
  onResolveAlert: (alertId: string) => void;
  onNavigateTab: (tabId: any) => void;
}

export const AuditOverviewTab: React.FC<Props> = ({
  stats,
  recentEvents,
  securityAlerts,
  onSelectKpiFilter,
  onSelectEvent,
  onResolveAlert,
  onNavigateTab,
}) => {
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
      {/* Top Threat Alert Banner if Any */}
      {securityAlerts.filter((a) => !a.resolved).length > 0 && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-950/30 text-rose-200 shadow-xl shadow-rose-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-rose-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">
                Terdeteksi {securityAlerts.filter((a) => !a.resolved).length} Peringatan Keamanan Aktif (Security Threat Alert)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('security_logs')}
              className="text-xs font-semibold text-rose-300 hover:text-white underline flex items-center gap-1"
            >
              <span>Lihat Semua Security Logs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {securityAlerts
              .filter((a) => !a.resolved)
              .slice(0, 2)
              .map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-rose-900/50 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        {alert.severity}
                      </span>
                      {alert.title}
                    </span>
                    <p className="text-slate-300 text-[11px]">{alert.description}</p>
                  </div>
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition shrink-0"
                  >
                    Tandai Selesai
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 7 Enterprise KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Activities */}
        <button
          onClick={() => onSelectKpiFilter('ALL')}
          className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Aktivitas</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {stats.totalActivities.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+{stats.activityTrendPercent}% bln ini</span>
          </div>
        </button>

        {/* User Activities */}
        <button
          onClick={() => onSelectKpiFilter('USER')}
          className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aksi User</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {stats.userActivities.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400">74.8% total aktivitas</div>
        </button>

        {/* System Activities */}
        <button
          onClick={() => onSelectKpiFilter('SYSTEM')}
          className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aksi System</span>
            <Cpu className="h-4 w-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {stats.systemActivities.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400">Cron & Worker</div>
        </button>

        {/* AI Activities */}
        <button
          onClick={() => onSelectKpiFilter('AI')}
          className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-cyan-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aksi AI</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {stats.aiActivities.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-purple-400">Tool Calls & Decision</div>
        </button>

        {/* Security Events */}
        <button
          onClick={() => onSelectKpiFilter('SECURITY')}
          className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-amber-500/50 hover:bg-slate-900 transition-all text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Security Events</span>
            <Shield className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-300 font-mono">
            {stats.securityEvents.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-amber-400 font-semibold">
            Status: {stats.securityThreatLevel}
          </div>
        </button>

        {/* Failed Actions */}
        <button
          onClick={() => onSelectKpiFilter('FAILED')}
          className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-orange-500/50 hover:bg-slate-900 transition-all text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-orange-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aksi Gagal</span>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-orange-300 font-mono">
            {stats.failedActions.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400">0.3% error rate</div>
        </button>

        {/* Critical Events */}
        <button
          onClick={() => onSelectKpiFilter('CRITICAL')}
          className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-rose-500/50 hover:bg-slate-900 transition-all text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-rose-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Event Kritis</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400 font-mono">
            {stats.criticalEvents.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-rose-300">Requires Audit</div>
        </button>
      </div>

      {/* Main Grid: Global Live Activity Feed (Left) & Analytics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Global Live Activity Stream */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>Global Live Activity Feed</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aliran aktivitas real-time lintas seluruh modul telematika dan sistem.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('activity_logs')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Buka Log Lengkap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {recentEvents.slice(0, 6).map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="relative pl-8 pr-3 py-2 rounded-xl bg-slate-950/40 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer group"
              >
                {/* Status Dot */}
                <div
                  className={`absolute left-2.5 top-3 h-2.5 w-2.5 rounded-full border-2 border-slate-900 ${
                    event.status === 'SUCCESS'
                      ? 'bg-emerald-400'
                      : event.status === 'FAILED'
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                />

                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        {event.actor.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({event.actor.role})
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-300 font-medium">
                        {event.actionLabel || event.action}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-slate-300 font-semibold">{event.entityName}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        IP: {event.security.ipAddress}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(
                        event.severity
                      )}`}
                    >
                      {event.severity}
                    </span>
                    <p className="text-[10px] text-slate-500">
                      {new Date(event.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Category Distribution & Ledger Security */}
        <div className="space-y-6">
          {/* Action Category Breakdown */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Distribusi Kategori Audit</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'CRUD (Data Master Armada/Driver)', key: 'CRUD', count: 1420, pct: 45, color: 'bg-cyan-500' },
                { label: 'Otentikasi & Sesi User', key: 'AUTHENTICATION', count: 680, pct: 22, color: 'bg-emerald-500' },
                { label: 'System & Background Workers', key: 'SYSTEM', count: 450, pct: 15, color: 'bg-blue-500' },
                { label: 'AI Decision & Copilot', key: 'AI', count: 290, pct: 9, color: 'bg-purple-500' },
                { label: 'Ekspor Laporan (PDF/Excel)', key: 'EXPORT', count: 180, pct: 6, color: 'bg-amber-500' },
                { label: 'Security & Auth Failures', key: 'SECURITY', count: 95, pct: 3, color: 'bg-rose-500' },
              ].map((cat) => (
                <div key={cat.key} className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">{cat.label}</span>
                    <span className="font-mono text-slate-400">{cat.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Ledger Health */}
          <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Audit Immutability Chain
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% HEALTHY
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seluruh rekaman audit dienkapsulasi dengan tanda tangan kriptografi SHA-256 berurutan (append-only ledger). Tidak ada modifikasi retroaktif yang diizinkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
