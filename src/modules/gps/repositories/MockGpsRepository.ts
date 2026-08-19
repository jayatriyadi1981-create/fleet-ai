/**
 * Fleet Intelligence Smart AI - Mock GPS Repository
 * Stores default GpsRule definitions, Adapters info, and Device Registries
 */

import { GpsRule, GpsDeviceIdentifier, GpsSensor } from '../types/gpsArchitecture';

export const defaultGpsRules: GpsRule[] = [
  {
    ruleId: 'rule-speed-1',
    tenantId: 'tenant-1',
    name: 'Aturan Kecepatan Maksimum Armada (Overspeed > 80km/h)',
    eventType: 'SPEEDING',
    conditions: { speedThresholdKmH: 80, durationSeconds: 10 },
    severity: 'HIGH',
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    ruleId: 'rule-voltage-1',
    tenantId: 'tenant-1',
    name: 'Deteksi Penurunan Aki Tegangan Rendah (< 11.2V)',
    eventType: 'LOW_VOLTAGE',
    conditions: { voltageThresholdVolts: 11.2 },
    severity: 'MEDIUM',
    enabled: true,
    createdBy: 'System Administrator',
    createdAt: '2026-01-12T09:30:00Z',
  },
  {
    ruleId: 'rule-idle-1',
    tenantId: 'tenant-1',
    name: 'Peringatan Engine Idle Berlebihan (> 15 Menit)',
    eventType: 'IDLE_STARTED',
    conditions: { idleMinutesThreshold: 15 },
    severity: 'LOW',
    enabled: true,
    createdBy: 'Fleet Manager',
    createdAt: '2026-01-15T10:15:00Z',
  },
  {
    ruleId: 'rule-sigloss-1',
    tenantId: 'tenant-1',
    name: 'Peringatan Hilang Sinyal Satelit GPS',
    eventType: 'GPS_SIGNAL_LOST',
    conditions: { minSatellites: 3 },
    severity: 'CRITICAL',
    enabled: true,
    createdBy: 'Security System',
    createdAt: '2026-01-18T14:20:00Z',
  },
];

export const defaultDeviceIdentifiers: GpsDeviceIdentifier[] = [
  { id: 'ident-1', deviceId: 'GPS-DEV-001', identifierType: 'IMEI', identifierValue: '864201049281745', isPrimary: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'ident-2', deviceId: 'GPS-DEV-002', identifierType: 'IMEI', identifierValue: '868192058172940', isPrimary: true, createdAt: '2026-01-02T00:00:00Z' },
  { id: 'ident-3', deviceId: 'GPS-DEV-003', identifierType: 'IMEI', identifierValue: '861048201948201', isPrimary: true, createdAt: '2026-01-03T00:00:00Z' },
];

export const defaultDeviceSensors: GpsSensor[] = [
  { id: 'sens-1', deviceId: 'GPS-DEV-001', sensorType: 'Fuel', name: 'Tangki Utama Hino', unit: 'Liter', currentValue: 240, lastUpdatedAt: new Date().toISOString() },
  { id: 'sens-2', deviceId: 'GPS-DEV-001', sensorType: 'Temperature', name: 'Sensor Chiller Cargo', unit: '°C', currentValue: -18.4, lastUpdatedAt: new Date().toISOString() },
  { id: 'sens-3', deviceId: 'GPS-DEV-002', sensorType: 'Door', name: 'Pintu Belakang Box', unit: 'Boolean', currentValue: 'TERKUNCI', lastUpdatedAt: new Date().toISOString() },
  { id: 'sens-4', deviceId: 'GPS-DEV-003', sensorType: 'Battery', name: 'Tegangan Aki Utama', unit: 'Volt', currentValue: 24.2, lastUpdatedAt: new Date().toISOString() },
];
