/**
 * Fleet Intelligence Smart AI - Subscription, Quota & Billing Context Provider (Prompt 41)
 * Multi-Tenant SaaS Billing Engine, Quota Enforcement & Feature Gating
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Plan,
  PlanFeatureFlags,
  PlanFeatureKey,
  Subscription,
  SubscriptionStatus,
  BillingInterval,
  TenantUsage,
  AIUsageRecord,
  QuotaCheckResult,
  Invoice,
  PlanChangeHistory,
  Coupon,
  PaymentCheckoutRequest,
  PaymentCheckoutResponse,
  PaymentWebhookPayload,
  SubscriptionEvent,
  BillingAnalyticsData,
  IndonesianPaymentMethod,
} from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';
import { useOrganization } from './OrganizationContext';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/Toast';

interface SubscriptionContextType {
  // Current Tenant Subscription State
  subscription: Subscription | undefined;
  currentPlan: Plan | undefined;
  plans: Plan[];
  allPlansAdmin: Plan[];
  usage: TenantUsage;
  effectiveQuotas: {
    vehicleQuota: number;
    userQuota: number;
    deviceQuota: number;
    aiQuotaCredits: number;
    storageQuotaMb: number;
    apiQuotaMonthly: number;
  };
  featureFlags: PlanFeatureFlags;
  invoices: Invoice[];
  allInvoices: Invoice[];
  aiUsageHistory: AIUsageRecord[];
  events: SubscriptionEvent[];
  planHistory: PlanChangeHistory[];
  analytics: BillingAnalyticsData;

  // Computed Helpers
  isTrial: boolean;
  trialDaysRemaining: number;
  isExpiredOrSuspended: boolean;
  isExpiringSoon: boolean;
  hasQuotaWarning: boolean;
  quotaWarnings: string[];

  // Quota & Feature Guards
  checkVehicleQuota: (countToAdd?: number) => QuotaCheckResult;
  checkUserQuota: (countToAdd?: number) => QuotaCheckResult;
  checkDeviceQuota: (countToAdd?: number) => QuotaCheckResult;
  checkAIQuota: (creditsToUse?: number) => QuotaCheckResult;
  checkStorageQuota: (mbToAdd?: number) => QuotaCheckResult;
  checkAPIQuota: (requestsToAdd?: number) => QuotaCheckResult;
  canUseFeature: (feature: PlanFeatureKey) => boolean;

  // Usage Mutators
  incrementResourceUsage: (resource: 'vehicles' | 'users' | 'devices' | 'storageMb' | 'apiRequests', amount?: number) => void;
  decrementResourceUsage: (resource: 'vehicles' | 'users' | 'devices' | 'storageMb' | 'apiRequests', amount?: number) => void;
  recordAIUsage: (record: Omit<AIUsageRecord, 'id' | 'timestamp'>) => AIUsageRecord;

  // Subscription Actions
  upgradePlan: (
    targetPlanId: string,
    billingInterval: BillingInterval,
    paymentMethod?: IndonesianPaymentMethod,
    couponCode?: string
  ) => Promise<{ subscription: Subscription; invoice: Invoice }>;
  downgradePlan: (
    targetPlanId: string,
    billingInterval: BillingInterval,
    reason?: string
  ) => Promise<{ success: boolean; message: string }>;
  cancelSubscription: (immediately?: boolean, reason?: string) => Promise<Subscription>;
  reactivateSubscription: (targetPlanId: string, billingInterval: BillingInterval) => Promise<{ subscription: Subscription; invoice: Invoice }>;
  extendTrial: (additionalDays?: number) => Promise<Subscription>;
  toggleAutoRenew: (autoRenew: boolean) => Promise<Subscription>;

  // Admin Plan Management
  createPlan: (data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<Plan>;
  updatePlan: (id: string, data: Partial<Plan>) => Promise<Plan>;
  archivePlan: (id: string) => Promise<boolean>;

  // Payment Gateway Helpers
  createCheckout: (req: PaymentCheckoutRequest) => PaymentCheckoutResponse;
  simulatePaymentWebhook: (payload: PaymentWebhookPayload) => { success: boolean; message: string };
  validateCoupon: (code: string) => Coupon | null;

  // State Synchronization
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedTenantId, currentTenant } = useOrganization();
  const { user } = useAuth();
  const { addToast } = useToast();

  const activeTenantId = selectedTenantId || currentTenant?.id || 'tenant-tln-01';

  const [subscription, setSubscription] = useState<Subscription | undefined>(() =>
    subscriptionService.getSubscription(activeTenantId)
  );
  const [plans, setPlans] = useState<Plan[]>(() => subscriptionService.getPlans());
  const [allPlansAdmin, setAllPlansAdmin] = useState<Plan[]>(() => subscriptionService.getAllPlansAdmin());
  const [usage, setUsage] = useState<TenantUsage>(() => subscriptionService.getTenantUsage(activeTenantId));
  const [invoices, setInvoices] = useState<Invoice[]>(() => subscriptionService.getInvoices(activeTenantId));
  const [allInvoices, setAllInvoices] = useState<Invoice[]>(() => subscriptionService.getAllInvoices());
  const [aiUsageHistory, setAiUsageHistory] = useState<AIUsageRecord[]>(() =>
    subscriptionService.getAIUsageHistory(activeTenantId)
  );
  const [events, setEvents] = useState<SubscriptionEvent[]>(() =>
    subscriptionService.getSubscriptionEvents(activeTenantId)
  );
  const [planHistory, setPlanHistory] = useState<PlanChangeHistory[]>(() =>
    subscriptionService.getPlanHistory(activeTenantId)
  );
  const [analytics, setAnalytics] = useState<BillingAnalyticsData>(() =>
    subscriptionService.getBillingAnalytics()
  );

  const refreshSubscription = useCallback(() => {
    const sub = subscriptionService.getSubscription(activeTenantId);
    const use = subscriptionService.getTenantUsage(activeTenantId);
    setSubscription(sub);
    setPlans(subscriptionService.getPlans());
    setAllPlansAdmin(subscriptionService.getAllPlansAdmin());
    setUsage({ ...use });
    setInvoices(subscriptionService.getInvoices(activeTenantId));
    setAllInvoices(subscriptionService.getAllInvoices());
    setAiUsageHistory(subscriptionService.getAIUsageHistory(activeTenantId));
    setEvents(subscriptionService.getSubscriptionEvents(activeTenantId));
    setPlanHistory(subscriptionService.getPlanHistory(activeTenantId));
    setAnalytics(subscriptionService.getBillingAnalytics());
  }, [activeTenantId]);

  useEffect(() => {
    refreshSubscription();
  }, [activeTenantId, refreshSubscription]);

  const currentPlan = subscription ? subscriptionService.getPlanById(subscription.planId) || plans[1] : plans[1];
  const effectiveQuotas = subscriptionService.getEffectiveQuotas(activeTenantId);
  const featureFlags = subscriptionService.getFeatureEntitlements(activeTenantId);

  // Computed Helpers
  const isTrial = subscription?.status === 'TRIAL';
  const isExpiredOrSuspended =
    subscription?.status === 'EXPIRED' ||
    subscription?.status === 'SUSPENDED' ||
    subscription?.status === 'CANCELLED';

  const trialDaysRemaining = React.useMemo(() => {
    if (!subscription || !subscription.trialEndDate) return 0;
    const diff = new Date(subscription.trialEndDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [subscription]);

  const isExpiringSoon = React.useMemo(() => {
    if (!subscription) return false;
    const expiry = new Date(subscription.currentPeriodEnd).getTime();
    const diffDays = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  }, [subscription]);

  const quotaWarnings = React.useMemo(() => {
    const warns: string[] = [];
    if (effectiveQuotas.vehicleQuota !== -1 && usage.vehicles >= effectiveQuotas.vehicleQuota * 0.85) {
      warns.push(`Kendaraan: ${usage.vehicles}/${effectiveQuotas.vehicleQuota} (${Math.round((usage.vehicles / effectiveQuotas.vehicleQuota) * 100)}%)`);
    }
    if (effectiveQuotas.deviceQuota !== -1 && usage.devices >= effectiveQuotas.deviceQuota * 0.85) {
      warns.push(`GPS IoT: ${usage.devices}/${effectiveQuotas.deviceQuota} (${Math.round((usage.devices / effectiveQuotas.deviceQuota) * 100)}%)`);
    }
    if (effectiveQuotas.aiQuotaCredits !== -1 && usage.aiCredits >= effectiveQuotas.aiQuotaCredits * 0.85) {
      warns.push(`AI Credits: ${usage.aiCredits.toLocaleString('id-ID')}/${effectiveQuotas.aiQuotaCredits.toLocaleString('id-ID')} (${Math.round((usage.aiCredits / effectiveQuotas.aiQuotaCredits) * 100)}%)`);
    }
    return warns;
  }, [effectiveQuotas, usage]);

  const hasQuotaWarning = quotaWarnings.length > 0;

  // Quota & Feature Guards
  const checkVehicleQuota = useCallback(
    (countToAdd: number = 1) => subscriptionService.checkVehicleQuota(activeTenantId, countToAdd),
    [activeTenantId]
  );

  const checkUserQuota = useCallback(
    (countToAdd: number = 1) => subscriptionService.checkUserQuota(activeTenantId, countToAdd),
    [activeTenantId]
  );

  const checkDeviceQuota = useCallback(
    (countToAdd: number = 1) => subscriptionService.checkDeviceQuota(activeTenantId, countToAdd),
    [activeTenantId]
  );

  const checkAIQuota = useCallback(
    (creditsToUse: number = 1) => subscriptionService.checkAIQuota(activeTenantId, creditsToUse),
    [activeTenantId]
  );

  const checkStorageQuota = useCallback(
    (mbToAdd: number = 1) => subscriptionService.checkStorageQuota(activeTenantId, mbToAdd),
    [activeTenantId]
  );

  const checkAPIQuota = useCallback(
    (requestsToAdd: number = 1) => subscriptionService.checkAPIQuota(activeTenantId, requestsToAdd),
    [activeTenantId]
  );

  const canUseFeature = useCallback(
    (feature: PlanFeatureKey) => subscriptionService.canUseFeature(activeTenantId, feature),
    [activeTenantId]
  );

  // Usage Mutators
  const incrementResourceUsage = useCallback(
    (resource: 'vehicles' | 'users' | 'devices' | 'storageMb' | 'apiRequests', amount: number = 1) => {
      subscriptionService.incrementResourceUsage(activeTenantId, resource, amount);
      refreshSubscription();
    },
    [activeTenantId, refreshSubscription]
  );

  const decrementResourceUsage = useCallback(
    (resource: 'vehicles' | 'users' | 'devices' | 'storageMb' | 'apiRequests', amount: number = 1) => {
      subscriptionService.decrementResourceUsage(activeTenantId, resource, amount);
      refreshSubscription();
    },
    [activeTenantId, refreshSubscription]
  );

  const recordAIUsage = useCallback(
    (record: Omit<AIUsageRecord, 'id' | 'timestamp'>) => {
      const rec = subscriptionService.recordAIUsage(record);
      refreshSubscription();
      return rec;
    },
    [refreshSubscription]
  );

  // Subscription Actions
  const performedBy = {
    userId: user?.id || 'usr-super-01',
    userName: user?.name || 'Administrator',
    role: user?.role || 'Company Admin',
  };

  const upgradePlan = async (
    targetPlanId: string,
    billingInterval: BillingInterval,
    paymentMethod: IndonesianPaymentMethod = 'BCA_VA',
    couponCode?: string
  ) => {
    const res = subscriptionService.upgradePlan(activeTenantId, targetPlanId, billingInterval, performedBy, paymentMethod, couponCode);
    refreshSubscription();
    addToast({
      title: 'Upgrade Paket Berhasil',
      message: `Perusahaan Anda kini resmi berlangganan paket ${res.subscription.planName}. Seluruh fitur dan kuota telah aktif seketika.`,
      type: 'success',
    });
    return res;
  };

  const downgradePlan = async (targetPlanId: string, billingInterval: BillingInterval, reason?: string) => {
    const res = subscriptionService.downgradePlan(activeTenantId, targetPlanId, billingInterval, performedBy, reason);
    if (res.success) {
      refreshSubscription();
      addToast({
        title: 'Downgrade Terjadwal',
        message: res.message,
        type: 'info',
      });
    } else {
      addToast({
        title: 'Downgrade Dibatalkan',
        message: res.message,
        type: 'error',
      });
    }
    return res;
  };

  const cancelSubscription = async (immediately: boolean = false, reason: string = 'User requested cancellation') => {
    const res = subscriptionService.cancelSubscription(activeTenantId, immediately, reason, performedBy);
    refreshSubscription();
    addToast({
      title: 'Pembatalan Langganan',
      message: `Langganan Anda telah diatur untuk ${immediately ? 'berhenti sekarang' : 'tidak diperpanjang otomatis di akhir periode'}. Data operasional Anda tetap tersimpan dengan aman.`,
      type: 'warning',
    });
    return res;
  };

  const reactivateSubscription = async (targetPlanId: string, billingInterval: BillingInterval) => {
    const res = subscriptionService.reactivateSubscription(activeTenantId, targetPlanId, billingInterval, performedBy);
    refreshSubscription();
    addToast({
      title: 'Langganan Diaktifkan Kembali',
      message: `Selamat datang kembali! Layanan ${res.subscription.planName} aktif kembali.`,
      type: 'success',
    });
    return res;
  };

  const extendTrial = async (additionalDays: number = 7) => {
    const res = subscriptionService.extendTrial(activeTenantId, additionalDays, performedBy);
    refreshSubscription();
    addToast({
      title: 'Trial Diperpanjang',
      message: `Masa uji coba gratis (Trial) berhasil diperpanjang ${additionalDays} hari.`,
      type: 'success',
    });
    return res;
  };

  const toggleAutoRenew = async (autoRenew: boolean) => {
    const res = subscriptionService.toggleAutoRenew(activeTenantId, autoRenew);
    refreshSubscription();
    addToast({
      title: autoRenew ? 'Auto-Renewal Aktif' : 'Auto-Renewal Dinonaktifkan',
      message: autoRenew
        ? 'Tagihan langganan Anda akan diperpanjang secara otomatis setiap siklus berakhir.'
        : 'Perpanjangan otomatis telah dinonaktifkan. Anda akan menerima notifikasi sebelum masa aktif habis.',
      type: 'info',
    });
    return res;
  };

  // Admin Plan Management
  const createPlan = async (data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const plan = subscriptionService.createPlan(data, performedBy);
    refreshSubscription();
    addToast({
      title: 'Paket Berhasil Dibuat',
      message: `Paket ${plan.name} (${plan.code}) kini tersedia di katalog platform.`,
      type: 'success',
    });
    return plan;
  };

  const updatePlan = async (id: string, data: Partial<Plan>) => {
    const plan = subscriptionService.updatePlan(id, data, performedBy);
    refreshSubscription();
    addToast({
      title: 'Paket Diperbarui',
      message: `Perubahan konfigurasi paket ${plan.name} v${plan.version} telah disimpan.`,
      type: 'success',
    });
    return plan;
  };

  const archivePlan = async (id: string) => {
    try {
      const ok = subscriptionService.archivePlan(id, performedBy);
      refreshSubscription();
      addToast({
        title: 'Paket Diarsipkan',
        message: 'Paket telah dipindahkan ke arsip dan tidak ditampilkan lagi ke calon pelanggan.',
        type: 'info',
      });
      return ok;
    } catch (e: any) {
      addToast({
        title: 'Gagal Mengarsipkan',
        message: e.message || 'Paket tidak dapat diarsipkan.',
        type: 'error',
      });
      return false;
    }
  };

  // Payment Gateway Helpers
  const createCheckout = (req: PaymentCheckoutRequest) => subscriptionService.createCheckout(req);
  const simulatePaymentWebhook = (payload: PaymentWebhookPayload) => {
    const res = subscriptionService.simulatePaymentWebhook(payload);
    refreshSubscription();
    return res;
  };
  const validateCoupon = (code: string) => subscriptionService.validateCoupon(code);

  const value: SubscriptionContextType = {
    subscription,
    currentPlan,
    plans,
    allPlansAdmin,
    usage,
    effectiveQuotas,
    featureFlags,
    invoices,
    allInvoices,
    aiUsageHistory,
    events,
    planHistory,
    analytics,
    isTrial,
    trialDaysRemaining,
    isExpiredOrSuspended,
    isExpiringSoon,
    hasQuotaWarning,
    quotaWarnings,
    checkVehicleQuota,
    checkUserQuota,
    checkDeviceQuota,
    checkAIQuota,
    checkStorageQuota,
    checkAPIQuota,
    canUseFeature,
    incrementResourceUsage,
    decrementResourceUsage,
    recordAIUsage,
    upgradePlan,
    downgradePlan,
    cancelSubscription,
    reactivateSubscription,
    extendTrial,
    toggleAutoRenew,
    createPlan,
    updatePlan,
    archivePlan,
    createCheckout,
    simulatePaymentWebhook,
    validateCoupon,
    refreshSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
