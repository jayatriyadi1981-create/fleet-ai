import React, { useState } from 'react';
import { landingContent } from '../../config/landingContent';
import {
  Package,
  Truck,
  Key,
  Navigation,
  Bus,
  Compass,
  HardHat,
  Trees,
  Building2,
  Store,
  Landmark,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Building,
} from 'lucide-react';

export const IndustriesSection: React.FC = () => {
  const [activeIndustryId, setActiveIndustryId] = useState<string>('logistics');

  const iconMap: Record<string, React.ElementType> = {
    Package,
    Truck,
    Key,
    Navigation,
    Bus,
    Compass,
    HardHat,
    Trees,
    Building2,
    Store,
    Landmark,
    Briefcase,
  };

  const activeIndustry =
    landingContent.industries.find((ind) => ind.id === activeIndustryId) ||
    landingContent.industries[0];

  const ActiveIcon = iconMap[activeIndustry.iconName] || Truck;

  return (
    <section id="industries" className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-bold text-indigo-300 mb-4">
            <Building className="h-3.5 w-3.5 text-indigo-400" />
            <span>12 Industry Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Solusi Telematika untuk Berbagai Sektor Industri
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Disesuaikan dengan tantangan operasional spesifik medan dan armada usaha Anda di seluruh wilayah Indonesia.
          </p>
        </div>

        {/* 12 Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {landingContent.industries.map((ind) => {
            const Icon = iconMap[ind.iconName] || Truck;
            const isSelected = ind.id === activeIndustryId;
            return (
              <div
                key={ind.id}
                onClick={() => setActiveIndustryId(ind.id)}
                className={`cursor-pointer rounded-2xl border p-5 space-y-3 transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-slate-900 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-800">
                    {ind.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-white">{ind.name}</h3>
                  <p className="text-[11px] text-cyan-400 font-medium">{ind.subtitle}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[44px]">
                  {ind.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">{ind.keyMetric}</span>
                  <span className="text-[10px] text-slate-500">Lihat Detail →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Industry Spotlight Banner */}
        {activeIndustry && (
          <div className="mt-10 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <ActiveIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    Fokus Solusi Khusus
                  </span>
                  <h4 className="text-xl font-black text-white">
                    {activeIndustry.name} — {activeIndustry.subtitle}
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeIndustry.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {activeIndustry.popularUseCases?.map((uc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-200"
                  >
                    <CheckCircle className="h-3 w-3 text-cyan-400" />
                    <span>{uc}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 text-center min-w-[200px] shrink-0 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Target Impact</span>
              <p className="text-2xl font-black text-emerald-400">{activeIndustry.keyMetric}</p>
              <span className="text-[10px] text-slate-400 block">Efisiensi Rata-Rata</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
