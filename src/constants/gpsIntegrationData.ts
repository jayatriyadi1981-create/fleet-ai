/**
 * Fleet Intelligence Smart AI - GPS Integration Registry & Mock Data
 * PROMPT 43: Protocol Registry, Vendor Registry, Device Profiles, Seed Data
 */

import {
  GPSDeviceProfile,
  GPSDeviceConfiguration,
  ConnectionSession,
  DeadLetterMessage,
  DiscoveryPendingDevice,
  GPSDataQualityMetric,
  RawGPSMessage,
  EnrichedGPSMessage,
  CommandQueueItem
} from '../types/gpsIntegration';

export const GPS_DEVICE_PROFILES: GPSDeviceProfile[] = [
  {
    id: 'prof-teltonika-fmb920',
    name: 'Teltonika FMB920 Smart Tracker',
    manufacturer: 'Teltonika',
    model: 'FMB920',
    protocol: 'Teltonika Codec 8 / 8 Extended',
    protocolVersion: 'v1.4',
    parser: 'TeltonikaCodec8Parser',
    transport: 'TCP',
    defaultPort: 5001,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: true,
      temperature: true,
      battery: true,
      odometer: true,
      engineHours: true,
      canBus: false,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
      bleSensors: true,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'SET_INTERVAL',
      'RESTART_DEVICE',
      'SET_APN',
      'SET_SERVER',
      'SET_OUTPUT',
      'LOCK_ENGINE',
      'UNLOCK_ENGINE',
      'REQUEST_STATUS'
    ],
    telemetrySupport: ['AVL_IO_ACC', 'AVL_IO_SPEED', 'AVL_IO_RPM', 'AVL_IO_EXT_VOLT', 'AVL_IO_BAT_VOLT', 'AVL_IO_BLE_TEMP', 'AVL_IO_ODOMETER'],
    status: 'ACTIVE',
    description: 'Compact 2G/Bluetooth GNSS tracker with internal backup battery and digital I/O relay control.'
  },
  {
    id: 'prof-teltonika-fmc130',
    name: 'Teltonika FMC130 4G LTE Telematics',
    manufacturer: 'Teltonika',
    model: 'FMC130',
    protocol: 'Teltonika Codec 8 Extended / Codec 16',
    protocolVersion: 'v2.1',
    parser: 'TeltonikaCodec8Parser',
    transport: 'TCP',
    defaultPort: 5001,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: true,
      temperature: true,
      battery: true,
      odometer: true,
      engineHours: true,
      canBus: true,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
      bleSensors: true,
      camera: false,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'SET_INTERVAL',
      'RESTART_DEVICE',
      'SET_APN',
      'SET_SERVER',
      'SET_OUTPUT',
      'LOCK_ENGINE',
      'UNLOCK_ENGINE',
      'REQUEST_STATUS',
      'UPDATE_FIRMWARE'
    ],
    telemetrySupport: ['CAN_SPEED', 'CAN_RPM', 'CAN_FUEL_LEVEL', 'CAN_TOTAL_ODOMETER', 'CAN_ENGINE_HOURS', 'BLE_BEACON', 'DIGITAL_INPUT_1'],
    status: 'ACTIVE',
    description: 'Advanced 4G Cat 1 tracker with flexible inputs, CAN bus decoding, and remote immobilizer output.'
  },
  {
    id: 'prof-queclink-gv300',
    name: 'Queclink GV300 Advanced GPS',
    manufacturer: 'Queclink',
    model: 'GV300',
    protocol: 'Queclink @Track Protocol',
    protocolVersion: 'v3.02',
    parser: 'QueclinkTrackParser',
    transport: 'TCP',
    defaultPort: 5003,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: true,
      temperature: true,
      battery: true,
      odometer: true,
      engineHours: true,
      canBus: false,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'SET_INTERVAL',
      'RESTART_DEVICE',
      'SET_APN',
      'SET_SERVER',
      'SET_OUTPUT',
      'LOCK_ENGINE',
      'UNLOCK_ENGINE'
    ],
    telemetrySupport: ['GTFRI', 'GTEVT', 'GTINF', 'GTHBM', 'GTDIS', 'GTDOS'],
    status: 'ACTIVE',
    description: 'Reliable ASCII/binary @Track protocol tracker popular for enterprise logistics and fleet tracking.'
  },
  {
    id: 'prof-concox-gt06n',
    name: 'Concox / Jimi GT06N Standard Tracker',
    manufacturer: 'Concox / Jimi',
    model: 'GT06N',
    protocol: 'Concox GT06 Binary Protocol',
    protocolVersion: 'v1.0',
    parser: 'GT06Parser',
    transport: 'TCP',
    defaultPort: 5002,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: false,
      temperature: false,
      battery: true,
      odometer: true,
      engineHours: false,
      canBus: false,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'RESTART_DEVICE',
      'SET_APN',
      'SET_SERVER',
      'LOCK_ENGINE',
      'UNLOCK_ENGINE'
    ],
    telemetrySupport: ['LOGIN_0x01', 'LOCATION_0x12', 'STATUS_0x13', 'STRING_0x15', 'ALARM_0x16', 'GPS_LBS_0x22'],
    status: 'ACTIVE',
    description: 'High-volume binary packet protocol tracker widely deployed across light commercial fleets in Indonesia.'
  },
  {
    id: 'prof-jimi-vl03',
    name: 'Jimi IoT VL03 4G LTE Cat 1',
    manufacturer: 'Concox / Jimi',
    model: 'VL03',
    protocol: 'Jimi JT808 / Concox Ext',
    protocolVersion: 'v2.0',
    parser: 'GT06Parser',
    transport: 'TCP',
    defaultPort: 5002,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: true,
      temperature: true,
      battery: true,
      odometer: true,
      engineHours: true,
      canBus: false,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'SET_INTERVAL',
      'RESTART_DEVICE',
      'SET_APN',
      'LOCK_ENGINE',
      'UNLOCK_ENGINE',
      'REQUEST_STATUS'
    ],
    telemetrySupport: ['LOGIN', 'LOCATION_EXT', 'ALARM_PACKET', 'VOLTAGE_INFO', 'DRIVING_BEHAVIOR'],
    status: 'ACTIVE',
    description: '4G OBD/hardwired tracker supporting harsh driving alerts, fuel sensing, and remote cutoff.'
  },
  {
    id: 'prof-meitrack-t333',
    name: 'Meitrack T333 Industrial Telematics',
    manufacturer: 'Meitrack',
    model: 'T333',
    protocol: 'Meitrack Protocol',
    protocolVersion: 'v2.2',
    parser: 'MeitrackParser',
    transport: 'TCP',
    defaultPort: 5004,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: true,
      temperature: true,
      battery: true,
      odometer: true,
      engineHours: true,
      canBus: true,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
      camera: true,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'SET_INTERVAL',
      'RESTART_DEVICE',
      'SET_SERVER',
      'LOCK_ENGINE',
      'UNLOCK_ENGINE',
      'REQUEST_STATUS'
    ],
    telemetrySupport: ['AAA_EVENT', 'CCE_LOCATION', 'CCC_ALARM', 'CFG_PARAM', 'CAMERA_PICTURE'],
    status: 'ACTIVE',
    description: 'Heavy duty tracker designed for refrigerated logistics, fuel tankers, and construction equipment.'
  },
  {
    id: 'prof-generic-mqtt',
    name: 'Generic IoT Telematics (MQTT)',
    manufacturer: 'Generic / Custom IoT',
    model: 'MQTT-JSON Gateway',
    protocol: 'Standard MQTT JSON Schema v1',
    protocolVersion: 'v1.0',
    parser: 'GenericJsonParser',
    transport: 'MQTT',
    defaultPort: 1883,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: true,
      temperature: true,
      battery: true,
      odometer: true,
      engineHours: true,
      canBus: true,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'SET_INTERVAL',
      'RESTART_DEVICE',
      'SET_OUTPUT',
      'LOCK_ENGINE',
      'UNLOCK_ENGINE',
      'REQUEST_STATUS'
    ],
    telemetrySupport: ['fleet/{deviceId}/telemetry', 'fleet/{deviceId}/event', 'fleet/{deviceId}/status'],
    status: 'ACTIVE',
    description: 'Vendor-agnostic lightweight JSON ingestion over secure MQTT message broker (e.g. EMQX / Mosquitto).'
  },
  {
    id: 'prof-generic-http',
    name: 'Generic REST / Webhook Ingestion',
    manufacturer: 'Generic / REST Gateway',
    model: 'HTTP-Webhook',
    protocol: 'REST Ingest API v2',
    protocolVersion: 'v2.0',
    parser: 'GenericJsonParser',
    transport: 'HTTPS',
    defaultPort: 8080,
    capabilities: {
      location: true,
      ignition: true,
      speed: true,
      heading: true,
      fuel: true,
      temperature: true,
      battery: true,
      odometer: true,
      engineHours: true,
      canBus: true,
      digitalInput: true,
      digitalOutput: true,
      panic: true,
    },
    commandSupport: [
      'REQUEST_LOCATION',
      'REQUEST_STATUS'
    ],
    telemetrySupport: ['POST /api/v1/gps/ingest', 'POST /api/v1/telemetry/batch'],
    status: 'ACTIVE',
    description: 'Standard JSON REST webhook endpoint for third-party telematics clouds and third-party gateways.'
  }
];

