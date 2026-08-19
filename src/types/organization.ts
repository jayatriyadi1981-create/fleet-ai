/**
 * Fleet Intelligence Smart AI - Multi-Tenant SaaS & Organization Hierarchy Types (Prompt 40)
 * Foundation for Enterprise Data Isolation, Multi-Tenant SaaS, RBAC Scopes & Org Tree
 */

export type TenantStatus = 'active' | 'trial' | 'suspended' | 'inactive' | 'archived';

export type TenantPlan = 'Starter' | 'Business' | 'Professional' | 'Enterprise';

export type OrganizationScopeType = 'GLOBAL' | 'COMPANY' | 'BRANCH' | 'DEPARTMENT' | 'FLEET' | 'VEHICLE';

export type IndonesianTimezone = 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura';

export interface TenantFeatureFlags {
  featureAi: boolean;
  featureFuel: boolean;
  featureMaintenance: boolean;
  featureSafety: boolean;
  featureFatigue: boolean;
  featureDelivery: boolean;
  featureReports: boolean;
  featurePredictiveMaintenance: boolean;
  featureCustomBranding: boolean;
  featureAdvancedAutomation: boolean;
  featureApiAccess: boolean;
}

export interface TenantUsageLimits {
  maxVehicles: number;
  currentVehicles: number;
  maxUsers: number;
  currentUsers: number;
  maxBranches: number;
  currentBranches: number;
  maxDevices: number;
  currentDevices: number;
  maxReportsPerMonth: number;
  currentReportsThisMonth: number;
  aiMonthlyQuotaCalls: number;
  currentAiCallsThisMonth: number;
  storageQuotaMb: number;
  currentStorageMb: number;
  apiMonthlyQuotaRequests: number;
  currentApiRequestsThisMonth: number;
}

export interface TenantCompanyDetailed {
  id: string; // e.g. 'tenant-tln-01'
  name: string; // e.g. 'PT Trans Logistik Nusantara'
  legalName: string; // e.g. 'PT Trans Logistik Nusantara Tbk'
  code: string; // e.g. 'TLN' (unique, alphanumeric)
  industry: string; // e.g. 'Logistics & Supply Chain', 'Mining Haulage', 'Public Transport'
  businessType: 'CORPORATION' | 'FREIGHT_FORWARDER' | 'RENTAL' | 'DISTRIBUTOR' | 'PUBLIC_AGENCY';
  taxIdNpwp: string; // e.g. '01.345.678.9-012.000'
  status: TenantStatus;
  planId: string;
  subscriptionPlan: TenantPlan;
  billingCycle: 'monthly' | 'yearly';
  subscriptionExpiresAt: string;
  logoUrl?: string;
  reportLogoUrl?: string;
  primaryColor?: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  timezone: IndonesianTimezone;
  currency: 'IDR' | 'USD';
  locale: 'id-ID' | 'en-US';
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD';
  branchesCount: number;
  vehiclesCount: number;
  usersCount: number;
  features: TenantFeatureFlags;
  limits: TenantUsageLimits;
  createdAt: string;
  updatedAt: string;
  retentionExpiresAt?: string;
}

export interface BranchExtendedDetailed {
  id: string; // e.g. 'br-jkt'
  tenantId: string;
  name: string; // e.g. 'HQ & Depo Jakarta (Tanjung Priok)'
  code: string; // e.g. 'JKT-01'
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  managerId?: string;
  managerName: string;
  status: 'active' | 'inactive';
  vehiclesCount: number;
  departmentsCount: number;
  fleetsCount: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDetailed {
  id: string; // e.g. 'dept-ops-01'
  tenantId: string;
  branchId: string;
  branchName: string;
  name: string; // e.g. 'Operations & Dispatch'
  code: string; // e.g. 'OPS-JKT'
  managerId?: string;
  managerName: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  vehiclesCount: number;
  fleetsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FleetDetailed {
  id: string; // e.g. 'flt-wingbox-01'
  tenantId: string;
  branchId: string;
  branchName: string;
  departmentId: string;
  departmentName: string;
  name: string; // e.g. 'Armada Wingbox Jabodetabek'
  code: string; // e.g. 'FLT-WB-JKT'
  description?: string;
  managerId?: string;
  managerName: string;
  status: 'active' | 'inactive';
  vehiclesCount: number;
  colorTag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTenantMembership {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  tenantId: string;
  tenantName: string;
  tenantCode: string;
  role: string;
  scopeType: OrganizationScopeType;
  branchIds: string[];
  departmentIds: string[];
  fleetIds: string[];
  isDefault: boolean;
  status: 'active' | 'suspended';
  assignedAt: string;
}

export interface OrganizationContextState {
  tenantId: string;
  tenantName: string;
  tenantCode: string;
  tenantStatus: TenantStatus;
  branchId: string; // 'all' or branch id
  departmentId: string; // 'all' or department id
  fleetId: string; // 'all' or fleet id
  scopeType: OrganizationScopeType;
}

export interface OrganizationTreeNode {
  id: string;
  name: string;
  code: string;
  type: 'COMPANY' | 'BRANCH' | 'DEPARTMENT' | 'FLEET';
  status: string;
  managerName?: string;
  vehiclesCount: number;
  children?: OrganizationTreeNode[];
}

export interface OrganizationAuditRecord {
  id: string;
  actorUserId: string;
  actorName: string;
  actorRole: string;
  tenantId: string;
  tenantName: string;
  action: 
    | 'TENANT_CREATED'
    | 'TENANT_UPDATED'
    | 'TENANT_SUSPENDED'
    | 'TENANT_ACTIVATED'
    | 'TENANT_ARCHIVED'
    | 'BRANCH_CREATED'
    | 'BRANCH_UPDATED'
    | 'BRANCH_DELETED'
    | 'DEPARTMENT_CREATED'
    | 'DEPARTMENT_UPDATED'
    | 'DEPARTMENT_DELETED'
    | 'FLEET_CREATED'
    | 'FLEET_UPDATED'
    | 'FLEET_DELETED'
    | 'USER_SCOPE_UPDATED'
    | 'PLAN_UPGRADED'
    | 'TENANT_SWITCHED';
  entity: 'TENANT' | 'BRANCH' | 'DEPARTMENT' | 'FLEET' | 'USER_SCOPE' | 'PLAN' | 'SECURITY';
  entityType?: string;
  entityId: string;
  entityName: string;
  beforeData?: string;
  afterData?: string;
  details?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface CrossTenantSecurityTestResult {
  testId: string;
  testName: string;
  category: 'ISOLATION' | 'RBAC_SCOPE' | 'IDOR' | 'REPORT_EXPORT' | 'AI_MEMORY' | 'DATA_INTEGRITY';
  description: string;
  attemptedAction: string;
  expectedResult: string;
  actualResult: string;
  passed: boolean;
  proofPayload?: any;
  executionTimestamp: string;
}
