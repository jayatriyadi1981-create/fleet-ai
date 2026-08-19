/**
 * Fleet Intelligence Smart AI - 403 Access Denied (Forbidden) View
 */

import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldX, ArrowLeft, KeyRound, Lock, UserCheck } from 'lucide-react';

interface ForbiddenPageProps {
  requiredPermission?: string;
  onNavigateHome?: () => void;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({ requiredPermission, onNavigateHome }) => {
  const { setActiveView } = useFleet();
  const { user } = useAuth();

  const handleBackToDashboard = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      setActiveView('dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-inner mx-auto">
          <ShieldX className="h-10 w-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-bold text-rose-400">
            HTTP 403 • ACCESS DENIED
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Akses Dibatasi oleh Sistem
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Akun Anda tidak memiliki hak akses yang diperlukan untuk membuka halaman atau fitur ini.
          </p>
        </div>

        {/* Role & Permission Info Box */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4 text-left space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
              Peran Pengguna Aktif:
            </span>
            <span className="px-2 py-0.5 rounded font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 uppercase">
              {user?.role || 'Guest'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              Nama Pengguna:
            </span>
            <span className="font-semibold text-slate-200">{user?.name || '-'}</span>
          </div>

          {requiredPermission && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-rose-400" />
                Izin Dibutuhkan:
              </span>
              <span className="font-mono text-rose-400 font-medium">{requiredPermission}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Jika Anda memerlukan akses ke fitur ini, hubungi Administrator Perusahaan (<span className="text-slate-300">Company Admin</span>) Anda.
        </p>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={handleBackToDashboard}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 text-sm transition-all shadow-lg shadow-cyan-950/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard Utama
          </button>
        </div>
      </div>
    </div>
  );
};
