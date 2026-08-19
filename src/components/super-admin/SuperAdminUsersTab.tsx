/**
 * Fleet Intelligence Smart AI - Super Admin Cross-Platform Users Tab (Prompt 42)
 * Global User Management across all tenants, Lock/Unlock Accounts, Force Revoke Sessions,
 * 2FA Status Monitoring, and Security Role Audits.
 */

import React, { useState } from 'react';
import { PlatformUser } from '../../types/superAdmin';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  LogOut,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface SuperAdminUsersTabProps {
  users: PlatformUser[];
  onToggleUserLock: (user: PlatformUser) => void;
  onForceRevokeSessions: (user: PlatformUser) => void;
}

export const SuperAdminUsersTab: React.FC<SuperAdminUsersTabProps> = ({
  users,
  onToggleUserLock,
  onForceRevokeSessions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.tenantName.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="rounded-md bg-purple-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30">
            Super Admin
          </span>
        );
      case 'company_admin':
        return (
          <span className="rounded-md bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 border border-blue-500/30">
            Company Admin
          </span>
        );
      case 'fleet_manager':
        return (
          <span className="rounded-md bg-cyan-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
            Fleet Manager
          </span>
        );
      default:
        return (
          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {role.replace('_', ' ')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Manajemen Pengguna Lintas Platform (IAM)</h2>
          <p className="text-xs text-slate-400">
            Direktori pengguna seluruh tenant, autentikasi 2FA, sesi aktif, dan kontrol keamanan akun darurat.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pengguna, email, nomor HP, atau nama tenant..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Peran (Role)</option>
            <option value="super_admin">Super Admin</option>
            <option value="company_admin">Company Admin</option>
            <option value="fleet_manager">Fleet Manager</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="locked">Terkunci (Locked)</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3.5">Pengguna</th>
                <th className="px-4 py-3.5">Tenant / Perusahaan</th>
                <th className="px-4 py-3.5">Peran (Role)</th>
                <th className="px-4 py-3.5">Status 2FA & Sesi</th>
                <th className="px-4 py-3.5">Login Terakhir</th>
                <th className="px-4 py-3.5 text-right">Aksi Keamanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isLocked = u.status === 'locked' || u.status === 'suspended';

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* User identity */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 font-bold text-white text-xs">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white tracking-tight">{u.name}</span>
                            <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                            <p className="text-[10px] text-slate-500">{u.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Tenant */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <Building2 className="h-3.5 w-3.5 text-slate-500" />
                          <span className="truncate max-w-[200px]">{u.tenantName}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">{getRoleBadge(u.role)}</td>

                      {/* 2FA & Sessions */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {u.twoFactorEnabled ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <ShieldCheck className="h-3.5 w-3.5" /> 2FA Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                2FA Nonaktif
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-cyan-400 font-mono block">
                            {u.activeSessionsCount} Sesi Aktif
                          </span>
                        </div>
                      </td>

                      {/* Last Login */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="text-slate-300 block font-mono">
                            {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Belum pernah'}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {u.lastLoginLocation || 'Jakarta, ID'} ({u.lastLoginIp})
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Force Revoke Sessions */}
                          <button
                            onClick={() => onForceRevokeSessions(u)}
                            disabled={u.activeSessionsCount === 0}
                            title="Putus seluruh sesi login aktif pengguna ini"
                            className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700"
                          >
                            <LogOut className="h-3.5 w-3.5 text-amber-400" />
                            <span className="hidden sm:inline">Logout Sesi</span>
                          </button>

                          {/* Lock / Unlock Account */}
                          {isLocked ? (
                            <button
                              onClick={() => onToggleUserLock(u)}
                              title="Buka Kunci Akun Pengguna"
                              className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                            >
                              <Unlock className="h-3.5 w-3.5" />
                              <span>Buka Kunci</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onToggleUserLock(u)}
                              disabled={u.role === 'super_admin'}
                              title="Kunci Akun Pengguna (Disable Access)"
                              className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              <span>Kunci Akun</span>
                            </button>
                          )}
                        </div>
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
