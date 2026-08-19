import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-cyan-400',
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-950/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`rounded-lg bg-slate-800/80 p-2.5 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
