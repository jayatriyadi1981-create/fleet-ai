import React, { useState } from 'react';
import {
  Car,
  Search,
  Filter,
  Plus,
  BatteryCharging,
  Fuel,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Clock
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';
import { TaxiCategory, TaxiStatus, TaxiVehicle } from '../../../modules/taxi/types';

export const TaxiFleetsTab: React.FC = () => {
  const [vehicles, setVehicles] = useState<TaxiVehicle[]>(taxiService.getVehicles());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.hullNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.currentDriverName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div id="taxi-fleets-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Car className="w-5 h-5 text-amber-400" />
            <span>Master Armada & Spesifikasi Taksi (Sedan, MPV, EV & Executive)</span>
          </h2>
          <p className="text-xs text-slate-400">Database nomor lambung, pelat kuning, masa berlaku Uji KIR Dishub, dan tera segel argometer</p>
        </div>

        <button
          onClick={() => alert('Buka form registrasi unit taksi baru')}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Unit Taksi</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor lambung (TX-101), plat nomor (B 1420 TAA), model, atau nama driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="REGULAR_SEDAN">Sedan Reguler</option>
            <option value="REGULAR_MPV">MPV 7-Seater</option>
            <option value="ELECTRIC_EV">Electric EV Green</option>
            <option value="EXECUTIVE_PREMIUM">Executive (Silver Bird)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="AVAILABLE_VACANT">Vacant (Kosong)</option>
            <option value="ON_TRIP_HIRED">On Trip (Hired)</option>
            <option value="STANDBY_QUEUE_POOL">Standby Queue</option>
            <option value="CHARGING_REFUELING">Charging/Refuel</option>
            <option value="BREAKDOWN_OFFLINE">Bengkel</option>
          </select>
        </div>
      </div>

      {/* Fleets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((v) => (
          <div key={v.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors">
            {/* Top Row: Hull & Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-black text-amber-400">
                  {v.hullNumber}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">{v.plateNumber}</div>
                  <div className="text-[11px] text-slate-400">{v.model} ({v.year})</div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  v.status === 'ON_TRIP_HIRED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : v.status === 'AVAILABLE_VACANT'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : v.status === 'STANDBY_QUEUE_POOL'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : v.status === 'CHARGING_REFUELING'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {v.status.replace('_', ' ')}
              </span>
            </div>

            {/* Middle Stats */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Pengemudi Aktif</span>
                <p className="font-semibold text-slate-200 truncate">{v.currentDriverName}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Pool Induk</span>
                <p className="font-semibold text-slate-200 truncate">{v.assignedPool}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Odometer</span>
                <p className="font-mono text-slate-300">{v.odometerKm.toLocaleString()} KM</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Energi / BBM</span>
                <p className="font-semibold text-slate-200 flex items-center space-x-1">
                  {v.fuelType === 'ELECTRIC_EV' ? (
                    <>
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{v.batterySocPct}% SOC (EV)</span>
                    </>
                  ) : (
                    <>
                      <Fuel className="w-3.5 h-3.5 text-amber-400" />
                      <span>{v.fuelLevelPct}% {v.fuelType === 'CNG_SPBG' ? 'Gas' : 'Bensin'}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Bottom Compliance Box */}
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Segel Tera Argo:</span>
                </span>
                <span className="font-semibold text-emerald-400">{v.taximeterSealExpiry}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Uji KIR Dishub:</span>
                </span>
                <span className="font-semibold text-slate-300">{v.kirExpiryDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
