import React from 'react';
import { landingContent } from '../../config/landingContent';
import { Quote, Building2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3.5 py-1 text-xs font-bold text-slate-300 mb-4">
            <span>Sample Customer Reference</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Dipercaya Praktisi Logistik & Transportasi.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Berikut testimoni contoh dari hasil pengujian dampak efisiensi operasional platform Fleet Intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {landingContent.testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-4 relative shadow-xl"
            >
              <Quote className="h-8 w-8 text-cyan-500/30" />
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800 font-semibold">
                  <Building2 className="h-3 w-3" />
                  <span>{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
