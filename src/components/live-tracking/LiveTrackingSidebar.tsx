/**
 * Fleet Intelligence Smart AI - Live Tracking Vehicle List Sidebar
 * Desktop Collapsible / Mobile Bottom Sheet Vehicle Navigator
 */

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MapPin, 
  User, 
  Navigation, 
  Gauge, 
  ShieldAlert,
  Radio,
  Clock
} from 'lucide-react';
import { MapVehicle } from '../../modules/maps/types';

interface Props {
  vehicles: MapVehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  followingVehicleId: string | null;
}

export const LiveTrackingSidebar: React.FC<Props> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  isCollapsed,
  onToggleCollapse,
  followingVehicleId
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
          Kendaraan ({vehicles.length})
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl w-full md:w-80 h-[280px] md:h-full z-20 shadow-2xl overflow-hidden transition-all">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white tracking-wide uppercase">
            Daftar Armada ({vehicles.length})
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

      {/* Vehicle Cards List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
            <Search className="h-8 w-8 text-slate-600" />
            <p className="text-xs">Tidak ada kendaraan yang sesuai filter.</p>
          </div>
        ) : (
          vehicles.map((v) => {
            const isSelected = selectedVehicleId === v.vehicleId;
            const isFollowing = followingVehicleId === v.vehicleId;

            let statusBadge = 'bg-slate-800 text-slate-300 border-slate-700';
            if (v.status === 'Moving') statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            else if (v.status === 'Stopped') statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
            else if (v.status === 'Idle') statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

            return (
              <div
                key={v.vehicleId}
                onClick={() => onSelectVehicle(v.vehicleId)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                      {v.vehiclePlate}
                    </span>

                    {isFollowing && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-1.5 py-0.2 rounded animate-pulse">
                        <Radio className="h-2.5 w-2.5" />
                        FOLLOWING
                      </span>
                    )}

                    {v.hasActiveAlert && (
                      <span className="text-rose-400 animate-bounce" title={v.alertMessage}>
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                    {v.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[160px]">
                    <User className="h-3 w-3 text-slate-500" />
                    <span className="truncate">{v.driverName || 'Tanpa Driver'}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono font-bold text-slate-200">
                    <Gauge className="h-3 w-3 text-cyan-400" />
                    <span>{v.speed} km/h</span>
                    <span
                      style={{ transform: `rotate(${v.heading}deg)` }}
                      className="inline-block transition-transform duration-300 ml-0.5"
                    >
                      ↑
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-1.5">
                  <span className="truncate">{v.groupName}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-2.5 w-2.5" />
                    {getRelativeTime(v.lastSeenAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

function getRelativeTime(isoString: string): string {
  try {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diffSec < 10) return 'Baru saja';
    if (diffSec < 60) return `${diffSec} dtk lalu`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`;
    return `${Math.floor(diffSec / 3600)} jam lalu`;
  } catch {
    return 'Terbaru';
  }
}
