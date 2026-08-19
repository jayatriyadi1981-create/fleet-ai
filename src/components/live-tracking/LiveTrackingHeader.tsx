/**
 * Fleet Intelligence Smart AI - Live Tracking Header & Quick Counters
 * Floating Top Control Bar with Search, Status Counters, & Connection Indicator
 */

import React from 'react';
import { 
  Search, 
  Filter, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Radio, 
  X,
  Sparkles,
  SlidersHorizontal,
  FlaskConical
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl z-20">
      {/* Search Input & Filter Toggle */}
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Plat (e.g. B 1234), Kendaraan, Driver, IMEI..."
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
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
            isFilterBarOpen || filterState.status !== 'ALL' || filterState.alertsOnly
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Status Counters Breakdown Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-[11px] font-mono">
        <button
          onClick={() => onFilterChange({ status: 'ALL' })}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
            filterState.status === 'ALL'
              ? 'bg-slate-800 text-white border-slate-600 font-bold'
              : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-white'
          }`}
        >
          <span>Total</span>
          <span className="px-1.5 py-0.2 bg-slate-800 text-cyan-300 rounded text-[10px]">
            {counters.total}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Moving' })}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
            filterState.status === 'Moving'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
              : 'bg-slate-950/60 text-emerald-400/80 border-slate-800/80 hover:bg-emerald-950/30'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Bergerak</span>
          <span className="px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 rounded text-[10px]">
            {counters.moving}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Stopped' })}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
            filterState.status === 'Stopped'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
              : 'bg-slate-950/60 text-rose-400/80 border-slate-800/80 hover:bg-rose-950/30'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span>Parkir</span>
          <span className="px-1.5 py-0.2 bg-rose-950/80 text-rose-300 rounded text-[10px]">
            {counters.stopped}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Idle' })}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
            filterState.status === 'Idle'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
              : 'bg-slate-950/60 text-amber-400/80 border-slate-800/80 hover:bg-amber-950/30'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>Idle</span>
          <span className="px-1.5 py-0.2 bg-amber-950/80 text-amber-300 rounded text-[10px]">
            {counters.idle}
          </span>
        </button>

        <button
          onClick={() => onFilterChange({ status: 'Offline' })}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
            filterState.status === 'Offline'
              ? 'bg-slate-700 text-slate-200 border-slate-500 font-bold'
              : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-900'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span>Offline</span>
          <span className="px-1.5 py-0.2 bg-slate-900 text-slate-300 rounded text-[10px]">
            {counters.offline}
          </span>
        </button>
      </div>

      {/* Realtime Transport Status & Developer Simulator Toggle */}
      <div className="flex items-center gap-2 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
        <button
          onClick={onReconnect}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
            transportState === 'LIVE'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : transportState === 'RECONNECTING'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
          title="Klik untuk Reconnect Realtime Telemetry Stream"
        >
          {transportState === 'LIVE' ? (
            <>
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>● Live</span>
            </>
          ) : transportState === 'RECONNECTING' ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin" />
              <span>◌ Reconnecting...</span>
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
          title="Dev Simulator Console (PROMPT 13 Test Tool)"
        >
          <FlaskConical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
