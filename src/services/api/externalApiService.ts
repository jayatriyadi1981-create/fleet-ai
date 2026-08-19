/**
 * Fleet Intelligence Smart AI - Central External API Service Layer & Gateway
 * PROMPT 44: Multi-Tenant Gateway, Unified Models, Granular Scopes, Idempotency, Async Reports & AI Engine
 */

import {
  APIRequestContext,
  ApiScope,
  StandardApiResponse,
  StandardListResponse,
  StandardApiErrorResponse,
  ReportJob,
} from '../../types/externalApi';
import { apiKeyService } from './apiKeyService';
import { rateLimitService } from './rateLimitService';
import { apiUsageService } from './apiUsageService';
import { apiAuditService } from './apiAuditService';
import { webhookService } from './webhookService';
import { mockVehicles, mockDrivers, mockTrips, mockAlerts, mockGeofences, mockMaintenanceOrders, mockTenant, mockBranches, mockGpsDevices } from '../../constants/mockData';
import { gpsIntegrationService } from '../gps/gpsIntegrationService';
import { Vehicle, Driver, Trip, AlertNotification, Geofence } from '../../types';

// In-memory / localStorage store for dynamic API entities
const API_VEHICLES_KEY = 'fleet_api_vehicles_v1';
const API_DRIVERS_KEY = 'fleet_api_drivers_v1';
const API_TRIPS_KEY = 'fleet_api_trips_v1';
const API_REPORTS_KEY = 'fleet_api_report_jobs_v1';
const IDEMPOTENCY_STORE_KEY = 'fleet_api_idempotency_v1';

