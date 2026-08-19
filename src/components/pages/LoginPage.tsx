import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldAlert, ArrowLeft, Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onLoginSuccess: () => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onNavigate2FA?: () => void;
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<Props> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onNavigate2FA,
  onBackToLanding,
}) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('admin@fleet-demo.local');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setLocalError('Masukkan alamat email yang valid.');
      return;
    }

    if (!password) {
      setLocalError('Masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login({
        email: trimmedEmail,
        password,
        rememberMe,
      });

      if (success) {
        onLoginSuccess();
      } else if (onNavigate2FA) {
        // MFA is required
        onNavigate2FA();
      }
    } catch (err: any) {
      // Error handled by AuthContext or caught here
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCreds = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('demo123456');
    clearError();
    setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <AuthLayout>
      <div className="space-y-6">
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </button>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
          <p className="mt-1 text-xs text-slate-400">
            Masuk ke Konsol Manajemen Telematika Fleet Intelligence.
          </p>
        </div>

        {displayError && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 flex items-start gap-3 text-xs text-red-300 animate-fadeIn">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Alamat Email Perusahaan
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="nama@perusahaan.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Kata Sandi (Password)
              </label>
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20"
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            <span>{isLoading ? 'Memproses Autentikasi...' : 'Masuk ke Aplikasi'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-800" />
          <span className="bg-slate-950 px-3 text-[11px] font-semibold text-slate-500 uppercase">
            Atau Lanjutkan Dengan
          </span>
        </div>

        {/* Social SSO Foundation */}
        <button
          type="button"
          onClick={() => alert('Social login SSO Google Workspace memerlukan konfigurasi OAuth Enterprise.')}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Chrome className="h-4 w-4 text-cyan-400" />
          <span>Masuk dengan Google Workspace</span>
        </button>

        {/* Registration Link */}
        <p className="text-center text-xs text-slate-400">
          Belum memiliki akun perusahaan?{' '}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="font-bold text-cyan-400 hover:underline"
          >
            Daftarkan Perusahaan
          </button>
        </p>

        {/* Demo Quick Accounts */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pilih Akun Demo Development:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillDemoCreds('admin@fleet-demo.local')}
              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-left hover:border-cyan-500/40 transition-colors"
            >
              <p className="font-bold text-white text-[11px]">Company Admin</p>
              <p className="text-[10px] text-slate-400">Akses Penuh Perusahaan</p>
            </button>
            <button
              onClick={() => fillDemoCreds('manager@fleet-demo.local')}
              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-left hover:border-cyan-500/40 transition-colors"
            >
              <p className="font-bold text-white text-[11px]">Fleet Manager</p>
              <p className="text-[10px] text-slate-400">Akses Armada & Driver</p>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
