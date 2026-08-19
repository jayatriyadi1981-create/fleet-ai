/**
 * Fleet Intelligence Smart AI - GPS & Telematics Ingestion Security Service
 * PROMPT 50 - Device Authentication, Telemetry Bounds Check & Quarantine Engine
 */

import { GpsDeviceSecurityProfile, GpsTelemetryPayload } from '../types/securityTypes';
import { auditService } from '../../audit/services/auditService';
import { encryptionService } from './encryptionService';

export interface TelemetryValidationResult {
  valid: boolean;
  status: 'ACCEPTED' | 'QUARANTINED' | 'REJECTED';
  reason?: string;
  sanitizedPayload?: GpsTelemetryPayload;
}

export class GpsSecurityService {
  private static instance: GpsSecurityService;
  private deviceRegistry: Map<string, GpsDeviceSecurityProfile> = new Map();
  private quarantineLogs: Array<{
    id: string;
    imei: string;
    timestamp: string;
    reason: string;
    rawPayload: any;
    resolved: boolean;
  }> = [];

  private constructor() {
    this.seedDevices();
  }

  public static getInstance(): GpsSecurityService {
    if (!GpsSecurityService.instance) {
      GpsSecurityService.instance = new GpsSecurityService();
    }
    return GpsSecurityService.instance;
  }

  private seedDevices(): void {
    const devices: GpsDeviceSecurityProfile[] = [
      {
        imei: '867543029100121',
        deviceId: 'GPS-JKT-001',
        tenantId: 'tenant_default',
        deviceName: 'Hino 500 Wingbox (B 9102 KXA)',
        protocol: 'GT06',
        status: 'AUTHENTICATED',
        lastSeenAt: new Date().toISOString(),
        lastIp: '114.124.89.201',
        failedAuthCount: 0,
        secretConfigured: true,
      },
      {
        imei: '867543029100122',
        deviceId: 'GPS-SBY-002',
        tenantId: 'tenant_default',
        deviceName: 'Mitsubishi Fuso Fighter (L 8412 UP)',
        protocol: 'TELTONIKA',
        status: 'AUTHENTICATED',
        lastSeenAt: new Date(Date.now() - 30000).toISOString(),
        lastIp: '180.252.11.44',
        failedAuthCount: 0,
        secretConfigured: true,
      },
      {
        imei: '867543029100123',
        deviceId: 'GPS-BDG-003',
        tenantId: 'tenant_default',
        deviceName: 'Isuzu Giga FVZ (D 9301 AB)',
        protocol: 'QUECLINK',
        status: 'AUTHENTICATED',
        lastSeenAt: new Date(Date.now() - 60000).toISOString(),
        lastIp: '114.124.90.12',
        failedAuthCount: 0,
        secretConfigured: true,
      },
      {
        imei: '354891028300999',
        deviceId: 'GPS-UNKNOWN-999',
        tenantId: 'tenant_default',
        deviceName: 'Unrecognized Tracker Probe',
        protocol: 'JT808',
        status: 'QUARANTINED',
        lastSeenAt: new Date(Date.now() - 120000).toISOString(),
        lastIp: '45.134.22.9',
        failedAuthCount: 4,
        secretConfigured: false,
        quarantineReason: 'Invalid IMEI checksum & Missing Device Secret Token',
      },
    ];

    devices.forEach((d) => this.deviceRegistry.set(d.imei, d));
  }

  /**
   * Authenticate and validate GPS telemetry payload before database ingestion
   */
  public validateAndIngestTelemetry(payload: GpsTelemetryPayload, sourceIp: string = '127.0.0.1'): TelemetryValidationResult {
    const { imei, latitude, longitude, speed, heading, timestamp, fuelLevelPercent } = payload;

    // 1. Device Registration Check
    const device = this.deviceRegistry.get(imei);
    if (!device) {
      // Quarantine unknown device
      const reason = `Unknown device IMEI [${imei}] not registered in tenant pool`;
      this.recordQuarantine(imei, reason, payload);

      auditService.logSecurityEvent({
        tenantId: 'tenant_default',
        action: 'UNAUTHORIZED_ACCESS',
        severity: 'HIGH',
        actor: {
          actorId: imei,
          actorType: 'DEVICE',
          tenantId: 'tenant_default',
        },
        description: `GPS GATEWAY BLOCKED: ${reason}`,
        securityMetadata: {
          ipAddress: sourceIp,
          isSuspicious: true,
          riskScore: 85,
        },
      });

      return {
        valid: false,
        status: 'QUARANTINED',
        reason,
      };
    }

    // 2. Blocked status check
    if (device.status === 'BLOCKED') {
      return {
        valid: false,
        status: 'REJECTED',
        reason: `Device [${imei}] is administrative locked / blocked.`,
      };
    }

    // 3. Mathematical Coordinate & Telemetry Bounds Validation
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      const reason = `GPS Spoofing / Invalid coordinates: lat ${latitude}, lng ${longitude}`;
      this.recordQuarantine(imei, reason, payload);
      return { valid: false, status: 'QUARANTINED', reason };
    }

    // 4. Speed anomaly check (> 220 km/h is impossible for standard commercial fleet)
    if (speed < 0 || speed > 220) {
      const reason = `Impossible speed telemetry: ${speed} km/h`;
      this.recordQuarantine(imei, reason, payload);
      return { valid: false, status: 'QUARANTINED', reason };
    }

    // 5. Fuel sanity check
    if (fuelLevelPercent !== undefined && (fuelLevelPercent < 0 || fuelLevelPercent > 100)) {
      payload.fuelLevelPercent = Math.max(0, Math.min(100, fuelLevelPercent));
    }

    // 6. Heading bounds
    const normalizedHeading = ((heading % 360) + 360) % 360;

    // Update device profile stats
    device.lastSeenAt = new Date().toISOString();
    device.lastIp = sourceIp;
    this.deviceRegistry.set(imei, device);

    return {
      valid: true,
      status: 'ACCEPTED',
      sanitizedPayload: {
        ...payload,
        heading: normalizedHeading,
      },
    };
  }

  private recordQuarantine(imei: string, reason: string, rawPayload: any): void {
    this.quarantineLogs.unshift({
      id: `quar_${encryptionService.generateSecureRandomHex(6)}`,
      imei,
      timestamp: new Date().toISOString(),
      reason,
      rawPayload,
      resolved: false,
    });
    if (this.quarantineLogs.length > 50) this.quarantineLogs.pop();
  }

  public getDeviceSecurityProfiles(): GpsDeviceSecurityProfile[] {
    return Array.from(this.deviceRegistry.values());
  }

  public getQuarantineLogs() {
    return [...this.quarantineLogs];
  }

  public releaseDeviceFromQuarantine(imei: string): void {
    const dev = this.deviceRegistry.get(imei);
    if (dev) {
      dev.status = 'AUTHENTICATED';
      dev.failedAuthCount = 0;
      dev.quarantineReason = undefined;
      this.deviceRegistry.set(imei, dev);
    }
  }
}

export const gpsSecurityService = GpsSecurityService.getInstance();