class ExternalAPIService {
  private vehicles: Vehicle[] = [...mockVehicles];
  private drivers: Driver[] = [...mockDrivers];
  private trips: Trip[] = [...mockTrips];
  private alerts: AlertNotification[] = [...mockAlerts];
  private geofences: Geofence[] = [...mockGeofences];
  private reportJobs: ReportJob[] = [];
  private idempotencyStore: Map<string, { response: any; timestamp: number }> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem(API_VEHICLES_KEY);
      const d = localStorage.getItem(API_DRIVERS_KEY);
      const t = localStorage.getItem(API_TRIPS_KEY);
      const r = localStorage.getItem(API_REPORTS_KEY);
      if (v) try { this.vehicles = JSON.parse(v); } catch (e) {}
      if (d) try { this.drivers = JSON.parse(d); } catch (e) {}
      if (t) try { this.trips = JSON.parse(t); } catch (e) {}
      if (r) try { this.reportJobs = JSON.parse(r); } catch (e) {}
    }

    if (this.reportJobs.length === 0) {
      // Seed sample report jobs
      this.reportJobs = [
        {
          id: 'job_rep_01',
          tenantId: mockTenant.id,
          reportType: 'fleet',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
          completedAt: new Date(Date.now() - 39 * 60000).toISOString(),
          format: 'PDF',
          progress: 100,
          downloadUrl: '/api/v1/reports/jobs/job_rep_01/download',
          rowCount: 42,
          fileSize: '1.8 MB',
          filters: { dateFrom: '2026-08-01', dateTo: '2026-08-18' },
        },
        {
          id: 'job_rep_02',
          tenantId: mockTenant.id,
          reportType: 'fuel',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          completedAt: new Date(Date.now() - 14 * 60000).toISOString(),
          format: 'XLSX',
          progress: 100,
          downloadUrl: '/api/v1/reports/jobs/job_rep_02/download',
          rowCount: 1540,
          fileSize: '4.2 MB',
          filters: { vehicleId: 'veh_01' },
        },
      ];
      this.saveReports();
    }
  }

  private saveVehicles() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_VEHICLES_KEY, JSON.stringify(this.vehicles));
    }
  }

  private saveDrivers() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_DRIVERS_KEY, JSON.stringify(this.drivers));
    }
  }

  private saveTrips() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_TRIPS_KEY, JSON.stringify(this.trips));
    }
  }

  private saveReports() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_REPORTS_KEY, JSON.stringify(this.reportJobs));
    }
  }

  /**
   * Helper: Build standard response envelope
   */
  public successResponse<T>(data: T, ctx: APIRequestContext): StandardApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        requestId: ctx.requestId,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: ctx.environment,
      },
    };
  }

  /**
   * Helper: Build paginated list response envelope
   */
  public listResponse<T>(
    items: T[],
    page: number,
    limit: number,
    total: number,
    ctx: APIRequestContext
  ): StandardListResponse<T> {
    return {
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        requestId: ctx.requestId,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: ctx.environment,
      },
    };
  }

  /**
   * Helper: Build standard error envelope
   */
  public errorResponse(
    code: string,
    message: string,
    ctx: APIRequestContext,
    details?: Record<string, any>
  ): StandardApiErrorResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        requestId: ctx.requestId,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: ctx.environment,
      },
    };
  }

  /**
   * Gateway Middleware: Authenticate, enforce rate limits, and resolve API Request Context
   */
  public async authenticateAndAuthorize(params: {
    rawKey?: string;
    authHeader?: string;
    requiredScope?: ApiScope;
    ip?: string;
    userAgent?: string;
    idempotencyKey?: string;
    path: string;
    method: string;
  }): Promise<{ ok: boolean; context?: APIRequestContext; errorResponse?: StandardApiErrorResponse; statusCode?: number }> {
    const startTime = performance.now();
    const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
    const clientIp = params.ip || '127.0.0.1';
    const userAgent = params.userAgent || 'External-API-Client/1.0';

    // 1. Resolve key
    let keyString = params.rawKey;
    if (!keyString && params.authHeader) {
      if (params.authHeader.startsWith('Bearer ')) {
        keyString = params.authHeader.substring(7).trim();
      } else {
        keyString = params.authHeader.trim();
      }
    }

    const defaultDummyCtx: APIRequestContext = {
      tenantId: 'unauthenticated',
      tenantName: 'Unknown',
      userId: 'anonymous',
      apiKeyId: 'none',
      keyName: 'Anonymous',
      scopes: [],
      ip: clientIp,
      userAgent,
      requestId,
      timestamp: new Date().toISOString(),
      environment: 'PRODUCTION',
    };

    if (!keyString) {
      const err = this.errorResponse('UNAUTHORIZED', 'Missing X-API-Key or Bearer token header', defaultDummyCtx);
      this.recordUsage(defaultDummyCtx, params.path, params.method, 401, startTime, 'UNAUTHORIZED');
      return { ok: false, errorResponse: err, statusCode: 401 };
    }

    // 2. Validate API Key
    const keyValidation = await apiKeyService.validateKey(keyString, undefined, clientIp);
    if (!keyValidation.valid || !keyValidation.record) {
      const code = keyValidation.error || 'INVALID_API_KEY';
      const msg = code === 'API_KEY_REVOKED' ? 'The provided API key has been revoked' :
                  code === 'API_KEY_EXPIRED' ? 'The provided API key has expired' :
                  code === 'IP_ADDRESS_RESTRICTED' ? 'Client IP is not authorized for this API key' :
                  'Invalid or unrecognized API key credential';
      const err = this.errorResponse(code, msg, defaultDummyCtx);
      this.recordUsage(defaultDummyCtx, params.path, params.method, 401, startTime, code);
      return { ok: false, errorResponse: err, statusCode: 401 };
    }

    const keyRecord = keyValidation.record;

    const ctx: APIRequestContext = {
      tenantId: keyRecord.tenantId,
      tenantName: keyRecord.tenantName,
      userId: keyRecord.createdBy,
      apiKeyId: keyRecord.id,
      keyName: keyRecord.name,
      scopes: keyRecord.scopes,
      ip: clientIp,
      userAgent,
      requestId,
      timestamp: new Date().toISOString(),
      environment: keyRecord.environment,
      idempotencyKey: params.idempotencyKey,
    };

    // 3. Check Scope
    if (params.requiredScope && !ctx.scopes.includes(params.requiredScope)) {
      const err = this.errorResponse(
        'FORBIDDEN_SCOPE',
        `API key is missing required scope '${params.requiredScope}'`,
        ctx,
        { requiredScope: params.requiredScope, grantedScopes: ctx.scopes }
      );
      this.recordUsage(ctx, params.path, params.method, 403, startTime, 'FORBIDDEN_SCOPE');
      return { ok: false, errorResponse: err, statusCode: 403 };
    }

    // 4. Rate Limiting Check
    const rateCheck = rateLimitService.checkRateLimit(keyRecord.id, keyRecord.tenantId, keyRecord.rateLimitPerMin);
    if (!rateCheck.allowed) {
      const code = rateCheck.reason || 'RATE_LIMIT_EXCEEDED';
      const msg = code === 'MONTHLY_QUOTA_EXHAUSTED'
        ? 'Monthly subscription API request quota exceeded for this tenant'
        : `Rate limit of ${rateCheck.limit} req/min exceeded. Please retry in ${rateCheck.resetSeconds}s.`;
      const err = this.errorResponse(code, msg, ctx, {
        limit: rateCheck.limit,
        resetSeconds: rateCheck.resetSeconds,
      });
      this.recordUsage(ctx, params.path, params.method, 429, startTime, code);
      return { ok: false, errorResponse: err, statusCode: 429 };
    }

    return { ok: true, context: ctx };
  }

  /**
   * Record telemetry usage
   */
  public recordUsage(
    ctx: APIRequestContext,
    endpoint: string,
    method: string,
    statusCode: number,
    startTime: number,
    error?: string,
    bytes?: number
  ) {
    const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
    apiUsageService.recordUsage({
      tenantId: ctx.tenantId,
      tenantName: ctx.tenantName,
      apiKeyId: ctx.apiKeyId,
      keyName: ctx.keyName,
      endpoint,
      method,
      statusCode,
      latencyMs,
      ip: ctx.ip,
      timestamp: new Date().toISOString(),
      environment: ctx.environment,
      error,
      bytesTransferred: bytes || (statusCode < 400 ? 1500 : 400),
    });
  }

  // ==========================================
  // RESOURCE 1: VEHICLES API (/api/v1/vehicles)
  // ==========================================
  public async getVehicles(
    ctx: APIRequestContext,
    params: {
      page?: number;
      limit?: number;
      status?: string;
      branch?: string;
      vehicleGroup?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<StandardListResponse<any>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 50));

    // Strict Tenant Filter (Tenant Isolation)
    let list = this.vehicles.filter(v => v.tenantId === ctx.tenantId || ctx.tenantId === mockTenant.id);

    if (params.status) {
      list = list.filter(v => v.status === params.status);
    }
    if (params.branch) {
      list = list.filter(v => v.branchId === params.branch);
    }
    if (params.vehicleGroup) {
      list = list.filter(v => v.groupName === params.vehicleGroup);
    }

    // Whitelisted Sorting
    const sortField = ['plateNumber', 'status', 'brand', 'model', 'groupName'].includes(params.sort || '')
      ? (params.sort as keyof Vehicle)
      : 'plateNumber';
    const isAsc = params.order !== 'desc';

    list.sort((a, b) => {
      const valA = String(a[sortField] || '');
      const valB = String(b[sortField] || '');
      return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    // Filter out unwanted internal fields
    const sanitized = paginated.map(v => ({
      id: v.id,
      plateNumber: v.plateNumber,
      brand: v.brand,
      model: v.model,
      year: v.year,
      type: v.type,
      fuelType: v.fuelType,
      fuelCapacityLiters: v.fuelCapacityLiters,
      status: v.status,
      tenantId: v.tenantId,
      branchId: v.branchId,
      currentDriverId: v.currentDriverId,
      gpsDeviceId: v.gpsDeviceId,
      odometerKm: v.odometerKm,
      groupName: v.groupName,
      maintenanceOverdue: v.maintenanceOverdue,
      updatedAt: new Date().toISOString(),
    }));

    return this.listResponse(sanitized, page, limit, total, ctx);
  }

  public async getVehicleById(ctx: APIRequestContext, id: string): Promise<any | null> {
    const vehicle = this.vehicles.find(v => v.id === id && (v.tenantId === ctx.tenantId || ctx.tenantId === mockTenant.id));
    if (!vehicle) return null;
    return {
      id: vehicle.id,
      plateNumber: vehicle.plateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      fuelType: vehicle.fuelType,
      fuelCapacityLiters: vehicle.fuelCapacityLiters,
      status: vehicle.status,
      tenantId: vehicle.tenantId,
      branchId: vehicle.branchId,
      currentDriverId: vehicle.currentDriverId,
      gpsDeviceId: vehicle.gpsDeviceId,
      odometerKm: vehicle.odometerKm,
      engineHours: vehicle.engineHours,
      groupName: vehicle.groupName,
      maintenanceOverdue: vehicle.maintenanceOverdue,
      stnkExpiry: vehicle.stnkExpiry,
      kirExpiry: vehicle.kirExpiry,
    };
  }

  public async createVehicle(ctx: APIRequestContext, payload: any): Promise<{ data: any; created: boolean }> {
    // Idempotency check
    if (ctx.idempotencyKey && this.idempotencyStore.has(ctx.idempotencyKey)) {
      return { data: this.idempotencyStore.get(ctx.idempotencyKey)!.response, created: false };
    }

    const newVehicle: Vehicle = {
      id: `veh_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      plateNumber: payload.plateNumber || 'B 1234 ABC',
      vin: payload.vin || `VIN${Date.now()}`,
      brand: payload.brand || 'Toyota',
      model: payload.model || 'Dyna',
      year: payload.year || 2024,
      type: payload.type || payload.vehicleType || 'truck_box',
      fuelType: payload.fuelType || 'diesel',
      fuelCapacityLiters: payload.fuelCapacityLiters || 100,
      status: 'idle',
      tenantId: ctx.tenantId,
      branchId: payload.branchId || 'br_cikarang',
      gpsDeviceId: payload.deviceId || payload.gpsDeviceId || `dev_${Date.now().toString(36)}`,
      odometerKm: payload.odometerKm || 0,
      engineHours: payload.engineHours || 0,
      groupName: payload.groupName || 'Armada Logistik',
      maintenanceOverdue: false,
      insuranceExpiry: '2027-01-01',
      stnkExpiry: '2027-01-01',
      kirExpiry: '2026-12-31',
    };

    this.vehicles.unshift(newVehicle);
    this.saveVehicles();

    // Trigger Webhook Event
    webhookService.dispatchEvent(ctx.tenantId, 'vehicle.created', newVehicle);

    if (ctx.idempotencyKey) {
      this.idempotencyStore.set(ctx.idempotencyKey, { response: newVehicle, timestamp: Date.now() });
    }

    return { data: newVehicle, created: true };
  }

  public async getVehicleLocation(ctx: APIRequestContext, id: string): Promise<any | null> {
    const vehicle = this.vehicles.find(v => v.id === id && (v.tenantId === ctx.tenantId || ctx.tenantId === mockTenant.id));
    if (!vehicle) return null;

    // Pull high precision unified telemetry from PROMPT 43 layer if exists
    const devices = gpsIntegrationService.getDevices();
    const liveDevice = devices.find(d => d.id === vehicle.gpsDeviceId || d.imei === vehicle.gpsDeviceId);
    const telemetry = vehicle.latestTelemetry;

    return {
      vehicleId: vehicle.id,
      plateNumber: vehicle.plateNumber,
      latitude: telemetry?.location.lat || (liveDevice ? -6.2088 : -6.2941),
      longitude: telemetry?.location.lng || (liveDevice ? 106.8456 : 106.8821),
      speed: telemetry?.location.speed || (vehicle.status === 'moving' ? 52.4 : 0),
      heading: telemetry?.location.heading || 120,
      ignition: telemetry?.ignition ?? (vehicle.status === 'moving'),
      timestamp: telemetry?.timestamp || new Date().toISOString(),
      accuracy: 98.5,
      address: telemetry?.location.address || 'Kawasan Industri MM2100, Cikarang Barat, Bekasi',
    };
  }

  public async getVehicleTelemetry(ctx: APIRequestContext, id: string): Promise<any | null> {
    const vehicle = this.vehicles.find(v => v.id === id && (v.tenantId === ctx.tenantId || ctx.tenantId === mockTenant.id));
    if (!vehicle) return null;
    const telemetry = vehicle.latestTelemetry;

    return {
      vehicleId: vehicle.id,
      plateNumber: vehicle.plateNumber,
      speed: telemetry?.location.speed || (vehicle.status === 'moving' ? 62.5 : 0),
      fuelLevelPercent: telemetry?.fuelLevelPercent || 78.4,
      fuelLevelLiters: telemetry?.fuelLevelLiters || 156.8,
      temperatureCelsius: telemetry?.engineTempCelsius || 86.2,
      batteryVoltage: telemetry?.batteryVoltage || 24.2,
      odometerKm: telemetry?.odometerKm || vehicle.odometerKm,
      engineHours: telemetry?.engineHours || vehicle.engineHours,
      ignition: telemetry?.ignition ?? (vehicle.status === 'moving' || vehicle.status === 'idle'),
      engineRpm: telemetry?.engineRpm || (vehicle.status === 'moving' ? 1650 : (vehicle.status === 'idle' ? 750 : 0)),
      source: 'Unified Telematics Adapter v1 (PROMPT 43)',
    };
  }

  // ==========================================
  // RESOURCE 2: DRIVERS API (/api/v1/drivers)
  // ==========================================
  public async getDrivers(
    ctx: APIRequestContext,
    params: { page?: number; limit?: number; status?: string }
  ): Promise<StandardListResponse<any>> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 50));
    const hasPiiScope = ctx.scopes.includes('drivers:pii');

    let list = this.drivers.filter(d => d.tenantId === ctx.tenantId || ctx.tenantId === mockTenant.id);
    if (params.status) list = list.filter(d => d.status === params.status);

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    // Apply Data Masking for PII (Sensitive fields)
    const sanitized = paginated.map(d => ({
      id: d.id,
      name: d.name,
      nik: hasPiiScope ? d.nik : '••••••••••••••••',
      phone: hasPiiScope ? d.phone : (d.phone ? `${d.phone.substring(0, 6)}****${d.phone.slice(-3)}` : 'N/A'),
      status: d.status,
      license: hasPiiScope ? `${d.simType} - ${d.simNumber}` : `${d.simType} (Masked)`,
      licenseExpiry: d.simExpiry,
      vehicleAssignment: d.assignedVehicleId,
      shift: 'Pagi (08:00 - 17:00)',
      safetyScore: d.score?.safetyScore || 92,
      overallScore: d.score?.overallScore || 90,
      totalTripsCompleted: d.totalTripsCompleted || 0,
    }));

    return this.listResponse(sanitized, page, limit, total, ctx);
  }

  public async assignDriver(
    ctx: APIRequestContext,
    driverId: string,
    payload: { vehicleId: string; shift?: string }
  ): Promise<any | null> {
    const driver = this.drivers.find(d => d.id === driverId && (d.tenantId === ctx.tenantId || ctx.tenantId === mockTenant.id));
    if (!driver) return null;

    driver.assignedVehicleId = payload.vehicleId;
    this.saveDrivers();

    apiAuditService.record({
      tenantId: ctx.tenantId,
      actor: `API (${ctx.keyName})`,
      action: 'API_KEY_SCOPES_UPDATED',
      target: `Driver ${driver.name} assigned to Vehicle ${payload.vehicleId}`,
    });

    return {
      driverId: driver.id,
      driverName: driver.name,
      assignedVehicleId: payload.vehicleId,
      shift: payload.shift || 'Reguler',
      assignedAt: new Date().toISOString(),
    };
  }

  // ==========================================
  // RESOURCE 3: GPS API (/api/v1/gps)
  // ==========================================
  public async getGpsDevices(ctx: APIRequestContext): Promise<StandardApiResponse<any>> {
    const devices = gpsIntegrationService.getDevices();
    const mapped = devices.map(d => ({
      id: d.id,
      imei: d.imei,
      serialNumber: d.serialNumber,
      manufacturer: d.manufacturer,
      model: d.model,
      protocol: d.protocol,
      serverHost: d.serverHost,
      serverPort: d.serverPort,
      simProvider: d.simProvider,
      status: d.status,
      firmware: d.firmware,
      timezone: d.timezone,
    }));
    return this.successResponse(mapped, ctx);
  }

  public async sendGpsCommand(
    ctx: APIRequestContext,
    deviceId: string,
    payload: { commandType: string; params?: any; confirmedHighRisk?: boolean }
  ): Promise<any> {
    const isHighRisk = ['LOCK_ENGINE', 'UNLOCK_ENGINE', 'UPDATE_FIRMWARE', 'CLEAR_BUFFER'].includes(payload.commandType);
    if (isHighRisk && !payload.confirmedHighRisk) {
      throw {
        code: 'HIGH_RISK_CONFIRMATION_REQUIRED',
        message: 'High-risk remote commands require confirmedHighRisk=true in request body.',
      };
    }

    apiAuditService.record({
      tenantId: ctx.tenantId,
      actor: `API Key (${ctx.keyName})`,
      action: 'SENSITIVE_COMMAND_SENT',
      target: `GPS Device ${deviceId} - Command: ${payload.commandType}`,
      details: { params: payload.params, isHighRisk },
    });

    return {
      commandId: `cmd_${Date.now().toString(36)}`,
      deviceId,
      commandType: payload.commandType,
      status: 'QUEUED_FOR_DISPATCH',
      transport: 'TCP / Protocol Codec',
      queuedAt: new Date().toISOString(),
    };
  }

  // ==========================================
  // RESOURCE 4: TRIPS API (/api/v1/trips)
  // ==========================================
  public async getTrips(ctx: APIRequestContext): Promise<StandardApiResponse<any>> {
    const sanitized = this.trips.map(t => ({
      id: t.id,
      tripNumber: t.tripNumber,
      vehicleId: t.vehicleId,
      driverId: t.driverId,
      origin: t.origin,
      destination: t.destination,
      plannedDistanceKm: t.plannedDistanceKm,
      actualDistanceKm: t.actualDistanceKm,
      plannedDurationHours: t.plannedDurationHours,
      status: t.status,
      startTime: t.startTime,
      endTime: t.endTime,
      cargoDescription: t.cargoDescription,
      cargoWeightKg: t.cargoWeightKg,
    }));
    return this.successResponse(sanitized, ctx);
  }

  public async getTripRoute(ctx: APIRequestContext, tripId: string): Promise<any | null> {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return null;

    return {
      tripId: trip.id,
      tripNumber: trip.tripNumber,
      vehicleId: trip.vehicleId,
      coordinates: trip.routePolyline || [
        { lat: trip.originCoords.lat, lng: trip.originCoords.lng, speed: 0 },
        { lat: trip.destinationCoords.lat, lng: trip.destinationCoords.lng, speed: 45 },
      ],
      stops: trip.stops,
    };
  }

  // ==========================================
  // RESOURCE 5: GEOFENCES API (/api/v1/geofences)
  // ==========================================
  public async getGeofences(ctx: APIRequestContext): Promise<StandardApiResponse<any>> {
    return this.successResponse(this.geofences, ctx);
  }

  // ==========================================
  // RESOURCE 6: ALERTS API (/api/v1/alerts)
  // ==========================================
  public async getAlerts(
    ctx: APIRequestContext,
    params: { severity?: string; type?: string }
  ): Promise<StandardApiResponse<any>> {
    let list = this.alerts;
    if (params.severity) list = list.filter(a => a.severity === params.severity);
    if (params.type) list = list.filter(a => a.category === params.type);
    return this.successResponse(list, ctx);
  }

  public async acknowledgeAlert(ctx: APIRequestContext, alertId: string): Promise<any | null> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return null;
    alert.read = true;
    alert.actionRequired = false;
    return { alertId: alert.id, read: true, actionRequired: false, acknowledgedAt: new Date().toISOString() };
  }

  public async resolveAlert(ctx: APIRequestContext, alertId: string): Promise<any | null> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return null;
    alert.read = true;
    alert.actionRequired = false;
    webhookService.dispatchEvent(ctx.tenantId, 'alert.resolved', alert);
    return { alertId: alert.id, status: 'resolved', resolvedAt: new Date().toISOString() };
  }

  // ==========================================
  // RESOURCE 7: REPORTS API (Async Engine)
  // ==========================================
  public async createReportJob(
    ctx: APIRequestContext,
    payload: {
      reportType: ReportJob['reportType'];
      format: 'PDF' | 'CSV' | 'XLSX';
      dateFrom?: string;
      dateTo?: string;
      filters?: any;
    }
  ): Promise<ReportJob> {
    const job: ReportJob = {
      id: `job_rep_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      tenantId: ctx.tenantId,
      reportType: payload.reportType || 'fleet',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      format: payload.format || 'PDF',
      progress: 10,
      filters: payload.filters || { dateFrom: payload.dateFrom, dateTo: payload.dateTo },
    };

    this.reportJobs.unshift(job);
    this.saveReports();

    // Simulate async progression in background
    setTimeout(() => {
      job.status = 'PROCESSING';
      job.progress = 60;
      this.saveReports();
      setTimeout(() => {
        job.status = 'COMPLETED';
        job.progress = 100;
        job.completedAt = new Date().toISOString();
        job.downloadUrl = `/api/v1/reports/jobs/${job.id}/download`;
        job.rowCount = 120 + Math.floor(Math.random() * 800);
        job.fileSize = `${(Math.random() * 3 + 0.8).toFixed(1)} MB`;
        this.saveReports();
      }, 3000);
    }, 1500);

    return job;
  }

  public async getReportJob(ctx: APIRequestContext, jobId: string): Promise<ReportJob | null> {
    const job = this.reportJobs.find(j => j.id === jobId && (j.tenantId === ctx.tenantId || ctx.tenantId === mockTenant.id));
    return job || null;
  }

  // ==========================================
  // RESOURCE 8: AI PREDICTIVE API (/api/v1/ai)
  // ==========================================
  public async analyzeFleet(ctx: APIRequestContext, payload: any): Promise<any> {
    return {
      tenantId: ctx.tenantId,
      fleetHealthScore: 92.4,
      totalVehiclesAnalyzed: this.vehicles.length,
      utilizationRatePercent: 78.6,
      efficiencyMetrics: {
        averageKmPerLiter: 3.42,
        excessiveIdleHoursToday: 4.8,
        potentialCostSavingsIdr: 12800000,
      },
      anomalies: [
        {
          vehicleId: 'veh_01',
          plateNumber: 'B 9211 TJP',
          type: 'EXCESSIVE_IDLE_AFTER_DISPATCH',
          severity: 'MEDIUM',
          probability: 0.88,
          description: 'Unit mengalami idle 45 menit di Depo Cikarang dengan AC aktif sebelum moving.',
        },
      ],
      recommendations: [
        'Aktifkan auto-engine cutoff alert setelah 15 menit idle berkepanjangan.',
        'Jadwalkan balancing muatan pada rute Trans-Jawa Timur untuk menekan konsumsi BBM.',
      ],
      aiProvider: 'Google Gemini 2.5 Flash Enterprise + Telematics Rule Engine',
      generatedAt: new Date().toISOString(),
    };
  }

  public async analyzeFuel(ctx: APIRequestContext, payload: any): Promise<any> {
    return {
      tenantId: ctx.tenantId,
      overallEfficiencyRating: 'OPTIMAL_GRADE_A',
      suspectedAnomaliesCount: 1,
      anomalies: [
        {
          vehicleId: 'veh_01',
          plateNumber: 'B 9211 TJP',
          dropAmountLiters: 18.5,
          timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
          location: 'Rest Area KM 57 Tol Japek',
          phrasing: 'Possible rapid fuel volume reduction detected while vehicle parked. Suspected fuel siphon or sensor fluctuation.',
          confidenceScore: 0.84,
        },
      ],
      recommendations: [
        'Lakukan verifikasi visual pada tangki BBM unit B 9211 TJP di Depo tujuan.',
        'Kalibrasi ulang sensor level ultrasonik/resistif pada servis berkala berikutnya.',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  public async askAssistant(ctx: APIRequestContext, message: string): Promise<any> {
    const movingCount = this.vehicles.filter(v => v.status === 'moving').length;
    const idleCount = this.vehicles.filter(v => v.status === 'idle').length;
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;

    let reply = `Halo! Saya Fleet Intelligence AI Gateway Assistant untuk tenant ${ctx.tenantName}.\n\n`;
    reply += `Status armada real-time:\n`;
    reply += `• Total Kendaraan: ${this.vehicles.length} unit (${movingCount} bergerak, ${idleCount} idle/parkir)\n`;
    reply += `• Peringatan Kritis Aktif: ${criticalAlerts} insiden\n`;
    reply += `• Tingkat Efisiensi Rute: 94.2%\n\n`;
    reply += `Permintaan Anda: "${message}" telah diproses dalam konteks scope API '${ctx.scopes.join(', ')}'.`;

    return {
      reply,
      text: reply,
      telemetryContext: {
        totalVehicles: this.vehicles.length,
        movingVehicles: movingCount,
        criticalAlerts,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}

export const externalApiService = new ExternalAPIService();
