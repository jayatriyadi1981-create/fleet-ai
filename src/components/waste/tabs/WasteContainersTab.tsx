import React, { useState } from 'react';
import {
  Layers,
  Radio,
  Wifi,
  Flame,
  AlertTriangle,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { MOCK_COLLECTION_BINS } from '../../../modules/waste/services/wasteMockData';
import { WasteCollectionBin } from '../../../modules/waste/types';

export const WasteContainersTab: React.FC = () => {
  const [bins] = useState<WasteCollectionBin[]>(MOCK_COLLECTION_BINS);
  const [search, setSearch] = useState('');

  const filtered = bins.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.binCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="waste-containers-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <span>Sensor Kontainer Cerdas & RFID Bin Tracking (Smart Waste Bins)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pemantauan level isi bak sampah berbasis sensor ultrasonik IoT, detektor gas metana/bau (H2S), dan pelacak siklus tukar kontainer Arm Roll/Hook Lift.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari bin, kode RFID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => alert('Sensor IoT Kontainer berhasil disinkronisasi!')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Sensor IoT</span>
          </button>
        </div>
      </div>

      {/* Grid of Smart Containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((bin) => (
          <div
            key={bin.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{bin.binCode}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{bin.rfidTag}</span>
                  </div>
                </div>

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200">{bin.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{bin.address}</p>
              </div>

              {/* Sensor Level Fill Progress */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Level Isi Bin:</span>
                  <span className={`font-bold font-mono ${bin.fillLevelPct > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {bin.fillLevelPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${bin.fillLevelPct > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${bin.fillLevelPct}%` }}
                  />
                </div>
              </div>

              {/* Sensor Health */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sensor Gas Metana:</span>
                  <span className="text-emerald-400 font-semibold font-mono">0.02 ppm (Aman)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sensor Termal Kebakaran:</span>
                  <span className="text-emerald-400 font-semibold font-mono">28.4°C (Normal)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Baterai IoT Sensor:</span>
                  <span className="text-sky-400 font-semibold font-mono">94%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">Truk: {bin.assignedVehicleHull}</span>
              <button
                onClick={() => alert(`Jadwal pengambilan kontainer ${bin.binCode} diprioritaskan!`)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Tukar Kontainer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