export const MOCK_GPS_DEVICES_CONFIG: GPSDeviceConfiguration[] = [
  {
    id: 'dev-001',
    imei: '867492041234561',
    serialNumber: 'SN-TEL-882191',
    manufacturer: 'Teltonika',
    model: 'FMB920',
    protocol: 'Teltonika Codec 8',
    protocolVersion: 'v1.4',
    serverHost: 'gateway.fleetintelligence.id',
    serverPort: 5001,
    apn: 'internet',
    simNumber: '+6281198765401',
    simProvider: 'Telkomsel M2M',
    authenticationMethod: 'IMEI_Handshake',
    firmware: '03.28.02.Rev.00',
    timezone: 'Asia/Jakarta',
    status: 'active',
    offlineThresholdMinutes: 15,
    isSensitiveMasked: true
  },
  {
    id: 'dev-002',
    imei: '869103049182732',
    serialNumber: 'SN-TEL-882192',
    manufacturer: 'Teltonika',
    model: 'FMC130',
    protocol: 'Teltonika Codec 8 Extended',
    protocolVersion: 'v2.1',
    serverHost: 'gateway.fleetintelligence.id',
    serverPort: 5001,
    apn: 'm2mautotrack.isat',
    simNumber: '+6281598765402',
    simProvider: 'Indosat Ooredoo Business',
    authenticationMethod: 'IMEI_Handshake',
    firmware: '03.29.00.Rev.04',
    timezone: 'Asia/Jakarta',
    status: 'active',
    offlineThresholdMinutes: 15,
    isSensitiveMasked: true
  },
  {
    id: 'dev-003',
    imei: '356789012345673',
    serialNumber: 'SN-QUE-440193',
    manufacturer: 'Queclink',
    model: 'GV300',
    protocol: 'Queclink @Track',
    protocolVersion: 'v3.02',
    serverHost: 'gateway.fleetintelligence.id',
    serverPort: 5003,
    apn: 'xliot.id',
    simNumber: '+6287898765403',
    simProvider: 'XL Axiata IoT',
    authenticationMethod: 'Token',
    firmware: 'A12V08',
    timezone: 'Asia/Jakarta',
    status: 'active',
    offlineThresholdMinutes: 15,
    isSensitiveMasked: true
  },
  {
    id: 'dev-004',
    imei: '868123045678904',
    serialNumber: 'SN-CON-771024',
    manufacturer: 'Concox / Jimi',
    model: 'GT06N',
    protocol: 'Concox GT06 Binary',
    protocolVersion: 'v1.0',
    serverHost: 'gateway.fleetintelligence.id',
    serverPort: 5002,
    apn: 'internet',
    simNumber: '+6281298765404',
    simProvider: 'Telkomsel M2M',
    authenticationMethod: 'IMEI_Handshake',
    firmware: 'GT06N_V1.28',
    timezone: 'Asia/Jakarta',
    status: 'active',
    offlineThresholdMinutes: 15,
    isSensitiveMasked: true
  },
  {
    id: 'dev-005',
    imei: '864501049283745',
    serialNumber: 'SN-JIM-992015',
    manufacturer: 'Concox / Jimi',
    model: 'VL03',
    protocol: 'Jimi JT808',
    protocolVersion: 'v2.0',
    serverHost: 'gateway.fleetintelligence.id',
    serverPort: 5002,
    apn: 'm2mautotrack.isat',
    simNumber: '+6281598765405',
    simProvider: 'Indosat Ooredoo Business',
    authenticationMethod: 'IMEI_Handshake',
    firmware: 'VL03_4G_R02',
    timezone: 'Asia/Jakarta',
    status: 'active',
    offlineThresholdMinutes: 15,
    isSensitiveMasked: true
  },
  {
    id: 'dev-006',
    imei: '862304019283746',
    serialNumber: 'SN-MEI-552016',
    manufacturer: 'Meitrack',
    model: 'T333',
    protocol: 'Meitrack Protocol',
    protocolVersion: 'v2.2',
    serverHost: 'gateway.fleetintelligence.id',
    serverPort: 5004,
    apn: 'internet',
    simNumber: '+6281398765406',
    simProvider: 'Telkomsel M2M',
    authenticationMethod: 'IMEI_Handshake',
    firmware: 'T333_FW_081',
    timezone: 'Asia/Jakarta',
    status: 'active',
    offlineThresholdMinutes: 15,
    isSensitiveMasked: true
  }
];

