/**
 * Fleet Intelligence Smart AI - GPS Device Management Domain Types
 * PROMPT 10 - Enterprise GPS Tracker, Telematics Protocol, SIM, Firmware & Diagnostics Architecture
 */

export type DeviceAdminStatus = 'active' | 'inactive' | 'suspended' | 'retired' | 'archived';

export type DeviceConnectionStatus = 'online' | 'offline' | 'delayed' | 'unknown' | 'never_connected';

export type DeviceHealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export type DeviceInventoryStatus = 'installed' | 'in_stock' | 'maintenance' | 'replacement' | 'lost' | 'retired' | 'archived';

export type SIMProvider = 'Telkomsel' | 'Indosat' | 'XL' | 'Tri' | 'Smartfren' | 'Other';

export type SIMStatus = 'active' | 'inactive' | 'suspended' | 'expired' | 'lost' | 'replaced';

export type ProtocolTransport = 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket' | 'Other';

export type FirmwareStatus = 'available' | 'testing' | 'approved' | 'deprecated';

export type CommandStatus = 'pending' | 'sent' | 'acknowledged' | 'failed' | 'expired' | 'cancelled';

export type CommandType =
  | 'REQUEST_POSITION'
  | 'RESTART_DEVICE'
  | 'SET_APN'
  | 'SET_INTERVAL'
  | 'SET_SERVER'
  | 'LOCK_VEHICLE'
  | 'UNLOCK_VEHICLE'
  | 'UPDATE_CONFIG'
  | 'FIRMWARE_UPDATE';

export interface GPSDeviceExtended {
  id: string; // Primary internal identifier (deviceId)
  tenantId: string;
  deviceCode: string; // e.g. GPS-000124
  imei: string; // 15-digit IMEI
  serialNumber: string;
  manufacturer: string; // e.g. Teltonika, Concox, Queclink, Ruptela, Suntech
  model: string; // e.g. FMB920, AT4, GV300
  protocolId: string;
  protocolName: string;
  firmwareVersion: string;
  latestAvailableFirmware?: string;
  
  // Three separate status fields
  status: DeviceAdminStatus;
  connectionStatus: DeviceConnectionStatus;
  healthStatus: DeviceHealthStatus;
  inventoryStatus: DeviceInventoryStatus;
  healthScore: number; // 0 - 100
  
  simId?: string;
  simNumber?: string;
  simProvider?: SIMProvider;
  vehicleId?: string;
  vehiclePlate?: string;
  branchId?: string;
  branchName?: string;
  
  installationDate?: string;
  lastPingAt: string; // ISO String
  lastSuccessfulMessageAt?: string;
  messagesToday: number;
  messagesFailed: number;
  
  // Power & Signal Metrics
  externalVoltage?: number; // Volts
  batteryVoltage?: number; // Volts
  batteryPercent?: number; // 0 - 100
  satellitesCount?: number;
  gpsAccuracyMeters?: number;
  hdop?: number;
  connectionLatencyMs?: number;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SIMCard {
  id: string; // simId
  tenantId: string;
  phoneNumber: string;
  iccid: string; // 19-20 digit ICCID
  imsi?: string;
  apn: string;
  apnUsername?: string;
  apnPassword?: string;
  provider: SIMProvider;
  network: '4G' | '2G' | 'NB-IoT' | '5G' | '3G';
  plan: string;
  status: SIMStatus;
  activationDate: string;
  expiryDate: string;
  currentDeviceId?: string;
  currentDeviceCode?: string;
  monthlyDataLimitMb: number;
  dataUsedMb: number;
  notes?: string;
}

export interface SIMAssignmentHistory {
  id: string;
  simId: string;
  deviceId: string;
  deviceCode: string;
  assignedAt: string;
  unassignedAt?: string;
  assignedBy: string;
  reason: string;
}

export interface GPSProtocol {
  id: string;
  name: string; // e.g. GT06, Teltonika Codec 8, Concox, JT808
  version: string;
  transport: ProtocolTransport;
  port: number;
  encoding: 'Binary' | 'Hex' | 'JSON' | 'Text';
  parserAdapter: string;
  status: 'active' | 'deprecated' | 'testing';
  authenticationMethod: 'None' | 'IMEI_Handshake' | 'Token' | 'TLS_Client_Cert';
  description?: string;
}

export interface FirmwarePackage {
  id: string;
  manufacturer: string;
  model: string;
  version: string;
  releaseDate: string;
  status: FirmwareStatus;
  fileChecksum: string; // SHA-256
  fileSizeMb: number;
  releaseNotes: string;
  compatibleModels: string[];
}

export interface NormalizedTelemetry {
  id: string;
  tenantId: string;
  deviceId: string;
  vehicleId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  altitude: number;
  ignition: boolean;
  satellites: number;
  accuracy: number;
  batteryVoltage: number;
  externalVoltage: number;
  odometerKm: number;
  fuelLevelPercent?: number;
  rawDataReference?: string;
}

export interface DeviceDiagnosticCheck {
  id: string;
  name: string;
  category: 'IMEI' | 'SIM' | 'Network' | 'Connection' | 'GPS' | 'Power' | 'Firmware' | 'Protocol';
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: string;
}

export interface DeviceDiagnosticResult {
  id: string;
  deviceId: string;
  deviceCode: string;
  timestamp: string;
  performedBy: string;
  overallStatus: 'pass' | 'warn' | 'fail';
  checks: DeviceDiagnosticCheck[];
  findings: string[];
}

export interface DeviceEvent {
  id: string;
  deviceId: string;
  timestamp: string;
  type: 'connection' | 'signal' | 'power' | 'firmware' | 'assignment' | 'diagnostic' | 'alert';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface DeviceCommand {
  id: string;
  deviceId: string;
  deviceCode: string;
  vehiclePlate?: string;
  commandType: CommandType;
  parameters: Record<string, any>;
  status: CommandStatus;
  sentBy: string;
  createdAt: string;
  acknowledgedAt?: string;
  auditReference?: string;
  responsePayload?: string;
}

export interface DeviceAssignmentHistory {
  id: string;
  deviceId: string;
  vehicleId: string;
  vehiclePlate: string;
  assignedAt: string;
  unassignedAt?: string;
  assignedBy: string;
  reason: string;
}

export interface AIDeviceIntelligence {
  deviceId: string;
  healthForecast7Days: 'Low Risk' | 'Medium Risk' | 'High Risk';
  confidenceScore: number; // 0 - 100
  connectionStabilityIndex: number; // 0 - 100
  findings: {
    category: string;
    title: string;
    explanation: string;
    recommendedAction: string;
    severity: 'info' | 'warning' | 'critical';
  }[];
  powerTrend: 'stable' | 'fluctuating' | 'degrading';
  signalQualityScore: number;
  dataQualityScore: number;
}
