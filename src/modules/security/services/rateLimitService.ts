/**
 * Fleet Intelligence Smart AI - Centralized Enterprise Rate Limiting Service
 * PROMPT 50 - Sliding Window Rate Limiting, Brute Force Shield & Anomaly Trigger
 */

import { auditService } from '../../audit/services/auditService';

export type RateLimitCategory =
  | 'AUTH_LOGIN'
  | 'API_REQUEST'
  | 'AI_COPILOT'
  | 'GPS_INGESTION'
  | 'DATA_EXPORT'
  | 'FILE_UPLOAD'
  | 'OTP_VERIFY'
  | 'PASSWORD_RESET';

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
  blockDurationSeconds: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetSeconds: number;
  isBlocked: boolean;
  reason?: string;
}

interface RateBucket {
  timestamps: number[];
  blockedUntil?: number;
}

export class RateLimitService {
  private static instance: RateLimitService;
  private buckets: Map<string, RateBucket> = new Map();

  private defaultConfigs: Record<RateLimitCategory, RateLimitConfig> = {
    AUTH_LOGIN: { maxRequests: 5, windowSeconds: 60, blockDurationSeconds: 300 }, // 5 attempts per min
    API_REQUEST: { maxRequests: 120, windowSeconds: 60, blockDurationSeconds: 60 }, // 120 rpm
    AI_COPILOT: { maxRequests: 20, windowSeconds: 60, blockDurationSeconds: 120 }, // 20 queries/min
    GPS_INGESTION: { maxRequests: 600, windowSeconds: 60, blockDurationSeconds: 60 }, // 10 payloads/sec/device
    DATA_EXPORT: { maxRequests: 10, windowSeconds: 300, blockDurationSeconds: 600 }, // 10 exports per 5 min
    FILE_UPLOAD: { maxRequests: 15, windowSeconds: 60, blockDurationSeconds: 180 }, // 15 uploads per min
    OTP_VERIFY: { maxRequests: 3, windowSeconds: 180, blockDurationSeconds: 600 }, // 3 attempts per 3 min
    PASSWORD_RESET: { maxRequests: 3, windowSeconds: 300, blockDurationSeconds: 900 }, // 3 resets per 5 min
  };

  public static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  /**
   * Check and consume rate limit token
   */
  public checkLimit(
    category: RateLimitCategory,
    identifier: string, // e.g. "ip:103.28.12.94" or "user:usr_123" or "imei:8675430291"
    tenantId: string = 'tenant_default'
  ): RateLimitCheckResult {
    const config = this.defaultConfigs[category];
    const key = `${category}:${identifier}`;
    const now = Date.now();

    if (!this.buckets.has(key)) {
      this.buckets.set(key, { timestamps: [] });
    }

    const bucket = this.buckets.get(key)!;

    // 1. Check if currently blocked
    if (bucket.blockedUntil && bucket.blockedUntil > now) {
      const resetSeconds = Math.ceil((bucket.blockedUntil - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        limit: config.maxRequests,
        resetSeconds,
        isBlocked: true,
        reason: `Rate limit exceeded and locked. Please retry in ${resetSeconds}s.`,
      };
    }

    // 2. Filter sliding window timestamps
    const windowStart = now - config.windowSeconds * 1000;
    bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

    // 3. Evaluate capacity
    if (bucket.timestamps.length >= config.maxRequests) {
      // Exceeded -> Block
      bucket.blockedUntil = now + config.blockDurationSeconds * 1000;
      const resetSeconds = config.blockDurationSeconds;

      auditService.logSecurityEvent({
        tenantId,
        action: 'RATE_LIMIT',
        severity: category === 'AUTH_LOGIN' ? 'HIGH' : 'MEDIUM',
        actor: {
          actorId: identifier,
          actorType: 'SYSTEM',
          tenantId,
        },
        description: `Rate limit breached for [${category}] by [${identifier}]. Throttled for ${config.blockDurationSeconds}s.`,
        securityMetadata: {
          isSuspicious: category === 'AUTH_LOGIN',
          riskScore: category === 'AUTH_LOGIN' ? 80 : 50,
        },
      });

      return {
        allowed: false,
        remaining: 0,
        limit: config.maxRequests,
        resetSeconds,
        isBlocked: true,
        reason: `Rate limit threshold of ${config.maxRequests} requests per ${config.windowSeconds}s exceeded.`,
      };
    }

    // 4. Consume token
    bucket.timestamps.push(now);
    const remaining = config.maxRequests - bucket.timestamps.length;
    const oldestTimestamp = bucket.timestamps[0] || now;
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + config.windowSeconds * 1000 - now) / 1000));

    return {
      allowed: true,
      remaining,
      limit: config.maxRequests,
      resetSeconds,
      isBlocked: false,
    };
  }

  /**
   * Reset/unblock identifier (for admin overrides)
   */
  public resetLimit(category: RateLimitCategory, identifier: string): void {
    const key = `${category}:${identifier}`;
    this.buckets.delete(key);
  }

  /**
   * Get current rate limit configs
   */
  public getConfigs(): Record<RateLimitCategory, RateLimitConfig> {
    return { ...this.defaultConfigs };
  }

  /**
   * Update category limit
   */
  public updateConfig(category: RateLimitCategory, newConfig: Partial<RateLimitConfig>): void {
    this.defaultConfigs[category] = {
      ...this.defaultConfigs[category],
      ...newConfig,
    };
  }
}

export const rateLimitService = RateLimitService.getInstance();
