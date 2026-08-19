/**
 * Fleet Intelligence Smart AI - Subscription, Plans, Quota & Billing Types (Prompt 41)
 * Multi-Tenant SaaS Lifecycle, Feature Entitlement, Indonesian Payment Gateways & Quota Enforcement
 */

export type SubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'GRACE_PERIOD'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'SUSPENDED';

export type BillingInterval = 'MONTHLY' | 'YEARLY' | 'CUSTOM';

export type PlanStatus = 'ACTIVE' | 'ARCHIVED' | 'INACTIVE';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export type QuotaThresholdStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'EXCEEDED';

export type IndonesianPaymentMethod =
  | 'QRIS'
  | 'BCA_VA'
  | 'MANDIRI_VA'
  | 'BNI_VA'
  | 'BRI_VA'
  | 'PERMATA_VA'
  | 'CREDIT_CARD'
  | 'BANK_TRANSFER_MANUAL';

export interface PlanFeatureFlags {
  liveTracking: boolean;
  tripHistory: boolean;
  geofence: boolean;
  delivery: boolean;
  fuel: boolean;
  maintenance: boolean;
  safety: boolean;
  fatigue: boolean;
  analytics: boolean;
  aiAssistant: boolean;
  predictiveMaintenance: boolean;
  aiFuel: boolean;
  aiDriver: boolean;
  aiRoute: boolean;
  aiSafety: boolean;
  api: boolean;
  export: boolean;
  customBranding: boolean;
  automation: boolean;
}

export type PlanFeatureKey = keyof PlanFeatureFlags;

export interface Plan {
  id: string; // e.g. 'plan-starter', 'plan-pro', 'plan-enterprise', 'plan-enterprise-custom'
  name: string; // 'Starter', 'Professional', 'Enterprise', 'Enterprise Custom'
  code: string; // 'STARTER', 'PRO', 'ENTERPRISE', 'CUSTOM'
  version: number; // e.g. 1, 2 for plan versioning
  description: string;
  priceMonthly: number; // in IDR
  priceYearly: number; // in IDR (with built-in discount)
  billingInterval: BillingInterval;
  currency: 'IDR' | 'USD';
  vehicleQuota: number; // -1 for unlimited/custom
  userQuota: number;
  deviceQuota: number;
  aiQuotaCredits: number; // Monthly AI credits
  storageQuotaMb: number;
  apiQuotaMonthly: number;
  trialDurationDays: number;
  featureFlags: PlanFeatureFlags;
  isPopular?: boolean;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  tenantName: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  startDate: string;
  trialStartDate?: string;
  trialEndDate?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  cancelledAt?: string;
  cancellationEffectiveDate?: string;
  cancellationReason?: string;
  expiresAt: string;
  autoRenew: boolean;
  gracePeriodDays: number; // Default 3 days
  customQuotas?: {
    vehicleQuota?: number;
    userQuota?: number;
    deviceQuota?: number;
    aiQuotaCredits?: number;
    storageQuotaMb?: number;
    apiQuotaMonthly?: number;
  };
  customFeatures?: Partial<PlanFeatureFlags>;
  createdAt: string;
  updatedAt: string;
}

export interface TenantUsage {
  id: string;
  tenantId: string;
  periodStart: string;
  periodEnd: string;
  vehicles: number;
  users: number;
  devices: number;
  aiRequests: number;
  aiCredits: number;
  storageMb: number;
  apiRequests: number;
  updatedAt: string;
}

export interface AIUsageRecord {
  id: string;
  tenantId: string;
  userId: string;
  userName?: string;
  feature:
    | 'ai_fleet_intelligence'
    | 'ai_driver_intelligence'
    | 'ai_fuel_intelligence'
    | 'ai_predictive_maintenance'
    | 'ai_route_intelligence'
    | 'ai_safety_intelligence'
    | 'ai_fleet_assistant'
    | 'ai_automation';
  requestCount: number;
  inputTokens: number;
  outputTokens: number;
  creditsUsed: number;
  timestamp: string;
}

