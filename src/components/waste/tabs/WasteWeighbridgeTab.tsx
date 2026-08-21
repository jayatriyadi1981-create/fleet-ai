import React, { useState } from 'react';
import {
  Scale,
  Clock,
  Truck,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Plus,
  Building,
  DollarSign,
  ArrowRight,
  TrendingDown,
  Layers
} from 'lucide-react';
import { MOCK_WEIGHBRIDGE_RECORDS } from '../../../modules/waste/services/wasteMockData';
import { WeighbridgeRecord } from '../../../modules/waste/types';

export const WasteWeighbridgeTab: React.FC = () => {
  const [records] = useState<WeighbridgeRecord[]>(MOCK_WEIGHBRIDGE_RECORDS);
  const [search, setSearch] = useState('');

  const filtered = records.filter(
    (r) =>
      r.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.hullNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.driverName.toLowerCase().includes(search.toLowerCase()) ||
      r.tpaName.toLowerCase().includes(search.toLowerCase())
  );

  const totalGross = records.reduce((a, r) => a + r.grossWeightKg, 0);
  const totalTare = records.reduce((a, r) => a + r.tareWeightKg, 0);
  const totalNet = records.reduce((a, r) => a + r.netWeightKg, 0);

  return (
    <div id="waste-weighbridge-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>Jembatan Timbang TPA / TPST (Weighbridge & Tipping Management)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pencatatan bobot kotor (Gross), bobot kosong truk (Tare), tonase muatan bersih (Net Payload), dan zona pembongkaran sampah TPA.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari no tiket timbang, lambung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => alert('Simulasi Penimbangan Otomatis Gate Jembatan Timbang Aktif!')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Input Tiket Timbang Baru</span>
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Berat Kotor (Gross In)</span>
          <div className="text-xl font-black text-slate-100 font-mono mt-1">
            {(totalGross / 1000).toFixed(2)} <span className="text-xs text-slate-400 font-normal">Ton</span>
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Berat Kosong Truk (Tare Out)</span>
          <div className="text-xl font-black text-slate-400 font-mono mt-1">
            {(totalTare / 1000).toFixed(2)} <span className="text-xs text-slate-500 font-normal">Ton</span>
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400">Total Bersih Sampah (Net Tipped)</span>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">
            {(totalNet / 1000).toFixed(2)} <span className="text-xs text-slate-400 font-normal">Ton</span>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Daftar Tiket Penimbangan TPA Hari Ini</h3>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Transaksi Timbang</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">No Tiket</th>
                <th className="py-3 px-4">TPA / Fasilitas</th>
                <th className="py-3 px-4">Truk & Plat</th>
                <th className="py-3 px-4">Kategori Muatan</th>
                <th className="py-3 px-4 text-right">Gross (Kg)</th>
                <th className="py-3 px-4 text-right">Tare (Kg)</th>
                <th className="py-3 px-4 text-right">Net Bersih (Ton)</th>
                <th className="py-3 px-4">Zona Tipping</th>
                <th className="py-3 px-4">Waktu (In / Out)</th>
                <th className="py-3 px-4 text-right">Retribusi Tipping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{record.ticketNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{record.tpaName}</td>
                  <td className="py-3.5 px-4">
                    <span className="block font-bold text-slate-100">{record.hullNumber}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{record.plateNumber} ({record.driverName})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {record.wasteCategory.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">{record.grossWeightKg.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">{record.tareWeightKg.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    {record.netWeightTons.toFixed(2)} Ton
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{record.tippingFloorZone}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {record.inTimestamp} - {record.outTimestamp}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                    Rp {record.tippingFeeRp.toLocaleString('id-ID')}
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
