/**
 * Fleet Intelligence Smart AI - Interactive Rent Car Telematics & Geofence Map
 */

import React, { useState } from 'react';
import { RentalVehicle } from '../../modules/rent-car/types';
import { 
  MapPin, 
  Car, 
  Navigation, 
  ShieldAlert, 
  Layers, 
  Zap, 
  Lock, 
  Unlock, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter
} from 'lucide-react';

interface RentCarMapProps {
  vehicles: RentalVehicle[];
  selectedVehicle?: RentalVehicle;
  onSelectVehicle: (vehicle: RentalVehicle) => void;
  onOpenImmobilizerModal: (vehicle: RentalVehicle) => void;
}

export const RentCarMap: React.FC<RentCarMapProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  onOpenImmobilizerModal
}) => {
  const [activeZoneOverlay, setActiveZoneOverlay] = useState<boolean>(true);
  const [filterRentedOnly, setFilterRentedOnly] = useState<boolean>(false);

  const displayVehicles = filterRentedOnly 
    ? vehicles.filter((v) => v.status === 'rented' || v.status === 'overdue')
    : vehicles;

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Active Telematics Summary */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white">Live Rental Telematics</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono">
            <strong className="text-cyan-400">{vehicles.filter(v => v.status === 'rented').length}</strong> In-Transit
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono">
            <strong className="text-emerald-400">{vehicles.filter(v => v.status === 'available').length}</strong> Ready di Pool
          </span>
        </div>

        {/* Right Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Toggle Zone Boundary */}
          <button
            onClick={() => setActiveZoneOverlay(!activeZoneOverlay)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 ${
              activeZoneOverlay 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Zona Operasional</span>
          </button>

          {/* Filter Rented Only */}
          <button
            onClick={() => setFilterRentedOnly(!filterRentedOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 ${
              filterRentedOnly 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Hanya Sedang Jalan</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Background (Stylized High-Contrast Dark Map Grid with Simulated Roads & Geofence Corridor) */}
      <div className="relative flex-1 bg-[#0b1120] overflow-hidden flex items-center justify-center select-none">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 80px 80px, 80px 80px'
          }}
        />

        {/* Vector Arterials & Highways Representation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800/80" strokeWidth="2" fill="none">
          {/* Main Trans-Java Express Toll Corridor */}
          <path d="M -50 350 Q 250 200, 500 260 T 950 240 T 1400 320" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
          <path d="M 120 -20 Q 300 220, 520 280 T 800 480" stroke="#334155" strokeWidth="2" opacity="0.5" />
          <path d="M 400 50 Q 600 240, 750 300 T 1200 400" stroke="#334155" strokeWidth="2" opacity="0.5" />
        </svg>

        {/* Geofence Perimeter Polygons Overlay */}
        {activeZoneOverlay && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Jabodetabek Perimeter Zone */}
            <div className="absolute top-[18%] left-[22%] w-[280px] h-[220px] rounded-3xl border-2 border-dashed border-cyan-500/40 bg-cyan-500/5 backdrop-blur-[1px] flex items-start justify-end p-2.5">
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
                GEOFENCE: JABODETABEK METRO
              </span>
            </div>

            {/* Bali Tourist Perimeter Zone */}
            <div className="absolute bottom-[15%] right-[15%] w-[240px] h-[190px] rounded-3xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 backdrop-blur-[1px] flex items-start justify-end p-2.5">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                GEOFENCE: BALI ISLAND
              </span>
            </div>
          </div>
        )}

        {/* Render Rental Vehicle Live Pins */}
        {displayVehicles.map((vehicle, idx) => {
          // Dynamic positions for simulated spatial layout
          const positions = [
            { top: '32%', left: '34%' }, // Innova Zenix Sudirman
            { top: '24%', left: '28%' }, // Alphard Monas
            { top: '72%', left: '80%' }, // Ioniq 5 Bali
            { top: '48%', left: '46%' }, // Fortuner Overdue Bandung
            { top: '20%', left: '24%' }, // Avanza Pool Soetta
            { top: '55%', left: '65%' }, // Pajero Juanda Sby
            { top: '22%', left: '26%' }, // HiAce Pool Soetta
            { top: '36%', left: '30%' }, // HR-V Bengkel
          ];

          const pos = positions[idx % positions.length];
          const isSelected = selectedVehicle?.id === vehicle.id;
          const isOverdue = vehicle.status === 'overdue';
          const isRented = vehicle.status === 'rented';
          const isImmobilized = vehicle.remoteImmobilizerStatus === 'locked';

          return (
            <div
              key={vehicle.id}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => onSelectVehicle(vehicle)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-transform hover:scale-110"
            >
              {/* Ripple Effect for Moving Rented Vehicles */}
              {isRented && (
                <span className="animate-ping absolute -inset-2 rounded-full bg-cyan-400 opacity-40"></span>
              )}
              {isOverdue && (
                <span className="animate-ping absolute -inset-3 rounded-full bg-rose-500 opacity-60"></span>
              )}

              {/* Pin Bubble */}
              <div className={`relative px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl transition-all border ${
                isSelected
                  ? 'bg-cyan-400 text-slate-950 font-bold border-white scale-110'
                  : isOverdue
                    ? 'bg-rose-600 text-white font-bold border-rose-400 animate-bounce'
                    : isImmobilized
                      ? 'bg-rose-950 text-rose-300 border-rose-500'
                      : isRented
                        ? 'bg-slate-900 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 text-emerald-400 border-slate-700'
              }`}>
                {isImmobilized ? (
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                ) : isOverdue ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Car className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px] font-mono font-bold tracking-tight">
                  {vehicle.plateNumber}
                </span>
                {isRented && (
                  <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300">
                    {vehicle.location.speed} km/h
                  </span>
                )}
              </div>

              {/* Tooltip on Hover */}
              <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2.5 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-200 text-[11px] shadow-2xl z-30 pointer-events-none">
                <div className="font-bold text-white">{vehicle.brand} {vehicle.model}</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{vehicle.location.address}</div>
                <div className="mt-1.5 flex items-center justify-between border-t border-slate-800 pt-1 text-[10px] text-slate-400 font-mono">
                  <span>Status: <strong className="text-white capitalize">{vehicle.status}</strong></span>
                  <span>BBM: <strong className="text-amber-400">{vehicle.fuelLevelPercent}%</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vehicle Quick Telematics Footer Dock */}
      {selectedVehicle && (
        <div className="bg-slate-900 border-t border-slate-800 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs z-10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono font-bold text-[11px]">
                  {selectedVehicle.plateNumber}
                </span>
                <span className="capitalize text-[11px] text-slate-400">({selectedVehicle.status})</span>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate max-w-[320px]">{selectedVehicle.location.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Starter Kill Quick Action */}
            <button
              onClick={() => onOpenImmobilizerModal(selectedVehicle)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedVehicle.remoteImmobilizerStatus === 'locked'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              {selectedVehicle.remoteImmobilizerStatus === 'locked' ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Starter Mesin</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Remote Starter Kill</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
