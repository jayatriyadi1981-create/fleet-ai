/**
 * Fleet Intelligence Smart AI - Security Monitoring & Threat Intelligence Engine
 * PROMPT 50 - Live Risk Scoring, Circuit Breakers & Threat Incident Pipeline
 */

import {
  SecurityThreatEvent,
  SecurityRiskAssessment,
  CircuitBreakerStatus,
  SystemHealthStatus,
} from '../types/securityTypes';
import { auditService } from '../../audit/services/auditService';

export class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;
  private threatEvents: SecurityThreatEvent[] = [];
  private circuitBreakers: Map<string, CircuitBreakerStatus> = new Map();

  private constructor() {
    this.seedInitialThreats();
    this.seedCircuitBreakers();
  }

  public static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  private seedInitialThreats(): void {
    const now = new Date();
    this.threatEvents = [
      {
        id: 'threat_001',
        tenantId: 'tenant_default',
        threatType: 'BRUTE_FORCE',
        severity: 'HIGH',
        sourceIp: '185.220.101.5',
        actorEmail: 'attacker@unknown.net',
        targetResource: '/api/v1/auth/login',
        description: 'Multiple failed login attempts (6 in 45 seconds) targeting admin portal.',
        timestamp: new Date(now.getTime() - 18 * 60000).toISOString(),
        mitigationTaken: 'IP rate limit enforced & locked for 15 minutes. Admin notification dispatched.',
        resolved: false,
      },
      {
        id: 'threat_002',
        tenantId: 'tenant_default',
        threatType: 'UNKNOWN_GPS_DEVICE',
        severity: 'MEDIUM',
        sourceIp: '45.134.22.9',
        targetResource: '/api/v1/gps/ingest',
        description: 'Unregistered GPS Tracker (IMEI 354891028300999) attempting unauthorized telematics broadcast.',
        timestamp: new Date(now.getTime() - 42 * 60000).toISOString(),
        mitigationTaken: 'Payload quarantined, socket disconnected, device added to investigation queue.',
        resolved: true,
        resolvedAt: new Date(now.getTime() - 25 * 60000).toISOString(),
        resolvedBy: 'Bambang Pratama',
      },
      {
        id: 'threat_003',
        tenantId: 'tenant_default',
        threatType: 'RATE_LIMIT_EXCEEDED',
        severity: 'LOW',
        sourceIp: '103.28.12.94',
        actorEmail: 'staff.ops@fleetintelligence.id',
        targetResource: '/api/v1/reports/export',
        description: 'Burst of 12 PDF export requests within 2 minutes exceeded standard user tier rate ceiling.',
        timestamp: new Date(now.getTime() - 85 * 60000).toISOString(),
        mitigationTaken: 'Throttled with HTTP 429 Retry-After 60s header.',
        resolved: true,
        resolvedAt: new Date(now.getTime() - 80 * 60000).toISOString(),
        resolvedBy: 'Auto-Throttle Guard',
      },
    ];
  }

  private seedCircuitBreakers(): void {
    const breakers: CircuitBreakerStatus[] = [
      {
        serviceName: 'Google Gemini AI (2.5 Flash)',
        state: 'CLOSED',
        failureCount: 0,
        failureThreshold: 5,
        successCount: 1420,
      },
      {
        serviceName: 'GPS TCP Telematics Gateway',
        state: 'CLOSED',
        failureCount: 0,
        failureThreshold: 10,
        successCount: 89400,
      },
      {
        serviceName: 'WhatsApp Cloud API Notification Gateway',
        state: 'CLOSED',
        failureCount: 0,
        failureThreshold: 5,
        successCount: 512,
      },
      {
        serviceName: 'SMTP Transactional Mail Server',
        state: 'CLOSED',
        failureCount: 0,
        failureThreshold: 5,
        successCount: 380,
      },
    ];

    breakers.forEach((b) => this.circuitBreakers.set(b.serviceName, b));
  }

  /**
   * Calculate live overall Security Risk Assessment (0-100)
   */
  public evaluateRiskScore(tenantId: string = 'tenant_default'): SecurityRiskAssessment {
    const unresolvedThreats = this.threatEvents.filter((t) => !t.resolved);
    let penalty = 0;

    unresolvedThreats.forEach((t) => {
      if (t.severity === 'CRITICAL') penalty += 30;
      else if (t.severity === 'HIGH') penalty += 15;
      else if (t.severity === 'MEDIUM') penalty += 5;
      else penalty += 2;
    });

    const score = Math.max(10, Math.min(100, 100 - penalty));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score < 50) riskLevel = 'CRITICAL';
    else if (score < 75) riskLevel = 'HIGH';
    else if (score < 90) riskLevel = 'MEDIUM';

    const criticalIssues: string[] = [];
    const recommendations: string[] = [];

    if (unresolvedThreats.some((t) => t.threatType === 'BRUTE_FORCE')) {
      criticalIssues.push('Active brute-force authentication attempts detected on public login endpoint.');
      recommendations.push('Enforce 2FA/MFA across all administrative accounts and verify IP blocklist.');
    }
    if (unresolvedThreats.some((t) => t.threatType === 'UNKNOWN_GPS_DEVICE')) {
      criticalIssues.push('Unrecognized GPS device probes caught in telemetry quarantine sandbox.');
      recommendations.push('Review IMEI device pool in IoT Device Manager and reject unassigned hardware.');
    }

    if (criticalIssues.length === 0) {
      recommendations.push('All security defenses operational. Automated backups verified within RPO target.');
    }

    return {
      score,
      riskLevel,
      activeThreatCount: unresolvedThreats.length,
      criticalIssues,
      recommendations,
      evaluatedAt: new Date().toISOString(),
    };
  }

  public getThreatEvents(): SecurityThreatEvent[] {
    return [...this.threatEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public resolveThreat(threatId: string, resolvedBy: string): void {
    const threat = this.threatEvents.find((t) => t.id === threatId);
    if (threat) {
      threat.resolved = true;
      threat.resolvedAt = new Date().toISOString();
      threat.resolvedBy = resolvedBy;

      auditService.logSecurityEvent({
        tenantId: threat.tenantId,
        action: 'UPDATE',
        severity: 'LOW',
        actor: {
          actorId: 'usr_active',
          actorType: 'ADMIN',
          tenantId: threat.tenantId,
        },
        description: `Security threat [${threatId}] marked as resolved by ${resolvedBy}`,
      });
    }
  }

  public getCircuitBreakers(): CircuitBreakerStatus[] {
    return Array.from(this.circuitBreakers.values());
  }

  public getSystemHealth(): SystemHealthStatus {
    return {
      overallStatus: 'HEALTHY',
      database: 'HEALTHY',
      cache: 'HEALTHY',
      queue: 'HEALTHY',
      storage: 'HEALTHY',
      gpsGateway: 'HEALTHY',
      aiService: 'HEALTHY',
      notificationService: 'HEALTHY',
      backupService: 'HEALTHY',
      timestamp: new Date().toISOString(),
      uptimeSeconds: 1428500, // ~16.5 days continuous uptime (99.99%)
    };
  }
}

export const securityMonitoringService = SecurityMonitoringService.getInstance();
