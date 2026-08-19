/**
 * Fleet Intelligence Smart AI - Parts & Inventory Tab
 * PROMPT 25 - Spare Parts Catalog, Stock Alerts & Part Transactions
 */

import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { MOCK_PARTS, MOCK_PART_TRANSACTIONS } from '../../data/mockMaintenanceData';
import { Part, PartTransaction } from '../../types';

interface PartsTabProps {
  onAddPart?: () => void;
}

export const PartsTab: React.FC<PartsTabProps> = ({ onAddPart }) => {
  const [subView, setSubView] = useState<'inventory' | 'transactions'>('inventory');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredParts = MOCK_PARTS.filter((p) => {
    const matchSearch =
      p.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const lowStockCount = MOCK_PARTS.filter((p) => p.status === 'LOW_STOCK').length;
  const outOfStockCount = MOCK_PARTS.filter((p) => p.status === 'OUT_OF_STOCK').length;
  const totalValueIdr = MOCK_PARTS.reduce((sum, p) => sum + p.stockQuantity * p.unitCost, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-cyan-400" />
            Inventori Suku Cadang & Manajemen Gudang (Spare Parts)
          </h2>
          <p className="text-xs text-slate-400">
            Monitoring stok minimum/maksimum, peringatan dini Low Stock / Out of Stock, kompatibilitas suku cadang per armada, dan riwayat mutasi barang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setSubView('inventory')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                subView === 'inventory' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Katalog Suku Cadang
            </button>
            <button
              onClick={() => setSubView('transactions')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                subView === 'transactions' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mutasi & Transaksi
            </button>
          </div>

          <button
            onClick={onAddPart}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Part</span>
          </button>
        </div>
      </div>

      {/* Stock KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Jenis Suku Cadang</span>
          <p className="text-2xl font-black text-white mt-1">{MOCK_PARTS.length} Item</p>
          <span className="text-[10px] text-slate-500">Tersedia di Gudang Cakung</span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-amber-400">Stok Menipis (Low Stock)</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{lowStockCount} Item</p>
          <span className="text-[10px] text-amber-300/80">Di bawah ambang batas minimum</span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-rose-400">Habis (Out of Stock)</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{outOfStockCount} Item</p>
          <span className="text-[10px] text-rose-300/80">Perlu pengadaan segera</span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Valuasi Stok Total</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">Rp {(totalValueIdr / 1000000).toFixed(1)} Jt</p>
          <span className="text-[10px] text-slate-500">Harga perolehan rata-rata</span>
        </div>
      </div>

      {subView === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari Part Number / Nama Barang / Merk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Status Stok</option>
              <option value="IN_STOCK">Normal (In Stock)</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          {/* Parts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-all shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold block">{part.partNumber}</span>
                    <h3 className="text-xs font-bold text-white mt-0.5">{part.name}</h3>
                    <p className="text-[10px] text-slate-400">{part.brand}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    part.status === 'OUT_OF_STOCK'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                      : part.status === 'LOW_STOCK'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                  }`}>
                    {part.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Stock Level Bar */}
                <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Jumlah Stok:</span>
                    <span className="font-bold text-white">
                      {part.stockQuantity} {part.unit} (Min: {part.minimumStock})
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        part.stockQuantity === 0
                          ? 'bg-rose-500'
                          : part.stockQuantity <= part.minimumStock
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (part.stockQuantity / part.maximumStock) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Price & Location */}
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/80">
                  <span className="font-bold text-emerald-400">
                    Rp {part.unitCost.toLocaleString('id-ID')} / {part.unit}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={part.location}>
                    📍 {part.location}
                  </span>
                </div>

                {/* Compatible Vehicles */}
                <div className="text-[10px] text-slate-500">
                  Kompatibel: {part.compatibleVehicles.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subView === 'transactions' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white">Log Mutasi & Pengeluaran Suku Cadang (Part Transactions)</h3>
          <div className="divide-y divide-slate-800 text-xs text-slate-300">
            {MOCK_PART_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'ISSUE' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'}`}>
                    {tx.type === 'ISSUE' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-white">{tx.partName}</span> ({tx.partNumber})
                    <p className="text-[10px] text-slate-400">
                      Tipe: <strong>{tx.type}</strong> | Jumlah: <strong>{tx.quantity} unit</strong> | Petugas: {tx.performedBy}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">Rp {tx.totalCost.toLocaleString('id-ID')}</span>
                  <span className="text-[10px] text-slate-500 block">{tx.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
