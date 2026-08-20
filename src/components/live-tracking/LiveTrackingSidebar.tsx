/**
 * Fleet Intelligence Smart AI - Live Tracking Vehicle List Sidebar
 * Desktop Collapsible / Mobile Bottom Sheet Vehicle Navigator with Multi-Select
 */

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MapPin, 
  User, 
  Gauge, 
  ShieldAlert,
  Radio,
  Clock,
  CheckSquare,
  Square,
  Fuel,
  Thermometer,
  Zap
} from 'lucide-react';
import { MapVehicle } from '../../modules/maps/types';

interface Props {
  vehicles: MapVehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  followingVehicleId: string | null;
  multiSelectedIds?: string[];
  onToggleMultiSelect?: (vehicleId: string) => void;
  onSelectAll?: () => void;
  onClearMultiSelect?: () => void;
}

export const LiveTrackingSidebar: React.FC<Props> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  isCollapsed,
  onToggleCollapse,
  followingVehicleId,
  multiSelectedIds = [],
  onToggleMultiSelect,
  onSelectAll,
  onClearMultiSelect
}) => {
  if (isCollapsed) {
    return (
      <div className="hidden md:flex flex-col items-center py-4 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl w-12 z-20 space-y-4">
        <button
          onClick={onToggleCollapse}
          title="Perluas Daftar Kendaraan"
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="writing-mode-vertical text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold">
          Armada ({vehicles.length})
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl w-full md:w-84 h-[300px] md:h-full z-20 shadow-2xl overflow-hidden transition-all">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white tracking-wide uppercase">
              Armada Terpantau ({vehicles.length})
            </h2>
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden md:block p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Ciutkan Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Multi-Selection Control Bar */}
        {onToggleMultiSelect && (
          <div className="flex items-center justify-between text-[11px] font-mono pt-1">
            <span className="text-slate-400">
              {multiSelectedIds.length > 0 ? (
                <span className="text-cyan-300 font-bold">{multiSelectedIds.length} terpilih</span>
              ) : (
                'Multi-seleksi'
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAll}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
              >
                Pilih Semua
              </button>
              {multiSelectedIds.length > 0 && (
                <button
                  onClick={onClearMultiSelect}
                  className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Cards List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
            <Search className="h-8 w-8 text-slate-600" />
            <p className="text-xs">Tidak ada kendaraan yang sesuai kriteria filter.</p>
          </div>
        ) : (
          vehicles.map((v) => {
            const isSelected = selectedVehicleId === v.vehicleId;
            const isMultiSelected = multiSelectedIds.includes(v.vehicleId);
            const isFollowing = followingVehicleId === v.vehicleId;

            return (
              <div
                key={v.vehicleId}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected || isMultiSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
                onClick={() => onSelectVehicle(v.vehicleId)}
              >
                {/* Top Row: Checkbox, Plate, Alert, Following, Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {onToggleMultiSelect && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMultiSelect(v.vehicleId);
                        }}
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {isMultiSelected ? (
                          <CheckSquare className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-600" />
                        )}
                      </button>
                    )}

                    <span className="text-xs font-mono font-bold text-white bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                      {v.vehiclePlate}
                    </span>

                    {isFollowing && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-1.5 py-0.2 rounded animate-pulse">
                        <Radio className="h-2.5 w-2.5" />
                        FOLLOW
                      </span>
                    )}

                    {(v.hasActiveAlert || v.status === 'Emergency') && (
                      <span className="text-rose-400 animate-bounce" title={v.alertMessage || 'Emergency Alert!'}>
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadgeStyle(v.status)}`}>
                    ● {v.status}
                  </span>
                </div>

                {/* Driver & Speed Row */}
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[150px]">
                    <User className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="truncate text-slate-300 font-medium">{v.driverName || 'Tanpa Driver'}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono font-bold text-cyan-300">
                    <Gauge className="h-3 w-3 text-cyan-400" />
                    <span>{Math.round(v.speed)} km/h</span>
                    <span
                      style={{ transform: `rotate(${v.heading}deg)` }}
                      className="inline-block transition-transform duration-300 ml-0.5 text-cyan-400"
                    >
                      ▲
                    </span>
                  </div>
                </div>

                {/* Telemetry Summary Bar: Fuel, Temp/Engine, Group */}
                <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 border-t border-slate-800/60 pt-1.5">
                  <div className="flex items-center gap-1">
                    <Fuel className="h-2.5 w-2.5 text-amber-400 shrink-0" />
                    <span>{v.fuelLevelPercent || 80}%</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {v.cargoTemperature !== null && v.cargoTemperature !== undefined ? (
                      <>
                        <Thermometer className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                        <span className="text-cyan-300">{v.cargoTemperature}°C</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                        <span>{v.ignition ? 'Eng ON' : 'Eng OFF'}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1 text-slate-500">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{getRelativeTime(v.lastSeenAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case 'Moving': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'Parking':
    case 'Stopped': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    case 'Idle': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    case 'Emergency': return 'bg-rose-500/30 text-rose-300 border-rose-500/60 animate-pulse';
    case 'Maintenance': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    case 'Offline': return 'bg-slate-700/50 text-slate-400 border-slate-600';
    default: return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}

function getRelativeTime(isoString: string): string {
  try {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diffSec < 10) return '3s lalu';
    if (diffSec < 60) return `${diffSec}s lalu`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m lalu`;
    return `${Math.floor(diffSec / 3600)}j lalu`;
  } catch {
    return 'Baru saja';
  }
}
