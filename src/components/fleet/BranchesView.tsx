/**
 * Fleet Intelligence Smart AI - Branches & Depots Management View
 * PROMPT 9 - Cabang & Depo Operasional (/app/fleet/branches)
 */

import React, { useState, useEffect } from 'react';
import { BranchExtended } from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import { useToast } from '../ui/Toast';
import { Building2, Plus, MapPin, Phone, Mail, User, Search, X, Check } from 'lucide-react';

export const BranchesView: React.FC = () => {
  const { addToast } = useToast();
  const [branches, setBranches] = useState<BranchExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    name: '',
    code: '',
    city: '',
    province: 'DKI Jakarta',
    address: '',
    phone: '',
    email: '',
    managerName: '',
  });

  const loadBranches = async () => {
    try {
      setIsLoading(true);
      const res = await vehicleService.listBranches();
      setBranches(res);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message || 'Gagal memuat cabang' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.name.trim() || !modalData.city.trim()) return;

    try {
      await vehicleService.createBranch(modalData);
      addToast({ type: 'success', title: 'Cabang Dibuat', message: `Cabang ${modalData.name} berhasil ditambahkan.` });
      setIsModalOpen(false);
      setModalData({ name: '', code: '', city: '', province: 'DKI Jakarta', address: '', phone: '', email: '', managerName: '' });
      loadBranches();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal membuat cabang' });
    }
  };

  const filtered = branches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-cyan-400" />
            Manajemen Kantor Cabang & Depo Pelabuhan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola depo operasional, alamat lokasi fisik di Indonesia, dan alokasi unit kendaraan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-950/50"
        >
          <Plus className="h-4 w-4" />
          Tambah Cabang Baru
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari cabang atau kota (e.g. Jakarta, Surabaya, Cikarang)..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3.5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-300">{b.code}</span>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                {b.vehiclesCount} Units
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{b.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                {b.city}, {b.province}
              </p>
            </div>

            <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              {b.address}
            </p>

            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  {b.managerName}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{b.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Tambah Kantor Cabang / Depo</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Cabang</label>
                  <input
                    type="text"
                    value={modalData.name}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    placeholder="e.g. Depo Semarang (Tanjung Emas)"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={modalData.city}
                    onChange={(e) => setModalData({ ...modalData, city: e.target.value })}
                    placeholder="e.g. Semarang"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Fisik Lengkap (Indonesia)</label>
                <textarea
                  rows={2}
                  value={modalData.address}
                  onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
                  placeholder="Jl. Pelabuhan No. 88, Kawasan Industri Tanjung Emas..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kepala Cabang (Manager)</label>
                  <input
                    type="text"
                    value={modalData.managerName}
                    onChange={(e) => setModalData({ ...modalData, managerName: e.target.value })}
                    placeholder="e.g. Budi Santoso"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Telepon Kantor</label>
                  <input
                    type="text"
                    value={modalData.phone}
                    onChange={(e) => setModalData({ ...modalData, phone: e.target.value })}
                    placeholder="e.g. +62 24 8900 1234"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
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
                  Simpan Cabang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
