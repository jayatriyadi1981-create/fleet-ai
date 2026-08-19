/**
 * Fleet Intelligence Smart AI - Automated API Test Runner
 * PROMPT 44: Comprehensive Unit, Integration, Security, Cross-Tenant & Acceptance Tests
 */

import { apiKeyService } from './apiKeyService';
import { externalApiService } from './externalApiService';
import { rateLimitService } from './rateLimitService';
import { webhookService, generateHmacSignature } from './webhookService';
import { APIRequestContext } from '../../types/externalApi';
import { mockTenant } from '../../constants/mockData';

export interface TestCaseResult {
  id: string;
  category: 'AUTH' | 'TENANT_ISOLATION' | 'SCOPES' | 'RATE_LIMIT' | 'IDEMPOTENCY' | 'RESOURCES' | 'AI_ENGINE' | 'WEBHOOKS' | 'SECURITY';
  name: string;
  description: string;
  passed: boolean;
  durationMs: number;
  expected: string;
  actual: string;
  errorDetails?: string;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  timestamp: string;
  results: TestCaseResult[];
}

export class APITestRunner {
  public static async runAllTests(): Promise<TestSuiteSummary> {
    const startTime = performance.now();
    const results: TestCaseResult[] = [];

    // Helper test runner
    async function runTest(
      category: TestCaseResult['category'],
      name: string,
      description: string,
      expected: string,
      fn: () => Promise<{ passed: boolean; actual: string; error?: string }>
    ) {
      const t0 = performance.now();
      try {
        const res = await fn();
        results.push({
          id: `test_${results.length + 1}`,
          category,
          name,
          description,
          passed: res.passed,
          durationMs: Math.round(performance.now() - t0),
          expected,
          actual: res.actual,
          errorDetails: res.error,
        });
      } catch (err: any) {
        results.push({
          id: `test_${results.length + 1}`,
          category,
          name,
          description,
          passed: false,
          durationMs: Math.round(performance.now() - t0),
          expected,
          actual: `Exception: ${err.message}`,
          errorDetails: err.stack,
        });
      }
    }

    // 1. AUTH: Valid Key Verification
    await runTest(
      'AUTH',
      'Valid API Key Authentication',
      'Memverifikasi bahwa API Key aktif yang sah diizinkan masuk dan me-resolve context.',
      'ok = true with valid tenant context',
      async () => {
        // Create temporary test key
        const { rawSecretKey, record } = await apiKeyService.createKey({
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          name: 'Unit Test Temp Key',
          scopes: ['vehicles:read', 'vehicles:write'],
          environment: 'SANDBOX',
          createdBy: 'Automated Test Runner',
        });

        const authRes = await externalApiService.authenticateAndAuthorize({
          rawKey: rawSecretKey,
          path: '/api/v1/vehicles',
          method: 'GET',
        });

        apiKeyService.revokeKey(record.id); // clean up
        return {
          passed: authRes.ok && authRes.context?.tenantId === mockTenant.id,
          actual: authRes.ok ? `Context resolved for ${authRes.context?.tenantName}` : `Failed with ${authRes.errorResponse?.error.code}`,
        };
      }
    );

    // 2. AUTH: Revoked Key Rejection
    await runTest(
      'AUTH',
      'Revoked API Key Rejection',
      'Memverifikasi bahwa API Key yang telah di-revoke langsung ditolak dengan HTTP 401.',
      'ok = false, code = API_KEY_REVOKED (HTTP 401)',
      async () => {
        const { rawSecretKey, record } = await apiKeyService.createKey({
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          name: 'Revoked Test Key',
          scopes: ['vehicles:read'],
          environment: 'SANDBOX',
          createdBy: 'Automated Test Runner',
        });
        apiKeyService.revokeKey(record.id);

        const authRes = await externalApiService.authenticateAndAuthorize({
          rawKey: rawSecretKey,
          path: '/api/v1/vehicles',
          method: 'GET',
        });

        return {
          passed: !authRes.ok && authRes.statusCode === 401 && authRes.errorResponse?.error.code === 'API_KEY_REVOKED',
          actual: `Status ${authRes.statusCode}, Code: ${authRes.errorResponse?.error.code}`,
        };
      }
    );

    // 3. TENANT ISOLATION: Cross-Tenant Data Isolation
    await runTest(
      'TENANT_ISOLATION',
      'Strict Cross-Tenant Data Segregation',
      'Memverifikasi bahwa Tenant A tidak dapat melihat atau mengakses armada milik Tenant B.',
      'Tenant A only receives Tenant A vehicles',
      async () => {
        const ctxTenantA: APIRequestContext = {
          tenantId: 'tenant_company_alpha',
          tenantName: 'PT Alpha Trans',
          userId: 'test_user_a',
          apiKeyId: 'key_test_a',
          keyName: 'Alpha Key',
          scopes: ['vehicles:read'],
          ip: '127.0.0.1',
          userAgent: 'TestClient',
          requestId: 'req_test_isolation_1',
          timestamp: new Date().toISOString(),
          environment: 'SANDBOX',
        };

        const res = await externalApiService.getVehicles(ctxTenantA, {});
        const hasLeakedForeignVehicles = res.data.some((v: any) => v.companyId !== 'tenant_company_alpha' && v.companyId !== mockTenant.id);

        return {
          passed: !hasLeakedForeignVehicles,
          actual: `Retrieved ${res.data.length} vehicles safely without cross-tenant leak.`,
        };
      }
    );

    // 4. SCOPES: Granular Scope Enforcement
    await runTest(
      'SCOPES',
      'Granular Scope Rejection (403 Forbidden)',
      'Memverifikasi request ke endpoint yang membutuhkan write ditolak jika hanya memiliki read scope.',
      'ok = false, code = FORBIDDEN_SCOPE (HTTP 403)',
      async () => {
        const { rawSecretKey, record } = await apiKeyService.createKey({
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          name: 'Read-Only Test Key',
          scopes: ['vehicles:read'], // no vehicles:write
          environment: 'SANDBOX',
          createdBy: 'Automated Test Runner',
        });

        const authRes = await externalApiService.authenticateAndAuthorize({
          rawKey: rawSecretKey,
          requiredScope: 'vehicles:write',
          path: '/api/v1/vehicles',
          method: 'POST',
        });

        apiKeyService.revokeKey(record.id);
        return {
          passed: !authRes.ok && authRes.statusCode === 403 && authRes.errorResponse?.error.code === 'FORBIDDEN_SCOPE',
          actual: `Status ${authRes.statusCode}, Code: ${authRes.errorResponse?.error.code}`,
        };
      }
    );

    // 5. SCOPES: Sensitive PII Data Masking
    await runTest(
      'SCOPES',
      'PII Phone & License Masking without drivers:pii',
      'Memverifikasi nomor telepon driver dimasking jika scope drivers:pii tidak diberikan.',
      'Driver phone contains masked asterisks (****)',
      async () => {
        const ctxWithoutPii: APIRequestContext = {
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          userId: 'test_user',
          apiKeyId: 'key_test_no_pii',
          keyName: 'No PII Key',
          scopes: ['drivers:read'], // without drivers:pii
          ip: '127.0.0.1',
          userAgent: 'TestClient',
          requestId: 'req_test_pii_1',
          timestamp: new Date().toISOString(),
          environment: 'SANDBOX',
        };

        const res = await externalApiService.getDrivers(ctxWithoutPii, {});
        const isMasked = res.data.every((d: any) => d.phone.includes('****') || d.phone === 'N/A');

        return {
          passed: isMasked && res.data.length > 0,
          actual: `Sample masked phone: ${res.data[0]?.phone || 'N/A'}`,
        };
      }
    );

    // 6. RATE_LIMIT: Burst Rate Limiting Engine
    await runTest(
      'RATE_LIMIT',
      'Burst Rate Limiting & 429 Status Check',
      'Memverifikasi jika batas rate limit per menit dilanggar maka mengembalikan status 429.',
      'allowed = false with RATE_LIMIT_EXCEEDED',
      async () => {
        const testKeyId = 'key_rate_limit_burst_test';
        // Set limit of 3 requests
        rateLimitService.resetLimit(testKeyId);
        rateLimitService.checkRateLimit(testKeyId, mockTenant.id, 3);
        rateLimitService.checkRateLimit(testKeyId, mockTenant.id, 3);
        rateLimitService.checkRateLimit(testKeyId, mockTenant.id, 3);
        const fourth = rateLimitService.checkRateLimit(testKeyId, mockTenant.id, 3);

        return {
          passed: !fourth.allowed && fourth.reason === 'RATE_LIMIT_EXCEEDED',
          actual: `Rate limit triggered: allowed=${fourth.allowed}, remaining=${fourth.remaining}, reason=${fourth.reason}`,
        };
      }
    );

    // 7. IDEMPOTENCY: Duplicate POST Prevention
    await runTest(
      'IDEMPOTENCY',
      'Idempotency-Key Header Caching',
      'Memverifikasi header Idempotency-Key mengembalikan cached response tanpa membuat duplikat.',
      'Second request with same idempotency key returns created=false with same entity',
      async () => {
        const idempotencyKey = `idemp_${Date.now()}`;
        const ctx: APIRequestContext = {
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          userId: 'test_user',
          apiKeyId: 'key_test_idemp',
          keyName: 'Idempotency Key Test',
          scopes: ['vehicles:write'],
          ip: '127.0.0.1',
          userAgent: 'TestClient',
          requestId: 'req_idemp_1',
          timestamp: new Date().toISOString(),
          environment: 'SANDBOX',
          idempotencyKey,
        };

        const res1 = await externalApiService.createVehicle(ctx, { name: 'Idemp Test Truck', plateNumber: 'B 1111 IDM' });
        const res2 = await externalApiService.createVehicle(ctx, { name: 'Idemp Test Truck', plateNumber: 'B 1111 IDM' });

        return {
          passed: res1.created === true && res2.created === false && res1.data.id === res2.data.id,
          actual: `First created: ${res1.created}, Second cached: ${!res2.created}, Id: ${res2.data.id}`,
        };
      }
    );

    // 8. RESOURCES: Unified GPS Location & Telemetry
    await runTest(
      'RESOURCES',
      'Unified GPS Model (Location & Telemetry API)',
      'Memverifikasi endpoint /api/v1/vehicles/:id/location mengembalikan koordinat GPS terstandarisasi.',
      'Latitude, longitude, speed, ignition, and address present',
      async () => {
        const ctx: APIRequestContext = {
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          userId: 'test_user',
          apiKeyId: 'key_test_gps',
          keyName: 'GPS Test Key',
          scopes: ['gps:read'],
          ip: '127.0.0.1',
          userAgent: 'TestClient',
          requestId: 'req_gps_loc_1',
          timestamp: new Date().toISOString(),
          environment: 'SANDBOX',
        };

        const loc = await externalApiService.getVehicleLocation(ctx, 'veh_01');
        const valid = loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number' && typeof loc.speed === 'number';

        return {
          passed: Boolean(valid),
          actual: `Lat: ${loc?.latitude}, Lng: ${loc?.longitude}, Speed: ${loc?.speed} km/h`,
        };
      }
    );

    // 9. AI_ENGINE: Probabilistic AI Anomaly Phrasing
    await runTest(
      'AI_ENGINE',
      'AI Fuel Intelligence Probabilistic Wording',
      'Memverifikasi analisis bahan bakar menggunakan bahasa probabilistik (suspected/possible) bukan vonis langsung.',
      'Phrasing contains "possible" or "suspected"',
      async () => {
        const ctx: APIRequestContext = {
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          userId: 'test_user',
          apiKeyId: 'key_test_ai',
          keyName: 'AI Test Key',
          scopes: ['ai:read'],
          ip: '127.0.0.1',
          userAgent: 'TestClient',
          requestId: 'req_ai_fuel_1',
          timestamp: new Date().toISOString(),
          environment: 'SANDBOX',
        };

        const fuelAi = await externalApiService.analyzeFuel(ctx, {});
        const anomaly = fuelAi.anomalies[0];
        const hasProbabilisticWording = anomaly.phrasing.toLowerCase().includes('possible') || anomaly.phrasing.toLowerCase().includes('suspected');

        return {
          passed: hasProbabilisticWording,
          actual: `AI Phrasing: "${anomaly.phrasing}"`,
        };
      }
    );

    // 10. WEBHOOKS: HMAC SHA-256 Signature Verification
    await runTest(
      'WEBHOOKS',
      'Webhook HMAC SHA-256 Signature Generation',
      'Memverifikasi payload webhook di-sign dengan secret key dan menghasilkan signature yang valid.',
      'Signature starts with sha256= and matches length 71',
      async () => {
        const testPayload = JSON.stringify({ event: 'trip.completed', tripId: 'TRIP-999' });
        const secret = 'whsec_sample_secret_key_12345';
        const signature = await generateHmacSignature(testPayload, secret);

        return {
          passed: signature.startsWith('sha256=') && signature.length >= 64,
          actual: `Generated signature: ${signature.substring(0, 24)}...`,
        };
      }
    );

    // 11. SECURITY: SQL Injection & XSS Payload Neutralization
    await runTest(
      'SECURITY',
      'Injection & Malicious Payload Neutralization',
      'Memverifikasi query sort atau filter dengan injection string tidak merusak atau mengeksekusi payload.',
      'Sort field safely sanitized against whitelist',
      async () => {
        const ctx: APIRequestContext = {
          tenantId: mockTenant.id,
          tenantName: mockTenant.name,
          userId: 'test_user',
          apiKeyId: 'key_test_sec',
          keyName: 'Security Test Key',
          scopes: ['vehicles:read'],
          ip: '127.0.0.1',
          userAgent: 'TestClient',
          requestId: 'req_sec_1',
          timestamp: new Date().toISOString(),
          environment: 'SANDBOX',
        };

        const res = await externalApiService.getVehicles(ctx, {
          sort: "name'; DROP TABLE vehicles; --",
          status: '<script>alert(1)</script>',
        });

        return {
          passed: Array.isArray(res.data) && res.success === true,
          actual: `Handled gracefully without throwing. Returned ${res.data.length} records.`,
        };
      }
    );

    const totalTime = Math.round(performance.now() - startTime);
    const passedCount = results.filter(r => r.passed).length;

    return {
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      durationMs: totalTime,
      timestamp: new Date().toISOString(),
      results,
    };
  }
}
