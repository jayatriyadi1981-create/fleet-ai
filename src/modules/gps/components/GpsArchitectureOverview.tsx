/**
 * Fleet Intelligence Smart AI - GPS Architecture Diagram & Concept Overview
 */

import React from 'react';
import { 
  Radio, 
  Cpu, 
  Filter, 
  Database, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Clock,
  Lock,
  UserCheck
} from 'lucide-react';

export const GpsArchitectureOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Layers className="h-3.5 w-3.5" /> PROMPT 12 — GPS TELEMATICS ARCHITECTURE
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Arsitektur Telematika & GPS Ingestion Scalable Multi-Tenant
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Fondasi pengolahan telemetry real-time multi-protocol (GT06, Teltonika Codec 8, Queclink, HTTP Webhook) 
              dengan perlindungan integritas historical data, snapshot driver attribution, deduplikasi paket, dan event engine cerdas.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Status Sistem</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> READY & ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Data Flow Pipeline Diagram */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" /> Diagram Alur Data Telemetry (End-to-End Pipeline)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STAGE 01
              </span>
              <Radio className="h-4 w-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Device & Protocol Ingestion</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Menerima data dari berbagai IoT tracker (GT06, Teltonika, Queclink, HTTP Webhook) via TCP/UDP/REST.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
              <div>✓ Multi-Protocol Handshake</div>
              <div>✓ Checksum & Raw Payload Log</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STAGE 02
              </span>
              <Filter className="h-4 w-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Parser & Normalizer</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Ekstraksi frame menjadi model canonical <code className="text-cyan-300 font-mono">NormalizedTelemetry</code> &amp; validasi presisi koordinat.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
              <div>✓ Bounds Check [-90..90, -180..180]</div>
              <div>✓ Deduplikasi (seq + timestamp)</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STAGE 03
              </span>
              <UserCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Attribution & Immutable History</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Snapshot pengemudi aktif pada timestamp paket &amp; penyimpanan telemetry historis tanpa overwrite.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
              <div>✓ Driver Attribution Snapshot</div>
              <div>✓ Out-of-Order Cache Protection</div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STAGE 04
              </span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Event Engine & Pub/Sub Bus</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Deteksi otomatis Ignition ON/OFF, Overspeed, Moving, Low Voltage &amp; penyiaran ke UI Live Tracking.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
              <div>✓ GpsRule Engine Evaluation</div>
              <div>✓ Realtime EventBus Dispatch</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Architectural Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
            <Clock className="h-4 w-4" /> Pemisahan Timestamp yang Jelas
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sistem membedakan secara tegas <span className="text-white font-mono">deviceTimestamp</span> (waktu GPS),{' '}
            <span className="text-white font-mono">serverReceivedAt</span> (waktu diterima server), dan{' '}
            <span className="text-white font-mono">processedAt</span> (waktu selesai diproses).
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
            <Lock className="h-4 w-4" /> Provider-Agnostic Adapter Pattern
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Logic domain tidak bergantung pada satu merk GPS. Menggunakan antarmuka <span className="text-white font-mono">GpsProvider</span>{' '}
            yang mempermudah integrasi merek baru tanpa mengubah core bisnis logic.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
            <ShieldCheck className="h-4 w-4" /> Keamanan & Isolation Multi-Tenant
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Semua entitas (<span className="text-white font-mono">GpsTelemetry</span>, <span className="text-white font-mono">RawGpsMessage</span>, <span className="text-white font-mono">GpsEvent</span>)
            wajib menyertakan <span className="text-white font-mono">tenantId</span> untuk menjamin isolasi data antar tenant.
          </p>
        </div>
      </div>
    </div>
  );
};
