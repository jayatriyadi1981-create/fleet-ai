/**
 * Fleet Intelligence Smart AI - GPS Device & Telematics API Service
 * PROMPT 10 - Enterprise Service Layer, Abstraction, IMEI Security & Gateway Foundation
 */

import {
  GPSDeviceExtended,
  SIMCard,
  GPSProtocol,
  FirmwarePackage,
  DeviceDiagnosticResult,
  DeviceEvent,
  DeviceCommand,
  NormalizedTelemetry,
  AIDeviceIntelligence,
  SIMAssignmentHistory,
  DeviceAssignmentHistory,
  CommandType
} from '../types/gps';

import {
  mockGpsDevicesExtended,
  mockSimCards,
  mockGpsProtocols,
  mockFirmwarePackages,
  mockDeviceDiagnostics,
  mockDeviceEvents,
  mockDeviceCommands,
  mockNormalizedTelemetry,
  mockAIDeviceIntelligence,
  mockSIMAssignmentHistory,
  mockDeviceAssignmentHistory
} from '../constants/mockGpsData';

class GPSDeviceService {
  private devices: GPSDeviceExtended[] = [...mockGpsDevicesExtended];
  private simCards: SIMCard[] = [...mockSimCards];
  private protocols: GPSProtocol[] = [...mockGpsProtocols];
  private firmwarePackages: FirmwarePackage[] = [...mockFirmwarePackages];
  private simHistories: SIMAssignmentHistory[] = [...mockSIMAssignmentHistory];
  private deviceHistories: DeviceAssignmentHistory[] = [...mockDeviceAssignmentHistory];
  private events: DeviceEvent[] = [...mockDeviceEvents];
  private commands: DeviceCommand[] = [...mockDeviceCommands];

  // Mask sensitive IMEI unless user has view_sensitive permission
  public maskIMEI(imei: string, hasSensitivePermission: boolean): string {
    if (hasSensitivePermission || !imei || imei.length < 15) return imei;
    return `${imei.substring(0, 6)}******${imei.substring(12)}`;
  }

  // Validate IMEI format and check uniqueness
  public validateIMEI(imei: string, excludeDeviceId?: string): { valid: boolean; error?: string } {
    const cleanImei = imei.trim();
    if (!/^\d{15}$/.test(cleanImei)) {
      return { valid: false, error: 'IMEI harus berisi tepat 15 digit angka.' };
    }

    const duplicate = this.devices.find(
      (d) => d.imei === cleanImei && d.id !== excludeDeviceId && d.status !== 'archived'
    );
    if (duplicate) {
      return { valid: false, error: 'A device with this IMEI already exists in this tenant.' };
    }

    return { valid: true };
  }

  // Device List with Multi-field Search & Filters
  public listDevices(params?: {
    search?: string;
    status?: string;
    connectionStatus?: string;
    healthStatus?: string;
    specificHealth?: string;
    protocolId?: string;
    manufacturer?: string;
    simProvider?: string;
    branchId?: string;
    hasSensitivePermission?: boolean;
  }): GPSDeviceExtended[] {
    let result = [...this.devices];

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.deviceCode.toLowerCase().includes(q) ||
          d.imei.toLowerCase().includes(q) ||
          d.serialNumber.toLowerCase().includes(q) ||
          (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(q)) ||
          (d.simNumber && d.simNumber.toLowerCase().includes(q)) ||
          (d.simProvider && d.simProvider.toLowerCase().includes(q)) ||
          (d.apn && d.apn.toLowerCase().includes(q)) ||
          d.protocolName.toLowerCase().includes(q) ||
          d.firmwareVersion.toLowerCase().includes(q) ||
          d.manufacturer.toLowerCase().includes(q) ||
          d.model.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'all') {
      result = result.filter((d) => d.status === params.status);
    }

    if (params?.connectionStatus && params.connectionStatus !== 'all') {
      result = result.filter((d) => d.connectionStatus === params.connectionStatus);
    }

    if (params?.healthStatus && params.healthStatus !== 'all') {
      result = result.filter((d) => d.healthStatus === params.healthStatus);
    }

