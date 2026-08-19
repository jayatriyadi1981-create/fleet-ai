/**
 * Fleet Intelligence Smart AI - Enterprise Audit & Activity Log Domain Types
 * PROMPT 49 - Security, Compliance, Observability & Immutability Layer
 */

export type ActorType =
  | 'USER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'AI'
  | 'SYSTEM'
  | 'API'
  | 'DEVICE'
  | 'AUTOMATION'
  | 'CRON'
  | 'WEBHOOK';

export type ActionCategory =
  | 'AUTHENTICATION'
  | 'CRUD'
  | 'EXPORT'
  | 'CONFIGURATION'
  | 'PERMISSION'
  | 'AI'
  | 'SYSTEM'
  | 'SECURITY'
  | 'INTEGRATION'
  | 'DOCUMENT'
  | 'GPS'
  | 'NOTIFICATION'
  | 'SUBSCRIPTION'
  | 'MAINTENANCE'
  | 'FUEL'
  | 'SAFETY'
  | 'TRIP';

export type ActionType =
  // Authentication
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'SESSION_EXPIRED'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET'
  | 'OTP_REQUESTED'
  | 'OTP_VERIFIED'
  | '2FA_ENABLED'
  | '2FA_DISABLED'
  | 'SESSION_REVOKED'
  | 'IMPERSONATION_STARTED'
  | 'IMPERSONATION_ENDED'
  // CRUD
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'BATCH_CREATE'
  | 'BATCH_UPDATE'
  | 'BATCH_DELETE'
  // Security
  | 'UNAUTHORIZED_ACCESS'
  | 'FORBIDDEN_ACCESS'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'SUSPICIOUS_LOGIN'
  | 'RATE_LIMIT'
  | 'SESSION_ANOMALY'
  | 'PERMISSION_DENIED'
  | 'MASS_ACTION_DETECTED'
  | 'IMPOSSIBLE_TRAVEL_DETECTED'
  | 'SECURITY_ALERT_TRIGGERED'
  // Export
  | 'EXPORT_PDF'
  | 'EXPORT_EXCEL'
  | 'EXPORT_CSV'
  | 'REPORT_DOWNLOAD'
  // Configuration
  | 'CONFIG_UPDATED'
  | 'THRESHOLD_CHANGED'
  | 'ALERT_RULE_MODIFIED'
  | 'GEOFENCE_UPDATED'
  | 'SYSTEM_SETTINGS_CHANGED'
  // Permission & Role
  | 'ROLE_CREATED'
  | 'ROLE_UPDATED'
  | 'ROLE_DELETED'
  | 'PERMISSION_GRANTED'
  | 'PERMISSION_REVOKED'
  | 'USER_ROLE_CHANGED'
  // AI
  | 'AI_REQUEST'
  | 'AI_ANALYSIS'
  | 'AI_TOOL_CALL'
  | 'AI_DECISION'
  | 'AI_AUTOMATION'
  | 'AI_RECOMMENDATION'
  | 'AI_ACTION'
  | 'AI_APPROVAL_REQUESTED'
  | 'AI_APPROVAL_GRANTED'
  | 'AI_APPROVAL_REJECTED'
  // System & Background
  | 'SCHEDULED_JOB'
  | 'BACKGROUND_SYNC'
  | 'GPS_INGESTION_BATCH'
  | 'DOCUMENT_EXPIRY_SCAN'
  | 'NOTIFICATION_DISPATCH'
  | 'DATABASE_CLEANUP'
  | 'RETENTION_PURGE'
  | 'INTEGRATION_SYNC'
  | 'WEBHOOK_RECEIVED'
  | 'WEBHOOK_PROCESSED'
  | 'WEBHOOK_FAILED';

export type SecuritySeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AuditStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'BLOCKED' | 'WARNING';

export interface FieldDiff {
  field: string;
  fieldLabel?: string;
  before: any;
  after: any;
  isSensitive?: boolean;
}

export interface ActorInfo {
  id: string;
  name: string;
  email?: string;
  type: ActorType;
  role: string;
  department?: string;
  branchName?: string;
  avatarUrl?: string;
}

