/**
 * Fleet Intelligence Smart AI - GPS Architecture Domain Types
 * PROMPT 12: Enterprise Scalable, Modular, Provider-Agnostic, Multi-Tenant Telematics Architecture
 */

export type TelemetryQuality = 'VALID' | 'PARTIAL' | 'SUSPECT' | 'INVALID';

export type IngestionProcessingStatus = 
  | 'RECEIVED'
  | 'PROCESSED'
  | 'REJECTED'
  | 'PARSER_ERROR'
  | 'INVALID_LOCATION'
  | 'STALE_TIMESTAMP'
  | 'DUPLICATE'
  | 'UNAUTHORIZED_DEVICE';

export type GpsConnectionStatus = 'Online' | 'Offline' | 'Connecting' | 'Unknown' | 'Suspended' | 'Disabled';

export type LocationStatus = 'Moving' | 'Stopped' | 'Idle' | 'Offline' | 'Unknown';

export type GpsSignalQuality = 'Excellent' | 'Good' | 'Weak' | 'No Fix' | 'Unknown';

export type GsmNetworkType = '2G' | '3G' | '4G' | 'LTE' | '5G' | 'Unknown';

export type EventSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventState = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export type GpsEventType =
  | 'LOCATION_UPDATE'
  | 'DEVICE_ONLINE'
  | 'DEVICE_OFFLINE'
  | 'IGNITION_ON'
  | 'IGNITION_OFF'
  | 'MOVING_STARTED'
  | 'MOVING_STOPPED'
  | 'IDLE_STARTED'
  | 'IDLE_ENDED'
  | 'SPEEDING'
  | 'HARSH_ACCELERATION'
  | 'HARSH_BRAKING'
  | 'HARSH_CORNERING'
  | 'GPS_SIGNAL_LOST'
  | 'GPS_SIGNAL_RESTORED'
  | 'LOW_VOLTAGE'
  | 'TAMPER_DETECTED';

export type GpsCommandType = 
  | 'REQUEST_LOCATION'
  | 'RESTART_DEVICE'
  | 'REQUEST_STATUS'
  | 'SET_INTERVAL'
  | 'LOCK_ENGINE'
  | 'UNLOCK_ENGINE';

export type GpsCommandStatus = 'Pending' | 'Sent' | 'Acknowledged' | 'Failed' | 'Timeout';

export type DeviceCapability = 
  | 'location'
  | 'ignition'
  | 'fuel'
  | 'temperature'
  | 'engine'
  | 'command'
  | 'immobilizer'
  | 'camera'
  | 'canbus';

export type SensorType = 'Fuel' | 'Temperature' | 'Door' | 'Engine' | 'Battery' | 'PTO' | 'RFID' | 'CAN' | 'OBD';

/**
 * 1. Raw Telemetry Message (Before Processing & Normalization)
 */
export interface RawGpsMessage {
  id: string;
  tenantId: string;
  deviceId: string;
  receivedAt: string; // ISO String (Server Received Time)
  protocol: string; // e.g. 'GT06', 'Teltonika_Codec8', 'Queclink', 'Generic_HTTP'
  messageType: string; // e.g. 'HEARTBEAT', 'LOCATION', 'ALARM', 'STATUS'
  payload: string | Record<string, any>; // Original raw payload / hex / json
  checksum?: string;
  sourceIp?: string;
  sequenceNumber?: number;
  processingStatus: IngestionProcessingStatus;
  processedAt?: string;
  error?: string;
}

/**
 * 2. Canonical Normalized Telemetry Model
 */
export interface NormalizedTelemetry {
  deviceId: string;
  vehicleId?: string;
  driverId?: string;
  timestamp: string; // ISO String (Device Timestamp)
  latitude: number;
  longitude: number;
  speed: number; // km/h
  heading: number; // 0 - 359 degrees
  altitude?: number;
  ignition: boolean;
  satellites: number;
  accuracy: number; // meters
  batteryVoltage?: number;
  externalVoltage?: number;
  odometerKm?: number;
  engineHours?: number;
  fuelLevelPercent?: number;
  sequenceNumber?: number;
  rawDataReference?: string;
  sensorData?: Record<string, any>;
}

/**
 * 3. Primary GPS Telemetry Entity (Historical Safe Data Storage)
 */