export const MOCK_ACTIVE_CONNECTIONS: ConnectionSession[] = [
  {
    id: 'conn-tcp-001',
    deviceId: 'dev-001',
    imei: '867492041234561',
    transport: 'TCP',
    protocol: 'Teltonika Codec 8',
    remoteIp: '180.252.164.12',
    remotePort: 48291,
    connectedAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    lastHeartbeatAt: new Date(Date.now() - 6 * 1000).toISOString(),
    state: 'AUTHENTICATED',
    messagesReceived: 482,
    messagesSent: 12,
    latencyMs: 34,
    idleTimeSeconds: 6
  },
  {
    id: 'conn-tcp-002',
    deviceId: 'dev-002',
    imei: '869103049182732',
    transport: 'TCP',
    protocol: 'Teltonika Codec 8 Extended',
    remoteIp: '114.124.201.88',
    remotePort: 51204,
    connectedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    lastHeartbeatAt: new Date(Date.now() - 4 * 1000).toISOString(),
    state: 'AUTHENTICATED',
    messagesReceived: 1420,
    messagesSent: 28,
    latencyMs: 28,
    idleTimeSeconds: 4
  },
  {
    id: 'conn-tcp-003',
    deviceId: 'dev-003',
    imei: '356789012345673',
    transport: 'TCP',
    protocol: 'Queclink @Track',
    remoteIp: '110.138.92.45',
    remotePort: 39012,
    connectedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    lastHeartbeatAt: new Date(Date.now() - 12 * 1000).toISOString(),
    state: 'AUTHENTICATED',
    messagesReceived: 180,
    messagesSent: 4,
    latencyMs: 52,
    idleTimeSeconds: 12
  },
  {
    id: 'conn-tcp-004',
    deviceId: 'dev-004',
    imei: '868123045678904',
    transport: 'TCP',
    protocol: 'Concox GT06 Binary',
    remoteIp: '182.1.200.77',
    remotePort: 42100,
    connectedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    lastHeartbeatAt: new Date(Date.now() - 10 * 1000).toISOString(),
    state: 'AUTHENTICATED',
    messagesReceived: 910,
    messagesSent: 16,
    latencyMs: 41,
    idleTimeSeconds: 10
  },
  {
    id: 'conn-mqtt-001',
    deviceId: 'dev-005',
    imei: '864501049283745',
    transport: 'MQTT',
    protocol: 'Standard MQTT JSON Schema v1',
    remoteIp: '103.247.112.5',
    remotePort: 1883,
    connectedAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    lastHeartbeatAt: new Date(Date.now() - 2 * 1000).toISOString(),
    state: 'AUTHENTICATED',
    messagesReceived: 3840,
    messagesSent: 64,
    latencyMs: 19,
    idleTimeSeconds: 2
  },
  {
    id: 'conn-ws-001',
    deviceId: 'dev-006',
    imei: '862304019283746',
    transport: 'WebSocket',
    protocol: 'Meitrack Protocol',
    remoteIp: '36.88.192.14',
    remotePort: 8081,
    connectedAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    lastHeartbeatAt: new Date(Date.now() - 8 * 1000).toISOString(),
    state: 'AUTHENTICATED',
    messagesReceived: 2190,
    messagesSent: 30,
    latencyMs: 38,
    idleTimeSeconds: 8
  }
];

