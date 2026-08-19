/**
 * Fleet Intelligence Smart AI - Notification Orchestrator Pipeline
 * PROMPT 45: Event -> Rule -> Template -> Primary/Fallback Provider -> Delivery -> Audit
 */

import {
  NotificationEventType,
  NotificationPriority,
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
} from '../types/notificationEngineTypes';
import { providerRegistry } from './ProviderRegistry';
import { notificationRuleEngine } from './NotificationRuleEngine';
import { notificationTemplateEngine } from './NotificationTemplateEngine';
import { notificationPreferenceManager } from '../services/notificationPreferenceManager';
import { notificationAnalyticsService } from '../services/notificationAnalyticsService';
import { webhookService } from '../../../services/api/webhookService';

export interface DispatchNotificationEventRequest {
  event: NotificationEventType;
  tenantId: string;
  entityId?: string;
  variables: Record<string, string | number>;
  priority?: NotificationPriority;
  targetUserIds?: string[];
  forceChannels?: NotificationChannel[];
  deepLink?: string;
}

export interface DispatchResult {
  success: boolean;
  eventId: string;
  dispatchedChannels: Array<{
    channel: NotificationChannel;
    provider: string;
    recipient: string;
    success: boolean;
    status: string;
    isFallback: boolean;
    providerMessageId?: string;
    error?: string;
    costEstimated?: number;
  }>;
}

class NotificationOrchestratorService {
  public async dispatchEvent(req: DispatchNotificationEventRequest): Promise<DispatchResult> {
    const eventId = `ev_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
    const results: DispatchResult['dispatchedChannels'] = [];

    // 1. Evaluate Rule Engine
    const matchingRules = notificationRuleEngine.evaluateRules(req.event, req.variables, req.tenantId);
    if (matchingRules.length === 0 && !req.forceChannels) {
      console.log(`[Notification Engine] No matching rules for event ${req.event}`);
      return { success: true, eventId, dispatchedChannels: [] };
    }

    // 2. Cooldown check
    const entityKey = `${req.tenantId}_${req.event}_${req.entityId || 'global'}`;
    const primaryRule = matchingRules[0];
    if (primaryRule && !notificationRuleEngine.checkCooldown(entityKey, primaryRule.cooldownMinutes)) {
      console.log(`[Notification Engine] Cooldown active for ${entityKey}`);
      return { success: true, eventId, dispatchedChannels: [] };
    }

    // 3. Determine Channels
    const channelsToUse = new Set<NotificationChannel>(
      req.forceChannels || (primaryRule ? primaryRule.channels : ['PUSH', 'IN_APP'])
    );

    // 4. Resolve Template
    const template = notificationTemplateEngine.getTemplateByEvent(req.event, 'id');
    const rendered = template
      ? notificationTemplateEngine.render(template, req.variables)
      : {
          title: `Peringatan Sistem: ${req.event}`,
          body: JSON.stringify(req.variables),
        };

    const priority: NotificationPriority = req.priority || (primaryRule?.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH');

    // 5. User Preferences & Quiet Hours check
    const userPref = notificationPreferenceManager.getPreferences('usr-current');
    const isQuiet = notificationRuleEngine.isQuietHoursActive(userPref.quietHours, priority);

    if (isQuiet && !primaryRule?.allowQuietHoursBypass) {
      console.log(`[Notification Engine] Quiet hours active, suppressed non-critical notification.`);
      return { success: true, eventId, dispatchedChannels: [] };
    }

    // 6. Dispatch to each resolved channel via Provider Abstraction
    for (const ch of Array.from(channelsToUse)) {
      // IN_APP is handled locally
      if (ch === 'IN_APP') {
        results.push({
          channel: 'IN_APP',
          provider: 'Internal In-App WebSocket Bus',
          recipient: userPref.userId,
          success: true,
          status: 'DELIVERED',
          isFallback: false,
          costEstimated: 0,
        });
        continue;
      }

      // Determine recipient per channel
      let recipient = '';
      if (ch === 'EMAIL') recipient = userPref.email || 'fleet.admin@company.com';
      else if (ch === 'WHATSAPP') recipient = userPref.phoneNumber || '+6281234567890';
      else if (ch === 'SMS') recipient = userPref.phoneNumber || '+6281234567890';
      else if (ch === 'PUSH') recipient = userPref.registeredDevices[0]?.pushToken || 'fcm_default_token';

      const message: NotificationMessage = {
        id: `notif_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
        tenantId: req.tenantId,
        channel: ch,
        recipient,
        title: rendered.title,
        body: rendered.body,
        htmlBody: rendered.htmlBody,
        priority,
        deepLink: req.deepLink || '/app/dashboard',
        templateId: template?.id,
        templateVariables: req.variables,
        createdAt: new Date().toISOString(),
      };

