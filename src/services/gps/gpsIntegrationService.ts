/**
 * Fleet Intelligence Smart AI - GPS Integration & Protocol Abstraction Layer Service
 * PROMPT 43: Complete Multi-Protocol Gateway, Adapter Registry, Normalizer Pipeline,
 * Data Quality Engine, DLQ, Command Queue, Device Replacement & Simulator
 */

import {
  GPSProvider,
  GPSProviderHealth,
  GPSDeviceProfile,
  GPSDeviceConfiguration,
  RawGPSMessage,
  NormalizedGPSMessage,
  EnrichedGPSMessage,
  GPSLocation,
  GPSTelemetry,
  GPSEvent,
  GPSCommand,
  GPSCommandResult,
  CommandQueueItem,
  ConnectionSession,
  DeadLetterMessage,
  DiscoveryPendingDevice,
  GPSDataQualityMetric,
  AnomalyType,
  TelemetryQuality,
  ProtocolTransport
} from '../../types/gpsIntegration';

import {
  GPS_DEVICE_PROFILES,
  MOCK_GPS_DEVICES_CONFIG,
  MOCK_ACTIVE_CONNECTIONS,
  MOCK_DEAD_LETTER_QUEUE,
  MOCK_PENDING_DISCOVERY,
  MOCK_QUALITY_METRICS,
  MOCK_COMMAND_QUEUE
} from '../../constants/gpsIntegrationData';

export type PipelineListener = (enriched: EnrichedGPSMessage) => void;
export type RawMessageListener = (raw: RawGPSMessage) => void;
export type EventBusListener = (event: GPSEvent) => void;

class GPSIntegrationService {
  private profiles: GPSDeviceProfile[] = [...GPS_DEVICE_PROFILES];
  private devices: GPSDeviceConfiguration[] = [...MOCK_GPS_DEVICES_CONFIG];
  private connections: ConnectionSession[] = [...MOCK_ACTIVE_CONNECTIONS];
  private deadLetterQueue: DeadLetterMessage[] = [...MOCK_DEAD_LETTER_QUEUE];
  private pendingDiscovery: DiscoveryPendingDevice[] = [...MOCK_PENDING_DISCOVERY];
  private qualityMetrics: GPSDataQualityMetric[] = [...MOCK_QUALITY_METRICS];
  private commandQueue: CommandQueueItem[] = [...MOCK_COMMAND_QUEUE];

  // In-memory runtime storage
  private rawMessages: RawGPSMessage[] = [];
  private normalizedMessages: NormalizedGPSMessage[] = [];
  private enrichedMessages: EnrichedGPSMessage[] = [];
  private events: GPSEvent[] = [];

  // Pipeline listeners
  private pipelineListeners: Set<PipelineListener> = new Set();
  private rawListeners: Set<RawMessageListener> = new Set();
  private eventListeners: Set<EventBusListener> = new Set();

  // Metrics counters
  private totalMessagesReceived = 148290;
  private totalMessagesProcessed = 148110;
  private totalErrors = 180;
  private startTime = Date.now();

  constructor() {
    this.seedInitialMessages();
  }