export const MOCK_DEAD_LETTER_QUEUE: DeadLetterMessage[] = [
  {
    id: 'dlq-001',
    receivedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    transport: 'TCP',
    protocol: 'Unknown Binary',
    deviceIdentifier: '869999019283000',
    rawPayload: '78780D0108699990192830000001859C0D0A',
    reason: 'Packet checksum mismatch in GT06 header. Expected 0x859C but calculated 0x4A12.',
    errorCategory: 'CANNOT_PARSE',
    retryCount: 2,
    status: 'PENDING',
    auditLog: [
      'Received at 2026-08-18T08:45:12Z on port 5002',
      'Parser attempt failed: CRC check failed',
      'Moved to DLQ automatically'
    ]
  },
  {
    id: 'dlq-002',
    receivedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    transport: 'HTTP',
    protocol: 'Generic REST',
    deviceIdentifier: 'IMEI-UNKNOWN-9921',
    rawPayload: '{"lat":-6.2001,"lng":106.8123,"timestamp":"2021-01-01T00:00:00Z","speed":60}',
    reason: 'Stale device timestamp older than 180 days rejected by ingestion policy.',
    errorCategory: 'INVALID_PAYLOAD',
    retryCount: 1,
    status: 'PENDING',
    auditLog: [
      'Received at 2026-08-18T08:28:00Z via /api/v1/gps/ingest',
      'Validation error: Stale timestamp (2021-01-01)'
    ]
  },
  {
    id: 'dlq-003',
    receivedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    transport: 'TCP',
    protocol: 'Teltonika Codec 8',
    deviceIdentifier: '865512049182345',
    rawPayload: '0000000000000032080100000171B3E0A1200106606BC03FACB5C0000A00140800',
    reason: 'Unregistered device IMEI not found in tenant device catalog and tenant assignment missing.',
    errorCategory: 'UNKNOWN_DEVICE',
    retryCount: 3,
    status: 'PENDING',
    auditLog: [
      'Received at 2026-08-18T07:58:20Z on port 5001',
      'IMEI identified: 865512049182345',
      'Tenant lookup returned empty (unresolved tenant)'
    ]
  }
];

