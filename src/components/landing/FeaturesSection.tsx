import React from 'react';
import { landingContent } from '../../config/landingContent';
import {
  MapPin,
  Truck,
  Sparkles,
  Fuel,
  Wrench,
  ShieldAlert,
  Map,
  Bell,
  BarChart3,
  FileText,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    MapPin,
    Truck,
    Sparkles,
    Fuel,
    Wrench,
    ShieldAlert,
    Map,
    Bell,
    BarChart3,
    FileText,
  };

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <Truck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Modul Fitur Lengkap</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Fitur Utama Fleet Management
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Seluruh kebutuhan manajemen armada dalam satu platform terpadu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingContent.coreFeatures.map((feat) => {
            const Icon = iconMap[feat.iconName] || MapPin;
            return (
              <div
                key={feat.id}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  {feat.badge && (
                    <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                      {feat.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
