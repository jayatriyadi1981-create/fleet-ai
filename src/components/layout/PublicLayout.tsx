import React from 'react';
import { Truck, Shield, Sparkles, ArrowRight, User } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onNavigateLogin?: () => void;
  onNavigateApp?: () => void;
}

export const PublicLayout: React.FC<Props> = ({ children, onNavigateLogin, onNavigateApp }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Public Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateApp}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20 font-black">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                FLEET<span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Smart Telematics Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateLogin}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>Masuk (Login)</span>
            </button>
            <button
              onClick={onNavigateApp}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <span>Buka Console Aplikasi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-cyan-500" />
            <span className="font-semibold text-slate-400">Fleet Intelligence Smart AI v0.1.0</span>
          </div>
          <p>© 2026 PT Fleet Intelligence Indonesia. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-cyan-400">Ketentuan Layanan</a>
            <a href="#" className="hover:text-cyan-400">Kebijakan Privasi Data GPS</a>
            <a href="#" className="hover:text-cyan-400">Dukungan API Telematika</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
