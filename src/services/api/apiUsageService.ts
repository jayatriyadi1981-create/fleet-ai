/**
 * Fleet Intelligence Smart AI - API Usage Tracking & Analytics Service
 * PROMPT 44: Traffic Logs, Error Breakdown, Latency Percentiles & Multi-Tenant Analytics
 */

import { ApiUsageRecord, ApiEnvironment } from '../../types/externalApi';
import { mockTenant } from '../../constants/mockData';

const USAGE_LOGS_STORAGE_KEY = 'fleet_api_usage_logs_v1';

class APIUsageService {
  private logs: ApiUsageRecord[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(USAGE_LOGS_STORAGE_KEY);
      if (stored) {
        try {
          this.logs = JSON.parse(stored);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Seed recent logs for demo
    const endpoints = [
      { path: '/api/v1/vehicles', method: 'GET', status: 200, latency: 45 },
      { path: '/api/v1/vehicles/veh_01/location', method: 'GET', status: 200, latency: 28 },
      { path: '/api/v1/trips', method: 'GET', status: 200, latency: 62 },
      { path: '/api/v1/alerts', method: 'GET', status: 200, latency: 35 },
      { path: '/api/v1/gps/devices/dev_01/telemetry', method: 'GET', status: 200, latency: 40 },
      { path: '/api/v1/ai/fleet/analyze', method: 'POST', status: 200, latency: 320 },
      { path: '/api/v1/reports', method: 'POST', status: 202, latency: 85 },
      { path: '/api/v1/drivers/drv_01', method: 'GET', status: 200, latency: 30 },
      { path: '/api/v1/vehicles/veh_99', method: 'GET', status: 404, latency: 22, error: 'VEHICLE_NOT_FOUND' },
      { path: '/api/v1/gps/devices/dev_01/commands', method: 'POST', status: 200, latency: 110 },
      { path: '/api/v1/ai/assistant', method: 'POST', status: 200, latency: 410 },
      { path: '/api/v1/geofences', method: 'GET', status: 200, latency: 38 },
    ];

    this.logs = [];
    const now = Date.now();
    for (let i = 0; i < 40; i++) {
      const ep = endpoints[i % endpoints.length];
      const timeOffset = (i * 3 + Math.random() * 5) * 60000;
      const latencyMs = ep.latency + Math.floor(Math.random() * 20);
      const reqId = `req_${(now - timeOffset).toString(36)}_${i}`;
      this.logs.push({
        id: reqId,
        requestId: reqId,
        tenantId: mockTenant.id,
        tenantName: mockTenant.name,
        apiKeyId: i % 3 === 0 ? 'key_prod_sap_erp_01' : i % 3 === 1 ? 'key_prod_tms_logistics_02' : 'key_sandbox_dev_03',
        keyName: i % 3 === 0 ? 'SAP S/4HANA ERP' : i % 3 === 1 ? 'Logistics TMS' : 'Sandbox Testing',
        endpoint: ep.path,
        path: ep.path,
        method: ep.method,
        statusCode: ep.status,
        latencyMs,
        durationMs: latencyMs,
        ip: '103.144.20.' + (10 + (i % 8)),
        userAgent: i % 2 === 0 ? 'ERP-Sync-Daemon/3.4 (Linux x86_64)' : 'PostmanRuntime/7.39.0',
        timestamp: new Date(now - timeOffset).toISOString(),
        environment: i % 3 === 2 ? 'SANDBOX' : 'PRODUCTION',
        error: ep.error,
        bytesTransferred: 1200 + Math.floor(Math.random() * 4000),
      });
    }

    this.save();
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USAGE_LOGS_STORAGE_KEY, JSON.stringify(this.logs.slice(0, 500)));
    }
  }

  public recordUsage(record: Omit<ApiUsageRecord, 'id'>): ApiUsageRecord {
    const id = `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
    const fullRecord: ApiUsageRecord = {
      ...record,
      id,
      requestId: record.requestId || id,
      path: record.path || record.endpoint,
      durationMs: record.durationMs || record.latencyMs,
      userAgent: record.userAgent || 'External-API-Client/1.0',
    };
    this.logs.unshift(fullRecord);
    this.save();
    return fullRecord;
  }

  public getLogs(tenantId?: string, limit: number = 100): ApiUsageRecord[] {
    let list = this.logs;
    if (tenantId) {
      list = list.filter(l => l.tenantId === tenantId);
    }
    return list.slice(0, limit);
  }

  public getUsageMetrics(tenantId?: string) {
    return this.getAnalytics(tenantId);
  }

  public getAnalytics(tenantId?: string) {
    const list = tenantId ? this.logs.filter(l => l.tenantId === tenantId) : this.logs;
    const totalRequests = list.length;
    const successfulRequests = list.filter(l => l.statusCode >= 200 && l.statusCode < 400).length;
    const errorRequests = list.filter(l => l.statusCode >= 400).length;
    const errorRate = totalRequests > 0 ? ((errorRequests / totalRequests) * 100).toFixed(1) : '0';

    const latencies = list.map(l => l.latencyMs).sort((a, b) => a - b);
    const avgLatency = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
    const p95Latency = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] || latencies[latencies.length - 1] : 0;
    const p99Latency = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.99)] || latencies[latencies.length - 1] : 0;

    // Status code breakdown
    const statusCodes: Record<string, number> = {
      '2xx Success': list.filter(l => l.statusCode >= 200 && l.statusCode < 300).length,
      '4xx Client Error': list.filter(l => l.statusCode >= 400 && l.statusCode < 500).length,
      '5xx Server Error': list.filter(l => l.statusCode >= 500).length,
    };

    // Top endpoints
    const endpointCounts: Record<string, { count: number; avgLatency: number; errors: number }> = {};
    for (const log of list) {
      const key = `${log.method} ${log.endpoint}`;
      if (!endpointCounts[key]) {
        endpointCounts[key] = { count: 0, avgLatency: 0, errors: 0 };
      }
      endpointCounts[key].count += 1;
      endpointCounts[key].avgLatency += log.latencyMs;
      if (log.statusCode >= 400) endpointCounts[key].errors += 1;
    }

    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, data]) => ({
        endpoint,
        count: data.count,
        avgLatency: Math.round(data.avgLatency / data.count),
        errors: data.errors,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Multi-tenant breakdown for Super Admin
    const tenantCounts: Record<string, { tenantName: string; requests: number; errors: number }> = {};
    for (const log of this.logs) {
      if (!tenantCounts[log.tenantId]) {
        tenantCounts[log.tenantId] = { tenantName: log.tenantName || log.tenantId, requests: 0, errors: 0 };
      }
      tenantCounts[log.tenantId].requests += 1;
      if (log.statusCode >= 400) tenantCounts[log.tenantId].errors += 1;
    }

    const tenantBreakdown = Object.entries(tenantCounts).map(([tenantId, data]) => ({
      tenantId,
      tenantName: data.tenantName,
      requests: data.requests,
      errors: data.errors,
    }));

    return {
      totalRequests,
      successfulRequests,
      errorRequests,
      errorRate: Number(errorRate),
      avgLatency,
      p95Latency,
      p99Latency,
      statusCodes,
      topEndpoints,
      tenantBreakdown,
    };
  }
}

export const apiUsageService = new APIUsageService();
