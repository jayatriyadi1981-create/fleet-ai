/**
 * Fleet Intelligence Smart AI - Enterprise Role & Permission Management (RBAC) View
 */

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { roleService } from '../../services/rbac/roleService';
import { PERMISSION_CATALOG, PERMISSION_MODULE_GROUPS } from '../../services/rbac/permissionCatalog';
import { RoleDefinition, UserRole, AccessScope, PermissionAction, ResourceModule } from '../../types/rbac';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Users, 
  Lock, 
  Key, 
  RefreshCw, 
  AlertTriangle,
  FileSpreadsheet,
  History,
  Sparkles,
  UserCheck,
  Building2,
  GitBranch,
  Layers
} from 'lucide-react';

export const RoleManagementView: React.FC = () => {
  const { user, login } = useAuth();
  const { can, userRole: currentRole } = useAuthorization();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'roles_matrix' | 'audit_logs'>('roles_matrix');

  // Selected Role for Matrix Editing
  const [roles, setRoles] = useState<RoleDefinition[]>(() => roleService.getRoles());
  const [selectedRoleId, setSelectedRoleId] = useState<UserRole>('fleet_manager');

  // Permission Search Filter
  const [permissionSearch, setPermissionSearch] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('ALL');

  // Matrix Editing State
  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  const [draftPermissions, setDraftPermissions] = useState<string[]>(() => selectedRole?.permissions || []);
  const [isSaved, setIsSaved] = useState(false);

  // Filtered Roles by Industry
  const filteredRoles = useMemo(() => {
    if (selectedIndustryFilter === 'ALL') return roles;
    return roles.filter((r) => r.industryCategory === selectedIndustryFilter);
  }, [roles, selectedIndustryFilter]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

  // Form States for Custom Role Creation
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleScope, setNewRoleScope] = useState<AccessScope>('BRANCH');
  const [baseRoleTemplate, setBaseRoleTemplate] = useState<UserRole>('operations');

  // Audit Logs
  const auditLogs = useMemo(() => roleService.getAuditLogs(), [roles]);

  // When selected role changes, reset draft permissions
  const handleSelectRole = (roleId: UserRole) => {
    setSelectedRoleId(roleId);
    const target = roles.find((r) => r.id === roleId);
    if (target) {
      setDraftPermissions([...target.permissions]);
      setIsSaved(false);
    }
  };

  // Toggle single permission check
  const handleTogglePermission = (permKey: string) => {
    setDraftPermissions((prev) => {
      if (prev.includes(permKey)) {
        return prev.filter((p) => p !== permKey);
      } else {
        return [...prev, permKey];
      }
    });
    setIsSaved(false);
  };

  // Toggle all permissions for a module
  const handleToggleModuleAll = (module: ResourceModule, enable: boolean) => {
    const modulePermKeys = PERMISSION_CATALOG.filter((p) => p.module === module).map((p) => p.key);
    setDraftPermissions((prev) => {
      if (enable) {
        return Array.from(new Set([...prev, ...modulePermKeys]));
      } else {
        return prev.filter((k) => !modulePermKeys.includes(k));
      }
    });
    setIsSaved(false);
  };

  // Save updated permissions
  const handleSaveChanges = () => {
    if (!user) return;
    try {
      const updated = roleService.updateRolePermissions(selectedRoleId, draftPermissions, {
        userId: user.id,
        userName: user.name,
        role: user.role,
      });
      setRoles(roleService.getRoles());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan matriks izin.');
    }
  };

  // Create Custom Role Handler
  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newRoleName) return;

    const baseRole = roles.find((r) => r.id === baseRoleTemplate);
    const initialPerms = baseRole ? [...baseRole.permissions] : [];

    const created = roleService.createRole({
      name: newRoleName,
      description: newRoleDesc || `Role kustom ${newRoleName}`,
      scope: newRoleScope,
      permissions: initialPerms,
      performedBy: { userId: user.id, userName: user.name, role: user.role },
    });

    setRoles(roleService.getRoles());
    setSelectedRoleId(created.id);
    setDraftPermissions([...created.permissions]);
    setIsCreateModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  // Duplicate Role Handler
  const handleDuplicateRole = (sourceId: UserRole) => {
    if (!user) return;
    const source = roles.find((r) => r.id === sourceId);
    if (!source) return;

    const duplicatedName = `${source.name} (Salinan)`;
    const created = roleService.duplicateRole(sourceId, duplicatedName, {
      userId: user.id,
      userName: user.name,
      role: user.role,
    });

    setRoles(roleService.getRoles());
    setSelectedRoleId(created.id);
    setDraftPermissions([...created.permissions]);
  };

  // Delete Custom Role Handler
  const handleDeleteCustomRole = () => {
    if (!user || !selectedRole) return;
    const check = roleService.canDeleteRole(selectedRole.id);
    if (!check.canDelete) {
      setDeleteErrorMsg(check.message || 'Role tidak dapat dihapus.');
      return;
    }

    try {
      roleService.deleteRole(selectedRole.id, {
        userId: user.id,
        userName: user.name,
        role: user.role,
      });
      const updated = roleService.getRoles();
      setRoles(updated);
      setSelectedRoleId(updated[0].id);
      setDraftPermissions([...updated[0].permissions]);
      setIsDeleteModalOpen(false);
      setDeleteErrorMsg(null);
    } catch (err: any) {
      setDeleteErrorMsg(err.message || 'Gagal menghapus role.');
    }
  };

  // Demo Role Switcher helper
  const handleSwitchDemoUserRole = async (targetRole: UserRole) => {
    // Quick role switcher for interactive testing of RBAC
    if (user) {
      user.role = targetRole;
      user.permissions = roles.find((r) => r.id === targetRole)?.permissions || [];
      // Re-trigger auth refresh
      window.location.reload();
    }
  };

  // Group permission catalog by module
  const filteredCatalog = useMemo(() => {
    return PERMISSION_CATALOG.filter((p) => {
      const matchSearch =
        p.label.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        p.key.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        p.module.toLowerCase().includes(permissionSearch.toLowerCase());
      const matchGroup = selectedGroupFilter === 'ALL' || p.moduleGroup === selectedGroupFilter;
      return matchSearch && matchGroup;
    });
  }, [permissionSearch, selectedGroupFilter]);

  // Group filtered catalog by module string
  const modulesMap = useMemo(() => {
    const map = new Map<ResourceModule, typeof PERMISSION_CATALOG>();
    filteredCatalog.forEach((item) => {
      if (!map.has(item.module)) {
        map.set(item.module, []);
      }
      map.get(item.module)!.push(item);
    });
    return map;
  }, [filteredCatalog]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase">
                SECURITY & GOVERNANCE
              </span>
              <span className="text-xs text-slate-400">• Dynamic RBAC Matrix Engine</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-cyan-400" />
              Manajemen Role & Hak Akses (RBAC)
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Konfigurasi kewenangan 9 role sistem standar dan role kustom perusahaan secara granular berdasarkan modul dan 6 jenis tindakan.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-950/50"
            >
              <Plus className="h-4 w-4" />
              Buat Role Kustom
            </button>
          </div>
        </div>

        {/* DEMO ROLE SWITCHER BAR FOR INTERACTIVE TESTING */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Demo Interactive Role Tester (Uji Coba Langsung Multi-Industri & Developer):
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">
                Peran Aktif:
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                user?.role === 'developer'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 animate-pulse'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Quick Category-Grouped Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/60">
            {/* Special Highlight for Developer Role */}
            <button
              onClick={() => handleSwitchDemoUserRole('developer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                user?.role === 'developer'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-950/50'
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              }`}
              title="Developer memiliki hak akses penuh ke seluruh menu, modul, telematika, dan sistem"
            >
              <Key className="h-3.5 w-3.5" />
              Developer (Full Access - All Menus)
            </button>

            {[
              { id: 'super_admin', label: 'Super Admin', category: 'Core' },
              { id: 'company_admin', label: 'Company Admin', category: 'Core' },
              { id: 'fleet_manager', label: 'Fleet Manager', category: 'Armada' },
              { id: 'operations_manager', label: 'Operations Mgr', category: 'Ops' },
              { id: 'dispatcher', label: 'Dispatcher', category: 'Ops' },
              { id: 'driver', label: 'Driver', category: 'Ops' },
              { id: 'maintenance', label: 'Maintenance', category: 'Bengkel' },
              { id: 'finance', label: 'Finance & TCO', category: 'Finansial' },
              { id: 'rent_car_manager', label: 'Rent Car Manager', category: 'Rental' },
              { id: 'rental_officer', label: 'Rental Front Desk', category: 'Rental' },
              { id: 'logistics_manager', label: 'Logistics TMS Mgr', category: 'Logistik' },
              { id: 'logistics_coordinator', label: 'Delivery Coord', category: 'Logistik' },
              { id: 'courier_driver', label: 'Courier Driver', category: 'Logistik' },
              { id: 'bus_operations_manager', label: 'PO Bus Manager', category: 'Bus' },
              { id: 'bus_ticketing_agent', label: 'Bus Ticketing', category: 'Bus' },
              { id: 'heavy_equipment_manager', label: 'Mining Alat Berat', category: 'Tambang' },
              { id: 'mining_fleet_officer', label: 'Pit / Hauling Dispatcher', category: 'Tambang' },
              { id: 'safety_officer', label: 'Safety & HSE Officer', category: 'K3' },
              { id: 'hse_manager', label: 'HSE Manager', category: 'K3' },
              { id: 'telematics_engineer', label: 'Telematics IoT Eng', category: 'IoT' },
              { id: 'viewer', label: 'Viewer (Read Only)', category: 'Audit' },
            ].map((roleItem) => (
              <button
                key={roleItem.id}
                onClick={() => handleSwitchDemoUserRole(roleItem.id as UserRole)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap border ${
                  user?.role === roleItem.id
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-[9px] font-mono text-slate-500 mr-1">[{roleItem.category}]</span>
                {roleItem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('roles_matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'roles_matrix'
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          Daftar Role & Matriks Izin ({roles.length} Role)
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'audit_logs'
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <History className="h-4 w-4" />
          Audit Log RBAC & Keamanan ({auditLogs.length})
        </button>
      </div>

      {activeTab === 'roles_matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Role List Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-cyan-400" />
                Daftar Peran ({filteredRoles.length})
              </h2>

              {/* Industry Category Filter */}
              <select
                value={selectedIndustryFilter}
                onChange={(e) => setSelectedIndustryFilter(e.target.value)}
                className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Industri & Bidang</option>
                <option value="CORE_MANAGEMENT">Core & Manajemen</option>
                <option value="OPERATIONS_DISPATCH">Operasional & Armada</option>
                <option value="RENT_CAR_INDUSTRY">Rent Car & Mobility</option>
                <option value="LOGISTICS_SUPPLY_CHAIN">Logistics & TMS</option>
                <option value="BUS_PASSENGER_TRANSPORT">PO Bus & Angkutan</option>
                <option value="MINING_HEAVY_EQUIPMENT">Tambang & Alat Berat</option>
                <option value="SAFETY_HSE">Keselamatan K3 / HSE</option>
                <option value="IOT_TELEMATICS_ENGINEERING">IoT & Telematika</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
              {filteredRoles.map((r) => {
                const isSelected = r.id === selectedRoleId;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-full">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                            {r.name}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0">
                            {r.id === 'developer' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                ALL ACCESS
                              </span>
                            ) : r.isSystem ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                SYSTEM
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                CUSTOM
                              </span>
                            )}
                          </div>
                        </div>

                        {r.industryCategory && (
                          <div className="mt-1">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-950 text-slate-400 border border-slate-800">
                              {r.industryCategory.replace(/_/g, ' ')}
                            </span>
                          </div>
                        )}

                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3 text-cyan-400" />
                        Cakupan: <strong className="text-slate-200">{r.scope}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <UserCheck className="h-3 w-3 text-emerald-400" />
                        {r.usersCount} Pengguna
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Permission Matrix Table */}
          <div className="lg:col-span-8 space-y-4">
            {/* Role Detail Banner */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedRole.name}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      SCOPE: {selectedRole.scope}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedRole.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDuplicateRole(selectedRole.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                    title="Duplikat Role ini untuk membuat varian baru"
                  >
                    <Copy className="h-3.5 w-3.5 text-cyan-400" />
                    Duplikat Role
                  </button>

                  {!selectedRole.isSystem && (
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors border border-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  )}

                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Simpan Perubahan
                  </button>
                </div>
              </div>

              {isSaved && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Matriks izin untuk role "{selectedRole.name}" berhasil diperbarui!</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </div>
              )}

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                    placeholder="Cari izin modul..."
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <span className="text-[11px] text-slate-400 shrink-0">Kategori:</span>
                  <select
                    value={selectedGroupFilter}
                    onChange={(e) => setSelectedGroupFilter(e.target.value)}
                    className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">Semua Kategori Modul</option>
                    {PERMISSION_MODULE_GROUPS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider text-slate-400">
                      <th className="py-3 px-4 w-1/3">Modul / Fitur Telematika</th>
                      <th className="py-3 px-2 text-center w-16">View</th>
                      <th className="py-3 px-2 text-center w-16">Create</th>
                      <th className="py-3 px-2 text-center w-16">Edit</th>
                      <th className="py-3 px-2 text-center w-16">Delete</th>
                      <th className="py-3 px-2 text-center w-16">Export</th>
                      <th className="py-3 px-2 text-center w-16">Approve</th>
                      <th className="py-3 px-3 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {Array.from(modulesMap.entries()).map(([module, items]) => {
                      const actionsList: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'export', 'approve'];

                      const allModuleKeys = items.map((i) => i.key);
                      const activeCount = allModuleKeys.filter((k) => draftPermissions.includes(k)).length;
                      const isFullyChecked = activeCount === allModuleKeys.length && allModuleKeys.length > 0;

                      return (
                        <tr key={module} className="hover:bg-slate-850 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-200 capitalize">
                              {module.replace('_', ' ')}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {items.length} aturan izin
                            </div>
                          </td>

                          {actionsList.map((action) => {
                            const targetItem = items.find((i) => i.action === action);
                            if (!targetItem) {
                              return (
                                <td key={action} className="py-3 px-2 text-center text-slate-700">
                                  -
                                </td>
                              );
                            }

                            const isChecked = draftPermissions.includes(targetItem.key);

                            return (
                              <td key={action} className="py-3 px-2 text-center">
                                <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleTogglePermission(targetItem.key)}
                                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20 focus:ring-offset-slate-900 cursor-pointer"
                                  />
                                </label>
                              </td>
                            );
                          })}

                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleToggleModuleAll(module, !isFullyChecked)}
                              className="text-[10px] font-bold text-cyan-400 hover:underline"
                            >
                              {isFullyChecked ? 'Uncheck All' : 'Check All'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit_logs' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="h-5 w-5 text-cyan-400" />
                Audit Log Perubahan Role & Otorisasi
              </h2>
              <p className="text-xs text-slate-400">
                Pencatatan real-time jejak audit perubahan matriks izin, pembuat role kustom, dan penugasan pengguna.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.action === 'ROLE_CREATED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : log.action === 'ROLE_DELETED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : log.action === 'ROLE_ASSIGNED'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{log.details}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>Oleh: <strong className="text-slate-300">{log.performedBy.userName}</strong> ({log.performedBy.role})</span>
                    <span>•</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CUSTOM ROLE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-cyan-400" />
                Buat Role Kustom Baru
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Role Baru *</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Contoh: Supervisor Armada Trans-Jawa"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Wewenang</label>
                <textarea
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  rows={2}
                  placeholder="Jelaskan peran dan tanggung jawab role ini..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cakupan (Scope) *</label>
                  <select
                    value={newRoleScope}
                    onChange={(e) => setNewRoleScope(e.target.value as AccessScope)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="COMPANY">COMPANY (Seluruh Tenant)</option>
                    <option value="BRANCH">BRANCH (Per Cabang)</option>
                    <option value="FLEET">FLEET (Per Grup Armada)</option>
                    <option value="SELF">SELF (Pengemudi/Mandiri)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Templat Dasar</label>
                  <select
                    value={baseRoleTemplate}
                    onChange={(e) => setBaseRoleTemplate(e.target.value as UserRole)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Buat Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SAFETY WARNING MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400 pb-2 border-b border-slate-800">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Konfirmasi Hapus Role</h3>
            </div>

            {deleteErrorMsg ? (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                <p className="font-semibold">{deleteErrorMsg}</p>
                <p className="text-[11px] text-slate-400">
                  Sistem keamanan mencegah penghapusan role yang masih terikat dengan akun staf aktif.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-300">
                Apakah Anda yakin ingin menghapus role kustom <strong className="text-white">{selectedRole.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            )}

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteErrorMsg(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Tutup
              </button>
              {!deleteErrorMsg && (
                <button
                  onClick={handleDeleteCustomRole}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold"
                >
                  Ya, Hapus Role
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
