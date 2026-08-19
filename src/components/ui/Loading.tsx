import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return <Loader2 className={`animate-spin text-cyan-400 ${sizeMap[size]} ${className}`} />;
};

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Memuat data Fleet Intelligence...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 space-y-4">
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <Spinner size="lg" />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-400 animate-pulse">{message}</p>
    </div>
  );
};

export const AIThinking: React.FC<{ message?: string }> = ({ message = 'AI Intelligence sedang menganalisis telemetri...' }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 text-purple-200">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30 shrink-0">
        <Sparkles className="h-5 w-5 text-purple-300 animate-pulse" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white">Proses AI Analisis</h4>
        <p className="text-[11px] text-purple-300">{message}</p>
      </div>
    </div>
  );
};
