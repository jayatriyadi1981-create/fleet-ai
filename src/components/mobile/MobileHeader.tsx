import React from 'react';
import { ArrowLeft, Menu, Bell, Search, MoreVertical, Sparkles } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

export interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
  showNotification?: boolean;
  showAiTrigger?: boolean;
  rightActions?: React.ReactNode;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showSearch = false,
  onSearchClick,
  showNotification = true,
  showAiTrigger = false,
  rightActions,
  className = '',
}) => {
  const { 
    unreadAlertsCount, 
    setIsMobileMenuOpen, 
    setIsAiDrawerOpen, 
    setActiveView 
  } = useFleet();

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800/90 bg-slate-950/90 px-3 backdrop-blur-md md:hidden ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack ? (
          <button
            type="button"
            onClick={onBack || (() => window.history.back())}
            aria-label="Kembali ke halaman sebelumnya"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Buka menu navigasi"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-400 truncate leading-none mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {showSearch && (
          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Cari data"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        {showAiTrigger && (
          <button
            type="button"
            onClick={() => setActiveView('fleet_assistant')}
            aria-label="Tanya Fleet AI Assistant"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:text-white transition-all shadow-sm shadow-purple-950/40"
          >
            <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />
          </button>
        )}

        {showNotification && (
          <button
            type="button"
            onClick={() => setActiveView('alerts')}
            aria-label={`Notifikasi peringatan (${unreadAlertsCount} belum dibaca)`}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>
        )}

        {rightActions}
      </div>
    </header>
  );
};
