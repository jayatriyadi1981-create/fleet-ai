/**
 * Fleet Intelligence Smart AI - Enterprise Security Domain Types
 * PROMPT 50 - Zero Trust, Defense-in-Depth, Multi-Tenant Isolation & Compliance
 */

import { UserRole, ResourceModule, PermissionAction, AccessScope } from '../../../types/rbac';

export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ThreatType =
  | 'BRUTE_FORCE'
  | 'IMPOSSIBLE_TRAVEL'
  | 'UNAUTHORIZED_CROSS_TENANT'
  | 'UNAUTHORIZED_BRANCH_ACCESS'
  | 'MASS_DELETE'
  | 'MASS_EXPORT'
  | 'SUSPICIOUS_AI_USAGE'
  | 'MALICIOUS_FILE_UPLOAD'
  | 'UNKNOWN_GPS_DEVICE'
  | 'GPS_TELEMETRY_SPOOF'
  | 'RATE_LIMIT_EXCEEDED'
  | 'PRIVILEGE_ESCALATION'
  | 'SESSION_HIJACK_ATTEMPT'
  | 'WEBHOOK_SIGNATURE_FAILED';

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerStatus {
  serviceName: string;
  state: CircuitBreakerState;
  failureCount: number;
  failureThreshold: number;
  lastFailureTime?: string;
  nextAttemptTime?: string;
  successCount: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  historyCount: number;
  maxAgeDays: number;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
}

export interface SessionPolicy {
  idleTimeoutMinutes: number;
  absoluteTimeoutHours: number;
  maxConcurrentSessionsPerUser: number;
  enforceMfaForRoles: UserRole[];
  rotateSessionOnPrivilegeChange: boolean;
  requireReauthForSensitiveActions: boolean;
}

export interface ApiSecurityPolicy {
  rateLimitPerMinute: number;
  burstLimit: number;
  enforceHttps: boolean;
  corsAllowedOrigins: string[];
  requireHmacWebhooks: boolean;
  ipAllowlist: string[];
  enableIpAllowlist: boolean;
}

export interface AiSecurityPolicy {
  requireApprovalForDestructiveActions: boolean;
  maxTokensPerRequest: number;
  redactPiiBeforeSending: boolean;
  enforceTenantContext: boolean;
  allowedAiRoles: UserRole[];
}

export interface GpsSecurityPolicy {
  enforceDeviceSecret: boolean;
  telemetryBoundsValidation: boolean;
  maxPayloadsPerMinutePerDevice: number;
  quarantineUnknownDevices: boolean;
  maxSpeedKmhThreshold: number;
}

export interface SecurityPolicyConfig {
  id: string;
  tenantId: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
  passwordPolicy: PasswordPolicy;
  sessionPolicy: SessionPolicy;
  apiPolicy: ApiSecurityPolicy;
  aiPolicy: AiSecurityPolicy;
  gpsPolicy: GpsSecurityPolicy;
}

