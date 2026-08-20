/**
 * Fleet Intelligence Smart AI - Centralized Production Logger
 * PROMPT 59: Structured JSON Logging, Log Levels, Correlation IDs, and Sensitive Token Redaction
 */

import { securityConfig } from '../../config/security';
import { getEnv } from '../../config/env';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface StructuredLogEntry {
  timestamp: string;
  service: string;
  level: LogLevel;
  requestId?: string;
  correlationId?: string;
  userId?: string;
  tenantId?: string;
  eventId?: string;
  message: string;
  durationMs?: number;
  data?: Record<string, any>;
  error?: {
    code?: string;
    message: string;
    stack?: string;
  };
}

export class CentralizedLogger {
  private static logHistory: StructuredLogEntry[] = [];
  private static maxHistory = 300;

  /**
   * Redacts sensitive keys before emitting logs
   */
  public static sanitizeData(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((i) => this.sanitizeData(i));

    const redacted = { ...obj };
    for (const key of Object.keys(redacted)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = securityConfig.dataSanitization.redactedFields.some((f) =>
        lowerKey.includes(f.toLowerCase())
      );

      if (isSensitive) {
        redacted[key] = '[REDACTED_SECRET]';
      } else if (typeof redacted[key] === 'object') {
        redacted[key] = this.sanitizeData(redacted[key]);
      }
    }
    return redacted;
  }

  public static log(
    level: LogLevel,
    service: string,
    message: string,
    context?: {
      requestId?: string;
      correlationId?: string;
      userId?: string;
      tenantId?: string;
      eventId?: string;
      durationMs?: number;
      data?: Record<string, any>;
      error?: any;
    }
  ): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      service,
      level,
      requestId: context?.requestId || `req_${Date.now().toString(36)}`,
      correlationId: context?.correlationId,
      userId: context?.userId,
      tenantId: context?.tenantId,
      eventId: context?.eventId,
      message,
      durationMs: context?.durationMs,
      data: context?.data ? this.sanitizeData(context.data) : undefined,
      error: context?.error
        ? {
            code: context.error.code || 'ERR_INTERNAL',
            message: context.error.message || String(context.error),
            stack: getEnv().isProduction ? undefined : context.error.stack,
          }
        : undefined,
    };

    this.logHistory.unshift(entry);
    if (this.logHistory.length > this.maxHistory) {
      this.logHistory.pop();
    }

    // In dev mode, output clean formatting
    if (!getEnv().isProduction) {
      const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.service}]`;
      if (level === 'ERROR' || level === 'FATAL') {
        console.error(prefix, entry.message, entry.error || entry.data || '');
      } else if (level === 'WARN') {
        console.warn(prefix, entry.message, entry.data || '');
      }
    }

    return entry;
  }

  public static debug(service: string, message: string, context?: any) {
    return this.log('DEBUG', service, message, context);
  }

  public static info(service: string, message: string, context?: any) {
    return this.log('INFO', service, message, context);
  }

  public static warn(service: string, message: string, context?: any) {
    return this.log('WARN', service, message, context);
  }

  public static error(service: string, message: string, context?: any) {
    return this.log('ERROR', service, message, context);
  }

  public static fatal(service: string, message: string, context?: any) {
    return this.log('FATAL', service, message, context);
  }

  public static getRecentLogs(): StructuredLogEntry[] {
    return [...this.logHistory];
  }
}
