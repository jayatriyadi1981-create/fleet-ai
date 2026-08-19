/**
 * Fleet Intelligence Smart AI - Dedicated User Profile & Account Security View
 */

import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { PageHeader } from '../common/PageHeader';
import { PageTransition } from '../common/PageTransition';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Clock, 
  Bell, 
  Save, 
  CheckCircle2, 
  Globe, 
  Lock,
  LogOut
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, currentTenant } = useFleet();
  const { userRole, scope } = useAuthorization();

  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'sessions' | 'preferences'>('info');
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [dept, setDept] = useState(currentUser.department);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader badge="AKUN PERUSAHAAN" />

        {isSaved && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-400 font-semibold flex items-center justify-between">
            <span>Perubahan profil pengguna berhasil disimpan!</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          </div>
        )}

        {/* Top Profile Summary Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 font-bold text-2xl text-slate-950 shadow-xl shadow-cyan-950/50 border border-cyan-400/40 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  AKUN AKTIF
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser.email} • {dept}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                <span className="text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-md font-bold uppercase">
                  ROLE: {userRole}
                </span>
                <span className="text-slate-400">SCOPE: {scope}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-left md:text-right font-mono text-xs">
              <p className="text-slate-400">Organisasi Induk:</p>
              <p className="font-bold text-white mt-0.5">{currentTenant.name}</p>
              <p className="text-[10px] text-slate-500">{currentTenant.subscriptionPlan}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'info', label: 'Informasi Personal', icon: User },
            { id: 'security', label: 'Keamanan & 2FA', icon: Key },
            { id: 'sessions', label: 'Sesi Aktif & Log', icon: Clock },
            { id: 'preferences', label: 'Notifikasi & Preferensi', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-400" />
              Detail Informasi Staf Perusahaan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alamat Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Divisi & Departemen Operasional</label>
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Otentikasi Dua-Faktor (2FA) & Kredensial
            </h3>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Smartphone className="h-6 w-6 text-cyan-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Status 2FA TOTP Authenticator</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Melindungi akun Anda menggunakan kode OTP dari Google Authenticator / Authy.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono shrink-0">
                TERVERIFIKASI & AKTIF
              </span>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ubah Kata Sandi</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kata Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              Sesi Login Perangkat Aktif
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="font-bold text-white">Google Chrome di macOS (Sesi Ini)</p>
                    <p className="text-[11px] text-slate-400">IP: 182.253.120.45 • Jakarta, Indonesia</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  AKTIF SEKARANG
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-cyan-400" />
              Preferensi Notifikasi Telematika
            </h3>
            <p className="text-xs text-slate-400">
              Pilih jenis peringatan insiden yang dikirimkan langsung ke email dan WhatsApp Anda.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