    if (params?.specificHealth && params.specificHealth !== 'all') {
      result = result.filter((d) => d.specificHealth === params.specificHealth);
    }

    if (params?.protocolId && params.protocolId !== 'all') {
      result = result.filter((d) => d.protocolId === params.protocolId);
    }

    if (params?.manufacturer && params.manufacturer !== 'all') {
      result = result.filter((d) => d.manufacturer === params.manufacturer);
    }

    if (params?.simProvider && params.simProvider !== 'all') {
      result = result.filter((d) => d.simProvider === params.simProvider);
    }

    if (params?.branchId && params.branchId !== 'all') {
      result = result.filter((d) => d.branchId === params.branchId);
    }

    // Apply sensitive IMEI masking if requested
    if (params?.hasSensitivePermission === false) {
      result = result.map((d) => ({
        ...d,
        imei: this.maskIMEI(d.imei, false)
      }));
    }

    return result;
  }

  // Get Device By ID
  public getDevice(id: string, hasSensitivePermission: boolean = true): GPSDeviceExtended | null {
    const dev = this.devices.find((d) => d.id === id || d.deviceCode === id);
    if (!dev) return null;
    return {
      ...dev,
      imei: this.maskIMEI(dev.imei, hasSensitivePermission)
    };
  }

  // Create Device
  public createDevice(data: Omit<GPSDeviceExtended, 'id' | 'healthScore' | 'messagesToday' | 'messagesFailed' | 'createdAt' | 'updatedAt'>): GPSDeviceExtended {
    const imeiVal = this.validateIMEI(data.imei);
    if (!imeiVal.valid) {
      throw new Error(imeiVal.error);
    }

    const newId = `GPS-${String(this.devices.length + 1).padStart(3, '0')}`;
    const newCode = `GPS-${String(100100 + this.devices.length + 1)}`;

    const newDevice: GPSDeviceExtended = {
      ...data,
      id: newId,
      deviceCode: newCode,
      healthScore: 100,
      messagesToday: 0,
      messagesFailed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.devices.unshift(newDevice);

    // Record Event
    this.events.unshift({
      id: `DEV-EVT-${Date.now()}`,
      deviceId: newId,
      timestamp: new Date().toISOString(),
      type: 'assignment',
      title: 'Perangkat GPS Berhasil Didaftarkan',
      description: `Perangkat ${newCode} (${data.manufacturer} ${data.model}) dibuat dalam sistem.`,
      severity: 'info'
    });

    return newDevice;
  }

  // Update Device
  public updateDevice(id: string, data: Partial<GPSDeviceExtended>): GPSDeviceExtended {
    const index = this.devices.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('GPS Device not found.');

    if (data.imei && data.imei !== this.devices[index].imei) {
      const imeiVal = this.validateIMEI(data.imei, id);
      if (!imeiVal.valid) throw new Error(imeiVal.error);
    }

    const updated = {
      ...this.devices[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.devices[index] = updated;
    return updated;
  }

  // Archive Device
  public archiveDevice(id: string): boolean {
    const dev = this.getDevice(id);
    if (!dev) return false;
    this.updateDevice(id, { status: 'archived', inventoryStatus: 'archived' });
    return true;
  }

  // Assign / Reassign Vehicle
  public assignVehicle(deviceId: string, vehicleId: string, vehiclePlate: string, assignedBy: string, reason: string): boolean {
    const dev = this.getDevice(deviceId);
    if (!dev) return false;

    // Unassign existing vehicle if any
    if (dev.vehicleId) {
      const prevHist = this.deviceHistories.find((h) => h.deviceId === deviceId && !h.unassignedAt);
      if (prevHist) {
        prevHist.unassignedAt = new Date().toISOString();
      }
    }

    // Update device
    this.updateDevice(deviceId, {
      vehicleId,
      vehiclePlate,
      inventoryStatus: 'installed'
    });

    // Add new assignment history record
    this.deviceHistories.unshift({
      id: `DEV-HIST-${Date.now()}`,
      deviceId,
      vehicleId,
      vehiclePlate,
      assignedAt: new Date().toISOString(),
      assignedBy,
      reason
    });

    return true;
  }

  // Unassign Vehicle
  public unassignVehicle(deviceId: string, reason: string): boolean {
    const dev = this.getDevice(deviceId);
    if (!dev || !dev.vehicleId) return false;

    const hist = this.deviceHistories.find((h) => h.deviceId === deviceId && !h.unassignedAt);
    if (hist) {
      hist.unassignedAt = new Date().toISOString();
    }

    this.updateDevice(deviceId, {
      vehicleId: undefined,
      vehiclePlate: undefined,
      inventoryStatus: 'in_stock'
    });

    return true;
  }

  // SIM Cards Management
  public listSIMs(): SIMCard[] {
    return [...this.simCards];
  }

  public getSIM(id: string): SIMCard | null {
    return this.simCards.find((s) => s.id === id) || null;
  }

  public assignSIM(simId: string, deviceId: string, assignedBy: string, reason: string): boolean {
    const sim = this.getSIM(simId);
    const dev = this.getDevice(deviceId);
    if (!sim || !dev) return false;

    this.simCards = this.simCards.map((s) =>
      s.id === simId
        ? { ...s, currentDeviceId: deviceId, currentDeviceCode: dev.deviceCode, status: 'active' }
        : s
    );

    this.updateDevice(deviceId, {
      simId: sim.id,
      simNumber: sim.phoneNumber,
      simProvider: sim.provider
    });

    this.simHistories.unshift({
      id: `SIM-HIST-${Date.now()}`,
      simId,
      deviceId,
      deviceCode: dev.deviceCode,
      assignedAt: new Date().toISOString(),
      assignedBy,
      reason
    });

    return true;
  }

  // Protocol Management
  public listProtocols(): GPSProtocol[] {
    return [...this.protocols];
  }

  // Firmware Management
  public listFirmware(): FirmwarePackage[] {
    return [...this.firmwarePackages];
  }

  // Run Diagnostics Simulation
  public runDiagnostics(deviceId: string, performedBy: string): DeviceDiagnosticResult {
    const dev = this.getDevice(deviceId);
    if (!dev) {
      throw new Error('Device not found for diagnostics');
    }

    const isHealthy = dev.connectionStatus === 'online';
    const isOffline = dev.connectionStatus === 'offline';

    const checks = [
      {
        id: 'chk-imei',
        name: 'Validasi Format IMEI & Luhn',
        category: 'IMEI' as const,
        status: 'pass' as const,
        message: `IMEI ${dev.imei} terverifikasi valid (Format 15-digit OK).`
      },
      {
        id: 'chk-sim',
        name: 'Status Registrasi Kartu SIM',
        category: 'SIM' as const,
        status: dev.simNumber ? ('pass' as const) : ('warn' as const),
        message: dev.simNumber
          ? `Kartu SIM ${dev.simProvider} (${dev.simNumber}) terpasang aktif.`
          : 'Belum ada Kartu SIM teralokasi pada perangkat.'
      },
      {
        id: 'chk-net',
        name: 'Status Gateway TCP/UDP',
        category: 'Connection' as const,
        status: isHealthy ? ('pass' as const) : isOffline ? ('fail' as const) : ('warn' as const),
        message: isHealthy
          ? `Socket TCP terhubung di Port 5027. Ping latency: ${dev.connectionLatencyMs || 45}ms.`
          : 'Gagal melakukan TCP handshake dengan server gateway.'
      },
      {
        id: 'chk-gps',
        name: 'Akurasi Kunci Satelit GPS',
        category: 'GPS' as const,
        status: (dev.satellitesCount || 0) >= 8 ? ('pass' as const) : ('warn' as const),
        message: `Menerima signal dari ${dev.satellitesCount || 0} satelit GPS (Akurasi: ${dev.gpsAccuracyMeters || 10}m).`
      },
      {
        id: 'chk-pwr',
        name: 'Tegangan Sumber Daya',
        category: 'Power' as const,
        status: (dev.externalVoltage || 0) > 10 ? ('pass' as const) : ('fail' as const),
        message: `Tegangan eksternal: ${dev.externalVoltage || 0}V, Baterai cadangan: ${dev.batteryVoltage || 3.7}V (${dev.batteryPercent || 50}%).`
      }
    ];

    const overallStatus = checks.some((c) => c.status === 'fail')
      ? 'fail'
      : checks.some((c) => c.status === 'warn')
      ? 'warn'
      : 'pass';

    const findings = [
      overallStatus === 'pass'
        ? 'Perangkat dalam performa optimal.'
        : overallStatus === 'warn'
        ? 'Terdeteksi fluktuasi sinyal atau keterlambatan ping gateway.'
        : 'Sistem mengalami pemutusan sumber daya aki atau hilangnya sinyal GSM.'
    ];

    const result: DeviceDiagnosticResult = {
      id: `DIAG-${Date.now()}`,
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      timestamp: new Date().toISOString(),
      performedBy,
      overallStatus,
      checks,
      findings
    };

    return result;
  }

  // Device Commands execution with safety check confirmation
  public sendCommand(
    deviceId: string,
    commandType: CommandType,
    parameters: Record<string, any>,
    sentBy: string,
    vehiclePlateConfirmation?: string
  ): DeviceCommand {
    const dev = this.getDevice(deviceId);
    if (!dev) throw new Error('Device not found');

    // High risk commands check
    const highRiskCommands: CommandType[] = ['RESTART_DEVICE', 'LOCK_VEHICLE', 'UNLOCK_VEHICLE', 'FIRMWARE_UPDATE'];
    if (highRiskCommands.includes(commandType)) {
      if (!vehiclePlateConfirmation) {
        throw new Error('Dangerous command requires vehicle plate or code confirmation.');
      }
      const matchKey = (dev.vehiclePlate || dev.deviceCode).toUpperCase().replace(/\s+/g, '');
      const inputKey = vehiclePlateConfirmation.toUpperCase().replace(/\s+/g, '');
      if (matchKey !== inputKey) {
        throw new Error('Konfirmasi plat kendaraan / device code tidak cocok!');
      }
    }

    const newCmd: DeviceCommand = {
      id: `CMD-${Date.now()}`,
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      vehiclePlate: dev.vehiclePlate,
      commandType,
      parameters,
      status: 'acknowledged',
      sentBy,
      createdAt: new Date().toISOString(),
      acknowledgedAt: new Date(Date.now() + 1500).toISOString(),
      auditReference: `AUD-CMD-${Math.floor(10000 + Math.random() * 90000)}`,
      responsePayload: `+RESP:${commandType},STATUS=OK,ACK_TIME=${new Date().toISOString()}`
    };

    this.commands.unshift(newCmd);
    return newCmd;
  }

  // Get AI Intelligence Analysis
  public getAIIntelligence(deviceId: string): AIDeviceIntelligence {
    const dev = this.getDevice(deviceId);
    if (!dev) return mockAIDeviceIntelligence;

    const isHealthy = dev.healthScore >= 80;

    return {
      deviceId: dev.id,
      healthForecast7Days: isHealthy ? 'Low Risk' : dev.healthScore >= 50 ? 'Medium Risk' : 'High Risk',
      confidenceScore: Math.min(99, dev.healthScore + 5),
      connectionStabilityIndex: dev.connectionStatus === 'online' ? 98 : dev.connectionStatus === 'delayed' ? 65 : 20,
      findings: [
        {
          category: 'Konektivitas',
          title: dev.connectionStatus === 'online' ? 'Koneksi Gateway Sangat Stabil' : 'Koneksi Gateway Mengalami Keterlambatan',
          explanation: `Status saat ini adalah ${dev.connectionStatus.toUpperCase()} dengan ${dev.messagesFailed} pesan gagal hari ini.`,
          recommendedAction: dev.connectionStatus === 'online' ? 'Pertahankan interval pingsat.' : 'Lakukan diagnostik jaringan.',
          severity: dev.connectionStatus === 'online' ? 'info' : 'warning'
        },
        {
          category: 'Tegangan Aki',
          title: 'Sumber Daya Kendaraan',
          explanation: `Tegangan eksternal terdeteksi ${dev.externalVoltage || 0}V dengan daya baterai cadangan ${dev.batteryPercent || 0}%.`,
          recommendedAction: (dev.externalVoltage || 0) < 11 ? 'Periksa sambungan kabel aki di bengkel.' : 'Tegangan aman.',
          severity: (dev.externalVoltage || 0) < 11 ? 'critical' : 'info'
        }
      ],
      powerTrend: (dev.externalVoltage || 0) > 12 ? 'stable' : 'degrading',
      signalQualityScore: (dev.satellitesCount || 0) * 7,
      dataQualityScore: Math.max(100 - dev.messagesFailed, 50)
    };
  }

  public getNormalizedTelemetry(deviceId: string): NormalizedTelemetry {
    const dev = this.getDevice(deviceId);
    return {
      ...mockNormalizedTelemetry,
      deviceId: deviceId,
      vehicleId: dev?.vehicleId || 'V-001',
      timestamp: dev?.lastPingAt || new Date().toISOString(),
      satellites: dev?.satellitesCount !== undefined ? dev.satellitesCount : 12,
      accuracy: dev?.gpsAccuracyMeters !== undefined ? dev.gpsAccuracyMeters : 2.4,
      batteryVoltage: dev?.batteryVoltage !== undefined ? dev.batteryVoltage : 4.1,
      externalVoltage: dev?.externalVoltage !== undefined ? dev.externalVoltage : 13.8,
      speed: dev?.speed !== undefined ? dev.speed : mockNormalizedTelemetry.speed,
      rpm: dev?.rpm !== undefined ? dev.rpm : mockNormalizedTelemetry.rpm,
      ignition: dev?.ignition !== undefined ? dev.ignition : mockNormalizedTelemetry.ignition,
      fuelLevelPercent: dev?.fuelLevelPercent !== undefined ? dev.fuelLevelPercent : mockNormalizedTelemetry.fuelLevelPercent,
      fuelLiters: dev?.fuelLiters !== undefined ? dev.fuelLiters : mockNormalizedTelemetry.fuelLiters,
      engineTempCelsius: dev?.engineTempCelsius !== undefined ? dev.engineTempCelsius : mockNormalizedTelemetry.engineTempCelsius,
      cabinTempCelsius: dev?.cabinTempCelsius !== undefined ? dev.cabinTempCelsius : mockNormalizedTelemetry.cabinTempCelsius,
      cargoTempCelsius: dev?.cargoTempCelsius !== undefined ? dev.cargoTempCelsius : mockNormalizedTelemetry.cargoTempCelsius,
      doorFrontOpen: dev?.doorFrontOpen !== undefined ? dev.doorFrontOpen : mockNormalizedTelemetry.doorFrontOpen,
      doorRearOpen: dev?.doorRearOpen !== undefined ? dev.doorRearOpen : mockNormalizedTelemetry.doorRearOpen,
      doorStatus: dev?.doorStatus || mockNormalizedTelemetry.doorStatus,
      engineHours: dev?.engineHours !== undefined ? dev.engineHours : mockNormalizedTelemetry.engineHours,
      odometerKm: dev?.odometerKm !== undefined ? dev.odometerKm : mockNormalizedTelemetry.odometerKm,
      acStatus: dev?.acStatus !== undefined ? dev.acStatus : mockNormalizedTelemetry.acStatus,
      ptoStatus: dev?.ptoStatus !== undefined ? dev.ptoStatus : mockNormalizedTelemetry.ptoStatus,
      gpsFixStatus: dev?.gpsFixStatus || mockNormalizedTelemetry.gpsFixStatus
    };
  }

  public getEvents(deviceId: string): DeviceEvent[] {
    return this.events.filter((e) => e.deviceId === deviceId);
  }

  public getCommands(deviceId: string): DeviceCommand[] {
    return this.commands.filter((c) => c.deviceId === deviceId);
  }
}

export const gpsDeviceService = new GPSDeviceService();
