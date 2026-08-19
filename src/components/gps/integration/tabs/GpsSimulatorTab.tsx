/**
 * Fleet Intelligence Smart AI - GPS Integration: Interactive Telematics Simulator Tab
 * PROMPT 43: Interactive Route Simulation, Multi-Protocol Packet Streamer & Fault Injector
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Zap,
  Radio,
  Sliders,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Lock,
  Unlock,
  RotateCcw,
  Activity,
  CheckCircle2,
  Navigation,
  Compass
} from 'lucide-react';
import { gpsInteractiveSimulator, SimVehicleState } from '../../../../services/gps/gpsInteractiveSimulator';

export const GpsSimulatorTab: React.FC = () => {
  const [vehicles, setVehicles] = useState<SimVehicleState[]>(gpsInteractiveSimulator.getVehicles());
  const [isRunning, setIsRunning] = useState<boolean>(gpsInteractiveSimulator.getIsRunning());
  const [simulationSpeedMs, setSimulationSpeedMs] = useState<number>(2500);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsub = gpsInteractiveSimulator.subscribe((updated) => {
      setVehicles(updated);
      setIsRunning(gpsInteractiveSimulator.getIsRunning());
    });
    return () => unsub();
  }, []);

  const handleTogglePlay = () => {
    if (isRunning) {
      gpsInteractiveSimulator.stop();
      setIsRunning(false);
      setNotification('Simulator dijeda (Paused).');
    } else {
      gpsInteractiveSimulator.start(simulationSpeedMs);
      setIsRunning(true);
      setNotification('Simulator aktif! Paket GPS disimulasikan & dialirkan langsung ke Pipeline Normalizer.');
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInjectSpeed = (vId: string) => {
    gpsInteractiveSimulator.injectSpeedSpike(vId);
    setNotification(`Anomali Kecepatan (>190 km/h) diinjeksikan pada ${vId}. Pipeline akan mendeteksi IMPOSSIBLE_SPEED.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInjectJump = (vId: string) => {
    gpsInteractiveSimulator.injectGpsJump(vId);
    setNotification(`Anomali GPS Jump (Teleportasi) diinjeksikan pada ${vId}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInjectFuel = (vId: string) => {
    gpsInteractiveSimulator.injectFuelDrain(vId);
    setNotification(`Anomali Pencurian BBM (Fuel Drain -25%) diinjeksikan pada ${vId}. Event dikirim ke Bus.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInjectPanic = (vId: string) => {
    gpsInteractiveSimulator.injectPanicSOS(vId);
    setNotification(`Tombol SOS Darurat ditekan pada ${vId}! Event alarm instan dikirim ke Security Center.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleLock = (vId: string, currentLock: boolean) => {
    gpsInteractiveSimulator.toggleEngineLock(vId, !currentLock);
    setNotification(
      !currentLock
        ? `Immobilizer AKTIF pada ${vId}. Mesin dimatikan secara aman.`
        : `Immobilizer DINONAKTIFKAN pada ${vId}. Mesin dapat dinyalakan kembali.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Simulator Master Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" /> Interactive Telematics &amp; Multi-Protocol Fleet Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulasikan pergerakan nyata armada di Tol Jakarta-Cikampek dan Surabaya. Setiap paket ditransmisikan langsung melalui pipeline normalizer, validator, dan event bus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <span>Interval:</span>
            <select
              value={simulationSpeedMs}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSimulationSpeedMs(val);
                if (isRunning) {
                  gpsInteractiveSimulator.stop();
                  gpsInteractiveSimulator.start(val);
                }
              }}
              className="bg-transparent text-cyan-400 font-bold focus:outline-none"
            >
              <option value={1000}>1.0 detik (Fast)</option>
              <option value={2500}>2.5 detik (Normal)</option>
              <option value={5000}>5.0 detik (Eco)</option>
            </select>
          </div>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isRunning ? 'Pause Simulator' : 'Start Simulator'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Vehicles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((veh) => (
          <div
            key={veh.vehicleId}
            className={`rounded-2xl border p-5 transition-all ${
              veh.isEngineLocked
                ? 'bg-rose-950/20 border-rose-500/40'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{veh.vehiclePlate}</h3>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-bold">
                    {veh.protocol}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Driver: <span className="text-slate-200 font-semibold">{veh.driverName}</span> • IMEI: <span className="font-mono text-slate-300">{veh.imei}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  veh.isEngineLocked
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : veh.status === 'MOVING'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {veh.isEngineLocked ? 'IMMOBILIZED' : veh.status}
              </span>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono mt-4">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Speed</span>
                <span className="text-sm font-black text-cyan-400">{veh.speed} km/h</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Fuel Level</span>
                <span className="text-sm font-black text-amber-400">{veh.fuelPercent}%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Engine RPM</span>
                <span className="text-sm font-black text-purple-400">{veh.rpm}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Battery</span>
                <span className="text-sm font-black text-emerald-400">{veh.batteryPercent}%</span>
              </div>
            </div>

            {/* Coordinates */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>
                Lat: <strong className="text-slate-200">{veh.lat.toFixed(5)}</strong>, Lng:{' '}
                <strong className="text-slate-200">{veh.lng.toFixed(5)}</strong>
              </span>
              <span className="text-cyan-400 font-bold">Heading: {veh.heading}°</span>
            </div>

            {/* Anomaly & Fault Injection Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">
                Fault &amp; Anomaly Injectors (Test Pipeline Handling):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleInjectSpeed(veh.vehicleId)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-amber-300 font-bold border border-slate-700 transition-all text-center"
                >
                  ⚡ Speed Spike (195 km/h)
                </button>

                <button
                  onClick={() => handleInjectJump(veh.vehicleId)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 font-bold border border-slate-700 transition-all text-center"
                >
                  🌀 GPS Jump
                </button>

                <button
                  onClick={() => handleInjectFuel(veh.vehicleId)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-rose-300 font-bold border border-slate-700 transition-all text-center"
                >
                  ⛽ Fuel Drop (-25%)
                </button>

                <button
                  onClick={() => handleInjectPanic(veh.vehicleId)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-rose-400 font-bold border border-slate-700 transition-all text-center"
                >
                  🚨 SOS Panic
                </button>
              </div>

              {/* Immobilizer Toggle */}
              <div className="pt-2">
                <button
                  onClick={() => handleToggleLock(veh.vehicleId, veh.isEngineLocked)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    veh.isEngineLocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60'
                  }`}
                >
                  {veh.isEngineLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  <span>{veh.isEngineLocked ? 'Pulihkan Mesin (Unlock Engine)' : 'Putus Aliran Mesin (Lock Engine)'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
