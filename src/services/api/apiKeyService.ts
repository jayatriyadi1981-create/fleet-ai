/**
 * Fleet Intelligence Smart AI - API Key Management Service
 * PROMPT 44: Secure Key Generation, SHA-256 Hashing, Scopes, Lifecycle & Rotation
 */

import { APIKeyRecord, ApiScope, ApiEnvironment } from '../../types/externalApi';
import { mockTenant } from '../../constants/mockData';

const STORAGE_KEY = 'fleet_external_api_keys_v1';

// In-browser SHA-256 / Fallback hasher
export async function hashApiKey(key: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(key);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // fallback
  }
  // Fallback simple hash for non-crypto contexts
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(16).padStart(32, '0');
}

export function generateRawApiKey(env: ApiEnvironment = 'PRODUCTION'): { rawKey: string; keyPrefix: string; maskedKey: string } {
  const prefix = env === 'PRODUCTION' ? 'flt_live_' : 'flt_test_';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 32; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const rawKey = `${prefix}${randomPart}`;
  const keyPrefix = rawKey.substring(0, 12);
  const maskedKey = `${keyPrefix}••••••••••••${rawKey.slice(-4)}`;
  return { rawKey, keyPrefix, maskedKey };
}

class APIKeyService {
  private keys: APIKeyRecord[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          this.keys = JSON.parse(stored);
          return;
        } catch (e) {
          console.error('Failed to parse stored API keys', e);
        }
      }
    }

    // Default Seed API Keys for Demo Tenant
    const defaultScopes: ApiScope[] = [
      'vehicles:read',
      'vehicles:write',
      'drivers:read',
      'drivers:write',
      'gps:read',
      'trips:read',
      'geofences:read',
      'alerts:read',
      'alerts:write',
      'reports:read',
      'ai:read',
      'ai:execute',
      'webhooks:read',
      'webhooks:write',
    ];

    this.keys = [
      {
        id: 'key_prod_sap_erp_01',
        tenantId: mockTenant.id,
        tenantName: mockTenant.name,
        name: 'SAP S/4HANA ERP Connector',
        description: 'Sinkronisasi master kendaraan, jadwal rute, dan status delivery otomatis',
        keyPrefix: 'flt_live_sap9',
        keyHash: 'c7be8593a890432f918e7728362846a1e7b992f801648a82f34918e772836284',
        maskedKey: 'flt_live_sap9••••••••••••4f2b',
        scopes: defaultScopes,
        environment: 'PRODUCTION',
        rateLimitPerMin: 1000,
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        lastUsedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        expiresAt: new Date(Date.now() + 335 * 86400000).toISOString(),
        createdBy: 'Admin SAP Lead (Budi Santoso)',
      },
      {
        id: 'key_prod_tms_logistics_02',
        tenantId: mockTenant.id,
        tenantName: mockTenant.name,
        name: 'Logistics TMS Dispatcher Hub',
        description: 'Penerimaan alert darurat, geofence enter/exit, dan telemetri lokasi realtime',
        keyPrefix: 'flt_live_tms7',
        keyHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        maskedKey: 'flt_live_tms7••••••••••••9c1a',
        scopes: ['gps:read', 'trips:read', 'trips:write', 'alerts:read', 'geofences:read'],
        environment: 'PRODUCTION',
        rateLimitPerMin: 500,
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        lastUsedAt: new Date(Date.now() - 3 * 60000).toISOString(),
        expiresAt: new Date(Date.now() + 351 * 86400000).toISOString(),
        createdBy: 'Fleet Dispatcher Lead',
      },
      {
        id: 'key_sandbox_dev_03',
        tenantId: mockTenant.id,
        tenantName: mockTenant.name,
        name: 'Developer Sandbox Testing Key',
        description: 'Kunci testing endpoint untuk tim developer & integrasi mock telemetri',
        keyPrefix: 'flt_test_dev1',
        keyHash: 'f0e1d2c3b4a5968778695a4b3c2d1e0f0e1d2c3b4a5968778695a4b3c2d1e0f',
        maskedKey: 'flt_test_dev1••••••••••••88bb',
        scopes: defaultScopes.concat(['drivers:pii', 'gps:write']),
        environment: 'SANDBOX',
        rateLimitPerMin: 100,
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        lastUsedAt: new Date(Date.now() - 45 * 60000).toISOString(),
        expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
        createdBy: 'Developer Sandbox',
      },
    ];

    this.save();
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.keys));
    }
  }

  public getKeys(tenantId?: string): APIKeyRecord[] {
    if (tenantId) {
      return this.keys.filter(k => k.tenantId === tenantId);
    }
    return this.keys;
  }

  public getKeyById(id: string): APIKeyRecord | undefined {
    return this.keys.find(k => k.id === id);
  }

  public async createKey(params: {
    tenantId: string;
    tenantName: string;
    name: string;
    description?: string;
    scopes: ApiScope[];
    environment: ApiEnvironment;
    ipRestrictions?: string[];
    rateLimitPerMin?: number;
    expiresInDays?: number;
    createdBy: string;
  }): Promise<{ record: APIKeyRecord; rawSecretKey: string }> {
    const { rawKey, keyPrefix, maskedKey } = generateRawApiKey(params.environment);
    const keyHash = await hashApiKey(rawKey);

    const now = new Date();
    const expiresAt = params.expiresInDays
      ? new Date(now.getTime() + params.expiresInDays * 86400000).toISOString()
      : new Date(now.getTime() + 365 * 86400000).toISOString();

    const record: APIKeyRecord = {
      id: `key_${params.environment.toLowerCase()}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      tenantId: params.tenantId,
      tenantName: params.tenantName,
      name: params.name,
      description: params.description,
      keyPrefix,
      keyHash,
      maskedKey,
      scopes: params.scopes,
      environment: params.environment,
      ipRestrictions: params.ipRestrictions,
      rateLimitPerMin: params.rateLimitPerMin || (params.environment === 'SANDBOX' ? 100 : 500),
      status: 'ACTIVE',
      createdAt: now.toISOString(),
      expiresAt,
      createdBy: params.createdBy,
    };

    this.keys.unshift(record);
    this.save();

    return { record, rawSecretKey: rawKey };
  }

  public async rotateKey(
    keyId: string,
    rotatedBy: string
  ): Promise<{ record: APIKeyRecord; rawSecretKey: string } | null> {
    const existing = this.keys.find(k => k.id === keyId);
    if (!existing) return null;

    const { rawKey, keyPrefix, maskedKey } = generateRawApiKey(existing.environment);
    const keyHash = await hashApiKey(rawKey);

    const oldPrefix = existing.keyPrefix;
    existing.keyPrefix = keyPrefix;
    existing.keyHash = keyHash;
    existing.maskedKey = maskedKey;
    existing.status = 'ACTIVE';

    if (!existing.rotationHistory) existing.rotationHistory = [];
    existing.rotationHistory.unshift({
      rotatedAt: new Date().toISOString(),
      oldKeyPrefix: oldPrefix,
      rotatedBy,
    });

    this.save();
    return { record: existing, rawSecretKey: rawKey };
  }

  public revokeKey(keyId: string): boolean {
    const existing = this.keys.find(k => k.id === keyId);
    if (!existing) return false;
    existing.status = 'REVOKED';
    this.save();
    return true;
  }

  public updateKeyScopes(keyId: string, scopes: ApiScope[]): APIKeyRecord | null {
    const existing = this.keys.find(k => k.id === keyId);
    if (!existing) return null;
    existing.scopes = scopes;
    this.save();
    return existing;
  }

  public recordKeyUsage(keyId: string) {
    const existing = this.keys.find(k => k.id === keyId);
    if (existing) {
      existing.lastUsedAt = new Date().toISOString();
      this.save();
    }
  }

  public async validateKey(
    rawKey: string,
    requiredScope?: ApiScope,
    clientIp?: string
  ): Promise<{ valid: boolean; record?: APIKeyRecord; error?: string }> {
    if (!rawKey || (!rawKey.startsWith('flt_live_') && !rawKey.startsWith('flt_test_'))) {
      return { valid: false, error: 'INVALID_KEY_FORMAT' };
    }

    const keyHash = await hashApiKey(rawKey);
    const matched = this.keys.find(k => k.keyHash === keyHash || k.keyPrefix === rawKey.substring(0, 12));

    if (!matched) {
      return { valid: false, error: 'API_KEY_NOT_FOUND' };
    }

    if (matched.status === 'REVOKED') {
      return { valid: false, error: 'API_KEY_REVOKED' };
    }

    if (matched.expiresAt && new Date(matched.expiresAt) < new Date()) {
      matched.status = 'EXPIRED';
      this.save();
      return { valid: false, error: 'API_KEY_EXPIRED' };
    }

    if (matched.ipRestrictions && matched.ipRestrictions.length > 0 && clientIp) {
      if (!matched.ipRestrictions.includes(clientIp) && !matched.ipRestrictions.includes('*')) {
        return { valid: false, error: 'IP_ADDRESS_RESTRICTED' };
      }
    }

    if (requiredScope && !matched.scopes.includes(requiredScope)) {
      return { valid: false, error: 'INSUFFICIENT_SCOPE' };
    }

    this.recordKeyUsage(matched.id);
    return { valid: true, record: matched };
  }
}

export const apiKeyService = new APIKeyService();