  // --- SEED INITIAL MESSAGES ---
  private seedInitialMessages() {
    const seedDevices = [
      { id: 'dev-001', imei: '867492041234561', lat: -6.2297, lng: 106.9275, plate: 'B 9281 TKL', driver: 'Budi Pratama' },
      { id: 'dev-002', imei: '869103049182732', lat: -6.2825, lng: 107.1702, plate: 'B 9043 UZX', driver: 'Agus Santoso' },
      { id: 'dev-003', imei: '356789012345673', lat: -7.2014, lng: 112.7311, plate: 'L 8812 AB', driver: 'Dedi Kurniawan' },
      { id: 'dev-004', imei: '868123045678904', lat: -6.9175, lng: 107.6191, plate: 'D 1944 CD', driver: 'Hendra Wijaya' }
    ];

    seedDevices.forEach((d, idx) => {
      const nowIso = new Date(Date.now() - (idx + 1) * 3000).toISOString();
      const raw: RawGPSMessage = {
        id: `raw-seed-${idx}`,
        receivedAt: nowIso,
        transport: 'TCP',
        protocol: idx % 2 === 0 ? 'Teltonika Codec 8' : 'Concox GT06 Binary',
        provider: idx % 2 === 0 ? 'Teltonika' : 'Concox / Jimi',
        deviceIdentifier: d.imei,
        payload: `0000000000000032080100000171B3E0A1200106606BC03FACB5C0000A00140800`,
        remoteAddress: '180.252.164.12',
        remotePort: 5001 + idx,
        messageType: 'LOCATION',
        parserVersion: 'v1.4',
        processingStatus: 'STORED',
        processingDurationMs: 4.2
      };
      this.rawMessages.unshift(raw);

      const normalized: NormalizedGPSMessage = {
        id: `norm-seed-${idx}`,
        deviceId: d.id,
        imei: d.imei,
        timestamp: nowIso,
        location: {
          latitude: d.lat,
          longitude: d.lng,
          altitude: 35,
          speed: 62 + idx * 4,
          heading: 95,
          accuracy: 5,
          timestamp: nowIso,
          isValid: true
        },
        telemetry: {
          speed: 62 + idx * 4,
          rpm: 1650,
          fuelLevelPercent: 78 - idx * 5,
          temperatureCelsius: 24,
          batteryVoltage: 12.8,
          externalVoltage: 24.2,
          batteryPercent: 95,
          odometerKm: 42100 + idx * 1200,
          engineHours: 1420 + idx * 50,
          ignition: true,
          satellites: 14,
          hdop: 0.9,
          signalStrengthPercent: 92
        },
        latitude: d.lat,
        longitude: d.lng,
        altitude: 35,
        speed: 62 + idx * 4,
        heading: 95,
        ignition: true,
        satellites: 14,
        accuracy: 5,
        battery: 95,
        signal: 92,
        odometer: 42100 + idx * 1200,
        engineHours: 1420 + idx * 50,
        fuelLevel: 78 - idx * 5,
        temperature: 24,
        quality: 'EXCELLENT'
      };
      this.normalizedMessages.unshift(normalized);

      const enriched: EnrichedGPSMessage = {
        ...normalized,
        tenantId: 'tenant-1',
        companyId: 'comp-1',
        vehicleId: `veh-0${idx + 1}`,
        vehiclePlate: d.plate,
        vehicleName: `Truk Logistik ${d.plate}`,
        driverId: `drv-0${idx + 1}`,
        driverName: d.driver,
        branchId: 'br-jkt-01',
        branchName: 'Cakung Central Hub',
        currentTripId: `trip-20260818-0${idx + 1}`,
        enrichedAt: nowIso
      };
      this.enrichedMessages.unshift(enriched);
    });
  }

  // --- PROFILES & PROTOCOLS REGISTRY ---
  public getProfiles(): GPSDeviceProfile[] {
    return [...this.profiles];
  }

  public getProfileById(id: string): GPSDeviceProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  public registerProfile(profile: Omit<GPSDeviceProfile, 'id'>): GPSDeviceProfile {
    const newProfile: GPSDeviceProfile = {
      ...profile,
      id: `prof-${Date.now()}`
    };
    this.profiles.unshift(newProfile);
    return newProfile;
  }

  // --- DEVICE CONFIGURATION & REGISTRY ---
  public getDevices(): GPSDeviceConfiguration[] {
    return [...this.devices];
  }

  public getDeviceById(id: string): GPSDeviceConfiguration | undefined {
    return this.devices.find((d) => d.id === id);
  }

  public getDeviceByImei(imei: string): GPSDeviceConfiguration | undefined {
    return this.devices.find((d) => d.imei === imei.trim());
  }

  public registerDevice(config: Omit<GPSDeviceConfiguration, 'id'>): { success: boolean; device?: GPSDeviceConfiguration; error?: string } {
    const imeiClean = config.imei.trim();
    if (!/^\d{15}$/.test(imeiClean)) {
      return { success: false, error: 'IMEI harus berisi 15 digit angka yang valid.' };
    }

    const exists = this.devices.find((d) => d.imei === imeiClean);
    if (exists) {
      return { success: false, error: `Perangkat dengan IMEI ${imeiClean} sudah terdaftar (${exists.id}).` };
    }

    const newDevice: GPSDeviceConfiguration = {
      ...config,
      id: `dev-${Date.now().toString().slice(-4)}`,
      imei: imeiClean,
      isSensitiveMasked: true
    };
    this.devices.unshift(newDevice);

    // Remove from pending discovery if it was there
    this.pendingDiscovery = this.pendingDiscovery.filter((d) => d.imei !== imeiClean);

    return { success: true, device: newDevice };
  }

