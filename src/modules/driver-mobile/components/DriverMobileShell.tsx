import React, { useState, useEffect } from 'react';
import {
  Home,
  Navigation,
  PackageCheck,
  Truck,
  ShieldCheck,
  User,
  Radio,
  Wifi,
  WifiOff,
  Battery,
  Flame,
  Smartphone,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DriverMobileTab, DriverSessionState, DriverActiveTrip, PreTripInspectionRecord } from '../types/driverMobileTypes';
import { driverSessionService } from '../services/driverSessionService';
import { mobileSyncService } from '../services/mobileSyncService';
import { DriverHomeTab } from './tabs/DriverHomeTab';
import { DriverTripTab } from './tabs/DriverTripTab';
import { DriverDeliveryTab } from './tabs/DriverDeliveryTab';
import { DriverVehicleTab } from './tabs/DriverVehicleTab';
import { DriverSafetyTab } from './tabs/DriverSafetyTab';
import { DriverProfileTab } from './tabs/DriverProfileTab';
import { PanicEmergencyModal } from './modals/PanicEmergencyModal';
import { PreTripInspectionModal } from './modals/PreTripInspectionModal';

export const DriverMobileShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DriverMobileTab>('HOME');
  const [isDeviceFrameMode, setIsDeviceFrameMode] = useState<boolean>(false);
  const [isPanicOpen, setIsPanicOpen] = useState<boolean>(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState<boolean>(false);
  const [, setTick] = useState(0);

  const refreshState = () => setTick(t => t + 1);

  useEffect(() => {
    const unsubSession = driverSessionService.subscribe(refreshState);
    const unsubSync = mobileSyncService.subscribe(refreshState);
    return () => {
      unsubSession();
      unsubSync();
    };
  }, []);

  const session = driverSessionService.getSession();
  const activeTrip = driverSessionService.getActiveTrip();
  const lastInspection = driverSessionService.getLastInspection();
  const isOnline = mobileSyncService.getNetworkStatus();
  const pendingActionsCount = mobileSyncService.getPendingQueue().filter(i => i.status === 'PENDING').length;
  const deliveries = driverSessionService.getDeliveries();
  const pendingDeliveriesCount = deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY' || d.status === 'ARRIVED').length;

  const hasInspectionPassed = lastInspection?.overallStatus === 'PASS';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Desktop Top Toolbar (for frame toggle & simulation controls) */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Driver Mobile Experience (PROMPT 46)</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                PWA Mobile-First
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Workspace pengemudi mandiri: Navigasi, POD Digital, Inspeksi Pre-Trip, SOS & Offline Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Frame Toggle */}
          <button
            onClick={() => setIsDeviceFrameMode(!isDeviceFrameMode)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            {isDeviceFrameMode ? <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Smartphone className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isDeviceFrameMode ? 'Layar Penuh (Full)' : 'Frame Handphone Mockup'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Either Framed Handphone Mockup or Responsive Full View */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFrameMode
            ? 'max-w-[430px] my-6 rounded-[48px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-950/40 relative overflow-hidden ring-1 ring-slate-700'
            : 'max-w-xl'
        }`}
      >
        {/* Mobile Mockup Status Bar */}
        <div className="bg-slate-950 px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-900 select-none">
          <span className="font-bold text-white">09:41</span>

          {/* Notch / Dynamic Island */}
          {isDeviceFrameMode && (
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
          )}

          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Wifi className="w-3.5 h-3.5" />
                <span>4G</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </span>
            )}

            <span className="flex items-center gap-1 text-slate-300">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>86%</span>
            </span>
          </div>
        </div>

        {/* Offline Banner alert if offline */}
        {!isOnline && (
          <div className="bg-rose-600/90 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>Mode Offline: {pendingActionsCount} aksi tersimpan lokal.</span>
            </span>
            <span className="text-[10px] underline font-mono">Auto-Sync On</span>
          </div>
        )}

        {/* Mobile Header Brand & Vehicle Tag */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs">
              FI
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Trans Logistik Driver</div>
              <div className="text-[10px] text-cyan-400 font-mono">{session.assignedVehicle?.plateNumber}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Emergency Panic Button in Header */}
            <button
              onClick={() => setIsPanicOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-rose-300 text-[11px] font-bold transition flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="p-4 min-h-[580px] max-h-[calc(100vh-140px)] overflow-y-auto">
          {activeTab === 'HOME' && (
            <DriverHomeTab
              session={session}
              activeTrip={activeTrip}
              hasInspectionPassed={hasInspectionPassed}
              onNavigateTab={tab => setActiveTab(tab)}
              onOpenInspectionModal={() => setIsInspectionOpen(true)}
              onOpenPanicModal={() => setIsPanicOpen(true)}
            />
          )}

          {activeTab === 'TRIP' && (
            <DriverTripTab
              session={session}
              activeTrip={activeTrip}
              hasInspectionPassed={hasInspectionPassed}
              onOpenInspectionModal={() => setIsInspectionOpen(true)}
              onRefresh={refreshState}
            />
          )}

          {activeTab === 'DELIVERY' && (
            <DriverDeliveryTab onRefresh={refreshState} />
          )}

          {activeTab === 'VEHICLE' && (
            <DriverVehicleTab
              session={session}
              lastInspection={lastInspection}
              onOpenInspectionModal={() => setIsInspectionOpen(true)}
            />
          )}

          {activeTab === 'SAFETY' && (
            <DriverSafetyTab
              session={session}
              onOpenPanicModal={() => setIsPanicOpen(true)}
              onRefresh={refreshState}
            />
          )}

          {activeTab === 'PROFILE' && (
            <DriverProfileTab session={session} onRefresh={refreshState} />
          )}
        </div>

        {/* Floating Emergency Panic Button on Bottom-Right */}
        <div className="fixed sm:absolute bottom-20 right-4 z-30">
          <button
            onClick={() => setIsPanicOpen(true)}
            className="w-13 h-13 p-3.5 rounded-full bg-rose-600 text-white shadow-2xl shadow-rose-900/80 border-2 border-rose-400 hover:scale-105 active:scale-95 transition flex items-center justify-center group"
            title="Emergency SOS Panic"
          >
            <Flame className="w-6 h-6 animate-pulse" />
          </button>
        </div>

        {/* Native Touch Bottom Navigation Bar (Fixed 6 Tabs) */}
        <div className="sticky bottom-0 left-0 right-0 z-20 bg-slate-900/95 border-t border-slate-800 backdrop-blur px-2 py-2 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
              activeTab === 'HOME' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('TRIP')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition relative ${
              activeTab === 'TRIP' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-[10px]">Trip</span>
            {activeTrip && activeTrip.status === 'IN_PROGRESS' && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('DELIVERY')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition relative ${
              activeTab === 'DELIVERY' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PackageCheck className="w-5 h-5" />
            <span className="text-[10px]">Delivery</span>
            {pendingDeliveriesCount > 0 && (
              <span className="absolute -top-0.5 right-0.5 px-1 py-0.2 rounded-full bg-purple-500 text-white font-mono text-[9px] font-bold">
                {pendingDeliveriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('VEHICLE')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
              activeTab === 'VEHICLE' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-[10px]">Armada</span>
          </button>

          <button
            onClick={() => setActiveTab('SAFETY')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
              activeTab === 'SAFETY' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px]">Safety</span>
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
              activeTab === 'PROFILE' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profil</span>
          </button>
        </div>
      </div>

      {/* Global Modals */}
      <PanicEmergencyModal
        isOpen={isPanicOpen}
        onClose={() => setIsPanicOpen(false)}
      />

      <PreTripInspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        onCompleted={() => refreshState()}
      />
    </div>
  );
};
