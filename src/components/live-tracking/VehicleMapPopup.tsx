/**
 * Fleet Intelligence Smart AI - Vehicle Telematics Live Map Popup Card & Bottom Sheet
 * Desktop Card / Mobile Responsive Bottom Sheet with Action CTAs & Telemetry
 */

import React from 'react';
import { 
  X, 
  Truck, 
  User, 
  Gauge, 
  Navigation, 
  Zap, 
  Wifi, 
  Clock, 
  Fuel, 
  BatteryCharging, 
  ShieldAlert, 
  Radio, 
  ExternalLink,
  History,
  Phone,
  Building2,
  Cpu
} from 'lucide-react';
import { MapVehicle } from '../../modules/maps/types';

interface Props {
  vehicle: MapVehicle | null;
  onClose: () => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onNavigateVehicle: (vehicleId: string) => void;
  onNavigateDriver: (driverId: string) => void;
  onNavigateHistory: (vehicleId: string) => void;
}

export const VehicleMapPopup: React.FC<Props> = ({
  vehicle,
  onClose,
  isFollowing,
  onToggleFollow,
  onNavigateVehicle,
  onNavigateDriver,
  onNavigateHistory
}) => {
  if (!vehicle) return null;

  const cardinalDir = getCardinalDirection(vehicle.heading);
  const timeAge = getRelativeAge(vehicle.lastSeenAt);

  return (
    <div className="fixed md:absolute bottom-0 md:bottom-6 right-0 md:right-6 left-0 md:left-auto z-30 w-full md:w-[380px] p-2 md:p-0 animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-100 space-y-3">
        {/* Header Title & Close Button */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                  {vehicle.vehiclePlate}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadgeStyle(vehicle.status)}`}>
                  ● {vehicle.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{vehicle.vehicleName} • {vehicle.groupName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Active Alert Banner if Present */}
        {vehicle.hasActiveAlert && (
          <div className="bg-rose-950/80 border border-rose-500/60 rounded-xl p-2.5 flex items-center gap-2 text-xs text-rose-200 shadow-md">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 animate-bounce" />
            <div className="truncate flex-1">
              <span className="font-bold text-rose-300 block capitalize">{vehicle.alertCategory || 'Active Alert'}</span>
              <span className="text-[11px] text-rose-200/80 truncate block">{vehicle.alertMessage || 'Peringatan telematika terdeteksi!'}</span>
            </div>
          </div>
        )}

        {/* Driver Section */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {vehicle.driverPhoto ? (
              <img src={vehicle.driverPhoto} alt={vehicle.driverName} className="h-9 w-9 rounded-full object-cover border border-slate-700" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                <User className="h-4 w-4" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-white block">{vehicle.driverName || 'Tanpa Driver'}</span>
              <span className="text-[10px] font-mono text-slate-400">{vehicle.driverPhone || 'ID: ' + (vehicle.driverId || '-')}</span>
            </div>
          </div>

          {vehicle.driverScore !== undefined && (
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Behavior Score</span>
              <span className={`text-xs font-bold ${vehicle.driverScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {vehicle.driverScore}/100
              </span>
            </div>
          )}
        </div>

        {/* Live Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Gauge className="h-3 w-3 text-cyan-400" /> Kecepatan
            </span>
            <div className="text-sm font-bold text-cyan-300">
              {vehicle.speed} <span className="text-[10px] text-slate-400">km/h</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Navigation className="h-3 w-3 text-cyan-400" /> Arah Kompas
            </span>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span style={{ transform: `rotate(${vehicle.heading}deg)` }} className="inline-block transition-transform">
                ↑
              </span>
              <span>{cardinalDir} ({vehicle.heading}°)</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" /> Ignition / Kontak
            </span>
            <div className={`text-xs font-bold ${vehicle.ignition ? 'text-emerald-400' : 'text-slate-400'}`}>
              {vehicle.ignition ? 'ON (Nyala)' : 'OFF (Mati)'}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Wifi className="h-3 w-3 text-emerald-400" /> Sinyal GPS
            </span>
            <div className="text-xs font-bold text-emerald-400">
              {vehicle.gpsSignal} (±{vehicle.accuracy || 8}m)
            </div>
          </div>
        </div>

        {/* Secondary Diagnostics */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1" title="Sisa Bahan Bakar">
            <Fuel className="h-3 w-3 text-amber-400" />
            <span>BBM {vehicle.fuelLevelPercent || 80}%</span>
          </div>
          <div className="flex items-center gap-1" title="Tegangan Aki/Baterai">
            <BatteryCharging className="h-3 w-3 text-cyan-400" />
            <span>Aki {vehicle.batteryVoltage || 12.8}V</span>
          </div>
          <div className="flex items-center gap-1" title="Odometer Kendaraan">
            <Cpu className="h-3 w-3 text-purple-400" />
            <span>{(vehicle.odometerKm || 124500).toLocaleString('id-ID')} km</span>
          </div>
        </div>

        {/* Last Timestamp Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
          <span>IMEI: ••••••••{vehicle.imei?.slice(-4) || '1234'}</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="h-3 w-3 text-cyan-400" />
            Update: {timeAge}
          </span>
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 pt-1">
          <button
            onClick={onToggleFollow}
            className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
              isFollowing
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-950'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>{isFollowing ? 'Following' : 'Track'}</span>
          </button>

          <button
            onClick={() => onNavigateVehicle(vehicle.vehicleId)}
            className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Vehicle</span>
          </button>

          <button
            onClick={() => vehicle.driverId && onNavigateDriver(vehicle.driverId)}
            disabled={!vehicle.driverId}
            className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            <span>Driver</span>
          </button>

          <button
            onClick={() => onNavigateHistory(vehicle.vehicleId)}
            className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <History className="h-3.5 w-3.5" />
            <span>History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case 'Moving': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'Stopped': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    case 'Idle': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    default: return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}

function getCardinalDirection(heading: number): string {
  const norm = ((heading % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) return 'Utara (N)';
  if (norm >= 22.5 && norm < 67.5) return 'Timur Laut (NE)';
  if (norm >= 67.5 && norm < 112.5) return 'Timur (E)';
  if (norm >= 112.5 && norm < 157.5) return 'Tenggara (SE)';
  if (norm >= 157.5 && norm < 202.5) return 'Selatan (S)';
  if (norm >= 202.5 && norm < 247.5) return 'Barat Daya (SW)';
  if (norm >= 247.5 && norm < 292.5) return 'Barat (W)';
  return 'Barat Laut (NW)';
}

function getRelativeAge(isoString: string): string {
  try {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
    if (diffSec < 5) return '3 dtk lalu';
    if (diffSec < 60) return `${diffSec} dtk lalu`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`;
    return `${Math.floor(diffSec / 3600)} jam lalu`;
  } catch {
    return 'Terbaru';
  }
}
