/**
 * Fleet Intelligence Smart AI - Activity Logs Tab
 * PROMPT 49 - Enterprise Audit Data Table & Mobile Responsive Cards
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  Shield,
  User,
  Activity,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { AuditEvent, AuditFilter, ActorType, ActionCategory, SecuritySeverity } from '../types/auditTypes';

interface Props {
  events: AuditEvent[];
  filter: AuditFilter;
  onFilterChange: (newFilter: Partial<AuditFilter>) => void;
  onResetFilter: () => void;
  onSelectEvent: (event: AuditEvent) => void;
  onExport: (format: 'CSV' | 'EXCEL' | 'PDF') => void;
}

export const ActivityLogsTab: React.FC<Props> = ({
  events,
  filter,
  onFilterChange,
  onResetFilter,
  onSelectEvent,
  onExport,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOW':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'FAILED':
      case 'BLOCKED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Action Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={filter.searchQuery || ''}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Cari user, aksi, entitas, ID, IP address, request ID..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                showAdvancedFilters
                  ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                  : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter {showAdvancedFilters ? 'Aktif' : 'Lanjutan'}</span>
            </button>

            <div className="relative group">
              <button className="px-3.5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                <Download className="h-4 w-4" />
                <span>Ekspor</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-20 w-36 text-xs">
                <button
                  onClick={() => onExport('CSV')}
                  className="px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-slate-200"
                >
                  Ekspor CSV (.csv)
                </button>
                <button
                  onClick={() => onExport('EXCEL')}
                  className="px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-slate-200"
                >
                  Ekspor Excel (.xlsx)
                </button>
                <button
                  onClick={() => onExport('PDF')}
                  className="px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-slate-200"
                >
                  Ekspor PDF (.pdf)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {/* Actor Type */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Tipe Pelaku
              </label>
              <select
                value={filter.actorType || 'ALL'}
                onChange={(e) => onFilterChange({ actorType: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Pelaku</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER ADMIN</option>
                <option value="AI">AI COPILOT</option>
                <option value="SYSTEM">SYSTEM / CRON</option>
              </select>
            </div>

            {/* Action Category */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Kategori Aksi
              </label>
              <select
                value={filter.actionCategory || 'ALL'}
                onChange={(e) => onFilterChange({ actionCategory: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="CRUD">CRUD (Data Master)</option>
                <option value="AUTHENTICATION">Otentikasi & Login</option>
                <option value="SECURITY">Keamanan (Security)</option>
                <option value="AI">AI Activity</option>
                <option value="EXPORT">Ekspor Data</option>
                <option value="CONFIGURATION">Konfigurasi</option>
                <option value="PERMISSION">Izin & Role</option>
                <option value="SYSTEM">Sistem & Scheduler</option>
                <option value="DOCUMENT">Dokumen Legalitas</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Tingkat Urgensi (Severity)
              </label>
              <select
                value={filter.severity || 'ALL'}
                onChange={(e) => onFilterChange({ severity: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Severity</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
                <option value="INFO">INFO</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Status Hasil
              </label>
              <select
                value={filter.status || 'ALL'}
                onChange={(e) => onFilterChange({ status: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="WARNING">WARNING</option>
              </select>
            </div>

            {/* Module */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Modul Sistem
              </label>
              <select
                value={filter.module || 'ALL'}
                onChange={(e) => onFilterChange({ module: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Modul</option>
                <option value="vehicles">Kendaraan</option>
                <option value="drivers">Pengemudi</option>
                <option value="routes">Rute</option>
                <option value="auth">Otentikasi</option>
                <option value="documents">Dokumen</option>
                <option value="fuel_intelligence">BBM & Telematika</option>
                <option value="cost_analytics">Biaya & TOC</option>
                <option value="roles_permissions">Role & Izin</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={onResetFilter}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Menampilkan <strong className="text-white">{events.length}</strong> catatan aktivitas audit
        </span>
      </div>

      {/* Desktop Data Table (Visible on lg and above) */}
      <div className="hidden lg:block rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Waktu (Timestamp)</th>
              <th className="py-3 px-4">Pelaku (Actor)</th>
              <th className="py-3 px-4">Aksi / Operasi</th>
              <th className="py-3 px-4">Modul & Target</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Severity</th>
              <th className="py-3 px-4">IP & Lokasi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="hover:bg-slate-800/50 transition cursor-pointer group"
                >
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {new Date(event.timestamp).toLocaleString('id-ID', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition">
                      {event.actor.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {event.actor.role}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">
                      {event.actionLabel || event.action}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">
                      {event.actionCategory}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-[200px] truncate">
                    <div className="font-medium text-white truncate">{event.entityName}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {event.module} • {event.entityType}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(
                        event.severity
                      )}`}
                    >
                      {event.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    <div>{event.security.ipAddress}</div>
                    <div className="text-[10px] text-slate-500">{event.security.city || 'N/A'}</div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button className="px-2.5 py-1 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 font-semibold text-xs transition">
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                  Tidak ada catatan audit yang cocok dengan kriteria filter Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards (Visible below lg) */}
      <div className="block lg:hidden space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition cursor-pointer space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleString('id-ID')}
                  </span>
                  <h4 className="text-xs font-bold text-white">{event.actionLabel || event.action}</h4>
                </div>
                <div className="flex gap-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getSeverityBadge(
                      event.severity
                    )}`}
                  >
                    {event.severity}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pelaku:</span>
                  <span className="font-bold text-white">
                    {event.actor.name} ({event.actor.role})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target:</span>
                  <span className="text-slate-200 truncate max-w-[180px]">{event.entityName}</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-slate-500">IP:</span>
                  <span className="text-slate-400">{event.security.ipAddress}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                  <span>Lihat Detail Lengkap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs rounded-2xl border border-dashed border-slate-800">
            Tidak ada catatan audit yang cocok.
          </div>
        )}
      </div>
    </div>
  );
};
