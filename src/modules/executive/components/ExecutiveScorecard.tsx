/**
 * Fleet Intelligence Smart AI - Executive Scorecard Component
 * PROMPT 38 - Multi-domain executive health index with configurable weights & trend analysis
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import { ExecutiveStatus } from '../types';

export const ExecutiveScorecard: React.FC = () => {
  const { scoreResult, setIsScoreConfigModalOpen } = useExecutive();

  const getStatusBadge = (status: ExecutiveStatus) => {
    switch (status) {
      case 'EXCELLENT':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
          dot: 'bg-emerald-500',
          label: 'EXCELLENT (Sangat Baik)',
          icon: CheckCircle2,
        };
      case 'GOOD':
        return {
          bg: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
          dot: 'bg-blue-500',
          label: 'GOOD (Baik & Terkendali)',
          icon: CheckCircle2,
        };
      case 'ATTENTION':
        return {
          bg: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
          dot: 'bg-amber-500',
          label: 'ATTENTION (Perlu Perhatian)',
          icon: AlertTriangle,
        };
      case 'WARNING':
        return {
          bg: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
          dot: 'bg-orange-500',
          label: 'WARNING (Waspada)',
          icon: AlertTriangle,
        };
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/10 text-red-600 border-red-500/30',
          dot: 'bg-red-500',
          label: 'CRITICAL (Kritis)',
          icon: AlertOctagon,
        };
    }
  };

  const statusConfig = getStatusBadge(scoreResult.status);
  const StatusIcon = statusConfig.icon;

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-amber-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Fleet Executive Scorecard
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indeks kesehatan performa armada menyeluruh berbasis bobot 6 pilar operasional dan finansial.
          </p>
        </div>

        {/* Action button to tune weights */}
        <button
          id="tune-weights-scorecard-btn"
          onClick={() => setIsScoreConfigModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Atur Bobot Formula</span>
        </button>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
        {/* Overall Score Circle / Hero Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white text-center flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Skor Eksekutif Keseluruhan
          </span>

          <div className="flex items-baseline justify-center gap-1 my-2">
            <span className="text-5xl font-extrabold tracking-tight text-white">
              {scoreResult.overallScore}
            </span>
            <span className="text-xl font-medium text-slate-400">/ 100</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                scoreResult.delta >= 0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {scoreResult.delta >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{scoreResult.delta >= 0 ? `+${scoreResult.delta}%` : `${scoreResult.delta}%`} vs periode lalu</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 max-w-xs leading-relaxed">
            Performa armada berada di atas benchmark industri (85.0). Seluruh parameter vital operasional dan kepatuhan berada dalam toleransi aman.
          </p>
        </div>

        {/* 6 Pillars Breakdown Progress Bars */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scoreResult.items.map((item) => (
            <div
              key={item.key}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all hover:bg-slate-50/80"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  {item.label}
                  <span className="text-[10px] font-normal text-slate-400 px-1.5 py-0.2 bg-white rounded border border-slate-200">
                    Bobot {item.weight}%
                  </span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">{item.score}</span>
                  <span className="text-slate-400 text-xs">/100</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(item.score)}`}
                  style={{ width: `${Math.min(100, Math.max(5, item.score))}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <div className="flex items-center gap-1">
                  {item.trend === 'UP' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                  {item.trend === 'DOWN' && <TrendingDown className="w-3 h-3 text-rose-500" />}
                  {item.trend === 'STABLE' && <Minus className="w-3 h-3 text-slate-400" />}
                  <span className={item.delta >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                    {item.delta >= 0 ? `+${item.delta}` : item.delta} poin
                  </span>
                </div>
                <span>Benchmark: <strong>{item.benchmarkScore}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
