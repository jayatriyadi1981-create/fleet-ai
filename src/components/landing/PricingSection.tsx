import React from 'react';
import { landingContent } from '../../config/landingContent';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onNavigateLogin: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigateLogin }) => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <span>Investasi Efisiensi Berkelanjutan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Pilihan Paket Fleksibel Sesuai Ukuran Armada.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Skema harga transparan tanpa biaya tersembunyi. Dapatkan imbal hasil investasi (ROI) langsung melalui penghematan solar dan perlindungan aset.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {landingContent.pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
                plan.highlighted
                  ? 'border-cyan-500 bg-slate-900/90 shadow-2xl shadow-cyan-950/80 ring-1 ring-cyan-500/50 md:-translate-y-2'
                  : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-3.5 py-1 text-[10px] font-black uppercase text-slate-950 tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">{plan.name}</h3>
                <p className="mt-2 text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1 border-b border-slate-800 pb-6">
                  <span className="text-3xl sm:text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs font-semibold text-slate-400">{plan.billingPeriod}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Cakupan Fitur:</p>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={onNavigateLogin}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                    plan.highlighted
                      ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25'
                      : 'border border-slate-800 bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Architecture Callout */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-300">
            Mendukung Arsitektur Lisensi Fleksibel: <span className="text-cyan-400">Per Vehicle / Month</span> + <span className="text-cyan-400">Platform Subscription</span> + <span className="text-cyan-400">Add-on IoT Sensors</span>
          </p>
          <p className="mt-1 text-[11px]">Hubungi tim sales kami untuk penawaran khusus perusahaan dengan armada di atas 50 unit.</p>
        </div>
      </div>
    </section>
  );
};
