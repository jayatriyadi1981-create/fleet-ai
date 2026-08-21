import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  MapPin, 
  Truck, 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2,
  Users,
  Phone
} from 'lucide-react';
import { LogisticsHub } from '../../../modules/logistics/types';

interface Props {
  hubs: LogisticsHub[];
}

export const LogisticsHubWarehouseTab: React.FC<Props> = ({ hubs: initialHubs }) => {
  const [hubs, setHubs] = useState<LogisticsHub[]>(initialHubs);
  const [selectedHub, setSelectedHub] = useState<LogisticsHub>(initialHubs[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Jaringan Hub Logistik, Gudang & Transit Depo
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Pemantauan kapasitas storage CBM, staging bay, gate loading/unloading, dan armada standby di setiap depo.
          </p>
        </div>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((h) => {
          const utilPct = Math.round((h.currentStoredCbm / h.dailyCapacityCbm) * 100);
          return (
            <div 
              key={h.id}
              onClick={() => setSelectedHub(h)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                selectedHub.id === h.id 
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-md' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{h.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  h.operationalStatus === 'OPERATIONAL'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  {h.operationalStatus}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{h.city}</h4>
                <p className="text-slate-500 text-xs truncate">{h.name}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Kapasitas</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{utilPct}% ({h.currentStoredCbm}/{h.dailyCapacityCbm} CBM)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${utilPct > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`} style={{ width: `${utilPct}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                <span>🚛 {h.activeVehiclesCount} Armada</span>
                <span>📦 {h.activeParcelsCount.toLocaleString()} Koli</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Hub Detail View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="font-mono text-xs font-bold text-indigo-600">{selectedHub.code} • {selectedHub.type.replace(/_/g, ' ')}</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{selectedHub.name}</h3>
            <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedHub.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[10px]">Manager Hub:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedHub.managerName}</span>
              <span className="text-slate-500 text-[11px] block">{selectedHub.contactPhone}</span>
            </div>
          </div>
        </div>

        {/* Staging Bays Layout */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Zona Staging & Loading Bays (Hub Cakung Mega)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Dock Inbound 01 - 04</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-slate-500">Bongkar muatan tronton linehaul dari Surabaya & Semarang.</p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Status: Aktif Bongkar (2 Truk)</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Conveyor Sorting Line</span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <p className="text-[11px] text-slate-500">Pemilahan otomatis barcode koli per kode pos & rute kurir.</p>
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Kecepatan: 4,800 Pcs / Jam</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Cold Chain Storage (2-8°C)</span>
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
              </div>
              <p className="text-[11px] text-slate-500">Penyimpanan khusus obat-obatan farmasi, vaksin & fresh food.</p>
              <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">Suhu: 4.2°C (Optimal)</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Dock Outbound 05 - 08</span>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <p className="text-[11px] text-slate-500">Muat paket ke blind van last-mile wilayah Jabodetabek.</p>
              <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Standby: 18 Van Siap Jalan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
