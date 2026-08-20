/**
 * Fleet Intelligence Smart AI - GPS Device Master List Component
 * Full GPS Device Management with Device Details, Telemetry, and 6-State Health Monitoring
 */

import React, { useState, useMemo } from 'react';
import { GPSDeviceExtended, SpecificDeviceHealth } from '../../types/gps';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { useAuthorization } from '../../hooks/useAuthorization';
import {
  Search,
  Plus,
  Download,
  Activity,
  Radio,
  Cpu,
  Truck,
  Eye,
  EyeOff,
  ChevronRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  WifiOff,
  BatteryCharging,
  BatteryWarning,
  MapPinOff,
  PowerOff,
  SlidersHorizontal,
  Layers,
  Thermometer,
  Gauge,
  KeyRound,
  DoorClosed,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface DeviceListViewProps {
  onSelectDevice: (device: GPSDeviceExtended) => void;
  onOpenWizard: () => void;
  onOpenDiagnostics: (device: GPSDeviceExtended) => void;
  onOpenCommands: (device: GPSDeviceExtended) => void;
}

export const DeviceListView: React.FC<DeviceListViewProps> = ({
  onSelectDevice,
  onOpenWizard,
  onOpenDiagnostics,
  onOpenCommands
}) => {
  const { can } = useAuthorization();
  const hasSensitivePermission = can('gps.device.view_sensitive');

  // Search & Filter States
  const [search, setSearch] = useState<string>('');
  const [specificHealthFilter, setSpecificHealthFilter] = useState<string>('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [showMaskedIMEI, setShowMaskedIMEI] = useState<boolean>(!hasSensitivePermission);

  const devices = useMemo(() => {
    return gpsDeviceService.listDevices({
      search,
      status: adminStatusFilter,
      specificHealth: specificHealthFilter,
      protocolId: protocolFilter,
      simProvider: providerFilter,
      hasSensitivePermission: !showMaskedIMEI
    });
  }, [search, adminStatusFilter, specificHealthFilter, protocolFilter, providerFilter, showMaskedIMEI]);

  const allRawDevices = useMemo(() => gpsDeviceService.listDevices(), []);

  // Health count metrics for quick chips
  const healthCounts = useMemo(() => {
    return {
      all: allRawDevices.length,
      online: allRawDevices.filter((d) => d.specificHealth === 'online').length,
      offline: allRawDevices.filter((d) => d.specificHealth === 'offline').length,
      weak_signal: allRawDevices.filter((d) => d.specificHealth === 'weak_signal').length,
      gps_lost: allRawDevices.filter((d) => d.specificHealth === 'gps_lost').length,
      power_disconnected: allRawDevices.filter((d) => d.specificHealth === 'power_disconnected').length,
      battery_low: allRawDevices.filter((d) => d.specificHealth === 'battery_low').length
    };
  }, [allRawDevices]);

  const protocols = gpsDeviceService.listProtocols();

  const handleExportCSV = () => {
    const headers = [
      'Device ID',
      'Device Code',
      'IMEI',
      'Serial Number',
      'SIM Number',
      'Provider',
      'APN',
      'Protocol',
      'Firmware',
      'Installation Date',
      'Device Status',
      'Health Status',
      'Last Connection',
      'Vehicle Plate',
      'Speed (km/h)',
      'RPM',
      'Fuel (%)',
      'Ext Voltage (V)',
      'Battery (V)',
      'Engine Hours'
    ];

    const rows = devices.map((d) => [
      d.id,
      d.deviceCode,
      d.imei,
      d.serialNumber,
      d.simNumber || 'N/A',
      d.simProvider || 'N/A',
      d.apn || 'N/A',
      d.protocolName,
      d.firmwareVersion,
      d.installationDate || 'N/A',
      d.status,
      d.specificHealth || d.connectionStatus,
      `"${d.lastConnection || d.lastPingAt || 'N/A'}"`,
      d.vehiclePlate || 'N/A',
      d.speed ?? '0',
      d.rpm ?? '0',
      d.fuelLevelPercent ?? '0',
      d.externalVoltage ?? '0',
      d.batteryVoltage ?? '0',
      d.engineHours ?? '0'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gps_devices_management_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getHealthBadge = (health?: SpecificDeviceHealth) => {
    switch (health) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Online
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <WifiOff className="h-3 w-3" />
            Offline
          </span>
        );
      case 'weak_signal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Wifi className="h-3 w-3" />
            Weak Signal
          </span>
        );
      case 'gps_lost':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <MapPinOff className="h-3 w-3" />
            GPS Lost
          </span>
        );
      case 'power_disconnected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <PowerOff className="h-3 w-3" />
            Power Disconnected
          </span>
        );
      case 'battery_low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <BatteryWarning className="h-3 w-3" />
            Battery Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            GPS Device Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen lengkap perangkat GPS Tracker, telemetri live streaming (GPS, Ignition, Speed, RPM, Fuel, Voltage, Temp, Door, Engine Hour, Odo, AC, PTO) & monitor 6 kondisi kesehatan perangkat.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          {can('gps.device.create') && (
            <button
              onClick={onOpenWizard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              + Add GPS Device
            </button>
          )}
        </div>
      </div>

      {/* 6 Device Health Filter Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSpecificHealthFilter('all')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            specificHealthFilter === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Semua Status</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {healthCounts.all}
          </span>
        </button>

        <button
          onClick={() => setSpecificHealthFilter('online')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            specificHealthFilter === 'online'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
              : 'bg-slate-900 text-emerald-400/90 border border-emerald-500/30 hover:bg-emerald-500/10'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {healthCounts.online}
          </span>
        </button>

        <button
          onClick={() => setSpecificHealthFilter('offline')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            specificHealthFilter === 'offline'
              ? 'bg-slate-700 text-white shadow-md font-bold'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {healthCounts.offline}
          </span>
        </button>

        <button
          onClick={() => setSpecificHealthFilter('weak_signal')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            specificHealthFilter === 'weak_signal'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'bg-slate-900 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'
          }`}
        >
          <Wifi className="h-3.5 w-3.5" />
          <span>Weak Signal</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {healthCounts.weak_signal}
          </span>
        </button>

        <button
          onClick={() => setSpecificHealthFilter('gps_lost')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            specificHealthFilter === 'gps_lost'
              ? 'bg-purple-500 text-white shadow-md font-bold'
              : 'bg-slate-900 text-purple-400 border border-purple-500/30 hover:bg-purple-500/10'
          }`}
        >
          <MapPinOff className="h-3.5 w-3.5" />
          <span>GPS Lost</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {healthCounts.gps_lost}
          </span>
        </button>

        <button
          onClick={() => setSpecificHealthFilter('power_disconnected')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            specificHealthFilter === 'power_disconnected'
              ? 'bg-orange-500 text-white shadow-md font-bold'
              : 'bg-slate-900 text-orange-400 border border-orange-500/30 hover:bg-orange-500/10'
          }`}
        >
          <PowerOff className="h-3.5 w-3.5" />
          <span>Power Disconnected</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {healthCounts.power_disconnected}
          </span>
        </button>

        <button
          onClick={() => setSpecificHealthFilter('battery_low')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            specificHealthFilter === 'battery_low'
              ? 'bg-rose-500 text-white shadow-md font-bold'
              : 'bg-slate-900 text-rose-400 border border-rose-500/30 hover:bg-rose-500/10'
          }`}
        >
          <BatteryWarning className="h-3.5 w-3.5" />
          <span>Battery Low</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {healthCounts.battery_low}
          </span>
        </button>
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari IMEI, Device ID, Serial, SIM, Provider, APN, Plat..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Administrative Status */}
        <div>
          <select
            value={adminStatusFilter}
            onChange={(e) => setAdminStatusFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Status Admin: Semua</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="retired">Retired</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Protocol Filter */}
        <div>
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Protocol: Semua</option>
            {protocols.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* SIM Provider Filter */}
        <div>
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">SIM Provider: Semua</option>
            <option value="Telkomsel">Telkomsel</option>
            <option value="Indosat">Indosat</option>
            <option value="XL">XL</option>
            <option value="Smartfren">Smartfren</option>
          </select>
        </div>
      </div>

      {/* Sensitive IMEI Masking Toggle Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>Menampilkan <strong className="text-white">{devices.length}</strong> perangkat GPS</span>
        <button
          onClick={() => setShowMaskedIMEI(!showMaskedIMEI)}
          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          {showMaskedIMEI ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>{showMaskedIMEI ? 'Tampilkan Full IMEI' : 'Masking IMEI Sensitif'}</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Device Info & IMEI</th>
                <th className="px-4 py-3.5">SIM & APN</th>
                <th className="px-4 py-3.5">Protocol & Firmware</th>
                <th className="px-4 py-3.5">Kendaraan & Install</th>
                <th className="px-4 py-3.5">Device Health</th>
                <th className="px-4 py-3.5">Live Telemetry Snapshot</th>
                <th className="px-4 py-3.5">Last Connection</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Cpu className="h-8 w-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    Tidak ada perangkat GPS yang sesuai dengan kriteria pencarian / filter.
                  </td>
                </tr>
              ) : (
                devices.map((device) => {
                  return (
                    <tr
                      key={device.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectDevice(device)}
                    >
                      {/* Device & IMEI */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Radio className="h-4 w-4 text-cyan-400 shrink-0" />
                          <div>
                            <div className="font-bold text-white font-mono flex items-center gap-1.5">
                              <span>{device.deviceCode}</span>
                              <span className="text-[10px] text-slate-500">({device.id})</span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              IMEI: <span className="text-slate-200">{device.imei}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              SN: {device.serialNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SIM & APN */}
                      <td className="px-4 py-3.5">
                        {device.simNumber ? (
                          <div>
                            <div className="font-semibold text-slate-200 flex items-center gap-1">
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                                {device.simProvider || 'M2M'}
                              </span>
                              <span className="font-mono text-xs">{device.simNumber}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              APN: {device.apn || 'm2m.operator.id'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No SIM Card</span>
                        )}
                      </td>

                      {/* Protocol & Firmware */}
                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="font-semibold text-slate-200">
                          {device.manufacturer} {device.model}
                        </div>
                        <div className="text-[10px] text-cyan-300 font-mono">
                          {device.protocolName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          FW: {device.firmwareVersion}
                        </div>
                      </td>

                      {/* Vehicle & Install Date */}
                      <td className="px-4 py-3.5">
                        {device.vehiclePlate ? (
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-amber-300">
                              <Truck className="h-3.5 w-3.5" />
                              <span>{device.vehiclePlate}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Pasang: {device.installationDate || '2024-01-15'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-slate-500 italic">Stok Gudang</span>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {device.branchName || 'Logistik Pusat'}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Device Health */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div>{getHealthBadge(device.specificHealth)}</div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full ${
                                  device.healthScore >= 80
                                    ? 'bg-emerald-400'
                                    : device.healthScore >= 50
                                    ? 'bg-amber-400'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${device.healthScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] font-bold text-slate-300">
                              {device.healthScore}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Live Telemetry Snapshot (Speed, RPM, Fuel, Voltage, Door, AC, PTO) */}
                      <td className="px-4 py-3.5">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                          <div className="flex items-center gap-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${device.ignition ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                            <span className="text-slate-400">Ign:</span>
                            <span className={`font-bold ${device.ignition ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {device.ignition ? 'ON' : 'OFF'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">Spd:</span>
                            <span className="font-mono font-bold text-cyan-300">{device.speed ?? 0} km/h</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">RPM:</span>
                            <span className="font-mono text-slate-300">{device.rpm ?? 0}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">Fuel:</span>
                            <span className="font-mono text-amber-300">{device.fuelLevelPercent ?? 0}%</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">Volt:</span>
                            <span className="font-mono text-slate-300">{device.externalVoltage ?? 0}V</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">AC/PTO:</span>
                            <span className="font-mono text-slate-300">
                              {device.acStatus ? 'AC' : '-'}/{device.ptoStatus ? 'PTO' : '-'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Last Connection */}
                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="text-[11px] font-semibold text-slate-200">
                          {device.lastConnection || (device.lastPingAt ? new Date(device.lastPingAt).toLocaleTimeString('id-ID') : 'Never')}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {device.satellitesCount ? `${device.satellitesCount} Satellites` : '0 Sat'} • {device.connectionLatencyMs || 45}ms
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenDiagnostics(device)}
                            title="Run Diagnostics"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          >
                            <Activity className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onOpenCommands(device)}
                            title="Send Remote Command"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          >
                            <Zap className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onSelectDevice(device)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Device Cards */}
      <div className="grid md:hidden grid-cols-1 gap-3">
        {devices.length === 0 ? (
          <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-2xl bg-slate-900/60">
            Tidak ada perangkat GPS yang cocok dengan filter.
          </div>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              onClick={() => onSelectDevice(device)}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all space-y-3 cursor-pointer"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                    📡 {device.deviceCode}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">
                    IMEI: {device.imei} • SN: {device.serialNumber}
                  </div>
                </div>
                <div>{getHealthBadge(device.specificHealth)}</div>
              </div>

              {/* Vehicle & Protocol */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Truck className="h-3.5 w-3.5" />
                  <span>{device.vehiclePlate || 'Belum Terpasang'}</span>
                </div>
                <span className="text-cyan-300 text-[11px] font-mono">
                  {device.protocolName}
                </span>
              </div>

              {/* SIM & APN */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span>SIM: <strong className="text-white">{device.simNumber || 'N/A'}</strong> ({device.simProvider || 'M2M'})</span>
                <span className="font-mono text-slate-500">APN: {device.apn || 'm2m'}</span>
              </div>

              {/* Telemetry Highlights */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <div className="p-1">
                  <span className="text-slate-500 block">IGNITION</span>
                  <span className={`font-bold ${device.ignition ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {device.ignition ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="p-1">
                  <span className="text-slate-500 block">SPEED</span>
                  <span className="font-mono font-bold text-cyan-300">{device.speed ?? 0} km/h</span>
                </div>
                <div className="p-1">
                  <span className="text-slate-500 block">FUEL</span>
                  <span className="font-mono font-bold text-amber-300">{device.fuelLevelPercent ?? 0}%</span>
                </div>
                <div className="p-1">
                  <span className="text-slate-500 block">VOLT</span>
                  <span className="font-mono font-bold text-slate-200">{device.externalVoltage ?? 0}V</span>
                </div>
              </div>

              {/* Footer Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="truncate max-w-[200px]">
                  Koneksi: {device.lastConnection || 'Aktif'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDevice(device);
                  }}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold text-[11px]"
                >
                  Detail Device →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
