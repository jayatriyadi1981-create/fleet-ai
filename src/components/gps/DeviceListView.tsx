/**
 * Fleet Intelligence Smart AI - GPS Device Master List Component
 * PROMPT 10 - Enterprise Table, Mobile Cards, Search & Multi-Filters
 */

import React, { useState, useMemo } from 'react';
import { GPSDeviceExtended, DeviceAdminStatus, DeviceConnectionStatus, DeviceHealthStatus } from '../../types/gps';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { useAuthorization } from '../../hooks/useAuthorization';
import {
  Search,
  Filter,
  Plus,
  Download,
  Activity,
  Radio,
  Cpu,
  Truck,
  Eye,
  EyeOff,
  MoreVertical,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Archive
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
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');
  const [connectionFilter, setConnectionFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [showMaskedIMEI, setShowMaskedIMEI] = useState<boolean>(!hasSensitivePermission);

  const devices = useMemo(() => {
    return gpsDeviceService.listDevices({
      search,
      status: adminStatusFilter,
      connectionStatus: connectionFilter,
      healthStatus: healthFilter,
      protocolId: protocolFilter,
      simProvider: providerFilter,
      hasSensitivePermission: !showMaskedIMEI
    });
  }, [search, adminStatusFilter, connectionFilter, healthFilter, protocolFilter, providerFilter, showMaskedIMEI]);

  const protocols = gpsDeviceService.listProtocols();

  const handleExportCSV = () => {
    const headers = ['Device Code', 'IMEI', 'Vehicle Plate', 'Manufacturer', 'Model', 'Protocol', 'Admin Status', 'Connection', 'Health Score', 'Last Ping'];
    const rows = devices.map((d) => [
      d.deviceCode,
      d.imei,
      d.vehiclePlate || 'N/A',
      d.manufacturer,
      d.model,
      d.protocolName,
      d.status,
      d.connectionStatus,
      `${d.healthScore}%`,
      d.lastPingAt ? new Date(d.lastPingAt).toLocaleString('id-ID') : 'Never'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gps_devices_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            GPS Devices Master Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan pusat perangkat GPS tracker, status koneksi gateway, nomor IMEI, dan integrasi kendaraan.
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

      {/* Search & Multi-Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Device ID, Code, IMEI, Plat, SIM, Model..."
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

        {/* Connection Status */}
        <div>
          <select
            value={connectionFilter}
            onChange={(e) => setConnectionFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Koneksi: Semua</option>
            <option value="online">● Online</option>
            <option value="offline">● Offline</option>
            <option value="delayed">● Delayed</option>
            <option value="never_connected">Never Connected</option>
          </select>
        </div>

        {/* Health Status */}
        <div>
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Health: Semua</option>
            <option value="healthy">Healthy (&ge; 80%)</option>
            <option value="warning">Warning (50-79%)</option>
            <option value="critical">Critical (&lt; 50%)</option>
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
      </div>

      {/* Sensitive IMEI Masking Toggle Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>Menampilkan {devices.length} perangkat GPS</span>
        <button
          onClick={() => setShowMaskedIMEI(!showMaskedIMEI)}
          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          {showMaskedIMEI ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>{showMaskedIMEI ? 'Tampilkan Full IMEI' : 'Masking IMEI Sensitif'}</span>
        </button>
      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Device Code</th>
                <th className="px-4 py-3.5">IMEI</th>
                <th className="px-4 py-3.5">Kendaraan Alokasi</th>
                <th className="px-4 py-3.5">Protocol & Model</th>
                <th className="px-4 py-3.5">Connection</th>
                <th className="px-4 py-3.5">Last Ping</th>
                <th className="px-4 py-3.5 text-center">Health Score</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Cpu className="h-8 w-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    Tidak ada perangkat GPS yang sesuai dengan kriteria pencarian.
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
                      {/* Code */}
                      <td className="px-4 py-3.5 font-bold text-white font-mono">
                        <div className="flex items-center gap-2">
                          <Radio className="h-3.5 w-3.5 text-cyan-400" />
                          <span>{device.deviceCode}</span>
                        </div>
                      </td>

                      {/* IMEI */}
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {device.imei}
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3.5">
                        {device.vehiclePlate ? (
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                            <Truck className="h-3.5 w-3.5 text-amber-400" />
                            <span>{device.vehiclePlate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Belum Teralokasi</span>
                        )}
                      </td>

                      {/* Protocol */}
                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="font-semibold text-slate-200">{device.manufacturer} {device.model}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{device.protocolName}</div>
                      </td>

                      {/* Connection */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            device.connectionStatus === 'online'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : device.connectionStatus === 'delayed'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              device.connectionStatus === 'online'
                                ? 'bg-emerald-400 animate-ping'
                                : device.connectionStatus === 'delayed'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          {device.connectionStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Last Ping */}
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                        {device.lastPingAt
                          ? new Date(device.lastPingAt).toLocaleTimeString('id-ID')
                          : 'Never'}
                      </td>

                      {/* Health Score */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
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
                          <span className="font-bold font-mono text-slate-200">{device.healthScore}%</span>
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

      {/* Mobile Device List (Cards Layout - Section 6 Requirement) */}
      <div className="grid md:hidden grid-cols-1 gap-3">
        {devices.length === 0 ? (
          <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-2xl bg-slate-900/60">
            Tidak ada perangkat GPS terdaftar.
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                    📡 {device.deviceCode}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    IMEI {device.imei}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    device.connectionStatus === 'online'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  ● {device.connectionStatus.toUpperCase()}
                </span>
              </div>

              {/* Vehicle & Ping */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Truck className="h-3.5 w-3.5" />
                  <span>{device.vehiclePlate || 'Belum Ditugaskan'}</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Ping: {device.lastPingAt ? new Date(device.lastPingAt).toLocaleTimeString('id-ID') : 'Never'}
                </span>
              </div>

              {/* Health Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Device Health</span>
                  <span className="text-slate-200 font-mono">{device.healthScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
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
              </div>

              {/* Protocol & Firmware info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>{device.protocolName} • {device.firmwareVersion}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDevice(device);
                  }}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold text-[11px]"
                >
                  View Device
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
