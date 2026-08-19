import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { ShieldCheck, KeyRound, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onVerifySuccess: () => void;
  onNavigateBack: () => void;
}

export const Verify2faPage: React.FC<Props> = ({ onVerifySuccess, onNavigateBack }) => {
  const { login, error, clearError, user } = useAuth();
  const [code, setCode] = useState('');
  const [useRecovery, setUseRecovery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!code) {
      setLocalError('Masukkan kode autentikasi 2FA.');
      return;
    }

    setIsLoading(true);
    try {
      const email = user?.email || 'admin@fleet-demo.local';
      const success = await login({
        email,
        totpCode: useRecovery ? undefined : code,
        recoveryCode: useRecovery ? code : undefined,
      });

      if (success) {
        onVerifySuccess();
      }
    } catch (err: any) {
      setLocalError(err.message || 'Kode 2FA / Recovery Code tidak valid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Batal & Kembali ke Login</span>
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Verifikasi Dua Faktor (2FA)</h2>
          <p className="text-xs text-slate-400">
            {useRecovery
              ? 'Masukkan salah satu Kode Pemulihan (Recovery Code) 8-karakter Anda:'
              : 'Masukkan 6 digit kode dari aplikasi Authenticator Anda:'}
          </p>
        </div>

        {(localError || error) && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 flex items-start gap-2.5 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {useRecovery ? 'Kode Pemulihan (Recovery Code)' : 'Kode Authenticator (6 Digit)'}
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-center text-lg font-bold tracking-widest rounded-xl border border-slate-800 bg-slate-900 py-3 text-cyan-400 outline-none focus:border-cyan-500"
              placeholder={useRecovery ? 'XXXX-XXXX' : '000000'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !code}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setUseRecovery(!useRecovery);
              setCode('');
              setLocalError(null);
            }}
            className="text-xs text-cyan-400 font-semibold hover:underline"
          >
            {useRecovery
              ? 'Gunakan Kode Aplikasi Authenticator'
              : 'Gunakan Kode Pemulihan (Recovery Code)'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
