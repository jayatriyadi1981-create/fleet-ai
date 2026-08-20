import React, { useState } from 'react';
import { landingContent, FeatureItem } from '../../config/landingContent';
import {
  Radio,
  Truck,
  Users,
  Fuel,
  Wrench,
  MapPin,
  Route,
  Sparkles,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const iconMap: Record<string, React.ElementType> = {
    Radio,
    Truck,
    Users,
    Fuel,
    Wrench,
    MapPin,
    Route,
    Sparkles,
    ShieldAlert,
    FileSpreadsheet,
  };

  const categories = [
    { id: 'ALL', label: 'Semua Fitur (10)' },
    { id: 'TELEMATICS', label: 'Telematika & GPS' },
    { id: 'MANAGEMENT', label: 'Fleet & Driver Ops' },
    { id: 'AI_SAFETY', label: 'Smart AI & Safety' },
    { id: 'ANALYTICS', label: 'Rute & Laporan BI' },
  ];

  const filteredFeatures =
    selectedCategory === 'ALL'
      ? landingContent.coreFeatures
      : landingContent.coreFeatures.filter((f) => f.category === selectedCategory);

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Product Features Suite</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            10 Modul Fitur Unggulan Fleet Telematics
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Arsitektur komprehensif mulai dari pelacakan sensor GPS live hingga kecerdasan buatan Smart AI dan laporan audit eksekutif.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features 10-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat, index) => {
            const Icon = iconMap[feat.iconName] || Radio;
            return (
              <div
                key={feat.id}
                className="relative rounded-3xl border border-slate-800/90 bg-slate-900/60 p-6 space-y-4 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all group shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-md">
                      <Icon className="h-6 w-6" />
                    </div>
                    {feat.badge && (
                      <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black text-cyan-300 border border-cyan-500/30">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Modul 0{index + 1}
                    </span>
                    <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                    {feat.description}
                  </p>
                </div>

                {/* Feature Key Highlights */}
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {feat.highlights?.map((hl, hlIdx) => (
                    <div key={hlIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
