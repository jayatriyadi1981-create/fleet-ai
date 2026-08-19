/**
 * Fleet Intelligence Smart AI - Notification Center & Infrastructure Architecture Types
 * PROMPT 20
 */

export type NotificationType =
  | 'ALERT'
  | 'SYSTEM'
  | 'TRIP'
  | 'ROUTE'
  | 'GEOFENCE'
  | 'DELIVERY'
  | 'MAINTENANCE'
  | 'VEHICLE'
  | 'DRIVER'
  | 'DEVICE'
  | 'FUEL'
  | 'FINANCE'
  | 'SECURITY'
  | 'USER'
  | 'AI_INSIGHT'
  | 'REPORT'
  | 'APPROVAL';

export type NotificationCategory =
  | 'ALERT'
  | 'SYSTEM'
  | 'TRIP'
  | 'GEOFENCE'
  | 'DELIVERY'
  | 'MAINTENANCE'
  | 'FLEET'
  | 'DEVICE'
  | 'FUEL'
  | 'AI'
  | 'REPORT'
  | 'MENTION';

export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'EXPIRED';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type DeliveryChannel = 'IN_APP' | 'PUSH' | 'EMAIL' | 'WHATSAPP' | 'SMS';

export type ChannelDeliveryStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'
  | 'CANCELLED';

export interface Notification {
  id: string;
  tenantId: string;

  type: NotificationType;
  category: NotificationCategory;

  title: string;
  message: string;

  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // From Alert Engine if applicable
  priority: NotificationPriority;

  recipientId: string;
  recipientType: 'USER' | 'ROLE' | 'BRANCH' | 'TENANT';

  entityType?: 'vehicle' | 'driver' | 'device' | 'trip' | 'route' | 'delivery' | 'geofence' | 'alert' | 'maintenance';
  entityId?: string;

  alertId?: string;
  vehicleId?: string;
  driverId?: string;
  deviceId?: string;
  tripId?: string;
  routeId?: string;
  deliveryId?: string;
  geofenceId?: string;

  channels: DeliveryChannel[];
  status: NotificationStatus;

  readAt?: string;
  clickedAt?: string;

  createdAt: string;
  updatedAt: string;

  // Metadata for rendering & deep links
  metadata?: Record<string, any>;
  deepLink?: string;
}

export interface UserDevice {
  id: string;
  userId: string;
  tenantId: string;

  platform: 'WEB' | 'ANDROID' | 'IOS';
  deviceName: string;
  deviceId: string;

  pushToken: string;

  appVersion: string;
  osVersion: string;

  lastActiveAt: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  tenantId: string;

  name: string;
  language: 'id' | 'en';
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';

  templateId: string;
  providerTemplateName: string;

  variables: string[]; // e.g. ["vehicle_plate", "driver_name", "time"]

  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED';
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationPolicy {
  id: string;
  tenantId: string;

  eventType: string; // e.g. "CRITICAL_ALERT", "PANIC_ALERT", "OVERSPEED", "DELIVERY_FAILED"
  priority: NotificationPriority;

  channels: DeliveryChannel[];

  enabled: boolean;

  quietHoursPolicy: 'ALLOW_CRITICAL' | 'ALLOW_HIGH' | 'BLOCK_NORMAL_LOW' | 'BLOCK_ALL';
  escalationPolicy?: string;

  createdAt: string;
  updatedAt: string;
}

export interface NotificationJob {
  id: string;
  notificationId: string;

  channel: DeliveryChannel;

  status: ChannelDeliveryStatus;

  attempts: number;
  maxAttempts: number;

  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;

  lastError?: string;

  providerMessageId?: string;
  idempotencyKey: string;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;

  channel: DeliveryChannel;
  recipient: string; // email, phone, token, or user id

  provider: string; // e.g. "InternalInApp", "WebPushFCM", "SendGridSMTP", "MetaWhatsAppAPI", "TwilioSMS"

  status: ChannelDeliveryStatus;

  attempts: number;

  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;

  providerMessageId?: string;

  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreference {
  userId: string;
  tenantId: string;

  // Channel toggles per priority
  matrix: {
    CRITICAL: Record<DeliveryChannel, boolean>;
    HIGH: Record<DeliveryChannel, boolean>;
    NORMAL: Record<DeliveryChannel, boolean>;
    LOW: Record<DeliveryChannel, boolean>;
  };

  // Category enable toggles
  categoryPreferences: Record<NotificationCategory, boolean>;

  // Quiet Hours
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "06:00"
    bypassForCritical: boolean;
  };

  // Digest mode
  digestFrequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  digestTime?: string;
}

export interface NotificationTemplate {
  id: string;
  tenantId: string;

  name: string;
  category: NotificationCategory;
  channel: DeliveryChannel;
  language: 'id' | 'en';

  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';

  titleTemplate: string;
  bodyTemplate: string;

  variables: string[]; // e.g. ["vehicle.plate", "driver.name", "alert.severity", "location.address"]

  createdAt: string;
  updatedAt: string;
}

export interface ChannelConfig {
  id: string;
  tenantId: string;

  channel: DeliveryChannel;
  providerName: string; // e.g. "Meta WhatsApp API", "Twilio SMS", "SMTP SendGrid", "Web Push FCM"

  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'DEGRADED' | 'ERROR' | 'DISABLED';

  credentials: Record<string, string>; // Masked on frontend

  healthCheckStatus?: 'OK' | 'FAIL';
  lastHealthCheckAt?: string;

  totalSentToday: number;
  totalFailedToday: number;
}

export interface NotificationAnalyticsKPI {
  totalSentToday: number;
  unreadCount: number;
  criticalCount: number;
  deliveredCount: number;
  failedCount: number;
  avgDeliveryTimeMs: number;
  clickThroughRatePct: number;
}