      // 7. Provider selection (Primary with automatic Fallback on failure)
      const primaryProvider = providerRegistry.getPrimaryProvider(ch);
      let providerResult: NotificationResult | null = null;
      let usedFallback = false;

      if (primaryProvider && primaryProvider.isEnabled) {
        try {
          providerResult = await primaryProvider.send(message);
        } catch (err: any) {
          console.warn(`[Notification Provider] ${primaryProvider.name} failed:`, err);
        }
      }

      // If primary failed or was unavailable, attempt fallback provider
      if (!providerResult || !providerResult.success) {
        const fallbackProvider = providerRegistry.getFallbackProvider(ch);
        if (fallbackProvider && fallbackProvider.isEnabled) {
          usedFallback = true;
          try {
            providerResult = await fallbackProvider.send(message);
          } catch (err: any) {
            console.error(`[Notification Provider] Fallback ${fallbackProvider.name} also failed:`, err);
          }
        }
      }

      const finalStatus = providerResult?.status || 'FAILED';
      const isSuccess = providerResult?.success ?? false;

      // 8. Record delivery log
      notificationAnalyticsService.recordDelivery({
        notificationId: message.id,
        tenantId: req.tenantId,
        eventId,
        eventType: req.event,
        channel: ch,
        provider: providerResult?.providerName || (primaryProvider?.displayName || 'Unknown Provider'),
        recipient,
        recipientName: userPref.userId === 'usr-current' ? 'Ahmad Fauzi (Fleet Manager)' : 'Driver Assigned',
        title: message.title,
        body: message.body,
        status: finalStatus,
        priority,
        providerMessageId: providerResult?.providerMessageId,
        retryCount: usedFallback ? 1 : 0,
        maxRetries: 3,
        sentAt: new Date().toISOString(),
        deliveredAt: isSuccess ? new Date().toISOString() : undefined,
        latencyMs: providerResult?.latencyMs || 50,
        costEstimated: providerResult?.costEstimated || 0,
        deepLink: message.deepLink,
        errorCode: providerResult?.error?.code,
        errorMessage: providerResult?.error?.message,
      });

      // 9. Dispatch Webhook Event for integration
      if (typeof window !== 'undefined') {
        webhookService.dispatchEvent(
          req.tenantId,
          isSuccess ? 'alert.created' : 'gps.device.offline',
          {
            notificationId: message.id,
            channel: ch,
            status: finalStatus,
            recipient,
            event: req.event,
            timestamp: new Date().toISOString(),
          }
        ).catch(() => {});
      }

      results.push({
        channel: ch,
        provider: providerResult?.providerName || 'Provider Failover',
        recipient,
        success: isSuccess,
        status: finalStatus,
        isFallback: usedFallback,
        providerMessageId: providerResult?.providerMessageId,
        error: providerResult?.error?.message,
        costEstimated: providerResult?.costEstimated || 0,
      });
    }

    return {
      success: results.some(r => r.success),
      eventId,
      dispatchedChannels: results,
    };
  }
}

export const notificationOrchestrator = new NotificationOrchestratorService();
