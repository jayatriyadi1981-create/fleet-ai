import React from 'react';
import { Fuel, TrendingDown, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FuelSectionProps {
  onNavigateLogin: () => void;
}

export const FuelSection: React.FC<FuelSectionProps> = ({ onNavigateLogin }) => {
  const fuelFeatures = [
    'Monitoring Konsumsi BBM Solar Biosolar B35 Realtime',
    'Deteksi Kebocoran & Pencurian Solar di Tangki',
    'Analisis Waktu Idle Mesin Berlebih (Wasted Fuel)',
    'Rasio Efisiensi BBM per Kilometer Perjalanan',
    'Perbandingan Performa Konsumsi Solar Antar-Driver',
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <Fuel className="h-3.5 w-3.5 text-emerald-400" />
              <span>Fuel Efficiency Telematics</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Kurangi Pemborosan BBM dengan Data.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Biaya solar menyerap hingga 40% anggaran operasional armada. Temukan pemicu pemborosan BBM, cegah praktik kecurangan, dan tingkatkan efisiensi per rute.
            </p>

            <div className="space-y-3 pt-2">
              {fuelFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-slate-200">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateLogin}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Analisis Konsumsi BBM</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Fuel Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Fuel className="h-4 w-4 text-emerald-400" />
                TELEMATIKA TANGKI BBM & IDLE
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Akurasi High
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-[10px] text-slate-400">Total Solar Dikonsumsi</p>
                <p className="text-2xl font-black text-white mt-1">12,842 L</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Rasio 3.2 km/L</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-[10px] text-slate-400">Potensi Hemat BBM</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">Rp 18,4 Jt</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Estimasi per bulan</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-3.5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-200">Alert Idle Mesin Berlebih</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  4 kendaraan terdeteksi mesin idle &gt; 1 jam di Depo Marunda saat menunggu muatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
