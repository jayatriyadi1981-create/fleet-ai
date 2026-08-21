import React, { useState } from 'react';
import { BusTrip } from '../../../modules/bus/types';
import { 
  MapPin, 
  Bus, 
  Gauge, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Compass,
  Radio
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
}

export const BusLiveTrackingTab: React.FC<Props> = ({ trips = [] }) => {
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(() => trips[0] || null);

  React.useEffect(() => {
    if ((!selectedTrip || !trips.some(t => t.id === selectedTrip.id)) && trips.length > 0) {
      setSelectedTrip(trips[0]);
    }
  }, [trips, selectedTrip]);

  const activeTrip = selectedTrip || trips[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-600 animate-pulse" />
            Live GPS Telematika Bus & Speed Radar Tol Trans-Jawa
          </h3>
          <p className="text-xs text-slate-500">Pelacakan satelit GPS waktu-nyata posisi bus di jalan tol, kecepatan laju, dan geofence terminal</p>
        </div>

        {trips.length > 0 && (
          <select 
            value={activeTrip?.id || ''}
            onChange={(e) => {
              const found = trips.find(t => t.id === e.target.value);
              if (found) setSelectedTrip(found);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>
                {t.busPlateNumber} ({t.busName}) - {t.routeName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Grid: Interactive Map Simulation & Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Simulated GPS Radar Map Canvas */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg space-y-4 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
          {/* Top telemetry overlay */}
          <div className="flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-black tracking-wide">{activeTrip?.busPlateNumber || 'B 7123 SGA'}</div>
                <div className="text-xs text-slate-400 font-medium">{activeTrip?.busName || 'Sinar Jaya Suites'} • {activeTrip?.chassisType || 'Mercedes-Benz OH 1626'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-400">GPS ONLINE 4G LTE</span>
              </div>
            </div>
          </div>

          {/* Center Map Graphic Representation */}
          <div className="my-auto py-8 text-center space-y-4 z-10">
            <div className="inline-flex items-center justify-center p-4 bg-slate-900/80 rounded-full border border-slate-700 shadow-2xl relative">
              <Compass className="w-12 h-12 text-blue-500 animate-spin" style={{ animationDuration: '20s' }} />
              <MapPin className="w-6 h-6 text-rose-500 absolute" />
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Posisi Bus Saat Ini:</div>
              <div className="text-lg font-bold text-white mt-0.5">{activeTrip?.currentLocationName || activeTrip?.departureTerminal || 'Tol Cipali KM 102'}</div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                Lat: {activeTrip?.currentCoordinates?.lat || -6.8214}, Lng: {activeTrip?.currentCoordinates?.lng || 108.7901}
              </div>
            </div>

            {/* Speedometer indicator */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-900/90 rounded-2xl border border-slate-800">
              <Gauge className="w-5 h-5 text-sky-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Kecepatan GPS</div>
                <div className="text-xl font-mono font-black text-sky-400">
                  {activeTrip?.currentSpeedKmH || 88} <span className="text-xs font-normal text-slate-400">km/jam</span>
                </div>
              </div>
              <div className="text-left pl-3 border-l border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Batas Speed</div>
                <div className="text-xs font-bold text-emerald-400">Maks 100 km/j</div>
              </div>
            </div>
          </div>

          {/* Bottom Route Progress */}
          <div className="z-10 p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Asal: <strong>{activeTrip?.departureTerminal || 'Terminal Pulo Gebang'}</strong></span>
              <span className="text-emerald-400 font-bold">Tujuan: {activeTrip?.arrivalTerminal || 'Terminal Bungurasih Surabaya'}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full w-[65%]" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Berangkat: {activeTrip?.departureTime || '07:30'} WIB</span>
              <span>Estimasi Tiba: {activeTrip?.estimatedArrivalTime || '17:45'} WIB</span>
            </div>
          </div>
        </div>

        {/* Right Col: Kru & Telematics Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Sensor & Telematika Kendaraan</h4>
            <p className="text-xs text-slate-500">Parameter mekanikal dan keselamatan armada</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500">Status Mesin & ECU:</span>
              <strong className="text-emerald-600 font-bold">Normal (RPM 1.650)</strong>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500">Suhu Air Radiator / Mesin:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">88°C (Optimal)</strong>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500">Tekanan Angin Rem (Air Brake):</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">9.2 Bar (Aman)</strong>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500">Suspensi Udara (Air Suspension):</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">Terkalibrasi Level 1</strong>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500">Supir Bertugas (Driver 1):</span>
              <strong className="text-blue-600 font-bold">{activeTrip?.primaryDriverName || 'Bambang Sudiro'}</strong>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-300">
            <strong>Geofence Warning:</strong> Bus terdeteksi berada di jalur resmi koridor Tol Trans-Jawa KM 208 tanpa deviasi rute.
          </div>
        </div>
      </div>
    </div>
  );
};
