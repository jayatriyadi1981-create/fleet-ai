/**
 * Fleet Intelligence Smart AI - Notification Audit Trail Service
 */

export interface NotificationAuditEvent {
  id: string;
  tenantId: string;
  userId: string;
  action:
    | 'NOTIFICATION_CREATED'
    | 'NOTIFICATION_READ'
    | 'NOTIFICATION_ARCHIVED'
    | 'NOTIFICATION_DELETED'
    | 'TEMPLATE_CREATED'
    | 'TEMPLATE_UPDATED'
    | 'CHANNEL_CONFIGURED'
    | 'JOB_RETRY';
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export class NotificationAuditService {
  private auditLogs: NotificationAuditEvent[] = [];

  logEvent(event: Omit<NotificationAuditEvent, 'id' | 'timestamp'>): NotificationAuditEvent {
    const newEntry: NotificationAuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newEntry);
    return newEntry;
  }

  getAuditLogs(tenantId: string): NotificationAuditEvent[] {
    return this.auditLogs.filter((a) => a.tenantId === tenantId);
  }
}

export const notificationAuditService = new NotificationAuditService();
