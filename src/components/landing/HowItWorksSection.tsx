import React from 'react';
import { landingContent } from '../../config/landingContent';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <span>Workflow Implementasi Cepat</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Mulai dalam Beberapa Langkah Sederhana.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Proses integrasi cepat tanpa mengganggu operasional pengiriman harian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {landingContent.howItWorks.map((hw, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {hw.step}
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{hw.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{hw.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
