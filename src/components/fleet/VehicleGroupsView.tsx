/**
 * Fleet Intelligence Smart AI - Vehicle Groups Management View
 * PROMPT 9 - Sub-Armada Groups (/app/fleet/groups)
 */

import React, { useState, useEffect } from 'react';
import { VehicleGroup } from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import { useToast } from '../ui/Toast';
import { FolderTree, Plus, Truck, Building2, User, Search, Edit, X, Check } from 'lucide-react';

export const VehicleGroupsView: React.FC = () => {
  const { addToast } = useToast();
  const [groups, setGroups] = useState<VehicleGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: '', description: '', managerName: '' });

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const res = await vehicleService.listGroups();
      setGroups(res);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message || 'Gagal memuat grup' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.name.trim()) return;

    try {
      await vehicleService.createGroup(modalData.name, modalData.description);
      addToast({ type: 'success', title: 'Grup Dibuat', message: `Grup ${modalData.name} berhasil dibuat.` });
      setIsModalOpen(false);
      setModalData({ name: '', description: '', managerName: '' });
      loadGroups();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal membuat grup' });
    }
  };

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-cyan-400" />
            Manajemen Grup Kendaraan & Sub-Armada
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pengelompokan unit kendaraan berdasarkan koridor logistik, jenis kargo, dan penanggung jawab.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-950/50"
        >
          <Plus className="h-4 w-4" />
          Tambah Grup Baru
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari grup armada..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <div key={g.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-300">{g.code}</span>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                {g.vehiclesCount} Units
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{g.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{g.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                {g.managerName || 'Penanggung Jawab Ops'}
              </span>
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Buat Grup Armada Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Grup Armada</label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  placeholder="e.g. Armada Tangki BBM Jabodetabek"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi & Wilayah Operasional</label>
                <textarea
                  rows={3}
                  value={modalData.description}
                  onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                  placeholder="Deskripsikan fungsi dan wilayah kerja armada ini..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Simpan Grup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
