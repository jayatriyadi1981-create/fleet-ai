import React from 'react';
import { landingContent } from '../../config/landingContent';
import { ShieldCheck, MapPin, Sparkles, Smartphone } from 'lucide-react';

export const TrustMetricsSection: React.FC = () => {
  const icons = [ShieldCheck, MapPin, Sparkles, Smartphone];

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {landingContent.trustMetrics.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md space-y-2 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {item.value}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.label}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
