/**
 * Fleet Intelligence Smart AI - Departments (Departemen & Divisi) Management Tab
 * Manages functional divisions (Operations, Maintenance, Safety HSE, Logistics)
 */

import React, { useState } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { DepartmentDetailed } from '../../../types/organization';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Truck, 
  Layers, 
  User, 
  MapPin, 
  X, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const DepartmentsManagementTab: React.FC = () => {
  const {
    departments,
    branches,
    currentTenant,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    selectedBranchId,
    setSelectedBranchId,
    selectedDepartmentId,
    setSelectedDepartmentId,
    isLoading
  } = useOrganization();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentDetailed | null>(null);

  const [formData, setFormData] = useState({
    branchId: branches[0]?.id || '',
    name: '',
    code: '',
    managerName: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
  });

  const resetForm = () => {
    setFormData({
      branchId: branches[0]?.id || '',
      name: '',
      code: '',
      managerName: '',
      phone: '',
      email: '',
      status: 'active',
    });
  };

  const handleOpenEdit = (d: DepartmentDetailed) => {
    setEditingDept(d);
    setFormData({
      branchId: d.branchId,
      name: d.name,
      code: d.code,
      managerName: d.managerName,
      phone: d.phone || '',
      email: d.email || '',
      status: d.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingDept) {
      await updateDepartment(editingDept.id, {
        branchId: formData.branchId,
        name: formData.name,
        code: formData.code.toUpperCase(),
        managerName: formData.managerName,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
      });
    } else {
      await createDepartment({
        branchId: formData.branchId,
        name: formData.name,
        code: formData.code.toUpperCase(),
        managerName: formData.managerName || 'Kepala Divisi',
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        vehiclesCount: 0,
        fleetsCount: 1,
      });
    }

    setIsAddModalOpen(false);
    setEditingDept(null);
    resetForm();
  };

  const filteredDepartments = departments.filter((d) => {
    if (selectedBranchId !== 'all' && d.branchId !== selectedBranchId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.branchName.toLowerCase().includes(q) ||
        d.managerName.toLowerCase().includes(q);
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
              placeholder="Cari nama departemen, kode, atau manajer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Cabang ({branches.length})</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setEditingDept(null);
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Departemen</span>
        </button>
      </div>

      {/* Departments Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDepartments.map((d) => {
          const isSelected = selectedDepartmentId === d.id;

          return (
            <div
              key={d.id}
              className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-500 bg-slate-900 shadow-xl shadow-purple-950/30'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="p-5 space-y-4 flex-1">
                {/* Dept Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{d.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-mono text-purple-400">{d.code}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400">{d.branchName}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      d.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-700/30 text-slate-400 border-slate-700'
                    }`}
                  >
                    {d.status.toUpperCase()}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                    <span className="block text-[10px] text-slate-500">KENDARAAN DIBAWAHI</span>
                    <span className="font-mono font-bold text-cyan-400 text-base">{d.vehiclesCount} Unit</span>
                  </div>
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                    <span className="block text-[10px] text-slate-500">SUB-FLEET GROUP</span>
                    <span className="font-mono font-bold text-purple-400 text-base">{d.fleetsCount} Grup</span>
                  </div>
                </div>

                {/* Manager info */}
                <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium">{d.managerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-400">{d.branchName}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(d)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Departemen"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteDepartment(d.id)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                    title="Hapus Departemen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedDepartmentId(isSelected ? 'all' : d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isSelected ? 'Scope Dept Aktif' : 'Pilih Scope Dept'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Department Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  {editingDept ? 'Edit Departemen' : 'Tambah Departemen Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Induk Cabang / Depo *</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Departemen *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Operasional & Dispatch"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Departemen *</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="OPS-JKT"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Kepala Divisi</label>
                <input
                  type="text"
                  placeholder="Bpk. Suryanto"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950"
                >
                  {editingDept ? 'Simpan Perubahan' : 'Tambah Departemen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
