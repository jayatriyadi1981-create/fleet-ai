/**
 * Fleet Intelligence Smart AI - Executive Forecast Section
 * PROMPT 52 — Predictive Business Forecasts with Confidence Intervals & Transparent Assumptions
 */

import React from 'react';
import { TrendingUp, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { ExecutiveForecast } from '../../types/executiveReport';

interface ExecutiveForecastSectionProps {
  forecasts: ExecutiveForecast[];
}

export const ExecutiveForecastSection: React.FC<ExecutiveForecastSectionProps> = ({ forecasts }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Proyeksi & Prakiraan Bisnis Periode Depan (Forecast)</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                September 2026
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Estimasi berbasis model prediktif tren operasional, inflasi energi solar, dan siklus perawatan armada
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecasts.map((f, idx) => (
          <div
            key={idx}
            className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">{f.metricLabel}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" />
                  {f.confidence}
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-baseline justify-between">
                  <div className="text-xs text-slate-400">Proyeksi Depan:</div>
                  <div className="text-xl font-extrabold text-cyan-400">{f.projectedNextPeriodFormatted}</div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Saat Ini: {f.currentValueFormatted}</span>
                  <span className="text-amber-400 font-medium">Rentang: {f.projectedRangeFormatted.min} - {f.projectedRangeFormatted.max}</span>
                </div>
              </div>

              {/* Assumptions */}
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-400">Asumsi Model:</div>
                <ul className="space-y-1 text-slate-300 list-disc pl-4 text-[11px]">
                  {f.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3 bg-cyan-950/20 rounded-lg border border-cyan-900/30 text-xs text-cyan-100/90 space-y-1">
              <div className="font-semibold text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rekomendasi Aksi:</span>
              </div>
              <p className="text-[11px]">{f.businessRecommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
