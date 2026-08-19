/**
 * Fleet Intelligence Smart AI - Super Admin System Health & Microservices Tab (Prompt 42)
 * Live Infrastructure Monitoring: Microservice Clusters, Multi-Region Ingress,
 * CPU/RAM/Disk IOPS Telemetry, WebSocket Concurrency, and Redis Cache Hit Rates.
 */

import React from 'react';
import { MicroserviceHealthItem, SystemResourceMetrics } from '../../types/superAdmin';
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Database,
  Radio,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Zap,
} from 'lucide-react';

interface SuperAdminHealthTabProps {
  microservices: MicroserviceHealthItem[];
  resourceMetrics: SystemResourceMetrics;
}

export const SuperAdminHealthTab: React.FC<SuperAdminHealthTabProps> = ({
  microservices,
  resourceMetrics,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Kesehatan Sistem & Infrastruktur Cloud Microservices</h2>
        <p className="text-xs text-slate-400">
          Monitoring 8 subsystem inti, node instance, pemakaian hardware server, koneksi WebSocket, dan latensi regional.
        </p>
      </div>

      {/* Resource Utilization Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Meter */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-cyan-400" /> CPU Cluster
            </span>
            <span className="font-mono font-bold text-white">{resourceMetrics.cpuUsagePercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${resourceMetrics.cpuUsagePercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 block">Autoscaling threshold: 80%</span>
        </div>

        {/* Memory Meter */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-purple-400" /> RAM Memory
            </span>
            <span className="font-mono font-bold text-white">{resourceMetrics.memoryUsagePercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${resourceMetrics.memoryUsagePercent}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 block">37.2 GB / 64 GB Alokasi</span>
        </div>

        {/* WebSocket Concurrency */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="h-4 w-4 text-emerald-400" /> WebSockets Live
            </span>
            <span className="font-mono font-bold text-emerald-400">{resourceMetrics.activeWebsockets}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '42%' }} />
          </div>
          <span className="text-[10px] text-slate-500 block">Ingestion: {resourceMetrics.ingestionMsgsSec} msgs/s</span>
        </div>

        {/* Redis Cache & DB */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-4 w-4 text-amber-400" /> Redis Cache Hit
            </span>
            <span className="font-mono font-bold text-white">{resourceMetrics.redisCacheHitRate}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${resourceMetrics.redisCacheHitRate}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 block">DB Pool: {resourceMetrics.dbConnectionPoolUsed}/{resourceMetrics.dbConnectionPoolMax}</span>
        </div>
      </div>

      {/* Microservices Full Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Daftar Subsystem & Microservices Platform</h3>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Semua Service Operasional
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Nama Microservice</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Versi Rilis</th>
                <th className="px-4 py-3">Node Instances</th>
                <th className="px-4 py-3">Region Cloud</th>
                <th className="px-4 py-3">SLA Uptime</th>
                <th className="px-4 py-3 text-right">Latensi & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {microservices.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-sans font-bold text-white">
                    <div className="flex items-center gap-2">
                      <Server className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{srv.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-400">{srv.category}</td>
                  <td className="px-4 py-3 text-slate-300">{srv.version}</td>
                  <td className="px-4 py-3 text-slate-300">{srv.instancesCount} Pods</td>
                  <td className="px-4 py-3 text-slate-400 font-sans text-[11px]">{srv.region}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">{srv.uptimePercent}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" /> {srv.latencyMs}ms OK
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
