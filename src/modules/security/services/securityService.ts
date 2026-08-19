/**
 * Fleet Intelligence Smart AI - Centralized Enterprise Security Service Facade
 * PROMPT 50 - Single Gateway for Authentication, Authorization, Isolation, Cryptography, & Health
 */

import { encryptionService } from './encryptionService';
import { secretManager } from './secretManager';
import { sessionService } from './sessionService';
import { dataIsolationService } from './dataIsolationService';
import { rateLimitService } from './rateLimitService';
import { securityPolicyService } from './securityPolicyService';
import { gpsSecurityService } from './gpsSecurityService';
import { fileSecurityService } from './fileSecurityService';
import { backupService } from './backupService';
import { securityMonitoringService } from './securityMonitoringService';
import { errorHandlingService } from './errorHandlingService';
import { securityTestingSuite } from './securityTestingSuite';
import { auditService } from '../../audit/services/auditService';
import { ApiKeyDefinition, WebhookSecurityConfig } from '../types/securityTypes';

export class SecurityService {
  private static instance: SecurityService;

  private apiKeys: Map<string, ApiKeyDefinition> = new Map();
  private webhooks: Map<string, WebhookSecurityConfig> = new Map();

  private constructor() {
    this.seedApiKeys();
    this.seedWebhooks();
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private seedApiKeys(): void {
    const keys: ApiKeyDefinition[] = [
      {
        id: 'key_live_01',
        tenantId: 'tenant_default',
        name: 'SAP ERP Logistics Sync Service',
        prefix: 'sk_live_',
        maskedKey: 'sk_live_••••••••9a7F',
        scopes: ['vehicle.read', 'trip.read', 'trip.write', 'delivery.write'],
        allowedIps: ['103.28.12.10', '103.28.12.11'],
        rateLimitPerMin: 300,
        createdAt: '2026-06-01T08:00:00Z',
        lastUsedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        createdBy: 'Bambang Pratama',
        status: 'ACTIVE',
      },
      {
        id: 'key_live_02',
        tenantId: 'tenant_default',
        name: 'GPS Telematics Gateway Ingestion Key',
        prefix: 'sk_live_',
        maskedKey: 'sk_live_••••••••41bC',
        scopes: ['gps.read', 'gps.write', 'telemetry.ingest'],
        allowedIps: ['180.252.164.0/24'],
        rateLimitPerMin: 1200,
        createdAt: '2026-05-15T10:00:00Z',
        lastUsedAt: new Date(Date.now() - 30000).toISOString(),
        createdBy: 'Bambang Pratama',
        status: 'ACTIVE',
      },
      {
        id: 'key_test_03',
        tenantId: 'tenant_default',
        name: 'Warehouse TMS Staging Webhook',
        prefix: 'sk_test_',
        maskedKey: 'sk_test_••••••••2e88',
        scopes: ['trip.read', 'report.read'],
        rateLimitPerMin: 60,
        createdAt: '2026-08-01T12:00:00Z',
        lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
        createdBy: 'Siti Nurhaliza',
        status: 'ACTIVE',
      },
    ];

    keys.forEach((k) => this.apiKeys.set(k.id, k));
  }

  private seedWebhooks(): void {
    const hooks: WebhookSecurityConfig[] = [
      {
        id: 'wh_erp_01',
        tenantId: 'tenant_default',
        name: 'SAP ERP Dispatch Notification Webhook',
        targetUrl: 'https://erp.enterprise-corp.id/api/v2/fleet/dispatch-events',
        secretKeyMasked: 'whsec_••••••••81a2',
        signatureHeader: 'X-Fleet-Signature-256',
        hmacAlgorithm: 'SHA256',
        replayWindowSeconds: 300,
        enabled: true,
        failureCount: 0,
        circuitState: 'CLOSED',
        lastDeliveredAt: new Date(Date.now() - 8 * 60000).toISOString(),
      },
      {
        id: 'wh_slack_02',
        tenantId: 'tenant_default',
        name: 'Incident Response Ops Webhook',
        targetUrl: 'https://hooks.slack.com/services/T00/B00/REDACTED',
        secretKeyMasked: 'whsec_••••••••90cf',
        signatureHeader: 'X-Fleet-Signature-256',
        hmacAlgorithm: 'SHA256',
        replayWindowSeconds: 300,
        enabled: true,
        failureCount: 0,
        circuitState: 'CLOSED',
        lastDeliveredAt: new Date(Date.now() - 25 * 60000).toISOString(),
      },
    ];

    hooks.forEach((h) => this.webhooks.set(h.id, h));
  }

  // Access to sub-services
  public get crypto() {
    return encryptionService;
  }

  public get secrets() {
    return secretManager;
  }

  public get sessions() {
    return sessionService;
  }

  public get isolation() {
    return dataIsolationService;
  }

  public get rateLimiter() {
    return rateLimitService;
  }

  public get policy() {
    return securityPolicyService;
  }

  public get gps() {
    return gpsSecurityService;
  }

  public get files() {
    return fileSecurityService;
  }

  public get backup() {
    return backupService;
  }

  public get monitoring() {
    return securityMonitoringService;
  }

  public get error() {
    return errorHandlingService;
  }

  public get tester() {
    return securityTestingSuite;
  }

  // API Key Management methods
  public getApiKeys(tenantId: string = 'tenant_default'): ApiKeyDefinition[] {
    return Array.from(this.apiKeys.values()).filter(
      (k) => k.tenantId === tenantId || k.tenantId === 'GLOBAL'
    );
  }

  public createApiKey(params: {
    tenantId: string;
    name: string;
    scopes: string[];
    allowedIps?: string[];
    rateLimitPerMin?: number;
    createdBy: string;
  }): { keyDefinition: ApiKeyDefinition; rawKey: string } {
    const { rawKey, maskedKey } = encryptionService.generateApiKey('live');
    const id = `key_${encryptionService.generateSecureRandomHex(8)}`;

    const def: ApiKeyDefinition = {
      id,
      tenantId: params.tenantId,
      name: params.name,
      prefix: 'sk_live_',
      maskedKey,
      scopes: params.scopes,
      allowedIps: params.allowedIps,
      rateLimitPerMin: params.rateLimitPerMin || 120,
      createdAt: new Date().toISOString(),
      createdBy: params.createdBy,
      status: 'ACTIVE',
    };

    this.apiKeys.set(id, def);

    auditService.logSecurityEvent({
      tenantId: params.tenantId,
      action: 'CREATE',
      severity: 'HIGH',
      actor: {
        actorId: 'usr_active',
        actorType: 'ADMIN',
        actorEmail: params.createdBy,
        tenantId: params.tenantId,
      },
      description: `New API Key [${params.name}] created with scopes: ${params.scopes.join(', ')}`,
    });

    return { keyDefinition: def, rawKey };
  }

  public revokeApiKey(keyId: string, tenantId: string, revokedBy: string): boolean {
    const key = this.apiKeys.get(keyId);
    if (!key) return false;

    key.status = 'REVOKED';
    this.apiKeys.set(keyId, key);

    auditService.logSecurityEvent({
      tenantId,
      action: 'UPDATE',
      severity: 'HIGH',
      actor: {
        actorId: 'usr_active',
        actorType: 'ADMIN',
        actorEmail: revokedBy,
        tenantId,
      },
      description: `API Key [${key.name}] was REVOKED by ${revokedBy}`,
    });

    return true;
  }

  public getWebhooks(tenantId: string = 'tenant_default'): WebhookSecurityConfig[] {
    return Array.from(this.webhooks.values()).filter((w) => w.tenantId === tenantId);
  }
}

export const securityService = SecurityService.getInstance();
