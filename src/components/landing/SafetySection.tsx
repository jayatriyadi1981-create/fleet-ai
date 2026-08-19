import React from 'react';
import { ShieldAlert, Gauge, Award, TrendingDown, AlertTriangle, Activity } from 'lucide-react';
import { landingContent } from '../../config/landingContent';

export const SafetySection: React.FC = () => {
  const { score, maxScore, rating, incidentDecrease, highlights } = landingContent.safetyData;

  return (
    <section className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual Scorecard */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-bold text-white">DRIVER SAFETY SCORECARD</span>
              </div>
              <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                Akurasi Telematika High
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
              <div className="text-center sm:text-left space-y-1">
                <p className="text-xs font-semibold text-slate-400">Rata-rata Skor Pengemudi</p>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-amber-400">{score}</span>
                  <span className="text-sm font-bold text-slate-500">/ {maxScore}</span>
                </div>
                <p className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                  <Award className="h-3.5 w-3.5" />
                  <span>Kategori: {rating}</span>
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                <p className="text-[10px] text-slate-400">Penurunan Angka Kejadian Insiden</p>
                <p className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                  <TrendingDown className="h-5 w-5" />
                  <span>{incidentDecrease}</span>
                </p>
                <p className="text-[9px] text-slate-500">Dibandingkan bulan lalu</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Overspeed Alarm</span>
                <span className="font-bold text-emerald-400">Terdeteksi Minim</span>
              </div>
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Harsh Braking</span>
                <span className="font-bold text-emerald-400">Turun 18%</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-bold text-amber-300">
              <Gauge className="h-3.5 w-3.5 text-amber-400" />
              <span>Safety & Behavior Analytics</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Keselamatan Armada Lebih Terukur.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pantau perilaku pengemudi saat di jalan untuk mencegah risiko kecelakaan, menjaga keawetan truk, dan memastikan pengiriman kargo tiba dengan aman.
            </p>

            <div className="space-y-3 pt-2">
              {highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 shrink-0">
                    <ShieldAlert className="h-3 w-3" />
                  </div>
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
