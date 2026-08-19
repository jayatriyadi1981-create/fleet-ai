/**
 * Fleet Intelligence Smart AI - External API & Developer Platform Types
 * PROMPT 44: Unified Data Models, Scopes, Auth, Webhooks, Rate Limiting, Audit & OpenAPI
 */

export type ApiEnvironment = 'SANDBOX' | 'PRODUCTION';

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export type ApiScope =
  | 'vehicles:read'
  | 'vehicles:write'
  | 'drivers:read'
  | 'drivers:write'
  | 'drivers:pii'
  | 'gps:read'
  | 'gps:write'
  | 'trips:read'
  | 'trips:write'
  | 'geofences:read'
  | 'geofences:write'
  | 'alerts:read'
  | 'alerts:write'
  | 'reports:read'
  | 'reports:write'
  | 'ai:read'
  | 'ai:execute'
  | 'webhooks:read'
  | 'webhooks:write';

export interface ApiScopeDefinition {
  scope: ApiScope;
  label: string;
  category: 'ARMADA' | 'OPERASIONAL' | 'TELEMATIKA' | 'INTELLIGENCE' | 'INTEGRASI' | 'SENSITIF';
  description: string;
  isHighRisk?: boolean;
}

export const API_SCOPE_DEFINITIONS: ApiScopeDefinition[] = [
  { scope: 'vehicles:read', label: 'Baca Data Kendaraan', category: 'ARMADA', description: 'Melihat daftar, spesifikasi, dan status armada' },
  { scope: 'vehicles:write', label: 'Kelola Data Kendaraan', category: 'ARMADA', description: 'Membuat, memperbarui, dan mengarsipkan data kendaraan' },
  
  { scope: 'drivers:read', label: 'Baca Data Pengemudi', category: 'ARMADA', description: 'Melihat profil publik dan penugasan driver' },
  { scope: 'drivers:write', label: 'Kelola Driver', category: 'ARMADA', description: 'Menambah, mengubah data driver dan assignment armada' },
  { scope: 'drivers:pii', label: 'Akses PII Driver (Sensitif)', category: 'SENSITIF', description: 'Melihat nomor KTP, SIM, No. HP, dan kontak pribadi', isHighRisk: true },

  { scope: 'gps:read', label: 'Baca Telemetri GPS', category: 'TELEMATIKA', description: 'Akses lokasi real-time, telemetri BBM, suhu, dan sensor IoT' },
  { scope: 'gps:write', label: 'Kirim Perintah GPS (Sensitif)', category: 'SENSITIF', description: 'Kirim remote command: cutoff engine, ping, reset interval', isHighRisk: true },

  { scope: 'trips:read', label: 'Baca Rute & Trip History', category: 'OPERASIONAL', description: 'Melihat histori perjalanan, rute GPS, dan playback' },
  { scope: 'trips:write', label: 'Kelola Dispatch & Trip', category: 'OPERASIONAL', description: 'Membuat jadwal rute, order delivery, dan update status trip' },

  { scope: 'geofences:read', label: 'Baca Geofence', category: 'OPERASIONAL', description: 'Melihat daftar zona geofence polygon & circle serta log event' },
  { scope: 'geofences:write', label: 'Kelola Geofence', category: 'OPERASIONAL', description: 'Membuat, mengubah poligon, dan radius geofence' },

  { scope: 'alerts:read', label: 'Baca Peringatan & Insiden', category: 'OPERASIONAL', description: 'Akses alert overspeed, idle, offline, panic SOS, dan fuel drop' },
  { scope: 'alerts:write', label: 'Resolusi Alert', category: 'OPERASIONAL', description: 'Acknowledge dan resolve peringatan armada' },

  { scope: 'reports:read', label: 'Unduh Laporan Telematika', category: 'INTEGRASI', description: 'Akses export laporan armada, BBM, maintenance, dan biaya' },
  { scope: 'reports:write', label: 'Generate Laporan Async', category: 'INTEGRASI', description: 'Memicu background job pembuatan PDF/CSV/XLSX' },

  { scope: 'ai:read', label: 'Baca AI Insights & Analisis', category: 'INTELLIGENCE', description: 'Melihat skor risiko driver, prediksi BBM, dan rekomendasi rute' },
  { scope: 'ai:execute', label: 'Eksekusi AI Copilot & Tools', category: 'INTELLIGENCE', description: 'Menjalankan AI Assistant interaktif dan pemrosesan prediktif' },

  { scope: 'webhooks:read', label: 'Baca Konfigurasi Webhook', category: 'INTEGRASI', description: 'Melihat endpoint webhook terdaftar dan log pengiriman' },
  { scope: 'webhooks:write', label: 'Kelola Webhook Subscriptions', category: 'INTEGRASI', description: 'Mendaftarkan endpoint URL dan merotasi secret key' },
];

