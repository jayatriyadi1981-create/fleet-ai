import React, { useState } from 'react';
import {
  PackageSearch,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Car,
  Smartphone,
  Wallet,
  Luggage,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';
import { LostAndFoundItem } from '../../../modules/taxi/types';

export const TaxiLostFoundTab: React.FC = () => {
  const [items, setItems] = useState<LostAndFoundItem[]>(taxiService.getLostAndFound());
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [newCase, setNewCase] = useState({
    taxiHull: '',
    driverName: '',
    passengerName: '',
    passengerPhone: '',
    itemName: '',
    category: 'SMARTPHONE_ELECTRONIC' as any,
    route: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.taxiHull || !newCase.itemName) return;

    const newItem: LostAndFoundItem = {
      id: `lnf-${Date.now()}`,
      caseNumber: `LF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      taxiHullNumber: newCase.taxiHull,
      driverName: newCase.driverName || 'Driver Tercatat',
      passengerName: newCase.passengerName || 'Tamu Penumpang',
      passengerPhone: newCase.passengerPhone || '0812-xxxx',
      itemName: newCase.itemName,
      itemCategory: newCase.category,
      tripDate: 'Hari Ini (Live Entry)',
      pickupDropoffRoute: newCase.route || 'Rute dalam kota',
      reportedAt: 'Live',
      itemStatus: 'STORED_AT_POOL',
      custodyOfficer: 'Security Pool Kemayoran',
    };

    setItems([newItem, ...items]);
    setShowModal(false);
  };

  const filteredItems = items.filter(
    (i) =>
      i.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.taxiHullNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.passengerName && i.passengerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div id="taxi-lost-found-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <PackageSearch className="w-5 h-5 text-amber-400" />
            <span>Pusat Pengelolaan Barang Tertinggal Penumpang (Lost & Found)</span>
          </h2>
          <p className="text-xs text-slate-400">Pencarian nomor lambung taksi, pelaporan barang berharga (HP, dompet, koper), dan berita acara serah terima</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Input Laporan Barang Temuan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor kasus (LF-2026), nomor lambung taksi (TX-101), nama barang (iPhone/Dompet), atau penumpang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {item.caseNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{item.itemName}</h3>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                  item.itemStatus === 'RETURNED_TO_OWNER'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {item.itemStatus === 'RETURNED_TO_OWNER' ? '✓ TELAH DISERAHKAN' : '● TERSIMPAN DI POOL'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800/60">
              <div>
                <span className="text-[10px] text-slate-400">Armada & Driver:</span>
                <p className="font-semibold text-slate-200">{item.taxiHullNumber} ({item.driverName})</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Pemilik / Penumpang:</span>
                <p className="font-semibold text-slate-200">{item.passengerName || 'Belum Terdata'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400">Rute Perjalanan & Waktu:</span>
                <p className="text-slate-300 text-[11px]">{item.pickupDropoffRoute} ({item.tripDate})</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
              <span>Petugas Penitipan: <strong>{item.custodyOfficer}</strong></span>
              {item.handoverReceiptNo && (
                <span className="font-mono text-emerald-400">Resi #{item.handoverReceiptNo}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <PackageSearch className="w-4 h-4 text-amber-400" />
                <span>Registrasi Barang Temuan Tertinggal</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nomor Lambung Taksi *</label>
                  <input
                    type="text"
                    required
                    placeholder="TX-101"
                    value={newCase.taxiHull}
                    onChange={(e) => setNewCase({ ...newCase, taxiHull: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nama Driver</label>
                  <input
                    type="text"
                    placeholder="Bambang S."
                    value={newCase.driverName}
                    onChange={(e) => setNewCase({ ...newCase, driverName: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama & Deskripsi Barang *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Koper Samsonite Hitam 24 Inch"
                  value={newCase.itemName}
                  onChange={(e) => setNewCase({ ...newCase, itemName: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kategori Barang</label>
                  <select
                    value={newCase.category}
                    onChange={(e) => setNewCase({ ...newCase, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                  >
                    <option value="SMARTPHONE_ELECTRONIC">Smartphone & Elektronik</option>
                    <option value="WALLET_VALUABLES">Dompet & Barang Berharga</option>
                    <option value="LUGGAGE_BAG">Koper & Tas Bawaan</option>
                    <option value="DOCUMENTS_ID">Dokumen / Paspor / KTP</option>
                    <option value="OTHERS">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rute Perjalanan</label>
                  <input
                    type="text"
                    placeholder="Bandara T3 -> Hotel Mulia"
                    value={newCase.route}
                    onChange={(e) => setNewCase({ ...newCase, route: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded"
                >
                  Simpan Laporan Temuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
