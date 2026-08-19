import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak Ada Data',
  description = 'Belum ada data yang tersedia untuk ditampilkan saat ini.',
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/50">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
      </div>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kesalahan sistem saat menghubungi server telemetry. Silakan coba lagi.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-3 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-xs text-rose-300/80 max-w-sm mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
};