export interface APIKeyRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  name: string;
  description?: string;
  keyPrefix: string;
  keyHash: string;
  maskedKey: string;
  scopes: ApiScope[];
  environment: ApiEnvironment;
  ipRestrictions?: string[];
  rateLimitPerMin: number;
  status: ApiKeyStatus;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  createdBy: string;
  rotationHistory?: Array<{
    rotatedAt: string;
    oldKeyPrefix: string;
    rotatedBy: string;
  }>;
}

export type ApiKeyRecord = APIKeyRecord;

export interface APIRequestContext {
  tenantId: string;
  tenantName: string;
  userId: string;
  apiKeyId: string;
  keyName: string;
  scopes: ApiScope[];
  ip: string;
  userAgent: string;
  requestId: string;
  timestamp: string;
  environment: ApiEnvironment;
  idempotencyKey?: string;
}

export type WebhookEventType =
  | 'vehicle.created'
  | 'vehicle.updated'
  | 'driver.created'
  | 'driver.updated'
  | 'gps.location'
  | 'gps.device.online'
  | 'gps.device.offline'
  | 'trip.created'
  | 'trip.started'
  | 'trip.completed'
  | 'geofence.enter'
  | 'geofence.exit'
  | 'alert.created'
  | 'alert.resolved'
  | 'maintenance.due'
  | 'fuel.anomaly';

export interface WebhookEventDefinition {
  event: WebhookEventType;
  label: string;
  category: 'ARMADA' | 'TELEMATIKA' | 'TRIP' | 'ALERTS' | 'MAINTENANCE';
  description: string;
}

export const WEBHOOK_EVENT_DEFINITIONS: WebhookEventDefinition[] = [
  { event: 'vehicle.created', label: 'Armada Baru Didaftarkan', category: 'ARMADA', description: 'Dipicu ketika ada unit armada baru terdaftar di sistem' },
  { event: 'vehicle.updated', label: 'Data Armada Diperbarui', category: 'ARMADA', description: 'Dipicu ketika status, odometer, atau assignment armada berubah' },
  { event: 'driver.created', label: 'Driver Baru Terdaftar', category: 'ARMADA', description: 'Dipicu saat pengemudi baru ditambahkan ke sistem' },
  { event: 'driver.updated', label: 'Data Driver Diperbarui', category: 'ARMADA', description: 'Dipicu saat status, SIM, atau skor driver diperbarui' },
  { event: 'gps.location', label: 'Streaming Lokasi GPS', category: 'TELEMATIKA', description: 'Dipicu setiap paket telemetri koordinat real-time masuk' },
  { event: 'gps.device.online', label: 'Perangkat GPS Online', category: 'TELEMATIKA', description: 'Dipicu saat GPS tracker terhubung kembali ke server' },
  { event: 'gps.device.offline', label: 'Perangkat GPS Offline', category: 'TELEMATIKA', description: 'Dipicu saat sinyal GPS tracker hilang > 15 menit' },
  { event: 'trip.created', label: 'Trip Baru Dibuat (Dispatch)', category: 'TRIP', description: 'Dipicu saat order pengiriman / schedule rute dibuat' },
  { event: 'trip.started', label: 'Perjalanan Dimulai', category: 'TRIP', description: 'Dipicu saat driver menyalakan kontak & rute aktif' },
  { event: 'trip.completed', label: 'Perjalanan Selesai', category: 'TRIP', description: 'Dipicu saat armada tiba di destinasi akhir' },
  { event: 'geofence.enter', label: 'Masuk Zona Geofence', category: 'TRIP', description: 'Dipicu saat armada memasuki area depo, gudang, atau customer' },
  { event: 'geofence.exit', label: 'Keluar Zona Geofence', category: 'TRIP', description: 'Dipicu saat armada meninggalkan batas area geofence' },
  { event: 'alert.created', label: 'Peringatan Baru Terdeteksi', category: 'ALERTS', description: 'Dipicu saat insiden overspeed, harsh brake, panic SOS, dll.' },
  { event: 'alert.resolved', label: 'Peringatan Diselesaikan', category: 'ALERTS', description: 'Dipicu saat dispatcher menyelesaikan insiden' },
  { event: 'maintenance.due', label: 'Jadwal Servis Jatuh Tempo', category: 'MAINTENANCE', description: 'Dipicu saat armada mendekati batas KM servis berkala' },
  { event: 'fuel.anomaly', label: 'Anomali BBM / Fuel Drop', category: 'ALERTS', description: 'Dipicu saat terjadi penurunan volume BBM mendadak' },
];

