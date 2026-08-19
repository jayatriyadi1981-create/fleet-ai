/**
 * Fleet Intelligence Smart AI - Telemetry Ingestion Gateway & Processing Pipeline
 * Handles Deduplication, Out-of-Order protection, Location Precision Validation,
 * Snapshot Driver Attribution, Historical Telemetry Storage, Event Generation, and Event Bus Dispatch.
 */

import {
  RawGpsMessage,
  NormalizedTelemetry,
  GpsTelemetry,
  VehicleLocation,
  GpsIngestRequest,
  GpsIngestResponse,
  GpsEvent,
  TelemetryQuality
} from '../types/gpsArchitecture';
import { LocationPrecisionValidator } from '../engines/location/LocationPrecisionValidator';
import { LocationStatusEngine } from '../engines/location/LocationStatusEngine';
import { GpsEventEngine } from '../engines/event/GpsEventEngine';
import { GpsEventBus } from './GpsEventBus';
import { GT06Parser } from '../parsers/GT06Parser';
import { TeltonikaCodec8Parser } from '../parsers/TeltonikaCodec8Parser';
import { IStartekParser } from '../parsers/IStartekParser';
import { GenericJsonParser } from '../parsers/GenericJsonParser';

class GpsIngestionGateway {
  // In-memory store for recent telemetry hashes to enforce deduplication
  private processedHashes: Set<string> = new Set();
  // In-memory store for latest vehicle locations
  private latestLocations: Map<string, VehicleLocation> = new Map();
  // In-memory raw log store
  private rawMessagesStore: RawGpsMessage[] = [];
  // In-memory immutable historical telemetry store
  private telemetryHistoryStore: GpsTelemetry[] = [];
  // In-memory events store
  private eventsStore: GpsEvent[] = [];

  constructor() {
    this.seedMockInitialData();
  }

  /**
   * Primary Telemetry Ingestion API Entry Point
   */
  public async ingestTelemetry(request: GpsIngestRequest): Promise<GpsIngestResponse> {
    const receivedAt = new Date().toISOString();
    const rawMsgId = `raw-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 1. Log Raw Message
    const rawMsg: RawGpsMessage = {
      id: rawMsgId,
      tenantId: 'tenant-1',
      deviceId: request.deviceId,
      receivedAt,
      protocol: request.protocol || 'Generic_HTTP',
      messageType: 'LOCATION_UPDATE',
      payload: request.rawData || request,
      sequenceNumber: request.sequenceNumber,
      processingStatus: 'RECEIVED',
    };
    this.rawMessagesStore.unshift(rawMsg);

    // 2. Deduplication Check (deviceId + sequenceNumber + timestamp)
    const dedupKey = `${request.deviceId}:${request.sequenceNumber || ''}:${request.timestamp}`;
    if (this.processedHashes.has(dedupKey)) {
      rawMsg.processingStatus = 'DUPLICATE';
      return {
        success: true,
        accepted: false,
        processingStatus: 'DUPLICATE',
        reason: 'Duplicate sequence packet ignored',
      };
    }
    this.processedHashes.add(dedupKey);

    // Keep dedup cache size bounded
    if (this.processedHashes.size > 5000) {
      const arr = Array.from(this.processedHashes);
      this.processedHashes = new Set(arr.slice(2500));
    }

    // 3. Parse & Normalize
    let normalized: NormalizedTelemetry;
    if (request.protocol === 'GT06') {
      normalized = GT06Parser.parse(rawMsg);
    } else if (request.protocol === 'Teltonika') {
      normalized = TeltonikaCodec8Parser.parse(rawMsg);
    } else if (request.protocol === 'iStartek' || request.protocol === 'ISTARTEK') {
      normalized = IStartekParser.parse(rawMsg);
    } else {
      normalized = GenericJsonParser.parse(rawMsg);
    }

    // 4. Validate Location Precision & Coordinates
    const isValidCoord = LocationPrecisionValidator.isValidCoordinate(
      normalized.latitude,
      normalized.longitude
    );

    if (!isValidCoord) {
      rawMsg.processingStatus = 'INVALID_LOCATION';
      rawMsg.error = 'Coordinates out of valid bounds [-90..90, -180..180] or zero-island glitch';
      return {
        success: false,
        accepted: false,
        processingStatus: 'INVALID_LOCATION',
        reason: 'Invalid GPS coordinates',
      };
    }

    const quality: TelemetryQuality = LocationPrecisionValidator.evaluateQuality(normalized);

    // 5. Driver Snapshot Attribution (Look up current active assignment at timestamp)
    const attributedDriverId = normalized.driverId || this.lookupDriverSnapshot(normalized.deviceId, normalized.timestamp);
    const vehicleId = normalized.vehicleId || this.lookupVehicleForDevice(normalized.deviceId);

    // 6. Create Immutable Historical Telemetry Record
    const telemetryId = `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const telemetryRecord: GpsTelemetry = {
      id: telemetryId,
      tenantId: 'tenant-1',
      deviceId: normalized.deviceId,
      vehicleId,
      driverId: attributedDriverId,
      timestamp: normalized.timestamp,
      receivedAt,
      processedAt: new Date().toISOString(),
      latitude: normalized.latitude,
      longitude: normalized.longitude,
      altitude: normalized.altitude || 10,
      speed: normalized.speed,
      heading: normalized.heading,
      accuracy: normalized.accuracy,
      satelliteCount: normalized.satellites,
      ignition: normalized.ignition,
      batteryVoltage: normalized.batteryVoltage,
      externalVoltage: normalized.externalVoltage,
      odometer: normalized.odometerKm || 0,
      engineHours: normalized.engineHours,
      fuelLevel: normalized.fuelLevelPercent,
      gsmSignal: 85,
      gpsSignal: normalized.satellites >= 10 ? 'Excellent' : 'Good',
      source: 'IngestionGateway',
      protocol: rawMsg.protocol,
      sequenceNumber: normalized.sequenceNumber,
      rawDataReference: rawMsgId,
      quality,
      sensorData: normalized.sensorData,
      createdAt: new Date().toISOString(),
    };

    // Store historical telemetry without overwriting previous records!
    this.telemetryHistoryStore.unshift(telemetryRecord);
    rawMsg.processingStatus = 'PROCESSED';
    rawMsg.processedAt = new Date().toISOString();

    // Publish TelemetryReceived event
    GpsEventBus.publish('TelemetryReceived', telemetryRecord);

    // 7. Update Latest Location Cache with Out-of-Order Protection
    const currentLatest = this.latestLocations.get(vehicleId);
    let isNewer = true;
    if (currentLatest) {
      const currentLatestTime = new Date(currentLatest.timestamp).getTime();
      const newTime = new Date(normalized.timestamp).getTime();
      if (newTime <= currentLatestTime) {
        isNewer = false; // Out-of-order packet: keep existing location as latest
      }
    }

    if (isNewer) {
      const status = LocationStatusEngine.determineStatus(normalized);
      const updatedLocation: VehicleLocation = {
        id: `loc-${vehicleId}`,
        tenantId: 'tenant-1',
        vehicleId,
        deviceId: normalized.deviceId,
        driverId: attributedDriverId,
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        speed: normalized.speed,
        heading: normalized.heading,
        accuracy: normalized.accuracy,
        altitude: normalized.altitude,
        timestamp: normalized.timestamp,
        receivedAt,
        ignition: normalized.ignition,
        status,
        lastSeenAt: receivedAt,
        lastLocationAt: normalized.timestamp,
        sensorData: normalized.sensorData,
      };

      this.latestLocations.set(vehicleId, updatedLocation);
      GpsEventBus.publish('LocationUpdated', updatedLocation);

      // 8. Event Detection Engine & Event Bus Dispatch
      const detectedEvents = GpsEventEngine.evaluateTelemetryEvents(normalized, currentLatest);
      for (const evt of detectedEvents) {
        this.eventsStore.unshift(evt);
        GpsEventBus.publish('GpsEventCreated', evt);
      }
    }

    return {
      success: true,
      accepted: true,
      telemetryId,
      processingStatus: 'PROCESSED',
    };
  }

