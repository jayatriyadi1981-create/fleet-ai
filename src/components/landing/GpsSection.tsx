import React from 'react';
import { MapPin, Navigation, Radio, Eye, Check, ArrowRight } from 'lucide-react';

interface GpsSectionProps {
  onNavigateLogin: () => void;
}

export const GpsSection: React.FC<GpsSectionProps> = ({ onNavigateLogin }) => {
  return (
    <section id="gps" className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Realtime Telematics Tracking</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Lihat Armada Anda Secara Realtime.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ketahui posisi kendaraan, status perjalanan, kecepatan, arah, dan aktivitas armada dalam satu layar command center interaktif.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Pelacakan GPS interval cepat 3-5 detik',
                'Visualisasi rute & pemutaran riwayat perjalanan (Playback)',
                'Zona Geofence Depo & Notifikasi Otomatis Masuk/Keluar',
                'Integrasi Gateway IoT standar industri (JT808, Concox, Teltonika)',
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-slate-200">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onNavigateLogin}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>Jelajahi GPS Tracking</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Interactive Map Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">LIVE FLEET MAP MONITORING</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                1,284 Online
              </span>
            </div>

            {/* Map Preview Grid Container */}
            <div className="min-h-[280px] rounded-xl bg-slate-900/90 border border-slate-800/80 p-4 relative flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

              {/* Marker 1 */}
              <div className="relative z-10 flex items-center gap-2 rounded-xl bg-slate-950/90 border border-emerald-500/40 p-2.5 w-fit shadow-lg">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <p className="text-[11px] font-bold text-white">B 9123 XYZ • Moving 72 km/h</p>
                  <p className="text-[9px] text-slate-400">Tol Trans Jawa KM 88 (Jakarta → Semarang)</p>
                </div>
              </div>

              {/* Marker 2 */}
              <div className="relative z-10 self-end flex items-center gap-2 rounded-xl bg-slate-950/90 border border-cyan-500/40 p-2.5 w-fit shadow-lg">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                <div>
                  <p className="text-[11px] font-bold text-white">L 8841 AB • Moving 65 km/h</p>
                  <p className="text-[9px] text-slate-400">Jalur Pantura (Surabaya → Gresik)</p>
                </div>
              </div>

              {/* Bottom Summary Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-[10px]">
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Moving</span>
                  <span className="font-bold text-emerald-400 text-xs">892 Unit</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Idle</span>
                  <span className="font-bold text-amber-400 text-xs">210 Unit</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Stopped</span>
                  <span className="font-bold text-slate-300 text-xs">182 Unit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
