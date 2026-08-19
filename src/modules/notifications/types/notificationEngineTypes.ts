/**
 * Fleet Intelligence Smart AI - Unified Multi-Provider Notification Engine Types
 * PROMPT 45: Complete Data Models for Channels, Providers, Rules, Templates, Quotas & Audit
 */

export type NotificationChannel = 'EMAIL' | 'PUSH' | 'WHATSAPP' | 'SMS' | 'IN_APP';

export type NotificationPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type ChannelDeliveryStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'
  | 'RETRYING'
  | 'CANCELLED';

export type ProviderHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export type NotificationEventType =
  | 'gps.overspeed'
  | 'gps.idle_excessive'
  | 'gps.offline'
  | 'gps.battery_low'
  | 'gps.tamper_detected'
  | 'geofence.enter'
  | 'geofence.exit'
  | 'route.deviation'
  | 'driver.fatigue_detected'
  | 'driver.harsh_driving'
  | 'fuel.drop_anomaly'
  | 'fuel.refuel_detected'
  | 'maintenance.due_soon'
  | 'maintenance.overdue'
  | 'safety.panic_sos'
  | 'safety.accident_detected'
  | 'trip.dispatched'
  | 'trip.started'
  | 'trip.completed'
  | 'delivery.completed'
  | 'ai.risk_recommendation'
  | 'ai.efficiency_digest'
  | 'document.license_expiring'
  | 'document.kir_stnk_expiring'
  | 'subscription.quota_warning'
  | 'subscription.billing_due'
  | 'system.security_alert'
  | 'system.otp_verification';

export interface NotificationMessage {
  id: string;
  tenantId: string;
  channel: NotificationChannel;
  recipient: string; // Email address, Phone number (E.164), Push Device Token, or User ID
  recipientName?: string;
  recipientRole?: string;
  title: string;
  body: string;
  htmlBody?: string;
  mediaUrl?: string;
  attachments?: Array<{
    filename: string;
    url: string;
    contentType: string;
    sizeBytes?: number;
  }>;
  templateId?: string;
  templateVariables?: Record<string, string | number>;
  priority: NotificationPriority;
  deepLink?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
  category?: string;
  senderId?: string;
  createdAt: string;
}

export interface NotificationResult {
  success: boolean;
  providerMessageId?: string;
  providerName: string;
  channel: NotificationChannel;
  status: ChannelDeliveryStatus;
  latencyMs: number;
  error?: {
    code: string;
    message: string;
    isPermanent?: boolean;
    retryable?: boolean;
  };
  costEstimated?: number; // In IDR or USD
  deliveredAt?: string;
  rawResponse?: any;
}

export interface NotificationProviderConfig {
  id: string;
  channel: NotificationChannel;
  providerName: string;
  displayName: string;
  description: string;
  isPrimary: boolean;
  isFallback: boolean;
  isEnabled: boolean;
  healthStatus: ProviderHealthStatus;
  successRate: number;
  avgLatencyMs: number;
  lastTestedAt?: string;
  lastError?: string;
  credentialsMasked: Record<string, string>; // Masked for UI security
  configOptions: Record<string, any>;
  supportedFeatures: {
    templates?: boolean;
    attachments?: boolean;
    html?: boolean;
    deliveryReceipts?: boolean;
    mediaMessages?: boolean;
    bulkSend?: boolean;
  };
}

export interface NotificationTemplate {
  id: string;
  tenantId: string; // 'global' or tenant ID
  name: string;
  event: NotificationEventType;
  channels: NotificationChannel[];
  language: 'id' | 'en';
  category: 'ALERT' | 'TRIP' | 'MAINTENANCE' | 'FUEL' | 'SAFETY' | 'BILLING' | 'SECURITY' | 'AI';
  titleTemplate: string;
  bodyTemplate: string;
  htmlTemplate?: string;
  whatsAppTemplateName?: string;
  variables: string[]; // e.g. ['driverName', 'vehiclePlate', 'speed', 'timestamp', 'location']
  version: number;
  isActive: boolean;
  updatedAt: string;
}

export interface NotificationRule {
  id: string;
  tenantId: string;
  name: string;
  event: NotificationEventType;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  channels: NotificationChannel[];
  recipientRoles: string[]; // e.g. ['fleet_manager', 'dispatcher', 'safety_officer']
  conditions: Array<{
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
    value: any;
  }>;
  cooldownMinutes: number; // Deduplication & throttling window
  allowQuietHoursBypass: boolean;
  escalationPolicy?: {
    enabled: boolean;
    timeoutMinutes: number;
    escalateToRole: string;
    channels: NotificationChannel[];
  };
  templateId?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserNotificationPreference {
  userId: string;
  tenantId: string;
  quietHours: {
    enabled: boolean;
    startTime: string; // e.g. "22:00"
    endTime: string; // e.g. "06:00"
    allowCriticalBypass: boolean;
  };
  eventPreferences: Record<
    NotificationEventType,
    {
      email: boolean;
      push: boolean;
      whatsapp: boolean;
      sms: boolean;
      inApp: boolean;
    }
  >;
  registeredDevices: Array<{
    deviceId: string;
    platform: 'android' | 'ios' | 'web';
    deviceName: string;
    pushToken: string;
    lastActive: string;
    isActive: boolean;
  }>;
  phoneNumber?: string;
  email?: string;
}

export interface NotificationDeliveryLog {
  id: string;
  tenantId: string;
  notificationId: string;
  eventId?: string;
  eventType: NotificationEventType;
  channel: NotificationChannel;
  provider: string;
  recipient: string;
  recipientName?: string;
  title: string;
  body: string;
  status: ChannelDeliveryStatus;
  priority: NotificationPriority;
  providerMessageId?: string;
  retryCount: number;
  maxRetries: number;
  sentAt: string;
  deliveredAt?: string;
  failedAt?: string;
  readAt?: string;
  errorCode?: string;
  errorMessage?: string;
  latencyMs: number;
  costEstimated?: number;
  deepLink?: string;
}

export interface NotificationAuditLog {
  id: string;
  tenantId: string;
  actor: string;
  action:
    | 'PROVIDER_CONFIG_UPDATED'
    | 'PROVIDER_ROTATED'
    | 'PROVIDER_TESTED'
    | 'RULE_CREATED'
    | 'RULE_UPDATED'
    | 'RULE_DELETED'
    | 'TEMPLATE_UPDATED'
    | 'PREFERENCE_UPDATED'
    | 'EMERGENCY_BROADCAST_SENT'
    | 'TEST_NOTIFICATION_SENT';
  details: Record<string, any>;
  timestamp: string;
}

export interface NotificationChannelAnalytics {
  channel: NotificationChannel;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRatePercent: number;
  avgLatencyMs: number;
  estimatedCostTotal: number;
  statusBreakdown: Record<ChannelDeliveryStatus, number>;
}

export interface NotificationAnalyticsSummary {
  period: string;
  totalNotifications: number;
  overallDeliveryRate: number;
  totalFailed: number;
  totalEstimatedCost: number;
  queueDepth: number;
  channels: Record<NotificationChannel, NotificationChannelAnalytics>;
  topEvents: Array<{ event: NotificationEventType; count: number; deliveryRate: number }>;
  providerHealthSummary: Array<{
    name: string;
    channel: NotificationChannel;
    status: ProviderHealthStatus;
    latency: number;
    successRate: number;
  }>;
}
