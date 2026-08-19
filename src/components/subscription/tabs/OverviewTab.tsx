/**
 * Fleet Intelligence Smart AI - Subscription Overview Tab (Prompt 41)
 * Active Plan status, trial countdown, quick quota summary, renewal management
 */

import React, { useState } from 'react';
import { useSubscription } from '../../../context/SubscriptionContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Sparkles,
  Crown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  CreditCard,
  FileText,
  ShieldCheck,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';

interface OverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onOpenUpgradeModal: (planId?: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab, onOpenUpgradeModal }) => {
  const {
    subscription,
    currentPlan,
    usage,
    effectiveQuotas,
    isTrial,
    trialDaysRemaining,
    isExpiringSoon,
    isExpiredOrSuspended,
    toggleAutoRenew,
    cancelSubscription,
    extendTrial,
  } = useSubscription();

  const { user } = useAuth();
  const [isToggling, setIsToggling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!subscription || !currentPlan) return null;

  const vehiclePct = effectiveQuotas.vehicleQuota === -1 ? 0 : Math.round((usage.vehicles / effectiveQuotas.vehicleQuota) * 100);
  const devicePct = effectiveQuotas.deviceQuota === -1 ? 0 : Math.round((usage.devices / effectiveQuotas.deviceQuota) * 100);
  const userPct = effectiveQuotas.userQuota === -1 ? 0 : Math.round((usage.users / effectiveQuotas.userQuota) * 100);
  const aiPct = effectiveQuotas.aiQuotaCredits === -1 ? 0 : Math.round((usage.aiCredits / effectiveQuotas.aiQuotaCredits) * 100);

  const handleToggleAutoRenew = async () => {
    setIsToggling(true);
    try {
      await toggleAutoRenew(!subscription.autoRenew);
    } finally {
      setIsToggling(false);
    }
  };

