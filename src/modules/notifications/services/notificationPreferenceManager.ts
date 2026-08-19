/**
 * Fleet Intelligence Smart AI - User Notification Preferences & Device Token Registry
 * PROMPT 45: Multi-Channel Matrix, Quiet Hours, and Multi-Device Push Tokens
 */

import {
  UserNotificationPreference,
  NotificationEventType,
} from '../types/notificationEngineTypes';

const DEFAULT_PREFERENCES: UserNotificationPreference = {
  userId: 'usr-current',
  tenantId: 'tenant-indonesia-logistics',
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '06:00',
    allowCriticalBypass: true,
  },
  eventPreferences: {
    'gps.overspeed': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'gps.idle_excessive': { email: false, push: true, whatsapp: false, sms: false, inApp: true },
    'gps.offline': { email: true, push: true, whatsapp: false, sms: false, inApp: true },
    'gps.battery_low': { email: false, push: true, whatsapp: false, sms: false, inApp: true },
    'gps.tamper_detected': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'geofence.enter': { email: false, push: true, whatsapp: false, sms: false, inApp: true },
    'geofence.exit': { email: false, push: true, whatsapp: false, sms: false, inApp: true },
    'route.deviation': { email: false, push: true, whatsapp: true, sms: false, inApp: true },
    'driver.fatigue_detected': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'driver.harsh_driving': { email: false, push: true, whatsapp: false, sms: false, inApp: true },
    'fuel.drop_anomaly': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'fuel.refuel_detected': { email: false, push: true, whatsapp: false, sms: false, inApp: true },
    'maintenance.due_soon': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'maintenance.overdue': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'safety.panic_sos': { email: true, push: true, whatsapp: true, sms: true, inApp: true },
    'safety.accident_detected': { email: true, push: true, whatsapp: true, sms: true, inApp: true },
    'trip.dispatched': { email: false, push: true, whatsapp: true, sms: false, inApp: true },
    'trip.started': { email: false, push: true, whatsapp: false, sms: false, inApp: true },
    'trip.completed': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'delivery.completed': { email: false, push: true, whatsapp: true, sms: false, inApp: true },
    'ai.risk_recommendation': { email: true, push: true, whatsapp: false, sms: false, inApp: true },
    'ai.efficiency_digest': { email: true, push: false, whatsapp: true, sms: false, inApp: true },
    'document.license_expiring': { email: true, push: true, whatsapp: false, sms: false, inApp: true },
    'document.kir_stnk_expiring': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'subscription.quota_warning': { email: true, push: true, whatsapp: false, sms: false, inApp: true },
    'subscription.billing_due': { email: true, push: true, whatsapp: true, sms: false, inApp: true },
    'system.security_alert': { email: true, push: true, whatsapp: true, sms: true, inApp: true },
    'system.otp_verification': { email: false, push: false, whatsapp: true, sms: true, inApp: false },
  },
  registeredDevices: [
    {
      deviceId: 'dev_pixel_01',
      platform: 'android',
      deviceName: 'Google Pixel 8 Pro (Operations Manager)',
      pushToken: 'fcm_token_and_88291039485761',
      lastActive: new Date().toISOString(),
      isActive: true,
    },
    {
      deviceId: 'dev_iphone_02',
      platform: 'ios',
      deviceName: 'iPhone 15 Pro Max (Field Director)',
      pushToken: 'apns_token_ios_99281726354412',
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      isActive: true,
    },
    {
      deviceId: 'dev_chrome_03',
      platform: 'web',
      deviceName: 'Chrome on macOS (Command Center Workstation)',
      pushToken: 'vapid_endpoint_web_77192837465',
      lastActive: new Date().toISOString(),
      isActive: true,
    },
  ],
  phoneNumber: '+6281234567890',
  email: 'jayatriyadi1981@gmail.com',
};

class NotificationPreferenceManagerService {
  private preferences: Map<string, UserNotificationPreference> = new Map();

  constructor() {
    this.preferences.set(DEFAULT_PREFERENCES.userId, DEFAULT_PREFERENCES);
  }

  public getPreferences(userId: string = 'usr-current'): UserNotificationPreference {
    return this.preferences.get(userId) || DEFAULT_PREFERENCES;
  }

  public updatePreferences(
    userId: string = 'usr-current',
    updated: Partial<UserNotificationPreference>
  ): UserNotificationPreference {
    const existing = this.getPreferences(userId);
    const merged = { ...existing, ...updated };
    this.preferences.set(userId, merged);
    return merged;
  }

  public toggleEventChannel(
    userId: string,
    event: NotificationEventType,
    channel: 'email' | 'push' | 'whatsapp' | 'sms' | 'inApp',
    enabled: boolean
  ): UserNotificationPreference {
    const pref = this.getPreferences(userId);
    if (!pref.eventPreferences[event]) {
      pref.eventPreferences[event] = { email: false, push: false, whatsapp: false, sms: false, inApp: true };
    }
    pref.eventPreferences[event][channel] = enabled;
    this.preferences.set(userId, { ...pref });
    return pref;
  }

  public addDevice(
    userId: string,
    device: { platform: 'android' | 'ios' | 'web'; deviceName: string; pushToken: string }
  ) {
    const pref = this.getPreferences(userId);
    const newDevice = {
      deviceId: `dev_${Date.now().toString(36)}`,
      platform: device.platform,
      deviceName: device.deviceName,
      pushToken: device.pushToken,
      lastActive: new Date().toISOString(),
      isActive: true,
    };
    pref.registeredDevices.push(newDevice);
    this.preferences.set(userId, { ...pref });
    return newDevice;
  }

  public removeDevice(userId: string, deviceId: string) {
    const pref = this.getPreferences(userId);
    pref.registeredDevices = pref.registeredDevices.filter(d => d.deviceId !== deviceId);
    this.preferences.set(userId, { ...pref });
  }
}

export const notificationPreferenceManager = new NotificationPreferenceManagerService();
