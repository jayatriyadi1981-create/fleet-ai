/**
 * Fleet Intelligence Smart AI - Subscription Status Badge & Trial Progress Indicator (Prompt 41)
 * Header & Navbar Component
 */

import React from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useFleet } from '../../context/FleetContext';
import { Sparkles, AlertTriangle, Crown, Clock, ArrowUpRight } from 'lucide-react';

export const SubscriptionBadge: React.FC = () => {
  const {
    subscription,
    currentPlan,
    isTrial,
    trialDaysRemaining,
    isExpiringSoon,
    isExpiredOrSuspended,
    hasQuotaWarning,
    quotaWarnings,
  } = useSubscription();

  const { setActiveView } = useFleet();

  const handleClick = () => {
    setActiveView('subscription' as any);
  };

  if (!subscription) return null;

  // 1. Expired / Suspended Mode
  if (isExpiredOrSuspended) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-xs"
        title="Langganan Kadaluarsa / Ditangguhkan. Klik untuk mengaktifkan kembali."
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
        <span className="truncate max-w-[120px]">Langganan Berakhir</span>
        <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">Aktivasi</span>
      </button>
    );
  }

  // 2. Trial Mode
  if (isTrial) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors shadow-xs"
        title={`Masa Uji Coba Gratis (${trialDaysRemaining} hari tersisa). Klik untuk upgrade ke Pro.`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span className="font-semibold">TRIAL</span>
        <span className="text-amber-700 font-mono text-[11px]">({trialDaysRemaining} hari)</span>
        <span className="hidden sm:inline text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold hover:bg-amber-600">Upgrade</span>
      </button>
    );
  }

  // 3. Quota Warning
  if (hasQuotaWarning) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-orange-900 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors shadow-xs"
        title={`Peringatan Kuota: ${quotaWarnings.join(', ')}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
        <span className="font-semibold text-[11px] uppercase tracking-wide">{currentPlan?.name || 'PRO'}</span>
        <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">Kuota 85%+</span>
      </button>
    );
  }

  // 4. Expiring Soon (< 5 days)
  if (isExpiringSoon) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors shadow-xs"
        title="Langganan akan diperpanjang dalam waktu dekat. Klik untuk melihat detail billing."
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span className="font-semibold">{currentPlan?.name}</span>
        <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-bold">Perpanjang Segera</span>
      </button>
    );
  }

  // 5. Normal Active Plan (Professional / Enterprise)
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors shadow-xs group"
      title={`Paket Aktif: ${currentPlan?.name}. Klik untuk mengelola langganan & billing.`}
    >
      {currentPlan?.code === 'ENTERPRISE' || currentPlan?.code === 'CUSTOM' ? (
        <Crown className="w-3.5 h-3.5 text-amber-500" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
      )}
      <span className="font-semibold text-[11px] uppercase tracking-wider">{currentPlan?.name || 'PRO'}</span>
      <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
    </button>
  );
};
