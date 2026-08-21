import React, { useState } from 'react';
import { 
  Boxes, 
  Layers, 
  Truck, 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Printer, 
  ShieldCheck,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { LogisticsManifest, LogisticsOrder, LogisticsHub } from '../../../modules/logistics/types';

interface Props {
  manifests: LogisticsManifest[];
  orders: LogisticsOrder[];
  hubs: LogisticsHub[];
  onCreateManifest: (manifest: Partial<LogisticsManifest>) => void;
}

export const LogisticsManifestsTab: React.FC<Props> = ({ manifests, orders, hubs, onCreateManifest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [originHubId, setOriginHubId] = useState(hubs[0]?.id || 'hub-jkt-central');
  const [destHubId, setDestHubId] = useState(hubs[1]?.id || 'hub-bdg-main');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const orig = hubs.find(h => h.id === originHubId);
    const dest = hubs.find(h => h.id === destHubId);

    onCreateManifest({
      originHubId,
      originHubName: orig?.name || 'Jakarta Hub',
      destinationHubId: destHubId,
      destinationHubName: dest?.name || 'Bandung Hub',
      vehiclePlate: vehiclePlate || 'B 9900 UTT',
      driverName: driverName || 'Driver Linehaul',
      totalShipments: 120,
      totalWeightKg: 4200,
      totalCbm: 28.5,
      capacityUtilizationPct: 89.2,
      notes
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-purple-600" />
            Manifest & Konsolidasi Kargo Antar Hub
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Grouping muatan kargo tronton & wingbox, tracking nomor segel fisik, dan utilisasi kapasitas armada CBM/Tonase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Buat Manifest Baru
          </button>
        </div>
      </div>

      {/* Manifest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {manifests.map((mnf) => (
          <div 
            key={mnf.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-bold text-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">{mnf.manifestNumber}</div>
                  <div className="text-xs text-slate-500">{mnf.vehiclePlate}</div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                mnf.status === 'IN_TRANSIT' 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              }`}>
                {mnf.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Hub Route */}
            <div className="flex items-center justify-between text-xs p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div>
                <div className="text-[10px] text-slate-400">ORIGIN HUB</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{mnf.originHubName.split('(')[0]}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400">DESTINATION HUB</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{mnf.destinationHubName.split('(')[0]}</div>
              </div>
            </div>

            {/* Load Capacity Meter */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Load Factor: <strong className="text-purple-600 dark:text-purple-400">{mnf.capacityUtilizationPct}%</strong></span>
                <span>{mnf.totalWeightKg.toLocaleString()} kg / {mnf.totalCbm} CBM</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${mnf.capacityUtilizationPct}%` }} />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Driver & Telp</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{mnf.driverName} ({mnf.driverPhone})</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Nomor Segel (Seal No)</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{mnf.sealNumber}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Total: <strong>{mnf.totalShipments} Resi / Surat Jalan</strong></span>
              <button 
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Manifest
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Create Manifest */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-purple-600" />
                Buat Manifest Konsolidasi Kargo
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Hub Asal (Origin)</label>
                  <select 
                    value={originHubId} 
                    onChange={(e) => setOriginHubId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {hubs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Hub Tujuan (Destination)</label>
                  <select 
                    value={destHubId} 
                    onChange={(e) => setDestHubId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {hubs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Plat Nomor Truk</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: B 9481 UXT (Wingbox)"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nama Driver</label>
                  <input 
                    type="text" 
                    placeholder="Nama driver utama..."
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Catatan Manifest & Instruksi Suhu/Segel</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl font-semibold">Terbitkan Manifest</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
