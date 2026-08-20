import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Activity, Cpu } from 'lucide-react';

interface AiLoadingIndicatorProps {
  stages?: string[];
  currentStageIndex?: number;
  className?: string;
}

const DEFAULT_STAGES = [
  'Menganalisis data armada dan sensor...',
  'Memeriksa telemetri GPS dan anomali rute...',
  'Menghitung efisiensi BBM dan skor pengemudi...',
  'Menghasilkan rekomendasi cerdas dan actionable insights...',
];

export const AiLoadingIndicator: React.FC<AiLoadingIndicatorProps> = ({
  stages = DEFAULT_STAGES,
  className = '',
}) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-2xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-md ${className}`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-indigo-500/20 border border-purple-500/30 shadow-lg shadow-purple-950/40">
        <Sparkles className="h-7 w-7 text-cyan-300 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-ping opacity-30 pointer-events-none" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
          <BrainCircuit className="h-4 w-4 text-purple-400 animate-spin" />
          <span>Fleet Intelligence Smart AI</span>
        </h4>
        <p className="text-xs text-purple-200/90 font-medium transition-all duration-300 min-h-[20px]">
          {stages[stageIndex]}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5">
        {stages.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === stageIndex ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
