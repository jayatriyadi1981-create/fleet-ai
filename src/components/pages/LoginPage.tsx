import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldAlert, ArrowLeft, KeyRound, Smartphone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ROLE_ACCOUNTS } from '../../services/auth/authProvider';

interface Props {
  onLoginSuccess: () => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onNavigate2FA?: () => void;
  onBackToLanding?: () => void;
}

type LoginMode = 'password' | 'otp';

export const LoginPage: React.FC<Props> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onNavigate2FA,
  onBackToLanding,
}) => {
  const { login, loginWithSSO, loginWithOTP, sendOTP, error, clearError } = useAuth();
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const [email, setEmail] = useState('admin@fleet-demo.local');
  const [password, setPassword] = useState('demo123456');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<'google' | 'microsoft' | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('admin@fleet-demo.local');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCooldown > 0) {
      timer = setInterval(() => {
        setOtpCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
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
        onNavigate2FA();
      }
    } catch {
      // Error is set in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setLocalError('Masukkan alamat email yang valid untuk pengiriman OTP.');
      return;
    }
    clearError();
    setLocalError(null);
    setIsLoading(true);

    try {
      const res = await sendOTP(trimmedEmail, 'Login Passwordless OTP');
      setOtpSent(true);
      setOtpCooldown(res.cooldownSeconds || 45);
      setOtpMessage(res.message);
      setOtpCode('123456'); // Pre-fill mock OTP for smooth preview testing
    } catch (err: any) {
      setLocalError(err.message || 'Gagal mengirim kode OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!otpCode || otpCode.length !== 6) {
      setLocalError('Masukkan 6 digit kode OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginWithOTP(email.trim(), otpCode.trim());
      if (success) {
        onLoginSuccess();
      }
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: 'google' | 'microsoft') => {
    clearError();
    setLocalError(null);
    setSsoLoading(provider);

    try {
      const success = await loginWithSSO(provider);
      if (success) {
        onLoginSuccess();
      }
    } catch {
      // Error handled in AuthContext
    } finally {
      setSsoLoading(null);
    }
  };

  const fillDemoCreds = (roleEmail: string) => {
    setSelectedRoleKey(roleEmail);
    setEmail(roleEmail);
    setPassword('demo123456');
    clearError();
    setLocalError(null);
    setOtpMessage(null);
  };

  const displayError = localError || error;

  return (
    <AuthLayout>
      <div className="space-y-5">
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
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="h-3 w-3" />
              Enterprise Auth & Granular RBAC
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
          <p className="mt-1 text-xs text-slate-400">
            Masuk ke Konsol Manajemen Telematika Fleet Intelligence.
          </p>
        </div>

        {/* Tab Selection: Password vs OTP */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setLoginMode('password');
              clearError();
              setLocalError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              loginMode === 'password'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Email & Kata Sandi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              clearError();
              setLocalError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              loginMode === 'otp'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Login Kode OTP</span>
          </button>
        </div>

        {displayError && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 flex items-start gap-3 text-xs text-red-300 animate-fadeIn">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        {otpMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 flex items-start gap-3 text-xs text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{otpMessage}</span>
          </div>
        )}

        {loginMode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                <span>Ingat saya di perangkat ini (14 hari)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{isLoading ? 'Memvalidasi Autentikasi...' : 'Masuk ke Aplikasi'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alamat Email Terdaftar
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
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
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading || otpCooldown > 0}
                  className="px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 disabled:opacity-50 whitespace-nowrap"
                >
                  {otpCooldown > 0 ? `${otpCooldown}s` : otpSent ? 'Kirim Ulang' : 'Kirim OTP'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                6 Digit Kode OTP
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs tracking-widest font-mono text-cyan-400 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="123456"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Demo helper: Gunakan kode <strong>123456</strong> untuk langsung verifikasi.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !otpCode}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              <span>{isLoading ? 'Memverifikasi OTP...' : 'Masuk dengan OTP'}</span>
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-800" />
          <span className="bg-slate-950 px-3 text-[11px] font-semibold text-slate-500 uppercase">
            Atau Single Sign-On (SSO)
          </span>
        </div>

        {/* Social SSO Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={ssoLoading !== null}
            onClick={() => handleSSOLogin('google')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-700 transition-all disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z"
              />
            </svg>
            <span className="truncate">{ssoLoading === 'google' ? 'Menghubungkan...' : 'Google Login'}</span>
          </button>

          <button
            type="button"
            disabled={ssoLoading !== null}
            onClick={() => handleSSOLogin('microsoft')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-700 transition-all disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <rect fill="#F25022" x="1" y="1" width="10" height="10" />
              <rect fill="#7FBA00" x="13" y="1" width="10" height="10" />
              <rect fill="#00A4EF" x="1" y="13" width="10" height="10" />
              <rect fill="#FFB900" x="13" y="13" width="10" height="10" />
            </svg>
            <span className="truncate">{ssoLoading === 'microsoft' ? 'Menghubungkan...' : 'Microsoft 365'}</span>
          </button>
        </div>

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

        {/* Enterprise Roles & Developer Account Selector for Live Testing */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Pilih Akun Demo & Developer (1-Click Login):
            </p>
            <span className="text-[10px] text-cyan-400 font-mono">Auto-Fill & Test</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar text-xs">
            {Object.entries(DEMO_ROLE_ACCOUNTS).map(([accEmail, accData]) => {
              const isSelected = selectedRoleKey === accEmail;
              const isDev = accData.role === 'developer';
              return (
                <button
                  key={accEmail}
                  type="button"
                  onClick={() => fillDemoCreds(accEmail)}
                  className={`rounded-xl border p-2 text-left transition-all relative ${
                    isSelected
                      ? 'border-cyan-500/80 bg-cyan-500/10 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-500/40'
                      : isDev
                      ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/70 hover:bg-emerald-950/40'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-[11px] capitalize truncate">
                      {isDev ? 'Developer' : accData.role.replace('_', ' ')}
                    </p>
                    {isDev && (
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        DEV
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{accData.name}</p>
                  <p className="text-[9px] text-cyan-400/80 truncate mt-0.5">{accData.email}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

