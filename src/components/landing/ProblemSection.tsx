import React from 'react';
import { landingContent } from '../../config/landingContent';
import { MapPin, Fuel, Wrench, ShieldAlert, FolderX, Clock } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    MapPin,
    Fuel,
    Wrench,
    ShieldAlert,
    FolderX,
    Clock,
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 px-3.5 py-1 text-xs font-bold text-rose-300 mb-4">
            <span>Tantangan Operasional Armada</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Mengelola Armada Tidak Harus Rumit.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Sebagian besar perusahaan logistik dan transportasi di Indonesia menghadapi 6 kendala utama dalam manajemen armada harian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingContent.problems.map((prob, idx) => {
            const Icon = iconMap[prob.iconName] || MapPin;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 space-y-3 hover:border-rose-500/30 hover:bg-slate-900/80 transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">{prob.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{prob.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
