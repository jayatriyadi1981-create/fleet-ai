/**
 * Fleet Intelligence Smart AI - Fuel Efficiency Tab
 * Evaluates multi-factor Fuel Efficiency Score (0-100) with calibrated weights,
 * factor impact explanations, and fleet-wide benchmarks.
 */

import React from 'react';
import { FuelEfficiencyDetail } from '../../types';
import { Gauge, Sparkles, CheckCircle2, AlertTriangle, Info, HelpCircle } from 'lucide-react';

interface EfficiencyTabProps {
  efficiencyDetail: FuelEfficiencyDetail;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const EfficiencyTab: React.FC<EfficiencyTabProps> = ({
  efficiencyDetail,
  onExplainWithAI,
}) => {
  const { overallScore, category, factors, summary } = efficiencyDetail;

  const factorList = Object.values(factors);

  return (
    <div className="space-y-6">
      {/* 1. Score Hero Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Ring & Category */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Indeks Efisiensi Keseluruhan
          </span>
          <div className="mt-4 relative flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-950/80 shadow-inner">
              <div>
                <span className="text-4xl font-bold font-mono text-emerald-400 block">{overallScore}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">/ 100 Skala</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Kategori: {category}
            </span>
          </div>
        </div>

        {/* AI Efficiency Rationale */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 p-6 flex flex-col justify-between shadow-lg space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <h4 className="text-sm font-bold text-white">Interpretasi AI Terhadap Skor Efisiensi</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {summary}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                Bobot Baseline: 35%
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                Bobot Driving: 20%
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                Bobot Idling: 20%
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                Bobot Servis: 10%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400">
              Standar Ambang Batas Efisiensi Armada Nasional: ≥ 75 Poin
            </span>
            <button
              onClick={() => onExplainWithAI('EFFICIENCY', 'Faktor Penentu Skor Efisiensi Armada')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" /> Explain With AI
            </button>
          </div>
        </div>
      </div>

      {/* 2. Factor Decomposition List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Gauge className="h-4 w-4 text-cyan-400" />
            Dekomposisi Bobot Faktor Efisiensi (Factor Scoring Breakdown)
          </h4>
          <span className="text-xs font-mono text-slate-400">6 Dimensi Telematika</span>
        </div>

        <div className="space-y-4">
          {factorList.map((factor, idx) => {
            const isNegative = factor.impact === 'NEGATIVE';
            const isPositive = factor.impact === 'POSITIVE';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{factor.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Bobot: {factor.weight * 100}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold font-mono ${
                        factor.score >= 80
                          ? 'text-emerald-400'
                          : factor.score >= 65
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      Skor: {factor.score}/100
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isNegative
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {factor.impact}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      factor.score >= 80
                        ? 'bg-emerald-500'
                        : factor.score >= 65
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-snug">{factor.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
