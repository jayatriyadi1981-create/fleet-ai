/**
 * Fleet Intelligence Smart AI - Organization & Multi-Tenant Audit Trail
 * Records tenant switches, branch additions, fleet updates, and subscription changes
 */

import React, { useState } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { OrganizationAuditRecord } from '../../../types/organization';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Shield, 
  Globe, 
  Clock, 
  FileText, 
  ChevronRight,
  Building2,
  MapPin,
  Briefcase,
  Truck
} from 'lucide-react';

export const OrganizationAuditTab: React.FC = () => {
  const { auditLogs, currentTenant, tenants } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<OrganizationAuditRecord | null>(null);

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'TENANT':
        return Building2;
      case 'BRANCH':
        return MapPin;
      case 'DEPARTMENT':
        return Briefcase;
      case 'FLEET':
      default:
        return Truck;
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('CREATED')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (action.includes('UPDATED') || action.includes('SWITCHED')) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
    if (action.includes('PLAN')) {
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
    if (action.includes('DELETED')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const filteredLogs = auditLogs.filter((l) => {
    if (actionFilter !== 'all' && !l.action.includes(actionFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const entityVal = l.entityType || l.entity || '';
      const detailVal = l.details || l.afterData || l.beforeData || '';
      const match =
        l.entityName.toLowerCase().includes(q) ||
        l.actorName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        entityVal.toLowerCase().includes(q) ||
        detailVal.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Search & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari entitas, aksi, atau operator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Tipe Aksi</option>
            <option value="CREATED">Penciptaan (CREATED)</option>
            <option value="UPDATED">Perubahan (UPDATED)</option>
            <option value="SWITCHED">Alih Sesi (SWITCHED)</option>
            <option value="PLAN">Langganan (PLAN)</option>
            <option value="DELETED">Penghapusan (DELETED)</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total {filteredLogs.length} Entri Audit Terverifikasi
        </span>
      </div>

      {/* Audit List Table / Timeline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Waktu & Tanggal</th>
                <th className="px-4 py-3.5">Aksi / Operasi</th>
                <th className="px-4 py-3.5">Entitas Target</th>
                <th className="px-4 py-3.5">Operator & IP</th>
                <th className="px-4 py-3.5">Keterangan / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    Tidak ada riwayat audit yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const entityTypeVal = log.entityType || log.entity || 'FLEET';
                  const EntityIcon = getEntityIcon(entityTypeVal);

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Timestamp */}
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {new Date(log.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
                            <EntityIcon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{log.entityName}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {entityTypeVal} • {log.entityId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          <User className="h-3 w-3 text-slate-500" />
                          {log.actorName}
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                          {log.ipAddress}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3.5 text-slate-300 text-xs">
                        <p className="line-clamp-2 max-w-md">{log.details || log.afterData || log.beforeData || '-'}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
