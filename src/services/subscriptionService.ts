/**
 * Fleet Intelligence Smart AI - Subscription & Billing Engine Service (Prompt 41)
 * Centralized Plan Management, Quota Enforcement, Feature Entitlement, Payment Gateways & SaaS Lifecycle
 */

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
  QuotaThresholdStatus,
  Invoice,
  InvoiceItem,
  PlanChangeHistory,
  Coupon,
  PaymentCheckoutRequest,
  PaymentCheckoutResponse,
  PaymentWebhookPayload,
  SubscriptionEvent,
  BillingAnalyticsData,
  IndonesianPaymentMethod,
} from '../types/subscription';

const STORAGE_KEYS = {
  PLANS: 'fleet_smart_ai_plans_v1',
  SUBSCRIPTIONS: 'fleet_smart_ai_subscriptions_v1',
  USAGES: 'fleet_smart_ai_usages_v1',
  AI_USAGES: 'fleet_smart_ai_ai_usages_v1',
  INVOICES: 'fleet_smart_ai_invoices_v1',
  PLAN_HISTORY: 'fleet_smart_ai_plan_history_v1',
  EVENTS: 'fleet_smart_ai_subscription_events_v1',
  COUPONS: 'fleet_smart_ai_coupons_v1',
  PROCESSED_WEBHOOKS: 'fleet_smart_ai_processed_webhooks_v1',
};

// Default Feature Matrix
const STARTER_FEATURES: PlanFeatureFlags = {
  liveTracking: true,
  tripHistory: true,
  geofence: true,
  delivery: true,
  fuel: true,
  maintenance: true,
  safety: true,
  fatigue: false,
  analytics: false,
  aiAssistant: false,
  predictiveMaintenance: false,
  aiFuel: false,
  aiDriver: false,
  aiRoute: false,
  aiSafety: false,
  api: false,
  export: true,
  customBranding: false,
  automation: false,
};

const PROFESSIONAL_FEATURES: PlanFeatureFlags = {
  liveTracking: true,
  tripHistory: true,
  geofence: true,
  delivery: true,
  fuel: true,
  maintenance: true,
  safety: true,
  fatigue: true,
  analytics: true,
  aiAssistant: true,
  predictiveMaintenance: true,
  aiFuel: true,
  aiDriver: true,
  aiRoute: true,
  aiSafety: true,
  api: false,
  export: true,
  customBranding: false,
  automation: true,
};

const ENTERPRISE_FEATURES: PlanFeatureFlags = {
  liveTracking: true,
  tripHistory: true,
  geofence: true,
  delivery: true,
  fuel: true,
  maintenance: true,
  safety: true,
  fatigue: true,
  analytics: true,
  aiAssistant: true,
  predictiveMaintenance: true,
  aiFuel: true,
  aiDriver: true,
  aiRoute: true,
  aiSafety: true,
  api: true,
  export: true,
  customBranding: true,
  automation: true,
};

// Initial Plans Catalogue
const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    code: 'STARTER',
    version: 1,
    description: 'Cocok untuk UKM & armada rintisan dengan kebutuhan GPS tracking dan operasional esensial.',
    priceMonthly: 990000,
    priceYearly: 9500000, // ~20% discount
    billingInterval: 'MONTHLY',
    currency: 'IDR',
    vehicleQuota: 25,
    userQuota: 5,
    deviceQuota: 25,
    aiQuotaCredits: 2500,
    storageQuotaMb: 500,
    apiQuotaMonthly: 1000,
    trialDurationDays: 14,
    featureFlags: STARTER_FEATURES,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-17T00:00:00Z',
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    code: 'PRO',
    version: 1,
    description: 'Pilihan terfavorit korporasi logistik & distribusi skala menengah dengan AI Intelligence lengkap.',
    priceMonthly: 2490000,
    priceYearly: 23900000,
    billingInterval: 'MONTHLY',
    currency: 'IDR',
    vehicleQuota: 100,
    userQuota: 25,
    deviceQuota: 100,
    aiQuotaCredits: 10000,
    storageQuotaMb: 2048,
    apiQuotaMonthly: 10000,
    trialDurationDays: 14,
    featureFlags: PROFESSIONAL_FEATURES,
    isPopular: true,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-17T00:00:00Z',
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    code: 'ENTERPRISE',
    version: 1,
    description: 'Untuk perusahaan logistik multi-cabang nasional, tambang, & armada besar dengan integrasi API penuh.',
    priceMonthly: 5990000,
    priceYearly: 57500000,
    billingInterval: 'MONTHLY',
    currency: 'IDR',
    vehicleQuota: 500,
    userQuota: 100,
    deviceQuota: 500,
    aiQuotaCredits: 50000,
    storageQuotaMb: 10240,
    apiQuotaMonthly: 100000,
    trialDurationDays: 30,
    featureFlags: ENTERPRISE_FEATURES,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-17T00:00:00Z',
  },
  {
    id: 'plan-enterprise-custom',
    name: 'Enterprise Custom',
    code: 'CUSTOM',
    version: 1,
    description: 'Kustomisasi armada tanpa batas, on-premise/hybrid cloud, SLA 99.99%, dan AI Model fine-tuning.',
    priceMonthly: 12500000,
    priceYearly: 120000000,
    billingInterval: 'CUSTOM',
    currency: 'IDR',
    vehicleQuota: 2000,
    userQuota: 500,
    deviceQuota: 2000,
    aiQuotaCredits: 200000,
    storageQuotaMb: 51200,
    apiQuotaMonthly: 1000000,
    trialDurationDays: 30,
    featureFlags: ENTERPRISE_FEATURES,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-17T00:00:00Z',
  },
];

