/**
 * Fleet Intelligence Smart AI - Executive KPI Grid Component
 * PROMPT 38 - 6 Core C-Level KPI Cards with sparklines, deltas, and multi-domain status badges
 */

import React from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import {
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Fuel,
  Wrench,
  Minus,
} from 'lucide-react';
import { ExecutiveKpiCardData } from '../types';

export const ExecutiveKpiGrid: React.FC = () => {
  const { kpiCards } = useExecutive();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case 'Fuel':
        return <Fuel className="w-5 h-5 text-amber-600" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-rose-600" />;
      default:
        return <Activity className="w-5 h-5 text-slate-600" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return 'bg-blue-50 border-blue-200';
      case 'DollarSign':
        return 'bg-emerald-50 border-emerald-200';
      case 'TrendingUp':
        return 'bg-purple-50 border-purple-200';
      case 'ShieldCheck':
        return 'bg-indigo-50 border-indigo-200';
      case 'Fuel':
        return 'bg-amber-50 border-amber-200';
      case 'Wrench':
        return 'bg-rose-50 border-rose-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiCards.map((card) => {
        const isGoodTrend =
          (card.isPositiveGood && card.percentageChange >= 0) ||
          (!card.isPositiveGood && card.percentageChange <= 0);

        return (
          <div
            key={card.id}
            id={card.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between"
          >
            {/* Header: Title and Icon */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {card.displayValue}
                  </h3>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl border ${getIconBg(card.iconName)}`}>
                {getIcon(card.iconName)}
              </div>
            </div>

            {/* Middle: Subtitle details */}
            <p className="text-xs text-slate-600 mt-2 line-clamp-1">
              {card.subtitle}
            </p>

            {/* Sparkline mini bar chart */}
            {card.sparklineData && (
              <div className="flex items-end gap-1.5 h-6 mt-3 pt-1 border-t border-slate-100">
                {card.sparklineData.map((val, idx) => {
                  const max = Math.max(...(card.sparklineData || [1]));
                  const heightPct = Math.max(15, Math.round((val / max) * 100));
                  const isLast = idx === card.sparklineData!.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t-sm transition-all ${
                        isLast
                          ? isGoodTrend
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                          : 'bg-slate-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`Nilai: ${val}`}
                    ></div>
                  );
                })}
              </div>
            )}

            {/* Footer: Trend and Previous Comparison */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                  isGoodTrend
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {card.trend === 'UP' && <TrendingUp className="w-3 h-3" />}
                {card.trend === 'DOWN' && <TrendingDown className="w-3 h-3" />}
                {card.trend === 'STABLE' && <Minus className="w-3 h-3" />}
                <span>
                  {card.percentageChange > 0 ? `+${card.percentageChange}%` : `${card.percentageChange}%`}
                </span>
              </div>

              <span className="text-[11px] text-slate-400">
                Lalu: <strong className="text-slate-600 font-medium">{card.previousDisplayValue}</strong>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