export const MOCK_PENDING_DISCOVERY: DiscoveryPendingDevice[] = [
  {
    id: 'disc-001',
    imei: '865512049182345',
    detectedProtocol: 'Teltonika Codec 8',
    transport: 'TCP',
    remoteIp: '180.252.88.201',
    firstSeenAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    lastSeenAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    pingsCount: 84,
    status: 'PENDING_APPROVAL',
    suggestedModel: 'FMB920',
    suggestedManufacturer: 'Teltonika'
  },
  {
    id: 'disc-002',
    imei: '863391048271629',
    detectedProtocol: 'Concox GT06 Binary',
    transport: 'TCP',
    remoteIp: '114.124.90.15',
    firstSeenAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    lastSeenAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    pingsCount: 240,
    status: 'PENDING_APPROVAL',
    suggestedModel: 'GT06N',
    suggestedManufacturer: 'Concox / Jimi'
  },
  {
    id: 'disc-003',
    imei: '358901048271610',
    detectedProtocol: 'Queclink @Track',
    transport: 'TCP',
    remoteIp: '103.247.50.80',
    firstSeenAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    lastSeenAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    pingsCount: 520,
    status: 'PENDING_APPROVAL',
    suggestedModel: 'GV300',
    suggestedManufacturer: 'Queclink'
  }
];

export const MOCK_QUALITY_METRICS: GPSDataQualityMetric[] = [
  {
    deviceId: 'dev-001',
    period: 'Last 24 Hours',
    totalPackets: 5760,
    validPackets: 5742,
    anomaliesDetected: 18,
    qualityScore: 98.4,
    qualityGrade: 'EXCELLENT',
    anomaliesBreakdown: {
      IMPOSSIBLE_SPEED: 0,
      IMPOSSIBLE_DISTANCE: 2,
      GPS_JUMP: 8,
      DUPLICATE_POSITION: 4,
      STALE_TIMESTAMP: 0,
      FUTURE_TIMESTAMP: 0,
      INVALID_COORDINATES: 0,
      SIGNAL_LOSS_SPIKE: 4
    },
    signalStabilityScore: 96.5,
    latencyAvgMs: 32
  },
  {
    deviceId: 'dev-002',
    period: 'Last 24 Hours',
    totalPackets: 5760,
    validPackets: 5756,
    anomaliesDetected: 4,
    qualityScore: 99.2,
    qualityGrade: 'EXCELLENT',
    anomaliesBreakdown: {
      IMPOSSIBLE_SPEED: 0,
      IMPOSSIBLE_DISTANCE: 0,
      GPS_JUMP: 1,
      DUPLICATE_POSITION: 2,
      STALE_TIMESTAMP: 0,
      FUTURE_TIMESTAMP: 0,
      INVALID_COORDINATES: 0,
      SIGNAL_LOSS_SPIKE: 1
    },
    signalStabilityScore: 99.0,
    latencyAvgMs: 27
  },
  {
    deviceId: 'dev-004',
    period: 'Last 24 Hours',
    totalPackets: 5760,
    validPackets: 5420,
    anomaliesDetected: 340,
    qualityScore: 84.1,
    qualityGrade: 'GOOD',
    anomaliesBreakdown: {
      IMPOSSIBLE_SPEED: 12,
      IMPOSSIBLE_DISTANCE: 24,
      GPS_JUMP: 180,
      DUPLICATE_POSITION: 82,
      STALE_TIMESTAMP: 0,
      FUTURE_TIMESTAMP: 0,
      INVALID_COORDINATES: 0,
      SIGNAL_LOSS_SPIKE: 42
    },
    signalStabilityScore: 81.2,
    latencyAvgMs: 44
  }
];

