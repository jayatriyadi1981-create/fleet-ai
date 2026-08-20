/**
 * Fleet Intelligence Smart AI - Executive KPI Card
 * PROMPT 52 — Enterprise Reusable KPI Card with Variance, Target, and "WHY?" Drill-down
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus, HelpCircle, LucideIcon } from 'lucide-react';

interface ExecutiveKPICardProps {
  id?: string;
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  changePercent?: number | null;
  comparisonLabel?: string;
  targetValue?: string | null;
  targetVariancePercent?: number | null;
  status?: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL' | 'optimal';
  onWhyClick?: () => void;
  inverseColors?: boolean; // If true, cost increase is red (bad), else green
}

export const ExecutiveKPICard: React.FC<ExecutiveKPICardProps> = ({
  id,
  title,
  value,
  subValue,
  icon: Icon,
  changePercent,
  comparisonLabel = 'vs bulan lalu',
  targetValue,
  targetVariancePercent,
  status = 'NORMAL',
  onWhyClick,
  inverseColors = false,
}) => {
  const isPositive = changePercent !== null && changePercent !== undefined && changePercent > 0;
  const isNegative = changePercent !== null && changePercent !== undefined && changePercent < 0;

  // For costs, an increase is typically undesirable (red), whereas for safety/utilization an increase is good (emerald)
  const isGood = inverseColors ? isNegative : isPositive;
  const isBad = inverseColors ? isPositive : isNegative;

  return (
    <div
      id={id}
      className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden transition-all duration-200 hover:border-slate-700 hover:shadow-cyan-950/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-cyan-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h4>
            <div className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">{value}</div>
          </div>
        </div>

        {onWhyClick && (
          <button
            onClick={onWhyClick}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/90 hover:text-white transition-all shadow-sm"
            title="Klik untuk melihat analisa penyebab (Root Cause Analysis)"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>WHY?</span>
          </button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {changePercent !== null && changePercent !== undefined ? (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-md ${
                isGood
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  : isBad
                  ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : isNegative ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              {isPositive ? `+${changePercent}%` : `${changePercent}%`}
            </span>
          ) : (
            <span className="text-slate-500 italic">Comparison unavailable</span>
          )}
          <span className="text-slate-400">{comparisonLabel}</span>
        </div>

        {subValue && <span className="text-slate-400 font-medium">{subValue}</span>}
      </div>

      {targetValue && (
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between bg-slate-950/40 px-2.5 py-1 rounded border border-slate-800/50">
          <span>Target: {targetValue}</span>
          {targetVariancePercent !== null && targetVariancePercent !== undefined && (
            <span
              className={
                targetVariancePercent > 0
                  ? inverseColors
                    ? 'text-rose-400 font-medium'
                    : 'text-emerald-400 font-medium'
                  : 'text-slate-400'
              }
            >
              Variance: {targetVariancePercent > 0 ? `+${targetVariancePercent}%` : `${targetVariancePercent}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