  // Lookups & Getters
  private lookupVehicleForDevice(deviceId: string): string {
    const map: Record<string, string> = {
      'GPS-DEV-001': 'v1',
      'GPS-DEV-002': 'v2',
      'GPS-DEV-003': 'v3',
      'GPS-DEV-004': 'v4',
      'GPS-DEV-005': 'v5',
    };
    return map[deviceId] || 'v1';
  }

  private lookupDriverSnapshot(deviceId: string, timestamp: string): string | undefined {
    const map: Record<string, string> = {
      'v1': 'drv-1', // Budi Santoso
      'v2': 'drv-2', // Ahmad Hidayat
      'v3': 'drv-3', // Bambang Wijaya
      'v4': 'drv-4', // Dedi Kurniawan
    };
    const vehId = this.lookupVehicleForDevice(deviceId);
    return map[vehId];
  }

  public getRawMessages(): RawGpsMessage[] {
    return this.rawMessagesStore;
  }

  public getTelemetryHistory(limit: number = 100): GpsTelemetry[] {
    return this.telemetryHistoryStore.slice(0, limit);
  }

  public getLatestLocations(): VehicleLocation[] {
    return Array.from(this.latestLocations.values());
  }

  public getEvents(limit: number = 50): GpsEvent[] {
    return this.eventsStore.slice(0, limit);
  }

  private seedMockInitialData() {
    // Seed initial locations for demo
    const mockInitial: VehicleLocation[] = [
      {
        id: 'loc-v1',
        tenantId: 'tenant-1',
        vehicleId: 'v1',
        deviceId: 'GPS-DEV-001',
        driverId: 'drv-1',
        latitude: -6.2088,
        longitude: 106.8456,
        speed: 48,
        heading: 140,
        accuracy: 2.1,
        altitude: 12,
        timestamp: new Date().toISOString(),
        receivedAt: new Date().toISOString(),
        ignition: true,
        status: 'Moving',
        lastSeenAt: new Date().toISOString(),
        lastLocationAt: new Date().toISOString(),
      },
      {
        id: 'loc-v2',
        tenantId: 'tenant-1',
        vehicleId: 'v2',
        deviceId: 'GPS-DEV-002',
        driverId: 'drv-2',
        latitude: -6.1754,
        longitude: 106.8272,
        speed: 0,
        heading: 90,
        accuracy: 1.8,
        altitude: 10,
        timestamp: new Date().toISOString(),
        receivedAt: new Date().toISOString(),
        ignition: false,
        status: 'Stopped',
        lastSeenAt: new Date().toISOString(),
        lastLocationAt: new Date().toISOString(),
      },
      {
        id: 'loc-v3',
        tenantId: 'tenant-1',
        vehicleId: 'v3',
        deviceId: 'GPS-DEV-003',
        driverId: 'drv-3',
        latitude: -6.2297,
        longitude: 106.8074,
        speed: 0,
        heading: 210,
        accuracy: 3.5,
        altitude: 15,
        timestamp: new Date().toISOString(),
        receivedAt: new Date().toISOString(),
        ignition: true,
        status: 'Idle',
        lastSeenAt: new Date().toISOString(),
        lastLocationAt: new Date().toISOString(),
      },
    ];

    mockInitial.forEach((l) => this.latestLocations.set(l.vehicleId, l));
  }
}

export const gpsIngestionService = new GpsIngestionGateway();
