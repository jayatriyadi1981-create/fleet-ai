/**
 * AI Driver Insight Card - Actionable Intelligence & Telematics Alerts
 * PROMPT 29
 */

import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  UserCheck,
  Brain,
} from 'lucide-react';
import { DriverRiskLevel, DriverScoreTrend } from '../../types';

interface AIDriverInsightCardProps {
  title: string;
  category: 'RISK' | 'SAFETY' | 'COACHING' | 'TREND' | 'ACHIEVEMENT';
  level?: DriverRiskLevel;
  trend?: DriverScoreTrend;
  summary: string;
  evidence: string[];
  actionLabel?: string;
  onAction?: () => void;
  driverName?: string;
  driverId?: string;
  score?: number;
}

export const AIDriverInsightCard: React.FC<AIDriverInsightCardProps> = ({
  title,
  category,
  level,
  trend,
  summary,
  evidence,
  actionLabel,
  onAction,
  driverName,
  score,
}) => {
  const getCategoryStyles = () => {
    switch (category) {
      case 'RISK':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          border: 'border-rose-900/40 hover:border-rose-700/60',
          icon: AlertTriangle,
          iconColor: 'text-rose-400',
        };
      case 'SAFETY':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          border: 'border-emerald-900/40 hover:border-emerald-700/60',
          icon: ShieldCheck,
          iconColor: 'text-emerald-400',
        };
      case 'COACHING':
        return {
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          border: 'border-cyan-900/40 hover:border-cyan-700/60',
          icon: Brain,
          iconColor: 'text-cyan-400',
        };
      case 'TREND':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          border: 'border-amber-900/40 hover:border-amber-700/60',
          icon: trend === 'IMPROVING' ? TrendingDown : TrendingUp,
          iconColor: trend === 'IMPROVING' ? 'text-emerald-400' : 'text-amber-400',
        };
      default:
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          border: 'border-blue-900/40 hover:border-blue-700/60',
          icon: Sparkles,
          iconColor: 'text-blue-400',
        };
    }
  };

  const style = getCategoryStyles();
  const Icon = style.icon;

  return (
    <div
      className={`relative rounded-2xl bg-slate-900/90 p-5 border ${style.border} transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${style.badge} flex items-center gap-1`}
            >
              <Icon className="w-3 h-3" />
              {category}
            </span>
            {driverName && (
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-cyan-400" />
                {driverName}
              </span>
            )}
          </div>
          {score !== undefined && (
            <span
              className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-lg border ${
                score > 60
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : score > 35
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {category === 'RISK' ? `RISK ${score}` : `SCORE ${score}`}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-white tracking-tight leading-snug mb-2">
          {title}
        </h4>

        {/* Summary */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3">{summary}</p>

        {/* Evidence List */}
        {evidence.length > 0 && (
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block font-bold">
              Bukti Telemetri Terverifikasi:
            </span>
            {evidence.map((ev, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{ev}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Action */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-bold transition-all"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
