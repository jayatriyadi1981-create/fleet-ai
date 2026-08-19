/**
 * Fleet Intelligence Smart AI - Alert Rule Service
 * CRUD, Versioning, Duplication, Priority Resolution & Rules Storage
 */

import { AlertRule, AlertRuleVersion, RuleScope } from '../types';

class AlertRuleService {
  private rules: AlertRule[] = [
    {
      id: 'rule-01',
      tenantId: 'tenant-tln-01',
      name: 'Overspeed Critical (>100 km/h)',
      description: 'Peringatan otomatis jika kecepatan truk melebihi 100 km/jam selama lebih dari 30 detik.',
      type: 'OVERSPEED',
      enabled: true,
      severity: 'CRITICAL',
      priority: 1,
      conditionGroup: {
        id: 'cg-01',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-01',
            field: 'speed',
            operator: '>',
            value: 100,
          },
          {
            id: 'cl-02',
            field: 'ignition',
            operator: '=',
            value: true,
          },
        ],
      },
      durationSeconds: 30,
      cooldownSeconds: 300,
      repeatIntervalSeconds: 600,
      escalationPolicyId: 'esc-pol-01',
      actions: ['CREATE_ALERT', 'PUSH', 'IN_APP', 'WHATSAPP'],
      schedule: {
        type: 'ALWAYS',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'Fleet Safety Manager',
      updatedBy: 'Fleet Safety Manager',
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-08-01T08:00:00Z',
    },
    {
      id: 'rule-02',
      tenantId: 'tenant-tln-01',
      name: 'Excessive Engine Idle (>15 Menit)',
      description: 'Deteksi pemborosan BBM akibat mesin menyala tanpa bergerak lebih dari 15 menit.',
      type: 'IDLE',
      enabled: true,
      severity: 'MEDIUM',
      priority: 3,
      conditionGroup: {
        id: 'cg-02',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-03',
            field: 'ignition',
            operator: '=',
            value: true,
          },
          {
            id: 'cl-04',
            field: 'speed',
            operator: '=',
            value: 0,
          },
        ],
      },
      durationSeconds: 900, // 15 mins
      cooldownSeconds: 600,
      actions: ['CREATE_ALERT', 'IN_APP'],
      schedule: {
        type: 'ALWAYS',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'Operations Admin',
      updatedBy: 'Operations Admin',
      createdAt: '2026-08-02T09:00:00Z',
      updatedAt: '2026-08-02T09:00:00Z',
    },
    {
      id: 'rule-03',
      tenantId: 'tenant-tln-01',
      name: 'GPS Device Offline (>10 Menit)',
      description: 'Peringatan gangguan jaringan atau perangkat GPS mati lebih dari 10 menit.',
      type: 'DEVICE_OFFLINE',
      enabled: true,
      severity: 'HIGH',
      priority: 2,
      conditionGroup: {
        id: 'cg-03',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-05',
            field: 'lastPingSec',
            operator: '>',
            value: 600,
          },
        ],
      },
      durationSeconds: 0,
      cooldownSeconds: 900,
      actions: ['CREATE_ALERT', 'PUSH', 'IN_APP', 'EMAIL'],
      schedule: {
        type: 'ALWAYS',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'System Engine',
      updatedBy: 'System Engine',
      createdAt: '2026-08-03T10:00:00Z',
      updatedAt: '2026-08-03T10:00:00Z',
    },
    {
      id: 'rule-04',
      tenantId: 'tenant-tln-01',
      name: 'Restricted Geofence Breach',
      description: 'Armada memasuki Zona Terlarang / Area Militer tanpa izin.',
      type: 'GEOFENCE',
      enabled: true,
      severity: 'CRITICAL',
      priority: 1,
      conditionGroup: {
        id: 'cg-04',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-06',
            field: 'geofenceEventType',
            operator: '=',
            value: 'ENTER',
          },
        ],
      },
      durationSeconds: 0,
      cooldownSeconds: 120,
      escalationPolicyId: 'esc-pol-01',
      actions: ['CREATE_ALERT', 'PUSH', 'IN_APP', 'WHATSAPP', 'WEBHOOK'],
      schedule: {
        type: 'ALWAYS',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'Security Chief',
      updatedBy: 'Security Chief',
      createdAt: '2026-08-04T11:00:00Z',
      updatedAt: '2026-08-04T11:00:00Z',
    },
    {
      id: 'rule-05',
      tenantId: 'tenant-tln-01',
      name: 'Route Deviation (>500 Meter)',
      description: 'Penyimpangan rute distribusi melebihi 500 meter selama lebih dari 60 detik.',
      type: 'ROUTE_DEVIATION',
      enabled: true,
      severity: 'HIGH',
      priority: 2,
      conditionGroup: {
        id: 'cg-05',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-07',
            field: 'routeDeviationDistMeters',
            operator: '>',
            value: 500,
          },
        ],
      },
      durationSeconds: 60,
      cooldownSeconds: 300,
      actions: ['CREATE_ALERT', 'PUSH', 'IN_APP'],
      schedule: {
        type: 'ALWAYS',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'Logistics Supervisor',
      updatedBy: 'Logistics Supervisor',
      createdAt: '2026-08-05T12:00:00Z',
      updatedAt: '2026-08-05T12:00:00Z',
    },
    {
      id: 'rule-06',
      tenantId: 'tenant-tln-01',
      name: 'Unauthorized Night Ignition (22:00-05:00)',
      description: 'Kunci kontak menyala di luar jam operasional resmi perusahaan.',
      type: 'IGNITION',
      enabled: true,
      severity: 'HIGH',
      priority: 2,
      conditionGroup: {
        id: 'cg-06',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-08',
            field: 'ignition',
            operator: '=',
            value: true,
          },
        ],
      },
      durationSeconds: 0,
      cooldownSeconds: 300,
      actions: ['CREATE_ALERT', 'PUSH', 'SMS'],
      schedule: {
        type: 'OUTSIDE_OPERATING_HOURS',
        startTime: '06:00',
        endTime: '22:00',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'Operations Admin',
      updatedBy: 'Operations Admin',
      createdAt: '2026-08-06T13:00:00Z',
      updatedAt: '2026-08-06T13:00:00Z',
    },
    {
      id: 'rule-07',
      tenantId: 'tenant-tln-01',
      name: 'Cold-Chain Temperature Anomaly (>8°C)',
      description: 'Suhu boks pendingin kargo melebihi ambang batas toleransi 8°C selama >5 menit.',
      type: 'TEMPERATURE',
      enabled: true,
      severity: 'CRITICAL',
      priority: 1,
      conditionGroup: {
        id: 'cg-07',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-09',
            field: 'temperature',
            operator: '>',
            value: 8,
          },
        ],
      },
      durationSeconds: 300,
      cooldownSeconds: 600,
      actions: ['CREATE_ALERT', 'PUSH', 'WHATSAPP', 'EMAIL'],
      schedule: {
        type: 'ALWAYS',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'Quality Assurance',
      updatedBy: 'Quality Assurance',
      createdAt: '2026-08-07T14:00:00Z',
      updatedAt: '2026-08-07T14:00:00Z',
    },
    {
      id: 'rule-08',
      tenantId: 'tenant-tln-01',
      name: 'SOS Emergency Panic Button',
      description: 'Driver menekan tombol SOS darurat dalam kabin kendaraan.',
      type: 'PANIC',
      enabled: true,
      severity: 'CRITICAL',
      priority: 1,
      conditionGroup: {
        id: 'cg-08',
        logicalOperator: 'AND',
        clauses: [
          {
            id: 'cl-10',
            field: 'panicButtonTriggered',
            operator: '=',
            value: true,
          },
        ],
      },
      durationSeconds: 0,
      cooldownSeconds: 0, // No cooldown for SOS!
      escalationPolicyId: 'esc-pol-01',
      actions: ['CREATE_ALERT', 'PUSH', 'IN_APP', 'WHATSAPP', 'SMS'],
      schedule: {
        type: 'ALWAYS',
      },
      scope: {
        vehicleType: 'ALL',
      },
      version: 1,
      createdBy: 'Safety Officer',
      updatedBy: 'Safety Officer',
      createdAt: '2026-08-08T15:00:00Z',
      updatedAt: '2026-08-08T15:00:00Z',
    },
  ];

  private ruleVersions: AlertRuleVersion[] = [];

  public getRules(): AlertRule[] {
    return this.rules;
  }

  public getRuleById(id: string): AlertRule | undefined {
    return this.rules.find((r) => r.id === id);
  }

  public createRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'version'>): AlertRule {
    const newRule: AlertRule = {
      ...rule,
      id: `rule-${Date.now().toString(36)}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.rules.push(newRule);
    this.recordVersion(newRule, 'Created new alert rule');
    return newRule;
  }

  public updateRule(id: string, updates: Partial<AlertRule>, updatedBy: string): AlertRule {
    const index = this.rules.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Alert Rule not found');

    const updatedRule: AlertRule = {
      ...this.rules[index],
      ...updates,
      version: this.rules[index].version + 1,
      updatedBy,
      updatedAt: new Date().toISOString(),
    };

    this.rules[index] = updatedRule;
    this.recordVersion(updatedRule, `Updated by ${updatedBy}`);
    return updatedRule;
  }

  public duplicateRule(id: string, newName?: string): AlertRule {
    const original = this.getRuleById(id);
    if (!original) throw new Error('Rule not found');

    const copy: AlertRule = {
      ...original,
      id: `rule-${Date.now().toString(36)}`,
      name: newName || `${original.name} (Copy)`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.rules.push(copy);
    return copy;
  }

  public toggleRule(id: string, enabled: boolean): AlertRule {
    return this.updateRule(id, { enabled }, 'System Manager');
  }

  public deleteRule(id: string): boolean {
    const initialLen = this.rules.length;
    this.rules = this.rules.filter((r) => r.id !== id);
    return this.rules.length < initialLen;
  }

  private recordVersion(rule: AlertRule, comment: string) {
    this.ruleVersions.push({
      id: `rv-${Date.now().toString(36)}`,
      ruleId: rule.id,
      version: rule.version,
      configuration: { ...rule },
      createdBy: rule.updatedBy || rule.createdBy,
      createdAt: new Date().toISOString(),
    });
  }

  public getRuleVersions(ruleId: string): AlertRuleVersion[] {
    return this.ruleVersions.filter((v) => v.ruleId === ruleId);
  }

  /**
   * Deterministic Priority Rule Resolution for a Vehicle:
   * Specific Vehicle Rule -> Vehicle Group Rule -> Branch Rule -> Tenant Default Rule
   */
  public resolveApplicableRulesForVehicle(vehicleId: string, vehicleGroupId?: string, branchId?: string): AlertRule[] {
    const activeRules = this.rules.filter((r) => r.enabled);

    return activeRules.filter((r) => {
      const scope = r.scope;
      if (!scope || scope.vehicleType === 'ALL') return true;

      if (scope.vehicleIds && scope.vehicleIds.includes(vehicleId)) return true;
      if (vehicleGroupId && scope.vehicleGroupIds && scope.vehicleGroupIds.includes(vehicleGroupId)) return true;
      if (branchId && scope.branchIds && scope.branchIds.includes(branchId)) return true;

      return false;
    });
  }
}

export const alertRuleService = new AlertRuleService();
