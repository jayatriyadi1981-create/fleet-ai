import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onNavigateLogin: () => void;
  onNavigateResetPasswordWithToken?: (token: string) => void;
}

export const ForgotPasswordPage: React.FC<Props> = ({
  onNavigateLogin,
  onNavigateResetPasswordWithToken,
}) => {
  const { forgotPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage(null);

    if (!email || !email.includes('@')) {
      alert('Masukkan alamat email yang valid.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword({ email: email.trim() });
      setSuccessMessage(res.message);
      // Simulate generated server token for demo testing
      const token = 'token_reset_' + Math.random().toString(36).substring(2, 10);
      setSimulatedToken(token);
    } catch {
      // Error handled
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-white tracking-tight">Lupa Kata Sandi?</h2>
          <p className="mt-1 text-xs text-slate-400">
            Masukkan alamat email perusahaan Anda. Kami akan mengirimkan tautan aman untuk menyetel ulang kata sandi.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 flex items-start gap-2.5 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-5 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-5 w-5" />
              <span>Instruksi Reset Dikirim</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {successMessage}
            </p>

            {/* Simulated server token preview for testing */}
            {simulatedToken && onNavigateResetPasswordWithToken && (
              <div className="pt-3 border-t border-emerald-900/50 space-y-2">
                <p className="text-[10px] text-emerald-300/80 uppercase font-bold tracking-wider">
                  Tautan Pemulihan Demo (Satu Kali Pakai):
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateResetPasswordWithToken(simulatedToken)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  <span>Buka Halaman Reset Password dengan Token</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  placeholder="admin@perusahaan.co.id"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <span>{isLoading ? 'Mengirimkan Tautan Reset...' : 'Kirim Link Reset Password'}</span>
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
