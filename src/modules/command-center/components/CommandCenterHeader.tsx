/**
 * Fleet Intelligence Smart AI - Command Center Header Bar
 * Live clock, System Health Indicators, Branch Filtering, Sound & Mode Controls
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Tv, 
  ShieldAlert, 
  SlidersHorizontal, 
  Building2, 
  RefreshCw, 
  Radio, 
  AlertTriangle,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { commandCenterService } from '../services/commandCenterService';
import { commandCenterAudioService } from '../services/commandCenterAudioService';
import { mockBranches, mockTenant } from '../../../constants/mockData';
import { CommandCenterDisplayMode } from '../types/commandCenterTypes';

interface CommandCenterHeaderProps {
  onOpenCopilot: () => void;
  onOpenSettings: () => void;
  onOpenDispatch: () => void;
}

export const CommandCenterHeader: React.FC<CommandCenterHeaderProps> = ({
  onOpenCopilot,
  onOpenSettings,
  onOpenDispatch
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(commandCenterAudioService.getConfig().soundEnabled);
  const [displayMode, setDisplayMode] = useState<CommandCenterDisplayMode>(commandCenterService.getDisplayMode());
  const [selectedBranch, setSelectedBranch] = useState<string>(commandCenterService.getSelectedBranchId());
  const [health, setHealth] = useState(commandCenterService.getHealth());
  const [activeEmergenciesCount, setActiveEmergenciesCount] = useState<number>(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' WIB'
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = commandCenterService.subscribe(() => {
      setHealth(commandCenterService.getHealth());
      setDisplayMode(commandCenterService.getDisplayMode());
      setSelectedBranch(commandCenterService.getSelectedBranchId());
      const emgs = commandCenterService.getEmergencies().filter((e) => e.status === 'ACTIVE');
      setActiveEmergenciesCount(emgs.length);
    });
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    commandCenterAudioService.updateConfig({ soundEnabled: next });
    if (next) {
      commandCenterAudioService.playAlertChime();
    }
  };

  const toggleDisplayMode = (mode: CommandCenterDisplayMode) => {
    const nextMode = displayMode === mode ? 'NORMAL' : mode;
    setDisplayMode(nextMode);
    commandCenterService.setDisplayMode(nextMode);

    if (nextMode === 'FULLSCREEN' || nextMode === 'CONTROL_ROOM') {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleSimulateSOS = () => {
    commandCenterService.triggerEmergencySOS({
      vehicleId: 'veh-002',
      plateNumber: 'B 9211 TJP',
      driverId: 'drv-002',
      driverName: 'Agus Salim',
      driverPhone: '+62 813-8899-7711',
      type: 'PANIC',
      description: 'Simulasi Tombol Panik Darurat: Kendaraan mengalami kendala di Tol Cipularang KM 92.',
      location: { lat: -6.5512, lng: 107.4485, address: 'Tol Cipularang KM 92 (Arah Bandung)' },
    });
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-2.5 flex items-center justify-between gap-3 select-none z-30 transition-all">
      {/* Brand & Live Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
                COMMAND CENTER
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
                LIVE 24/7
              </span>
              {activeEmergenciesCount > 0 && (
                <span className="animate-bounce bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-rose-500/40">
                  <ShieldAlert className="w-3 h-3" />
                  {activeEmergenciesCount} SOS AKTIF
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {mockTenant.name} • Mission Control Room
            </p>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono">GPS: {health.packetsPerSec}/s</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">WS: 100%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">AI: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Central Time & Date Display */}
      <div className="hidden md:flex flex-col items-center justify-center bg-slate-800/80 border border-slate-700/60 px-4 py-1 rounded-lg">
        <div className="text-base font-mono font-bold tracking-wider text-amber-400">
          {currentTime || '00:00:00 WIB'}
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          {currentDate || 'Memuat waktu...'}
        </div>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-2">
        {/* Branch / Depo Filter */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">
          <Building2 className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
          <select
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              commandCenterService.setSelectedBranchId(e.target.value);
            }}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-2"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">Semua Cabang ({mockBranches.length})</option>
            {mockBranches.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Simulate SOS Test Button */}
        <button
          onClick={handleSimulateSOS}
          title="Simulasikan Panggilan Darurat Driver (SOS Test)"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Simulasi SOS</span>
        </button>

        {/* Smart Dispatch Button */}
        <button
          onClick={onOpenDispatch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Smart Dispatch</span>
        </button>

        {/* AI Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Matikan Audio Alarm' : 'Aktifkan Audio Alarm'}
          className={`p-2 rounded-lg border text-xs transition-colors ${
            soundEnabled
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Control Room Mode Toggle */}
        <button
          onClick={() => toggleDisplayMode('CONTROL_ROOM')}
          title="Mode Ruang Kontrol / Video Wall TV"
          className={`p-2 rounded-lg border text-xs transition-colors ${
            displayMode === 'CONTROL_ROOM'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => toggleDisplayMode('FULLSCREEN')}
          title="Mode Layar Penuh (Fullscreen)"
          className={`p-2 rounded-lg border text-xs transition-colors ${
            displayMode === 'FULLSCREEN'
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {displayMode === 'FULLSCREEN' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Settings / Layers */}
        <button
          onClick={onOpenSettings}
          title="Pengaturan Layer & Tampilan Peta"
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
