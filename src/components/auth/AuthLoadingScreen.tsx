import React from 'react';
import { Truck, ShieldCheck, Loader2 } from 'lucide-react';

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-slate-950 font-sans text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <div className="relative flex flex-col items-center space-y-6 max-w-sm text-center px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-2xl shadow-cyan-500/25 animate-pulse">
          <Truck className="h-8 w-8" />
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            FLEET<span className="text-cyan-400">AI</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Memverifikasi Sesi Keamanan & Hak Akses Tenant...
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-1.5 text-xs text-cyan-400 shadow-lg">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Autentikasi Terenkripsi ISO 27001</span>
        </div>
      </div>
    </div>
  );
};
