import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, PlayCircle } from 'lucide-react';
import { landingContent } from '../../config/landingContent';
import { HeroVisualPreview } from './HeroVisualPreview';

interface HeroSectionProps {
  onNavigateLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateLogin }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-6 shadow-xl shadow-cyan-950/50">
          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>Generasi Baru Platform Fleet Management & Telematics Indonesia</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          {landingContent.hero.titlePrefix} {landingContent.hero.titleMiddle} <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            {landingContent.hero.titleHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {landingContent.hero.description}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/25 hover:scale-[1.02]"
          >
            <span>{landingContent.hero.ctaPrimary}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onNavigateLogin}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 hover:border-slate-700 transition-all"
          >
            <PlayCircle className="h-4 w-4 text-cyan-400" />
            <span>{landingContent.hero.ctaSecondary}</span>
          </button>
        </div>

        {/* Local Trust Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>{landingContent.hero.trustText}</span>
        </div>

        {/* Hero Visual Preview Command Center */}
        <div className="mt-12 sm:mt-16">
          <HeroVisualPreview />
        </div>
      </div>
    </section>
  );
};
