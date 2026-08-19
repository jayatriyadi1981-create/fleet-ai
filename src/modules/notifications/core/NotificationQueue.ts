/**
 * Fleet Intelligence Smart AI - Notification Priority Queue & Retry Engine
 * PROMPT 45: CRITICAL/HIGH/NORMAL/LOW Queuing, Exponential Backoff & Dead Letter Queue (DLQ)
 */

import {
  NotificationMessage,
  NotificationPriority,
  ChannelDeliveryStatus,
} from '../types/notificationEngineTypes';

export interface QueuedJob {
  id: string;
  message: NotificationMessage;
  priority: NotificationPriority;
  attempt: number;
  maxRetries: number;
  nextRunAt: number;
  status: ChannelDeliveryStatus;
  lastError?: string;
  enqueuedAt: number;
}

class NotificationQueueService {
  private queue: QueuedJob[] = [];
  private deadLetterQueue: QueuedJob[] = [];
  private isProcessing: boolean = false;

  constructor() {
    this.startWorker();
  }

  public enqueue(
    message: NotificationMessage,
    priority: NotificationPriority = 'NORMAL',
    maxRetries: number = 3
  ): QueuedJob {
    const job: QueuedJob = {
      id: `job_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      message,
      priority,
      attempt: 0,
      maxRetries,
      nextRunAt: Date.now(),
      status: 'QUEUED',
      enqueuedAt: Date.now(),
    };

    // Insert sorted by priority (CRITICAL > HIGH > NORMAL > LOW)
    const priorityWeight: Record<NotificationPriority, number> = {
      CRITICAL: 4,
      HIGH: 3,
      NORMAL: 2,
      LOW: 1,
    };

    const insertIdx = this.queue.findIndex(
      q => priorityWeight[q.priority] < priorityWeight[priority]
    );

    if (insertIdx === -1) {
      this.queue.push(job);
    } else {
      this.queue.splice(insertIdx, 0, job);
    }

    return job;
  }

  public getQueueDepth(): { total: number; critical: number; high: number; normal: number; low: number; dlq: number } {
    return {
      total: this.queue.length,
      critical: this.queue.filter(j => j.priority === 'CRITICAL').length,
      high: this.queue.filter(j => j.priority === 'HIGH').length,
      normal: this.queue.filter(j => j.priority === 'NORMAL').length,
      low: this.queue.filter(j => j.priority === 'LOW').length,
      dlq: this.deadLetterQueue.length,
    };
  }

  public getQueuedJobs(): QueuedJob[] {
    return [...this.queue];
  }

  public getDeadLetterQueue(): QueuedJob[] {
    return [...this.deadLetterQueue];
  }

  public calculateBackoff(attempt: number): number {
    // Exponential backoff: 2s, 4s, 8s, 16s... with jitter
    const baseMs = 2000;
    const exp = Math.pow(2, attempt);
    const jitter = Math.floor(Math.random() * 500);
    return baseMs * exp + jitter;
  }

  public handleJobFailure(job: QueuedJob, error: string, isPermanent: boolean = false) {
    job.attempt += 1;
    job.lastError = error;

    if (isPermanent || job.attempt >= job.maxRetries) {
      job.status = 'FAILED';
      this.deadLetterQueue.push(job);
      this.removeFromQueue(job.id);
    } else {
      job.status = 'RETRYING';
      const delay = this.calculateBackoff(job.attempt);
      job.nextRunAt = Date.now() + delay;
    }
  }

  public handleJobSuccess(job: QueuedJob) {
    job.status = 'DELIVERED';
    this.removeFromQueue(job.id);
  }

  private removeFromQueue(jobId: string) {
    this.queue = this.queue.filter(j => j.id !== jobId);
  }

  private startWorker() {
    // Process queue in background
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.processNextBatch();
      }, 1000);
    }
  }

  private async processNextBatch() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    try {
      const now = Date.now();
      const readyJobs = this.queue.filter(j => j.nextRunAt <= now && j.status !== 'PROCESSING');

      for (const job of readyJobs.slice(0, 5)) {
        job.status = 'PROCESSING';
        // Note: Orchestrator invokes real dispatch
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const notificationQueue = new NotificationQueueService();