export interface GpsTelemetry {
  id: string;
  tenantId: string;
  deviceId: string;
  vehicleId: string;
  driverId?: string; // Snapshot attributed driver at packet timestamp
  timestamp: string; // Device Timestamp ISO
  receivedAt: string; // Server Received Time ISO
  processedAt: string; // Server Processed Time ISO
  latitude: number;
  longitude: number;
  altitude?: number;
  speed: number;
  heading: number;
  accuracy: number;
  satelliteCount: number;
  ignition: boolean;
  batteryVoltage?: number;
  externalVoltage?: number;
  odometer: number;
  engineHours?: number;
  fuelLevel?: number;
  gsmSignal?: number; // 0-100% or 0-31 RSSI
  gpsSignal?: GpsSignalQuality;
  source: string; // e.g. 'IngestionGateway'
  protocol: string;
  sequenceNumber?: number;
  rawDataReference?: string;
  quality: TelemetryQuality;
  sensorData?: Record<string, any>;
  createdAt: string;
}

/**
 * 4. GPS Location Model (Latest & Cached Vehicle Location)
 */
export interface VehicleLocation {
  id: string;
  tenantId: string;
  vehicleId: string;
  deviceId: string;
  driverId?: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  altitude?: number;
  timestamp: string; // Device Timestamp
  receivedAt: string; // Server Timestamp
  ignition: boolean;
  status: LocationStatus;
  lastSeenAt: string; // Device last seen
  lastLocationAt: string; // Vehicle last location update
  lastActivityAt?: string; // Driver last activity
  sensorData?: Record<string, any>;
}

/**
 * 5. Device Health & Signal Diagnostics
 */
export interface DeviceHealth {
  deviceId: string;
  tenantId: string;
  lastSeenAt: string; // ISO
  gpsSignal: GpsSignalQuality;
  gsmSignal: number; // 0-100%
  networkType: GsmNetworkType;
  operator: string;
  batteryVoltage: number;
  externalVoltage: number;
  temperature?: number; // Celsius
  firmwareVersion: string;
  connectionStatus: GpsConnectionStatus;
  healthScore: number; // 0 - 100
  satellitesCount: number;
  hdop: number;
  offlineThresholdSeconds: number;
}

/**
 * 6. GPS Events Entity
 */
export interface GpsEvent {
  id: string;
  tenantId: string;
  deviceId: string;
  vehicleId: string;
  driverId?: string;
  eventType: GpsEventType;
  severity: EventSeverity;
  timestamp: string; // ISO Event Time
  latitude: number;
  longitude: number;
  metadata: Record<string, any>; // Flexible metadata (e.g., speed, threshold, duration, voltage)
  source: string;
  status: EventState;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

/**
 * 7. GPS Event Rule Entity
 */
export interface GpsRule {
  ruleId: string;
  tenantId: string;
  name: string;
  eventType: GpsEventType;
  conditions: {
    speedThresholdKmH?: number;
    durationSeconds?: number;
    voltageThresholdVolts?: number;
    idleMinutesThreshold?: number;
    [key: string]: any;
  };
  severity: EventSeverity;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

/**
 * 8. GPS Device Command Entity
 */
export interface GpsCommand {
  id: string;
  tenantId: string;
  deviceId: string;
  commandType: GpsCommandType;
  payload: Record<string, any>;
  requestedBy: string;
  requestedAt: string;
  sentAt?: string;
  acknowledgedAt?: string;
  status: GpsCommandStatus;
  response?: string;
}

/**
 * 9. GPS Device External Identifier Mapping
 */
export interface GpsDeviceIdentifier {
  id: string;
  deviceId: string;
  identifierType: 'IMEI' | 'SERIAL' | 'PROTOCOL_ID' | 'MAC';
  identifierValue: string;
  isPrimary: boolean;
  createdAt: string;
}

/**
 * 10. Sensor Architecture
 */
export interface GpsSensor {
  id: string;
  deviceId: string;
  sensorType: SensorType;
  name: string;
  unit: string;
  currentValue: number | string | boolean;
  lastUpdatedAt: string;
}

/**
 * Ingestion Request & Response Canonical API Interfaces
 */
export interface GpsIngestRequest {
  deviceId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  ignition: boolean;
  odometer?: number;
  fuelLevel?: number;
  sequenceNumber?: number;
  protocol?: string;
  rawData?: any;
}

export interface GpsIngestResponse {
  success: boolean;
  accepted: boolean;
  telemetryId?: string;
  processingStatus: IngestionProcessingStatus;
  reason?: string;
}
