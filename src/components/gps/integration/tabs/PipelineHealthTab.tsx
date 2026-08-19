/**
 * Fleet Intelligence Smart AI - GPS Integration: Pipeline & Health Dashboard Tab
 * PROMPT 43: Gateway KPIs, Ingestion Pipeline Visualization, Real-Time Ingestion Throughput
 */

import React from 'react';
import {
  Activity,
  Zap,
  Server,
  Radio,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Clock,
  RefreshCw
} from 'lucide-react';
import { gpsIntegrationService } from '../../../../services/gps/gpsIntegrationService';

export const PipelineHealthTab: React.FC<{ onNavigateTab: (tabId: any) => void }> = ({ onNavigateTab }) => {
  const kpis = gpsIntegrationService.getSystemKPIs();

  return (
    <div className="space-y-6">
      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ingestion Throughput</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">{kpis.messagesPerSec}</span>
            <span className="text-xs font-medium text-slate-400">msg / sec</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active streaming pipeline</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Parser Success Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{kpis.parserSuccessRate}%</span>
            <span className="text-xs font-medium text-slate-400">SLA 99.9%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            {kpis.messagesProcessedTotal.toLocaleString()} processed / {kpis.errorCountTotal} errors
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Socket Sessions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-blue-400">{kpis.activeConnections}</span>
            <span className="text-xs font-medium text-slate-400">TCP / MQTT / WS</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Avg Latency: <span className="text-cyan-300 font-bold">{kpis.avgLatencyMs} ms</span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">DLQ &amp; Pending Discovery</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">{kpis.dlqPendingCount}</span>
            <span className="text-xs font-medium text-slate-400">DLQ / {kpis.discoveryPendingCount} unknown</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('dlq')}
              className="text-[11px] text-amber-400 hover:underline font-semibold"
            >
              Review DLQ →
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => onNavigateTab('devices')}
              className="text-[11px] text-cyan-400 hover:underline font-semibold"
            >
              Discovery →
            </button>
          </div>
        </div>
      </div>

      {/* End-to-End Pipeline Visualization */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" /> Unified Ingestion &amp; Abstraction Pipeline Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Data flow dari berbagai transport adapter ke Canonical Normalizer hingga Business Modules &amp; AI Engine.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Pipeline: 100% Operational
          </span>
        </div>

        {/* Pipeline Step Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 mb-1">
              <span>STEP 1: INGESTION</span>
              <Radio className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">Multi-Transport Ingest</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              TCP (5001-5004), HTTP/S (8080), MQTT (1883), WebSocket (8081).
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Latency</span>
              <span className="text-cyan-300 font-bold">~4 ms</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-400 mb-1">
              <span>STEP 2: DECODE &amp; PARSE</span>
              <Cpu className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">Vendor Protocol Adapters</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Teltonika Codec 8/16, Queclink @Track, Concox GT06, Meitrack, Generic.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Parser Match</span>
              <span className="text-purple-300 font-bold">Automatic</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400 mb-1">
              <span>STEP 3: VALIDATE &amp; NORMALIZE</span>
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">Unified Data Model</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Coordinate bounds, speed check, quality grade (Excellent/Good/Invalid), deduplication.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>DLQ Fallback</span>
              <span className="text-emerald-300 font-bold">Guaranteed</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-left relative group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-400 mb-1">
              <span>STEP 4: ENRICH &amp; DISPATCH</span>
              <Zap className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">Event Bus &amp; AI Engine</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Attaches Tenant, Vehicle, Driver &amp; Trip. Streams to Live Map, Alert &amp; AI Copilot.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Subscribers</span>
              <span className="text-amber-300 font-bold">12 Modules</span>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Gateway Ports & Listeners Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" /> Active Transport Listeners
            </h3>
            <span className="text-xs text-slate-400 font-mono">4 Protocols Online</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'TCP Socket Gateway (Teltonika)', port: 5001, tls: 'Optional TLS', status: 'ONLINE', rate: '24 msg/s', conn: 2 },
              { name: 'TCP Socket Gateway (Concox / Jimi)', port: 5002, tls: 'TCP Raw', status: 'ONLINE', rate: '12 msg/s', conn: 1 },
              { name: 'TCP Socket Gateway (Queclink)', port: 5003, tls: 'TCP Raw', status: 'ONLINE', rate: '8 msg/s', conn: 1 },
              { name: 'MQTT Telematics Broker', port: 1883, tls: 'TLS MQTTS Ready', status: 'ONLINE', rate: '6 msg/s', conn: 1 },
              { name: 'REST Webhook Ingest API', port: 8080, tls: 'HTTPS SSL', status: 'ONLINE', rate: '5 msg/s', conn: 'REST' },
              { name: 'WebSocket Realtime Gateway', port: 8081, tls: 'WSS Secure', status: 'ONLINE', rate: '18 msg/s', conn: 1 },
            ].map((gw, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{gw.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Port {gw.port}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{gw.tls}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-cyan-400">{gw.rate}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Sessions: {gw.conn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingestion Pipeline Health Breakdown */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" /> Pipeline Processing Latency
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">Total: ~31 ms</span>
          </div>

          <div className="space-y-3.5">
            {[
              { stage: 'Network Transport Ingress (TCP/HTTP/MQTT)', ms: 4.2, pct: 14, color: 'bg-cyan-500' },
              { stage: 'IMEI Identification & Auth Check', ms: 2.1, pct: 7, color: 'bg-blue-500' },
              { stage: 'Binary / JSON Protocol Parser Execution', ms: 8.6, pct: 28, color: 'bg-purple-500' },
              { stage: 'Coordinate & Precision Range Validation', ms: 3.4, pct: 11, color: 'bg-emerald-500' },
              { stage: 'Canonical Normalizer & Anomaly Scorer', ms: 5.8, pct: 19, color: 'bg-amber-500' },
              { stage: 'Tenant Context Enrichment & Event Dispatch', ms: 7.3, pct: 21, color: 'bg-rose-500' },
            ].map((st, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{st.stage}</span>
                  <span className="font-mono text-slate-400 text-[11px] font-bold">{st.ms} ms</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${st.color} rounded-full`} style={{ width: `${st.pct * 3}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-cyan-200">
              <strong>Zero Business Logic Leakage:</strong> Seluruh modul analitik, Live Map, Geofence, Alert, dan AI mengonsumsi Normalized Data Model. Tidak ada ketergantungan langsung ke format binary/vendor tertentu.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
