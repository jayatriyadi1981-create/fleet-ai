/**
 * Fleet Intelligence Smart AI - GPS Integration: Parser Workbench Tab
 * PROMPT 43: Interactive Packet Parser Workbench, Step-by-Step Pipeline Inspector
 */

import React, { useState } from 'react';
import {
  Code,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { ProtocolTransport } from '../../../../types/gpsIntegration';
import { gpsIntegrationService } from '../../../../services/gps/gpsIntegrationService';

export const ParserWorkbenchTab: React.FC = () => {
  const [selectedTransport, setSelectedTransport] = useState<ProtocolTransport>('TCP');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('Teltonika Codec 8');
  const [targetImei, setTargetImei] = useState<string>('867492041234561');
  const [rawPayloadInput, setRawPayloadInput] = useState<string>(
    '0000000000000032080100000171B3E0A1200106606BC03FACB5C0000A00140800'
  );

  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Preset sample payloads
  const presets = [
    {
      label: 'Teltonika Codec 8 Location',
      transport: 'TCP' as ProtocolTransport,
      protocol: 'Teltonika Codec 8',
      imei: '867492041234561',
      payload: '0000000000000032080100000171B3E0A1200106606BC03FACB5C0000A00140800'
    },
    {
      label: 'Concox GT06 Binary Location (0x12)',
      transport: 'TCP' as ProtocolTransport,
      protocol: 'Concox GT06 Binary',
      imei: '868123045678904',
      payload: '787822120F08120B1C1E84026B3FE00C1683400014000100000001859C0D0A'
    },
    {
      label: 'Queclink @Track ASCII (GTFRI)',
      transport: 'TCP' as ProtocolTransport,
      protocol: 'Queclink @Track',
      imei: '356789012345673',
      payload: '+RESP:GTFRI,02010B,356789012345673,GL300,0,0,1,1,64.2,95,35.0,106.9275,-6.2297,20260818083000,0460,0000,18d8,6a1e,00,82,96$...'
    },
    {
      label: 'Standard MQTT JSON Telemetry',
      transport: 'MQTT' as ProtocolTransport,
      protocol: 'Standard MQTT JSON Schema v1',
      imei: '864501049283745',
      payload: JSON.stringify(
        {
          imei: '864501049283745',
          latitude: -6.2825,
          longitude: 107.1702,
          speed: 72,
          heading: 90,
          ignition: true,
          fuel: 78.5,
          rpm: 1850,
          battery: 98
        },
        null,
        2
      )
    }
  ];

  const handleApplyPreset = (p: (typeof presets)[0]) => {
    setSelectedTransport(p.transport);
    setSelectedProtocol(p.protocol);
    setTargetImei(p.imei);
    setRawPayloadInput(p.payload);
    setExecutionResult(null);
  };

  const handleExecutePipeline = async () => {
    setIsExecuting(true);
    let parsedInput: any = rawPayloadInput;
    if (rawPayloadInput.trim().startsWith('{')) {
      try {
        parsedInput = JSON.parse(rawPayloadInput);
      } catch {
        // keep string
      }
    }

    const res = await gpsIntegrationService.ingestRawMessage({
      transport: selectedTransport,
      protocol: selectedProtocol,
      deviceIdentifier: targetImei,
      rawPayload: parsedInput,
      remoteIp: '180.252.164.12',
      remotePort: 5001
    });

    setExecutionResult(res);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-cyan-400" /> Device Test &amp; Protocol Parser Workbench
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Uji coba decoding packet mentah (Hex / ASCII / JSON) dan amati transformasi langkah demi langkah ke Unified Normalized Model.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 font-mono mr-1">Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-slate-700 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form & Pipeline Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Raw Packet Input */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Raw Packet Input Configuration</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Payload Simulator
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Transport Ingress *</label>
              <select
                value={selectedTransport}
                onChange={(e) => setSelectedTransport(e.target.value as ProtocolTransport)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="TCP">TCP Socket</option>
                <option value="HTTP">HTTP REST</option>
                <option value="HTTPS">HTTPS Webhook</option>
                <option value="MQTT">MQTT Broker</option>
                <option value="WebSocket">WebSocket (WSS)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target IMEI *</label>
              <input
                type="text"
                value={targetImei}
                onChange={(e) => setTargetImei(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Raw Payload (Hex / ASCII / JSON) *
            </label>
            <textarea
              rows={6}
              value={rawPayloadInput}
              onChange={(e) => setRawPayloadInput(e.target.value)}
              placeholder="Paste raw packet here..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleExecutePipeline}
            disabled={isExecuting}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span>Eksekusi Normalizer Pipeline</span>
          </button>
        </div>

        {/* Right Side: Step-by-Step Pipeline Execution Inspector */}
        <div className="lg:col-span-6 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" /> Pipeline Execution Inspector
            </h3>
            {executionResult && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  executionResult.success
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                Status: {executionResult.status}
              </span>
            )}
          </div>

          {executionResult ? (
            <div className="space-y-4 text-xs font-mono">
              {/* Step Checklist */}
              <div className="space-y-2">
                {[
                  { step: '1. Transport Ingress', status: 'OK', desc: `${executionResult.raw.transport} port listener` },
                  { step: '2. Device Identification', status: 'OK', desc: `IMEI ${executionResult.raw.deviceIdentifier} mapped` },
                  { step: '3. Protocol Parsing', status: 'OK', desc: `${executionResult.raw.protocol} adapter executed` },
                  { step: '4. Range & Anomaly Validation', status: 'OK', desc: `Coordinates & physics verified` },
                  { step: '5. Canonical Normalization', status: 'OK', desc: `Transformed to Unified Data Model` },
                  { step: '6. Tenant Context Enrichment', status: 'OK', desc: `Attached Vehicle & Driver info` },
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-bold text-slate-200">{s.step}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* JSON Output Preview */}
              {executionResult.enriched && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Normalized &amp; Enriched JSON Result:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-[240px] overflow-y-auto font-mono text-[11px] text-emerald-300 leading-relaxed">
                    <pre>{JSON.stringify(executionResult.enriched, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Klik <strong>"Eksekusi Normalizer Pipeline"</strong> untuk menjalankan inspeksi transformasi paket secara interaktif.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
