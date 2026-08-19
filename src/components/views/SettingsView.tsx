import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Building2, ShieldCheck, Radio, KeyRound, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { SecuritySettingsView } from './SecuritySettingsView';

interface SettingsViewProps {
  onNavigateSetup2FA?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigateSetup2FA }) => {
  const { currentTenant, currentUser, branches, setActiveView } = useFleet();
  const { user } = useAuth();
  const { subscription, currentPlan, isTrial, trialDaysRemaining, effectiveQuotas, usage } = useSubscription();
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  const activeUser = user || currentUser;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Pengaturan Tenant & Konfigurasi Keamanan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Profil perusahaan, cabang, manajemen sesi aktif, dan autentikasi dua faktor (2FA).
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Profil Tenant & Cabang</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Keamanan & 2FA</span>
          </button>
        </div>
      </div>

      {activeTab === 'security' ? (
        <SecuritySettingsView onNavigateSetup2FA={onNavigateSetup2FA} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-400" />
                <span>Profil Perusahaan Tenant</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">Nama Perusahaan</label>
                  <p className="font-bold text-white mt-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {currentTenant.name}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">NPWP Perusahaan</label>
                  <p className="font-bold text-white mt-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {currentTenant.taxIdNpwp}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 font-medium">Alamat Kantor Pusat</label>
                  <p className="font-bold text-white mt-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {currentTenant.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400" />
                <span>Daftar Cabang & Hub Logistik ({branches.length})</span>
              </h3>

              <div className="space-y-2">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{b.name}</p>
                      <p className="text-[10px] text-slate-400">
                        Kota: {b.city} • Manager: {b.managerName}
                      </p>
                    </div>
                    <span className="font-semibold text-cyan-400">{b.vehiclesCount} Unit Armada</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Subscription & Quota Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-cyan-400" />
                  <span>Paket Langganan SaaS</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isTrial ? `TRIAL (${trialDaysRemaining} HARI)` : subscription?.status || 'ACTIVE'}
                </span>
              </div>

              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Paket:</span>
                  <span className="font-bold text-white text-sm">{currentPlan?.name || 'Professional'}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Armada Terpakai:</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {usage.vehicles} / {effectiveQuotas.vehicleQuota === -1 ? '∞' : effectiveQuotas.vehicleQuota} unit
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">AI Credits:</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {usage.aiCredits.toLocaleString('id-ID')} / {effectiveQuotas.aiQuotaCredits === -1 ? '∞' : effectiveQuotas.aiQuotaCredits.toLocaleString('id-ID')} cr
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveView('subscription')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-bold text-white transition-colors shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Kelola Billing & Upgrade Paket</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Pengguna Aktif</span>
              </h3>
              <div className="text-xs space-y-2">
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                  <p className="font-bold text-white">{activeUser.name}</p>
                  <p className="text-slate-400 text-[10px]">{activeUser.email}</p>
                  <p className="text-cyan-400 font-bold text-[11px] capitalize">
                    Role: {activeUser.role.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('security')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
              >
                <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                <span>Buka Pengaturan Keamanan & 2FA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
