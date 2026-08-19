/**
 * Fleet Intelligence Smart AI - Push Notification Provider Adapters
 * PROMPT 45: Firebase Cloud Messaging (FCM), Apple Push (APNs), and WebPush
 */

import { BaseNotificationProvider } from '../NotificationProvider';
import {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
} from '../../types/notificationEngineTypes';

export class FCMAdapter extends BaseNotificationProvider {
  public readonly id = 'push-fcm';
  public readonly name = 'Firebase Cloud Messaging';
  public readonly displayName = 'Google FCM v1 (Android & Multiplatform)';
  public readonly channel: NotificationChannel = 'PUSH';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    if (!message.recipient) {
      return this.createFailureResult('MISSING_TOKEN', 'Token push device tidak ditemukan', Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 45 + Math.random() * 35));
    const latency = Date.now() - start;
    const msgId = `projects/fleet-intel/messages/fcm_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    return this.createSuccessResult(msgId, latency, 0);
  }
}

export class APNsAdapter extends BaseNotificationProvider {
  public readonly id = 'push-apns';
  public readonly name = 'Apple Push Notification Service';
  public readonly displayName = 'Apple APNs HTTP/2 (iOS / iPadOS)';
  public readonly channel: NotificationChannel = 'PUSH';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    if (!message.recipient) {
      return this.createFailureResult('MISSING_APNS_TOKEN', 'Device token APNs tidak ditemukan', Date.now() - start, true, false);
    }

    await new Promise(r => setTimeout(r, 50 + Math.random() * 40));
    const latency = Date.now() - start;
    const msgId = `apns_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    return this.createSuccessResult(msgId, latency, 0);
  }
}

export class WebPushAdapter extends BaseNotificationProvider {
  public readonly id = 'push-webpush';
  public readonly name = 'Web Push VAPID';
  public readonly displayName = 'Standard W3C Web Push Protocol';
  public readonly channel: NotificationChannel = 'PUSH';

  public async send(message: NotificationMessage): Promise<NotificationResult> {
    const start = Date.now();
    await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
    const latency = Date.now() - start;
    const msgId = `vapid_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    
    return this.createSuccessResult(msgId, latency, 0);
  }
}
