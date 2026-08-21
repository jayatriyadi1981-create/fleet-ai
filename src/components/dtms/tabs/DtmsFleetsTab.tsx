import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Layers,
  Scale,
  Fuel,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { DumpTruckUnit, DumpTruckCategory } from '../../../modules/dtms/types';

export const DtmsFleetsTab: React.FC = () => {
  const [trucks, setTrucks] = useState<DumpTruckUnit[]>(dtmsService.getTrucks());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredTrucks = trucks.filter(t => {
    const matchSearch = t.hullNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.currentDriverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'ALL' || t.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div id="dtms-fleets-tab" className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <span>Master Armada & Spesifikasi Dump Truck</span>
          </h2>
          <p className="text-xs text-slate-400">Database registrasi unit OHT, Rigid, ADT, dan Heavy Dump Truck 8x4/6x4</p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari no lambung, plat, tipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Tambah Unit DT</span>
          </button>
        </div>
      </div>

      {/* Fleet Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Off-Highway Truck (OHT)</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">24 <span className="text-xs text-slate-400 font-normal">Unit</span></div>
          <div className="text-xs text-amber-400 mt-1 font-medium">CAT 777, Komatsu HD785</div>
          <div className="text-[11px] text-slate-400 mt-2">Kapasitas: 60 - 95 Ton (OB Stripping)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Heavy Dump Truck 8x4</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">42 <span className="text-xs text-slate-400 font-normal">Unit</span></div>
          <div className="text-xs text-cyan-400 mt-1 font-medium">Scania P460, Volvo FMX</div>
          <div className="text-[11px] text-slate-400 mt-2">Kapasitas: 40 - 50 Ton (Coal & Ore)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Heavy Tipper 6x4</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">36 <span className="text-xs text-slate-400 font-normal">Unit</span></div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">Hino 500 FM260JD, Quester</div>
          <div className="text-[11px] text-slate-400 mt-2">Kapasitas: 25 - 30 Ton (Jetty Hauling)</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Articulated DT (ADT)</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">12 <span className="text-xs text-slate-400 font-normal">Unit</span></div>
          <div className="text-xs text-purple-400 mt-1 font-medium">Volvo A40G, CAT 740</div>
          <div className="text-[11px] text-slate-400 mt-2">Kapasitas: 35 - 40 Ton (Mud & Wet Pit)</div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Menampilkan {filteredTrucks.length} dari {trucks.length} unit terdaftar</span>
          <div className="flex items-center space-x-2">
            <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 flex items-center space-x-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-3">No. Lambung</th>
                <th className="py-3 px-3">Model & Brand</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Vessel & Rated Ton</th>
                <th className="py-3 px-3">Berat Kosong (Tare)</th>
                <th className="py-3 px-3">Driver Default</th>
                <th className="py-3 px-3">KIMPER No</th>
                <th className="py-3 px-3">Status Unit</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredTrucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs">
                        {truck.hullNumber}
                      </div>
                      <span>{truck.plateNumber}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-100">
                    {truck.model}
                    <div className="text-[11px] text-slate-400 font-normal">Brand: {truck.brand}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {truck.category.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3 font-medium">
                    <span className="text-emerald-400 font-bold">{truck.ratedPayloadTons} Ton</span>
                    <span className="text-slate-400 ml-1">({truck.vesselCapacityM3} m³)</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {truck.tareWeightTons} Ton
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    {truck.currentDriverName}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {truck.driverKimperNo}
                  </td>
                  <td className="py-3 px-3">
                    {truck.status === 'BREAKDOWN_MAINTENANCE' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Breakdown</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Siap Operasi</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 transition-colors">
                      Edit
                    </button>
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
