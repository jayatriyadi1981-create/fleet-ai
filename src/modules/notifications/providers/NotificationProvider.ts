/**
 * Fleet Intelligence Smart AI - Notification Provider Base Interface & Abstract Class
 * PROMPT 45: Provider Abstraction Layer
 */

import {
  NotificationChannel,
  NotificationMessage,
  NotificationResult,
  ChannelDeliveryStatus,
  ProviderHealthStatus,
} from '../types/notificationEngineTypes';

export interface INotificationProvider {
  readonly id: string;
  readonly name: string;
  readonly channel: NotificationChannel;
  readonly displayName: string;
  isPrimary: boolean;
  isFallback: boolean;
  isEnabled: boolean;

  /**
   * Main dispatch method
   */
  send(message: NotificationMessage): Promise<NotificationResult>;

  /**
   * Optional status check for async delivery (webhooks/polling)
   */
  getStatus?(providerMessageId: string): Promise<ChannelDeliveryStatus>;

  /**
   * Validate credentials and connection
   */
  validateConfig(): Promise<boolean>;

  /**
   * Live health check
   */
  getHealth(): Promise<{
    status: ProviderHealthStatus;
    latencyMs: number;
    error?: string;
  }>;
}

export abstract class BaseNotificationProvider implements INotificationProvider {
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly channel: NotificationChannel;
  public abstract readonly displayName: string;
  public isPrimary: boolean = false;
  public isFallback: boolean = false;
  public isEnabled: boolean = true;

  public abstract send(message: NotificationMessage): Promise<NotificationResult>;

  public async validateConfig(): Promise<boolean> {
    return true;
  }

  public async getHealth(): Promise<{
    status: ProviderHealthStatus;
    latencyMs: number;
    error?: string;
  }> {
    const start = Date.now();
    try {
      const isValid = await this.validateConfig();
      const latencyMs = Date.now() - start;
      return {
        status: isValid ? 'HEALTHY' : 'DEGRADED',
        latencyMs,
      };
    } catch (err: any) {
      return {
        status: 'DOWN',
        latencyMs: Date.now() - start,
        error: err?.message || 'Connection timeout',
      };
    }
  }

  protected createSuccessResult(
    providerMessageId: string,
    latencyMs: number,
    costEstimated: number = 0
  ): NotificationResult {
    return {
      success: true,
      providerMessageId,
      providerName: this.displayName,
      channel: this.channel,
      status: 'DELIVERED',
      latencyMs,
      deliveredAt: new Date().toISOString(),
      costEstimated,
    };
  }

  protected createFailureResult(
    errorCode: string,
    errorMessage: string,
    latencyMs: number,
    isPermanent: boolean = false,
    retryable: boolean = true
  ): NotificationResult {
    return {
      success: false,
      providerName: this.displayName,
      channel: this.channel,
      status: 'FAILED',
      latencyMs,
      error: {
        code: errorCode,
        message: errorMessage,
        isPermanent,
        retryable,
      },
    };
  }
}
