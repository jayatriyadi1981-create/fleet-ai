import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, HelpCircle, ArrowUpRight } from 'lucide-react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive' | 'ai';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  header,
  footer,
  noPadding = false,
  className = '',
  ...props
}) => {
  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-slate-900/80 border border-slate-800 backdrop-blur-md',
    elevated: 'bg-slate-900/90 border border-slate-800/80 shadow-xl shadow-slate-950/40 backdrop-blur-md',
    outlined: 'bg-slate-950/60 border border-slate-800',
    interactive:
      'bg-slate-900/80 border border-slate-800 backdrop-blur-md hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer hover:shadow-lg hover:shadow-cyan-950/30',
    ai: 'bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 shadow-lg shadow-purple-950/30 backdrop-blur-md relative overflow-hidden',
  };

  return (
    <div className={`rounded-2xl ${variantStyles[variant]} ${className}`} {...props}>
      {header && <div className="border-b border-slate-800 px-5 py-4 font-bold text-white text-sm">{header}</div>}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
      {footer && <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-3 text-xs text-slate-400">{footer}</div>}
    </div>
  );
};

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
  tooltip?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  badgeText,
  badgeVariant = 'info',
  onClick,
  tooltip,
  className = '',
}) => {
  return (
    <Card
      variant={onClick ? 'interactive' : 'elevated'}
      onClick={onClick}
      className={`space-y-3 relative overflow-hidden group ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          {title}
          {tooltip && (
            <span title={tooltip} className="cursor-help text-slate-500 hover:text-slate-300">
              <HelpCircle className="h-3.5 w-3.5" />
            </span>
          )}
        </span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</p>
        {badgeText && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
              badgeVariant === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : badgeVariant === 'warning'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : badgeVariant === 'danger'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold ${
                trend.direction === 'up'
                  ? 'text-emerald-400'
                  : trend.direction === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : trend.direction === 'down' ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : null}
              {trend.value}
            </span>
          )}
          {trend?.label && <span>{trend.label}</span>}
          {!trend && subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};

export interface AIInsightCardProps {
  title: string;
  category?: string;
  description: string;
  impactValue?: string;
  impactLabel?: string;
  onAction?: () => void;
  actionText?: string;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  category = 'OPTIMISASI AI FLEET',
  description,
  impactValue,
  impactLabel = 'Potensi Penghematan',
  onAction,
  actionText = 'Tinjau Rekomendasi',
  className = '',
}) => {
  return (
    <Card variant="ai" className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
          <Sparkles className="h-3 w-3 text-cyan-300" />
          <span>{category}</span>
        </span>
        {impactValue && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            {impactLabel}: {impactValue}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{description}</p>
      </div>

      {onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <span>{actionText}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </Card>
  );
};