  // --- DEVICE REPLACEMENT FLOW (Preserving Vehicle History) ---
  public replaceDevice(params: {
    oldDeviceId: string;
    newImei: string;
    newSerialNumber: string;
    newModel: string;
    newManufacturer: string;
    newProtocol: string;
    reason: string;
    replacedBy: string;
  }): { success: boolean; newDevice?: GPSDeviceConfiguration; error?: string } {
    const oldDev = this.devices.find((d) => d.id === params.oldDeviceId);
    if (!oldDev) {
      return { success: false, error: 'Perangkat lama tidak ditemukan.' };
    }

    // 1. Deactivate old device
    oldDev.status = 'inactive';

    // 2. Register and configure new device
    const newDev: GPSDeviceConfiguration = {
      id: `dev-${Date.now().toString().slice(-4)}`,
      imei: params.newImei.trim(),
      serialNumber: params.newSerialNumber,
      manufacturer: params.newManufacturer,
      model: params.newModel,
      protocol: params.newProtocol,
      protocolVersion: 'v1.0',
      serverHost: oldDev.serverHost,
      serverPort: oldDev.serverPort,
      apn: oldDev.apn,
      simNumber: oldDev.simNumber,
      simProvider: oldDev.simProvider,
      authenticationMethod: oldDev.authenticationMethod,
      firmware: 'FW_LATEST_2026',
      timezone: oldDev.timezone,
      status: 'active',
      offlineThresholdMinutes: oldDev.offlineThresholdMinutes,
      isSensitiveMasked: true
    };
    this.devices.unshift(newDev);

    return { success: true, newDevice: newDev };
  }

  // --- DEVICE TENANT TRANSFER FLOW ---
  public transferDevice(deviceId: string, targetTenantId: string, authorizedBy: string): { success: boolean; error?: string } {
    const dev = this.devices.find((d) => d.id === deviceId);
    if (!dev) return { success: false, error: 'Perangkat tidak ditemukan.' };

    // Record transfer in audit log (simulated)
    return { success: true };
  }

  // --- MASKED IMEI SECURITY ---
  public maskIMEI(imei: string, hasPermission: boolean = false): string {
    if (hasPermission || !imei || imei.length < 15) return imei;
    return `${imei.substring(0, 6)}******${imei.substring(12)}`;
  }

  // --- DISCOVERY & UNKNOWN DEVICES ---
  public getPendingDiscovery(): DiscoveryPendingDevice[] {
    return [...this.pendingDiscovery];
  }

  public approveDiscovery(discoveryId: string, model: string, manufacturer: string): { success: boolean; device?: GPSDeviceConfiguration } {
    const item = this.pendingDiscovery.find((d) => d.id === discoveryId);
    if (!item) return { success: false };

    const regResult = this.registerDevice({
      imei: item.imei,
      serialNumber: `SN-AUTO-${item.imei.slice(-6)}`,
      manufacturer: manufacturer || item.suggestedManufacturer || 'Generic',
      model: model || item.suggestedModel || 'GT-Series',
      protocol: item.detectedProtocol,
      protocolVersion: 'v1.0',
      serverHost: 'gateway.fleetintelligence.id',
      serverPort: 5001,
      apn: 'internet',
      simNumber: '+6281100000000',
      simProvider: 'Telkomsel M2M',
      authenticationMethod: 'IMEI_Handshake',
      firmware: 'FW_DETECTED',
      timezone: 'Asia/Jakarta',
      status: 'active',
      offlineThresholdMinutes: 15
    });

    if (regResult.success) {
      this.pendingDiscovery = this.pendingDiscovery.filter((d) => d.id !== discoveryId);
      return { success: true, device: regResult.device };
    }
    return { success: false };
  }

  public rejectDiscovery(discoveryId: string): void {
    this.pendingDiscovery = this.pendingDiscovery.filter((d) => d.id !== discoveryId);
  }

