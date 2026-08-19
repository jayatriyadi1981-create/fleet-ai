import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { PermissionGuard } from '../auth/PermissionGuard';
import { roleService } from '../../services/rbac/roleService';
import { UserRole, AccessScope } from '../../types/rbac';
import { UserCheck, ShieldCheck, Plus, Edit3, Trash2, Key, Search, GitBranch, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

import { mockBranches } from '../../constants/mockData';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dept: string;
  branch: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export const UsersView: React.FC = () => {
  const { currentTenant, setActiveView } = useFleet();
  const { can, userRole: currentUserRole } = useAuthorization();

  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // User list state
  const [usersList, setUsersList] = useState<UserItem[]>([
    { id: 'usr-1', name: 'Suryadi Pratama', email: 'admin@fleet-demo.local', role: 'company_admin', dept: 'Eksekutif & Manajemen', branch: 'Kantor Pusat Jakarta', status: 'Active' },
    { id: 'usr-2', name: 'Budi Santoso', email: 'manager@fleet-demo.local', role: 'fleet_manager', dept: 'Divisi Operasional Armada', branch: 'Kantor Pusat Jakarta', status: 'Active' },
    { id: 'usr-3', name: 'Agus Setiawan', email: 'dispatcher@fleet-demo.local', role: 'dispatcher', dept: 'Dispatch & Penjadwalan', branch: 'Cabang Surabaya', status: 'Active' },
    { id: 'usr-4', name: 'Rina Wijaya', email: 'finance@fleet-demo.local', role: 'finance', dept: 'Keuangan & Akuntansi', branch: 'Kantor Pusat Jakarta', status: 'Active' },
    { id: 'usr-5', name: 'Hendra Saputra', email: 'ops@fleet-demo.local', role: 'operations', dept: 'Monitoring Telematika', branch: 'Cabang Medan', status: 'Active' },
    { id: 'usr-6', name: 'Bambang Sudirman', email: 'driver@fleet-demo.local', role: 'driver', dept: 'Pengemudi Armada', branch: 'Cabang Semarang', status: 'Active' },
    { id: 'usr-7', name: 'Eko Prasetyo', email: 'maint@fleet-demo.local', role: 'maintenance', dept: 'Teknisi & Bengkel', branch: 'Cabang Surabaya', status: 'Active' },
  ]);

  // Modal State for Assigning Role
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [selectedRoleForAssign, setSelectedRoleForAssign] = useState<UserRole>('fleet_manager');
  const [selectedBranchScope, setSelectedBranchScope] = useState<string>('Kantor Pusat Jakarta');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const availableRoles = roleService.getRoles();

  const handleOpenAssignModal = (u: UserItem) => {
    setEditingUser(u);
    setSelectedRoleForAssign(u.role);
    setSelectedBranchScope(u.branch);
  };

  const handleSaveRoleAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsersList((prev) =>
      prev.map((item) =>
        item.id === editingUser.id
          ? { ...item, role: selectedRoleForAssign, branch: selectedBranchScope }
          : item
      )
    );

    // Record audit log
    roleService.assignUserRole(
      editingUser.id,
      editingUser.name,
      selectedRoleForAssign,
      { branchId: selectedBranchScope },
      { userId: 'current-user', userName: 'Administrator', role: currentUserRole }
    );

    setEditingUser(null);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.dept.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase">
              TENANT MANAGEMENT
            </span>
            <span className="text-xs text-slate-400">• Role Based Access Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
            <UserCheck className="h-6 w-6 text-cyan-400" />
            Pengguna Perusahaan & Otorisasi Akun
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Kelola staf perusahaan, penugasan 9 role standar/kustom, serta batasan cakupan cabang ({currentTenant.name}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('roles_permissions')}
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-cyan-300 transition-colors shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Matriks RBAC & Hak Akses</span>
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
          </button>

          <PermissionGuard resource="user" action="create" mode="disable">
            <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-950/50">
              <Plus className="h-4 w-4" />
              <span>Undang Staf Baru</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      {isSavedNotice && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-400 font-semibold flex items-center justify-between">
          <span>Penugasan role dan cakupan cabang pengguna berhasil diperbarui!</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, divisi..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 shrink-0">Filter Role:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Peran (Roles)</option>
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((u) => {
            const roleDef = availableRoles.find((r) => r.id === u.role);

            return (
              <div
                key={u.id}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{u.name}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {u.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {u.email} • <span className="text-slate-300">{u.dept}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div className="text-right font-mono">
                    <span className="inline-block rounded-lg bg-slate-900 border border-slate-700 px-3 py-1 font-bold text-cyan-300 text-xs">
                      {roleDef?.name || u.role}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 justify-end">
                      <GitBranch className="h-3 w-3 text-cyan-400" />
                      {u.branch}
                    </p>
                  </div>

                  <PermissionGuard resource="user" action="edit" mode="disable">
                    <button
                      onClick={() => handleOpenAssignModal(u)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Ubah Role & Otorisasi Cabang"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </PermissionGuard>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ASSIGN ROLE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-cyan-400" />
                Penugasan Role Pengguna
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-white">{editingUser.name}</p>
              <p className="text-slate-400">{editingUser.email}</p>
            </div>

            <form onSubmit={handleSaveRoleAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Peran (Role) *</label>
                <select
                  value={selectedRoleForAssign}
                  onChange={(e) => setSelectedRoleForAssign(e.target.value as UserRole)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {availableRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.scope})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cakupan Cabang Perusahaan</label>
                <select
                  value={selectedBranchScope}
                  onChange={(e) => setSelectedBranchScope(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Kantor Pusat Jakarta">Kantor Pusat Jakarta</option>
                  <option value="Cabang Surabaya">Cabang Surabaya</option>
                  <option value="Cabang Medan">Cabang Medan</option>
                  <option value="Cabang Semarang">Cabang Semarang</option>
                  <option value="Cabang Balikpapan">Cabang Balikpapan</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Simpan Otorisasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
