/**
 * Fleet Intelligence Smart AI - Super Admin Control Center Domain Types (Prompt 42)
 * Complete platform-level SaaS ecosystem management: Companies, Users, Telematics,
 * Billing, AI/API Usage, System Health, Incidents, Support Impersonation, and Audit.
 */

import { TenantPlan, TenantStatus } from './organization';
import { PlanFeatureKey } from './subscription';
import { UserRole } from './rbac';

export type PlatformCompanyStatus = 'active' | 'trial' | 'past_due' | 'suspended' | 'expired';

export interface PlatformCompanyQuota {
  maxVehicles: number;
  currentVehicles: number;
  maxUsers: number;
  currentUsers: number;
  maxDevices: number;
  currentDevices: number;
  maxBranches: number;
  currentBranches: number;
  aiCreditsMonthly: number;
  currentAiCredits: number;
  storageMb: number;
  currentStorageMb: number;
  apiMonthlyRequests: number;
  currentApiRequests: number;
}

export interface PlatformCompany {
  id: string;
  name: string;
  legalName: string;
  code: string;
  industry: string;
  planId: string;
  planName: 'Starter' | 'Professional' | 'Enterprise' | 'Custom';
  status: PlatformCompanyStatus;
  billingCycle: 'monthly' | 'yearly';
  mrr: number; // in IDR
  currency: string;
  createdAt: string;
  subscriptionExpiresAt: string;
  trialEndsAt?: string;
  address: string;
  city: string;
  province: string;
  taxIdNpwp: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  quotas: PlatformCompanyQuota;
  features: Record<PlanFeatureKey, boolean>;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  healthScore: number; // 0 - 100
  telematicsDataRateMsgsSec: number;
  lastActiveAt: string;
  notes?: string;
}

export interface PlatformUser {
  id: string;
  tenantId: string;
  tenantName: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleLabel: string;
  status: 'active' | 'locked' | 'pending_verification' | 'suspended';
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  lastLoginAt: string;
  lastLoginIp: string;
  lastLoginLocation: string;
  createdAt: string;
}

export interface PlatformDeviceItem {
  id: string;
  imei: string;
  tenantId: string;
  tenantName: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  hardwareModel: string;
  protocol: 'TELTONIKA' | 'CONCOX' | 'QUECLINK' | 'SUNTECH' | 'RUPTELA' | 'MEITRACK' | 'MQTT' | 'JT808';
  simNumber: string;
  simProvider: 'Telkomsel IoT' | 'Indosat Ooredoo' | 'XL Axiata' | 'Singtel IoT';
  simStatus: 'active' | 'roaming' | 'low_quota' | 'suspended';
  firmwareVersion: string;
  connectionStatus: 'online' | 'offline' | 'dormant' | 'unassigned' | 'defective';
  lastHeartbeat: string;
  packetDropRate: number; // percentage e.g. 0.2%
  batteryVoltage: number;
  signalStrength: number; // 0 - 100%
}

export interface PlatformRevenueMetrics {
  mrrTotal: number;
  arrTotal: number;
  arpu: number;
  totalSubscribers: number;
  churnRatePercent: number;
  expansionMrr: number;
  netRevenueRetentionPercent: number;
  lifetimeRevenue: number;
  pendingInvoicesAmount: number;
  failedInvoicesAmount: number;
  growthMoMPercent: number;
  revenueByPlan: {
    planName: string;
    count: number;
    revenue: number;
    color: string;
  }[];
  monthlyRevenueTrend: {
    month: string;
    mrr: number;
    newMrr: number;
    expansionMrr: number;
    churnMrr: number;
    netRevenue: number;
  }[];
  gatewayDistribution: {
    gateway: 'Midtrans' | 'Xendit' | 'DOKU' | 'Bank Transfer';
    volume: number;
    transactionsCount: number;
    successRate: number;
  }[];
}

export interface PlatformAiApiMetrics {
  totalTokensMonthly: number;
  tokensTrend: {
    date: string;
    geminiProTokens: number;
    geminiFlashTokens: number;
    visionTokens: number;
    costUsd: number;
  }[];
  estimatedCostUsd: number;
  estimatedCostIdr: number;
  aiModulesBreakdown: {
    module: string;
    tokens: number;
    costUsd: number;
    percentage: number;
  }[];
  topAiTenants: {
    tenantId: string;
    tenantName: string;
    tokensConsumed: number;
    creditsUsed: number;
    creditsLimit: number;
    quotaPercentage: number;
  }[];
  apiGateway: {
    totalRequests24h: number;
    avgRequestsPerSec: number;
    peakRequestsPerSec: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
    http2xxCount: number;
    http4xxCount: number;
    http5xxCount: number;
    throttledRequestsCount: number;
    endpoints: {
      path: string;
      method: string;
      calls24h: number;
      avgLatencyMs: number;
      errorRate: number;
    }[];
  };
}

export type MicroserviceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface MicroserviceHealthItem {
  id: string;
  name: string;
  category: 'Core Service' | 'Data Ingestion' | 'AI & Analytics' | 'Worker & Jobs' | 'Gateway';
  status: MicroserviceStatus;
  uptimePercent: number;
  latencyMs: number;
  version: string;
  instancesCount: number;
  region: 'ap-southeast-3 (Jakarta)' | 'ap-southeast-1 (Singapore)';
  lastIncident?: string;
}

export interface SystemResourceMetrics {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskIoIops: number;
  ingestionMsgsSec: number;
  activeWebsockets: number;
  redisCacheHitRate: number;
  dbConnectionPoolUsed: number;
  dbConnectionPoolMax: number;
  bandwidthMbps: number;
}

export type IncidentSeverity = 'P1_CRITICAL' | 'P2_MAJOR' | 'P3_MINOR' | 'MAINTENANCE';
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';

export interface PlatformIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedServices: string[];
  impactDescription: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  timeline: {
    timestamp: string;
    status: IncidentStatus;
    message: string;
    author: string;
  }[];
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'maintenance';
  targetAudience: 'ALL' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
  dismissible: boolean;
  createdBy: string;
  createdAt: string;
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  targetTenantId?: string;
  targetTenantName?: string;
  action: string;
  category: 'SECURITY' | 'SUBSCRIPTION' | 'TENANT' | 'USER' | 'SYSTEM' | 'IMPERSONATION' | 'AI_CONTROL';
  details: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ImpersonationSession {
  active: boolean;
  tenantId: string;
  tenantName: string;
  tenantCode: string;
  superAdminId: string;
  superAdminName: string;
  superAdminEmail: string;
  startedAt: string;
  reason: string;
  expiresAt: string;
}

export interface SuperAdminDashboardKpis {
  totalCompanies: number;
  activeCompanies: number;
  trialCompanies: number;
  suspendedCompanies: number;
  totalVehicles: number;
  activeMovingVehicles: number;
  totalDevices: number;
  onlineDevices: number;
  totalUsers: number;
  activeSessions: number;
  mrrTotal: number;
  arrTotal: number;
  arpu: number;
  churnRate: number;
  ingestionThroughputMsgsSec: number;
  aiMonthlyTokens: number;
  aiMonthlySpendUsd: number;
  systemOverallHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  openIncidentsCount: number;
}
