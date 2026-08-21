import React, { useState } from 'react';
import {
  RotateCw,
  Clock,
  MapPin,
  TrendingUp,
  Fuel,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { HaulCycleRecord } from '../../../modules/dtms/types';

export const DtmsCyclesTab: React.FC = () => {
  const [cycles] = useState<HaulCycleRecord[]>(dtmsService.getCycles());
  const [selectedCycle, setSelectedCycle] = useState<HaulCycleRecord | null>(cycles[0] || null);

  return (
    <div id="dtms-cycles-tab" className="space-y-6">
      {/* Header & Overview */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <RotateCw className="w-5 h-5 text-cyan-400" />
            <span>Manajemen Ritase & Breakdown Cycle Time Hauling</span>
          </h2>
          <p className="text-xs text-slate-400">Analisis waktu antre (spotting), pengisian, muat, dumping hoist, dan retur kosong</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Shift Aktif:</span>
          <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold">Shift 1 (Siang)</span>
        </div>
      </div>

      {/* Cycle Time Step Breakdown Visualizer */}
      {selectedCycle && (
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{selectedCycle.cycleCode}</span>
                <span className="text-sm font-bold text-slate-100">{selectedCycle.truckHullNo} - {selectedCycle.driverName}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Excavator: <span className="text-amber-400">{selectedCycle.excavatorHullNo}</span> | Rute: {selectedCycle.loadingPoint} &rarr; {selectedCycle.dumpingPoint}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-slate-400">Total Durasi Siklus</div>
                <div className="text-xl font-extrabold text-cyan-400">{selectedCycle.totalCycleTimeMins} Menit</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Payload Bersih</div>
                <div className="text-xl font-extrabold text-emerald-400">{selectedCycle.netPayloadTon} Ton</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Efisiensi Siklus</div>
                <div className="text-xl font-extrabold text-purple-400">{selectedCycle.efficiencyScore}%</div>
              </div>
            </div>
          </div>

          {/* Step Timeline Segments */}
          <div className="mt-5">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Breakdown Komponen Waktu (Minutes)</div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium">1. Antre Loading</div>
                <div className="text-lg font-bold text-amber-400 mt-1">{selectedCycle.queueLoadTimeMins} m</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Spotting Time</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium">2. Muat Shovel</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">{selectedCycle.loadingTimeMins} m</div>
                <div className="text-[10px] text-slate-500 mt-0.5">4-5 Pass Bucket</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium">3. Haul Muatan</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{selectedCycle.loadedHaulTimeMins} m</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{selectedCycle.distanceLoadedKm} km / 28 kmh</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium">4. Antre Dumping</div>
                <div className="text-lg font-bold text-blue-400 mt-1">{selectedCycle.queueDumpTimeMins} m</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Hopper / Tip Pad</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium">5. Dumping Hoist</div>
                <div className="text-lg font-bold text-purple-400 mt-1">{selectedCycle.dumpingTimeMins} m</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Tipping 50°</div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium">6. Retur Kosong</div>
                <div className="text-lg font-bold text-teal-400 mt-1">{selectedCycle.emptyReturnTimeMins} m</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{selectedCycle.distanceEmptyKm} km / 36 kmh</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cycle Log Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">Log Ritase Hauling Terverifikasi Telemetri</span>
          <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 flex items-center space-x-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Unduh Rekap LHT</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-3">Kode Ritase</th>
                <th className="py-3 px-3">Unit & Driver</th>
                <th className="py-3 px-3">Shovel & Material</th>
                <th className="py-3 px-3">Waktu Mulai - Selesai</th>
                <th className="py-3 px-3">Total Cycle Time</th>
                <th className="py-3 px-3">Jarak (KM)</th>
                <th className="py-3 px-3">Payload (Ton)</th>
                <th className="py-3 px-3">Konsumsi Solar</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {cycles.map((cyc) => (
                <tr
                  key={cyc.id}
                  onClick={() => setSelectedCycle(cyc)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedCycle?.id === cyc.id ? 'bg-cyan-500/5' : ''}`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                    {cyc.cycleCode}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100">{cyc.truckHullNo}</div>
                    <div className="text-[11px] text-slate-400">{cyc.driverName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-amber-300">{cyc.excavatorHullNo}</div>
                    <div className="text-[11px] text-slate-400">{cyc.material.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {cyc.startTime} - {cyc.endTime}
                  </td>
                  <td className="py-3 px-3 font-bold text-cyan-400">
                    {cyc.totalCycleTimeMins} m
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {(cyc.distanceLoadedKm + cyc.distanceEmptyKm).toFixed(1)} km
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {cyc.netPayloadTon} Ton
                  </td>
                  <td className="py-3 px-3 text-slate-300 flex items-center space-x-1 mt-1">
                    <Fuel className="w-3 h-3 text-amber-400" />
                    <span>{cyc.fuelUsedLiters} L</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700">
                      Pilih
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
