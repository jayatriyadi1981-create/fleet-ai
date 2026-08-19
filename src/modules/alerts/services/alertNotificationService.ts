/**
 * Fleet Intelligence Smart AI - Alert Notification Service
 * Multi-channel dispatch abstraction (In-App, Push, Email, SMS, WhatsApp, Webhook)
 */

import { ActionChannel, Alert } from '../types';

export interface NotificationLog {
  id: string;
  alertId: string;
  channel: ActionChannel;
  recipient: string;
  message: string;
  status: 'SENT' | 'FAILED';
  sentAt: string;
}

class AlertNotificationService {
  private logs: NotificationLog[] = [];

  public dispatchNotification(alert: Alert, channels: ActionChannel[]): void {
    channels.forEach((channel) => {
      let recipient = 'System In-App Feed';

      if (channel === 'WHATSAPP' || channel === 'SMS') {
        recipient = '+62 812-9900-1122 (Safety Duty Officer)';
      } else if (channel === 'EMAIL') {
        recipient = 'ops-alerts@fleetintelligence.ai';
      } else if (channel === 'PUSH') {
        recipient = 'Mobile Driver & Dispatcher App';
      } else if (channel === 'WEBHOOK') {
        recipient = 'https://api.fleetintelligence.ai/webhooks/alerts';
      }

      const log: NotificationLog = {
        id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
        alertId: alert.id,
        channel,
        recipient,
        message: `[${alert.severity}] ${alert.title}: ${alert.message}`,
        status: 'SENT',
        sentAt: new Date().toISOString(),
      };

      this.logs.unshift(log);
      console.log(`[Notification Engine] Dispatched ${channel} to ${recipient}: ${log.message}`);
    });
  }

  public getLogsForAlert(alertId: string): NotificationLog[] {
    return this.logs.filter((l) => l.alertId === alertId);
  }

  public getAllLogs(): NotificationLog[] {
    return this.logs;
  }
}

export const alertNotificationService = new AlertNotificationService();
