/**
 * Fleet Intelligence Smart AI - Enterprise 11-Tab GPS Device Profile Detail View
 * Comprehensive GPS Device Management (Device Master, 12 Telemetry Points, 6 Health States)
 */

import React, { useState } from 'react';
import { GPSDeviceExtended, SpecificDeviceHealth, CommandType } from '../../types/gps';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { useAuthorization } from '../../hooks/useAuthorization';
import { useFleet } from '../../context/FleetContext';
import {
  ArrowLeft,
  Radio,
  Cpu,
  Truck,
  Activity,
  Zap,
  Wifi,
  WifiOff,
  BatteryCharging,
  BatteryWarning,
  PowerOff,
  MapPinOff,
  ShieldCheck,
  CreditCard,
  DownloadCloud,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Send,
  History,
  Layers,
  Thermometer,
  Gauge,
  KeyRound,
  DoorClosed,
  DoorOpen,
  Fan,
  Navigation,
  Compass,
  Copy,
  Check
} from 'lucide-react';

interface DeviceProfileDetailProps {
  device: GPSDeviceExtended;
  onBack: () => void;
  onOpenDiagnostics: () => void;
  onOpenCommands: () => void;
}

export const DeviceProfileDetail: React.FC<DeviceProfileDetailProps> = ({
  device,
  onBack,
  onOpenDiagnostics,
  onOpenCommands
}) => {
  const { can } = useAuthorization();
  const { setActiveView } = useFleet();
  const hasSensitivePermission = can('gps.device.view_sensitive');

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'telemetry'
    | 'health'
    | 'connection'
    | 'vehicle'
    | 'sim'
    | 'firmware'
    | 'events'
    | 'commands'
    | 'activity'
    | 'ai_intelligence'
  >('overview');

  const [showMasked, setShowMasked] = useState<boolean>(!hasSensitivePermission);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const simInfo = device.simId ? gpsDeviceService.getSIM(device.simId) : null;
  const events = gpsDeviceService.getEvents(device.id);
  const commands = gpsDeviceService.getCommands(device.id);
  const telemetry = gpsDeviceService.getNormalizedTelemetry(device.id);
  const aiIntel = gpsDeviceService.getAIIntelligence(device.id);

  const maskedImei = gpsDeviceService.maskIMEI(device.imei, !showMasked);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const tabs: { id: typeof activeTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Device Info', icon: Cpu },
    { id: 'telemetry', label: 'Live Telemetry (12)', icon: Radio },
    { id: 'health', label: 'Device Health (6)', icon: Activity },
    { id: 'connection', label: 'Connection', icon: Wifi },
    { id: 'vehicle', label: 'Vehicle Assignment', icon: Truck },
    { id: 'sim', label: 'SIM & APN', icon: CreditCard },
    { id: 'firmware', label: 'Firmware & OTA', icon: DownloadCloud },
    { id: 'events', label: 'Event Logs', icon: History },
    { id: 'commands', label: 'Remote Commands', icon: Zap },
    { id: 'activity', label: 'Audit Trail', icon: Layers },
    { id: 'ai_intelligence', label: 'AI Health Intel', icon: Sparkles }
  ];

  const getHealthBadge = (health?: SpecificDeviceHealth) => {
    switch (health) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Online
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <WifiOff className="h-3.5 w-3.5" />
            Offline
          </span>
        );
      case 'weak_signal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Wifi className="h-3.5 w-3.5" />
            Weak Signal
          </span>
        );
      case 'gps_lost':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <MapPinOff className="h-3.5 w-3.5" />
            GPS Lost
          </span>
        );
      case 'power_disconnected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <PowerOff className="h-3.5 w-3.5" />
            Power Disconnected
          </span>
        );
      case 'battery_low':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <BatteryWarning className="h-3.5 w-3.5" />
            Battery Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">
            ● Active
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                📡 {device.deviceCode}
              </h1>
              {getHealthBadge(device.specificHealth)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Device ID: <span className="text-slate-200 font-mono">{device.id}</span> • {device.manufacturer} {device.model} • IMEI: <span className="font-mono text-cyan-300">{maskedImei}</span>
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenDiagnostics}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            <Activity className="h-4 w-4 text-cyan-400" />
            Diagnostics Test
          </button>
          <button
            onClick={onOpenCommands}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            Remote Commands
          </button>
          <button
            onClick={() => setActiveView('live_tracking')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Live Track
          </button>
        </div>
      </div>

      {/* Horizontal Tabs Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEVICE INFO (DEVICE MASTER DATA)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Device Identity Master */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" /> Device Master Data
              </h3>
              <div className="space-y-2 text-xs divide-y divide-slate-800/60">
                {/* IMEI */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">IMEI</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">{maskedImei}</span>
                    <button
                      onClick={() => setShowMasked(!showMasked)}
                      className="p-1 text-slate-500 hover:text-cyan-400"
                      title={showMasked ? 'Show Full IMEI' : 'Mask IMEI'}
                    >
                      {showMasked ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(device.imei, 'IMEI')}
                      className="p-1 text-slate-500 hover:text-cyan-400"
                      title="Copy IMEI"
                    >
                      {copiedField === 'IMEI' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Device ID */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Device ID</span>
                  <span className="font-mono text-white font-bold">{device.id}</span>
                </div>

                {/* Device Code */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Device Code</span>
                  <span className="font-mono text-cyan-400 font-bold">{device.deviceCode}</span>
                </div>

                {/* Serial Number */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Serial Number</span>
                  <span className="font-mono text-slate-200">{device.serialNumber}</span>
                </div>

                {/* Manufacturer & Model */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Brand / Model</span>
                  <span className="text-slate-200 font-semibold">{device.manufacturer} {device.model}</span>
                </div>

                {/* Installation Date */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Installation Date</span>
                  <span className="text-slate-200 font-medium">{device.installationDate || '2024-01-20'}</span>
                </div>

                {/* Device Status */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Device Status</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {device.status}
                  </span>
                </div>
              </div>
            </div>

            {/* SIM, Provider & APN Configuration */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-400" /> SIM Card & Network APN
              </h3>
              <div className="space-y-2 text-xs divide-y divide-slate-800/60">
                {/* SIM Number */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">SIM Number (MSISDN)</span>
                  <span className="font-mono text-white font-bold">{device.simNumber || 'Belum Terpasang'}</span>
                </div>

                {/* Provider */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Provider Seluler</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {device.simProvider || 'Telkomsel M2M'}
                  </span>
                </div>

                {/* APN */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">APN (Access Point Name)</span>
                  <span className="font-mono text-slate-200 font-semibold">{device.apn || 'm2m.telkomsel.id'}</span>
                </div>

                {/* Protocol */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Protocol Gateway</span>
                  <span className="text-slate-200 font-semibold">{device.protocolName}</span>
                </div>

                {/* Firmware */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Firmware Version</span>
                  <span className="font-mono text-emerald-400 font-bold">{device.firmwareVersion}</span>
                </div>

                {/* Last Connection */}
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Last Connection</span>
                  <span className="font-medium text-slate-200">
                    {device.lastConnection || (device.lastPingAt ? new Date(device.lastPingAt).toLocaleString('id-ID') : 'Aktif')}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Assignment & Health Status */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-400" /> Alokasi & Status Operasional
              </h3>
              <div className="space-y-2 text-xs divide-y divide-slate-800/60">
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Plat Kendaraan</span>
                  <span className="font-bold text-amber-300 text-sm">{device.vehiclePlate || 'Belum Ditugaskan'}</span>
                </div>

                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Cabang Operasional</span>
                  <span className="text-slate-200">{device.branchName || 'Cabang Utama Jakarta'}</span>
                </div>

                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Device Health State</span>
                  <div>{getHealthBadge(device.specificHealth)}</div>
                </div>

                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Health Score</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-emerald-400">{device.healthScore}%</span>
                    <span className="text-[10px] text-slate-400">({device.healthStatus.toUpperCase()})</span>
                  </div>
                </div>

                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-400 font-semibold">Total Pesan Hari Ini</span>
                  <span className="font-mono text-slate-200 font-bold">{device.messagesToday.toLocaleString()} msgs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TELEMETRY (12 SPECIFIC TELEMETRY ATTRIBUTES)                       */}
      {/* ========================================================================= */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-white">Live Telemetry Dashboard (12 Parameter Sensor)</h3>
                <p className="text-xs text-slate-400">Pemantauan data telematika real-time dari modem GPS dan modul CAN-bus kendaraan.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
              Sinkronisasi: {new Date(telemetry.timestamp).toLocaleTimeString('id-ID')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. GPS */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-cyan-400" /> 1. GPS Coordinates
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                  {telemetry.gpsFixStatus || '3D Fix'}
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-white">
                {telemetry.latitude.toFixed(5)}, {telemetry.longitude.toFixed(5)}
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex justify-between border-t border-slate-800/60 pt-2">
                <span>{telemetry.satellites} Satelit ({telemetry.accuracy}m)</span>
                <span>Alt: {telemetry.altitude}m • {telemetry.heading}°</span>
              </div>
            </div>

            {/* 2. Ignition */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-amber-400" /> 2. Ignition (Kontak)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    telemetry.ignition ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {telemetry.ignition ? 'MESIN ON' : 'MESIN OFF'}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${telemetry.ignition ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span>{telemetry.ignition ? 'Ignition Active' : 'Key Off / Standby'}</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                Status kontak mesin terhubung ke Input Digital DIN1.
              </div>
            </div>

            {/* 3. Speed */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-emerald-400" /> 3. Speed (Kecepatan)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Batas: 80 km/h</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {telemetry.speed} <span className="text-sm font-normal text-slate-400">km/h</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${telemetry.speed > 80 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(100, (telemetry.speed / 120) * 100)}%` }}
                />
              </div>
            </div>

            {/* 4. RPM */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-indigo-400" /> 4. Engine RPM
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {telemetry.rpm && telemetry.rpm > 3000 ? 'High RPM' : 'Optimal'}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-indigo-300">
                {telemetry.rpm ?? 1850} <span className="text-sm font-normal text-slate-400">RPM</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                CAN-bus J1939 Engine Speed Parameter
              </div>
            </div>

            {/* 5. Fuel */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" /> 5. Fuel (Bahan Bakar)
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {telemetry.fuelLiters ?? 156} L
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {telemetry.fuelLevelPercent ?? 78}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${telemetry.fuelLevelPercent ?? 78}%` }}
                />
              </div>
            </div>

            {/* 6. Voltage */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BatteryCharging className="h-4 w-4 text-cyan-400" /> 6. Voltage (Tegangan)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Dual Rail</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {telemetry.externalVoltage}V <span className="text-xs text-slate-400">(Aki Utama)</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800/60 pt-2 flex justify-between">
                <span>Backup Li-Po: {telemetry.batteryVoltage}V</span>
                <span className="text-emerald-400 font-bold">{device.batteryPercent || 95}%</span>
              </div>
            </div>

            {/* 7. Temperature */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-rose-400" /> 7. Temperature (°C)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Coolant Safe</span>
              </div>
              <div className="text-xl font-black font-mono text-white flex items-baseline gap-2">
                <span className="text-rose-400">{telemetry.engineTempCelsius ?? 86}°C</span>
                <span className="text-xs text-slate-400">Mesin</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800/60 pt-2 flex justify-between">
                <span>Kabin: {telemetry.cabinTempCelsius ?? 23}°C</span>
                <span className="text-cyan-300">Cargo: {telemetry.cargoTempCelsius ?? 4}°C</span>
              </div>
            </div>

            {/* 8. Door */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {telemetry.doorStatus === 'open' ? (
                    <DoorOpen className="h-4 w-4 text-rose-400" />
                  ) : (
                    <DoorClosed className="h-4 w-4 text-emerald-400" />
                  )}
                  8. Door (Pintu)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    telemetry.doorStatus === 'open'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {telemetry.doorStatus || 'closed'}
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {telemetry.doorStatus === 'open' ? 'Pintu Terbuka' : 'Semua Pintu Terkunci'}
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 flex justify-between">
                <span>Pintu Depan: {telemetry.doorFrontOpen ? 'Open' : 'Closed'}</span>
                <span>Kargo: {telemetry.doorRearOpen ? 'Open' : 'Closed'}</span>
              </div>
            </div>

            {/* 9. Engine Hour */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-400" /> 9. Engine Hour
                </span>
                <span className="text-[10px] font-mono text-slate-400">Jam Kerja</span>
              </div>
              <div className="text-2xl font-black font-mono text-cyan-300">
                {(telemetry.engineHours ?? 3420).toLocaleString()} <span className="text-sm font-normal text-slate-400">Jam</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                Total waktu operasional mesin menyala
              </div>
            </div>

            {/* 10. Odometer */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-emerald-400" /> 10. Odometer (KM)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Jarak Tempuh</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {telemetry.odometerKm.toLocaleString()} <span className="text-sm font-normal text-slate-400">KM</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                Odometer digital tersinkronisasi CAN bus
              </div>
            </div>

            {/* 11. AC (Air Conditioner) */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Fan className="h-4 w-4 text-sky-400" /> 11. AC (Air Conditioner)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    telemetry.acStatus ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {telemetry.acStatus ? 'AC HIDUP' : 'AC MATI'}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${telemetry.acStatus ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{telemetry.acStatus ? 'Kompresor Aktif' : 'Kompresor Non-Aktif'}</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                Sensor thermostat & input kompresor DIN2
              </div>
            </div>

            {/* 12. PTO (Power Take-Off) */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" /> 12. PTO (Power Take-Off)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    telemetry.ptoStatus ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {telemetry.ptoStatus ? 'PTO AKTIF' : 'PTO IDLE'}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${telemetry.ptoStatus ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{telemetry.ptoStatus ? 'Hydraulic / Reefer On' : 'Auxiliary Inactive'}</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                Sensor hidrolik dump bed / pendingin box DIN3
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEVICE HEALTH (6 SPECIFIC HEALTH CATEGORIES)                       */}
      {/* ========================================================================= */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Status Kesehatan Perangkat (Device Health Diagnostics)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Kondisi operasional dievaluasi secara otomatis berdasarkan 6 indikator telematika gateway.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase">Overall Health Score</div>
                <div className="text-2xl font-black font-mono text-emerald-400">{device.healthScore}%</div>
              </div>
              <div>{getHealthBadge(device.specificHealth)}</div>
            </div>
          </div>

          {/* 6 Specific Health State Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Online */}
            <div
              className={`p-5 rounded-2xl border ${
                device.specificHealth === 'online'
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/40 opacity-70'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  1. Online
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    device.specificHealth === 'online' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {device.specificHealth === 'online' ? 'ACTIVE STATE' : 'Pass'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Modem terhubung ke socket gateway, streaming telemetri aktif, respon latency {device.connectionLatencyMs || 45}ms.
              </p>
            </div>

            {/* 2. Offline */}
            <div
              className={`p-5 rounded-2xl border ${
                device.specificHealth === 'offline'
                  ? 'border-rose-500/40 bg-rose-500/10'
                  : 'border-slate-800 bg-slate-900/40 opacity-70'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <WifiOff className="h-4 w-4 text-slate-400" />
                  2. Offline
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    device.specificHealth === 'offline' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {device.specificHealth === 'offline' ? 'ACTIVE STATE' : 'Pass'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tidak ada paket pingsat yang diterima dalam ambang batas timeout (&gt;10 menit atau terputus).
              </p>
            </div>

            {/* 3. Weak Signal */}
            <div
              className={`p-5 rounded-2xl border ${
                device.specificHealth === 'weak_signal'
                  ? 'border-amber-500/40 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-900/40 opacity-70'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-amber-400" />
                  3. Weak Signal
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    device.specificHealth === 'weak_signal' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {device.specificHealth === 'weak_signal' ? 'ACTIVE STATE' : 'Pass'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kekuatan sinyal GSM/GPRS lemah (&lt; -95 dBm) atau keterlambatan transmisi gateway tinggi ({device.connectionLatencyMs || 420}ms).
              </p>
            </div>

            {/* 4. GPS Lost */}
            <div
              className={`p-5 rounded-2xl border ${
                device.specificHealth === 'gps_lost'
                  ? 'border-purple-500/40 bg-purple-500/10'
                  : 'border-slate-800 bg-slate-900/40 opacity-70'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <MapPinOff className="h-4 w-4 text-purple-400" />
                  4. GPS Lost
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    device.specificHealth === 'gps_lost' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {device.specificHealth === 'gps_lost' ? 'ACTIVE STATE' : 'Pass'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Modem GSM terhubung tetapi kunci satelit GPS hilang (0-1 satelit terkunci, kendaraan di terowongan/basement).
              </p>
            </div>

            {/* 5. Power Disconnected */}
            <div
              className={`p-5 rounded-2xl border ${
                device.specificHealth === 'power_disconnected'
                  ? 'border-orange-500/40 bg-orange-500/10'
                  : 'border-slate-800 bg-slate-900/40 opacity-70'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-orange-400 flex items-center gap-2">
                  <PowerOff className="h-4 w-4 text-orange-400" />
                  5. Power Disconnected
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    device.specificHealth === 'power_disconnected' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {device.specificHealth === 'power_disconnected' ? 'ACTIVE STATE' : 'Pass'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tegangan aki eksternal 0.0V (kabel aki terputus/dicabut). Perangkat berjalan sementara menggunakan baterai cadangan.
              </p>
            </div>

            {/* 6. Battery Low */}
            <div
              className={`p-5 rounded-2xl border ${
                device.specificHealth === 'battery_low'
                  ? 'border-rose-500/40 bg-rose-500/10'
                  : 'border-slate-800 bg-slate-900/40 opacity-70'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <BatteryWarning className="h-4 w-4 text-rose-400" />
                  6. Battery Low
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    device.specificHealth === 'battery_low' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {device.specificHealth === 'battery_low' ? 'ACTIVE STATE' : 'Pass'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kapasitas baterai internal berada di bawah 20% (&lt;3.4V). Perangkat berisiko mati total jika sumber daya tidak segera disambungkan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CONNECTION                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'connection' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Status Koneksi Socket & Gateway</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Heartbeat Terakhir</span>
              <div className="text-base font-bold text-white font-mono">{device.lastPingAt ? new Date(device.lastPingAt).toLocaleString('id-ID') : 'Never'}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Latency Socket</span>
              <div className="text-base font-bold text-cyan-400 font-mono">{device.connectionLatencyMs || 45} ms</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Tingkat Kegagalan Paket</span>
              <div className="text-base font-bold text-emerald-400 font-mono">{device.messagesFailed || 0} failed pkts</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: VEHICLE ASSIGNMENT                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'vehicle' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Penugasan Kendaraan Armada</h3>
          {device.vehiclePlate ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Plat Kendaraan</span>
                <span className="font-bold text-amber-300 text-sm">{device.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ID Kendaraan</span>
                <span className="font-mono text-slate-200">{device.vehicleId || 'V-001'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal Pemasangan</span>
                <span className="text-slate-200">{device.installationDate || '2024-01-20'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Catatan Teknisi</span>
                <span className="text-slate-300 italic">{device.notes || 'Terpasang di balik console dashboard.'}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Perangkat saat ini berstatus stok gudang (belum dialokasikan ke armada).</div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SIM & APN                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'sim' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Kartu SIM Seluler M2M & APN Gateway</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Telepon M2M</span>
                <span className="font-mono text-white font-bold">{device.simNumber || simInfo?.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider Jaringan</span>
                <span className="text-cyan-300 font-bold">{device.simProvider || simInfo?.provider || 'Telkomsel'}</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">APN Profil (Access Point Name)</span>
                <span className="font-mono text-slate-200 font-bold">{device.apn || simInfo?.apn || 'm2m.telkomsel.id'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status SIM</span>
                <span className="text-emerald-400 font-bold">Active M2M Dedicated</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: FIRMWARE                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'firmware' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Versi Firmware & OTA Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
              <span className="text-slate-400">Versi Terpasang Saat Ini</span>
              <div className="text-base font-bold text-cyan-300 font-mono">{device.firmwareVersion}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
              <span className="text-slate-400">Rilis Firmware Stabil Terbaru</span>
              <div className="text-base font-bold text-emerald-400 font-mono">{device.latestAvailableFirmware || device.firmwareVersion}</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: EVENTS LOG                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Riwayat Kejadian & Alarm (Event Logs)</h3>
          <div className="space-y-3">
            {events.map((evt) => (
              <div key={evt.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>{evt.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(evt.timestamp).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-slate-400">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: COMMANDS                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'commands' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Histori Pengiriman Perintah Gateway</h3>
            <button
              onClick={onOpenCommands}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              + Kirim Perintah Baru
            </button>
          </div>
          <div className="space-y-2">
            {commands.map((cmd) => (
              <div key={cmd.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between">
                <div>
                  <div className="font-bold text-cyan-300">{cmd.commandType}</div>
                  <div className="text-[10px] text-slate-500">Operator: {cmd.sentBy}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {cmd.status.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {new Date(cmd.createdAt).toLocaleTimeString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: ACTIVITY AUDIT TRAIL                                              */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Log Aktivitas Perangkat</h3>
          <div className="text-xs text-slate-400 space-y-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              Perangkat didaftarkan pada {new Date(device.createdAt).toLocaleDateString('id-ID')} oleh Fleet Manager.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 11: AI INTELLIGENCE                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'ai_intelligence' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Sparkles className="h-5 w-5" />
            <span>✦ AI Device Intelligence & Predictive Anomaly Engine</span>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-200 space-y-2">
            <div className="font-bold text-sm">Prediksi Risiko 7 Hari: {aiIntel.healthForecast7Days}</div>
            <p>Confidence Index: {aiIntel.confidenceScore}% • Indeks Stabilitas Socket: {aiIntel.connectionStabilityIndex}%</p>
          </div>

          <div className="space-y-3">
            {aiIntel.findings.map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>{f.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{f.category}</span>
                </div>
                <p className="text-slate-400">{f.explanation}</p>
                <p className="text-cyan-300 font-semibold text-[11px]">Rekomendasi AI: {f.recommendedAction}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
