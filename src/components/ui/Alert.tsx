import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Sparkles, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'danger' | 'ai';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  actionText,
  onAction,
  className = '',
}) => {
  const styles: Record<
    AlertType,
    { bg: string; border: string; text: string; icon: React.ReactNode }
  > = {
    info: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/25',
      text: 'text-sky-300',
      icon: <Info className="h-4 w-4 text-sky-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/25',
      text: 'text-emerald-300',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/25',
      text: 'text-amber-300',
      icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
    },
    danger: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/25',
      text: 'text-rose-300',
      icon: <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />,
    },
    ai: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-200',
      icon: <Sparkles className="h-4 w-4 text-purple-400 shrink-0 animate-pulse" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`flex items-start justify-between rounded-xl border p-4 text-xs ${current.bg} ${current.border} ${current.text} ${className}`}
    >
      <div className="flex items-start gap-3">
        {current.icon}
        <div className="space-y-0.5">
          {title && <h4 className="font-bold text-white text-xs">{title}</h4>}
          <div className="leading-relaxed">{children}</div>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-[11px] font-bold underline underline-offset-2 hover:opacity-80"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 -mr-1"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
