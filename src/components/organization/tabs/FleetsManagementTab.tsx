/**
 * Fleet Intelligence Smart AI - Fleets (Sub-Grup Armada) Management Tab
 * Manages specialized vehicle clusters (Wingbox, Trailer, CDD, Dump Truck) with color tags
 */

import React, { useState } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { FleetDetailed } from '../../../types/organization';
import { 
  Truck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Briefcase, 
  MapPin, 
  User, 
  Tag, 
  X, 
  CheckCircle2 
} from 'lucide-react';

export const FleetsManagementTab: React.FC = () => {
  const {
    fleets,
    branches,
    departments,
    currentTenant,
    createFleet,
    updateFleet,
    deleteFleet,
    selectedBranchId,
    setSelectedBranchId,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedFleetId,
    setSelectedFleetId,
    isLoading
  } = useOrganization();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFleet, setEditingFleet] = useState<FleetDetailed | null>(null);

  const [formData, setFormData] = useState({
    branchId: branches[0]?.id || '',
    departmentId: departments[0]?.id || '',
    name: '',
    code: '',
    managerName: '',
    colorTag: '#06b6d4',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  const resetForm = () => {
    setFormData({
      branchId: branches[0]?.id || '',
      departmentId: departments[0]?.id || '',
      name: '',
      code: '',
      managerName: '',
      colorTag: '#06b6d4',
      description: '',
      status: 'active',
    });
  };

  const handleOpenEdit = (f: FleetDetailed) => {
    setEditingFleet(f);
    setFormData({
      branchId: f.branchId,
      departmentId: f.departmentId,
      name: f.name,
      code: f.code,
      managerName: f.managerName,
      colorTag: f.colorTag || '#06b6d4',
      description: f.description || '',
      status: f.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingFleet) {
      await updateFleet(editingFleet.id, {
        branchId: formData.branchId,
        departmentId: formData.departmentId,
        name: formData.name,
        code: formData.code.toUpperCase(),
        managerName: formData.managerName,
        colorTag: formData.colorTag,
        description: formData.description,
        status: formData.status,
      });
    } else {
      await createFleet({
        branchId: formData.branchId,
        departmentId: formData.departmentId,
        name: formData.name,
        code: formData.code.toUpperCase(),
        managerName: formData.managerName || 'Koordinator Armada',
        colorTag: formData.colorTag,
        description: formData.description,
        status: formData.status,
        vehiclesCount: 0,
      });
    }

    setIsAddModalOpen(false);
    setEditingFleet(null);
    resetForm();
  };

  const filteredFleets = fleets.filter((f) => {
    if (selectedBranchId !== 'all' && f.branchId !== selectedBranchId) return false;
    if (selectedDepartmentId !== 'all' && f.departmentId !== selectedDepartmentId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.branchName.toLowerCase().includes(q) ||
        f.managerName.toLowerCase().includes(q);
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
              placeholder="Cari nama fleet grup, kode, atau manajer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setSelectedDepartmentId('all');
            }}
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
            setEditingFleet(null);
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Sub-Grup Armada</span>
        </button>
      </div>

      {/* Fleets Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredFleets.map((f) => {
          const isSelected = selectedFleetId === f.id;

          return (
            <div
              key={f.id}
              className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-slate-900 shadow-xl shadow-emerald-950/30'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="p-5 space-y-4 flex-1">
                {/* Fleet Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-sm"
                      style={{ backgroundColor: `${f.colorTag || '#06b6d4'}20`, color: f.colorTag || '#06b6d4', border: `1px solid ${f.colorTag || '#06b6d4'}40` }}
                    >
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{f.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-mono text-emerald-400">{f.code}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400">{f.branchName}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      f.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-700/30 text-slate-400 border-slate-700'
                    }`}
                  >
                    {f.status.toUpperCase()}
                  </span>
                </div>

                {/* Units Count Box */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium">TOTAL UNIT KENDARAAN</span>
                    <span className="text-xl font-bold font-mono text-cyan-400 mt-0.5 block">
                      {f.vehiclesCount} Kendaraan
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 font-medium">DIVISI INDUK</span>
                    <span className="text-xs font-semibold text-slate-300 mt-0.5 block truncate max-w-[140px]">
                      {f.departmentName}
                    </span>
                  </div>
                </div>

                {/* Manager & Description */}
                <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium">{f.managerName}</span>
                  </div>
                  {f.description && (
                    <p className="text-[11px] text-slate-400 italic">
                      "{f.description}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(f)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Sub-Grup Fleet"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteFleet(f.id)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                    title="Hapus Fleet"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedFleetId(isSelected ? 'all' : f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isSelected ? 'Scope Fleet Aktif' : 'Pilih Scope Fleet'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Fleet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {editingFleet ? 'Edit Sub-Grup Fleet' : 'Tambah Sub-Grup Fleet Baru'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Induk Cabang / Depo *</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Induk Departemen *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Grup Armada *</label>
                  <input
                    type="text"
                    required
                    placeholder="Armada Wingbox Jabodetabek"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Fleet *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="FLT-WB-JKT"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Koordinator / Supervisor</label>
                  <input
                    type="text"
                    placeholder="Bpk. Wahyu Utomo"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Warna Tag Armada</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colorTag}
                      onChange={(e) => setFormData({ ...formData, colorTag: e.target.value })}
                      className="h-8 w-12 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                    />
                    <input
                      type="text"
                      value={formData.colorTag}
                      onChange={(e) => setFormData({ ...formData, colorTag: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi / Peruntukan</label>
                <textarea
                  rows={2}
                  placeholder="Armada khusus pengiriman logistik antar-pabrik Cikarang - Tanjung Priok..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none resize-none"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950"
                >
                  {editingFleet ? 'Simpan Perubahan' : 'Tambah Sub-Grup Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
