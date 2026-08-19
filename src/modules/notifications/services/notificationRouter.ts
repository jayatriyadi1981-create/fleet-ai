/**
 * Fleet Intelligence Smart AI - Notification Router Service
 * Evaluates priority, channel policy, quiet hours, & recipient matrix
 */

import { Notification, DeliveryChannel, NotificationPolicy } from '../types';
import { notificationPreferenceService } from './notificationPreferenceService';

export class NotificationRouter {
  private tenantPolicies: NotificationPolicy[] = [
    {
      id: 'pol-01',
      tenantId: 'tenant-indonesia-logistics',
      eventType: 'CRITICAL_ALERT',
      priority: 'CRITICAL',
      channels: ['IN_APP', 'PUSH', 'EMAIL', 'WHATSAPP', 'SMS'],
      enabled: true,
      quietHoursPolicy: 'ALLOW_CRITICAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pol-02',
      tenantId: 'tenant-indonesia-logistics',
      eventType: 'HIGH_ALERT',
      priority: 'HIGH',
      channels: ['IN_APP', 'PUSH', 'EMAIL', 'WHATSAPP'],
      enabled: true,
      quietHoursPolicy: 'ALLOW_HIGH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pol-03',
      tenantId: 'tenant-indonesia-logistics',
      eventType: 'NORMAL_TRIP',
      priority: 'NORMAL',
      channels: ['IN_APP', 'PUSH'],
      enabled: true,
      quietHoursPolicy: 'BLOCK_NORMAL_LOW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pol-04',
      tenantId: 'tenant-indonesia-logistics',
      eventType: 'LOW_SYSTEM',
      priority: 'LOW',
      channels: ['IN_APP'],
      enabled: true,
      quietHoursPolicy: 'BLOCK_NORMAL_LOW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  /**
   * Resolves active channels for a notification recipient considering user prefs & quiet hours
   */
  routeNotification(notification: Notification, recipientUserId: string): DeliveryChannel[] {
    const pref = notificationPreferenceService.getPreference(recipientUserId);

    // 1. Check Category preference
    if (pref.categoryPreferences[notification.category] === false) {
      console.log(`[Router] Category ${notification.category} disabled for user ${recipientUserId}`);
      return [];
    }

    // 2. Default priority channels matrix from user preference
    const matrixChannels = pref.matrix[notification.priority];
    let selectedChannels: DeliveryChannel[] = [];

    (Object.keys(matrixChannels) as DeliveryChannel[]).forEach((ch) => {
      if (matrixChannels[ch]) {
        selectedChannels.push(ch);
      }
    });

    // Always keep IN_APP
    if (!selectedChannels.includes('IN_APP')) {
      selectedChannels.push('IN_APP');
    }

    // 3. Quiet Hours Check
    const isQuiet = notificationPreferenceService.isQuietHoursActive(recipientUserId, notification.priority);
    if (isQuiet) {
      console.log(`[Router] Quiet hours active for ${recipientUserId}. Suppressing external channels.`);
      // Restrict external channels during quiet hours unless critical bypass
      selectedChannels = selectedChannels.filter((ch) => ch === 'IN_APP');
    }

    return selectedChannels;
  }

  getTenantPolicies(tenantId: string): NotificationPolicy[] {
    return this.tenantPolicies.filter((p) => p.tenantId === tenantId);
  }
}

export const notificationRouter = new NotificationRouter();
