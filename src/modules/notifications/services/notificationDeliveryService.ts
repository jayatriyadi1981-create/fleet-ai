/**
 * Fleet Intelligence Smart AI - Notification Delivery & Channel Status Tracking Service
 */

import { NotificationDelivery, ChannelConfig, DeliveryChannel } from '../types';

export class NotificationDeliveryService {
  private deliveryLogs: NotificationDelivery[] = [
    {
      id: 'deliv-01',
      notificationId: 'notif-101',
      channel: 'IN_APP',
      recipient: 'usr-001',
      provider: 'InAppRealtimeProvider',
      status: 'READ',
      attempts: 1,
      sentAt: new Date(Date.now() - 300000).toISOString(),
      deliveredAt: new Date(Date.now() - 290000).toISOString(),
      providerMessageId: 'msg-inapp-991',
    },
    {
      id: 'deliv-02',
      notificationId: 'notif-101',
      channel: 'PUSH',
      recipient: 'fcm-token-web-00192837465',
      provider: 'WebPushFCMAdapter',
      status: 'DELIVERED',
      attempts: 1,
      sentAt: new Date(Date.now() - 300000).toISOString(),
      deliveredAt: new Date(Date.now() - 280000).toISOString(),
      providerMessageId: 'msg-fcm-8812039',
    },
    {
      id: 'deliv-03',
      notificationId: 'notif-101',
      channel: 'WHATSAPP',
      recipient: '+6281234567890',
      provider: 'MetaWhatsAppBusinessAPI',
      status: 'DELIVERED',
      attempts: 1,
      sentAt: new Date(Date.now() - 300000).toISOString(),
      deliveredAt: new Date(Date.now() - 270000).toISOString(),
      providerMessageId: 'wamid.HBgLMTIzNDU2Nzg5M0A',
    },
    {
      id: 'deliv-04',
      notificationId: 'notif-101',
      channel: 'EMAIL',
      recipient: 'jayatriyadi1981@gmail.com',
      provider: 'SendGridSMTPAdapter',
      status: 'SENT',
      attempts: 1,
      sentAt: new Date(Date.now() - 300000).toISOString(),
      providerMessageId: 'sg-msg-1928374',
    },
    {
      id: 'deliv-05',
      notificationId: 'notif-102',
      channel: 'SMS',
      recipient: '+6281298765432',
      provider: 'TwilioSMSProvider',
      status: 'FAILED',
      attempts: 3,
      sentAt: new Date(Date.now() - 600000).toISOString(),
      failedAt: new Date(Date.now() - 590000).toISOString(),
      errorCode: 'CARRIER_TIMEOUT',
      errorMessage: 'Gateway timeout waiting for network ACK',
    },
  ];

  private channelConfigs: ChannelConfig[] = [
    {
      id: 'cfg-01',
      tenantId: 'tenant-indonesia-logistics',
      channel: 'IN_APP',
      providerName: 'In-App WebSockets Realtime',
      status: 'CONNECTED',
      credentials: { endpoint: 'wss://realtime.fleet-intel.id/ws' },
      healthCheckStatus: 'OK',
      lastHealthCheckAt: new Date().toISOString(),
      totalSentToday: 1420,
      totalFailedToday: 0,
    },
    {
      id: 'cfg-02',
      tenantId: 'tenant-indonesia-logistics',
      channel: 'PUSH',
      providerName: 'Google Firebase Cloud Messaging (FCM)',
      status: 'CONNECTED',
      credentials: { serviceAccount: '••••••••fcm-key.json' },
      healthCheckStatus: 'OK',
      lastHealthCheckAt: new Date().toISOString(),
      totalSentToday: 890,
      totalFailedToday: 2,
    },
    {
      id: 'cfg-03',
      tenantId: 'tenant-indonesia-logistics',
      channel: 'EMAIL',
      providerName: 'SendGrid Transactional SMTP',
      status: 'CONNECTED',
      credentials: { apiKey: 'SG.••••••••••••••••••••••••' },
      healthCheckStatus: 'OK',
      lastHealthCheckAt: new Date().toISOString(),
      totalSentToday: 310,
      totalFailedToday: 1,
    },
    {
      id: 'cfg-04',
      tenantId: 'tenant-indonesia-logistics',
      channel: 'WHATSAPP',
      providerName: 'Meta WhatsApp Business Cloud API',
      status: 'CONNECTED',
      credentials: { phoneAccountId: '109823746501', accessToken: 'EAAG••••••••••••' },
      healthCheckStatus: 'OK',
      lastHealthCheckAt: new Date().toISOString(),
      totalSentToday: 420,
      totalFailedToday: 5,
    },
    {
      id: 'cfg-05',
      tenantId: 'tenant-indonesia-logistics',
      channel: 'SMS',
      providerName: 'Twilio SMS Gateway',
      status: 'CONNECTED',
      credentials: { accountSid: 'AC••••••••••••', authToken: '••••••••••••' },
      healthCheckStatus: 'OK',
      lastHealthCheckAt: new Date().toISOString(),
      totalSentToday: 85,
      totalFailedToday: 3,
    },
  ];

  getDeliveryLogs(): NotificationDelivery[] {
    return this.deliveryLogs;
  }

  getChannelConfigs(): ChannelConfig[] {
    return this.channelConfigs;
  }

  logDelivery(delivery: Omit<NotificationDelivery, 'id'>): NotificationDelivery {
    const newEntry: NotificationDelivery = {
      ...delivery,
      id: `deliv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    this.deliveryLogs.unshift(newEntry);
    return newEntry;
  }

  updateChannelStatus(channel: DeliveryChannel, status: ChannelConfig['status'], credentials?: Record<string, string>): void {
    const cfg = this.channelConfigs.find((c) => c.channel === channel);
    if (cfg) {
      cfg.status = status;
      if (credentials) {
        cfg.credentials = { ...cfg.credentials, ...credentials };
      }
      cfg.lastHealthCheckAt = new Date().toISOString();
    }
  }
}

export const notificationDeliveryService = new NotificationDeliveryService();