export interface WebhookSubscription {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  secretKey?: string;
  status: 'ACTIVE' | 'PAUSED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
  description?: string;
}

export interface WebhookDeliveryLog {
  id: string;
  tenantId: string;
  webhookId: string;
  webhookName: string;
  event: WebhookEventType;
  endpointUrl: string;
  payload: any;
  attempt: number;
  statusCode: number;
  latencyMs: number;
  durationMs?: number;
  deliveredAt: string;
  timestamp?: string;
  success: boolean;
  error?: string;
  signature: string;
  headers: Record<string, string>;
}

export interface ApiUsageRecord {
  id: string;
  requestId?: string;
  tenantId: string;
  tenantName: string;
  apiKeyId: string;
  keyName: string;
  endpoint: string;
  path?: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  durationMs?: number;
  ip: string;
  userAgent?: string;
  timestamp: string;
  environment: ApiEnvironment;
  error?: string;
  bytesTransferred?: number;
  scopeUsed?: ApiScope;
}

export interface ApiUsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  errorRequests: number;
  errorRate: number;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  statusCodes: Record<string, number>;
  topEndpoints: Array<{
    endpoint: string;
    count: number;
    avgLatency: number;
    errors: number;
  }>;
  tenantBreakdown: Array<{
    tenantId: string;
    tenantName: string;
    requests: number;
    errors: number;
  }>;
}

export interface ApiAuditLog {
  id: string;
  tenantId: string;
  actor: string;
  action:
    | 'API_KEY_CREATED'
    | 'API_KEY_REVOKED'
    | 'API_KEY_ROTATED'
    | 'API_KEY_SCOPES_UPDATED'
    | 'WEBHOOK_CREATED'
    | 'WEBHOOK_DELETED'
    | 'WEBHOOK_PAUSED'
    | 'SENSITIVE_COMMAND_SENT'
    | 'RATE_LIMIT_OVERRIDE';
  target: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface ReportJob {
  id: string;
  tenantId: string;
  reportType: 'gps' | 'vehicle' | 'driver' | 'trip' | 'fuel' | 'maintenance' | 'safety' | 'cost' | 'fleet';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  createdAt: string;
  completedAt?: string;
  format: 'PDF' | 'CSV' | 'XLSX';
  progress: number;
  downloadUrl?: string;
  rowCount?: number;
  fileSize?: string;
  filters?: Record<string, any>;
  error?: string;
}

export interface StandardApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
    environment: ApiEnvironment;
  };
}

export interface StandardListResponse<T = any> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    requestId: string;
    timestamp: string;
    version: string;
    environment: ApiEnvironment;
  };
}

export interface StandardApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
    environment: ApiEnvironment;
  };
}
