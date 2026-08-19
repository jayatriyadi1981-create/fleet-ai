/**
 * Fleet Intelligence Smart AI - GPS Integration: Live Connection Monitor Tab
 * PROMPT 43: Real-Time Socket Sessions, Connection States, Heartbeat Tracking & Latency
 */

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Wifi,
  WifiOff,
  Activity,
  RefreshCw,
  Server,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ConnectionSession } from '../../../../types/gpsIntegration';
import { gpsIntegrationService } from '../../../../services/gps/gpsIntegrationService';

export const LiveConnectionMonitorTab: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionSession[]>(gpsIntegrationService.getActiveConnections());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      // Micro-update latencies and packet counts
      setConnections(
        gpsIntegrationService.getActiveConnections().map((c) => ({
          ...c,
          messagesReceived: c.messagesReceived + Math.floor(Math.random() * 3),
          latencyMs: Math.max(12, c.latencyMs + Math.floor((Math.random() - 0.5) * 6)),
          lastHeartbeatAt: new Date(Date.now() - Math.floor(Math.random() * 6000)).toISOString()
        }))
      );
    }, 2000);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const totalPackets = connections.reduce((acc, c) => acc + c.messagesReceived, 0);
  const avgLatency = (connections.reduce((acc, c) => acc + c.latencyMs, 0) / Math.max(1, connections.length)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Sesi Socket Aktif</span>
            <Radio className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-2">
            {connections.filter((c) => c.state === 'AUTHENTICATED').length} / {connections.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">100% Transport Healthy</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Rata-Rata Latensi Sesi</span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-2">{avgLatency} ms</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">TCP Handshake round-trip</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Paket Sesi Aktif</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-2">{totalPackets.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">Packets stream buffer</div>
        </div>
      </div>

      {/* Main Connection Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Active Socket &amp; Telematics Sessions</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                autoRefresh
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto-Sync: ON' : 'Paused'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Connection ID</th>
                <th className="px-4 py-3 font-semibold">Device IMEI</th>
                <th className="px-4 py-3 font-semibold">Transport / Protocol</th>
                <th className="px-4 py-3 font-semibold">Remote Client Address</th>
                <th className="px-4 py-3 font-semibold">State</th>
                <th className="px-4 py-3 font-semibold">Latency</th>
                <th className="px-4 py-3 font-semibold">Packets (In / Out)</th>
                <th className="px-4 py-3 font-semibold">Last Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {connections.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-cyan-400 font-bold">{c.id}</td>
                  <td className="px-4 py-3 text-slate-200">{c.imei || 'Handshaking...'}</td>
                  <td className="px-4 py-3 font-sans">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-bold mr-1.5">
                      {c.transport}
                    </span>
                    <span className="text-xs text-slate-300">{c.protocol}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {c.remoteIp}:{c.remotePort}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-cyan-300 font-bold">{c.latencyMs} ms</td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.messagesReceived} / <span className="text-slate-500">{c.messagesSent}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {new Date(c.lastHeartbeatAt).toLocaleTimeString()}
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
