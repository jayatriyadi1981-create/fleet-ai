import React, { useState } from 'react';
import { landingContent } from '../../config/landingContent';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-900/40 border-b border-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Temukan jawaban lengkap mengenai fitur GPS, kecerdasan buatan AI, keamanan data, dan skema penggunaan platform.
          </p>
        </div>

        <div className="space-y-3">
          {landingContent.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
