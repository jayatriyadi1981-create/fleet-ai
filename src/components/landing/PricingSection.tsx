import React, { useState } from 'react';
import { landingContent } from '../../config/landingContent';
import { Check, ArrowRight, Sparkles, Shield, Zap, HelpCircle } from 'lucide-react';

interface PricingSectionProps {
  onNavigateLogin: () => void;
  onRequestDemo?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigateLogin, onRequestDemo }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handlePlanCta = (planId: string) => {
    if (planId === 'enterprise' || planId === 'professional') {
      if (onRequestDemo) {
        onRequestDemo();
        return;
      }
    }
    onNavigateLogin();
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Skema Harga Transparan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Pilihan Paket Fleksibel Sesuai Ukuran Armada
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Mulai dari armada kecil hingga korporasi multi-cabang. ROI terbukti dari penghematan solar dan pengurangan risiko kecelakaan.
          </p>

          {/* Billing Cycle Toggle (Monthly vs Annual) */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Tahunan</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/30">
                Hemat ~15%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {landingContent.pricingPlans.map((plan) => {
            const displayPrice =
              billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? 'border-cyan-500 bg-slate-900 shadow-2xl shadow-cyan-950/80 ring-1 ring-cyan-500/50 xl:-translate-y-2'
                    : plan.popular
                    ? 'border-indigo-500/80 bg-slate-900/80 shadow-xl'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-md ${
                      plan.highlighted
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 min-h-[48px]">
                    {plan.description}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1 border-b border-slate-800 pb-5">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {displayPrice}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {plan.unitLabel}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Fitur Utama:
                    </p>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => handlePlanCta(plan.id)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                      plan.highlighted
                        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25'
                        : plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                        : 'border border-slate-800 bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Callout Banner */}
        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            Butuh integrasi khusus untuk 100+ armada, sensor temperatur kargo dingin, atau private server on-premise?
          </p>
          <p className="text-[11px]">
            Tim Enterprise Fleet Specialist kami siap memberikan penawaran khusus dan proof-of-concept gratis.
          </p>
        </div>
      </div>
    </section>
  );
};