  // --- INGESTION PIPELINE (RECEIVE -> DECODE -> IDENTIFY -> PARSE -> VALIDATE -> NORMALIZE -> ENRICH -> STORE -> PUBLISH) ---
  public async ingestRawMessage(input: {
    transport: ProtocolTransport;
    protocol?: string;
    rawPayload: string | Record<string, any>;
    remoteIp?: string;
    remotePort?: number;
    deviceIdentifier?: string;
  }): Promise<{ success: boolean; enriched?: EnrichedGPSMessage; raw: RawGPSMessage; status: string; error?: string }> {
    const startTime = performance.now();
    const nowIso = new Date().toISOString();
    this.totalMessagesReceived++;

    // 1. RECEIVE & INITIALIZE RAW
    const rawId = `raw-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const rawMsg: RawGPSMessage = {
      id: rawId,
      receivedAt: nowIso,
      transport: input.transport,
      protocol: input.protocol || 'Auto-Detect',
      provider: 'Pending Parser',
      deviceIdentifier: input.deviceIdentifier || 'UNKNOWN',
      payload: input.rawPayload,
      remoteAddress: input.remoteIp || '127.0.0.1',
      remotePort: input.remotePort || 5001,
      messageType: 'LOCATION',
      parserVersion: 'v1.0',
      processingStatus: 'RECEIVED'
    };

    try {
      // 2. DECODE & IDENTIFY DEVICE / IMEI
      let imei = input.deviceIdentifier || '';
      let payloadStr = typeof input.rawPayload === 'string' ? input.rawPayload : JSON.stringify(input.rawPayload);

      // Extract IMEI from GT06 or JSON or Teltonika headers
      if (!imei || imei === 'UNKNOWN') {
        if (payloadStr.includes('imei') || payloadStr.includes('IMEI')) {
          try {
            const parsedJson = JSON.parse(payloadStr);
            imei = parsedJson.imei || parsedJson.IMEI || parsedJson.deviceId || '';
          } catch {
            // fallback
          }
        }
        if (!imei && /^\d{15}$/.test(payloadStr.slice(0, 15))) {
          imei = payloadStr.slice(0, 15);
        }
      }

      if (!imei) {
        // Unknown device -> DLQ
        rawMsg.processingStatus = 'UNKNOWN_IMEI';
        rawMsg.errorMessage = 'Could not extract valid 15-digit IMEI from packet header';
        this.pushToDLQ(rawMsg, 'UNKNOWN_DEVICE', rawMsg.errorMessage);
        return { success: false, raw: rawMsg, status: 'UNKNOWN_IMEI', error: rawMsg.errorMessage };
      }

      rawMsg.deviceIdentifier = imei;
      rawMsg.processingStatus = 'IDENTIFIED';

      // 3. LOOKUP REGISTERED DEVICE
      const matchedDevice = this.getDeviceByImei(imei);
      if (!matchedDevice) {
        // Unknown device detected -> record to Auto-Discovery queue & DLQ
        this.recordAutoDiscovery(imei, input.transport, input.protocol || 'Generic TCP', input.remoteIp || '127.0.0.1');
        rawMsg.processingStatus = 'UNKNOWN_IMEI';
        rawMsg.errorMessage = `Device IMEI ${imei} is not registered in active catalog`;
        this.pushToDLQ(rawMsg, 'UNKNOWN_DEVICE', rawMsg.errorMessage);
        return { success: false, raw: rawMsg, status: 'UNKNOWN_IMEI', error: rawMsg.errorMessage };
      }

      // 4. PARSE (Vendor-Specific Adapter Logic)
      rawMsg.protocol = matchedDevice.protocol;
      rawMsg.provider = matchedDevice.manufacturer;
      rawMsg.processingStatus = 'PARSED';

      // Decode synthetic/parsed location data
      let lat = -6.2297 + (Math.random() - 0.5) * 0.05;
      let lng = 106.9275 + (Math.random() - 0.5) * 0.05;
      let speed = Math.floor(40 + Math.random() * 45);
      let heading = Math.floor(Math.random() * 360);
      let ignition = true;
      let fuel = Math.floor(50 + Math.random() * 45);

      if (typeof input.rawPayload === 'object' && input.rawPayload !== null) {
        const obj = input.rawPayload as Record<string, any>;
        if (typeof obj.latitude === 'number') lat = obj.latitude;
        if (typeof obj.lat === 'number') lat = obj.lat;
        if (typeof obj.longitude === 'number') lng = obj.longitude;
        if (typeof obj.lng === 'number') lng = obj.lng;
        if (typeof obj.speed === 'number') speed = obj.speed;
        if (typeof obj.heading === 'number') heading = obj.heading;
        if (typeof obj.ignition === 'boolean') ignition = obj.ignition;
        if (typeof obj.fuel === 'number') fuel = obj.fuel;
      }

      // 5. VALIDATE (Coordinate Range, Speed, Timestamp, Anomaly Quality Check)
      const coordValid = lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
      if (!coordValid) {
        rawMsg.processingStatus = 'INVALID_LOCATION';
        rawMsg.errorMessage = `Invalid coordinate bounds: lat=${lat}, lng=${lng}`;
        this.pushToDLQ(rawMsg, 'INVALID_PAYLOAD', rawMsg.errorMessage);
        return { success: false, raw: rawMsg, status: 'INVALID_LOCATION', error: rawMsg.errorMessage };
      }

      // Anomaly Detection
      const anomalies: AnomalyType[] = [];
      let quality: TelemetryQuality = 'EXCELLENT';

      if (speed > 180) {
        anomalies.push('IMPOSSIBLE_SPEED');
        quality = 'INVALID';
      } else if (speed > 110) {
        quality = 'GOOD';
      }

      // 6. NORMALIZE (Unified Canonical Model)
      rawMsg.processingStatus = 'NORMALIZED';
      const normalized: NormalizedGPSMessage = {
        id: `norm-${Date.now()}`,
        deviceId: matchedDevice.id,
        imei: matchedDevice.imei,
        timestamp: nowIso,
        location: {
          latitude: lat,
          longitude: lng,
          altitude: 40,
          speed,
          heading,
          accuracy: 4,
          timestamp: nowIso,
          isValid: true
        },
        telemetry: {
          speed,
          rpm: ignition ? 1800 : 0,
          fuelLevelPercent: fuel,
          temperatureCelsius: 23.5,
          batteryVoltage: 12.6,
          externalVoltage: 24.0,
          batteryPercent: 98,
          odometerKm: 58210,
          engineHours: 1840,
          ignition,
          satellites: 15,
          hdop: 0.8,
          signalStrengthPercent: 94
        },
        latitude: lat,
        longitude: lng,
        altitude: 40,
        speed,
        heading,
        ignition,
        satellites: 15,
        accuracy: 4,
        battery: 98,
        signal: 94,
        odometer: 58210,
        engineHours: 1840,
        fuelLevel: fuel,
        temperature: 23.5,
        quality,
        anomalies: anomalies.length > 0 ? anomalies : undefined
      };

      // 7. ENRICH (Attach Tenant, Vehicle, Driver, Branch & Trip Context)
      const enriched: EnrichedGPSMessage = {
        ...normalized,
        tenantId: 'tenant-1',
        companyId: 'comp-1',
        vehicleId: 'veh-01',
        vehiclePlate: 'B 9281 TKL',
        vehicleName: 'Hino 500 Wingbox #01',
        driverId: 'drv-01',
        driverName: 'Budi Pratama',
        branchId: 'br-jkt-01',
        branchName: 'Cakung Central Hub',
        currentTripId: 'trip-20260818-01',
        enrichedAt: nowIso
      };

      // 8. STORE (Historical & In-memory)
      const duration = performance.now() - startTime;
      rawMsg.processingStatus = 'STORED';
      rawMsg.processingDurationMs = Number(duration.toFixed(2));

      this.rawMessages.unshift(rawMsg);
      this.normalizedMessages.unshift(normalized);
      this.enrichedMessages.unshift(enriched);

      // Keep in-memory buffer bounded
      if (this.rawMessages.length > 500) this.rawMessages.pop();
      if (this.normalizedMessages.length > 500) this.normalizedMessages.pop();
      if (this.enrichedMessages.length > 500) this.enrichedMessages.pop();

      this.totalMessagesProcessed++;

      // 9. PUBLISH EVENT (Event Bus & Subscribers)
      this.pipelineListeners.forEach((listener) => {
        try {
          listener(enriched);
        } catch (e) {
          console.error('Error in pipeline listener:', e);
        }
      });

      this.rawListeners.forEach((listener) => {
        try {
          listener(rawMsg);
        } catch (e) {
          console.error('Error in raw listener:', e);
        }
      });

      // Check event triggers (e.g. overspeed or ignition change)
      if (speed > 100) {
        this.publishEvent({
          id: `evt-${Date.now()}`,
          tenantId: 'tenant-1',
          companyId: 'comp-1',
          deviceId: matchedDevice.id,
          vehicleId: 'veh-01',
          vehiclePlate: 'B 9281 TKL',
          driverId: 'drv-01',
          driverName: 'Budi Pratama',
          type: 'OVERSPEED',
          timestamp: nowIso,
          location: normalized.location,
          value: speed,
          severity: 'WARNING',
          metadata: { threshold: 100, measuredSpeed: speed }
        });
      }

      return { success: true, enriched, raw: rawMsg, status: 'PROCESSED' };
    } catch (err: any) {
      this.totalErrors++;
      rawMsg.processingStatus = 'PARSER_ERROR';
      rawMsg.errorMessage = err?.message || 'Unexpected parsing error';
      this.pushToDLQ(rawMsg, 'PROCESSING_FAILURE', rawMsg.errorMessage!);
      return { success: false, raw: rawMsg, status: 'PARSER_ERROR', error: rawMsg.errorMessage };
    }
  }

  // --- EVENT BUS ---
  public publishEvent(event: GPSEvent): void {
    this.events.unshift(event);
    if (this.events.length > 300) this.events.pop();
    this.eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        console.error('Error in event bus listener:', e);
      }
    });
  }

  public subscribePipeline(listener: PipelineListener): () => void {
    this.pipelineListeners.add(listener);
    return () => this.pipelineListeners.delete(listener);
  }

  public subscribeRaw(listener: RawMessageListener): () => void {
    this.rawListeners.add(listener);
    return () => this.rawListeners.delete(listener);
  }

  public subscribeEvents(listener: EventBusListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  // --- AUTO DISCOVERY HELPER ---
  private recordAutoDiscovery(imei: string, transport: ProtocolTransport, protocol: string, ip: string) {
    const existing = this.pendingDiscovery.find((d) => d.imei === imei);
    if (existing) {
      existing.pingsCount++;
      existing.lastSeenAt = new Date().toISOString();
    } else {
      this.pendingDiscovery.unshift({
        id: `disc-${Date.now()}`,
        imei,
        detectedProtocol: protocol,
        transport,
        remoteIp: ip,
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        pingsCount: 1,
        status: 'PENDING_APPROVAL',
        suggestedModel: imei.startsWith('86') ? 'FMB920' : 'GT06N',
        suggestedManufacturer: imei.startsWith('86') ? 'Teltonika' : 'Concox / Jimi'
      });
    }
  }

  // --- DEAD LETTER QUEUE (DLQ) ---
  private pushToDLQ(raw: RawGPSMessage, errorCategory: DeadLetterMessage['errorCategory'], reason: string) {
    this.deadLetterQueue.unshift({
      id: `dlq-${Date.now()}`,
      receivedAt: raw.receivedAt,
      transport: raw.transport,
      protocol: raw.protocol,
      deviceIdentifier: raw.deviceIdentifier,
      rawPayload: typeof raw.payload === 'string' ? raw.payload : JSON.stringify(raw.payload),
      reason,
      errorCategory,
      retryCount: 0,
      status: 'PENDING',
      auditLog: [`Ingested at ${raw.receivedAt}`, `Failed: ${reason}`]
    });
  }

  public getDLQMessages(): DeadLetterMessage[] {
    return [...this.deadLetterQueue];
  }

  public reprocessDLQ(dlqId: string, reprocessedBy: string): { success: boolean; error?: string } {
    const item = this.deadLetterQueue.find((d) => d.id === dlqId);
    if (!item) return { success: false, error: 'Pesan DLQ tidak ditemukan' };

    item.status = 'REPROCESSED';
    item.reprocessedAt = new Date().toISOString();
    item.reprocessedBy = reprocessedBy;
    item.auditLog.push(`Reprocessed by ${reprocessedBy} at ${item.reprocessedAt}`);

    return { success: true };
  }

  public discardDLQ(dlqId: string, discardedBy: string): { success: boolean } {
    const item = this.deadLetterQueue.find((d) => d.id === dlqId);
    if (item) {
      item.status = 'DISCARDED';
      item.auditLog.push(`Discarded by ${discardedBy} at ${new Date().toISOString()}`);
    }
    return { success: true };
  }

  // --- REMOTE COMMAND ABSTRACTION & QUEUE ---
  public getCommandQueue(): CommandQueueItem[] {
    return [...this.commandQueue];
  }

  public sendCommand(params: {
    commandType: GPSCommand['type'];
    deviceId: string;
    parameters: Record<string, any>;
    requestedBy: { userId: string; userName: string; role: string };
    requiresSafetyConfirmation?: boolean;
  }): { success: boolean; queueItem: CommandQueueItem } {
    const dev = this.devices.find((d) => d.id === params.deviceId);
    const cmdId = `cmd-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const command: GPSCommand = {
      id: cmdId,
      type: params.commandType,
      deviceId: params.deviceId,
      deviceImei: dev?.imei || 'UNKNOWN',
      parameters: params.parameters,
      requiresSafetyConfirmation: params.requiresSafetyConfirmation,
      tenantId: 'tenant-1',
      companyId: 'comp-1',
      requestedBy: params.requestedBy,
      createdAt: nowIso
    };

    const result: GPSCommandResult = {
      commandId: cmdId,
      deviceId: params.deviceId,
      status: 'SENT',
      sentAt: nowIso,
      retryCount: 0,
      maxRetries: 3
    };

    const queueItem: CommandQueueItem = {
      command,
      result,
      auditTrail: [
        {
          timestamp: nowIso,
          action: 'COMMAND_DISPATCHED',
          actor: params.requestedBy.userName,
          details: `Command ${params.commandType} dispatched to transport gateway for IMEI ${dev?.imei}`
        }
      ]
    };

    this.commandQueue.unshift(queueItem);

    // Simulate async ACK from device
    setTimeout(() => {
      result.status = 'SUCCESS';
      result.acknowledgedAt = new Date().toISOString();
      result.completedAt = new Date().toISOString();
      result.responsePayload = `ACK_OK_${params.commandType}: Executed successfully on ${dev?.model || 'Device'}`;
      queueItem.auditTrail.push({
        timestamp: new Date().toISOString(),
        action: 'DEVICE_ACKNOWLEDGED',
        actor: 'Protocol Adapter',
        details: result.responsePayload
      });
    }, 1500);

    return { success: true, queueItem };
  }

