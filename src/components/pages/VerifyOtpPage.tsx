import React, { useState, useRef, useEffect } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { ShieldCheck, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatTimeCooldown } from '../../utils/authUtils';

interface Props {
  email: string;
  purpose?: 'login' | 'email_verification' | 'password_reset' | 'mfa';
  onVerifySuccess: () => void;
  onNavigateBack: () => void;
}

export const VerifyOtpPage: React.FC<Props> = ({
  email,
  purpose = 'login',
  onVerifySuccess,
  onNavigateBack,
}) => {
  const { verifyOTP, sendOTP, error, clearError } = useAuth();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take last char if typing single char
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto advance
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      setLocalError('Harap masukkan 6 digit kode OTP secara lengkap.');
      return;
    }

    setIsLoading(true);
    try {
      const verified = await verifyOTP({
        email,
        otpCode: fullCode,
        purpose,
      });

      if (verified) {
        onVerifySuccess();
      }
    } catch (err: any) {
      setLocalError(err.message || 'Kode OTP tidak valid atau telah kedaluwarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    clearError();
    setLocalError(null);
    try {
      const res = await sendOTP(email, purpose);
      setCooldown(res.cooldownSeconds || 45);
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch {
      // Error handled
    }
  };

  const displayError = localError || error;

  return (
    <AuthLayout>
      <div className="space-y-6">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali</span>
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Masukkan Kode OTP</h2>
          <p className="text-xs text-slate-400">
            Kode verifikasi 6 digit telah dikirimkan ke <span className="font-bold text-white">{email}</span>.
          </p>
        </div>

        {displayError && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 flex items-start gap-2.5 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP 6-Digit Array Input */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-slate-800 bg-slate-900 text-center text-lg font-bold text-cyan-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                aria-label={`Digit OTP ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Verifikasi Kode OTP'}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs space-y-2">
          <p className="text-slate-400">Tidak menerima kode?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={cooldown > 0}
            className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:underline disabled:opacity-50 disabled:no-underline text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>
              {cooldown > 0
                ? `Kirim Ulang Kode (${formatTimeCooldown(cooldown)})`
                : 'Kirim Ulang Kode OTP'}
            </span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
