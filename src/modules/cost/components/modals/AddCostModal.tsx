/**
 * Fleet Intelligence Smart AI - Add Cost Transaction Modal
 * PROMPT 37 - Expense Entry Form, Category Selection & Approval Routing
 */

import React, { useState } from 'react';
import { X, DollarSign, Calendar, Truck, User, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCategoryKey, CostType, CostSource, AllocationMethod } from '../../types';

export const AddCostModal: React.FC = () => {
  const {
    isAddCostModalOpen,
    setIsAddCostModalOpen,
    categories,
    costRecords,
    addCostRecord,
  } = useCost();

  const [category, setCategory] = useState<CostCategoryKey>('FUEL');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [vehiclePlate, setVehiclePlate] = useState<string>('B 9123 TXR');
  const [driverName, setDriverName] = useState<string>('Bambang Sutrisno');
  const [branchName, setBranchName] = useState<string>('Jakarta Cakung');
  const [type, setType] = useState<CostType>('VARIABLE');
  const [source, setSource] = useState<CostSource>('MANUAL_EXPENSE');
  const [allocationMethod, setAllocationMethod] = useState<AllocationMethod>('DIRECT');
  const [notes, setNotes] = useState<string>('');

  if (!isAddCostModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    addCostRecord({
      tenantId: 'tenant-1',
      branchId: 'branch-1',
      branchName,
      category,
      type,
      amount,
      currency: 'IDR',
      date,
      vehiclePlate,
      driverName,
      source,
      allocationMethod,
      allocationStatus: allocationMethod === 'DIRECT' ? 'DIRECTLY_ALLOCATED' : 'UNALLOCATED',
      status: amount > 10000000 ? 'PENDING_APPROVAL' : 'APPROVED',
      createdBy: 'Finance Specialist',
      notes,
    });

    setIsAddCostModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Input Transaksi Biaya Baru</h3>
              <p className="text-[11px] text-slate-400">Tambahkan catatan pengeluaran armada ke pembukuan</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddCostModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kategori Biaya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CostCategoryKey)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.key}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sifat Beban</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CostType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="VARIABLE">Variabel (Tergantung Jarak/Ritase)</option>
                <option value="FIXED">Tetap (Fixed / Periodik)</option>
                <option value="SEMI_VARIABLE">Semi-Variabel (Lembur/Darurat)</option>
                <option value="ONE_TIME">One-Time (Sekali Bayar)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nominal Biaya (IDR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
              <input
                type="number"
                min="1000"
                step="1000"
                required
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Contoh: 1500000"
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            {amount > 10000000 && (
              <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Nominal di atas Rp 10.000.000 akan otomatis masuk antrean Approval Manajer Keuangan.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cabang / Pool</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Plat Nomor Armada</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="B 9123 TXR"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Driver Penanggung Jawab</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Nama Pengemudi"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Catatan Transaksi / Referensi Kwitansi</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nomor nota, SPBU, atau uraian pekerjaan bengkel..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddCostModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
