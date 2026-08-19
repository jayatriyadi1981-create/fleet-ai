/**
 * Fleet Intelligence Smart AI - GPS Integration & Protocol Abstraction Layer
 * PROMPT 43: Complete Type Definitions, Protocol Adapters, Normalization & Command Abstractions
 */

export type ProtocolTransport = 'TCP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket' | 'UDP' | 'gRPC' | 'Kafka' | 'AMQP';

export type IngestionProcessingStatus =
  | 'RECEIVED'
  | 'DECODING'
  | 'IDENTIFIED'
  | 'PARSED'
  | 'VALIDATED'
  | 'NORMALIZED'
  | 'ENRICHED'
  | 'STORED'
  | 'PUBLISHED'
  | 'PARSER_ERROR'
  | 'INVALID_LOCATION'
  | 'STALE_TIMESTAMP'
  | 'DUPLICATE'
  | 'UNAUTHORIZED_DEVICE'
  | 'UNKNOWN_IMEI'
  | 'REJECTED'
  | 'DLQ_STORED';

export type TelemetryQuality = 'EXCELLENT' | 'GOOD' | 'POOR' | 'INVALID';

export type AnomalyType =
  | 'IMPOSSIBLE_SPEED'
  | 'IMPOSSIBLE_DISTANCE'
  | 'GPS_JUMP'
  | 'DUPLICATE_POSITION'
  | 'STALE_TIMESTAMP'
  | 'FUTURE_TIMESTAMP'
  | 'INVALID_COORDINATES'
  | 'SIGNAL_LOSS_SPIKE';

export type AnomalyStatus = 'VALID' | 'SUSPECTED' | 'INVALID';

export type ConnectionState = 'CONNECTED' | 'AUTHENTICATING' | 'AUTHENTICATED' | 'IDLE' | 'DISCONNECTED' | 'ERROR';

export type GPSCommandType =
  | 'REQUEST_LOCATION'
  | 'SET_INTERVAL'
  | 'RESTART_DEVICE'
  | 'SET_APN'
  | 'SET_SERVER'
  | 'SET_OUTPUT'
  | 'LOCK_ENGINE'
  | 'UNLOCK_ENGINE'
  | 'REQUEST_STATUS'
  | 'UPDATE_FIRMWARE'
  | 'CLEAR_BUFFER';

export type GPSCommandStatus = 'PENDING' | 'SENT' | 'ACKNOWLEDGED' | 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'CANCELLED';

export type GPSEventType =
  | 'IGNITION_ON'
  | 'IGNITION_OFF'
  | 'OVERSPEED'
  | 'GEOFENCE_ENTER'
  | 'GEOFENCE_EXIT'
  | 'HARSH_BRAKING'
  | 'HARSH_ACCELERATION'
  | 'HARSH_CORNERING'
  | 'PANIC'
  | 'LOW_BATTERY'
  | 'POWER_CUT'
  | 'FUEL_DRAIN'
  | 'TEMPERATURE_HIGH'
  | 'DEVICE_OFFLINE'
  | 'DEVICE_ONLINE'
  | 'TAMPER_DETECTED';

export type DeviceCapabilityKey =
  | 'location'
  | 'ignition'
  | 'speed'
  | 'heading'
  | 'fuel'
  | 'temperature'
  | 'battery'
  | 'odometer'
  | 'engineHours'
  | 'canBus'
  | 'digitalInput'
  | 'digitalOutput'
  | 'panic'
  | 'camera'
  | 'bleSensors'
  | 'twoWayAudio';

export interface GPSDeviceCapabilityMatrix {
  location: boolean;
  ignition: boolean;
  speed: boolean;
  heading: boolean;
  fuel: boolean;
  temperature: boolean;
  battery: boolean;
  odometer: boolean;
  engineHours: boolean;
  canBus: boolean;
  digitalInput: boolean;
  digitalOutput: boolean;
  panic: boolean;
  camera?: boolean;
  bleSensors?: boolean;
}

export interface GPSDeviceProfile {
  id: string;
  name: string;
  manufacturer: string; // e.g. Teltonika, Queclink, Concox / Jimi, Meitrack, Generic
  model: string; // e.g. FMB920, GV300, GT06N, VL03, T333
  protocol: string; // e.g. Teltonika_Codec8, Queclink_Track, GT06_Binary, Meitrack_Ascii, Generic_JSON
  protocolVersion: string;
  parser: string;
  transport: ProtocolTransport;
  defaultPort: number;
  capabilities: GPSDeviceCapabilityMatrix;
  commandSupport: GPSCommandType[];
  telemetrySupport: string[];
  status: 'ACTIVE' | 'TESTING' | 'DEPRECATED';
  description: string;
}

export interface GPSDeviceConfiguration {
  id: string;
  imei: string; // 15 digits
  serialNumber: string;
  manufacturer: string;
  model: string;
  protocol: string;
  protocolVersion: string;
  serverHost: string;
  serverPort: number;
  apn: string;
  simNumber: string;
  simProvider: string;
  authenticationMethod: 'None' | 'IMEI_Handshake' | 'Token' | 'TLS_Cert' | 'Basic_Auth';
  firmware: string;
  timezone: string; // e.g. 'Asia/Jakarta' (UTC+7)
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  offlineThresholdMinutes: number; // e.g. 15 mins
  isSensitiveMasked?: boolean;
}

