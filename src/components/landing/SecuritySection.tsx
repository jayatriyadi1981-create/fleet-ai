import React from 'react';
import { landingContent } from '../../config/landingContent';
import { ShieldCheck, Lock, Cloud, Activity, Code2, CheckCircle2, Shield } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Lock,
    Cloud,
    ShieldCheck,
    Activity,
    Code2,
  };

  return (
    <section id="trust" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-300 mb-4">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Trust, Security & Reliability</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Fondasi Keamanan & Infrastruktur Skala Enterprise
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Data pergerakan armada dan finansial perusahaan Anda dilindungi dengan standar keamanan kelas dunia, isolasi multi-tenant, serta pemantauan sistem 24/7 nonstop.
          </p>
        </div>

        {/* 5 Trust Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingContent.trustPillars.map((pillar) => {
            const Icon = iconMap[pillar.iconName] || ShieldCheck;
            return (
              <div
                key={pillar.id}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all shadow-xl group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/30">
                      {pillar.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[44px]">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {pillar.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Compliance & SLA Guarantee Card */}
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 flex flex-col justify-center text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Sertifikasi & Kepatuhan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Memenuhi standar ISO/IEC 27001, regulasi perlindungan data pribadi (UU PDP Indonesia), serta SLA garansi ketersediaan data 99.99%.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
