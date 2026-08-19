import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { MailCheck, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatTimeCooldown } from '../../utils/authUtils';

interface Props {
  email: string;
  onNavigateLogin: () => void;
  onNavigateChangeEmail?: () => void;
}

export const VerifyEmailPage: React.FC<Props> = ({
  email,
  onNavigateLogin,
  onNavigateChangeEmail,
}) => {
  const [cooldown, setCooldown] = useState(45);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(45);
    setResendMessage('Link verifikasi email baru telah dikirimkan ke ' + email);
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

        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-xl">
            <MailCheck className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Verifikasi Email Anda</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Kami telah mengirimkan tautan verifikasi ke alamat email perusahaan Anda:
          </p>
          <p className="font-bold text-cyan-400 text-sm bg-slate-900 py-2 px-4 rounded-xl border border-slate-800 inline-block">
            {email || 'admin@perusahaan.co.id'}
          </p>
        </div>

        {resendMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{resendMessage}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${cooldown > 0 ? '' : 'animate-spin'}`} />
            <span>
              {cooldown > 0
                ? `Kirim Ulang Email (${formatTimeCooldown(cooldown)})`
                : 'Kirim Ulang Email Verifikasi'}
            </span>
          </button>

          {onNavigateChangeEmail && (
            <button
              type="button"
              onClick={onNavigateChangeEmail}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              Ubah Alamat Email
            </button>
          )}

          <div className="pt-4 border-t border-slate-900 text-center">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              Sudah memverifikasi email? Masuk ke Aplikasi
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