export interface SecurityMetadata {
  ipAddress: string;
  userAgent: string;
  deviceType?: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'BOT' | 'SERVER';
  browser?: string;
  os?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isVpnOrProxy?: boolean;
  riskScore?: number; // 0 - 100
  failureReason?: string;
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  tenantName?: string;
  
  // Actor
  actor: ActorInfo;
  
  // Action
  action: ActionType;
  actionCategory: ActionCategory;
  actionLabel?: string;
  
  // Resource / Target
  module: string;
  entityType: string;
  entityId: string;
  entityName: string;
  
  // Temporal & Result
  timestamp: string; // ISO 8601
  status: AuditStatus;
  severity: SecuritySeverity;
  
  // Context & Tracing
  security: SecurityMetadata;
  sessionId?: string;
  requestId: string;
  correlationId: string;
  source: 'WEB_APP' | 'MOBILE_APP' | 'PUBLIC_API' | 'INTERNAL_WORKER' | 'AI_ENGINE' | 'IOT_GATEWAY';
  
  // Data Diff & Payload
  diff?: FieldDiff[];
  metadata?: Record<string, any>;
  before?: Record<string, any>;
  after?: Record<string, any>;
  reason?: string;
  
  // Cryptographic Immutability Chain
  eventHash: string;
  previousHash: string;
  sequenceNumber: number;
}

export interface AuditStatsSummary {
  totalActivities: number;
  userActivities: number;
  systemActivities: number;
  aiActivities: number;
  securityEvents: number;
  failedActions: number;
  criticalEvents: number;
  
  // Trend percentage compared to previous period
  activityTrendPercent: number;
  securityThreatLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  
  // Distributions
  categoryBreakdown: Record<ActionCategory, number>;
  actorTypeBreakdown: Record<ActorType, number>;
  severityBreakdown: Record<SecuritySeverity, number>;
  hourlyActivity: { hour: string; count: number; failures: number }[];
}

export interface AuditFilter {
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  tenantId?: string;
  actorId?: string;
  actorType?: ActorType | 'ALL';
  actorRole?: string | 'ALL';
  actionCategory?: ActionCategory | 'ALL';
  actionType?: ActionType | 'ALL';
  module?: string | 'ALL';
  entityType?: string | 'ALL';
  entityId?: string;
  status?: AuditStatus | 'ALL';
  severity?: SecuritySeverity | 'ALL';
  source?: string | 'ALL';
  ipAddress?: string;
  requestId?: string;
  correlationId?: string;
  onlyFailures?: boolean;
  onlySecurityAlerts?: boolean;
}

export interface AuditRetentionPolicy {
  id: string;
  tenantId: string;
  retentionDays: 30 | 90 | 180 | 365 | 1095 | number; // 30d, 90d, 180d, 1yr, 3yr, etc.
  autoPurgeEnabled: boolean;
  archiveToColdStorage: boolean;
  immutableLock: boolean; // Cannot delete even by admins until expiration
  lastPurgedAt?: string;
  legalHoldActive: boolean;
}

export interface SecurityAlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: SecuritySeverity;
  triggerType:
    | 'MULTIPLE_LOGIN_FAILURES'
    | 'MASS_DELETE'
    | 'MASS_EXPORT'
    | 'MASS_PERMISSION_CHANGE'
    | 'IMPOSSIBLE_TRAVEL'
    | 'OFF_HOURS_ACCESS'
    | 'UNUSUAL_IP';
  threshold: number;
  timeWindowMinutes: number;
  notifyChannels: ('IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP')[];
}

export interface TraceSpan {
  id: string;
  name: string;
  component: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  durationMs: number;
  timestamp: string;
  metadata?: Record<string, any>;
  children?: TraceSpan[];
}

export interface AuditTraceGraph {
  correlationId: string;
  requestId: string;
  initiator: ActorInfo;
  rootAction: string;
  startedAt: string;
  totalDurationMs: number;
  status: 'SUCCESS' | 'FAILED';
  spans: TraceSpan[];
}

export type AuditViewTab =
  | 'overview'
  | 'activity_logs'
  | 'security_logs'
  | 'data_changes'
  | 'ai_activity'
  | 'export_history'
  | 'system_activity'
  | 'config_changes';

