import React from 'react';
import { landingContent } from '../../config/landingContent';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';

interface FinalCtaSectionProps {
  onNavigateLogin: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onNavigateLogin }) => {
  const { title, subtitle, ctaPrimary, ctaSecondary } = landingContent.finalCta;

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden border-b border-slate-900">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-4 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-md shadow-xl">
          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>Transformasi Bisnis Transportasi & Logistik</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          {title}
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/25 hover:scale-[1.02]"
          >
            <span>{ctaPrimary}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-7 py-4 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
          >
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span>{ctaSecondary}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
