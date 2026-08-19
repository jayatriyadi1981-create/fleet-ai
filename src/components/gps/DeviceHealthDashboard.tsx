/**
 * Fleet Intelligence Smart AI - Device Health Dashboard & Analytics View
 * PROMPT 10 - Enterprise Health Monitoring, Priority Sorting & Signal Audit
 */

import React, { useState } from 'react';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { GPSDeviceExtended } from '../../types/gps';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  Zap,
  Radio,
  Cpu,
  Truck,
  Filter,
  ArrowUpDown,
  DownloadCloud
} from 'lucide-react';

interface DeviceHealthDashboardProps {
  onSelectDevice: (device: GPSDeviceExtended) => void;
}

export const DeviceHealthDashboard: React.FC<DeviceHealthDashboardProps> = ({ onSelectDevice }) => {
  const devices = gpsDeviceService.listDevices();

  const total = devices.length;
  const online = devices.filter((d) => d.connectionStatus === 'online').length;
  const offline = devices.filter((d) => d.connectionStatus === 'offline').length;
  const delayed = devices.filter((d) => d.connectionStatus === 'delayed').length;

  const healthy = devices.filter((d) => d.healthStatus === 'healthy').length;
  const warning = devices.filter((d) => d.healthStatus === 'warning').length;
  const critical = devices.filter((d) => d.healthStatus === 'critical').length;

  // Priority sorting: Critical -> Warning -> Offline -> Delayed -> Healthy
  const sortedDevices = [...devices].sort((a, b) => {
    const priority = (d: GPSDeviceExtended) => {
      if (d.healthStatus === 'critical') return 1;
      if (d.healthStatus === 'warning') return 2;
      if (d.connectionStatus === 'offline') return 3;
      if (d.connectionStatus === 'delayed') return 4;
      return 5;
    };
    return priority(a) - priority(b);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-400" />
            Device Health & Telematics Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pusat pemantauan kesehatan perangkat GPS, keandalan pingsat, daya aki kendaraan, dan kualitas sinyal satelit.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Total Devices</span>
          <div className="text-xl font-bold text-white font-mono">{total}</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-emerald-300">Online</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">{online}</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-rose-300">Offline</span>
          <div className="text-xl font-bold text-rose-400 font-mono">{offline}</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-amber-300">Delayed</span>
          <div className="text-xl font-bold text-amber-400 font-mono">{delayed}</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Healthy</span>
          <div className="text-xl font-bold text-emerald-300 font-mono">{healthy}</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Warning</span>
          <div className="text-xl font-bold text-amber-300 font-mono">{warning}</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Critical</span>
          <div className="text-xl font-bold text-rose-400 font-mono">{critical}</div>
        </div>
      </div>

      {/* Health Table with Priority Sorting */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-cyan-400" />
            Matriks Audit Kesehatan Perangkat (Diurutkan Berdasarkan Prioritas Risiko)
          </h3>
          <span className="text-xs text-slate-400">Critical &gt; Warning &gt; Offline &gt; Healthy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Device Code</th>
                <th className="px-4 py-3.5">Kendaraan</th>
                <th className="px-4 py-3.5">Connection</th>
                <th className="px-4 py-3.5">Last Ping</th>
                <th className="px-4 py-3.5">GPS Signal</th>
                <th className="px-4 py-3.5">Tegangan Aki</th>
                <th className="px-4 py-3.5">Firmware</th>
                <th className="px-4 py-3.5 text-center">Health Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {sortedDevices.map((device) => (
                <tr
                  key={device.id}
                  onClick={() => onSelectDevice(device)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5 font-bold text-white font-mono">
                    {device.deviceCode}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-amber-300">
                    {device.vehiclePlate || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        device.connectionStatus === 'online'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : device.connectionStatus === 'delayed'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      ● {device.connectionStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-400">
                    {device.lastPingAt ? new Date(device.lastPingAt).toLocaleTimeString('id-ID') : 'Never'}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    {device.satellitesCount ? `${device.satellitesCount} Sat` : 'N/A'}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {device.externalVoltage ? `${device.externalVoltage} V` : '0 V'}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-400">
                    {device.firmwareVersion}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`font-mono font-bold ${
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
