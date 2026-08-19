/**
 * Fleet Intelligence Smart AI - Super Admin Support Access Impersonation Banner
 * Displays high-contrast active banner when a Super Admin is impersonating a tenant.
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, LogOut, Clock, Building2, User } from 'lucide-react';
import { ImpersonationSession } from '../../types/superAdmin';

interface ImpersonationBannerProps {
  session: ImpersonationSession | null;
  onExitImpersonation: () => void;
}

export const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({
  session,
  onExitImpersonation,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!session?.active) return;
    const start = new Date(session.startedAt).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - start) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session || !session.active) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <aside
      aria-label="Mode Akses Support Super Admin"
      className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-4 py-2 text-white shadow-lg border-b border-amber-400/40 select-none animate-in slide-in-from-top duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/25 text-amber-100 font-bold shrink-0">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <div className="text-xs">
          <span className="font-extrabold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded text-[10px] mr-2">
            SUPPORT ACCESS MODE
          </span>
          <span className="font-semibold">
            Mengakses Ruang Kerja Tenant:{' '}
            <strong className="underline decoration-amber-200 underline-offset-2">
              {session.tenantName} ({session.tenantCode})
            </strong>
          </span>
          <span className="hidden md:inline text-amber-100/90 text-[11px] ml-2">
            • Alasan: &quot;{session.reason}&quot;
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-md bg-black/25 px-2.5 py-1 text-xs font-mono font-medium text-amber-100">
          <Clock className="h-3.5 w-3.5" />
          <span>Sesi: {formatTimer(elapsedSeconds)}</span>
        </div>

        <button
          onClick={onExitImpersonation}
          className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-900 hover:text-amber-300 transition-all shadow-md active:scale-95 border border-amber-500/40"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar dari Tenant</span>
        </button>
      </div>
    </aside>
  );
};
