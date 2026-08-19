import React, { useState } from 'react';
import { MapPin, Truck, Sparkles, Fuel, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react';

export const HeroVisualPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'telemetry'>('map');

  return (
    <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-950/90 p-2 sm:p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
      {/* Decorative Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-3/4 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

      {/* Mockup Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-[11px] font-bold text-slate-400">FLEET COMMAND CENTER • LIVE MONITORING</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 text-[11px] font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('map')}
            className={`rounded-md px-2.5 py-1 transition-all ${
              activeTab === 'map' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'hover:text-white'
            }`}
          >
            Live Map
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`rounded-md px-2.5 py-1 transition-all ${
              activeTab === 'telemetry' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'hover:text-white'
            }`}
          >
            AI Telemetry
          </button>
        </div>
      </div>

      {/* Mockup Body Content */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Main View Area (Map / Telemetry) */}
        <div className="md:col-span-2 relative min-h-[260px] sm:min-h-[320px] rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden flex flex-col justify-between p-4">
          {/* Map / Radar Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Map Markers Overlay */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg bg-slate-950/80 px-2.5 py-1 border border-slate-800 text-[10px] font-bold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GPS Live Signal: 1,284 Vehicle Nodes</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                Jakarta - Surabaya Corridor
              </span>
            </div>

            {/* Vehicle Card Marker Mock 1 */}
            <div className="absolute top-12 left-6 sm:left-12 rounded-xl border border-emerald-500/40 bg-slate-950/90 p-2.5 shadow-xl backdrop-blur-md max-w-[200px] animate-pulse">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-white">B 9123 XYZ</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">Moving</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">Hino Ranger • 72 km/h</p>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                <span>Solar B35: 68%</span>
                <span className="text-cyan-400">On Route</span>
              </div>
            </div>

            {/* Vehicle Card Marker Mock 2 */}
            <div className="absolute bottom-6 right-6 sm:right-12 rounded-xl border border-amber-500/40 bg-slate-950/90 p-2.5 shadow-xl backdrop-blur-md max-w-[190px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-white">L 8841 AB</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">Idle 24m</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">Isuzu Giga • Rest Area km 166</p>
            </div>
          </div>

          {/* Bottom Floating AI Recommendation Chip */}
          <div className="relative z-10 mt-auto rounded-xl border border-cyan-500/30 bg-cyan-950/70 p-3 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg shadow-cyan-950">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div>
                <p className="text-xs font-bold text-cyan-200">AI Insight: Rute Jakarta - Cirebon Efisien</p>
                <p className="text-[10px] text-slate-300">Potensi efisiensi BBM Rp 1.400.000 dengan menghindari titik macet km 48.</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-cyan-400 shrink-0" />
          </div>
        </div>

        {/* Side KPI Metrics Panel */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Armada</span>
              <Truck className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-extrabold text-white">1,284 Unit</p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400">
              <span className="font-semibold">892 Online Moving</span>
              <span className="text-slate-500">• 210 Idle</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Efisiensi BBM Biosolar</span>
              <Fuel className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-extrabold text-emerald-400">94.2%</p>
            <p className="text-[10px] text-slate-400">Penurunan pemborosan BBM 12.4% minggu ini</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Average Safety Score</span>
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <p className="text-xl font-extrabold text-white">92 / 100</p>
            <p className="text-[10px] text-emerald-400 font-semibold">Tingkat Risiko Rendah (Low Risk)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
