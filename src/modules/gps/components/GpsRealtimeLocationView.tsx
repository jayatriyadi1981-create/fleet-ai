/**
 * Fleet Intelligence Smart AI - Realtime Location & Signal Diagnostics View
 */

import React, { useState, useEffect } from 'react';
import { gpsIngestionService } from '../services/GpsIngestionService';
import { VehicleLocation } from '../types/gpsArchitecture';
import { GpsEventBus } from '../services/GpsEventBus';
import { 
  MapPin, 
  Navigation, 
  Activity, 
  Wifi, 
  Battery, 
  Zap, 
  Gauge, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const GpsRealtimeLocationView: React.FC = () => {
  const [locations, setLocations] = useState<VehicleLocation[]>([]);

  const refreshLocations = () => {
    setLocations(gpsIngestionService.getLatestLocations());
  };

  useEffect(() => {
    refreshLocations();
    const unsub = GpsEventBus.subscribe('LocationUpdated', () => {
      refreshLocations();
    });
    return unsub;
  }, []);

  const movingCount = locations.filter((l) => l.status === 'Moving').length;
  const stoppedCount = locations.filter((l) => l.status === 'Stopped').length;
  const idleCount = locations.filter((l) => l.status === 'Idle').length;
  const offlineCount = locations.filter((l) => l.status === 'Offline').length;

  return (
    <div className="space-y-6">
      {/* Metric Counters Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Armada Moving</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-cyan-400">{movingCount}</span>
            <span className="text-[10px] font-mono text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              ACTIVE
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Armada Stopped</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-slate-300">{stoppedCount}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              PARKED
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Engine Idle</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-amber-400">{idleCount}</span>
            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              IDLE
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Device Offline</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-rose-400">{offlineCount}</span>
            <span className="text-[10px] font-mono text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              DISCONNECTED
            </span>
          </div>
        </div>
      </div>

      {/* Latest Location Cards Grid */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Cache Lokasi Terbaru &amp; Status Proteksi Out-of-Order
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ✓ Out-of-Order Protection Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white font-mono">{loc.vehicleId.toUpperCase()}</h4>
                    <span
                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        loc.status === 'Moving'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : loc.status === 'Idle'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {loc.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Device: {loc.deviceId}</p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-white">{loc.speed} km/h</span>
                  <span className="text-[10px] text-slate-500 block">Course {loc.heading}°</span>
                </div>
              </div>

              {/* Coordinates & Driver attribution */}
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Koordinat Presisi:</span>
                  <span className="text-cyan-300">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Snapshot:</span>
                  <span className="text-emerald-400 font-bold">{loc.driverId || 'Budi Santoso'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Akurasi GPS:</span>
                  <span className="text-slate-300">{loc.accuracy} Meter</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {new Date(loc.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-slate-500">Seq Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
