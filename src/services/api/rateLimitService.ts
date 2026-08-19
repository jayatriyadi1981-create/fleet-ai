/**
 * Fleet Intelligence Smart AI - API Rate Limiting & Quota Engine
 * PROMPT 44: Token Bucket Sliding Window, Subscription Tier Alignment, Headers & 429 Handling
 */

import { subscriptionService } from '../subscriptionService';

export interface RateLimitStatus {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds?: number;
  reason?: 'RATE_LIMIT_EXCEEDED' | 'MONTHLY_QUOTA_EXHAUSTED';
}

interface WindowBucket {
  windowStart: number;
  count: number;
}

class RateLimitService {
  private keyBuckets: Map<string, WindowBucket> = new Map();
  private tenantBuckets: Map<string, WindowBucket> = new Map();

  /**
   * Check rate limit for a specific API Key and Tenant
   */
  public checkRateLimit(
    apiKeyId: string,
    tenantId: string,
    keyRateLimit: number = 500
  ): RateLimitStatus {
    const now = Date.now();
    const windowMs = 60000; // 1 minute window

    // 1. First check monthly API Quota from Subscription Engine
    try {
      const quotaCheck = subscriptionService.checkAPIQuota(tenantId, 1);
      if (!quotaCheck.allowed) {
        return {
          allowed: false,
          limit: keyRateLimit,
          remaining: 0,
          resetSeconds: 86400,
          retryAfterSeconds: 3600,
          reason: 'MONTHLY_QUOTA_EXHAUSTED',
        };
      }
    } catch (e) {
      // Fallback if subscription service is warming up
    }

    // 2. Sliding window check per API Key
    let keyBucket = this.keyBuckets.get(apiKeyId);
    if (!keyBucket || now - keyBucket.windowStart > windowMs) {
      keyBucket = { windowStart: now, count: 0 };
      this.keyBuckets.set(apiKeyId, keyBucket);
    }

    keyBucket.count += 1;
    const elapsedSeconds = Math.floor((now - keyBucket.windowStart) / 1000);
    const resetSeconds = Math.max(1, 60 - elapsedSeconds);
    const remaining = Math.max(0, keyRateLimit - keyBucket.count);

    if (keyBucket.count > keyRateLimit) {
      return {
        allowed: false,
        limit: keyRateLimit,
        remaining: 0,
        resetSeconds,
        retryAfterSeconds: resetSeconds,
        reason: 'RATE_LIMIT_EXCEEDED',
      };
    }

    // Also record usage in subscription service
    try {
      subscriptionService.incrementResourceUsage(tenantId, 'apiRequests', 1);
    } catch (e) {
      // safe
    }

    return {
      allowed: true,
      limit: keyRateLimit,
      remaining,
      resetSeconds,
    };
  }

  public getRateLimitHeaders(status: RateLimitStatus): Record<string, string> {
    const headers: Record<string, string> = {
      'X-RateLimit-Limit': String(status.limit),
      'X-RateLimit-Remaining': String(status.remaining),
      'X-RateLimit-Reset': String(status.resetSeconds),
    };
    if (status.retryAfterSeconds) {
      headers['Retry-After'] = String(status.retryAfterSeconds);
    }
    return headers;
  }

  public resetLimit(apiKeyId: string) {
    this.keyBuckets.delete(apiKeyId);
  }
}

export const rateLimitService = new RateLimitService();
