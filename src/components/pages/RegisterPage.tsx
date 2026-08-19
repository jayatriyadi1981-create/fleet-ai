import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { Mail, Lock, User, Building, Phone, ArrowLeft, ShieldAlert, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { calculatePasswordStrength } from '../../utils/authUtils';

interface Props {
  onRegisterSuccess: (email: string) => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<Props> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const { register, error, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const strength = calculatePasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!fullName.trim() || !email.trim() || !companyName.trim() || !phoneWhatsapp.trim()) {
      setLocalError('Harap lengkapi semua bidang wajib.');
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setLocalError('Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    if (strength.score < 2) {
      setLocalError('Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi angka dan simbol.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName,
        email,
        phoneWhatsapp,
        companyName,
        password,
        confirmPassword,
        referralCode,
        termsAccepted,
        privacyAccepted,
      });

      onRegisterSuccess(email);
    } catch (err: any) {
      // Error handled in AuthContext or local
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <AuthLayout>
      <div className="space-y-5">
        <button
          onClick={onNavigateLogin}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Sudah punya akun? Kembali ke Login</span>
        </button>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daftarkan Perusahaan Armada Anda</h2>
          <p className="mt-1 text-xs text-slate-400">
            Mulai uji coba gratis Fleet Intelligence untuk efisiensi operasional.
          </p>
        </div>

        {displayError && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 flex items-start gap-2.5 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  placeholder="Budi Santoso"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  placeholder="budi@perusahaan.co.id"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Perusahaan *</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  placeholder="PT Trans Logistik Utama"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor WhatsApp *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phoneWhatsapp}
                  onChange={(e) => setPhoneWhatsapp(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  placeholder="08123456789"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi (Password) *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                placeholder="Buat password aman"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/80">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Kekuatan Password:</span>
                  <span
                    className={`font-bold ${
                      strength.label === 'Strong'
                        ? 'text-emerald-400'
                        : strength.label === 'Good'
                        ? 'text-cyan-400'
                        : strength.label === 'Fair'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength.score >= 1 ? 'bg-red-500 w-1/4' : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength.score >= 2 ? 'bg-amber-500 w-1/4' : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength.score >= 3 ? 'bg-cyan-500 w-1/4' : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength.score >= 4 ? 'bg-emerald-500 w-1/4' : 'bg-transparent'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Konfirmasi Kata Sandi *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                placeholder="Ulangi password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Kode Referral / Promosi (Opsional)</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              placeholder="e.g. FLEET2026"
            />
          </div>

          {/* Terms & Privacy */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <label className="flex items-start gap-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500"
              />
              <span>
                Saya menyetujui <a href="#" className="text-cyan-400 hover:underline font-semibold">Terms of Service</a> dan ketentuan lisensi SaaS Fleet Intelligence.
              </span>
            </label>

            <label className="flex items-start gap-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500"
              />
              <span>
                Saya telah membaca dan menyetujui <a href="#" className="text-cyan-400 hover:underline font-semibold">Privacy Policy</a> pemrosesan data GPS telematika.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Mendaftarkan Perusahaan...' : 'Buat Akun Perusahaan'}</span>
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
