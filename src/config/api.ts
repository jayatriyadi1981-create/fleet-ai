/**
 * Fleet Intelligence Smart AI - API Production Configuration
 * PROMPT 59: API Versioning, Routing, Gateway Rate Limits, Idempotency & CORS Policies
 */

export interface ApiConfig {
  version: string;
  prefix: string;
  baseUrl: string;
  rateLimits: {
    publicApi: number; // req/min
    authenticatedUser: number;
    aiOrchestrator: number;
    exportReports: number;
    gpsIngestion: number;
    loginOtp: number;
  };
  timeoutMs: number;
  idempotencyWindowSeconds: number;
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    allowCredentials: boolean;
  };
}

export const apiConfig: ApiConfig = {
  version: 'v1',
  prefix: '/api/v1',
  baseUrl: typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1',
  rateLimits: {
    publicApi: 60,
    authenticatedUser: 180,
    aiOrchestrator: 20,
    exportReports: 10,
    gpsIngestion: 5000,
    loginOtp: 5,
  },
  timeoutMs: 15000,
  idempotencyWindowSeconds: 60,
  cors: {
    allowedOrigins: [
      'https://fleetintelligence.id',
      'https://app.fleetintelligence.id',
      'https://staging.fleetintelligence.id',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID', 'X-Idempotency-Key', 'X-Tenant-ID'],
    allowCredentials: true,
  },
};