export interface QuotaCheckResult {
  allowed: boolean;
  resource: 'vehicles' | 'users' | 'devices' | 'ai' | 'storage' | 'api';
  currentUsage: number;
  maxQuota: number;
  percentage: number;
  status: QuotaThresholdStatus;
  message: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  subscriptionId: string;
  invoiceNumber: string; // e.g. 'INV-2026-08-0012'
  amount: number;
  taxAmount: number; // 11% PPN in Indonesia
  totalAmount: number;
  currency: 'IDR';
  periodStart: string;
  periodEnd: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: IndonesianPaymentMethod;
  paymentProvider?: 'MIDTRANS' | 'XENDIT' | 'DOKU' | 'MANUAL';
  paymentReference?: string;
  items: InvoiceItem[];
  pdfUrl?: string;
  createdAt: string;
}

export interface PlanChangeHistory {
  id: string;
  tenantId: string;
  tenantName: string;
  oldPlanId: string;
  oldPlanName: string;
  newPlanId: string;
  newPlanName: string;
  action: 'UPGRADE' | 'DOWNGRADE' | 'TRIAL_START' | 'RENEWAL' | 'REACTIVATION' | 'CUSTOM_QUOTA_OVERRIDE';
  effectiveDate: string;
  performedBy: {
    userId: string;
    userName: string;
    role: string;
  };
  reason?: string;
  proratedCreditIdr?: number;
  createdAt: string;
}

export interface Coupon {
  code: string; // e.g. 'MERDEKA50', 'FLEETAI20'
  discountPercent?: number; // e.g. 20
  discountAmountIdr?: number; // e.g. 500000
  durationMonths: number;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  active: boolean;
}

export interface PaymentCheckoutRequest {
  tenantId: string;
  subscriptionId: string;
  planId: string;
  billingInterval: BillingInterval;
  paymentMethod: IndonesianPaymentMethod;
  couponCode?: string;
}

export interface PaymentCheckoutResponse {
  transactionId: string;
  invoiceId: string;
  amount: number;
  currency: 'IDR';
  paymentMethod: IndonesianPaymentMethod;
  vaNumber?: string;
  qrString?: string;
  expiryTime: string;
  status: 'PENDING' | 'SUCCESS';
}

export interface PaymentWebhookPayload {
  eventId: string;
  transactionId: string;
  idempotencyKey: string;
  invoiceNumber: string;
  tenantId: string;
  amount: number;
  currency: string;
  paymentStatus: 'PAID' | 'FAILED' | 'EXPIRED';
  paymentMethod: string;
  signature: string;
  timestamp: string;
}

export interface SubscriptionEvent {
  id: string;
  tenantId: string;
  tenantName: string;
  eventType:
    | 'SUBSCRIPTION_CREATED'
    | 'SUBSCRIPTION_ACTIVATED'
    | 'TRIAL_STARTED'
    | 'TRIAL_ENDING'
    | 'TRIAL_EXPIRED'
    | 'PLAN_UPGRADED'
    | 'PLAN_DOWNGRADED'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'SUBSCRIPTION_CANCELLED'
    | 'SUBSCRIPTION_EXPIRED'
    | 'SUBSCRIPTION_REACTIVATED'
    | 'QUOTA_WARNING'
    | 'QUOTA_EXCEEDED';
  details: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface BillingAnalyticsData {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  activeSubscriptionsCount: number;
  trialAccountsCount: number;
  churnRatePercent: number;
  conversionRatePercent: number;
  upgradesThisMonth: number;
  downgradesThisMonth: number;
  expiredThisMonth: number;
  totalRevenueYtd: number;
  monthlyRevenueTrend: Array<{
    month: string;
    starter: number;
    professional: number;
    enterprise: number;
    total: number;
  }>;
  planDistribution: Array<{
    planName: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}
