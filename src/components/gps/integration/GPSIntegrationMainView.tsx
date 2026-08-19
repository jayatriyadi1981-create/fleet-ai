/**
 * Fleet Intelligence Smart AI - GPS Integration & Protocol Abstraction Layer Master View
 * PROMPT 43: Comprehensive Multi-Protocol GPS Hub & Device Management Control Center
 */

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Network,
  Cpu,
  Radio,
  Sliders,
  Terminal,
  AlertTriangle,
  Play,
  Code,
  ShieldCheck,
  Zap,
  Server,
  RefreshCw,
  Search
} from 'lucide-react';

import { PipelineHealthTab } from './tabs/PipelineHealthTab';
import { TransportsProtocolsTab } from './tabs/TransportsProtocolsTab';
import { VendorCatalogTab } from './tabs/VendorCatalogTab';
import { DeviceRegistryDiscoveryTab } from './tabs/DeviceRegistryDiscoveryTab';
import { LiveConnectionMonitorTab } from './tabs/LiveConnectionMonitorTab';
import { RealtimeMessageMonitorTab } from './tabs/RealtimeMessageMonitorTab';
import { DataQualityAnomalyTab } from './tabs/DataQualityAnomalyTab';
import { RemoteCommandsQueueTab } from './tabs/RemoteCommandsQueueTab';
import { DeadLetterQueueTab } from './tabs/DeadLetterQueueTab';
import { GpsSimulatorTab } from './tabs/GpsSimulatorTab';
import { ParserWorkbenchTab } from './tabs/ParserWorkbenchTab';

import { gpsIntegrationService } from '../../../services/gps/gpsIntegrationService';

export type GPSIntegrationTabId =
  | 'health'
  | 'transports'
  | 'vendors'
  | 'devices'
  | 'connections'
  | 'stream'
  | 'quality'
  | 'commands'
  | 'dlq'
  | 'simulator'
  | 'workbench';

export const GPSIntegrationMainView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GPSIntegrationTabId>('health');
  const kpis = gpsIntegrationService.getSystemKPIs();

  const tabs: { id: GPSIntegrationTabId; label: string; icon: any; badge?: string | number }[] = [
    { id: 'health', label: 'Pipeline & Health', icon: Activity },
    { id: 'transports', label: 'Transports & Protocols', icon: Network },
    { id: 'vendors', label: 'Vendor Capabilities', icon: Cpu },
    { id: 'devices', label: 'Device Registry & Discovery', icon: Layers, badge: kpis.discoveryPendingCount > 0 ? `${kpis.discoveryPendingCount} new` : undefined },
    { id: 'connections', label: 'Socket Sessions', icon: Radio, badge: kpis.activeConnections },
    { id: 'stream', label: 'Live Stream', icon: Zap },
    { id: 'quality', label: 'Data Quality & Anomaly', icon: ShieldCheck },
    { id: 'commands', label: 'Remote Commands', icon: Terminal },
    { id: 'dlq', label: 'Dead Letter Queue', icon: AlertTriangle, badge: kpis.dlqPendingCount > 0 ? kpis.dlqPendingCount : undefined },
    { id: 'simulator', label: 'Telematics Simulator', icon: Play },
    { id: 'workbench', label: 'Parser Workbench', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
              <Network className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                GPS Integration &amp; Device Protocol Abstraction Layer
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Vendor-agnostic telematics gateway: Multi-transport ingestion (TCP/HTTP/MQTT/WS), Canonical Normalization, Dead Letter Queue &amp; Hardware Abstraction.
              </p>
            </div>
          </div>
        </div>

        {/* Global Pipeline Health Status Pill */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Throughput:</span>
            <span className="text-cyan-400 font-bold">{kpis.messagesPerSec} msg/s</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className="text-slate-300">Success:</span>
            <span className="text-emerald-400 font-bold">{kpis.parserSuccessRate}%</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className="text-slate-300">Latency:</span>
            <span className="text-cyan-300 font-bold">{kpis.avgLatencyMs} ms</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950 font-bold'
                  : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View Content */}
      <div className="pt-2">
        {activeTab === 'health' && <PipelineHealthTab onNavigateTab={(t) => setActiveTab(t)} />}
        {activeTab === 'transports' && <TransportsProtocolsTab />}
        {activeTab === 'vendors' && <VendorCatalogTab />}
        {activeTab === 'devices' && <DeviceRegistryDiscoveryTab />}
        {activeTab === 'connections' && <LiveConnectionMonitorTab />}
        {activeTab === 'stream' && <RealtimeMessageMonitorTab />}
        {activeTab === 'quality' && <DataQualityAnomalyTab />}
        {activeTab === 'commands' && <RemoteCommandsQueueTab />}
        {activeTab === 'dlq' && <DeadLetterQueueTab />}
        {activeTab === 'simulator' && <GpsSimulatorTab />}
        {activeTab === 'workbench' && <ParserWorkbenchTab />}
      </div>
    </div>
  );
};
