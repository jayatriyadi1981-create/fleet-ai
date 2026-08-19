import React from 'react';
import { landingContent } from '../../config/landingContent';
import { ShieldCheck, Lock, Key, Server, FileCode, CheckCircle2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-300 mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Keamanan & Proteksi Data Enterprise</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Data Armada adalah Data Bisnis. Kami Memprioritaskan Keamanannya.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Perusahaan Anda memiliki kontrol penuh atas akses lokasi, kerahasiaan kargo, dan riwayat perjalanan armada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingContent.securityFeatures.map((sec, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-2.5 hover:border-emerald-500/30 transition-all shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{sec.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{sec.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
