import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLoadingScreen } from './AuthLoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  onRedirectLogin: (redirectPath?: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  onRedirectLogin,
}) => {
  const { status, isAuthenticated, hasPermission } = useAuth();

  if (status === 'loading' || status === 'unknown') {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    onRedirectLogin(currentPath);
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-slate-950">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-8 max-w-md space-y-4">
          <h2 className="text-lg font-bold text-red-400">Akses Ditolak (403 Forbidden)</h2>
          <p className="text-xs text-slate-300">
            Peran pengguna Anda tidak memiliki izin (<code className="text-cyan-400">{requiredPermission}</code>) untuk mengakses modul ini.
          </p>
          <button
            onClick={() => window.history.back()}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
