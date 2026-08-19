/**
 * Fleet Intelligence Smart AI - Centralized Secure Error Handling Service
 * PROMPT 50 - Zero Information Leakage, Correlation Tracking & Safe Error Formatting
 */

import { encryptionService } from './encryptionService';
import { auditService } from '../../audit/services/auditService';

export type SecurityErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_REQUIRED'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN_ACCESS'
  | 'CROSS_TENANT_ACCESS_DENIED'
  | 'RESOURCE_NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CIRCUIT_BREAKER_OPEN'
  | 'GPS_DEVICE_UNAUTHORIZED'
  | 'FILE_TYPE_FORBIDDEN'
  | 'INTERNAL_SECURITY_ERROR';

export interface SecureErrorResponse {
  success: false;
  error: {
    code: SecurityErrorCode;
    message: string;
    requestId: string;
    correlationId: string;
    timestamp: string;
    details?: any;
  };
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;

  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  /**
   * Format a sanitized, secure error response that never leaks internal paths, SQL queries, or secrets
   */
  public createSecureErrorResponse(
    code: SecurityErrorCode,
    userMessage: string,
    internalErrorDetails?: any,
    tenantId: string = 'tenant_default',
    existingCorrelationId?: string
  ): SecureErrorResponse {
    const requestId = `req_${encryptionService.generateSecureRandomHex(8)}`;
    const correlationId = existingCorrelationId || `corr_${encryptionService.generateSecureRandomHex(8)}`;
    const now = new Date().toISOString();

    // If severe security error, record to audit engine
    if (
      code === 'CROSS_TENANT_ACCESS_DENIED' ||
      code === 'FORBIDDEN_ACCESS' ||
      code === 'RATE_LIMIT_EXCEEDED' ||
      code === 'GPS_DEVICE_UNAUTHORIZED'
    ) {
      auditService.logSecurityEvent({
        tenantId,
        action: 'FORBIDDEN_ACCESS',
        severity: code === 'CROSS_TENANT_ACCESS_DENIED' ? 'CRITICAL' : 'HIGH',
        actor: {
          actorId: 'usr_sec_intercept',
          actorType: 'SYSTEM',
          tenantId,
        },
        description: `Security Error Intercepted [${code}]: ${userMessage}`,
        securityMetadata: {
          requestId,
          correlationId,
          isSuspicious: true,
          riskScore: code === 'CROSS_TENANT_ACCESS_DENIED' ? 90 : 60,
        },
      });
    }

    return {
      success: false,
      error: {
        code,
        message: userMessage,
        requestId,
        correlationId,
        timestamp: now,
      },
    };
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();
