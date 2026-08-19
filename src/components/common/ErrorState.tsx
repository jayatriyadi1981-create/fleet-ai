/**
 * Fleet Intelligence Smart AI - Error State Fallback
 */

import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Halaman Modul',
  message = 'Terjadi kendala koneksi atau otorisasi server saat memuat data modul ini. Silakan coba muat ulang.',
  onRetry,
  onGoHome,
}) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center backdrop-blur-md space-y-4 my-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
        <AlertTriangle className="h-7 w-7 animate-bounce" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali Ke Dashboard</span>
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-950"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Coba Coba Ulang</span>
          </button>
        )}
      </div>
    </div>
  );
};
