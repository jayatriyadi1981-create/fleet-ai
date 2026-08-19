/**
 * Fleet Intelligence Smart AI - Super Admin Cross-Platform Audit Trail Tab (Prompt 42)
 * Comprehensive Security & Compliance Log: Tenant modifications, Quota overrides,
 * Support Access Impersonation sessions, and SRE Incident lifecycle events.
 */

import React, { useState } from 'react';
import { PlatformAuditLog } from '../../types/superAdmin';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  User,
  Building2,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface SuperAdminAuditTabProps {
  auditLogs: PlatformAuditLog[];
}

export const SuperAdminAuditTab: React.FC<SuperAdminAuditTabProps> = ({
  auditLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.ipAddress.includes(q) ||
        (log.targetTenantName && log.targetTenantName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getSeverityBadge = (sev: PlatformAuditLog['severity']) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="rounded-md bg-rose-950/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-300 border border-rose-500/40">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="rounded-md bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="rounded-md bg-cyan-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
            Medium
          </span>
        );
      default:
        return (
          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Low
          </span>
        );
    }
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Waktu', 'Aktor', 'Email', 'Peran', 'Aksi', 'Kategori', 'Detail', 'Target Tenant', 'IP Address', 'Severity'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actorName}"`,
      l.actorEmail,
      l.actorRole,
      l.action,
      l.category,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.targetTenantName || '-'}"`,
      l.ipAddress,
      l.severity,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saas_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Audit Trail & Rekam Jejak Kepatuhan Platform</h2>
          <p className="text-xs text-slate-400">
            Pencatatan tamper-proof seluruh aktivitas administratif berisiko tinggi, akses impersonasi, dan modifikasi kuota.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 transition-all border border-slate-700 shrink-0"
        >
          <Download className="h-4 w-4 text-cyan-400" />
          <span>Export CSV Audit</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aksi (TENANT_SUSPENDED), nama aktor, detail, atau tenant..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="TENANT">TENANT</option>
            <option value="USER">USER</option>
            <option value="SUBSCRIPTION">SUBSCRIPTION</option>
            <option value="IMPERSONATION">IMPERSONATION</option>
            <option value="SECURITY">SECURITY</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3.5">Waktu & Severity</th>
                <th className="px-4 py-3.5">Aktor Administratif</th>
                <th className="px-4 py-3.5">Aksi & Kategori</th>
                <th className="px-4 py-3.5">Detail Aktivitas</th>
                <th className="px-4 py-3.5">Target Tenant</th>
                <th className="px-4 py-3.5 text-right">IP & Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada log audit ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Time & Severity */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        {getSeverityBadge(log.severity)}
                        <span className="block font-mono text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-400 font-bold text-[10px]">
                          {log.actorName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{log.actorName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.actorRole}</span>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-cyan-300 block text-[11px]">{log.action}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-bold text-slate-400 uppercase">
                          {log.category}
                        </span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="text-slate-300 leading-relaxed text-[11px]">{log.details}</p>
                    </td>

                    {/* Target Tenant */}
                    <td className="px-4 py-3.5">
                      {log.targetTenantName ? (
                        <div className="flex items-center gap-1 text-slate-300 font-medium">
                          <Building2 className="h-3.5 w-3.5 text-slate-500" />
                          <span className="truncate max-w-[150px]">{log.targetTenantName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">— Platform Global</span>
                      )}
                    </td>

                    {/* IP & Location */}
                    <td className="px-4 py-3.5 text-right font-mono text-[10px] text-slate-400">
                      <div>{log.ipAddress}</div>
                      <div className="text-slate-500 font-sans">{log.location}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
