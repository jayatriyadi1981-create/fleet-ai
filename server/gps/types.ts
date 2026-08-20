/**
 * Fleet Intelligence Smart AI - GPS Ingestion Server Types
 * Supports JT808, Teltonika Codec 8, Concox GT06N, and Generic REST/JSON
 */

export interface ParsedGpsTelemetry {
  imei: string;
  protocol: 'JT808' | 'TELTONIKA' | 'CONCOX_GT06N' | 'GENERIC_JSON' | 'MQTT';
  timestamp: string; // ISO 8601
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  speedKmh: number;
  heading: number; // 0 - 360
  satellites?: number;
  hdop?: number;
  ignition: boolean;
  batteryVoltage?: number;
  fuelLevelPercent?: number;
  fuelLiters?: number;
  odometerKm?: number;
  engineRpm?: number;
  engineTempCelsius?: number;
  doorOpen?: boolean;
  sosAlert?: boolean;
  powerCutAlert?: boolean;
  overspeedAlert?: boolean;
  geofenceAlert?: boolean;
  rawHexPayload?: string;
}

export interface IngestionResult {
  success: boolean;
  recordCount: number;
  imei: string;
  vehicleId?: string;
  telemetry: ParsedGpsTelemetry;
  persistedToSupabase: boolean;
  alertsTriggered: string[];
  message: string;
  timestamp: string;
}

export interface GpsDeviceRegistration {
  imei: string;
  deviceModel: string;
  protocol: 'TELTONIKA' | 'JT808' | 'CONCOX_GT06N' | 'GENERIC_JSON';
  simCardNumber?: string;
  cellularProvider?: string;
  plateNumber?: string;
  tenantId?: string;
}