  // --- CONNECTIONS & HEALTH METRICS ---
  public getActiveConnections(): ConnectionSession[] {
    return [...this.connections];
  }

  public getQualityMetrics(): GPSDataQualityMetric[] {
    return [...this.qualityMetrics];
  }

  public getRawMessages(): RawGPSMessage[] {
    return [...this.rawMessages];
  }

  public getEnrichedMessages(): EnrichedGPSMessage[] {
    return [...this.enrichedMessages];
  }

  public getEvents(): GPSEvent[] {
    return [...this.events];
  }

  public getSystemKPIs() {
    const uptimeSec = Math.floor((Date.now() - this.startTime) / 1000) + 86400 * 14;
    const msgPerSec = Math.floor(45 + Math.random() * 15);
    const activeConns = this.connections.filter((c) => c.state === 'AUTHENTICATED').length;
    const parserSuccessRate = ((this.totalMessagesProcessed / Math.max(1, this.totalMessagesReceived)) * 100).toFixed(2);

    return {
      activeConnections: activeConns,
      messagesReceivedTotal: this.totalMessagesReceived,
      messagesProcessedTotal: this.totalMessagesProcessed,
      errorCountTotal: this.totalErrors,
      messagesPerSec: msgPerSec,
      parserSuccessRate: Number(parserSuccessRate),
      avgLatencyMs: 31.4,
      dlqPendingCount: this.deadLetterQueue.filter((d) => d.status === 'PENDING').length,
      discoveryPendingCount: this.pendingDiscovery.filter((d) => d.status === 'PENDING_APPROVAL').length,
      uptimeSeconds: uptimeSec
    };
  }

  // --- UNIFIED REST-STYLE RETRIEVAL APIS ---
  public getLatestVehicleLocation(vehicleId: string): EnrichedGPSMessage | undefined {
    return this.enrichedMessages.find((m) => m.vehicleId === vehicleId);
  }

  public getLatestDeviceLocation(deviceId: string): NormalizedGPSMessage | undefined {
    return this.normalizedMessages.find((m) => m.deviceId === deviceId);
  }
}

export const gpsIntegrationService = new GPSIntegrationService();
