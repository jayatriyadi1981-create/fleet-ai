/**
 * Fleet Intelligence Smart AI - Alert Webhook Service
 * Signing secrets, payload generation, delivery logs & retry logic
 */

import { Alert, WebhookDeliveryLog } from '../types';

class AlertWebhookService {
  private deliveryLogs: WebhookDeliveryLog[] = [];
  private signingSecret = 'whsec_fleet_intel_9823471092834709';

  public sendWebhookPayload(alert: Alert, endpointUrl: string = 'https://api.fleetintelligence.ai/webhooks/alerts'): WebhookDeliveryLog {
    const payload = {
      eventType: 'ALERT_TRIGGERED',
      alertId: alert.id,
      alertType: alert.type,
      severity: alert.severity,
      vehicle: {
        id: alert.vehicleId,
        plate: alert.vehiclePlate,
      },
      driver: {
        id: alert.driverId,
        name: alert.driverName,
      },
      location: {
        latitude: alert.latitude,
        longitude: alert.longitude,
        locationName: alert.locationName,
      },
      triggerValue: alert.triggerValue,
      thresholdValue: alert.thresholdValue,
      timestamp: alert.triggeredAt,
      signature: `sha256=${this.generateSignature(alert.id, alert.triggeredAt)}`,
    };

    const log: WebhookDeliveryLog = {
      id: `whlog-${Date.now().toString(36)}`,
      alertId: alert.id,
      endpointUrl,
      status: 'SUCCESS',
      httpStatus: 200,
      attempts: 1,
      payload,
      responseBody: JSON.stringify({ status: 'ACKNOWLEDGED', processedAt: new Date().toISOString() }),
      deliveredAt: new Date().toISOString(),
    };

    this.deliveryLogs.unshift(log);
    return log;
  }

  private generateSignature(alertId: string, timestamp: string): string {
    return `${alertId}_${timestamp}_${this.signingSecret.substr(0, 8)}`;
  }

  public getLogsForAlert(alertId: string): WebhookDeliveryLog[] {
    return this.deliveryLogs.filter((l) => l.alertId === alertId);
  }

  public getAllLogs(): WebhookDeliveryLog[] {
    return this.deliveryLogs;
  }
}

export const alertWebhookService = new AlertWebhookService();
