import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  Navigation, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Radio, 
  Compass,
  AlertTriangle,
  Search,
  Maximize2
} from 'lucide-react';
import { LogisticsOrder, LogisticsManifest } from '../../../modules/logistics/types';

interface Props {
  manifests: LogisticsManifest[];
  orders: LogisticsOrder[];
}

export const LogisticsLiveTrackingTab: React.FC<Props> = ({ manifests = [], orders = [] }) => {
  const [selectedManifest, setSelectedManifest] = useState<LogisticsManifest | null>(() => manifests[0] || null);

  // Sync if manifests load or change
  React.useEffect(() => {
    if ((!selectedManifest || !manifests.some(m => m.id === selectedManifest.id)) && manifests.length > 0) {
      setSelectedManifest(manifests[0]);
    }
  }, [manifests, selectedManifest]);

  const activeManifest = selectedManifest || manifests[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-rose-600" />
            Live GPS Tracking & Menara Kendali Kargo
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Telematika GPS real-time armada linehaul antar provinsi, kecepatan tronton, geofence hub, & estimasi ETA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live GPS Feed Connected
          </span>
        </div>
      </div>

      {/* Grid: Left List of Active Fleets + Right Live Map Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Fleet List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            Armada Linehaul Sedang Jalan ({manifests.length})
          </h3>

          <div className="space-y-3">
            {manifests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-700 rounded-xl">
                Tidak ada armada linehaul yang sedang aktif.
              </div>
            ) : (
              manifests.map((mnf) => (
                <div 
                  key={mnf.id}
                  onClick={() => setSelectedManifest(mnf)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 text-xs ${
                    activeManifest?.id === mnf.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 dark:border-blue-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{mnf.vehiclePlate}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      68 KM/H
                    </span>
                  </div>
                  <div className="text-slate-500">{mnf.originHubName?.split('(')[0] || 'Jakarta Hub'} ➔ {mnf.destinationHubName?.split('(')[0] || 'Bandung Hub'}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                    <span>Driver: {mnf.driverName}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">ETA 13:30 WIB</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Map Canvas Simulation */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative min-h-[420px] flex flex-col justify-between overflow-hidden shadow-xl">
          {/* Simulated Dark Map Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Map Top Floating Overlay */}
          <div className="flex items-center justify-between relative z-10">
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-xs flex items-center gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Armada Terpilih:</span>
                <span className="font-bold text-white">{activeManifest?.vehiclePlate || 'B 9900 UTT (Linehaul JKT-BDG)'}</span>
              </div>
              <div className="border-l border-slate-600 pl-3">
                <span className="text-slate-400 block text-[10px]">Segel Fisik:</span>
                <span className="font-mono font-bold text-emerald-400">{activeManifest?.sealNumber || 'SEAL-2026-JKT-889'}</span>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white cursor-pointer">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          {/* Map Center Animated Route Waypoint Simulation */}
          <div className="relative z-10 my-8 space-y-6 max-w-md mx-auto w-full">
            <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-emerald-400">Posisi GPS Terkini: Tol Cipularang KM 88</span>
                </div>
                <span className="text-slate-400 text-[11px]">Sinyal 4G/GPS Kuat</span>
              </div>

              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{activeManifest?.originHubName?.split('(')[0] || 'Jakarta Hub'} (KM 0)</span>
                <span className="font-bold text-white">65% Perjalanan</span>
                <span>{activeManifest?.destinationHubName?.split('(')[0] || 'Bandung Hub'} (KM 152)</span>
              </div>
            </div>
          </div>

          {/* Map Bottom Status Bar */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs relative z-10">
            <div className="flex items-center gap-2 text-slate-300">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span>Arah: Tenggara (142°) • Odometer: 84,210 KM</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <span>Suhu Muatan: <strong className="text-cyan-400">22°C (Ambient)</strong></span>
              <span>BBM Tersisa: <strong className="text-amber-400">74% (120 L)</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
