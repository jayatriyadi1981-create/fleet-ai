/**
 * Fleet Intelligence Smart AI - API Audit Logging Service
 * PROMPT 44: Immutable Audit Trail for Keys, Scopes, Webhooks & Commands
 */

import { ApiAuditLog } from '../../types/externalApi';
import { mockTenant } from '../../constants/mockData';

const AUDIT_STORAGE_KEY = 'fleet_api_audit_logs_v1';

class APIAuditService {
  private logs: ApiAuditLog[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        try {
          this.logs = JSON.parse(stored);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Seed audit trail
    this.logs = [
      {
        id: 'aud_api_01',
        tenantId: mockTenant.id,
        actor: 'Admin SAP Lead (Budi Santoso)',
        action: 'API_KEY_CREATED',
        target: 'SAP S/4HANA ERP Connector (key_prod_sap_erp_01)',
        timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
        details: { scopes: ['vehicles:read', 'vehicles:write', 'trips:read'], ipRestrictions: [] },
      },
      {
        id: 'aud_api_02',
        tenantId: mockTenant.id,
        actor: 'Fleet Operations Lead',
        action: 'WEBHOOK_CREATED',
        target: 'SAP Logistics Event Bus (wh_sub_sap_erp_01)',
        timestamp: new Date(Date.now() - 25 * 86400000).toISOString(),
        details: { url: 'https://api.erp.corporate-fleet.co.id/webhooks/fleet-events', events: 5 },
      },
      {
        id: 'aud_api_03',
        tenantId: mockTenant.id,
        actor: 'Dispatcher Lead',
        action: 'SENSITIVE_COMMAND_SENT',
        target: 'GPS Device Hino 500 (dev_01)',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        details: { command: 'REQUEST_LOCATION', channel: 'External API v1' },
      },
    ];

    this.save();
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.logs.slice(0, 200)));
    }
  }

  public record(log: Omit<ApiAuditLog, 'id' | 'timestamp'> & { timestamp?: string }): ApiAuditLog {
    const entry: ApiAuditLog = {
      ...log,
      id: `aud_api_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: log.timestamp || new Date().toISOString(),
    };
    this.logs.unshift(entry);
    this.save();
    return entry;
  }

  public getLogs(tenantId?: string): ApiAuditLog[] {
    if (tenantId) {
      return this.logs.filter(l => l.tenantId === tenantId);
    }
    return this.logs;
  }
}

export const apiAuditService = new APIAuditService();
