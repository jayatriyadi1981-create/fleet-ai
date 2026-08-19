/**
 * Fleet Intelligence Smart AI - Enterprise 11-Tab GPS Device Profile Detail View
 * PROMPT 10 - Enterprise Device Detail, Telemetry Stream, Connection Timeline & AI Intelligence
 */

import React, { useState } from 'react';
import { GPSDeviceExtended, CommandType } from '../../types/gps';
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
  ShieldCheck,
  HardDrive,
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
  RotateCcw,
  Send,
  Sliders,
  History,
  Layers
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
    | 'connection'
    | 'vehicle'
    | 'sim'
    | 'firmware'
    | 'health'
    | 'telemetry'
    | 'events'
    | 'commands'
    | 'activity'
    | 'ai_intelligence'
  >('overview');

  const [showMasked, setShowMasked] = useState<boolean>(!hasSensitivePermission);

  const simInfo = device.simId ? gpsDeviceService.getSIM(device.simId) : null;
  const events = gpsDeviceService.getEvents(device.id);
  const commands = gpsDeviceService.getCommands(device.id);
  const telemetry = gpsDeviceService.getNormalizedTelemetry(device.id);
  const aiIntel = gpsDeviceService.getAIIntelligence(device.id);

  const maskedImei = gpsDeviceService.maskIMEI(device.imei, !showMasked);

  const tabs: { id: typeof activeTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Cpu },
    { id: 'connection', label: 'Connection', icon: Wifi },
    { id: 'vehicle', label: 'Vehicle', icon: Truck },
    { id: 'sim', label: 'SIM Card', icon: CreditCard },
    { id: 'firmware', label: 'Firmware', icon: DownloadCloud },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'telemetry', label: 'Telemetry', icon: Radio },
    { id: 'events', label: 'Events', icon: History },
    { id: 'commands', label: 'Commands', icon: Zap },
    { id: 'activity', label: 'Activity', icon: Layers },
    { id: 'ai_intelligence', label: 'AI Intelligence', icon: Sparkles }
  ];

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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                📡 {device.deviceCode}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  device.connectionStatus === 'online'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                ● {device.connectionStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {device.manufacturer} {device.model} • IMEI: {maskedImei}
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
            Diagnostics
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
            Track Vehicle
          </button>
        </div>
      </div>

      {/* 11 Horizontal Tab Navigation Bar */}
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

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" /> Identitas Perangkat GPS
            </h3>
            <div className="space-y-2 text-xs divide-y divide-slate-800/60">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Device ID Internal</span>
                <span className="font-mono text-white font-bold">{device.id}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Device Asset Code</span>
                <span className="font-mono text-cyan-300 font-bold">{device.deviceCode}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Pabrikan / Vendor</span>
                <span className="text-slate-200 font-semibold">{device.manufacturer}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Model Tipe</span>
                <span className="text-slate-200 font-semibold">{device.model}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Nomor Seri (Serial)</span>
                <span className="font-mono text-slate-300">{device.serialNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 items-center">
                <span className="text-slate-400">Nomor IMEI</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-200">
                  <span>{maskedImei}</span>
                  <button
                    onClick={() => setShowMasked(!showMasked)}
                    className="p-1 text-slate-500 hover:text-cyan-400"
                  >
                    {showMasked ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Wifi className="h-4 w-4 text-emerald-400" /> Protocol & Konektivitas
            </h3>
            <div className="space-y-2 text-xs divide-y divide-slate-800/60">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Nama Protocol</span>
                <span className="font-semibold text-slate-200">{device.protocolName}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Versi Firmware</span>
                <span className="font-mono text-slate-300">{device.firmwareVersion}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Status Koneksi</span>
                <span className="font-bold text-emerald-400 capitalize">{device.connectionStatus}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Last Ping Received</span>
                <span className="font-mono text-slate-300">
                  {device.lastPingAt ? new Date(device.lastPingAt).toLocaleString('id-ID') : 'Never'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Messages Today</span>
                <span className="font-mono text-slate-200">{device.messagesToday.toLocaleString()} msgs</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-400" /> Alokasi Kendaraan & SIM
            </h3>
            <div className="space-y-2 text-xs divide-y divide-slate-800/60">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Plat Nomor Kendaraan</span>
                <span className="font-bold text-amber-300">{device.vehiclePlate || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Cabang Depo</span>
                <span className="text-slate-200">{device.branchName || 'Cabang Utama'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Nomor SIM Card</span>
                <span className="font-mono text-slate-300">{device.simNumber || 'Belum Terpasang'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Provider Seluler</span>
                <span className="text-slate-200">{device.simProvider || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Tanggal Instalasi</span>
                <span className="text-slate-300">{device.installationDate || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CONNECTION */}
      {activeTab === 'connection' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-400">Status Koneksi Gateway</span>
              <div className="text-lg font-bold text-emerald-400 capitalize">{device.connectionStatus}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-400">TCP Socket Latency</span>
              <div className="text-lg font-bold text-white font-mono">{device.connectionLatencyMs || 45} ms</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-400">Total Telemetry Pings (Today)</span>
              <div className="text-lg font-bold text-cyan-300 font-mono">{device.messagesToday.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-400">Message Dropped / Failed</span>
              <div className="text-lg font-bold text-rose-400 font-mono">{device.messagesFailed}</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white">Connection History Timeline (24 Hours)</h3>
            <div className="flex items-center gap-1 h-12 w-full bg-slate-950 p-2 rounded-xl border border-slate-800">
              {Array.from({ length: 48 }).map((_, i) => {
                const isDown = device.connectionStatus === 'offline' && i > 30;
                return (
                  <div
                    key={i}
                    title={`Block ${i * 30} mins ago`}
                    className={`flex-1 h-full rounded-sm ${
                      isDown ? 'bg-rose-500/80' : i % 7 === 0 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>24 Jam Lalu</span>
              <span>12 Jam Lalu</span>
              <span>Sekarang (Live)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: VEHICLE */}
      {activeTab === 'vehicle' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Integrasi Kendaraan Terpasang</h3>
              <p className="text-xs text-slate-400">Hubungan unit armada dengan sensor GPS tracker.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-xs text-slate-400 font-semibold uppercase">Kendaraan Saat Ini</div>
              <div className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Truck className="h-6 w-6" />
                <span>{device.vehiclePlate || 'Tidak ada kendaraan'}</span>
              </div>
              <p className="text-xs text-slate-400">Isuzu Giga FVR • Box Cargo • Depo Jakarta</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="text-xs text-slate-400 font-semibold uppercase">Histori Penugasan</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-300">B 9821 UTX</span>
                  <span className="text-slate-500">20 Jan 2024 – Sekarang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SIM CARD */}
      {activeTab === 'sim' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Kartu SIM Seluler M2M</h3>
          {simInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Telepon</span>
                  <span className="font-mono text-white font-bold">{simInfo.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ICCID Kartu SIM</span>
                  <span className="font-mono text-slate-300">{simInfo.iccid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provider & Network</span>
                  <span className="text-cyan-300 font-bold">{simInfo.provider} {simInfo.network}</span>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">APN Profil</span>
                  <span className="font-mono text-slate-300">{simInfo.apn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penggunaan Data Kuota</span>
                  <span className="font-mono text-slate-300">{simInfo.dataUsedMb} MB / {simInfo.monthlyDataLimitMb} MB</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Belum ada kartu SIM terhubung.</div>
          )}
        </div>
      )}

      {/* Tab 5: FIRMWARE */}
      {activeTab === 'firmware' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Status Firmware Perangkat</h3>
              <p className="text-xs text-slate-400">Versi terpasang dan paket OTA rilis terbaru.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
              <span className="text-slate-400">Versi Terpasang</span>
              <div className="text-base font-bold text-cyan-300 font-mono">{device.firmwareVersion}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
              <span className="text-slate-400">Rilis Terbaru</span>
              <div className="text-base font-bold text-emerald-400 font-mono">{device.latestAvailableFirmware || device.firmwareVersion}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: HEALTH */}
      {activeTab === 'health' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Skor Kesehatan Perangkat (Device Health)</h3>
            <span className="text-2xl font-black font-mono text-emerald-400">{device.healthScore}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase">Power & Aki</span>
              <div className="text-sm font-bold text-white">13.8 V (Aki Eksternal)</div>
              <p className="text-[11px] text-slate-500">Baterai internal 4.1V (98%)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase">Sinyal GPS Satelit</span>
              <div className="text-sm font-bold text-cyan-300">14 Satelit locked</div>
              <p className="text-[11px] text-slate-500">Akurasi 2.4 meter (HDOP 0.8)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase">Gateway Ping SLA</span>
              <div className="text-sm font-bold text-emerald-400">99.9% Reliable</div>
              <p className="text-[11px] text-slate-500">Latency rata-rata 45ms</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: TELEMETRY */}
      {activeTab === 'telemetry' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white">Snapshot Telemetri Terkini</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              ● Fresh ({new Date(telemetry.timestamp).toLocaleTimeString('id-ID')})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px]">LINTANG / BUJUR</span>
              <div className="font-mono text-cyan-300 font-bold">{telemetry.latitude}, {telemetry.longitude}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px]">KECEPATAN</span>
              <div className="font-mono text-emerald-400 font-bold">{telemetry.speed} km/h</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px]">IGNITION</span>
              <div className="font-bold text-amber-400">{telemetry.ignition ? 'MESIN ON' : 'MESIN OFF'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px]">ODOMETER</span>
              <div className="font-mono text-slate-200 font-bold">{telemetry.odometerKm.toLocaleString()} KM</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: EVENTS */}
      {activeTab === 'events' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Riwayat Kejadian (Events Log)</h3>
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

      {/* Tab 9: COMMANDS */}
      {activeTab === 'commands' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Audit Histori Perintah Gateway</h3>
            <button
              onClick={onOpenCommands}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              + Kirim Perintah
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

      {/* Tab 10: ACTIVITY */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white">Log Aktivitas Aset</h3>
          <div className="text-xs text-slate-400 space-y-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              Perangkat didaftarkan pada {new Date(device.createdAt).toLocaleDateString('id-ID')} oleh Fleet Manager.
            </div>
          </div>
        </div>
      )}

      {/* Tab 11: AI INTELLIGENCE */}
      {activeTab === 'ai_intelligence' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Sparkles className="h-5 w-5" />
            <span>✦ AI Device Intelligence & Anomaly Engine</span>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-200 space-y-2">
            <div className="font-bold text-sm">Prediksi Risiko Kesehatan 7 Hari: {aiIntel.healthForecast7Days}</div>
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
