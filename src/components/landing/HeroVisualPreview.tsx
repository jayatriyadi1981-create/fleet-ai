import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  Sparkles,
  Fuel,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  Navigation,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Sliders,
} from 'lucide-react';

export const HeroVisualPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard' | 'ai'>('map');
  const [vehiclePosition, setVehiclePosition] = useState(38); // percentage along route
  const [liveSpeed, setLiveSpeed] = useState(72);

  // Smooth simulated live movement for animated GPS map
  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePosition((prev) => (prev >= 85 ? 15 : prev + 1.2));
      setLiveSpeed((prev) => Math.min(84, Math.max(65, prev + (Math.random() * 4 - 2))));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-950/95 p-3 sm:p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
      {/* Decorative Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-36 w-3/4 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      {/* Mockup Header Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3.5 px-2 sm:px-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 shadow-sm shadow-rose-500/50" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-sm shadow-amber-500/50" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-sm shadow-emerald-500/50" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-slate-200 uppercase">
              Fleet Command Center
            </span>
            <span className="hidden sm:inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30 animate-pulse">
              ● Live Stream 5s
            </span>
          </div>
        </div>

        {/* View Switcher Tabs: Animated GPS Map | Live Dashboard Preview | AI Insight Preview */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-1 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'map'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Animated GPS Map</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Live Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'ai'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Insight Preview</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-3.5">
        {/* TAB 1: ANIMATED GPS MAP */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* Map Canvas with Animated Moving Nodes */}
            <div className="lg:col-span-2 relative min-h-[340px] sm:min-h-[400px] rounded-2xl border border-slate-800/80 bg-slate-900/90 overflow-hidden flex flex-col justify-between p-4 sm:p-5 shadow-inner">
              {/* Radar & Terrain Matrix */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
              
              {/* Simulated Map Route Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {/* Trans-Java Highway Corridor */}
                <path
                  d="M 60,80 Q 200,120 350,190 T 700,280"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M 60,80 Q 200,120 350,190 T 700,280"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                {/* Secondary Corridor (Cirebon - Semarang) */}
                <path
                  d="M 220,130 Q 380,140 520,240"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Waypoint Badges */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-xl bg-slate-950/90 px-3 py-1.5 border border-slate-800 text-xs font-bold text-slate-300 backdrop-blur-md">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Tol Trans Jawa Corridor • KM 142</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
                  <Navigation className="h-3.5 w-3.5 text-cyan-400" />
                  <span>ETA Surabaya: 4j 12m</span>
                </div>
              </div>

              {/* Dynamic Animated Moving Vehicle Marker */}
              <div
                className="absolute z-20 transition-all duration-1000 ease-out"
                style={{
                  top: `${20 + vehiclePosition * 0.45}%`,
                  left: `${10 + vehiclePosition * 0.7}%`,
                }}
              >
                <div className="relative">
                  {/* Radar pulse around truck */}
                  <div className="absolute -inset-2 rounded-full bg-cyan-500/30 animate-ping" />
                  <div className="flex items-center gap-2 rounded-2xl border border-cyan-400 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-md min-w-[210px]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">B 9842 UXZ</span>
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-black text-emerald-400">
                          {Math.round(liveSpeed)} km/h
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Hino 500 Wingbox • Driver: Joko S.</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                        <span className="text-emerald-400 font-semibold">BBM: 76% (Normal)</span>
                        <span className="text-cyan-400">Suhu: 88°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Static Vehicle Marker (Idle) */}
              <div className="absolute bottom-16 right-8 z-10 hidden sm:block">
                <div className="rounded-xl border border-amber-500/40 bg-slate-950/90 p-2.5 shadow-xl backdrop-blur-md min-w-[170px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">L 8841 AB</span>
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
                      Rest Area KM 207
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">Isuzu Giga • Idle 18 Menit</p>
                </div>
              </div>

              {/* Bottom Live Route Status Bar */}
              <div className="relative z-10 mt-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>892 Armada Bergerak</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span>210 Sedang Bongkar Muat</span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-cyan-400">
                  Akurasi GPS ± 2.5 Meter
                </div>
              </div>
            </div>

            {/* Side Live Telemetry & Control Widget */}
            <div className="space-y-3 flex flex-col justify-between">
              {/* Telematics Gauge Card 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Rasio Konsumsi BBM</span>
                  <Fuel className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">3.82</span>
                  <span className="text-xs text-slate-400">km / Liter Biosolar</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[82%]" />
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold">Efisiensi optimal (+8.4% vs standar armada)</p>
              </div>

              {/* Telematics Gauge Card 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Driver Safety Index</span>
                  <ShieldAlert className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">96.4</span>
                  <span className="text-xs text-slate-400">/ 100 (Grade A)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-300">
                  <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5">Zero Harsh Brake</span>
                  <span className="rounded bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5">Speed Compliant</span>
                </div>
              </div>

              {/* Action Trigger Card */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/40 p-4 text-left space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>Remote Immobilizer Siap</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Fitur pemutus arus starter mesin jarak jauh aktif untuk perlindungan anti-theft 24/7.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE DASHBOARD PREVIEW */}
        {activeTab === 'dashboard' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-[11px] text-slate-400">Total Kendaraan</p>
                <p className="text-xl font-black text-white">1,284 Unit</p>
                <p className="text-[10px] text-emerald-400">98.2% Aktif Operasional</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-[11px] text-slate-400">Konsumsi Solar Hari Ini</p>
                <p className="text-xl font-black text-cyan-400">4,920 L</p>
                <p className="text-[10px] text-emerald-400">Hemat Rp 6.8jt vs target</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-[11px] text-slate-400">Rata-rata Utilisasi</p>
                <p className="text-xl font-black text-white">88.6%</p>
                <p className="text-[10px] text-cyan-400">+12% dari bulan lalu</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-[11px] text-slate-400">Work Order Bengkel</p>
                <p className="text-xl font-black text-amber-400">4 Unit</p>
                <p className="text-[10px] text-slate-400">Servis Berkala Terjadwal</p>
              </div>
            </div>

            {/* Mock Table of Active Vehicles */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Daftar Armada Aktif & Status Rute</span>
                <span className="text-[10px] text-cyan-400">Update Realtime</span>
              </div>
              <div className="divide-y divide-slate-800/80 text-xs">
                {[
                  { plate: 'B 9120 UXZ', model: 'Hino Ranger FL 235', loc: 'Tol Cipali KM 102', speed: '74 km/h', fuel: '82%', status: 'MOVING' },
                  { plate: 'L 8841 AB', model: 'Isuzu Giga FVR', loc: 'Pelabuhan Tanjung Perak', speed: '0 km/h', fuel: '64%', status: 'UNLOADING' },
                  { plate: 'D 3390 KLG', model: 'Mitsubishi Fuso Fighter', loc: 'Kawasan Industri Cikarang', speed: '45 km/h', fuel: '91%', status: 'MOVING' },
                ].map((row, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-slate-300 hover:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-cyan-400" />
                      <div>
                        <span className="font-bold text-white">{row.plate}</span>
                        <span className="text-[10px] text-slate-400 ml-2">{row.model}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">{row.loc}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-semibold">{row.speed}</span>
                      <span className="rounded px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI INSIGHT PREVIEW */}
        {activeTab === 'ai' && (
          <div className="rounded-2xl border border-purple-500/30 bg-slate-900/90 p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Smart AI Fleet Copilot</h4>
                  <p className="text-[10px] text-slate-400">Analisis anomali dan optimasi operasional otomatis</p>
                </div>
              </div>
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                Machine Learning v2.5
              </span>
            </div>

            {/* Conversation Flow Mockup */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 justify-end">
                <div className="rounded-2xl rounded-tr-none bg-cyan-600 px-4 py-2.5 text-slate-950 font-semibold max-w-md">
                  "Kenapa konsumsi BBM di Cabang Semarang naik minggu ini?"
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-none border border-slate-800 bg-slate-950 p-4 text-slate-200 max-w-xl space-y-2">
                  <p className="font-bold text-white">
                    Ditemukan 2 Faktor Utama Kenaikan Konsumsi BBM Semarang (+9.2%):
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                    <li>
                      <strong className="text-amber-400">Idle Mesin Berlebih:</strong> 6 truk tronton mengalami waktu idle rata-rata 58 menit/hari saat bongkar di Depo Tanjung Emas.
                    </li>
                    <li>
                      <strong className="text-rose-400">Anomali Penurunan Solar:</strong> Unit <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">H 8192 ZA</code> terdeteksi kehilangan 42 Liter solar saat parkir malam (potensi siphoning).
                    </li>
                  </ul>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">Potensi Penghematan: Rp 14.800.000 / bln</span>
                    <button className="rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 font-bold hover:bg-cyan-500 hover:text-slate-950 transition-colors">
                      Buat Work Order Audit BBM →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
