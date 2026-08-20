/**
 * Fleet Intelligence Smart AI - Executive Scorecard Widget
 * PROMPT 52 — 7-Pillar Transparent Executive Scorecard & Target Tracking
 */

import React from 'react';
import { Award, TrendingUp, TrendingDown, Minus, Target, Info } from 'lucide-react';
import { ExecutiveScorecard, ScorecardMetric } from '../../types/executiveReport';

interface ExecutiveScorecardWidgetProps {
  scorecard: ExecutiveScorecard;
}

export const ExecutiveScorecardWidget: React.FC<ExecutiveScorecardWidgetProps> = ({ scorecard }) => {
  const pillars: { key: string; label: string; metric: ScorecardMetric; desc: string }[] = [
    { key: 'efficiency', label: 'Efisiensi Operasional', metric: scorecard.efficiency, desc: 'SLA pengiriman & kontrol idle time' },
    { key: 'costControl', label: 'Pengendalian Biaya (Cost Control)', metric: scorecard.costControl, desc: 'Kepatuhan anggaran & deviasi cost/km' },
    { key: 'safety', label: 'Keselamatan (Safety Index)', metric: scorecard.safety, desc: 'Zero accident, overspeed & insiden' },
    { key: 'utilization', label: 'Utilisasi Armada', metric: scorecard.utilization, desc: 'Rasio jam kerja & ritase harian' },
    { key: 'maintenance', label: 'Kesiapan Pemeliharaan', metric: scorecard.maintenance, desc: 'Vehicle availability & unscheduled downtime' },
    { key: 'fuelEfficiency', label: 'Efisiensi BBM', metric: scorecard.fuelEfficiency, desc: 'Rasio km/L terhadap baseline armada' },
    { key: 'productivity', label: 'Produktivitas Armada', metric: scorecard.productivity, desc: 'Total tonase, trip & penyelesaian order' },
  ];

  const getStatusColor = (status: 'above' | 'on_target' | 'below') => {
    switch (status) {
      case 'above':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'on_target':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40';
      case 'below':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Executive Scorecard (7 Pilar Utama)</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800 text-indigo-300">
                Index {scorecard.overallIndex}/100
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluasi tertimbang kinerja bisnis dan kepatuhan terhadap target strategis korporasi
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Formula: Terkalibrasi pada standar telematika ISO 39001</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {pillars.map(pillar => {
          const m = pillar.metric;
          const isUp = m.changePercent > 0;
          const isDown = m.changePercent < 0;

          return (
            <div
              key={pillar.key}
              className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-300">{pillar.label}</h4>
                  <p className="text-[11px] text-slate-500">{pillar.desc}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusColor(m.status)}`}>
                  {m.status === 'above' ? 'Di Atas Target' : m.status === 'on_target' ? 'Tercapai' : 'Di Bawah Target'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-extrabold text-slate-100">
                  {m.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  {isUp ? (
                    <span className="text-emerald-400 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{m.changePercent}%
                    </span>
                  ) : isDown ? (
                    <span className="text-rose-400 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {m.changePercent}%
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center">
                      <Minus className="w-3.5 h-3.5 mr-0.5" /> 0%
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.score >= 88 ? 'bg-emerald-500' : m.score >= 78 ? 'bg-cyan-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Prev: {m.previousScore}</span>
                  <span className="text-slate-400">Target: {m.targetScore}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 flex items-center gap-1">
                <Target className="w-3 h-3 text-slate-500" />
                <span>{m.benchmark}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
