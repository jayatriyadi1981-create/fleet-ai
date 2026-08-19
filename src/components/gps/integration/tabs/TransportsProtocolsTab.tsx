/**
 * Fleet Intelligence Smart AI - GPS Integration: Transports & Protocols Registry Tab
 * PROMPT 43: Transport Layer Adapters, Port Configurations, TLS/Security & Future Protocol Extensibility
 */

import React, { useState } from 'react';
import {
  Network,
  Radio,
  Server,
  Lock,
  Plus,
  CheckCircle2,
  Sliders,
  Shield,
  Clock,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { ProtocolTransport } from '../../../../types/gpsIntegration';

interface TransportConfig {
  id: string;
  name: string;
  transport: ProtocolTransport;
  port: number;
  protocolFamilies: string[];
  tlsEnabled: boolean;
  maxConnections: number;
  readTimeoutSec: number;
  idleTimeoutSec: number;
  rateLimitPerIp: number;
  status: 'ACTIVE' | 'TESTING' | 'DISABLED';
  description: string;
}

export const TransportsProtocolsTab: React.FC = () => {
  const [transports, setTransports] = useState<TransportConfig[]>([
    {
      id: 'tr-tcp-teltonika',
      name: 'TCP Ingress - Teltonika Codec 8/16',
      transport: 'TCP',
      port: 5001,
      protocolFamilies: ['Codec 8', 'Codec 8 Extended', 'Codec 16'],
      tlsEnabled: true,
      maxConnections: 10000,
      readTimeoutSec: 60,
      idleTimeoutSec: 300,
      rateLimitPerIp: 120,
      status: 'ACTIVE',
      description: 'High performance asynchronous binary TCP socket listener with CRC16 validation.'
    },
    {
      id: 'tr-tcp-concox',
      name: 'TCP Ingress - Concox / Jimi GT06',
      transport: 'TCP',
      port: 5002,
      protocolFamilies: ['GT06 Binary', 'WeTrack', 'JT808'],
      tlsEnabled: false,
      maxConnections: 10000,
      readTimeoutSec: 60,
      idleTimeoutSec: 300,
      rateLimitPerIp: 120,
      status: 'ACTIVE',
      description: 'Binary packet decoder with 0x7878 / 0x7979 start bit recognition and login handshakes.'
    },
    {
      id: 'tr-tcp-queclink',
      name: 'TCP Ingress - Queclink @Track',
      transport: 'TCP',
      port: 5003,
      protocolFamilies: ['@Track ASCII', '@Track Binary', 'GL-series'],
      tlsEnabled: false,
      maxConnections: 5000,
      readTimeoutSec: 90,
      idleTimeoutSec: 450,
      rateLimitPerIp: 100,
      status: 'ACTIVE',
      description: 'ASCII text & hybrid packet listener for Queclink enterprise tracking units.'
    },
    {
      id: 'tr-mqtt-broker',
      name: 'MQTT Telematics Ingestion Broker',
      transport: 'MQTT',
      port: 1883,
      protocolFamilies: ['Standard MQTT JSON Schema v1', 'Custom IoT'],
      tlsEnabled: true,
      maxConnections: 25000,
      readTimeoutSec: 30,
      idleTimeoutSec: 180,
      rateLimitPerIp: 300,
      status: 'ACTIVE',
      description: 'Lightweight publish/subscribe broker for smart telematics hubs and cloud-to-cloud gateways.'
    },
    {
      id: 'tr-http-rest',
      name: 'REST / Webhook Ingestion Endpoint',
      transport: 'HTTPS',
      port: 8080,
      protocolFamilies: ['REST Ingest API v2', 'Batch Telemetry'],
      tlsEnabled: true,
      maxConnections: 50000,
      readTimeoutSec: 15,
      idleTimeoutSec: 60,
      rateLimitPerIp: 600,
      status: 'ACTIVE',
      description: 'TLS-secured HTTPS endpoint accepting JSON payloads from partner ERPs and vendor clouds.'
    },
    {
      id: 'tr-ws-realtime',
      name: 'WebSocket Realtime Ingestion & Stream',
      transport: 'WebSocket',
      port: 8081,
      protocolFamilies: ['WSS Telemetry Stream', 'Live Map Feed'],
      tlsEnabled: true,
      maxConnections: 15000,
      readTimeoutSec: 45,
      idleTimeoutSec: 120,
      rateLimitPerIp: 240,
      status: 'ACTIVE',
      description: 'Bidirectional low-latency WSS connection for dashboard streaming and remote control.'
    },
    {
      id: 'tr-future-grpc',
      name: 'gRPC High-Throughput Bridge (Planned)',
      transport: 'gRPC',
      port: 50051,
      protocolFamilies: ['Protobuf Telemetry v1'],
      tlsEnabled: true,
      maxConnections: 50000,
      readTimeoutSec: 10,
      idleTimeoutSec: 60,
      rateLimitPerIp: 1000,
      status: 'TESTING',
      description: 'Extensible microservice adapter for ultra high volume enterprise telematics (100k+ devices).'
    }
  ]);

  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [selectedTransport, setSelectedTransport] = useState<TransportConfig | null>(null);

  return (
    <div className="space-y-6">
      {/* Header with Extensibility Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="h-5 w-5 text-cyan-400" /> Supported Transport Protocols &amp; Gateway Adapters
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar transport adapter aktif (TCP, HTTP, MQTT, WebSocket, gRPC). Desain modular memungkinkan penambahan UDP, Kafka, atau AMQP tanpa merombak core engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSecret(!showSecret)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-all"
          >
            {showSecret ? <EyeOff className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-slate-400" />}
            <span>{showSecret ? 'Hide Secrets' : 'Reveal Secrets'}</span>
          </button>
        </div>
      </div>

      {/* Transport Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transports.map((tr) => (
          <div
            key={tr.id}
            className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/40 p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{tr.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60">
                        {tr.transport}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        Port {tr.port}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    tr.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : tr.status === 'TESTING'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tr.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">{tr.description}</p>

              {/* Supported Protocols Tags */}
              <div className="mt-3">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Protocols Decoded:
                </span>
                <div className="flex flex-wrap gap-1">
                  {tr.protocolFamilies.map((pf, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {pf}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Config Metrics */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block">TLS / SSL</span>
                <span className={tr.tlsEnabled ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {tr.tlsEnabled ? 'Enabled' : 'Raw TCP'}
                </span>
              </div>
              <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block">Idle Timeout</span>
                <span className="text-cyan-300 font-bold">{tr.idleTimeoutSec}s</span>
              </div>
              <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 block">Rate Limit</span>
                <span className="text-purple-300 font-bold">{tr.rateLimitPerIp}/m</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secret Management Abstraction Box */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Secret Management &amp; Credential Vault</h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Encrypted AES-256 GCM
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Kredensial sensitif (MQTT password, TLS client certificates, Vendor API keys) disimpan terenkripsi di vault dan tidak pernah diekspos plaintext ke antarmuka publik.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">MQTT_BROKER_PASSWORD</span>
            <span className="text-slate-300 font-bold">
              {showSecret ? 'm2m_broker_prod_9921_sec' : '••••••••••••••••••••••••'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">GPS_GATEWAY_HMAC_KEY</span>
            <span className="text-slate-300 font-bold">
              {showSecret ? 'hmac_sha256_k9821_live_auth' : '••••••••••••••••••••••••'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">TLS_CLIENT_CERT_FINGERPRINT</span>
            <span className="text-cyan-400 font-bold">
              SHA256:7A:B2:91:E4:...:C0:11
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
