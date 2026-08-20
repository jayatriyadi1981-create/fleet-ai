import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  trend,
  icon: Icon,
  iconColor = 'text-cyan-400',
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${title}: ${value}`}
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/85 p-4 sm:p-5 backdrop-blur-md transition-all duration-200 hover:border-slate-700/90 hover:shadow-xl hover:shadow-cyan-950/20 ${
        onClick ? 'cursor-pointer active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-cyan-400' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold">
              {badge}
            </span>
          )}
          <div className={`rounded-xl bg-slate-800/90 p-2.5 ${iconColor} border border-slate-700/50 shadow-inner`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-kpi font-mono">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
              trend.isPositive
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
            }`}
            aria-label={`Tren: ${trend.isPositive ? 'Kenaikan' : 'Penurunan'} ${trend.value}`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0" />
            )}
            <span>{trend.value}</span>
            {trend.label && <span className="text-[10px] text-slate-400 font-normal">{trend.label}</span>}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-400 font-medium leading-relaxed">{subtitle}</p>}
    </div>
  );
};

