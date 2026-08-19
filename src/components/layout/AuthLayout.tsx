import React from 'react';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Left Branding Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black shadow-xl shadow-cyan-500/20">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
              FLEET<span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Enterprise Telematics Platform</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-3 py-1 text-xs text-cyan-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI-Powered Fleet Decision Support</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Kendalikan Armada.<br />
            Pantau Real-Time GPS.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Prediksi Risiko & Hemat BBM.
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Platform telematika cerdas terintegrasi untuk pemantauan rute, analisis efisiensi Biosolar B35, skor keselamatan pengemudi, dan predictive maintenance armada logistik Indonesia.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Proteksi Geofence & Alert SOS</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Multi-Tenant Enterprise RBAC</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          PT Fleet Intelligence Indonesia © 2026. Standar Keamanan Data ISO 27001.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