export interface RawGPSMessage {
  id: string;
  receivedAt: string; // ISO String
  transport: ProtocolTransport;
  protocol: string;
  provider: string;
  deviceIdentifier: string; // IMEI or Serial or IP
  payload: string | Record<string, any>;
  remoteAddress?: string;
  remotePort?: number;
  messageType: 'LOCATION' | 'HEARTBEAT' | 'ALARM' | 'COMMAND_RESP' | 'STATUS' | 'UNKNOWN';
  parserVersion: string;
  rawBytesLength?: number;
  processingStatus: IngestionProcessingStatus;
  processingDurationMs?: number;
  errorMessage?: string;
  tenantId?: string;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed: number; // km/h >= 0
  heading: number; // 0-359
  accuracy: number; // meters
  timestamp: string; // Device Timestamp ISO
  isValid: boolean;
}

export interface GPSTelemetry {
  speed: number;
  rpm?: number;
  fuelLevelPercent?: number;
  temperatureCelsius?: number;
  batteryVoltage?: number;
  externalVoltage?: number;
  batteryPercent?: number;
  odometerKm?: number;
  engineHours?: number;
  ignition: boolean;
  pto?: boolean;
  doorOpen?: boolean;
  acOn?: boolean;
  seatbeltFastened?: boolean;
  satellites: number;
  hdop?: number;
  signalStrengthPercent?: number;
  digitalInputs?: Record<string, boolean>;
  digitalOutputs?: Record<string, boolean>;
}

export interface NormalizedGPSMessage {
  id: string;
  deviceId: string;
  imei: string;
  timestamp: string; // ISO
  location: GPSLocation;
  telemetry: GPSTelemetry;
  // Flat shortcuts for fast indexing
  latitude: number;
  longitude: number;
  altitude?: number;
  speed: number;
  heading: number;
  ignition: boolean;
  satellites: number;
  accuracy: number;
  battery?: number;
  signal?: number;
  odometer?: number;
  engineHours?: number;
  fuelLevel?: number;
  temperature?: number;
  digitalInputs?: Record<string, boolean>;
  digitalOutputs?: Record<string, boolean>;
  rawMetadata?: Record<string, any>;
  quality: TelemetryQuality;
  anomalies?: AnomalyType[];
}

export interface EnrichedGPSMessage extends NormalizedGPSMessage {
  tenantId: string;
  companyId: string;
  vehicleId?: string;
  vehiclePlate?: string;
  vehicleName?: string;
  driverId?: string;
  driverName?: string;
  branchId?: string;
  branchName?: string;
  currentTripId?: string;
  enrichedAt: string;
}

export interface GPSEvent {
  id: string;
  tenantId: string;
  companyId: string;
  deviceId: string;
  vehicleId?: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  type: GPSEventType;
  timestamp: string;
  location: GPSLocation;
  value?: string | number | boolean;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  metadata?: Record<string, any>;
}

export interface GPSCommand {
  id: string;
  type: GPSCommandType;
  deviceId: string;
  deviceImei: string;
  parameters: Record<string, any>;
  requiresSafetyConfirmation?: boolean;
  tenantId: string;
  companyId: string;
  requestedBy: {
    userId: string;
    userName: string;
    role: string;
  };
  createdAt: string;
}

export interface GPSCommandResult {
  commandId: string;
  deviceId: string;
  status: GPSCommandStatus;
  sentAt?: string;
  acknowledgedAt?: string;
  completedAt?: string;
  responsePayload?: string;
  errorCode?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

export interface CommandQueueItem {
  command: GPSCommand;
  result: GPSCommandResult;
  auditTrail: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
}

export interface GPSProviderHealth {
  providerId: string;
  providerName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  uptimeSeconds: number;
  activeConnections: number;
  messagesPerSecond: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  lastPingAt: string;
}

export interface GPSProvider {
  providerId: string;
  providerName: string;
  manufacturer: string;
  supportedProtocols: string[];
  transports: ProtocolTransport[];
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  authenticate(): Promise<void>;
  send(command: GPSCommand): Promise<GPSCommandResult>;
  receive(): AsyncIterable<RawGPSMessage>;
  healthCheck(): Promise<GPSProviderHealth>;
}

export interface ConnectionSession {
  id: string;
  deviceId?: string;
  imei?: string;
  transport: ProtocolTransport;
  protocol: string;
  remoteIp: string;
  remotePort: number;
  connectedAt: string;
  lastHeartbeatAt: string;
  state: ConnectionState;
  messagesReceived: number;
  messagesSent: number;
  latencyMs: number;
  idleTimeSeconds: number;
}

export interface DeadLetterMessage {
  id: string;
  receivedAt: string;
  transport: ProtocolTransport;
  protocol: string;
  deviceIdentifier: string;
  rawPayload: string;
  reason: string;
  errorCategory: 'CANNOT_PARSE' | 'INVALID_PROTOCOL' | 'UNKNOWN_DEVICE' | 'INVALID_PAYLOAD' | 'PROCESSING_FAILURE';
  retryCount: number;
  status: 'PENDING' | 'REPROCESSED' | 'DISCARDED';
  reprocessedAt?: string;
  reprocessedBy?: string;
  auditLog: string[];
}

export interface DiscoveryPendingDevice {
  id: string;
  imei: string;
  detectedProtocol: string;
  transport: ProtocolTransport;
  remoteIp: string;
  firstSeenAt: string;
  lastSeenAt: string;
  pingsCount: number;
  status: 'PENDING_APPROVAL' | 'REGISTERED' | 'REJECTED';
  suggestedModel?: string;
  suggestedManufacturer?: string;
}

export interface GPSDataQualityMetric {
  deviceId: string;
  period: string;
  totalPackets: number;
  validPackets: number;
  anomaliesDetected: number;
  qualityScore: number; // 0 - 100
  qualityGrade: TelemetryQuality;
  anomaliesBreakdown: Record<AnomalyType, number>;
  signalStabilityScore: number;
  latencyAvgMs: number;
}
