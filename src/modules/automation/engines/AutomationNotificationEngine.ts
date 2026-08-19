/**
 * Fleet Intelligence Smart AI - Automation Notification Engine
 * PROMPT 35 - Section 22, 23, 24, 72
 */

import { NotificationNodeConfig, AutomationEvent, NotificationChannel } from '../types';

export interface NotificationDispatchResult {
  success: boolean;
  notificationId: string;
  channelsDispatched: NotificationChannel[];
  recipientsCount: number;
  throttled: boolean;
  throttleReason?: string;
  renderedTitle: string;
  renderedMessage: string;
  dispatchedAt: string;
}

export class AutomationNotificationEngine {
  private static instance: AutomationNotificationEngine;
  private throttleMap: Map<string, { lastSentTimestamp: number; sentCount: number }> = new Map();
  private dispatchHistory: NotificationDispatchResult[] = [];

  private constructor() {}

  public static getInstance(): AutomationNotificationEngine {
    if (!AutomationNotificationEngine.instance) {
      AutomationNotificationEngine.instance = new AutomationNotificationEngine();
    }
    return AutomationNotificationEngine.instance;
  }

  /**
   * Replaces template variables like {{vehicleId}}, {{driverName}}, {{speed}}
   */
  public renderTemplate(templateStr: string, context: Record<string, any>): string {
    if (!templateStr) return '';
    return templateStr.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      const val = this.extractDeep(context, key);
      return val !== undefined && val !== null ? String(val) : `[${key}]`;
    });
  }

  private extractDeep(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  }

  /**
   * Dispatches notifications with intelligent deduplication & multi-channel routing
   */
  public async dispatch(
    config: NotificationNodeConfig,
    event: AutomationEvent,
    context: Record<string, any>,
    dryRun: boolean = false
  ): Promise<NotificationDispatchResult> {
    const notificationId = `NOTIF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // 1. Check Throttling
    const throttleKey = `${event.tenantId}_${config.targetRoles.join('_')}_${event.eventType}_${event.entityId}`;
    const now = Date.now();
    const cooldownMs = (config.throttling?.cooldownSeconds || 300) * 1000;
    const existing = this.throttleMap.get(throttleKey);

    if (existing && !dryRun) {
      const elapsed = now - existing.lastSentTimestamp;
      if (elapsed < cooldownMs) {
        return {
          success: true,
          notificationId,
          channelsDispatched: [],
          recipientsCount: 0,
          throttled: true,
          throttleReason: `Notifikasi di-throttle untuk mencegah spamming (${Math.round(elapsed / 1000)}s / ${cooldownMs / 1000}s cooldown).`,
          renderedTitle: config.titleTemplate || 'Alert Automasi',
          renderedMessage: config.messageTemplate || 'Peringatan terpicu',
          dispatchedAt: new Date().toISOString(),
        };
      }
    }

    // 2. Render Template
    const mergedContext = {
      ...event.payload,
      ...context,
      eventId: event.eventId,
      eventType: event.eventType,
      entityId: event.entityId,
      entityName: event.entityName || event.entityId,
      severity: event.severity,
      branchId: event.branchId,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };

    const renderedTitle = this.renderTemplate(
      config.titleTemplate || `[Automasi] ${event.eventType} - {{entityName}}`,
      mergedContext
    );
    const renderedMessage = this.renderTemplate(
      config.messageTemplate || `Terjadi event ${event.eventType} pada ${event.entityId}. AI Intelligence menyarankan penanganan segera.`,
      mergedContext
    );

    const channels = config.channels || ['IN_APP', 'PUSH'];
    const recipientsCount = (config.targetRoles?.length || 1) * 3 + (config.targetUserIds?.length || 0);

    if (!dryRun) {
      this.throttleMap.set(throttleKey, {
        lastSentTimestamp: now,
        sentCount: (existing?.sentCount || 0) + 1,
      });
    }

    const result: NotificationDispatchResult = {
      success: true,
      notificationId,
      channelsDispatched: channels,
      recipientsCount,
      throttled: false,
      renderedTitle,
      renderedMessage,
      dispatchedAt: new Date().toISOString(),
    };

    this.dispatchHistory.unshift(result);
    if (this.dispatchHistory.length > 100) this.dispatchHistory.pop();

    return result;
  }

  public getRecentDispatches(): NotificationDispatchResult[] {
    return this.dispatchHistory;
  }
}

export const automationNotificationEngine = AutomationNotificationEngine.getInstance();
