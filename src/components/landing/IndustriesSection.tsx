import React from 'react';
import { landingContent } from '../../config/landingContent';
import {
  Package,
  Truck,
  Key,
  Store,
  HardHat,
  Building,
  Factory,
  Droplet,
  Bus,
} from 'lucide-react';

export const IndustriesSection: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Package,
    Truck,
    Key,
    Store,
    HardHat,
    Building,
    Factory,
    Droplet,
    Bus,
  };

  return (
    <section id="industries" className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-bold text-indigo-300 mb-4">
            <Building className="h-3.5 w-3.5 text-indigo-400" />
            <span>Sektor Bisnis & Industri</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Dibangun untuk Berbagai Sektor Industri.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Disesuaikan dengan tantangan spesifik bidang usaha Anda di seluruh wilayah Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingContent.industries.map((ind) => {
            const Icon = iconMap[ind.iconName] || Truck;
            return (
              <div
                key={ind.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-800">
                    {ind.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{ind.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{ind.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
