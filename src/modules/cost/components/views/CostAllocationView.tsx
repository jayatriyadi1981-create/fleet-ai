/**
 * Fleet Intelligence Smart AI - Cost Allocation & Overhead Engine View
 * PROMPT 37 - Proportional Allocation, Rule Manager & Double-Counting Safeguard
 */

import React, { useState, useMemo } from 'react';
import {
  Share2,
  DollarSign,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Percent,
  Truck,
  Building2,
  Navigation,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';
import { CostRecord } from '../../types';

export const CostAllocationView: React.FC = () => {
  const {
    costRecords,
    allocateCostRecord,
    reverseCostAllocation,
    setIsAllocationModalOpen,
  } = useCost();

  const [searchTerm, setSearchTerm] = useState('');
  const [allocationStatusFilter, setAllocationStatusFilter] = useState<string>('ALL');

  // Filtered records
  const filteredRecords = useMemo(() => {
    return costRecords.filter((r) => {
      const matchSearch =
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.vehiclePlate && r.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus =
        allocationStatusFilter === 'ALL' || r.allocationStatus === allocationStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [costRecords, searchTerm, allocationStatusFilter]);

  // Summaries
  const summary = useMemo(() => {
    const directTotal = costRecords
      .filter((r) => r.allocationStatus === 'DIRECTLY_ALLOCATED')
      .reduce((sum, r) => sum + r.amount, 0);

    const splitTotal = costRecords
      .filter((r) => r.allocationStatus === 'SPLIT_ALLOCATED')
      .reduce((sum, r) => sum + r.amount, 0);

    const derivedTotal = costRecords
      .filter((r) => r.allocationStatus === 'DERIVED_CHILD')
      .reduce((sum, r) => sum + r.amount, 0);

    const unallocatedTotal = costRecords
      .filter((r) => r.allocationStatus === 'UNALLOCATED')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      directTotal,
      splitTotal,
      derivedTotal,
      unallocatedTotal,
      totalRecords: costRecords.length,
    };
  }, [costRecords]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Safeguard & Engine Explanation Banner */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/30 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Proportional Cost Allocation Engine (Anti Double-Counting)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Alokasi biaya gabungan (overhead pool, premi asuransi fleet, invoice vendor massal) ke kendaraan atau trip secara proporsional berdasarkan mileage aktual, jam kerja, atau persentase tetap.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAllocationModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all shrink-0"
          >
            <Sliders className="w-4 h-4" />
            <span>Alokasikan Biaya Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Direct Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Biaya Terdistribusi Langsung</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.directTotal)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Teratribusi langsung ke 1 unit armada spesifik</p>
        </div>

        {/* Split Allocated Parent */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Induk Biaya Terbagi (Split Parent)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-cyan-400">
            {CostCalculationEngine.formatCurrencyIdr(summary.splitTotal)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Dipecah ke child records (Dikecualikan dari TOC agar tdk dobel)</p>
        </div>

        {/* Derived Child */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pecahan Alokasi Anak (Child)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {CostCalculationEngine.formatCurrencyIdr(summary.derivedTotal)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Hasil proporsi pembagian masuk ke TCO unit</p>
        </div>

        {/* Unallocated */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Belum Dialokasikan</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-400">
            {CostCalculationEngine.formatCurrencyIdr(summary.unallocatedTotal)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Biaya umum tingkat kantor/depo belum dibagi</p>
        </div>
      </div>

      {/* Cost Allocation Rules & Records Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari transaksi atau plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={allocationStatusFilter}
              onChange={(e) => setAllocationStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Status Alokasi</option>
              <option value="DIRECTLY_ALLOCATED">Direct (Langsung)</option>
              <option value="SPLIT_ALLOCATED">Split Parent (Terbagi)</option>
              <option value="DERIVED_CHILD">Derived Child (Pecahan)</option>
              <option value="UNALLOCATED">Unallocated (Belum Alokasi)</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Menampilkan <span className="text-white font-semibold">{filteredRecords.length}</span> transaksi
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kategori & Sumber</th>
                <th className="py-3 px-4">Entitas Terkait</th>
                <th className="py-3 px-4 text-right">Nominal Transaksi</th>
                <th className="py-3 px-4 text-center">Metode Alokasi</th>
                <th className="py-3 px-4 text-center">Status Alokasi</th>
                <th className="py-3 px-4">Catatan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono">{r.date}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{r.category}</span>
                    <span className="text-[10px] text-slate-500">{r.source}</span>
                  </td>
                  <td className="py-3 px-4">
                    {r.vehiclePlate ? (
                      <span className="font-medium text-cyan-400">{r.vehiclePlate}</span>
                    ) : (
                      <span className="text-slate-400">{r.branchName || 'Kantor Pusat / Pool'}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {CostCalculationEngine.formatCurrencyIdr(r.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {r.allocationMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.allocationStatus === 'DIRECTLY_ALLOCATED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : r.allocationStatus === 'SPLIT_ALLOCATED'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : r.allocationStatus === 'DERIVED_CHILD'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {r.allocationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                    {r.notes || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {r.allocationStatus === 'SPLIT_ALLOCATED' && (
                      <button
                        onClick={() => reverseCostAllocation(r.id)}
                        className="p-1 rounded text-amber-400 hover:bg-amber-500/20 transition-colors"
                        title="Batalkan & Kembalikan Alokasi"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
