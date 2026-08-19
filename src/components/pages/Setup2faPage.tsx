import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { ShieldCheck, QrCode, Copy, Download, Check, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Setup2FAResponse } from '../../types/auth';

interface Props {
  onComplete: () => void;
  onNavigateBack: () => void;
}

export const Setup2faPage: React.FC<Props> = ({ onComplete, onNavigateBack }) => {
  const { setup2FA, verify2FA, error, clearError } = useAuth();

  const [setupData, setSetupData] = useState<Setup2FAResponse | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [step, setStep] = useState<'qr' | 'verify' | 'recovery'>('qr');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSecret() {
      try {
        const data = await setup2FA();
        setSetupData(data);
      } catch {
        // Handled
      }
    }
    loadSecret();
  }, []);

  const handleCopySecret = () => {
    if (!setupData) return;
    navigator.clipboard.writeText(setupData.secretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyRecoveryCodes = () => {
    if (!setupData) return;
    navigator.clipboard.writeText(setupData.recoveryCodes.join('\n'));
    setCopiedRecovery(true);
    setTimeout(() => setCopiedRecovery(false), 2000);
  };

  const handleDownloadRecoveryCodes = () => {
    if (!setupData) return;
    const blob = new Blob([setupData.recoveryCodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FleetAI-Recovery-Codes.txt';
    a.click();
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (totpCode.length !== 6) {
      setLocalError('Harap masukkan 6 digit kode dari aplikasi authenticator Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const verified = await verify2FA(totpCode);
      if (verified) {
        setStep('recovery');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Kode 2FA tidak valid.');
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
          <span>Kembali ke Pengaturan Keamanan</span>
        </button>

        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Setup Autentikasi Dua Faktor (2FA)</h2>
          <p className="mt-1 text-xs text-slate-400">
            Tingkatkan keamanan akun enterprise Anda menggunakan TOTP Authenticator (Google Authenticator, Authy, atau Microsoft Authenticator).
          </p>
        </div>

        {localError && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
            {localError}
          </div>
        )}

        {/* STEP 1: QR & Secret Key */}
        {step === 'qr' && setupData && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center space-y-4">
              <p className="text-xs font-semibold text-slate-300">
                1. Pindai QR Code di bawah ini menggunakan aplikasi authenticator Anda:
              </p>
              
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  <img src={setupData.qrCodeUrl} alt="2FA QR Code" className="h-40 w-40" />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-slate-400 mb-1">Atau masukkan Kunci Rahasia secara manual:</p>
                <div className="flex items-center justify-between rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-xs font-mono font-bold text-cyan-400">
                  <span>{setupData.secretKey}</span>
                  <button
                    onClick={handleCopySecret}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    title="Salin Kunci"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
            >
              <span>Lanjut ke Verifikasi Kode 6-Digit</span>
            </button>
          </div>
        )}

        {/* STEP 2: Verification Code Input */}
        {step === 'verify' && (
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                2. Masukkan 6 digit kode dari aplikasi authenticator Anda:
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="w-full text-center text-xl font-bold tracking-widest rounded-xl border border-slate-800 bg-slate-950 py-3 text-cyan-400 outline-none focus:border-cyan-500"
                placeholder="000000"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('qr')}
                className="w-1/3 rounded-xl border border-slate-800 bg-slate-900 py-3 text-xs font-semibold text-slate-300"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isLoading || totpCode.length !== 6}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <span>{isLoading ? 'Mengaktifkan...' : 'Aktifkan 2FA'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Recovery Codes */}
        {step === 'recovery' && setupData && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Check className="h-5 w-5" />
                <span>2FA Berhasil Diaktifkan!</span>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 flex items-start gap-2.5 text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Simpan Kode Pemulihan (Recovery Codes) ini di tempat yang aman. Setiap kode hanya dapat digunakan 1 kali jika Anda kehilangan akses ke perangkat authenticator.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold text-cyan-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {setupData.recoveryCodes.map((code, idx) => (
                  <div key={idx} className="p-1 text-center bg-slate-900 rounded border border-slate-800">
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyRecoveryCodes}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                >
                  {copiedRecovery ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Salin Semua</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadRecoveryCodes}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
            >
              <span>Selesai & Kembali ke Pengaturan</span>
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
