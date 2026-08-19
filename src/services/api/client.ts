/**
 * Centralized API Client Abstraction
 */

import { ApiResponse, ApiError } from './types';
import { logger } from '../../utils/logger';

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  tenantId?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { timeoutMs = 15000, tenantId, headers, ...restOptions } = options;
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const mergedHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId || 'tenant_demo_001',
        ...(headers as Record<string, string>),
      };

      const response = await fetch(url, {
        ...restOptions,
        headers: mergedHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errData: any;
        try {
          errData = await response.json();
        } catch {
          errData = { message: response.statusText };
        }

        const apiErr: ApiError = {
          code: this.mapStatusToErrorCode(response.status),
          message: errData.message || 'Terjadi kesalahan pada server',
          statusCode: response.status,
        };

        logger.error(`API Error on ${url}:`, apiErr);
        return { success: false, error: apiErr };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message,
        meta: data.meta,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'TIMEOUT',
            message: 'Koneksi ke server timeout. Silakan coba lagi.',
          },
        };
      }

      logger.error(`Network Exception on ${url}:`, error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Gagal terhubung ke jaringan server telematika.',
        },
      };
    }
  }

  private mapStatusToErrorCode(status: number): any {
    switch (status) {
      case 401: return 'AUTH_ERROR';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 422: return 'VALIDATION_ERROR';
      case 500: case 502: case 503: return 'SERVER_ERROR';
      default: return 'UNKNOWN_ERROR';
    }
  }
}

export const apiClient = new ApiClient();