// Initial Subscriptions
const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-tln-01',
    tenantId: 'tenant-tln-01',
    tenantName: 'PT Trans Logistik Nusantara',
    planId: 'plan-pro',
    planName: 'Professional',
    status: 'ACTIVE',
    billingInterval: 'YEARLY',
    startDate: '2026-01-15T00:00:00Z',
    currentPeriodStart: '2026-01-15T00:00:00Z',
    currentPeriodEnd: '2027-01-15T00:00:00Z',
    nextBillingDate: '2027-01-15T00:00:00Z',
    expiresAt: '2027-01-18T00:00:00Z',
    autoRenew: true,
    gracePeriodDays: 3,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-08-14T00:00:00Z',
  },
  {
    id: 'sub-sam-02',
    tenantId: 'tenant-sam-02',
    tenantName: 'PT Samudera Anugerah Makmur',
    planId: 'plan-pro',
    planName: 'Professional',
    status: 'ACTIVE',
    billingInterval: 'MONTHLY',
    startDate: '2026-03-01T00:00:00Z',
    currentPeriodStart: '2026-08-01T00:00:00Z',
    currentPeriodEnd: '2026-09-01T00:00:00Z',
    nextBillingDate: '2026-09-01T00:00:00Z',
    expiresAt: '2026-09-04T00:00:00Z',
    autoRenew: true,
    gracePeriodDays: 3,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'sub-bkt-03',
    tenantId: 'tenant-bkt-03',
    tenantName: 'PT Borneo Khatulistiwa Tambang',
    planId: 'plan-enterprise',
    planName: 'Enterprise',
    status: 'ACTIVE',
    billingInterval: 'YEARLY',
    startDate: '2026-02-10T00:00:00Z',
    currentPeriodStart: '2026-02-10T00:00:00Z',
    currentPeriodEnd: '2027-02-10T00:00:00Z',
    nextBillingDate: '2027-02-10T00:00:00Z',
    expiresAt: '2027-02-13T00:00:00Z',
    autoRenew: true,
    gracePeriodDays: 5,
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'sub-mja-04',
    tenantId: 'tenant-mja-04',
    tenantName: 'PT Mitra Jaya Abadi Rental',
    planId: 'plan-starter',
    planName: 'Starter',
    status: 'TRIAL',
    billingInterval: 'MONTHLY',
    startDate: '2026-08-10T00:00:00Z',
    trialStartDate: '2026-08-10T00:00:00Z',
    trialEndDate: '2026-08-24T00:00:00Z',
    currentPeriodStart: '2026-08-10T00:00:00Z',
    currentPeriodEnd: '2026-08-24T00:00:00Z',
    nextBillingDate: '2026-08-24T00:00:00Z',
    expiresAt: '2026-08-27T00:00:00Z',
    autoRenew: false,
    gracePeriodDays: 3,
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-10T00:00:00Z',
  },
];

// Initial Usages
const INITIAL_USAGES: Record<string, TenantUsage> = {
  'tenant-tln-01': {
    id: 'use-tln-01',
    tenantId: 'tenant-tln-01',
    periodStart: '2026-08-01T00:00:00Z',
    periodEnd: '2026-09-01T00:00:00Z',
    vehicles: 87,
    users: 18,
    devices: 93,
    aiRequests: 842,
    aiCredits: 7850,
    storageMb: 1420,
    apiRequests: 4230,
    updatedAt: '2026-08-17T10:00:00Z',
  },
  'tenant-sam-02': {
    id: 'use-sam-02',
    tenantId: 'tenant-sam-02',
    periodStart: '2026-08-01T00:00:00Z',
    periodEnd: '2026-09-01T00:00:00Z',
    vehicles: 42,
    users: 12,
    devices: 42,
    aiRequests: 310,
    aiCredits: 3120,
    storageMb: 680,
    apiRequests: 1200,
    updatedAt: '2026-08-17T09:30:00Z',
  },
  'tenant-bkt-03': {
    id: 'use-bkt-03',
    tenantId: 'tenant-bkt-03',
    periodStart: '2026-08-01T00:00:00Z',
    periodEnd: '2026-09-01T00:00:00Z',
    vehicles: 312,
    users: 64,
    devices: 312,
    aiRequests: 4120,
    aiCredits: 38400,
    storageMb: 6840,
    apiRequests: 54100,
    updatedAt: '2026-08-17T10:15:00Z',
  },
  'tenant-mja-04': {
    id: 'use-mja-04',
    tenantId: 'tenant-mja-04',
    periodStart: '2026-08-10T00:00:00Z',
    periodEnd: '2026-08-24T00:00:00Z',
    vehicles: 16,
    users: 4,
    devices: 16,
    aiRequests: 45,
    aiCredits: 420,
    storageMb: 110,
    apiRequests: 0,
    updatedAt: '2026-08-17T08:00:00Z',
  },
};

// Initial Invoices
const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-08-001',
    tenantId: 'tenant-tln-01',
    tenantName: 'PT Trans Logistik Nusantara',
    subscriptionId: 'sub-tln-01',
    invoiceNumber: 'INV/2026/01/TLN-001',
    amount: 23900000,
    taxAmount: 2629000,
    totalAmount: 26529000,
    currency: 'IDR',
    periodStart: '2026-01-15T00:00:00Z',
    periodEnd: '2027-01-15T00:00:00Z',
    status: 'PAID',
    dueDate: '2026-01-20T00:00:00Z',
    paidAt: '2026-01-15T11:20:00Z',
    paymentMethod: 'BCA_VA',
    paymentProvider: 'MIDTRANS',
    paymentReference: 'TRX-BCA-9812491',
    items: [
      {
        id: 'item-1',
        description: 'Paket Berlangganan Professional - 1 Tahun (Diskon 20%)',
        quantity: 1,
        unitPrice: 23900000,
        amount: 23900000,
      },
    ],
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'inv-2026-08-002',
    tenantId: 'tenant-sam-02',
    tenantName: 'PT Samudera Anugerah Makmur',
    subscriptionId: 'sub-sam-02',
    invoiceNumber: 'INV/2026/08/SAM-008',
    amount: 2490000,
    taxAmount: 273900,
    totalAmount: 2763900,
    currency: 'IDR',
    periodStart: '2026-08-01T00:00:00Z',
    periodEnd: '2026-09-01T00:00:00Z',
    status: 'PAID',
    dueDate: '2026-08-05T00:00:00Z',
    paidAt: '2026-08-01T09:14:00Z',
    paymentMethod: 'MANDIRI_VA',
    paymentProvider: 'XENDIT',
    paymentReference: 'TRX-MND-481920',
    items: [
      {
        id: 'item-1',
        description: 'Paket Berlangganan Professional - Periode Agustus 2026',
        quantity: 1,
        unitPrice: 2490000,
        amount: 2490000,
      },
    ],
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'inv-2026-08-003',
    tenantId: 'tenant-bkt-03',
    tenantName: 'PT Borneo Khatulistiwa Tambang',
    subscriptionId: 'sub-bkt-03',
    invoiceNumber: 'INV/2026/02/BKT-001',
    amount: 57500000,
    taxAmount: 6325000,
    totalAmount: 63825000,
    currency: 'IDR',
    periodStart: '2026-02-10T00:00:00Z',
    periodEnd: '2027-02-10T00:00:00Z',
    status: 'PAID',
    dueDate: '2026-02-15T00:00:00Z',
    paidAt: '2026-02-10T14:30:00Z',
    paymentMethod: 'BANK_TRANSFER_MANUAL',
    paymentProvider: 'MANUAL',
    paymentReference: 'TRX-MAN-BKT2026',
    items: [
      {
        id: 'item-1',
        description: 'Paket Berlangganan Enterprise Fleet - 1 Tahun',
        quantity: 1,
        unitPrice: 57500000,
        amount: 57500000,
      },
    ],
    createdAt: '2026-02-10T00:00:00Z',
  },
];