export interface PolicyVersionRecord {
  id: string;
  policyId: string;
  tenantId: string;
  version: number;
  changedBy: string;
  changedByEmail: string;
  timestamp: string;
  reason: string;
  changes: {
    section: string;
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface ActiveUserSession {
  sessionId: string;
  userId: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  ipAddress: string;
  userAgent: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'API_CLIENT';
  browser: string;
  os: string;
  locationCity: string;
  locationCountry: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  isCurrent: boolean;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export interface ApiKeyDefinition {
  id: string;
  tenantId: string;
  name: string;
  prefix: string; // e.g. "sk_live_"
  maskedKey: string; // e.g. "sk_live_••••••••9a7F"
  scopes: string[]; // e.g. ["gps.read", "vehicle.read", "trip.write"]
  allowedIps?: string[];
  rateLimitPerMin: number;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  createdBy: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export interface WebhookSecurityConfig {
  id: string;
  tenantId: string;
  name: string;
  targetUrl: string;
  secretKeyMasked: string;
  signatureHeader: string;
  hmacAlgorithm: 'SHA256' | 'SHA512';
  replayWindowSeconds: number;
  enabled: boolean;
  failureCount: number;
  circuitState: CircuitBreakerState;
  lastDeliveredAt?: string;
}

export interface GpsDeviceSecurityProfile {
  imei: string;
  deviceId: string;
  tenantId: string;
  deviceName: string;
  protocol: string;
  status: 'AUTHENTICATED' | 'QUARANTINED' | 'BLOCKED' | 'UNREGISTERED';
  lastSeenAt: string;
  lastIp: string;
  failedAuthCount: number;
  secretConfigured: boolean;
  quarantineReason?: string;
}

export interface GpsTelemetryPayload {
  imei: string;
  deviceId?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  ignition: boolean;
  fuelLevelPercent?: number;
  temperatureCelsius?: number;
  secretToken?: string;
}

export interface FileSecurityMetadata {
  fileId: string;
  tenantId: string;
  originalFilename: string;
  sanitizedFilename: string;
  mimeType: string;
  sizeBytes: number;
  classification: DataClassification;
  scanStatus: 'CLEAN' | 'INFECTED' | 'SUSPICIOUS' | 'PENDING';
  storagePath: string;
  uploadedBy: string;
  uploadedAt: string;
  signedUrlExpiresAt?: string;
}

export interface BackupRecord {
  id: string;
  tenantId: string;
  backupType: 'DATABASE' | 'FILES' | 'CONFIG' | 'AUDIT' | 'FULL';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'VERIFIED';
  sizeBytes: number;
  encryptedWithKeyId: string;
  checksumSha256: string;
  retentionDays: number;
  createdAt: string;
  expiresAt: string;
  durationSeconds: number;
  recordCount: number;
  verifiedAt?: string;
  error?: string;
}

export interface DisasterRecoveryStatus {
  targetRpoMinutes: number;
  targetRtoMinutes: number;
  actualRpoMinutes: number;
  actualRtoMinutes: number;
  lastDrRehearsalAt: string;
  drReadinessScorePercent: number;
  replicationLagSeconds: number;
  crossRegionReplicaHealthy: boolean;
}

export interface SystemHealthStatus {
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  database: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  cache: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  queue: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  storage: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  gpsGateway: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  aiService: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  notificationService: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  backupService: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  uptimeSeconds: number;
}

export interface SecurityThreatEvent {
  id: string;
  tenantId: string;
  threatType: ThreatType;
  severity: SecuritySeverity;
  sourceIp: string;
  actorEmail?: string;
  targetResource: string;
  description: string;
  timestamp: string;
  mitigationTaken: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SecurityRiskAssessment {
  score: number; // 0-100 (100 is safest)
  riskLevel: SecuritySeverity;
  activeThreatCount: number;
  criticalIssues: string[];
  recommendations: string[];
  evaluatedAt: string;
}

export interface SecurityTestResult {
  id: string;
  category:
    | 'AUTHENTICATION'
    | 'AUTHORIZATION'
    | 'TENANT_ISOLATION'
    | 'BRANCH_ISOLATION'
    | 'RATE_LIMITING'
    | 'SECRET_REDACTION'
    | 'GPS_SECURITY'
    | 'AI_SECURITY'
    | 'FILE_PROTECTION'
    | 'BACKUP_ENCRYPTION';
  name: string;
  description: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  expectedResult: string;
  actualResult: string;
  details?: Record<string, any>;
}

export interface AuthorizationCheckRequest {
  userRole: UserRole;
  userTenantId: string;
  userBranchId?: string;
  targetModule: ResourceModule;
  targetAction: PermissionAction;
  targetTenantId: string;
  targetBranchId?: string;
}

export interface AuthorizationCheckResult {
  allowed: boolean;
  reason: string;
  ruleMatched: string;
  effectiveScope: AccessScope;
  isCrossTenantBreach: boolean;
  isBranchScopeBreach: boolean;
}
