import React from 'react';
import { landingContent } from '../../config/landingContent';
import { ArrowRight, CheckCircle2, Cpu, Sparkles, TrendingUp } from 'lucide-react';

export const SolutionSection: React.FC = () => {
  const { title, subtitle, steps } = landingContent.solutionEcosystem;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ekosistem Solusi Terintegrasi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{title}</h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">{subtitle}</p>
        </div>

        {/* Ecosystem Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl"
            >
              <div>
                <span className="text-xs font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {st.step}
                </span>
                <h4 className="mt-3 text-sm font-bold text-white">{st.name}</h4>
                <p className="mt-1 text-[11px] text-slate-400 leading-normal">{st.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-cyan-500">
                  <ArrowRight className="h-5 w-5 bg-slate-950 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Business Outcome Callout */}
        <div className="mt-12 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-slate-950 p-6 sm:p-8 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-cyan-950/50">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Mengubah Data Telematika Menjadi Keputusan Bisnis Lebih Cepat
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Tidak perlu membuang waktu membaca ribuan baris log GPS. AI secara otomatis mengelompokkan anomali dan merekomendasikan langkah efisiensi operasional.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 shrink-0">
            <TrendingUp className="h-4 w-4" />
            <span>Optimalisasi Operasional</span>
          </div>
        </div>
      </div>
    </section>
  );
};
