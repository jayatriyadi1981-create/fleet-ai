/**
 * Standardized API Response & Error Types
 */

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: PaginationMeta;
}
