/**
 * Fleet Intelligence Smart AI - Branches (Cabang & Depo) Management Tab
 * Manages physical depots, geo-coordinates, branch managers, and vehicle allocations
 */

import React, { useState } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { BranchExtendedDetailed } from '../../../types/organization';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Truck, 
  Briefcase, 
  Phone, 
  Mail, 
  User, 
  X, 
  CheckCircle2, 
  Layers,
  Compass
} from 'lucide-react';

export const BranchesManagementTab: React.FC = () => {
  const {
    branches,
    currentTenant,
    createBranch,
    updateBranch,
    deleteBranch,
    selectedBranchId,
    setSelectedBranchId,
    isLoading
  } = useOrganization();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchExtendedDetailed | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    country: 'Indonesia',
    postalCode: '',
    phone: '+62 ',
    email: '',
    managerName: '',
    latitude: -6.1754,
    longitude: 106.8272,
    status: 'active' as 'active' | 'inactive',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      country: 'Indonesia',
      postalCode: '',
      phone: '+62 ',
      email: '',
      managerName: '',
      latitude: -6.1754,
      longitude: 106.8272,
      status: 'active',
    });
  };

  const handleOpenEdit = (b: BranchExtendedDetailed) => {
    setEditingBranch(b);
    setFormData({
      name: b.name,
      code: b.code,
      address: b.address,
      city: b.city,
      province: b.province,
      country: b.country || 'Indonesia',
      postalCode: b.postalCode || '',
      phone: b.phone,
      email: b.email,
      managerName: b.managerName,
      latitude: b.latitude || -6.1754,
      longitude: b.longitude || 106.8272,
      status: b.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingBranch) {
      await updateBranch(editingBranch.id, {
        name: formData.name,
        code: formData.code.toUpperCase(),
        address: formData.address,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email,
        managerName: formData.managerName,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        status: formData.status,
      });
    } else {
      await createBranch({
        name: formData.name,
        code: formData.code.toUpperCase(),
        address: formData.address,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email,
        managerName: formData.managerName || 'Kepala Cabang',
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        status: formData.status,
        vehiclesCount: 0,
        departmentsCount: 1,
        fleetsCount: 1,
      });
    }

    setIsAddModalOpen(false);
    setEditingBranch(null);
    resetForm();
  };

  const filteredBranches = branches.filter((b) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.managerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Search & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative min-w-[260px] max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama cabang, kode, kota, atau manajer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {branches.length} Depo Aktif ({currentTenant.code})
          </span>
        </div>

        <button
          onClick={() => {
            setEditingBranch(null);
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Cabang / Depo</span>
        </button>
      </div>

      {/* Branches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredBranches.map((b) => {
          const isSelected = selectedBranchId === b.id;

          return (
            <div
              key={b.id}
              className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500 bg-slate-900 shadow-xl shadow-cyan-950/30'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="p-5 space-y-4 flex-1">
                {/* Branch Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{b.name}</h4>
                      <span className="text-xs font-mono text-cyan-400">{b.code}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      b.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-700/30 text-slate-400 border-slate-700'
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </div>

                {/* Metrics 3-box */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2">
                    <span className="block text-[10px] text-slate-500">ARMADA</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">{b.vehiclesCount}</span>
                  </div>
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2">
                    <span className="block text-[10px] text-slate-500">DIVISI</span>
                    <span className="font-mono font-bold text-purple-400 text-sm">{b.departmentsCount}</span>
                  </div>
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2">
                    <span className="block text-[10px] text-slate-500">FLEETS</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{b.fleetsCount}</span>
                  </div>
                </div>

                {/* Contact & Manager info */}
                <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-medium">{b.managerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{b.address}, {b.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-slate-400">{b.phone}</span>
                  </div>
                  {b.latitude && b.longitude && (
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                      <Compass className="h-3.5 w-3.5 text-cyan-500/70 shrink-0" />
                      <span>GPS: {b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Cabang"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteBranch(b.id)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                    title="Hapus Cabang"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedBranchId(isSelected ? 'all' : b.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isSelected ? 'Scope Cabang Aktif' : 'Pilih Scope Cabang'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Branch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  {editingBranch ? 'Edit Cabang / Depo' : 'Tambah Cabang / Depo Baru'}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Cabang / Depo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Depo Surabaya Rungkut"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Cabang *</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="SBY-02"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Lengkap Depo</label>
                <input
                  type="text"
                  placeholder="Jl. Raya Rungkut Industri No. 45"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kota</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Kepala Cabang</label>
                  <input
                    type="text"
                    placeholder="Bpk. Hendra Gunawan"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Depo</label>
                  <input
                    type="email"
                    placeholder="depo.sby@translogistik.co.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude GPS</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude GPS</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950"
                >
                  {editingBranch ? 'Simpan Perubahan' : 'Tambah Cabang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
