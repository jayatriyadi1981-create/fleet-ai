import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { Vehicle, Location } from '../../types';
import { getVehicleStatusBadge } from '../common/Badge';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Radio, 
  Fuel, 
  Gauge, 
  User, 
  Navigation,
  ShieldAlert,
  X
} from 'lucide-react';

interface TelematicsMapProps {
  heightClassName?: string;
}

export const TelematicsMap: React.FC<TelematicsMapProps> = ({ heightClassName = 'h-[500px] lg:h-[650px]' }) => {
  const { vehicles, selectedVehicle, setSelectedVehicle, geofences, trips } = useFleet();

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGeofences, setShowGeofences] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  // Map projection logic (Jabodetabek / Jawa Focus)
  // Reference center: -6.2200, 106.9000
  const centerLat = -6.2200;
  const centerLng = 106.9000;

  const projectCoords = (loc: Location) => {
    // Convert lat/lng to SVG percentage coordinates
    const scale = 250 * zoom;
    const x = 50 + (loc.lng - centerLng) * scale + pan.x;
    const y = 50 + (centerLat - loc.lat) * scale + pan.y;
    return { x: `${x}%`, y: `${y}%`, pxX: x, pxY: y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl ${heightClassName}`}>
      {/* Map Header / Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2 backdrop-blur-md">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.3, 3))}
          className="rounded-lg bg-slate-800 p-1.5 text-slate-200 hover:bg-slate-700"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.3, 0.6))}
          className="rounded-lg bg-slate-800 p-1.5 text-slate-200 hover:bg-slate-700"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={resetView}
          className="rounded-lg bg-slate-800 p-1.5 text-slate-200 hover:bg-slate-700"
          title="Reset Center"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 my-auto" />

        {/* Layers Toggle */}
        <button
          onClick={() => setShowGeofences(!showGeofences)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            showGeofences ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Geofence</span>
        </button>

        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            showRoutes ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Rute Trip</span>
        </button>
      </div>

      {/* Realtime Live Pulse Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md">
        <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
        <span>Live Telemetry Engine ({vehicles.length} Units)</span>
      </div>

      {/* Vector Interactive Map Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative h-full w-full cursor-grab active:cursor-grabbing select-none overflow-hidden bg-[#0a0f1d]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 80%),
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      >
        {/* Render Roads / Routes Simulation Lines */}
        {showRoutes && (
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
            {/* Tol Jakarta - Cikampek Route Line */}
            <path
              d="M 20% 35% Q 40% 45% 75% 70%"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="3"
              strokeDasharray="6,6"
              className="opacity-60 animate-pulse"
            />
            {/* Cikarang - Karawang Extension */}
            <path
              d="M 75% 70% Q 82% 75% 90% 85%"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              className="opacity-50"
            />
          </svg>
        )}

        {/* Render Geofence Overlays */}
        {showGeofences &&
          geofences.map((geo) => {
            if (!geo.coordinates || geo.coordinates.length === 0) return null;
            const projected = geo.coordinates.map((c) => projectCoords(c));
            const pointsString = projected.map((p) => `${p.pxX}%,${p.pxY}%`).join(' ');

            return (
              <div key={geo.id} className="absolute inset-0 pointer-events-none z-0">
                <svg className="h-full w-full">
                  <polygon
                    points={projected.map((p) => `${parseFloat(p.x) * 10},${parseFloat(p.y) * 10}`).join(' ')}
                    fill={geo.color}
                    fillOpacity="0.15"
                    stroke={geo.color}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                </svg>
              </div>
            );
          })}

        {/* Render Vehicle Markers */}
        {vehicles.map((v) => {
          if (!v.latestTelemetry) return null;
          const pos = projectCoords(v.latestTelemetry.location);
          const isSelected = selectedVehicle?.id === v.id;

          const getStatusBg = () => {
            switch (v.status) {
              case 'moving': return 'bg-emerald-500 shadow-emerald-500/50';
              case 'idle': return 'bg-amber-500 shadow-amber-500/50';
              case 'parking': return 'bg-sky-500 shadow-sky-500/50';
              case 'emergency': return 'bg-rose-500 shadow-rose-500/50 animate-bounce';
              default: return 'bg-slate-500';
            }
          };

          return (
            <div
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              style={{ left: pos.x, top: pos.y }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
            >
              <div className="relative group flex flex-col items-center">
                {/* Heading compass arrow indicator */}
                <div
                  style={{ transform: `rotate(${v.latestTelemetry.location.heading || 0}deg)` }}
                  className="mb-1 text-cyan-400"
                >
                  <Navigation className="h-3 w-3" />
                </div>

                {/* Marker Pin Ring */}
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white font-bold text-[10px] shadow-lg transition-transform ${getStatusBg()} ${
                    isSelected ? 'scale-125 ring-4 ring-cyan-400/80 z-30' : 'hover:scale-110'
                  }`}
                >
                  {v.plateNumber.slice(-3)}
                </div>

                {/* Badge Label */}
                <span className="mt-1 whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow border border-slate-800">
                  {v.plateNumber} ({v.latestTelemetry.location.speed || 0} km/h)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vehicle Overlay Detail Card */}
      {selectedVehicle && selectedVehicle.latestTelemetry && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 z-30 w-full md:w-96 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedVehicle.plateNumber}</h3>
                {getVehicleStatusBadge(selectedVehicle.status)}
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                {selectedVehicle.brand} {selectedVehicle.model} • {selectedVehicle.groupName}
              </p>
            </div>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-2 border border-slate-800">
              <Gauge className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-[10px] text-slate-400">Kecepatan</p>
                <p className="font-bold text-white">{selectedVehicle.latestTelemetry.location.speed || 0} KM/Jam</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-2 border border-slate-800">
              <Fuel className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400">Level BBM</p>
                <p className="font-bold text-white">
                  {selectedVehicle.latestTelemetry.fuelLevelPercent}% ({selectedVehicle.latestTelemetry.fuelLevelLiters} L)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2.5 rounded-lg bg-slate-800/40 p-2 text-xs text-slate-300 border border-slate-800/60">
            <p className="text-[10px] text-slate-400 font-medium">Lokasi Terakhir:</p>
            <p className="mt-0.5 font-semibold text-white leading-snug">
              {selectedVehicle.latestTelemetry.location.address || 'Dalam perjalanan'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
