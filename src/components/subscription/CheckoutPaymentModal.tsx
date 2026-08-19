/**
 * Fleet Intelligence Smart AI - Checkout & Indonesian Payment Gateway Modal (Prompt 41)
 * Simulates Midtrans/Xendit/DOKU checkout with QRIS, VA, Credit Card, and Coupons
 */

import React, { useState } from 'react';
import { Plan, BillingInterval, IndonesianPaymentMethod, Coupon } from '../../types/subscription';
import { useSubscription } from '../../context/SubscriptionContext';
import {
  X,
  CheckCircle2,
  QrCode,
  Building2,
  CreditCard,
  Sparkles,
  Tag,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface CheckoutPaymentModalProps {
  plan: Plan;
  billingInterval: BillingInterval;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYMENT_OPTIONS: Array<{
  id: IndonesianPaymentMethod;
  name: string;
  category: 'QRIS' | 'VA' | 'CARD';
  description: string;
  icon: string;
}> = [
  { id: 'QRIS', name: 'QRIS (GoPay, OVO, ShopeePay, Dana, BCA)', category: 'QRIS', description: 'Scan cepat instan dari semua aplikasi e-wallet & mobile banking', icon: '📱' },
  { id: 'BCA_VA', name: 'BCA Virtual Account', category: 'VA', description: 'Verifikasi otomatis 24/7 tanpa perlu unggah bukti transfer', icon: '🏦' },
  { id: 'MANDIRI_VA', name: 'Mandiri Virtual Account', category: 'VA', description: 'Bayar via Livin by Mandiri, ATM, atau Internet Banking', icon: '🏦' },
  { id: 'BNI_VA', name: 'BNI Virtual Account', category: 'VA', description: 'Bayar via BNI Mobile Banking atau ATM', icon: '🏦' },
  { id: 'BRI_VA', name: 'BRI Virtual Account (BRIVA)', category: 'VA', description: 'Bayar via BRImo atau ATM BRI', icon: '🏦' },
  { id: 'CREDIT_CARD', name: 'Kartu Kredit / Debit Online (Visa/Mastercard)', category: 'CARD', description: 'Perpanjangan otomatis dengan enkripsi 3D-Secure 256-bit', icon: '💳' },
];

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  plan,
  billingInterval,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { upgradePlan, validateCoupon, createCheckout, simulatePaymentWebhook } = useSubscription();

  const [selectedMethod, setSelectedMethod] = useState<IndonesianPaymentMethod>('BCA_VA');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [step, setStep] = useState<'REVIEW' | 'PAYMENT_PENDING' | 'SUCCESS'>('REVIEW');
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawBasePrice = billingInterval === 'YEARLY' ? plan.priceYearly : plan.priceMonthly;

  // Coupon calculations
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round(rawBasePrice * (appliedCoupon.discountPercent / 100));
    } else if (appliedCoupon.discountAmountIdr) {
      discountAmount = appliedCoupon.discountAmountIdr;
    }
  }

  const finalSubtotal = Math.max(0, rawBasePrice - discountAmount);
  const ppnTax = Math.round(finalSubtotal * 0.11);
  const grandTotal = finalSubtotal + ppnTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCodeInput.trim()) return;

    const coupon = validateCoupon(couponCodeInput.trim());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError(null);
    } else {
      setCouponError('Kode voucher tidak valid atau sudah kadaluarsa.');
      setAppliedCoupon(null);
    }
  };

  const handleProceedToPayment = () => {
    setIsProcessing(true);
    try {
      const checkoutRes = createCheckout({
        tenantId: 'active-tenant',
        subscriptionId: 'active-sub',
        planId: plan.id,
        billingInterval,
        paymentMethod: selectedMethod,
        couponCode: appliedCoupon?.code,
      });

      setCheckoutData(checkoutRes);
      setStep('PAYMENT_PENDING');
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    setIsProcessing(true);
    try {
      // 1. Trigger actual plan upgrade in state
      await upgradePlan(plan.id, billingInterval, selectedMethod, appliedCoupon?.code);

      // 2. Simulate payment gateway webhook
      if (checkoutData) {
        simulatePaymentWebhook({
          eventId: `evt-wh-${Date.now()}`,
          transactionId: checkoutData.transactionId,
          idempotencyKey: `idemp-${Date.now()}`,
          invoiceNumber: `INV-${Date.now()}`,
          tenantId: 'active-tenant',
          amount: grandTotal,
          currency: 'IDR',
          paymentStatus: 'PAID',
          paymentMethod: selectedMethod,
          signature: 'sig_valid_sha256_mock',
          timestamp: new Date().toISOString(),
        });
      }

      setStep('SUCCESS');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {step === 'REVIEW' && `Upgrade ke Paket ${plan.name}`}
                {step === 'PAYMENT_PENDING' && 'Instruksi Pembayaran Gateway'}
                {step === 'SUCCESS' && 'Pembayaran Berhasil!'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'REVIEW' && 'Pilih metode pembayaran dan konfirmasi rincian tagihan'}
                {step === 'PAYMENT_PENDING' && 'Selesaikan pembayaran sebelum batas waktu berakhir'}
                {step === 'SUCCESS' && 'Layanan dan kuota Anda telah diaktifkan secara instan'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Step 1: Review & Select Payment */}
        {step === 'REVIEW' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Plan Summary Card */}
            <div className="p-4 bg-cyan-50/60 border border-cyan-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">Paket Pilihan</span>
                <div className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{plan.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-cyan-200/80 text-cyan-900 rounded-full">
                    {billingInterval === 'YEARLY' ? 'Tahunan (Hemat 20%)' : 'Bulanan'}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Kuota: {plan.vehicleQuota} Unit Armada • {plan.userQuota} User • {plan.aiQuotaCredits.toLocaleString('id-ID')} AI Credits
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Biaya Paket</div>
                <div className="text-base font-bold text-slate-900">
                  Rp {rawBasePrice.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-slate-500">/ {billingInterval === 'YEARLY' ? 'tahun' : 'bulan'}</div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Pilih Metode Pembayaran (Indonesia Gateway)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAYMENT_OPTIONS.map((opt) => {
                  const isSelected = selectedMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedMethod(opt.id)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-cyan-600 bg-cyan-50/40 ring-2 ring-cyan-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xl shrink-0 mt-0.5">{opt.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-slate-900 truncate">{opt.name}</div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{opt.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voucher / Coupon Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kode Voucher Promo
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: MERDEKA50, FLEETAI20"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
                >
                  Terapkan
                </button>
              </form>
              {appliedCoupon && (
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center justify-between">
                  <span>
                    Voucher <strong>{appliedCoupon.code}</strong> aktif:{' '}
                    {appliedCoupon.discountPercent ? `Diskon ${appliedCoupon.discountPercent}%` : `Potongan Rp ${appliedCoupon.discountAmountIdr?.toLocaleString('id-ID')}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCodeInput('');
                    }}
                    className="text-xs text-emerald-800 hover:underline font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              )}
              {couponError && <p className="mt-1 text-xs text-rose-600">{couponError}</p>}
            </div>

            {/* Price Breakdown Ledger */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal Harga Paket</span>
                <span className="font-mono text-slate-900">Rp {rawBasePrice.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Promo ({appliedCoupon?.code})</span>
                  <span className="font-mono">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>PPN 11% (Pajak Pertambahan Nilai)</span>
                <span className="font-mono text-slate-900">Rp {ppnTax.toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Tagihan Resmi</span>
                <span className="font-mono text-cyan-700 text-base">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Transaksi aman terenkripsi SSL 256-bit dan diawasi oleh Bank Indonesia / OJK via Payment Gateway Partner.</span>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Lanjutkan Pembayaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content Step 2: Payment Pending Instructions */}
        {step === 'PAYMENT_PENDING' && checkoutData && (
          <div className="p-6 space-y-6 text-center max-h-[75vh] overflow-y-auto">
            {/* Method Specific Display */}
            {selectedMethod === 'QRIS' ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-xs mx-auto text-center space-y-3">
                <div className="text-xs font-bold text-slate-600 uppercase">Scan QRIS Nasional</div>
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 inline-block">
                  <QrCode className="w-48 h-48 mx-auto text-slate-800" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Buka aplikasi GoPay, OVO, BCA Mobile, Livin, atau Dana Anda dan scan QR di atas.
                </p>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-600" />
                    <span className="text-xs font-bold text-slate-900">{checkoutData.paymentMethod.replace('_', ' ')}</span>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Menunggu Pembayaran
                  </span>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Nomor Virtual Account</div>
                  <div className="flex items-center justify-between mt-1 p-2.5 bg-white border border-slate-200 rounded-xl">
                    <span className="font-mono text-base font-bold text-slate-900 tracking-wider">
                      {checkoutData.vaNumber || '80777081290348'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(checkoutData.vaNumber || '80777081290348')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Total Nominal Transfer Tepat</div>
                  <div className="font-mono text-xl font-bold text-cyan-700 mt-0.5">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions box */}
            <div className="text-xs text-slate-600 bg-cyan-50/50 p-4 rounded-xl border border-cyan-100 text-left space-y-1.5">
              <div className="font-bold text-cyan-900">Petunjuk Pembayaran Cepat:</div>
              <p>1. Lakukan pembayaran sejumlah nominal di atas sebelum masa berlaku berakhir.</p>
              <p>2. Sistem secara otomatis mendeteksi transaksi Anda melalui Webhook Gateway tanpa perlu konfirmasi manual.</p>
              <p>3. Setelah transfer berhasil, Anda dapat mengklik tombol "Simulasikan Pembayaran Berhasil" di bawah untuk menguji integrasi.</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('REVIEW')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Ganti Metode
              </button>
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Simulasikan Pembayaran Berhasil (Webhook Real-Time)</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Step 3: Success Confirmation */}
        {step === 'SUCCESS' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900">Pembayaran Berhasil Diverifikasi!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                Terima kasih. Perusahaan Anda telah resmi diupgrade ke paket <strong>{plan.name}</strong>. Faktur tagihan resmi (Invoice) telah diterbitkan dan dikirimkan ke email billing perusahaan.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Paket Aktif</span>
                <span className="font-bold text-slate-900">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Siklus Tagihan</span>
                <span className="font-medium text-slate-900">{billingInterval === 'YEARLY' ? '1 Tahun' : '1 Bulan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Langganan</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  ACTIVE
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="px-8 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Mulai Gunakan Fitur Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
