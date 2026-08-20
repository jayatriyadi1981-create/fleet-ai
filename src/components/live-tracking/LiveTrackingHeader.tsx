/**
 * Fleet Intelligence Smart AI - Live Tracking Header & Quick Counters
 * Floating Top Control Bar with Multi-mode Search, Status Counters, & Connection Indicator
 */

import React from 'react';
import { 
  Search, 
  WifiOff, 
  RefreshCw, 
  Radio, 
  X,
  SlidersHorizontal,
  FlaskConical,
  ShieldAlert,
  Wrench
} from 'lucide-react';
import { LiveVehicleCounters, RealtimeTransportState, LiveTrackingFilterState } from '../../modules/maps/services/liveTrackingService';

interface Props {
  counters: LiveVehicleCounters;
  filterState: LiveTrackingFilterState;
  onFilterChange: (newState: Partial<LiveTrackingFilterState>) => void;
  transportState: RealtimeTransportState;
  onReconnect: () => void;
  isFilterBarOpen: boolean;
  onToggleFilterBar: () => void;
  onToggleSimulator: () => void;
  isSimulatorOpen: boolean;
}

export const LiveTrackingHeader: React.FC<Props> = ({
  counters,
  filterState,
  onFilterChange,
  transportState,
  onReconnect,
  isFilterBarOpen,
  onToggleFilterBar,
  onToggleSimulator,
  isSimulatorOpen
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-800 shadow-2xl z-20">
      {/* Search Input & Search Mode Selector & Filter Toggle */}
      <div className="flex items-center gap-2 flex-1 max-w-2xl">
        {/* Search Mode Select */}
        <select
          value={filterState.searchType || 'ALL'}
          onChange={(e) => onFilterChange({ searchType: e.target.value as any })}
          className="bg-slate-950/90 border border-slate-800 text-[11px] font-mono rounded-xl px-2 py-2 text-slate-300 focus:outline-none focus:border-cyan-500 shrink-0"
          title="Mode Pencarian Telematika"
        >
          <option value="ALL">Semua Field</option>
          <option value="PLATE">No. Plat</option>
          <option value="DRIVER">Driver</option>
          <option value="LOCATION">Lokasi/Alamat</option>
          <option value="IMEI">IMEI / GPS ID</option>
        </select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              filterState.searchType === 'PLATE' ? 'Cari No Plat (e.g. B 1234 CD)...' :
              filterState.searchType === 'DRIVER' ? 'Cari Nama / No Telp Driver...' :
              filterState.searchType === 'LOCATION' ? 'Cari Alamat / Kota / Wilayah...' :
              filterState.searchType === 'IMEI' ? 'Cari IMEI GPS Tracker...' :
              'Cari Plat, Driver, Alamat, IMEI...'
            }
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 transition-all"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleFilterBar}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all shrink-0 ${
            isFilterBarOpen || filterState.status !== 'ALL' || filterState.alertsOnly || filterState.group !== 'ALL'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Status Counters Breakdown Bar (Moving, Idle, Parking, Offline, Emergency, Maintenance) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-[11px] font-mono scrollbar-none">
        <button
          onClick={() => onFilterChange({ status: 'ALL' })}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 ${
            filterState.status === 'ALL'
              ? 'bg-slate-800 text-white border-slate-600 font-bold'
              : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-white'
          }`}
          title="Semua Kendaraan"
        >
          <span>Total</span>
          <span className="px-1.5 py-0.2 bg-slate-800 text-cyan-300 rounded text-[10px]">
            {counters.total}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Moving' })}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 ${
            filterState.status === 'Moving'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
              : 'bg-slate-950/60 text-emerald-400/80 border-slate-800/80 hover:bg-emerald-950/30'
          }`}
          title="Kendaraan Sedang Bergerak"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Moving</span>
          <span className="px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 rounded text-[10px]">
            {counters.moving}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Idle' })}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 ${
            filterState.status === 'Idle'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
              : 'bg-slate-950/60 text-amber-400/80 border-slate-800/80 hover:bg-amber-950/30'
          }`}
          title="Mesin Nyala tapi Diam (Idle)"
        >
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>Idle</span>
          <span className="px-1.5 py-0.2 bg-amber-950/80 text-amber-300 rounded text-[10px]">
            {counters.idle}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Parking' })}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 ${
            filterState.status === 'Parking' || filterState.status === 'Stopped'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
              : 'bg-slate-950/60 text-blue-400/80 border-slate-800/80 hover:bg-blue-950/30'
          }`}
          title="Kendaraan Parkir / Berhenti"
        >
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span>Parking</span>
          <span className="px-1.5 py-0.2 bg-blue-950/80 text-blue-300 rounded text-[10px]">
            {counters.parking}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Emergency' })}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 ${
            filterState.status === 'Emergency'
              ? 'bg-rose-500/30 text-rose-300 border-rose-500/60 font-bold animate-pulse'
              : 'bg-slate-950/60 text-rose-400/80 border-slate-800/80 hover:bg-rose-950/30'
          }`}
          title="Peringatan SOS / Bahaya / Panic Button"
        >
          <ShieldAlert className="h-3 w-3 text-rose-400" />
          <span>Emergency</span>
          <span className="px-1.5 py-0.2 bg-rose-950/80 text-rose-300 rounded text-[10px]">
            {counters.emergency}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Maintenance' })}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 ${
            filterState.status === 'Maintenance'
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-bold'
              : 'bg-slate-950/60 text-orange-400/80 border-slate-800/80 hover:bg-orange-950/30'
          }`}
          title="Kendaraan Dalam Bengkel / Servis"
        >
          <Wrench className="h-3 w-3 text-orange-400" />
          <span>Servis</span>
          <span className="px-1.5 py-0.2 bg-orange-950/80 text-orange-300 rounded text-[10px]">
            {counters.maintenance}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Offline' })}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 ${
            filterState.status === 'Offline'
              ? 'bg-slate-700 text-slate-200 border-slate-500 font-bold'
              : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-900'
          }`}
          title="GPS Tracker Tidak Mengirim Data"
        >
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span>Offline</span>
          <span className="px-1.5 py-0.2 bg-slate-900 text-slate-300 rounded text-[10px]">
            {counters.offline}
          </span>
        </button>
      </div>

      {/* Realtime Transport Status & Developer Simulator Toggle */}
      <div className="flex items-center gap-2 border-t lg:border-t-0 border-slate-800 pt-2 lg:pt-0 shrink-0">
        <button
          onClick={onReconnect}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
            transportState === 'LIVE'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : transportState === 'RECONNECTING'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
          title="Status Koneksi WebSocket / Realtime Feed"
        >
          {transportState === 'LIVE' ? (
            <>
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>● Live</span>
            </>
          ) : transportState === 'RECONNECTING' ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin" />
              <span>◌ Reconnect</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-rose-400" />
              <span>○ Offline</span>
            </>
          )}
        </button>

        <button
          onClick={onToggleSimulator}
          className={`p-2 rounded-xl border transition-all ${
            isSimulatorOpen
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="GPS Simulation Console"
        >
          <FlaskConical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
