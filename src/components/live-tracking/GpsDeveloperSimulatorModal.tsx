/**
 * Fleet Intelligence Smart AI - GPS Developer Simulator Modal Console
 * Interactive Test Suite for Prompt 13 Live Telemetry Verification
 */

import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  Play, 
  Square, 
  Send, 
  Zap, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Gauge, 
  Navigation, 
  MapPin 
} from 'lucide-react';
import { liveTrackingService } from '../../modules/maps/services/liveTrackingService';
import { MapVehicle, LiveVehicleStatus } from '../../modules/maps/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehicles: MapVehicle[];
}

export const GpsDeveloperSimulatorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  vehicles
}) => {
  if (!isOpen) return null;

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.vehicleId || '');
  const targetVeh = vehicles.find((v) => v.vehicleId === selectedVehicleId) || vehicles[0];

  const [lat, setLat] = useState<number>(targetVeh?.latitude || -6.200000);
  const [lng, setLng] = useState<number>(targetVeh?.longitude || 106.816666);
  const [speed, setSpeed] = useState<number>(targetVeh?.speed || 62);
  const [heading, setHeading] = useState<number>(targetVeh?.heading || 90);
  const [status, setStatus] = useState<LiveVehicleStatus>(targetVeh?.status || 'Moving');
  const [ignition, setIgnition] = useState<boolean>(targetVeh?.ignition ?? true);
  const [isLoopActive, setIsLoopActive] = useState<boolean>(false);
  const [loopTimer, setLoopTimer] = useState<any>(null);

  const handleSendSinglePacket = () => {
    if (!selectedVehicleId) return;
    liveTrackingService.updateSingleVehicleTelemetry(selectedVehicleId, {
      latitude: Number(lat),
      longitude: Number(lng),
      speed: Number(speed),
      heading: Number(heading),
      status,
      ignition
    });
  };

  const handleToggleSimulationLoop = () => {
    if (isLoopActive) {
      clearInterval(loopTimer);
      setLoopTimer(null);
      setIsLoopActive(false);
    } else {
      setIsLoopActive(true);
      let currLat = Number(lat);
      let currLng = Number(lng);
      let currHead = Number(heading);

      const timer = setInterval(() => {
        currLat += (Math.random() * 0.002 - 0.001);
        currLng += (Math.random() * 0.002 - 0.001);
        currHead = (currHead + Math.floor(Math.random() * 10 - 5) + 360) % 360;

        setLat(Number(currLat.toFixed(6)));
        setLng(Number(currLng.toFixed(6)));
        setHeading(currHead);

        liveTrackingService.updateSingleVehicleTelemetry(selectedVehicleId, {
          latitude: currLat,
          longitude: currLng,
          speed: Number(speed),
          heading: currHead,
          status: 'Moving',
          ignition: true
        });
      }, 1500);

      setLoopTimer(timer);
    }
  };

  const handleTriggerOverspeed = () => {
    if (!selectedVehicleId) return;
    setSpeed(112);
    setStatus('Moving');
    liveTrackingService.updateSingleVehicleTelemetry(selectedVehicleId, {
      speed: 112,
      status: 'Moving',
      hasActiveAlert: true,
      alertCategory: 'speeding',
      alertMessage: 'Terdeteksi Overspeed 112 km/jam (Batas 80 km/jam)'
    });
  };

  const handleSimulateOffline = () => {
    if (!selectedVehicleId) return;
    setStatus('Offline');
    setSpeed(0);
    setIgnition(false);
    liveTrackingService.updateSingleVehicleTelemetry(selectedVehicleId, {
      status: 'Offline',
      speed: 0,
      ignition: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">GPS Telematics Developer Simulator</h3>
              <p className="text-[11px] text-slate-400">Pengujian Realtime Packet, Movements, &amp; Events (PROMPT 13)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Target Kendaraan</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              const vId = e.target.value;
              setSelectedVehicleId(vId);
              const found = vehicles.find((v) => v.vehicleId === vId);
              if (found) {
                setLat(found.latitude);
                setLng(found.longitude);
                setSpeed(found.speed);
                setHeading(found.heading);
                setStatus(found.status);
                setIgnition(found.ignition);
              }
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            {vehicles.map((v) => (
              <option key={v.vehicleId} value={v.vehicleId}>
                {v.vehiclePlate} — {v.vehicleName} ({v.status})
              </option>
            ))}
          </select>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Speed (km/h)</label>
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Heading (0-359°)</label>
            <input
              type="number"
              value={heading}
              onChange={(e) => setHeading(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Status Kendaraan</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LiveVehicleStatus)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Moving">Moving</option>
              <option value="Stopped">Stopped</option>
              <option value="Idle">Idle</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Ignition Kontak</label>
            <button
              type="button"
              onClick={() => setIgnition(!ignition)}
              className={`w-full py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                ignition ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {ignition ? 'Ignition ON' : 'Ignition OFF'}
            </button>
          </div>
        </div>

        {/* Test Trigger Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleSendSinglePacket}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold border border-slate-700 transition-colors"
          >
            <Send className="h-3.5 w-3.5 text-cyan-400" />
            <span>Kirim Single Telemetry</span>
          </button>

          <button
            onClick={handleToggleSimulationLoop}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
              isLoopActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {isLoopActive ? <Square className="h-3.5 w-3.5 text-rose-400" /> : <Play className="h-3.5 w-3.5 text-cyan-400" />}
            <span>{isLoopActive ? 'Stop Trajectory Loop' : 'Start Trajectory Loop'}</span>
          </button>

          <button
            onClick={handleTriggerOverspeed}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 rounded-xl text-xs font-mono font-bold border border-rose-700 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>Simulasi Overspeed Event</span>
          </button>

          <button
            onClick={handleSimulateOffline}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-mono font-bold border border-slate-800 transition-colors"
          >
            <WifiOff className="h-3.5 w-3.5 text-slate-400" />
            <span>Simulasi Device Offline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
