/**
 * Fleet Intelligence Smart AI - GPS Integration: Real-Time Message Monitor Tab
 * PROMPT 43: Streaming Packet Inspector, Pipeline Stage Breakdown & Payload Decoder
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  Play,
  Pause,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Code,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { EnrichedGPSMessage, RawGPSMessage } from '../../../../types/gpsIntegration';
import { gpsIntegrationService } from '../../../../services/gps/gpsIntegrationService';

export const RealtimeMessageMonitorTab: React.FC = () => {
  const [messages, setMessages] = useState<EnrichedGPSMessage[]>(gpsIntegrationService.getEnrichedMessages());
  const [rawMessages, setRawMessages] = useState<RawGPSMessage[]>(gpsIntegrationService.getRawMessages());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<EnrichedGPSMessage | null>(
    gpsIntegrationService.getEnrichedMessages()[0] || null
  );
  const [viewMode, setViewMode] = useState<'ENRICHED' | 'RAW'>('ENRICHED');
  const [filterTransport, setFilterTransport] = useState<string>('ALL');

  useEffect(() => {
    const unsub = gpsIntegrationService.subscribePipeline((enriched) => {
      if (!isPaused) {
        setMessages(gpsIntegrationService.getEnrichedMessages());
        setRawMessages(gpsIntegrationService.getRawMessages());
      }
    });
    return () => unsub();
  }, [isPaused]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" /> Real-Time Telemetry Pipeline Stream
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring live paket GPS yang masuk ke gateway, didecode oleh Protocol Adapter, dan dinormalisasi secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isPaused
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Stream Feed & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Live Packet Stream */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 font-mono">
              Live Ingest Feed ({messages.length} packets in buffer)
            </span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold">STREAMING</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 font-mono text-xs">
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">{msg.vehiclePlate || msg.imei}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {msg.speed} km/h
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        Fuel {msg.fuelLevel}%
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        msg.quality === 'EXCELLENT'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {msg.quality}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Lat: {msg.latitude.toFixed(4)}, Lng: {msg.longitude.toFixed(4)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Packet Deep Inspector */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Code className="h-4 w-4 text-cyan-400" /> Unified Normalized Model Inspector
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">Canonical Schema v1.0</span>
          </div>

          {selectedMessage ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Packet ID:</span>
                  <span className="text-slate-200 font-bold">{selectedMessage.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Device IMEI:</span>
                  <span className="text-cyan-300 font-bold">{selectedMessage.imei}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vehicle Context:</span>
                  <span className="text-white font-bold">{selectedMessage.vehiclePlate} ({selectedMessage.vehicleName})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Driver Context:</span>
                  <span className="text-slate-200">{selectedMessage.driverName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tenant / Company:</span>
                  <span className="text-emerald-400 font-bold">{selectedMessage.tenantId} / {selectedMessage.companyId}</span>
                </div>
              </div>

              {/* JSON Payload Viewer */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Normalized JSON Structure:
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-[300px] overflow-y-auto text-[11px] text-slate-300 leading-relaxed font-mono">
                  <pre>{JSON.stringify(selectedMessage, null, 2)}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">Pilih paket untuk melihat detail inspeksi.</div>
          )}
        </div>
      </div>
    </div>
  );
};
