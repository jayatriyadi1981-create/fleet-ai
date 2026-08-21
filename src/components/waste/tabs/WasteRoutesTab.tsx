import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Search,
  Filter,
  Truck,
  ArrowRight,
  TrendingUp,
  Radio
} from 'lucide-react';
import { MOCK_COLLECTION_BINS } from '../../../modules/waste/services/wasteMockData';
import { WasteCollectionBin } from '../../../modules/waste/types';

export const WasteRoutesTab: React.FC = () => {
  const [bins] = useState<WasteCollectionBin[]>(MOCK_COLLECTION_BINS);
  const [search, setSearch] = useState('');

  const filtered = bins.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.binCode.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="waste-routes-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <span>Jadwal & Rute Pengumpulan TPS / Depo Sampah (Route & Collection Plan)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Penjadwalan dinamis pengangkutan sampah dari TPS 3R, pusat perbelanjaan, rumah sakit, dan depo kontainer industri.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari TPS, kode bin, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={() => alert('Fitur Optimasi Rute AI sedang mengkalkulasi rute terpendek!')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Auto-Optimize Rute AI</span>
          </button>
        </div>
      </div>

      {/* Bin Collection Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((bin) => (
          <div
            key={bin.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-sky-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono font-bold border border-sky-500/20">
                  {bin.category.replace(/_/g, ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{bin.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{bin.binCode}</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  bin.sensorStatus === 'OVERFLOW_ALERT'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {bin.sensorStatus === 'OVERFLOW_ALERT' ? '⚠️ HAMPIR PENUH' : 'NORMAL'}
              </span>
            </div>

            {/* Fill Level Meter */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Tingkat Kepenuhan Sensor Ultrasonic:</span>
                <span className={`font-bold font-mono ${bin.fillLevelPct > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {bin.fillLevelPct}% (Kapasitas {bin.capacityM3} m³)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    bin.fillLevelPct > 80 ? 'bg-rose-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${bin.fillLevelPct}%` }}
                />
              </div>
            </div>

            {/* Address & Assigned Truck */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                <span className="text-slate-300">{bin.address}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                <span className="text-slate-400">Truk Ditugaskan:</span>
                <span className="font-bold text-sky-300 font-mono">{bin.assignedVehicleHull}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Jadwal Penjemputan:</span>
                <span className="text-amber-400 font-bold font-mono">{bin.scheduledPickupTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tag RFID Bin:</span>
                <span className="text-slate-400 font-mono text-[11px]">{bin.rfidTag}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Terakhir dikosongkan: {bin.lastEmptiedAt}</span>
              <button
                onClick={() => alert(`Dispatch darurat untuk ${bin.name} berhasil dikirim!`)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all"
              >
                Dispatch Truk Sekarang
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
