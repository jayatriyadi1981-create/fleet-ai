import React from 'react';
import {
  MapPin,
  Car,
  Clock,
  BatteryCharging,
  Fuel,
  Users,
  ShieldCheck,
  Plus,
  Compass
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';

export const TaxiPoolsStationsTab: React.FC = () => {
  const stations = taxiService.getStations();

  return (
    <div id="taxi-pools-stations-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Pool Induk & Manajemen Antrean Pangkalan Taksi (Staging Queues)</span>
          </h2>
          <p className="text-xs text-slate-400">Pengaturan antrean First-In-First-Out (FIFO) di Bandara Soetta, Stasiun Gambir, Mall & Hotel Bintang 5</p>
        </div>

        <button
          onClick={() => alert('Buka dialog konfigurasi pangkalan pangkalan baru')}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pangkalan Staging</span>
        </button>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stations.map((st) => (
          <div key={st.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {st.type.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1.5">{st.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{st.address}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Kapasitas Slot</span>
                <div className="text-lg font-bold font-mono text-slate-200">{st.capacitySlots} Unit</div>
              </div>
            </div>

            {/* Live Queue Progress Bar */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Ketersediaan Taksi Ready: <strong className="text-emerald-400">{st.currentAvailableTaxis} Unit</strong></span>
                <span>Antrean Penumpang: <strong className="text-amber-400">{st.currentQueueLength} Orang</strong></span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (st.currentAvailableTaxis / st.capacitySlots) * 100)}%` }}
                />
              </div>
            </div>

            {/* Bottom Meta Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div>
                <span className="text-[10px]">Waktu Tunggu Rata-rata</span>
                <p className="font-semibold text-slate-200 font-mono">~{st.avgWaitTimeMins} Menit</p>
              </div>
              <div>
                <span className="text-[10px]">Petugas Dispatcher</span>
                <p className="font-semibold text-slate-200 truncate">{st.dispatcherOnDuty}</p>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center space-x-1.5 text-[10px] text-slate-300 pt-1 sm:pt-0">
                {st.hasEvCharger && (
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                    ⚡ SPKLU EV
                  </span>
                )}
                {st.hasGasSpbg && (
                  <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30">
                    ⛽ SPBG Gas
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