  const handleConfirmCancel = async () => {
    await cancelSubscription(false, cancelReason || 'Alasan efisiensi biaya');
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Status Alert Banners */}
      {isExpiredOrSuspended && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">Langganan Anda Telah Berakhir</h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Akses tulis (tambah kendaraan, user, device, AI assistant) dinonaktifkan sementara. Data telematika dan armada Anda tetap tersimpan dengan aman tanpa ada yang terhapus.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenUpgradeModal(currentPlan.id)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
          >
            Aktifkan Kembali
          </button>
        </div>
      )}

      {isTrial && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-amber-950">Masa Uji Coba Gratis (Trial)</h4>
                <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 font-bold text-[10px] rounded-full">
                  {trialDaysRemaining} Hari Tersisa
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Anda sedang menikmati paket {currentPlan.name} lengkap. Upgrade sekarang untuk mendapatkan diskon khusus 20% tahunan dan jaminan kelancaran operasional.
              </p>
              {user?.role === 'super_admin' && (
                <button
                  onClick={() => extendTrial(7)}
                  className="mt-2 text-[11px] font-semibold text-amber-900 underline hover:text-amber-950"
                >
                  + Perpanjang Trial 7 Hari (Super Admin Tool)
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('comparison')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
          >
            Pilih Paket Berlangganan
          </button>
        </div>
      )}

      {/* 2. Main Active Plan Hero Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              {currentPlan.code === 'ENTERPRISE' || currentPlan.code === 'CUSTOM' ? (
                <Crown className="w-7 h-7" />
              ) : (
                <Sparkles className="w-7 h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paket Aktif Perusahaan</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    subscription.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : subscription.status === 'TRIAL'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {subscription.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{currentPlan.name}</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md">{currentPlan.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('comparison')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <span>Ubah / Upgrade Paket</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <CreditCard className="w-4 h-4 text-cyan-600" />
              <span>Biaya Berlangganan</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              Rp {(subscription.billingInterval === 'YEARLY' ? currentPlan.priceYearly : currentPlan.priceMonthly).toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              per {subscription.billingInterval === 'YEARLY' ? 'Tahun (Hemat 20%)' : 'Bulan'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Siklus Tagihan Berikutnya</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {new Date(subscription.nextBillingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Auto-Renew: <strong className={subscription.autoRenew ? 'text-emerald-600' : 'text-slate-500'}>{subscription.autoRenew ? 'Aktif' : 'Non-Aktif'}</strong>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Grace Period Policy</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {subscription.gracePeriodDays} Hari Pasca Jatuh Tempo
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Data operasional dijamin aman</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <RefreshCw className="w-4 h-4 text-cyan-600" />
              <span>Pengaturan Otomatis</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-slate-700">Perpanjang Otomatis</span>
              <button
                onClick={handleToggleAutoRenew}
                disabled={isToggling}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  subscription.autoRenew ? 'bg-cyan-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    subscription.autoRenew ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Realtime Quota Meter Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-600" />
            <span>Penggunaan Kuota Real-Time</span>
          </h3>
          <button
            onClick={() => onNavigateTab('quotas')}
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
          >
            Lihat Analisa Lengkap →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vehicles Meter */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-medium">Armada Kendaraan</span>
              <span className={`font-bold ${vehiclePct >= 90 ? 'text-rose-600' : 'text-slate-700'}`}>{vehiclePct}%</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {usage.vehicles}{' '}
              <span className="text-xs font-normal text-slate-500">/ {effectiveQuotas.vehicleQuota === -1 ? '∞' : effectiveQuotas.vehicleQuota} unit</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all ${vehiclePct >= 90 ? 'bg-rose-500' : vehiclePct >= 70 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                style={{ width: `${Math.min(100, vehiclePct)}%` }}
              />
            </div>
          </div>

          {/* GPS Devices Meter */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-medium">GPS Telematics IoT</span>
              <span className={`font-bold ${devicePct >= 90 ? 'text-rose-600' : 'text-slate-700'}`}>{devicePct}%</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {usage.devices}{' '}
              <span className="text-xs font-normal text-slate-500">/ {effectiveQuotas.deviceQuota === -1 ? '∞' : effectiveQuotas.deviceQuota} device</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all ${devicePct >= 90 ? 'bg-rose-500' : devicePct >= 70 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                style={{ width: `${Math.min(100, devicePct)}%` }}
              />
            </div>
          </div>

          {/* Staff Users Meter */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-medium">Staf & Pengguna</span>
              <span className={`font-bold ${userPct >= 90 ? 'text-rose-600' : 'text-slate-700'}`}>{userPct}%</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {usage.users}{' '}
              <span className="text-xs font-normal text-slate-500">/ {effectiveQuotas.userQuota === -1 ? '∞' : effectiveQuotas.userQuota} user</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all ${userPct >= 90 ? 'bg-rose-500' : userPct >= 70 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                style={{ width: `${Math.min(100, userPct)}%` }}
              />
            </div>
          </div>

          {/* AI Credits Meter */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-medium">AI Credits Bulanan</span>
              <span className={`font-bold ${aiPct >= 90 ? 'text-rose-600' : 'text-slate-700'}`}>{aiPct}%</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {usage.aiCredits.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-normal text-slate-500">/ {effectiveQuotas.aiQuotaCredits === -1 ? '∞' : effectiveQuotas.aiQuotaCredits.toLocaleString('id-ID')}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all ${aiPct >= 90 ? 'bg-rose-500' : aiPct >= 70 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                style={{ width: `${Math.min(100, aiPct)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions & Retention Assurance */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Perlu Faktur Pajak Resmi atau NPWP Perusahaan?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Anda dapat mengunduh faktur tagihan PPN 11% dan bukti potong pajak di tab Riwayat Invoice.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('invoices')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Lihat Invoice
          </button>
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          >
            Batalkan Langganan
          </button>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Batalkan Paket Berlangganan?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Langganan Anda akan tetap aktif hingga akhir periode (<strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString('id-ID')}</strong>). Setelah periode berakhir, layanan beralih ke mode read-only. Seluruh data historis perjalanan dan armada <strong>tetap tersimpan dengan aman</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Beritahu kami alasan pembatalan (opsional):</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Misal: Armada sedang tidak beroperasi, kendala anggaran..."
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Tetap Berlangganan
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Konfirmasi Pembatalan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