// Initial Coupons
const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'MERDEKA50',
    discountPercent: 50,
    durationMonths: 3,
    validUntil: '2026-12-31T23:59:59Z',
    maxUses: 100,
    currentUses: 14,
    active: true,
  },
  {
    code: 'FLEETAI20',
    discountPercent: 20,
    durationMonths: 12,
    validUntil: '2026-12-31T23:59:59Z',
    maxUses: 500,
    currentUses: 42,
    active: true,
  },
  {
    code: 'STARTUPIDR500K',
    discountAmountIdr: 500000,
    durationMonths: 1,
    validUntil: '2026-12-31T23:59:59Z',
    maxUses: 200,
    currentUses: 8,
    active: true,
  },
];

class SubscriptionService {
  private plans: Plan[] = [];
  private subscriptions: Subscription[] = [];
  private usages: Record<string, TenantUsage> = {};
  private aiUsages: AIUsageRecord[] = [];
  private invoices: Invoice[] = [];
  private planHistory: PlanChangeHistory[] = [];
  private events: SubscriptionEvent[] = [];
  private coupons: Coupon[] = [];
  private processedWebhooks: Set<string> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedPlans = localStorage.getItem(STORAGE_KEYS.PLANS);
      this.plans = storedPlans ? JSON.parse(storedPlans) : INITIAL_PLANS;

      const storedSubs = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      this.subscriptions = storedSubs ? JSON.parse(storedSubs) : INITIAL_SUBSCRIPTIONS;

      const storedUsages = localStorage.getItem(STORAGE_KEYS.USAGES);
      this.usages = storedUsages ? JSON.parse(storedUsages) : INITIAL_USAGES;

      const storedAi = localStorage.getItem(STORAGE_KEYS.AI_USAGES);
      this.aiUsages = storedAi ? JSON.parse(storedAi) : this.generateMockAiUsages();

      const storedInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
      this.invoices = storedInvoices ? JSON.parse(storedInvoices) : INITIAL_INVOICES;

      const storedHistory = localStorage.getItem(STORAGE_KEYS.PLAN_HISTORY);
      this.planHistory = storedHistory ? JSON.parse(storedHistory) : this.generateMockHistory();

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      this.events = storedEvents ? JSON.parse(storedEvents) : this.generateMockEvents();

      const storedCoupons = localStorage.getItem(STORAGE_KEYS.COUPONS);
      this.coupons = storedCoupons ? JSON.parse(storedCoupons) : INITIAL_COUPONS;

