import React from 'react';
import { KeyRound, ShieldAlert, Sparkles, ExternalLink, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface GoogleMapsKeySplashProps {
  onContinueDemo?: () => void;
  compact?: boolean;
}

export const GoogleMapsKeySplash: React.FC<GoogleMapsKeySplashProps> = ({ onContinueDemo, compact = false }) => {
  return (
    <div
      id="gmp-key-splash-container"
      className={`flex items-center justify-center bg-slate-950 text-slate-100 p-6 ${
        compact ? 'h-[480px] rounded-2xl border border-slate-800' : 'h-full min-h-[550px] w-full rounded-2xl border border-slate-800 shadow-2xl'
      }`}
    >
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Header Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/10">
          <KeyRound className="w-8 h-8 animate-pulse" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Google Maps API Key Required
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono">
              GMP v3 Weekly
            </span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Untuk mengaktifkan Google Maps Platform (Live Tracking, Advanced Markers, Places API Search, dan Routes API),
            masukkan API key Google Maps Anda ke Secrets environment.
          </p>
        </div>

        {/* Setup Steps Card */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 text-left space-y-4 text-sm backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs shrink-0 mt-0.5 border border-blue-500/30">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-200">Dapatkan Google Maps API Key</p>
              <a
                href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline mt-1"
              >
                Buka Google Cloud Console
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs shrink-0 mt-0.5 border border-blue-500/30">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-200">Simpan API Key di AI Studio Secrets</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Buka <span className="text-slate-200 font-medium">Settings (⚙️ icon di pojok kanan atas)</span> →{' '}
                <span className="text-slate-200 font-medium">Secrets</span> → ketik{' '}
                <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[11px]">
                  GOOGLE_MAPS_PLATFORM_KEY
                </code>{' '}
                → tekan <kbd className="bg-slate-800 px-1 rounded text-slate-300">Enter</kbd> → paste API Key Anda → tekan{' '}
                <kbd className="bg-slate-800 px-1 rounded text-slate-300">Enter</kbd>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs shrink-0 mt-0.5 border border-blue-500/30">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-200">Otomatis Rebuild & Terhubung</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Aplikasi akan otomatis mengompilasi ulang dan mengaktifkan peta Google Maps Platform secara instan.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onContinueDemo && (
            <button
              onClick={onContinueDemo}
              id="btn-use-offline-map-demo"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Gunakan Simulasi Telematika Leaflet Offline
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
