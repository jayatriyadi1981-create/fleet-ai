import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { calculatePasswordStrength } from '../../utils/authUtils';

interface Props {
  token: string;
  onNavigateLogin: () => void;
}

export const ResetPasswordPage: React.FC<Props> = ({ token, onNavigateLogin }) => {
  const { resetPassword, error, clearError } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const strength = calculatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (newPassword !== confirmPassword) {
      setLocalError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    if (strength.score < 2) {
      setLocalError('Password terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi angka dan simbol.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
    } catch {
      // Error handled
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <AuthLayout>
      <div className="space-y-6">
        <button
          onClick={onNavigateLogin}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Halaman Login</span>
        </button>

        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <KeyRound className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Setel Ulang Kata Sandi</h2>
          <p className="mt-1 text-xs text-slate-400">
            Buat kata sandi baru yang aman untuk akun perusahaan Anda.
          </p>
        </div>

        {displayError && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
            {displayError}
          </div>
        )}

        {success ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-5 w-5" />
              <span>Password Berhasil Diperbarui</span>
            </div>
            <p className="text-xs text-slate-300">
              Kata sandi Anda telah diperbarui. Silakan masuk kembali menggunakan kata sandi baru Anda.
            </p>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              <span>Masuk Sekarang</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  placeholder="Password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="mt-2 text-[11px] text-slate-400">
                  Kekuatan: <span className="font-bold text-cyan-400">{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <span>{isLoading ? 'Memperbarui Password...' : 'Simpan Kata Sandi Baru'}</span>
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
