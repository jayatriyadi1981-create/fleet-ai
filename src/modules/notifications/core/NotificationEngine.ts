/**
 * Fleet Intelligence Smart AI - Unified Notification Engine Facade
 * PROMPT 45: Complete Gateway for Email, Push, WhatsApp, SMS & In-App Notification Infrastructure
 */

import {
  NotificationEventType,
  NotificationPriority,
  NotificationChannel,
} from '../types/notificationEngineTypes';
import { notificationOrchestrator } from './NotificationOrchestrator';
import { providerRegistry } from './ProviderRegistry';
import { notificationRuleEngine } from './NotificationRuleEngine';
import { notificationTemplateEngine } from './NotificationTemplateEngine';
import { notificationPreferenceManager } from '../services/notificationPreferenceManager';
import { notificationAnalyticsService } from '../services/notificationAnalyticsService';

class NotificationEngineFacade {
  /**
   * Main Trigger method for telematics events, alerts, trips & AI insights
   */
  public async trigger(
    event: NotificationEventType,
    tenantId: string,
    variables: Record<string, string | number>,
    options?: {
      entityId?: string;
      priority?: NotificationPriority;
      forceChannels?: NotificationChannel[];
      deepLink?: string;
    }
  ) {
    return notificationOrchestrator.dispatchEvent({
      event,
      tenantId,
      entityId: options?.entityId,
      variables,
      priority: options?.priority,
      forceChannels: options?.forceChannels,
      deepLink: options?.deepLink,
    });
  }

  /**
   * Direct test message send
   */
  public async sendTest(
    channel: NotificationChannel,
    recipient: string,
    title: string,
    body: string,
    tenantId: string = 'tenant-indonesia-logistics'
  ) {
    return notificationOrchestrator.dispatchEvent({
      event: 'system.security_alert',
      tenantId,
      variables: {
        companyName: 'PT Nusantara Logistik Express',
        title,
        message: body,
      },
      forceChannels: [channel],
      priority: 'HIGH',
    });
  }

  // Access sub-engines
  public get providers() {
    return providerRegistry;
  }

  public get rules() {
    return notificationRuleEngine;
  }

  public get templates() {
    return notificationTemplateEngine;
  }

  public get preferences() {
    return notificationPreferenceManager;
  }

  public get analytics() {
    return notificationAnalyticsService;
  }
}

export const notificationEngine = new NotificationEngineFacade();
