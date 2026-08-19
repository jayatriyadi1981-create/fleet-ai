/**
 * Fleet Intelligence Smart AI - Health Score Breakdown Widget (Prompt 28)
 */

import React from 'react';
import { Heart, Activity, CheckCircle, ShieldAlert, Sparkles, TrendingUp, Info } from 'lucide-react';
import { FleetHealthBreakdown } from '../../types';

interface HealthScoreBreakdownWidgetProps {
  health: FleetHealthBreakdown;
  onExplainHealth?: () => void;
  onViewTrendDetail?: () => void;
}

export const HealthScoreBreakdownWidget: React.FC<HealthScoreBreakdownWidgetProps> = ({
  health,
  onExplainHealth,
  onViewTrendDetail,
}) => {
  const getCategoryBadge = () => {
    switch (health.category) {
      case 'Excellent':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Good':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Attention':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const components = [
    { label: 'Ketersediaan (Availability)', score: health.availability, weight: health.weights.availability },
    { label: 'Kepatuhan Perawatan (Maintenance)', score: health.maintenance, weight: health.weights.maintenance },
    { label: 'Inspeksi & Grounding (Inspection)', score: health.inspection, weight: health.weights.inspection },
    { label: 'Keselamatan & Safety (Safety)', score: health.safety, weight: health.weights.safety },
    { label: 'Konektivitas GPS (GPS Connectivity)', score: health.gpsConnectivity, weight: health.weights.gpsConnectivity },
    { label: 'Perilaku Pengemudi (Driver Behavior)', score: health.driverBehavior, weight: health.weights.driverBehavior },
    { label: 'Kelancaran Operasional (Operations)', score: health.operations, weight: health.weights.operations },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-400" />
            <span>Fleet Health Score & Komponen Penilaian</span>
          </h3>
          <p className="text-xs text-slate-400">
            Kombinasi terbobot 7 pilar operasional telematika armada
          </p>
        </div>

        {onExplainHealth && (
          <button
            onClick={onExplainHealth}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explain with AI</span>
          </button>
        )}
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1 rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-slate-400 mb-1">Skor Kesehatan Armada</span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-4xl font-black text-white font-mono">{health.overallScore}</span>
            <span className="text-sm text-slate-500 font-mono">/ 100</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border mt-1 ${getCategoryBadge()}`}>
            {health.category}
          </span>
          <span className="text-[11px] text-slate-400 mt-2">
            Perubahan vs Periode Lalu: <strong className="text-amber-400">{health.changePercent}%</strong>
          </span>
        </div>

        {/* Change Analysis Summary */}
        <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              AI Insight: Analisis Fluktuasi Kesehatan
            </span>
            <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
              {health.changeAnalysis.summary}
            </p>
          </div>

          <div className="space-y-1.5">
            {health.changeAnalysis.mainContributors.map((c, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs">
                <span className={c.impact === 'positive' ? 'text-emerald-400' : 'text-rose-400'}>
                  {c.impact === 'positive' ? '✓' : '⚠'}
                </span>
                <span className="text-slate-300">
                  <strong className="text-white font-medium">{c.factor}: </strong>
                  {c.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Scores Breakdown */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-300 block">Rincian Nilai Komponen:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {components.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-mono">({Math.round(item.weight * 100)}%)</span>
                  <span className="font-mono font-bold text-white text-xs">{item.score}</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    item.score >= 85 ? 'bg-emerald-500' :
                    item.score >= 70 ? 'bg-cyan-500' :
                    item.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
