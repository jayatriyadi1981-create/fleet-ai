import React from 'react';
import { Monitor, Laptop, Tablet, Smartphone, CheckCircle2 } from 'lucide-react';

export const PlatformSection: React.FC = () => {
  const devices = [
    { name: 'Desktop Command Center', desc: 'Full workspace density, multi-panel map, advanced data tables', icon: Monitor },
    { name: 'Laptop Compact Workspace', desc: 'Collapsible sidebar, adaptive headers, responsive grid', icon: Laptop },
    { name: 'Tablet Touch Workspace', desc: 'Touch-optimized layout, drawers, bottom sheets', icon: Tablet },
    { name: 'Android & iOS Operations', desc: 'Bottom navigation, quick mobile cards, full-screen map', icon: Smartphone },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
            <span>Responsive Native View System</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Akses Armada dari Mana Saja.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Satu akun. Satu platform. Pengalaman antarmuka menyesuaikan setiap layar perangkat Anda secara konsisten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {devices.map((dev, idx) => {
            const Icon = dev.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3 hover:border-cyan-500/40 transition-all shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-white">{dev.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{dev.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
