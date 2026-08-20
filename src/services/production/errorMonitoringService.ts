/**
 * Fleet Intelligence Smart AI - Centralized Error Monitoring Service
 * PROMPT 59: Error Capture, Reference Generation (ERR-YYYYMMDD-XXX), Context Enrichment & User-Safe Formatting
 */

import { CentralizedLogger } from './centralizedLogger';

export interface MonitoredError {
  errorId: string;
  timestamp: string;
  service: string;
  environment: string;
  route: string;
  userId?: string;
  tenantId?: string;
  correlationId: string;
  errorCode: string;
  userFriendlyMessage: string;
  technicalMessage: string;
  stackTrace?: string;
  handled: boolean;
}

export class ErrorMonitoringService {
  private static recordedErrors: MonitoredError[] = [];
  private static counter = 1;

  /**
   * Captures application error and returns user-safe reference
   */
  public static captureError(
    err: any,
    context: {
      service: string;
      route?: string;
      userId?: string;
      tenantId?: string;
      correlationId?: string;
      userFriendlyMessage?: string;
    }
  ): MonitoredError {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const errorId = `ERR-${today}-${String(this.counter++).padStart(3, '0')}`;
    const correlationId = context.correlationId || `corr_${Math.random().toString(36).substring(2, 8)}`;

    const monitored: MonitoredError = {
      errorId,
      timestamp: new Date().toISOString(),
      service: context.service,
      environment: 'production',
      route: context.route || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      userId: context.userId,
      tenantId: context.tenantId,
      correlationId,
      errorCode: err.code || 'UNEXPECTED_ERROR',
      userFriendlyMessage:
        context.userFriendlyMessage ||
        'Terjadi kendala pada sistem. Silakan coba beberapa saat lagi atau hubungi administrator.',
      technicalMessage: err.message || String(err),
      stackTrace: err.stack,
      handled: true,
    };

    this.recordedErrors.unshift(monitored);
    if (this.recordedErrors.length > 200) {
      this.recordedErrors.pop();
    }

    CentralizedLogger.error(context.service, monitored.technicalMessage, {
      requestId: errorId,
      correlationId,
      userId: context.userId,
      tenantId: context.tenantId,
      error: err,
    });

    return monitored;
  }

  public static getRecordedErrors(): MonitoredError[] {
    return [...this.recordedErrors];
  }
}
