/**
 * Fleet Intelligence Smart AI - Notification Preference & Quiet Hours Service
 */

import { NotificationPreference, UserDevice, NotificationPriority, DeliveryChannel, NotificationCategory } from '../types';

export class NotificationPreferenceService {
  private userPreferences: Record<string, NotificationPreference> = {
    'usr-001': {
      userId: 'usr-001',
      tenantId: 'tenant-indonesia-logistics',
      matrix: {
        CRITICAL: { IN_APP: true, PUSH: true, EMAIL: true, WHATSAPP: true, SMS: true },
        HIGH: { IN_APP: true, PUSH: true, EMAIL: true, WHATSAPP: true, SMS: false },
        NORMAL: { IN_APP: true, PUSH: true, EMAIL: false, WHATSAPP: false, SMS: false },
        LOW: { IN_APP: true, PUSH: false, EMAIL: false, WHATSAPP: false, SMS: false },
      },
      categoryPreferences: {
        ALERT: true,
        SYSTEM: true,
        TRIP: true,
        GEOFENCE: true,
        DELIVERY: true,
        MAINTENANCE: true,
        FLEET: true,
        DEVICE: true,
        FUEL: true,
        AI: true,
        REPORT: true,
        MENTION: true,
      },
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '06:00',
        bypassForCritical: true,
      },
      digestFrequency: 'IMMEDIATE',
    },
  };

  private userDevices: UserDevice[] = [
    {
      id: 'dev-01',
      userId: 'usr-001',
      tenantId: 'tenant-indonesia-logistics',
      platform: 'WEB',
      deviceName: 'Chrome Workstation (MacBook Pro)',
      deviceId: 'web-chrome-mac-9901',
      pushToken: 'fcm-token-web-00192837465',
      appVersion: 'v2.4.0',
      osVersion: 'macOS 14.5',
      lastActiveAt: new Date().toISOString(),
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dev-02',
      userId: 'usr-001',
      tenantId: 'tenant-indonesia-logistics',
      platform: 'ANDROID',
      deviceName: 'Samsung Galaxy S24 Ultra',
      deviceId: 'android-s24-9902',
      pushToken: 'fcm-token-android-9988776655',
      appVersion: 'v2.4.0',
      osVersion: 'Android 14',
      lastActiveAt: new Date().toISOString(),
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  getPreference(userId: string): NotificationPreference {
    if (!this.userPreferences[userId]) {
      // Default fallback
      this.userPreferences[userId] = {
        userId,
        tenantId: 'tenant-indonesia-logistics',
        matrix: {
          CRITICAL: { IN_APP: true, PUSH: true, EMAIL: true, WHATSAPP: true, SMS: true },
          HIGH: { IN_APP: true, PUSH: true, EMAIL: true, WHATSAPP: true, SMS: false },
          NORMAL: { IN_APP: true, PUSH: true, EMAIL: false, WHATSAPP: false, SMS: false },
          LOW: { IN_APP: true, PUSH: false, EMAIL: false, WHATSAPP: false, SMS: false },
        },
        categoryPreferences: {
          ALERT: true,
          SYSTEM: true,
          TRIP: true,
          GEOFENCE: true,
          DELIVERY: true,
          MAINTENANCE: true,
          FLEET: true,
          DEVICE: true,
          FUEL: true,
          AI: true,
          REPORT: true,
          MENTION: true,
        },
        quietHours: {
          enabled: false,
          startTime: '22:00',
          endTime: '06:00',
          bypassForCritical: true,
        },
        digestFrequency: 'IMMEDIATE',
      };
    }
    return this.userPreferences[userId];
  }

  updatePreference(userId: string, partial: Partial<NotificationPreference>): NotificationPreference {
    const current = this.getPreference(userId);
    const updated = { ...current, ...partial };
    this.userPreferences[userId] = updated;
    return updated;
  }

  getUserDevices(userId: string): UserDevice[] {
    return this.userDevices.filter((d) => d.userId === userId);
  }

  toggleDevice(deviceId: string, enabled: boolean): void {
    const dev = this.userDevices.find((d) => d.id === deviceId);
    if (dev) {
      dev.enabled = enabled;
      dev.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Checks if current time falls into quiet hours, and if bypass is active
   */
  isQuietHoursActive(userId: string, priority: NotificationPriority): boolean {
    const pref = this.getPreference(userId);
    if (!pref.quietHours.enabled) return false;

    // Bypass for Critical
    if (priority === 'CRITICAL' && pref.quietHours.bypassForCritical) {
      return false;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = pref.quietHours.startTime.split(':').map(Number);
    const [endH, endM] = pref.quietHours.endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // Overnight (e.g. 22:00 to 06:00)
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  }

  /**
   * Disables invalid or unregistered device push token
   */
  disableInvalidDeviceToken(pushToken: string): void {
    const dev = this.userDevices.find((d) => d.pushToken === pushToken);
    if (dev) {
      dev.enabled = false;
      dev.updatedAt = new Date().toISOString();
      console.warn(`[Push Service] Disabled invalid/unregistered push token: ${pushToken}`);
    }
  }
}

export const notificationPreferenceService = new NotificationPreferenceService();
