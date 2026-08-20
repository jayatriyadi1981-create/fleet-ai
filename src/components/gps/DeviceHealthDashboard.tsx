/**
 * Fleet Intelligence Smart AI - Device Health Dashboard & Analytics View
 * Complete 6-State Device Health Monitoring (Online, Offline, Weak signal, GPS lost, Power disconnected, Battery low)
 */

import React, { useState, useMemo } from 'react';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { GPSDeviceExtended, SpecificDeviceHealth } from '../../types/gps';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  WifiOff,
  Zap,
  Radio,
  Cpu,
  Truck,
  Filter,
  ArrowUpDown,
  DownloadCloud,
  PowerOff,
  MapPinOff,
  BatteryWarning,
  BatteryCharging,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface DeviceHealthDashboardProps {
  onSelectDevice: (device: GPSDeviceExtended) => void;
}

export const DeviceHealthDashboard: React.FC<DeviceHealthDashboardProps> = ({ onSelectDevice }) => {
  const [selectedHealthFilter, setSelectedHealthFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'healthScore' | 'lastPing' | 'satellites'>('healthScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const devices = useMemo(() => gpsDeviceService.listDevices(), []);

  // Health Metrics
  const metrics = useMemo(() => {
    return {
      total: devices.length,
      online: devices.filter((d) => d.specificHealth === 'online').length,
      offline: devices.filter((d) => d.specificHealth === 'offline').length,
      weak_signal: devices.filter((d) => d.specificHealth === 'weak_signal').length,
      gps_lost: devices.filter((d) => d.specificHealth === 'gps_lost').length,
      power_disconnected: devices.filter((d) => d.specificHealth === 'power_disconnected').length,
      battery_low: devices.filter((d) => d.specificHealth === 'battery_low').length
    };
  }, [devices]);

  // Filtered & Sorted Devices
  const filteredDevices = useMemo(() => {
    let list = [...devices];

    if (selectedHealthFilter !== 'all') {
      list = list.filter((d) => d.specificHealth === selectedHealthFilter);
    }

    list.sort((a, b) => {
      // Prioritize critical issues first if default
      if (sortField === 'healthScore') {
        return sortOrder === 'asc' ? a.healthScore - b.healthScore : b.healthScore - a.healthScore;
      }
      if (sortField === 'satellites') {
        const satA = a.satellitesCount || 0;
        const satB = b.satellitesCount || 0;
        return sortOrder === 'asc' ? satA - satB : satB - satA;
      }
      const pingA = a.lastPingAt ? new Date(a.lastPingAt).getTime() : 0;
      const pingB = b.lastPingAt ? new Date(b.lastPingAt).getTime() : 0;
      return sortOrder === 'asc' ? pingA - pingB : pingB - pingA;
    });

    return list;
  }, [devices, selectedHealthFilter, sortField, sortOrder]);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-400" />
            GPS Device Health & Diagnostics Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit kesehatan telematika: 6 kondisi pemantauan status (Online, Offline, Weak signal, GPS lost, Power disconnected, Battery low).
          </p>
        </div>
      </div>

      {/* 6 Device Health Interactive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Online */}
        <button
          onClick={() => setSelectedHealthFilter(selectedHealthFilter === 'online' ? 'all' : 'online')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedHealthFilter === 'online'
              ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
              : 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Online</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{metrics.online}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Streaming Aktif</div>
        </button>

        {/* 2. Offline */}
        <button
          onClick={() => setSelectedHealthFilter(selectedHealthFilter === 'offline' ? 'all' : 'offline')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedHealthFilter === 'offline'
              ? 'border-slate-500 bg-slate-800 shadow-lg'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Offline</span>
            <WifiOff className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-300 font-mono mt-1">{metrics.offline}</div>
          <div className="text-[10px] text-slate-500 mt-1">Timeout Gateway</div>
        </button>

        {/* 3. Weak Signal */}
        <button
          onClick={() => setSelectedHealthFilter(selectedHealthFilter === 'weak_signal' ? 'all' : 'weak_signal')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedHealthFilter === 'weak_signal'
              ? 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20'
              : 'border-amber-500/30 bg-amber-500/10 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-300">Weak Signal</span>
            <Wifi className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{metrics.weak_signal}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Latency / GSM Lemah</div>
        </button>

        {/* 4. GPS Lost */}
        <button
          onClick={() => setSelectedHealthFilter(selectedHealthFilter === 'gps_lost' ? 'all' : 'gps_lost')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedHealthFilter === 'gps_lost'
              ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
              : 'border-purple-500/30 bg-purple-500/10 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-300">GPS Lost</span>
            <MapPinOff className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">{metrics.gps_lost}</div>
          <div className="text-[10px] text-purple-400/80 mt-1">0-1 Satelit Kunci</div>
        </button>

        {/* 5. Power Disconnected */}
        <button
          onClick={() => setSelectedHealthFilter(selectedHealthFilter === 'power_disconnected' ? 'all' : 'power_disconnected')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedHealthFilter === 'power_disconnected'
              ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20'
              : 'border-orange-500/30 bg-orange-500/10 hover:border-orange-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-orange-300">Power Disconnected</span>
            <PowerOff className="h-3.5 w-3.5 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400 font-mono mt-1">{metrics.power_disconnected}</div>
          <div className="text-[10px] text-orange-400/80 mt-1">Aki 0.0V (Kabel Lepas)</div>
        </button>

        {/* 6. Battery Low */}
        <button
          onClick={() => setSelectedHealthFilter(selectedHealthFilter === 'battery_low' ? 'all' : 'battery_low')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedHealthFilter === 'battery_low'
              ? 'border-rose-500 bg-rose-500/20 shadow-lg shadow-rose-500/20'
              : 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-300">Battery Low</span>
            <BatteryWarning className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">{metrics.battery_low}</div>
          <div className="text-[10px] text-rose-400/80 mt-1">Backup &lt; 20%</div>
        </button>
      </div>

      {/* Filter Active Reset Notice */}
      {selectedHealthFilter !== 'all' && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-300">
            Menampilkan filter status: <strong className="text-white uppercase font-mono">{selectedHealthFilter}</strong> ({filteredDevices.length} unit)
          </span>
          <button
            onClick={() => setSelectedHealthFilter('all')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Tampilkan Semua Perangkat
          </button>
        </div>
      )}

      {/* Health Table with Priority Sorting */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-cyan-400" />
            Matriks Audit Kesehatan Perangkat ({filteredDevices.length} Unit)
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Urutkan:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="healthScore">Health Score (Paling Berisiko)</option>
              <option value="satellites">Satelit GPS Terkunci</option>
              <option value="lastPing">Waktu Ping Terakhir</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Device Code & ID</th>
                <th className="px-4 py-3.5">IMEI</th>
                <th className="px-4 py-3.5">Kendaraan</th>
                <th className="px-4 py-3.5">Health State (6 Kondisi)</th>
                <th className="px-4 py-3.5">GPS Signal & Fix</th>
                <th className="px-4 py-3.5">Power & Baterai</th>
                <th className="px-4 py-3.5">Last Connection</th>
                <th className="px-4 py-3.5 text-center">Score</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    Tidak ada perangkat dengan status kesehatan ini.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    onClick={() => onSelectDevice(device)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white font-mono flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{device.deviceCode}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{device.id}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {device.imei}
                    </td>

                    <td className="px-4 py-3.5">
                      {device.vehiclePlate ? (
                        <div className="font-bold text-amber-300 flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5" />
                          <span>{device.vehiclePlate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Stok Gudang</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {getHealthBadge(device.specificHealth)}
                    </td>

                    <td className="px-4 py-3.5 text-slate-300">
                      <div className="font-semibold text-slate-200">
                        {device.satellitesCount ? `${device.satellitesCount} Sat` : '0 Sat'}
                        <span className="text-[10px] text-slate-400 ml-1">({device.gpsAccuracyMeters || 10}m)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono">
                        Fix: {device.gpsFixStatus || '3D'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      <div>Aki: <strong className={device.externalVoltage && device.externalVoltage > 10 ? 'text-white' : 'text-rose-400 font-bold'}>{device.externalVoltage || 0}V</strong></div>
                      <div className="text-[10px] text-slate-400">Li-Po: {device.batteryVoltage || 3.7}V ({device.batteryPercent || 50}%)</div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-300">
                      <div className="text-[11px] font-medium text-slate-200">
                        {device.lastConnection || (device.lastPingAt ? new Date(device.lastPingAt).toLocaleTimeString('id-ID') : 'Never')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {device.connectionLatencyMs || 45}ms Latency
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`font-mono font-black text-xs ${
                          device.healthScore >= 80
                            ? 'text-emerald-400'
                            : device.healthScore >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {device.healthScore}%
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectDevice(device)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                      >
                        Detail →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
