import React from 'react';
import { Inbox, AlertCircle, RefreshCw, SearchX, ShieldAlert, WifiOff, Settings, Plus } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak Ada Data',
  description = 'Belum ada data yang tersedia untuk ditampilkan saat ini.',
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-cyan-400 border border-slate-700/50 shadow-inner">
        {icon || <Inbox className="h-7 w-7 text-slate-400" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {actionText && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const NoSearchResultState: React.FC<{
  query?: string;
  onClear?: () => void;
  className?: string;
}> = ({ query, onClear, className = '' }) => {
  return (
    <EmptyState
      icon={<SearchX className="h-7 w-7 text-amber-400" />}
      title="Pencarian Tidak Ditemukan"
      description={
        query
          ? `Tidak ditemukan entitas data dengan kata kunci "${query}". Silakan periksa ejaan atau ubah kriteria filter.`
          : 'Kriteria pencarian atau filter yang Anda gunakan tidak menghasilkan data.'
      }
      actionText={onClear ? 'Bersihkan Pencarian' : undefined}
      onAction={onClear}
      className={className}
    />
  );
};

export const NoPermissionState: React.FC<{
  requiredRole?: string;
  onBack?: () => void;
  className?: string;
}> = ({ requiredRole, onBack, className = '' }) => {
  return (
    <EmptyState
      icon={<ShieldAlert className="h-7 w-7 text-rose-400" />}
      title="Akses Terbatas"
      description={
        requiredRole
          ? `Fitur ini membutuhkan hak akses khusus (${requiredRole}). Hubungi Super Admin organisasi Anda untuk mendapatkan otorisasi.`
          : 'Anda tidak memiliki izin (RBAC permission) untuk mengakses fitur atau data ini.'
      }
      actionText={onBack ? 'Kembali ke Dashboard' : undefined}
      onAction={onBack}
      className={className}
    />
  );
};

export const NoConnectionState: React.FC<{
  onRetry?: () => void;
  className?: string;
}> = ({ onRetry, className = '' }) => {
  return (
    <EmptyState
      icon={<WifiOff className="h-7 w-7 text-amber-400" />}
      title="Koneksi Terputus"
      description="Koneksi internet atau saluran GPS telemetry ke server backend sedang terganggu. Data offline ditampilkan dari cache lokal."
      actionText={onRetry ? 'Coba Sambungkan Ulang' : undefined}
      onAction={onRetry}
      className={className}
    />
  );
};

export const NoConfigurationState: React.FC<{
  title?: string;
  description?: string;
  onConfigure?: () => void;
  buttonText?: string;
  className?: string;
}> = ({
  title = 'Konfigurasi Belum Diatur',
  description = 'Modul ini membutuhkan konfigurasi parameter awal agar dapat mengolah telemetri dan data operasional armada secara optimal.',
  onConfigure,
  buttonText = 'Mulai Konfigurasi',
  className = '',
}) => {
  return (
    <EmptyState
      icon={<Settings className="h-7 w-7 text-cyan-400" />}
      title={title}
      description={description}
      actionText={onConfigure ? buttonText : undefined}
      onAction={onConfigure}
      className={className}
    />
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
  message = 'Terjadi kendala saat memuat data dari server telematics. Silakan coba beberapa saat lagi.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/25 bg-rose-950/15 space-y-3.5 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-rose-300/80 max-w-sm mt-1 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Coba Muat Ulang
        </Button>
      )}
    </div>
  );
};

