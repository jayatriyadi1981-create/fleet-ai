import React from 'react';
import { Sparkles, MessageSquare, Send, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';
import { landingContent } from '../../config/landingContent';

interface AiSectionProps {
  onNavigateLogin: () => void;
}

export const AiSection: React.FC<AiSectionProps> = ({ onNavigateLogin }) => {
  const { userQuery, aiResponse } = landingContent.conversationalDemo;

  const aiCapabilities = [
    'AI Fleet Analyst',
    'AI Fuel Analyst',
    'AI Maintenance Analyst',
    'AI Safety Analyst',
    'AI Operations Assistant',
    'AI Report Generator',
    'AI Forecasting',
    'AI Anomaly Detection',
  ];

  return (
    <section id="ai" className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-4 shadow-lg shadow-cyan-950/50">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
            <span>Kecerdasan Buatan Terdepan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Bukan Sekadar Melihat Data. AI Membantu Anda Memahaminya.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Fleet Intelligence Smart AI menganalisis data armada dan membantu menemukan pola, anomali, risiko, serta peluang optimasi secara proaktif.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: AI Capabilities Chips */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-lg font-bold text-white">Kapabilitas Kecerdasan Buatan Enterprise</h3>
            <div className="grid grid-cols-2 gap-3">
              {aiCapabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex items-center gap-2 hover:border-cyan-500/40 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">{cap}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Tanyakan kondisi operasional armada dalam Bahasa Indonesia alami. Asisten AI akan merangkum data telematika ribuan kilometer perjalanan dalam waktu singkat.
            </p>

            <button
              onClick={onNavigateLogin}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Uji Coba Asisten AI</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right Column: Conversational AI Demo UI Mockup */}
          <div className="lg:col-span-7 rounded-2xl border border-cyan-500/30 bg-slate-950 p-4 sm:p-6 shadow-2xl shadow-cyan-950/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Bot className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Fleet Intelligence Assistant</h4>
                  <p className="text-[10px] text-slate-400">Sample Preview • Bahasa Indonesia Natural Language</p>
                </div>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Online
              </span>
            </div>

            {/* Chat Bubble History */}
            <div className="space-y-3.5 text-xs">
              {/* User Question */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-none bg-cyan-600/20 border border-cyan-500/30 px-4 py-3 text-cyan-100 max-w-md shadow-md">
                  <p className="text-[10px] font-bold text-cyan-300 mb-0.5">Manajer Operasional:</p>
                  <p className="font-medium">{userQuery}</p>
                </div>
              </div>

              {/* AI Answer */}
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 p-4 text-slate-200 max-w-xl space-y-2.5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-[10px] font-bold text-cyan-400">Rangkuman AI Telematics:</span>
                  </div>
                  <p className="font-bold text-white leading-relaxed">{aiResponse.headline}</p>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-semibold text-slate-400">Faktor Utama Penyebab:</p>
                    {aiResponse.factors.map((fact, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 p-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">Potensi Hemat Biaya:</span>
                    <span className="font-extrabold text-emerald-400 text-xs">{aiResponse.savingPotential}</span>
                  </div>

                  <button
                    onClick={onNavigateLogin}
                    className="w-full mt-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 py-2 text-center text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    {aiResponse.actionText}
                  </button>
                </div>
              </div>
            </div>

            {/* Input Fake Box */}
            <div className="pt-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-slate-400">
                <span className="flex-1 truncate">Tanyakan kondisi armada Anda...</span>
                <Send className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