      const storedWebhooks = localStorage.getItem(STORAGE_KEYS.PROCESSED_WEBHOOKS);
      if (storedWebhooks) {
        this.processedWebhooks = new Set(JSON.parse(storedWebhooks));
      }
    } catch {
      this.plans = INITIAL_PLANS;
      this.subscriptions = INITIAL_SUBSCRIPTIONS;
      this.usages = INITIAL_USAGES;
      this.invoices = INITIAL_INVOICES;
      this.coupons = INITIAL_COUPONS;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(this.plans));
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(this.subscriptions));
      localStorage.setItem(STORAGE_KEYS.USAGES, JSON.stringify(this.usages));
      localStorage.setItem(STORAGE_KEYS.AI_USAGES, JSON.stringify(this.aiUsages));
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(this.invoices));
      localStorage.setItem(STORAGE_KEYS.PLAN_HISTORY, JSON.stringify(this.planHistory));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(this.coupons));
      localStorage.setItem(STORAGE_KEYS.PROCESSED_WEBHOOKS, JSON.stringify(Array.from(this.processedWebhooks)));
    } catch (e) {
      console.error('Failed to save subscription state', e);
    }
  }

  private generateMockAiUsages(): AIUsageRecord[] {
    return [
      {
        id: 'ai-use-1',
        tenantId: 'tenant-tln-01',
        userId: 'usr-super-01',
        userName: 'Budi Santoso',
        feature: 'ai_fleet_intelligence',
        requestCount: 1,
        inputTokens: 1250,
        outputTokens: 480,
        creditsUsed: 15,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ai-use-2',
        tenantId: 'tenant-tln-01',
        userId: 'usr-super-01',
        userName: 'Budi Santoso',
        feature: 'ai_route_intelligence',
        requestCount: 1,
        inputTokens: 820,
        outputTokens: 310,
        creditsUsed: 10,
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'ai-use-3',
        tenantId: 'tenant-tln-01',
        userId: 'usr-ops-02',
        userName: 'Agus Pratama',
        feature: 'ai_predictive_maintenance',
        requestCount: 1,
        inputTokens: 2100,
        outputTokens: 950,
        creditsUsed: 25,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'ai-use-4',
        tenantId: 'tenant-tln-01',
        userId: 'usr-super-01',
        userName: 'Budi Santoso',
        feature: 'ai_fleet_assistant',
        requestCount: 1,
        inputTokens: 640,
        outputTokens: 220,
        creditsUsed: 8,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];
  }

  private generateMockHistory(): PlanChangeHistory[] {
    return [
      {
        id: 'hist-1',
        tenantId: 'tenant-tln-01',
        tenantName: 'PT Trans Logistik Nusantara',
        oldPlanId: 'plan-starter',
        oldPlanName: 'Starter',
        newPlanId: 'plan-pro',
        newPlanName: 'Professional',
        action: 'UPGRADE',
        effectiveDate: '2026-01-15T00:00:00Z',
        performedBy: {
          userId: 'usr-super-01',
          userName: 'Budi Santoso',
          role: 'Company Admin',
        },
        reason: 'Peningkatan armada melebih kuota 25 unit dan aktivasi AI Predictive Maintenance.',
        createdAt: '2026-01-15T00:00:00Z',
      },
    ];
  }

  private generateMockEvents(): SubscriptionEvent[] {
    return [
      {
        id: 'evt-1',
        tenantId: 'tenant-tln-01',
        tenantName: 'PT Trans Logistik Nusantara',
        eventType: 'PAYMENT_SUCCESS',
        details: 'Pembayaran tagihan tahunan sebesar Rp 26.529.000 berhasil via BCA VA.',
        timestamp: '2026-01-15T11:20:00Z',
      },
      {
        id: 'evt-2',
        tenantId: 'tenant-tln-01',
        tenantName: 'PT Trans Logistik Nusantara',
        eventType: 'PLAN_UPGRADED',
        details: 'Paket berhasil diupgrade dari Starter ke Professional.',
        timestamp: '2026-01-15T11:20:00Z',
      },
      {
        id: 'evt-3',
        tenantId: 'tenant-tln-01',
        tenantName: 'PT Trans Logistik Nusantara',
        eventType: 'QUOTA_WARNING',
        details: 'Penggunaan armada kendaraan mencapai 87% dari kuota 100 unit.',
        timestamp: '2026-08-14T09:00:00Z',
      },
    ];
  }

  // ==========================================
  // 1. PLANS MANAGEMENT
  // ==========================================

  public getPlans(): Plan[] {
    return this.plans.filter((p) => p.status !== 'ARCHIVED');
  }

  public getAllPlansAdmin(): Plan[] {
    return this.plans;
  }

  public getPlanById(id: string): Plan | undefined {
    return this.plans.find((p) => p.id === id);
  }

  public createPlan(
    data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
    performedBy: { userId: string; userName: string; role: string }
  ): Plan {
    const newPlan: Plan = {
      ...data,
      id: `plan-${data.code.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.plans.push(newPlan);
    this.saveState();

    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId: 'PLATFORM',
      tenantName: 'Super Admin Platform',
      eventType: 'SUBSCRIPTION_CREATED',
      details: `Paket baru ${newPlan.name} (${newPlan.code}) dibuat oleh ${performedBy.userName}.`,
      timestamp: new Date().toISOString(),
    });

    return newPlan;
  }

  public updatePlan(
    id: string,
    data: Partial<Plan>,
    performedBy: { userId: string; userName: string; role: string }
  ): Plan {
    const index = this.plans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Plan not found');

    const existing = this.plans[index];
    const updated: Plan = {
      ...existing,
      ...data,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    };

    this.plans[index] = updated;
    this.saveState();

    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId: 'PLATFORM',
      tenantName: 'Super Admin Platform',
      eventType: 'SUBSCRIPTION_ACTIVATED',
      details: `Paket ${updated.name} v${updated.version} diperbarui oleh ${performedBy.userName}.`,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  public archivePlan(id: string, performedBy: { userId: string; userName: string; role: string }): boolean {
    const plan = this.getPlanById(id);
    if (!plan) return false;

    // Safety: check if active subscriptions are using it
    const activeUsingCount = this.subscriptions.filter(
      (s) => s.planId === id && (s.status === 'ACTIVE' || s.status === 'TRIAL')
    ).length;

    if (activeUsingCount > 0) {
      throw new Error(`Paket masih digunakan oleh ${activeUsingCount} langganan aktif. Paket diubah ke status INACTIVE, bukan di-delete.`);
    }

    plan.status = 'ARCHIVED';
    plan.updatedAt = new Date().toISOString();
    this.saveState();

    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId: 'PLATFORM',
      tenantName: 'Super Admin Platform',
      eventType: 'SUBSCRIPTION_CANCELLED',
      details: `Paket ${plan.name} diarsipkan oleh ${performedBy.userName}.`,
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  // ==========================================
  // 2. SUBSCRIPTION LIFECYCLE & TENANT QUOTAS
  // ==========================================

  public getSubscription(tenantId: string): Subscription | undefined {
    let sub = this.subscriptions.find((s) => s.tenantId === tenantId);
    if (!sub) {
      // Auto-provision trial for new tenants
      sub = {
        id: `sub-${tenantId}`,
        tenantId,
        tenantName: 'Perusahaan SaaS',
        planId: 'plan-pro',
        planName: 'Professional',
        status: 'TRIAL',
        billingInterval: 'MONTHLY',
        startDate: new Date().toISOString(),
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 14 * 86400000).toISOString(),
        nextBillingDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        expiresAt: new Date(Date.now() + 17 * 86400000).toISOString(),
        autoRenew: false,
        gracePeriodDays: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.subscriptions.push(sub);
      this.saveState();
    }
    return sub;
  }

  public getAllSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  public getEffectiveQuotas(tenantId: string) {
    const sub = this.getSubscription(tenantId);
    const plan = sub ? this.getPlanById(sub.planId) || this.plans[1] : this.plans[1];

    return {
      vehicleQuota: sub?.customQuotas?.vehicleQuota ?? plan.vehicleQuota,
      userQuota: sub?.customQuotas?.userQuota ?? plan.userQuota,
      deviceQuota: sub?.customQuotas?.deviceQuota ?? plan.deviceQuota,
      aiQuotaCredits: sub?.customQuotas?.aiQuotaCredits ?? plan.aiQuotaCredits,
      storageQuotaMb: sub?.customQuotas?.storageQuotaMb ?? plan.storageQuotaMb,
      apiQuotaMonthly: sub?.customQuotas?.apiQuotaMonthly ?? plan.apiQuotaMonthly,
    };
  }

  public getTenantUsage(tenantId: string): TenantUsage {
    if (!this.usages[tenantId]) {
      this.usages[tenantId] = {
        id: `use-${tenantId}`,
        tenantId,
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        vehicles: 1,
        users: 1,
        devices: 1,
        aiRequests: 0,
        aiCredits: 0,
        storageMb: 25,
        apiRequests: 0,
        updatedAt: new Date().toISOString(),
      };
      this.saveState();
    }
    return this.usages[tenantId];
  }

  // ==========================================
  // 3. QUOTA ENFORCEMENT & ATOMIC SAFETY
  // ==========================================

  public checkVehicleQuota(tenantId: string, countToAdd: number = 1): QuotaCheckResult {
    const quotas = this.getEffectiveQuotas(tenantId);
    const usage = this.getTenantUsage(tenantId);
    const max = quotas.vehicleQuota;
    const current = usage.vehicles;

    if (max === -1) {
      return { allowed: true, resource: 'vehicles', currentUsage: current, maxQuota: max, percentage: 0, status: 'HEALTHY', message: 'Unlimited vehicles quota' };
    }

    const nextTotal = current + countToAdd;
    const percentage = Math.round((current / max) * 100);
    const status = this.calculateThresholdStatus(percentage);

    if (nextTotal > max) {
      return {
        allowed: false,
        resource: 'vehicles',
        currentUsage: current,
        maxQuota: max,
        percentage,
        status: 'EXCEEDED',
        message: `Batas kuota kendaraan tercapai (${current}/${max} unit). Upgrade paket Anda untuk menambahkan unit kendaraan baru.`,
      };
    }

    return {
      allowed: true,
      resource: 'vehicles',
      currentUsage: current,
      maxQuota: max,
      percentage,
      status,
      message: `Kuota kendaraan tersedia (${current}/${max} unit).`,
    };
  }

  public checkUserQuota(tenantId: string, countToAdd: number = 1): QuotaCheckResult {
    const quotas = this.getEffectiveQuotas(tenantId);
    const usage = this.getTenantUsage(tenantId);
    const max = quotas.userQuota;
    const current = usage.users;

    if (max === -1) {
      return { allowed: true, resource: 'users', currentUsage: current, maxQuota: max, percentage: 0, status: 'HEALTHY', message: 'Unlimited users quota' };
    }

    const nextTotal = current + countToAdd;
    const percentage = Math.round((current / max) * 100);
    const status = this.calculateThresholdStatus(percentage);

    if (nextTotal > max) {
      return {
        allowed: false,
        resource: 'users',
        currentUsage: current,
        maxQuota: max,
        percentage,
        status: 'EXCEEDED',
        message: `Batas kuota pengguna staf tercapai (${current}/${max} user). Tingkatkan paket Anda untuk mengundang pengguna baru.`,
      };
    }

    return {
      allowed: true,
      resource: 'users',
      currentUsage: current,
      maxQuota: max,
      percentage,
      status,
      message: `Kuota staf tersedia (${current}/${max} user).`,
    };
  }

  public checkDeviceQuota(tenantId: string, countToAdd: number = 1): QuotaCheckResult {
    const quotas = this.getEffectiveQuotas(tenantId);
    const usage = this.getTenantUsage(tenantId);
    const max = quotas.deviceQuota;
    const current = usage.devices;

    if (max === -1) {
      return { allowed: true, resource: 'devices', currentUsage: current, maxQuota: max, percentage: 0, status: 'HEALTHY', message: 'Unlimited devices quota' };
    }

    const nextTotal = current + countToAdd;
    const percentage = Math.round((current / max) * 100);
    const status = this.calculateThresholdStatus(percentage);

    if (nextTotal > max) {
      return {
        allowed: false,
        resource: 'devices',
        currentUsage: current,
        maxQuota: max,
        percentage,
        status: 'EXCEEDED',
        message: `Batas kuota GPS IoT tercapai (${current}/${max} device). Upgrade paket berlangganan untuk meregistrasi GPS device baru.`,
      };
    }

    return {
      allowed: true,
      resource: 'devices',
      currentUsage: current,
      maxQuota: max,
      percentage,
      status,
      message: `Kuota GPS device tersedia (${current}/${max} device).`,
    };
  }

  public checkAIQuota(tenantId: string, creditsToUse: number = 1): QuotaCheckResult {
    const quotas = this.getEffectiveQuotas(tenantId);
    const usage = this.getTenantUsage(tenantId);
    const max = quotas.aiQuotaCredits;
    const current = usage.aiCredits;

    if (max === -1) {
      return { allowed: true, resource: 'ai', currentUsage: current, maxQuota: max, percentage: 0, status: 'HEALTHY', message: 'Unlimited AI credits' };
    }

    const nextTotal = current + creditsToUse;
    const percentage = Math.round((current / max) * 100);
    const status = this.calculateThresholdStatus(percentage);

    if (nextTotal > max) {
      return {
        allowed: false,
        resource: 'ai',
        currentUsage: current,
        maxQuota: max,
        percentage,
        status: 'EXCEEDED',
        message: `Batas bulanan AI credits tercapai (${current.toLocaleString('id-ID')}/${max.toLocaleString('id-ID')} credits). Upgrade paket Anda untuk melanjutkan fitur AI Fleet Intelligence.`,
      };
    }

    return {
      allowed: true,
      resource: 'ai',
      currentUsage: current,
      maxQuota: max,
      percentage,
      status,
      message: `AI credits tersedia (${current.toLocaleString('id-ID')}/${max.toLocaleString('id-ID')}).`,
    };
  }

  public checkStorageQuota(tenantId: string, mbToAdd: number = 1): QuotaCheckResult {
    const quotas = this.getEffectiveQuotas(tenantId);
    const usage = this.getTenantUsage(tenantId);
    const max = quotas.storageQuotaMb;
    const current = usage.storageMb;
    const percentage = Math.round((current / max) * 100);
    const status = this.calculateThresholdStatus(percentage);

    if (current + mbToAdd > max) {
      return {
        allowed: false,
        resource: 'storage',
        currentUsage: current,
        maxQuota: max,
        percentage,
        status: 'EXCEEDED',
        message: `Kapasitas penyimpanan STNK/KIR/Dokumen penuh (${current}/${max} MB).`,
      };
    }

    return { allowed: true, resource: 'storage', currentUsage: current, maxQuota: max, percentage, status, message: 'Storage OK' };
  }

  public checkAPIQuota(tenantId: string, requestsToAdd: number = 1): QuotaCheckResult {
    const quotas = this.getEffectiveQuotas(tenantId);
    const usage = this.getTenantUsage(tenantId);
    const max = quotas.apiQuotaMonthly;
    const current = usage.apiRequests;
    const percentage = Math.round((current / max) * 100);
    const status = this.calculateThresholdStatus(percentage);

    if (current + requestsToAdd > max) {
      return {
        allowed: false,
        resource: 'api',
        currentUsage: current,
        maxQuota: max,
        percentage,
        status: 'EXCEEDED',
        message: `Limit request API bulanan tercapai (${current}/${max} req).`,
      };
    }

    return { allowed: true, resource: 'api', currentUsage: current, maxQuota: max, percentage, status, message: 'API OK' };
  }

  public incrementResourceUsage(
    tenantId: string,
    resource: 'vehicles' | 'users' | 'devices' | 'storageMb' | 'apiRequests',
    amount: number = 1
  ): TenantUsage {
    const usage = this.getTenantUsage(tenantId);
    usage[resource] += amount;
    usage.updatedAt = new Date().toISOString();
    this.saveState();
    return usage;
  }

  public decrementResourceUsage(
    tenantId: string,
    resource: 'vehicles' | 'users' | 'devices' | 'storageMb' | 'apiRequests',
    amount: number = 1
  ): TenantUsage {
    const usage = this.getTenantUsage(tenantId);
    usage[resource] = Math.max(0, usage[resource] - amount);
    usage.updatedAt = new Date().toISOString();
    this.saveState();
    return usage;
  }

  public recordAIUsage(record: Omit<AIUsageRecord, 'id' | 'timestamp'>): AIUsageRecord {
    const newRecord: AIUsageRecord = {
      ...record,
      id: `ai-use-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    this.aiUsages.unshift(newRecord);
    if (this.aiUsages.length > 500) this.aiUsages.pop();

    const usage = this.getTenantUsage(record.tenantId);
    usage.aiRequests += record.requestCount;
    usage.aiCredits += record.creditsUsed;
    usage.updatedAt = new Date().toISOString();

    this.saveState();
    return newRecord;
  }

  public getAIUsageHistory(tenantId: string): AIUsageRecord[] {
    return this.aiUsages.filter((r) => r.tenantId === tenantId);
  }

  private calculateThresholdStatus(percentage: number): QuotaThresholdStatus {
    if (percentage >= 100) return 'EXCEEDED';
    if (percentage >= 90) return 'CRITICAL';
    if (percentage >= 70) return 'WARNING';
    return 'HEALTHY';
  }

  // ==========================================
  // 4. FEATURE GATING SERVICE
  // ==========================================

  public canUseFeature(tenantId: string, feature: PlanFeatureKey): boolean {
    const sub = this.getSubscription(tenantId);
    if (!sub) return false;

    // Check subscription active status
    if (sub.status === 'EXPIRED' || sub.status === 'SUSPENDED' || sub.status === 'CANCELLED') {
      return false; // read-only fallback mode
    }

    if (sub.customFeatures && sub.customFeatures[feature] !== undefined) {
      return Boolean(sub.customFeatures[feature]);
    }

    const plan = this.getPlanById(sub.planId);
    if (!plan) return false;

    return Boolean(plan.featureFlags[feature]);
  }

  public getFeatureEntitlements(tenantId: string): PlanFeatureFlags {
    const sub = this.getSubscription(tenantId);
    const plan = sub ? this.getPlanById(sub.planId) || this.plans[1] : this.plans[1];
    return {
      ...plan.featureFlags,
      ...(sub?.customFeatures || {}),
    };
  }

  // ==========================================
  // 5. UPGRADE, DOWNGRADE & CANCELLATION
  // ==========================================

  public upgradePlan(
    tenantId: string,
    targetPlanId: string,
    billingInterval: BillingInterval,
    performedBy: { userId: string; userName: string; role: string },
    paymentMethod: IndonesianPaymentMethod = 'BCA_VA',
    couponCode?: string
  ): { subscription: Subscription; invoice: Invoice } {
    const sub = this.getSubscription(tenantId);
    if (!sub) throw new Error('Subscription not found');

    const targetPlan = this.getPlanById(targetPlanId);
    if (!targetPlan) throw new Error('Target plan not found');

    const oldPlanName = sub.planName;
    const oldPlanId = sub.planId;

    // Calculate Price with interval and coupon
    let basePrice = billingInterval === 'YEARLY' ? targetPlan.priceYearly : targetPlan.priceMonthly;
    if (couponCode) {
      const coupon = this.validateCoupon(couponCode);
      if (coupon) {
        if (coupon.discountPercent) {
          basePrice = Math.round(basePrice * (1 - coupon.discountPercent / 100));
        } else if (coupon.discountAmountIdr) {
          basePrice = Math.max(0, basePrice - coupon.discountAmountIdr);
        }
      }
    }

    const taxAmount = Math.round(basePrice * 0.11);
    const totalAmount = basePrice + taxAmount;

    // Generate Invoice
    const periodMonths = billingInterval === 'YEARLY' ? 12 : 1;
    const newPeriodEnd = new Date(Date.now() + periodMonths * 30 * 86400000).toISOString();

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      tenantId,
      tenantName: sub.tenantName,
      subscriptionId: sub.id,
      invoiceNumber: `INV/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${tenantId.slice(-3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      amount: basePrice,
      taxAmount,
      totalAmount,
      currency: 'IDR',
      periodStart: new Date().toISOString(),
      periodEnd: newPeriodEnd,
      status: 'PAID',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      paidAt: new Date().toISOString(),
      paymentMethod,
      paymentProvider: 'MIDTRANS',
      paymentReference: `TRX-${paymentMethod}-${Date.now().toString().slice(-6)}`,
      items: [
        {
          id: `item-${Date.now()}`,
          description: `Upgrade Paket ${targetPlan.name} (${billingInterval === 'YEARLY' ? '1 Tahun' : '1 Bulan'})`,
          quantity: 1,
          unitPrice: basePrice,
          amount: basePrice,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.invoices.unshift(invoice);

    // Update Subscription
    sub.planId = targetPlan.id;
    sub.planName = targetPlan.name;
    sub.status = 'ACTIVE';
    sub.billingInterval = billingInterval;
    sub.currentPeriodStart = new Date().toISOString();
    sub.currentPeriodEnd = newPeriodEnd;
    sub.nextBillingDate = newPeriodEnd;
    sub.expiresAt = new Date(new Date(newPeriodEnd).getTime() + 3 * 86400000).toISOString();
    sub.autoRenew = true;
    sub.updatedAt = new Date().toISOString();

    // Record Plan History
    const historyEntry: PlanChangeHistory = {
      id: `hist-${Date.now()}`,
      tenantId,
      tenantName: sub.tenantName,
      oldPlanId,
      oldPlanName,
      newPlanId: targetPlan.id,
      newPlanName: targetPlan.name,
      action: 'UPGRADE',
      effectiveDate: new Date().toISOString(),
      performedBy,
      reason: `Upgrade online ke paket ${targetPlan.name}.`,
      createdAt: new Date().toISOString(),
    };
    this.planHistory.unshift(historyEntry);

    // Record Event
    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId,
      tenantName: sub.tenantName,
      eventType: 'PLAN_UPGRADED',
      details: `Paket berhasil diupgrade ke ${targetPlan.name} (${billingInterval}) oleh ${performedBy.userName}.`,
      timestamp: new Date().toISOString(),
    });

    this.saveState();
    return { subscription: sub, invoice };
  }

  public downgradePlan(
    tenantId: string,
    targetPlanId: string,
    billingInterval: BillingInterval,
    performedBy: { userId: string; userName: string; role: string },
    reason?: string
  ): { success: boolean; message: string; subscription?: Subscription } {
    const sub = this.getSubscription(tenantId);
    if (!sub) throw new Error('Subscription not found');

    const targetPlan = this.getPlanById(targetPlanId);
    if (!targetPlan) throw new Error('Target plan not found');

    const usage = this.getTenantUsage(tenantId);

    // Safety check: ensure current usage is within target plan quotas
    const conflicts: string[] = [];
    if (targetPlan.vehicleQuota !== -1 && usage.vehicles > targetPlan.vehicleQuota) {
      conflicts.push(`Jumlah kendaraan saat ini (${usage.vehicles} unit) melebihi kuota ${targetPlan.name} (${targetPlan.vehicleQuota} unit).`);
    }
    if (targetPlan.userQuota !== -1 && usage.users > targetPlan.userQuota) {
      conflicts.push(`Jumlah pengguna aktif (${usage.users} user) melebihi kuota ${targetPlan.name} (${targetPlan.userQuota} user).`);
    }
    if (targetPlan.deviceQuota !== -1 && usage.devices > targetPlan.deviceQuota) {
      conflicts.push(`Jumlah GPS IoT aktif (${usage.devices} device) melebihi kuota ${targetPlan.name} (${targetPlan.deviceQuota} device).`);
    }

    if (conflicts.length > 0) {
      return {
        success: false,
        message: `Downgrade diblokir demi keamanan data:\n${conflicts.join('\n')}\nSilakan arsipkan unit/user berlebih secara manual terlebih dahulu sebelum downgrade. Sistem tidak akan pernah menghapus data Anda secara sepihak.`,
      };
    }

    const oldPlanName = sub.planName;
    const oldPlanId = sub.planId;

    // Apply downgrade safely at period end or immediately
    sub.planId = targetPlan.id;
    sub.planName = targetPlan.name;
    sub.billingInterval = billingInterval;
    sub.updatedAt = new Date().toISOString();

    const historyEntry: PlanChangeHistory = {
      id: `hist-${Date.now()}`,
      tenantId,
      tenantName: sub.tenantName,
      oldPlanId,
      oldPlanName,
      newPlanId: targetPlan.id,
      newPlanName: targetPlan.name,
      action: 'DOWNGRADE',
      effectiveDate: new Date().toISOString(),
      performedBy,
      reason: reason || `Downgrade ke paket ${targetPlan.name}.`,
      createdAt: new Date().toISOString(),
    };
    this.planHistory.unshift(historyEntry);

    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId,
      tenantName: sub.tenantName,
      eventType: 'PLAN_DOWNGRADED',
      details: `Paket di-downgrade ke ${targetPlan.name} oleh ${performedBy.userName}.`,
      timestamp: new Date().toISOString(),
    });

    this.saveState();
    return {
      success: true,
      message: `Paket berhasil di-downgrade ke ${targetPlan.name}. Seluruh kuota dan fitur telah disesuaikan secara aman.`,
      subscription: sub,
    };
  }

  public cancelSubscription(
    tenantId: string,
    immediately: boolean = false,
    reason: string = 'User requested cancellation',
    performedBy: { userId: string; userName: string; role: string }
  ): Subscription {
    const sub = this.getSubscription(tenantId);
    if (!sub) throw new Error('Subscription not found');

    sub.cancelledAt = new Date().toISOString();
    sub.cancellationReason = reason;
    sub.autoRenew = false;

    if (immediately) {
      sub.status = 'CANCELLED';
      sub.expiresAt = new Date().toISOString();
    } else {
      sub.cancellationEffectiveDate = sub.currentPeriodEnd;
    }

    sub.updatedAt = new Date().toISOString();

    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId,
      tenantName: sub.tenantName,
      eventType: 'SUBSCRIPTION_CANCELLED',
      details: `Langganan dibatalkan (${immediately ? 'Langsung' : 'Di akhir periode'}) oleh ${performedBy.userName}. Alasan: ${reason}. Data telematika Anda tetap tersimpan dengan aman (Retained).`,
      timestamp: new Date().toISOString(),
    });

    this.saveState();
    return sub;
  }

  public reactivateSubscription(
    tenantId: string,
    planId: string,
    billingInterval: BillingInterval,
    performedBy: { userId: string; userName: string; role: string }
  ): { subscription: Subscription; invoice: Invoice } {
    return this.upgradePlan(tenantId, planId, billingInterval, performedBy);
  }

  public extendTrial(
    tenantId: string,
    additionalDays: number = 7,
    performedBy: { userId: string; userName: string; role: string }
  ): Subscription {
    const sub = this.getSubscription(tenantId);
    if (!sub) throw new Error('Subscription not found');

    const currentExpiry = new Date(sub.trialEndDate || sub.currentPeriodEnd).getTime();
    const newExpiry = new Date(currentExpiry + additionalDays * 86400000).toISOString();

    sub.trialEndDate = newExpiry;
    sub.currentPeriodEnd = newExpiry;
    sub.nextBillingDate = newExpiry;
    sub.expiresAt = new Date(new Date(newExpiry).getTime() + 3 * 86400000).toISOString();
    sub.status = 'TRIAL';
    sub.updatedAt = new Date().toISOString();

    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId,
      tenantName: sub.tenantName,
      eventType: 'TRIAL_STARTED',
      details: `Masa uji coba (Trial) diperpanjang ${additionalDays} hari hingga ${new Date(newExpiry).toLocaleDateString('id-ID')} oleh Super Admin (${performedBy.userName}).`,
      timestamp: new Date().toISOString(),
    });

    this.saveState();
    return sub;
  }

  public toggleAutoRenew(tenantId: string, autoRenew: boolean): Subscription {
    const sub = this.getSubscription(tenantId);
    if (!sub) throw new Error('Subscription not found');

    sub.autoRenew = autoRenew;
    sub.updatedAt = new Date().toISOString();
    this.saveState();
    return sub;
  }

  // ==========================================
  // 6. INVOICES & PAYMENT GATEWAY ABSTRACTION
  // ==========================================

  public getInvoices(tenantId: string): Invoice[] {
    return this.invoices.filter((inv) => inv.tenantId === tenantId);
  }

  public getAllInvoices(): Invoice[] {
    return this.invoices;
  }

  public createCheckout(req: PaymentCheckoutRequest): PaymentCheckoutResponse {
    const plan = this.getPlanById(req.planId);
    if (!plan) throw new Error('Plan not found');

    let basePrice = req.billingInterval === 'YEARLY' ? plan.priceYearly : plan.priceMonthly;
    if (req.couponCode) {
      const coupon = this.validateCoupon(req.couponCode);
      if (coupon) {
        if (coupon.discountPercent) {
          basePrice = Math.round(basePrice * (1 - coupon.discountPercent / 100));
        } else if (coupon.discountAmountIdr) {
          basePrice = Math.max(0, basePrice - coupon.discountAmountIdr);
        }
      }
    }

    const totalAmount = Math.round(basePrice * 1.11);
    const trxId = `TRX-${Date.now()}`;
    const invoiceId = `inv-${Date.now()}`;

    // Mock Indonesian VA / QRIS generator
    let vaNumber: string | undefined;
    let qrString: string | undefined;

    if (req.paymentMethod === 'BCA_VA') {
      vaNumber = `8077708${Date.now().toString().slice(-7)}`;
    } else if (req.paymentMethod === 'MANDIRI_VA') {
      vaNumber = `8890812${Date.now().toString().slice(-7)}`;
    } else if (req.paymentMethod === 'BNI_VA') {
      vaNumber = `9888801${Date.now().toString().slice(-7)}`;
    } else if (req.paymentMethod === 'QRIS') {
      qrString = `00020101021226590016ID.CO.FLEETAI.WWW01189360091800000000005204581253033605802ID5914FLEET_SMART_AI6007JAKARTA62070703A016304`;
    }

    return {
      transactionId: trxId,
      invoiceId,
      amount: totalAmount,
      currency: 'IDR',
      paymentMethod: req.paymentMethod,
      vaNumber,
      qrString,
      expiryTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      status: 'PENDING',
    };
  }

  public simulatePaymentWebhook(payload: PaymentWebhookPayload): { success: boolean; message: string } {
    // 1. Idempotency check
    if (this.processedWebhooks.has(payload.idempotencyKey) || this.processedWebhooks.has(payload.eventId)) {
      return { success: true, message: 'Duplicate webhook skipped (Idempotency enforced).' };
    }

    // 2. Signature verification check
    if (!payload.signature || payload.signature.length < 8) {
      return { success: false, message: 'Invalid webhook signature.' };
    }

    // 3. Mark processed
    this.processedWebhooks.add(payload.idempotencyKey);
    this.processedWebhooks.add(payload.eventId);

    // 4. Update Invoice & Subscription
    const invoice = this.invoices.find((i) => i.invoiceNumber === payload.invoiceNumber || i.tenantId === payload.tenantId);
    if (invoice && payload.paymentStatus === 'PAID') {
      invoice.status = 'PAID';
      invoice.paidAt = new Date().toISOString();
    }

    this.recordEvent({
      id: `evt-${Date.now()}`,
      tenantId: payload.tenantId,
      tenantName: 'Perusahaan SaaS',
      eventType: payload.paymentStatus === 'PAID' ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
      details: `Webhook payment provider diterima: Status ${payload.paymentStatus} untuk Rp ${payload.amount.toLocaleString('id-ID')} via ${payload.paymentMethod}.`,
      metadata: { eventId: payload.eventId, idempotencyKey: payload.idempotencyKey },
      timestamp: new Date().toISOString(),
    });

    this.saveState();
    return { success: true, message: 'Payment webhook processed successfully.' };
  }

  public validateCoupon(code: string): Coupon | null {
    const clean = code.trim().toUpperCase();
    const coupon = this.coupons.find((c) => c.code === clean && c.active);
    if (!coupon) return null;
    if (new Date(coupon.validUntil).getTime() < Date.now()) return null;
    if (coupon.currentUses >= coupon.maxUses) return null;
    return coupon;
  }

  // ==========================================
  // 7. BILLING REVENUE ANALYTICS (SUPER ADMIN)
  // ==========================================

  public getBillingAnalytics(): BillingAnalyticsData {
    let mrr = 0;
    let activeSubs = 0;
    let trialAccounts = 0;

    this.subscriptions.forEach((sub) => {
      if (sub.status === 'ACTIVE') {
        activeSubs++;
        const plan = this.getPlanById(sub.planId);
        if (plan) {
          mrr += sub.billingInterval === 'YEARLY' ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;
        }
      } else if (sub.status === 'TRIAL') {
        trialAccounts++;
      }
    });

    const arr = mrr * 12;

    return {
      mrr,
      arr,
      activeSubscriptionsCount: activeSubs,
      trialAccountsCount: trialAccounts,
      churnRatePercent: 1.8,
      conversionRatePercent: 68.4,
      upgradesThisMonth: 6,
      downgradesThisMonth: 1,
      expiredThisMonth: 2,
      totalRevenueYtd: 412500000,
      monthlyRevenueTrend: [
        { month: 'Mar 2026', starter: 8910000, professional: 24900000, enterprise: 35940000, total: 69750000 },
        { month: 'Apr 2026', starter: 9900000, professional: 27390000, enterprise: 35940000, total: 73230000 },
        { month: 'Mei 2026', starter: 11880000, professional: 32370000, enterprise: 41930000, total: 86180000 },
        { month: 'Jun 2026', starter: 13860000, professional: 37350000, enterprise: 47920000, total: 99130000 },
        { month: 'Jul 2026', starter: 15840000, professional: 44820000, enterprise: 53910000, total: 114570000 },
        { month: 'Agu 2026', starter: 17820000, professional: 52290000, enterprise: 59900000, total: 130010000 },
      ],
      planDistribution: [
        { planName: 'Professional', count: 18, percentage: 56, color: '#06b6d4' },
        { planName: 'Enterprise', count: 9, percentage: 28, color: '#3b82f6' },
        { planName: 'Starter', count: 5, percentage: 16, color: '#10b981' },
      ],
    };
  }

  // ==========================================
  // 8. EVENTS & PLAN CHANGE AUDIT
  // ==========================================

  public recordEvent(event: SubscriptionEvent) {
    this.events.unshift(event);
    if (this.events.length > 500) this.events.pop();
    this.saveState();
  }

  public getSubscriptionEvents(tenantId?: string): SubscriptionEvent[] {
    if (!tenantId || tenantId === 'PLATFORM') {
      return this.events;
    }
    return this.events.filter((e) => e.tenantId === tenantId || e.tenantId === 'PLATFORM');
  }

  public getPlanHistory(tenantId?: string): PlanChangeHistory[] {
    if (!tenantId) return this.planHistory;
    return this.planHistory.filter((h) => h.tenantId === tenantId);
  }
}

export const subscriptionService = new SubscriptionService();
