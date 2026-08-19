/**
 * Fleet Intelligence Smart AI - Departments Management View
 * PROMPT 9 - Departemen Perusahaan (/app/fleet/departments)
 */

import React, { useState, useEffect } from 'react';
import { Department } from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import { useToast } from '../ui/Toast';
import { Briefcase, Plus, Building2, User, Search, X, Check } from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { addToast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: '', branchId: '', managerName: '' });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [depts, brs] = await Promise.all([
        vehicleService.listDepartments(),
        vehicleService.listBranches(),
      ]);
      setDepartments(depts);
      setBranches(brs);
      if (brs.length > 0 && !modalData.branchId) {
        setModalData((prev) => ({ ...prev, branchId: brs[0].id }));
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message || 'Gagal memuat departemen' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.name.trim()) return;

    try {
      await vehicleService.createDepartment(modalData.name, modalData.branchId, modalData.managerName);
      addToast({ type: 'success', title: 'Departemen Dibuat', message: `Departemen ${modalData.name} berhasil ditambahkan.` });
      setIsModalOpen(false);
      setModalData({ name: '', branchId: branches[0]?.id || '', managerName: '' });
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal membuat departemen' });
    }
  };

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-cyan-400" />
            Manajemen Departemen Internal Perusahaan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Struktur organisasi internal pengelola unit armada (Operations, Distribution, Sales, Workshop).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-950/50"
        >
          <Plus className="h-4 w-4" />
          Tambah Departemen
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari departemen (e.g. Operations, Logistics, Sales)..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-300">{d.code}</span>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                {d.vehiclesCount} Units
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{d.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Building2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                {d.branchName}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                {d.managerName || 'Kepala Departemen'}
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
              <h3 className="text-base font-bold text-white">Tambah Departemen Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Departemen</label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  placeholder="e.g. Commercial & Cold Chain Logistics"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cabang Induk</label>
                <select
                  value={modalData.branchId}
                  onChange={(e) => setModalData({ ...modalData, branchId: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kepala Departemen (Head of Dept)</label>
                <input
                  type="text"
                  value={modalData.managerName}
                  onChange={(e) => setModalData({ ...modalData, managerName: e.target.value })}
                  placeholder="e.g. Hendrikus Setiawan"
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
                  Simpan Departemen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
