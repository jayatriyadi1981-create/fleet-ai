/**
 * Fleet Intelligence Smart AI - Notification Rule & Escalation Engine
 * PROMPT 45: Conditions, Cooldown, Deduplication, Aggregation & Multi-Tier Escalation
 */

import { NotificationRule, NotificationEventType, NotificationPriority, NotificationChannel } from '../types/notificationEngineTypes';

const DEFAULT_RULES: NotificationRule[] = [
  {
    id: 'rule-panic-sos',
    tenantId: 'global',
    name: 'Panic SOS Critical Emergency Broadcast',
    event: 'safety.panic_sos',
    severity: 'CRITICAL',
    channels: ['WHATSAPP', 'SMS', 'PUSH', 'EMAIL', 'IN_APP'],
    recipientRoles: ['dispatcher', 'fleet_manager', 'safety_officer', 'company_admin'],
    conditions: [],
    cooldownMinutes: 0, // No cooldown for critical emergency
    allowQuietHoursBypass: true,
    escalationPolicy: {
      enabled: true,
      timeoutMinutes: 3,
      escalateToRole: 'super_admin',
      channels: ['SMS', 'WHATSAPP'],
    },
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-overspeed-high',
    tenantId: 'global',
    name: 'Overspeed Alert (> 100 km/h)',
    event: 'gps.overspeed',
    severity: 'HIGH',
    channels: ['WHATSAPP', 'PUSH', 'IN_APP'],
    recipientRoles: ['driver', 'dispatcher', 'fleet_manager'],
    conditions: [
      { field: 'speed', operator: 'greater_than', value: 90 },
    ],
    cooldownMinutes: 10, // Deduplication window: max 1 notification per 10 mins for same unit
    allowQuietHoursBypass: false,
    escalationPolicy: {
      enabled: true,
      timeoutMinutes: 15,
      escalateToRole: 'fleet_manager',
      channels: ['EMAIL'],
    },
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-fuel-anomaly',
    tenantId: 'global',
    name: 'Fuel Drop Siphon Anomaly',
    event: 'fuel.drop_anomaly',
    severity: 'HIGH',
    channels: ['WHATSAPP', 'PUSH', 'EMAIL', 'IN_APP'],
    recipientRoles: ['fleet_manager', 'dispatcher'],
    conditions: [
      { field: 'dropLiters', operator: 'greater_than', value: 15 },
    ],
    cooldownMinutes: 30,
    allowQuietHoursBypass: true,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-vehicle-offline',
    tenantId: 'global',
    name: 'GPS Telemetry Lost (> 15 mins)',
    event: 'gps.offline',
    severity: 'MEDIUM',
    channels: ['PUSH', 'EMAIL', 'IN_APP'],
    recipientRoles: ['dispatcher', 'fleet_manager'],
    conditions: [
      { field: 'durationMinutes', operator: 'greater_than', value: 15 },
    ],
    cooldownMinutes: 60,
    allowQuietHoursBypass: false,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-maintenance-due',
    tenantId: 'global',
    name: 'Preventive Maintenance Work Order Due',
    event: 'maintenance.due_soon',
    severity: 'MEDIUM',
    channels: ['EMAIL', 'WHATSAPP', 'IN_APP'],
    recipientRoles: ['fleet_manager', 'workshop_supervisor'],
    conditions: [],
    cooldownMinutes: 1440, // 24 hours cooldown
    allowQuietHoursBypass: false,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-ai-insight',
    tenantId: 'global',
    name: 'AI Fleet Optimization Insights',
    event: 'ai.risk_recommendation',
    severity: 'LOW',
    channels: ['PUSH', 'IN_APP', 'EMAIL'],
    recipientRoles: ['fleet_manager', 'company_admin'],
    conditions: [],
    cooldownMinutes: 720, // 12 hours
    allowQuietHoursBypass: false,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class NotificationRuleEngineService {
  private rules: Map<string, NotificationRule> = new Map();
  private cooldownCache: Map<string, number> = new Map(); // key -> lastSentTimestamp

  constructor() {
    for (const r of DEFAULT_RULES) {
      this.rules.set(r.id, r);
    }
  }

  public getAllRules(tenantId?: string): NotificationRule[] {
    const list = Array.from(this.rules.values());
    if (!tenantId || tenantId === 'global') return list;
    return list.filter(r => r.tenantId === 'global' || r.tenantId === tenantId);
  }

  public getRuleById(id: string): NotificationRule | undefined {
    return this.rules.get(id);
  }

  public evaluateRules(
    event: NotificationEventType,
    payload: Record<string, any>,
    tenantId?: string
  ): NotificationRule[] {
    const candidateRules = this.getAllRules(tenantId).filter(
      r => r.enabled && r.event === event
    );

    return candidateRules.filter(rule => {
      // Evaluate conditions
      if (!rule.conditions || rule.conditions.length === 0) return true;

      for (const cond of rule.conditions) {
        const actualVal = payload[cond.field];
        if (actualVal === undefined) continue;

        switch (cond.operator) {
          case 'equals':
            if (actualVal !== cond.value) return false;
            break;
          case 'greater_than':
            if (Number(actualVal) <= Number(cond.value)) return false;
            break;
          case 'less_than':
            if (Number(actualVal) >= Number(cond.value)) return false;
            break;
          case 'contains':
            if (!String(actualVal).toLowerCase().includes(String(cond.value).toLowerCase())) return false;
            break;
        }
      }
      return true;
    });
  }

  public checkCooldown(entityKey: string, cooldownMinutes: number): boolean {
    if (cooldownMinutes <= 0) return true; // Cooldown disabled

    const last = this.cooldownCache.get(entityKey);
    const now = Date.now();
    if (last && (now - last) < cooldownMinutes * 60 * 1000) {
      return false; // Still within cooldown window
    }

    this.cooldownCache.set(entityKey, now);
    return true;
  }

  public isQuietHoursActive(
    quietHours: { enabled: boolean; startTime: string; endTime: string; allowCriticalBypass: boolean },
    priority: NotificationPriority
  ): boolean {
    if (!quietHours.enabled) return false;
    if (priority === 'CRITICAL' && quietHours.allowCriticalBypass) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = quietHours.startTime.split(':').map(Number);
    const [endH, endM] = quietHours.endTime.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (startTotal <= endTotal) {
      return currentMinutes >= startTotal && currentMinutes <= endTotal;
    } else {
      // Overnight (e.g. 22:00 to 06:00)
      return currentMinutes >= startTotal || currentMinutes <= endTotal;
    }
  }

  public saveRule(rule: NotificationRule): NotificationRule {
    const updated = {
      ...rule,
      updatedAt: new Date().toISOString(),
    };
    this.rules.set(rule.id, updated);
    return updated;
  }

  public createRule(data: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>): NotificationRule {
    const id = `rule_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
    const newRule: NotificationRule = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rules.set(id, newRule);
    return newRule;
  }

  public deleteRule(id: string): boolean {
    return this.rules.delete(id);
  }
}

export const notificationRuleEngine = new NotificationRuleEngineService();
