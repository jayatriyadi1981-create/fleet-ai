/**
 * System-Wide Constants
 */

export const APP_NAME = 'Fleet Intelligence Smart AI';
export const APP_VERSION = '0.1.0';
export const DEFAULT_TIMEZONE = 'Asia/Jakarta';
export const DEFAULT_CURRENCY = 'IDR';
export const DEFAULT_LANGUAGE = 'id-ID';

export const VEHICLE_STATUS_LABELS: Record<string, string> = {
  moving: 'Bergerak (Moving)',
  idle: 'Mesin Menyala / Idling',
  parking: 'Parkir (Parking)',
  offline: 'Sinyal Terputus',
  emergency: 'Darurat (SOS)',
  maintenance: 'Dalam Servis',
};

export const USER_ROLES = [
  'super_admin',
  'company_owner',
  'company_admin',
  'fleet_manager',
  'operations_manager',
  'dispatcher',
  'supervisor',
  'driver',
  'maintenance',
  'finance',
  'hr',
  'viewer',
] as const;

export const ALERT_SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 20,
};
