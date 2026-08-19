/**
 * Fleet Intelligence Smart AI - Notification Queue & Dead Letter Queue (DLQ) Service
 * Manages async channel dispatch, retry backoff, idempotency, and error handling
 */

import { NotificationJob, DeliveryChannel, Notification } from '../types';
import { notificationDeliveryService } from './notificationDeliveryService';
import { notificationPreferenceService } from './notificationPreferenceService';

export class NotificationQueueService {
  private jobs: NotificationJob[] = [];
  private deadLetterQueue: NotificationJob[] = [];

  /**
   * Enqueues channel dispatch jobs with idempotency key
   */
  enqueueJob(
    notification: Notification,
    channel: DeliveryChannel,
    recipient: string,
    payload: Record<string, any>
  ): NotificationJob {
    const idempotencyKey = `idemp:${notification.tenantId}:${notification.id}:${channel}:${recipient}`;

    // 1. Idempotency Check: Prevent duplicate queue entry
    const existing = this.jobs.find((j) => j.idempotencyKey === idempotencyKey);
    if (existing) {
      console.log(`[Queue Service] Skipped duplicate job with idempotencyKey: ${idempotencyKey}`);
      return existing;
    }

    const job: NotificationJob = {
      id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      notificationId: notification.id,
      channel,
      status: 'QUEUED',
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: new Date().toISOString(),
      idempotencyKey,
    };

    this.jobs.push(job);

    // Process job asynchronously (simulation)
    setTimeout(() => this.processJob(job, recipient, payload), 300);

    return job;
  }

  /**
   * Worker simulation executing channel delivery with backoff retry
   */
  private processJob(job: NotificationJob, recipient: string, payload: Record<string, any>): void {
    job.status = 'PROCESSING';
    job.startedAt = new Date().toISOString();
    job.attempts += 1;

    // Simulated provider dispatch call
    const isSuccess = Math.random() > 0.05; // 95% success simulation
    const providerMessageId = `pmsg-${job.channel.toLowerCase()}-${Date.now()}`;

    if (isSuccess) {
      job.status = 'DELIVERED';
      job.completedAt = new Date().toISOString();
      job.providerMessageId = providerMessageId;

      notificationDeliveryService.logDelivery({
        notificationId: job.notificationId,
        channel: job.channel,
        recipient,
        provider: `${job.channel}ProviderAdapter`,
        status: 'DELIVERED',
        attempts: job.attempts,
        sentAt: job.startedAt,
        deliveredAt: job.completedAt,
        providerMessageId,
      });
    } else {
      job.lastError = 'Gateway provider transient connection timeout (HTTP 504)';

      if (job.attempts < job.maxAttempts) {
        // Schedule retry with exponential backoff
        const backoffMs = Math.pow(2, job.attempts) * 1000;
        job.status = 'QUEUED';
        console.warn(`[Queue Service] Job ${job.id} failed attempt ${job.attempts}. Retrying in ${backoffMs}ms...`);
        setTimeout(() => this.processJob(job, recipient, payload), backoffMs);
      } else {
        // Max retries exhausted -> Move to Dead Letter Queue (DLQ)
        job.status = 'FAILED';
        this.deadLetterQueue.push(job);

        // Check if token was invalid
        if (job.channel === 'PUSH') {
          notificationPreferenceService.disableInvalidDeviceToken(recipient);
        }

        notificationDeliveryService.logDelivery({
          notificationId: job.notificationId,
          channel: job.channel,
          recipient,
          provider: `${job.channel}ProviderAdapter`,
          status: 'FAILED',
          attempts: job.attempts,
          sentAt: job.startedAt,
          failedAt: new Date().toISOString(),
          errorCode: 'EXHAUSTED_RETRIES',
          errorMessage: job.lastError,
        });
      }
    }
  }

  getJobs(): NotificationJob[] {
    return this.jobs;
  }

  getDeadLetterQueue(): NotificationJob[] {
    return this.deadLetterQueue;
  }

  retryDeadLetterJob(jobId: string): boolean {
    const idx = this.deadLetterQueue.findIndex((j) => j.id === jobId);
    if (idx === -1) return false;

    const [job] = this.deadLetterQueue.splice(idx, 1);
    job.attempts = 0;
    job.status = 'QUEUED';
    job.lastError = undefined;
    this.jobs.push(job);

    this.processJob(job, 're-triggered-recipient', {});
    return true;
  }
}

export const notificationQueueService = new NotificationQueueService();