export const MOCK_COMMAND_QUEUE: CommandQueueItem[] = [
  {
    command: {
      id: 'cmd-001',
      type: 'REQUEST_LOCATION',
      deviceId: 'dev-001',
      deviceImei: '867492041234561',
      parameters: { intervalSec: 10 },
      tenantId: 'tenant-1',
      companyId: 'comp-1',
      requestedBy: {
        userId: 'usr-admin-1',
        userName: 'Admin Operasional',
        role: 'SUPER_ADMIN'
      },
      createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
    },
    result: {
      commandId: 'cmd-001',
      deviceId: 'dev-001',
      status: 'SUCCESS',
      sentAt: new Date(Date.now() - 3 * 60 * 1000 + 500).toISOString(),
      acknowledgedAt: new Date(Date.now() - 3 * 60 * 1000 + 1200).toISOString(),
      completedAt: new Date(Date.now() - 3 * 60 * 1000 + 1800).toISOString(),
      responsePayload: 'ACK_LOCATION_OK: lat=-6.2297, lng=106.9275, speed=68kmh',
      retryCount: 0,
      maxRetries: 3
    },
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        action: 'COMMAND_QUEUED',
        actor: 'Admin Operasional',
        details: 'Command REQUEST_LOCATION submitted to TCP Gateway'
      },
      {
        timestamp: new Date(Date.now() - 3 * 60 * 1000 + 500).toISOString(),
        action: 'COMMAND_SENT',
        actor: 'System TCP Adapter',
        details: 'Packet sent to Teltonika FMB920 (867492041234561)'
      },
      {
        timestamp: new Date(Date.now() - 3 * 60 * 1000 + 1800).toISOString(),
        action: 'COMMAND_COMPLETED',
        actor: 'System Adapter',
        details: 'Device acknowledged position update'
      }
    ]
  },
  {
    command: {
      id: 'cmd-002',
      type: 'LOCK_ENGINE',
      deviceId: 'dev-002',
      deviceImei: '869103049182732',
      parameters: { relayIndex: 1, safetyCheck: true, speedThresholdCut: 10 },
      requiresSafetyConfirmation: true,
      tenantId: 'tenant-1',
      companyId: 'comp-1',
      requestedBy: {
        userId: 'usr-admin-1',
        userName: 'Admin Operasional',
        role: 'SUPER_ADMIN'
      },
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    result: {
      commandId: 'cmd-002',
      deviceId: 'dev-002',
      status: 'ACKNOWLEDGED',
      sentAt: new Date(Date.now() - 15 * 60 * 1000 + 400).toISOString(),
      acknowledgedAt: new Date(Date.now() - 15 * 60 * 1000 + 1500).toISOString(),
      responsePayload: 'SETDIGOUT_1_ACK: Armed, relay will trigger when vehicle speed < 10km/h',
      retryCount: 0,
      maxRetries: 3
    },
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        action: 'SAFETY_CONFIRMATION_PASSED',
        actor: 'Admin Operasional',
        details: 'Safety override confirmed with 2FA authorization token'
      },
      {
        timestamp: new Date(Date.now() - 15 * 60 * 1000 + 400).toISOString(),
        action: 'COMMAND_SENT',
        actor: 'System TCP Adapter',
        details: 'setdigout 1 sent to FMC130'
      }
    ]
  }
];
