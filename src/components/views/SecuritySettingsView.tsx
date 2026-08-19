import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  KeyRound,
  Laptop,
  Smartphone,
  Tablet,
  LogOut,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  History,
  ShieldAlert,
} from 'lucide-react';
import { calculatePasswordStrength } from '../../utils/authUtils';

interface Props {
  onNavigateSetup2FA?: () => void;
}

export const SecuritySettingsView: React.FC<Props> = ({ onNavigateSetup2FA }) => {
  const {
    user,
    session,
    activeSessions,
    securityAuditLogs,
    changePassword,
    disable2FA,
    revokeSession,
    logoutAllSessions,
  } = useAuth();

  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const strength = calculatePasswordStrength(newPass);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess(null);
    setPassError(null);

    if (newPass !== confirmPass) {
      setPassError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    if (strength.score < 2) {
      setPassError('Password baru terlalu lemah. Gunakan minimal 8 karakter dengan angka dan simbol.');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(currentPass, newPass);
      setPassSuccess('Kata sandi berhasil diperbarui.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassError(err.message || 'Gagal mengubah password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleDisable2FA = async () => {
    if (confirm('Apakah Anda yakin ingin menonaktifkan Autentikasi Dua Faktor (2FA)? Sesi Anda akan kurang terlindungi.')) {
      try {
        await disable2FA();
        alert('2FA berhasil dinonaktifkan.');
      } catch (err: any) {
        alert(err.message || 'Gagal menonaktifkan 2FA');
      }
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
    } catch (err: any) {
      alert(err.message || 'Gagal menghentikan sesi.');
    }
  };

  const handleLogoutAllOther = async () => {
    if (confirm('Apakah Anda yakin ingin menghentikan semua sesi login di perangkat lain?')) {
      try {
        await logoutAllSessions();
        alert('Semua sesi di perangkat lain telah berhasil dihentikan.');
      } catch (err: any) {
        alert(err.message || 'Gagal menghentikan semua sesi.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-cyan-400" />
          <span>Keamanan Akun & Manajemen Sesi</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Ubah kata sandi, kelola autentikasi 2FA, lihat perangkat aktif, dan audit aktivitas keamanan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Password Change & 2FA */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Change Password */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-cyan-400" />
              <span>Perbarui Kata Sandi</span>
            </h3>

            {passSuccess && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                      placeholder="Password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                      placeholder="Ulangi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {newPass.length > 0 && (
                <div className="text-[11px] text-slate-400">
                  Kekuatan Password: <span className="font-bold text-cyan-400">{strength.label}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  {isChangingPass ? 'Memperbarui...' : 'Simpan Kata Sandi Baru'}
                </button>
              </div>
            </form>
          </div>

          {/* 2. Two-Factor Authentication (2FA) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Autentikasi Dua Faktor (2FA / TOTP)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Melindungi akun Anda dari akses yang tidak sah menggunakan kode autentikasi 6-digit.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/30 bg-emerald-950/50 text-emerald-300">
                2FA Aktif
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Status Proteksi: TOTP Authenticator</span>
              <div className="flex gap-2">
                {onNavigateSetup2FA && (
                  <button
                    onClick={onNavigateSetup2FA}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-bold text-cyan-400 hover:bg-slate-800"
                  >
                    Konfigurasi Ulang 2FA
                  </button>
                )}
                <button
                  onClick={handleDisable2FA}
                  className="rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-900/40"
                >
                  Nonaktifkan 2FA
                </button>
              </div>
            </div>
          </div>

          {/* 3. Active Sessions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-cyan-400" />
                  <span>Sesi Perangkat Aktif ({activeSessions.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daftar perangkat yang terhubung ke akun Anda saat ini.
                </p>
              </div>

              <button
                onClick={handleLogoutAllOther}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900/40"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluarkan Sesi Lain</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeSessions.map((s) => (
                <div
                  key={s.sessionId}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                      {s.os.includes('Android') || s.os.includes('iOS') ? (
                        <Smartphone className="h-4 w-4" />
                      ) : s.os.includes('iPad') ? (
                        <Tablet className="h-4 w-4" />
                      ) : (
                        <Laptop className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{s.deviceName}</p>
                        {s.isCurrent && (
                          <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-800">
                            Perangkat Ini
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {s.browser} • {s.os} • IP: {s.ipAddress} ({s.location})
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Aktivitas terakhir: {s.lastActive}</p>
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(s.sessionId)}
                      className="text-[11px] text-red-400 hover:underline font-semibold"
                    >
                      Hentikan Sesi
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Activity Audit Log */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="h-4 w-4 text-cyan-400" />
              <span>Audit Log Aktivitas Keamanan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Riwayat peristiwa penting otentikasi akun enterprise.
            </p>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {securityAuditLogs.map((log) => (
                <div key={log.id} className="relative pl-7 text-xs space-y-0.5">
                  <div
                    className={`absolute left-2 top-1 h-3 w-3 rounded-full border-2 border-slate-900 ${
                      log.status === 'success'
                        ? 'bg-emerald-400'
                        : log.status === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-red-500'
                    }`}
                  />
                  <p className="font-bold text-white">{log.title}</p>
                  <p className="text-[11px] text-slate-400">{log.description}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
