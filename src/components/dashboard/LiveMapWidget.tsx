/**
 * Fleet Intelligence Smart AI - Live Fleet Map Preview Widget
 * PROMPT 8 - Interactive Telematics GPS Map Preview with MapProvider Abstraction
 */

import React, { useState } from 'react';
import { TelematicsMap } from '../maps/TelematicsMap';
import { 
  Navigation, 
  ExternalLink, 
  Radio, 
  MapPin, 
  Truck, 
  User, 
  Gauge, 
  Clock, 
  CheckCircle2,
  X
} from 'lucide-react';
import { MapPreviewVehicle } from '../../types/dashboard';
import { useFleet } from '../../context/FleetContext';

interface LiveMapWidgetProps {
  vehicles: MapPreviewVehicle[];
  isLoading: boolean;
  onOpenFullMap: () => void;
  onSelectVehicle?: (vehicleId: string) => void;
}

export const LiveMapWidget: React.FC<LiveMapWidgetProps> = ({
  vehicles,
  isLoading,
  onOpenFullMap,
  onSelectVehicle,
}) => {
  const { setSelectedVehicle, vehicles: allVehicles } = useFleet();
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(vehicles[0]?.id || null);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  const handleSelectVehicleClick = (v: MapPreviewVehicle) => {
    const fullVehicle = allVehicles.find((veh) => veh.id === v.id);
    if (fullVehicle) {
      setSelectedVehicle(fullVehicle);
    }
    if (onSelectVehicle) {
      onSelectVehicle(v.id);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Widget Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Live Fleet GPS Tracking</h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                <Radio className="h-3 w-3 animate-pulse" />
                Live ● Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Monitoring posisi real-time armada telematika di seluruh Indonesia</p>
          </div>
        </div>

        <button
          id="btn-open-full-map"
          onClick={onOpenFullMap}
          className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
        >
          <span>Open Full Map</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800">
        <TelematicsMap heightClassName="h-[360px]" />

        {/* Floating Quick Vehicle Info Popup Card */}
        {activeVehicle && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-3 sm:right-auto sm:max-w-xs z-10 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="font-black text-white">{activeVehicle.plateNumber}</p>
                  <p className="text-[10px] text-slate-400">{activeVehicle.brandModel}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                activeVehicle.status === 'moving' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                activeVehicle.status === 'idle' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-slate-800 text-slate-300'
              }`}>
                {activeVehicle.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{activeVehicle.driverName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Gauge className="h-3.5 w-3.5 text-slate-400" />
                <span>{activeVehicle.speedKmH} km/h</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-slate-300 truncate">
                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{activeVehicle.locationName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-cyan-400" />
                {activeVehicle.lastUpdatedText}
              </span>
              <button
                onClick={() => handleSelectVehicleClick(activeVehicle)}
                className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                [ View Vehicle Details ]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Quick Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 shrink-0">Pilih Unit:</span>
        {vehicles.slice(0, 6).map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVehicleId(v.id)}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
              v.id === activeVehicleId
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {v.plateNumber}
          </button>
        ))}
      </div>
    </div>
  );
};
