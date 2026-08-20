/**
 * Fleet Intelligence Smart AI - Live Tracking Filter Panel
 * Advanced Multi-Factor Filter Controls Overlay
 */

import React from 'react';
import { X, RotateCcw, ShieldAlert, Layers } from 'lucide-react';
import { LiveTrackingFilterState } from '../../modules/maps/services/liveTrackingService';
import { mockBranches } from '../../constants/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filterState: LiveTrackingFilterState;
  onFilterChange: (newState: Partial<LiveTrackingFilterState>) => void;
  onResetFilters: () => void;
}

export const LiveTrackingFilterBar: React.FC<Props> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onResetFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-4 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>Filter Lanjutan Live Tracking &amp; Armada</span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Filter</span>
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        {/* Status: Moving, Idle, Parking, Offline, Emergency, Maintenance */}
        <div>
          <label className="block text-slate-400 font-mono mb-1">Status Kendaraan</label>
          <select
            value={filterState.status}
            onChange={(e) => onFilterChange({ status: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="Moving">🟢 Moving (Bergerak)</option>
            <option value="Idle">🟡 Idle (Mesin Nyala Diam)</option>
            <option value="Parking">🔵 Parking (Parkir/Berhenti)</option>
            <option value="Offline">⚪ Offline (Mati/Hilang Sinyal)</option>
            <option value="Emergency">🔴 Emergency (SOS/Bahaya)</option>
            <option value="Maintenance">🟠 Maintenance (Servis)</option>
          </select>
        </div>

        {/* Group */}
        <div>
          <label className="block text-slate-400 font-mono mb-1">Kategori / Grup</label>
          <select
            value={filterState.group}
            onChange={(e) => onFilterChange({ group: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Grup</option>
            <option value="Logistics & Cargo">Logistics &amp; Cargo</option>
            <option value="Heavy Duty">Heavy Duty Dump Truck</option>
            <option value="Cold Chain (Reefer)">Cold Chain (Reefer)</option>
            <option value="Passenger & Shuttle">Passenger &amp; Shuttle</option>
            <option value="Hazardous Material (Hazmat)">Hazardous Material (Hazmat)</option>
            <option value="Armada Jabodetabek">Armada Jabodetabek</option>
            <option value="Armada Trans-Jawa">Armada Trans-Jawa</option>
          </select>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-slate-400 font-mono mb-1">Cabang / Wilayah</label>
          <select
            value={filterState.branchId}
            onChange={(e) => onFilterChange({ branchId: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Cabang</option>
            {mockBranches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Driver Assignment */}
        <div>
          <label className="block text-slate-400 font-mono mb-1">Pengemudi</label>
          <select
            value={filterState.driverAssignment}
            onChange={(e) => onFilterChange({ driverAssignment: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Kendaraan</option>
            <option value="ASSIGNED">Ada Driver Aktif</option>
            <option value="UNASSIGNED">Tanpa Driver</option>
          </select>
        </div>

        {/* Ignition */}
        <div>
          <label className="block text-slate-400 font-mono mb-1">Kontak Mesin (ACC)</label>
          <select
            value={filterState.ignition}
            onChange={(e) => onFilterChange({ ignition: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Mesin</option>
            <option value="ON">Mesin ON (Nyala)</option>
            <option value="OFF">Mesin OFF (Mati)</option>
          </select>
        </div>

        {/* Speed Range */}
        <div>
          <label className="block text-slate-400 font-mono mb-1">Rentang Kecepatan</label>
          <select
            value={filterState.speedRange}
            onChange={(e) => onFilterChange({ speedRange: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Semua Kecepatan</option>
            <option value="0_20">0 - 20 km/jam</option>
            <option value="20_40">20 - 40 km/jam</option>
            <option value="40_60">40 - 60 km/jam</option>
            <option value="60_80">60 - 80 km/jam</option>
            <option value="80_PLUS">80+ km/jam (Over-Speed)</option>
          </select>
        </div>

        {/* Alerts Only Toggle */}
        <div className="flex items-end">
          <button
            onClick={() => onFilterChange({ alertsOnly: !filterState.alertsOnly })}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filterState.alertsOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-950'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>Peringatan Aktif</span>
          </button>
        </div>
      </div>
    </div>
  );
};
