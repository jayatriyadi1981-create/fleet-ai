/**
 * Fleet Intelligence Smart AI - Enterprise Security Policy & Governance Engine
 * PROMPT 50 - Configurable Policies, Versioning & Audit Compliance
 */

import { SecurityPolicyConfig, PolicyVersionRecord } from '../types/securityTypes';
import { auditService } from '../../audit/services/auditService';

export class SecurityPolicyService {
  private static instance: SecurityPolicyService;
  private policies: Map<string, SecurityPolicyConfig> = new Map();
  private versionHistory: PolicyVersionRecord[] = [];

  private constructor() {
    this.seedDefaultPolicy();
  }

  public static getInstance(): SecurityPolicyService {
    if (!SecurityPolicyService.instance) {
      SecurityPolicyService.instance = new SecurityPolicyService();
    }
    return SecurityPolicyService.instance;
  }

  private seedDefaultPolicy(): void {
    const defaultPolicy: SecurityPolicyConfig = {
      id: 'pol_enterprise_default',
      tenantId: 'tenant_default',
      version: 3,
      updatedAt: '2026-08-15T09:30:00Z',
      updatedBy: 'Bambang Pratama (Chief Security Officer)',
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        historyCount: 5,
        maxAgeDays: 90,
        maxFailedAttempts: 5,
        lockoutDurationMinutes: 15,
      },
      sessionPolicy: {
        idleTimeoutMinutes: 30,
        absoluteTimeoutHours: 8,
        maxConcurrentSessionsPerUser: 3,
        enforceMfaForRoles: ['super_admin', 'company_admin', 'owner', 'director', 'finance'],
        rotateSessionOnPrivilegeChange: true,
        requireReauthForSensitiveActions: true,
      },
      apiPolicy: {
        rateLimitPerMinute: 120,
        burstLimit: 150,
        enforceHttps: true,
        corsAllowedOrigins: ['https://fleetintelligence.id', 'https://api.fleetintelligence.id'],
        requireHmacWebhooks: true,
        ipAllowlist: ['103.28.12.0/24', '180.252.164.0/24'],
        enableIpAllowlist: false,
      },
      aiPolicy: {
        requireApprovalForDestructiveActions: true,
        maxTokensPerRequest: 4096,
        redactPiiBeforeSending: true,
        enforceTenantContext: true,
        allowedAiRoles: ['super_admin', 'company_admin', 'owner', 'director', 'fleet_manager', 'operations', 'safety'],
      },
      gpsPolicy: {
        enforceDeviceSecret: true,
        telemetryBoundsValidation: true,
        maxPayloadsPerMinutePerDevice: 60,
        quarantineUnknownDevices: true,
        maxSpeedKmhThreshold: 180,
      },
    };

    this.policies.set('tenant_default', defaultPolicy);

    this.versionHistory = [
      {
        id: 'ver_003',
        policyId: 'pol_enterprise_default',
        tenantId: 'tenant_default',
        version: 3,
        changedBy: 'usr_super_01',
        changedByEmail: 'bambang.pratama@fleetintelligence.id',
        timestamp: '2026-08-15T09:30:00Z',
        reason: 'ISO 27001 Compliance: Increased minimum password length to 12 chars and enabled 2FA for Finance role.',
        changes: [
          { section: 'passwordPolicy', field: 'minLength', oldValue: 8, newValue: 12 },
          { section: 'sessionPolicy', field: 'enforceMfaForRoles', oldValue: ['super_admin', 'company_admin'], newValue: ['super_admin', 'company_admin', 'owner', 'director', 'finance'] },
        ],
      },
      {
        id: 'ver_002',
        policyId: 'pol_enterprise_default',
        tenantId: 'tenant_default',
        version: 2,
        changedBy: 'usr_super_01',
        changedByEmail: 'bambang.pratama@fleetintelligence.id',
        timestamp: '2026-07-20T14:15:00Z',
        reason: 'Enforced HMAC signature verification for external ERP webhook integrations.',
        changes: [
          { section: 'apiPolicy', field: 'requireHmacWebhooks', oldValue: false, newValue: true },
        ],
      },
      {
        id: 'ver_001',
        policyId: 'pol_enterprise_default',
        tenantId: 'tenant_default',
        version: 1,
        changedBy: 'SYSTEM_INIT',
        changedByEmail: 'system@fleetintelligence.id',
        timestamp: '2026-01-01T00:00:00Z',
        reason: 'Initial Enterprise Zero Trust baseline policy deployment.',
        changes: [],
      },
    ];
  }

  /**
   * Get active security policy for a tenant
   */
  public getPolicy(tenantId: string = 'tenant_default'): SecurityPolicyConfig {
    return this.policies.get(tenantId) || this.policies.get('tenant_default')!;
  }

  /**
   * Update policy with versioning and audit record
   */
  public updatePolicy(
    tenantId: string,
    updates: Partial<SecurityPolicyConfig>,
    changedByEmail: string,
    reason: string
  ): SecurityPolicyConfig {
    const current = this.getPolicy(tenantId);
    const newVersion = current.version + 1;
    const now = new Date().toISOString();

    const changes: PolicyVersionRecord['changes'] = [];

    // Track field diffs
    (['passwordPolicy', 'sessionPolicy', 'apiPolicy', 'aiPolicy', 'gpsPolicy'] as const).forEach((section) => {
      if (updates[section]) {
        Object.keys(updates[section]!).forEach((key) => {
          const oldVal = (current[section] as any)[key];
          const newVal = (updates[section] as any)[key];
          if (oldVal !== newVal) {
            changes.push({
              section,
              field: key,
              oldValue: oldVal,
              newValue: newVal,
            });
          }
        });
      }
    });

    const updated: SecurityPolicyConfig = {
      ...current,
      ...updates,
      version: newVersion,
      updatedAt: now,
      updatedBy: changedByEmail,
    };

    this.policies.set(tenantId, updated);

    // Save version history record
    const versionRecord: PolicyVersionRecord = {
      id: `ver_${newVersion.toString().padStart(3, '0')}`,
      policyId: current.id,
      tenantId,
      version: newVersion,
      changedBy: 'usr_active',
      changedByEmail,
      timestamp: now,
      reason: reason || 'Security configuration adjustment',
      changes,
    };

    this.versionHistory.unshift(versionRecord);

    // Log to Audit Engine
    auditService.logSecurityEvent({
      tenantId,
      action: 'CONFIG_UPDATED',
      severity: 'HIGH',
      actor: {
        actorId: 'usr_active',
        actorType: 'ADMIN',
        actorEmail: changedByEmail,
        tenantId,
      },
      description: `Security Policy upgraded to v${newVersion}. Reason: ${reason}`,
      securityMetadata: {
        isSuspicious: false,
        riskScore: 10,
      },
    });

    return updated;
  }

  /**
   * Get version history
   */
  public getVersionHistory(tenantId: string = 'tenant_default'): PolicyVersionRecord[] {
    return this.versionHistory.filter((v) => v.tenantId === tenantId);
  }
}

export const securityPolicyService = SecurityPolicyService.getInstance();
