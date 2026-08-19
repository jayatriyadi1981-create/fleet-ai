/**
 * Fleet Intelligence Smart AI - Mock GPS Provider
 * Interactive Telematics & GPS Packet Generator for Development & Demo Testing
 */

import { BaseGpsProviderAdapter } from '../adapters/GpsProviderAdapter';
import { RawGpsMessage, NormalizedTelemetry, GpsCommand, VehicleLocation, DeviceHealth } from '../types/gpsArchitecture';
import { gpsIngestionService } from '../services/GpsIngestionService';

export class MockGpsProvider extends BaseGpsProviderAdapter {
  public providerId = 'mock_gps_provider';
  public providerName = 'Smart AI Mock GPS Engine';
  public protocolName = 'Mock IoT Telematics';
  public transport: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket' = 'WebSocket';

  private simulationTimer: any = null;
  private isSimulating: boolean = false;
  private currentSequence: number = 1000;

  // Active simulated state per device
  private deviceStates: Map<string, {
    lat: number;
    lng: number;
    speed: number;
    heading: number;
    ignition: boolean;
    satellites: number;
    voltage: number;
    protocol: string;
  }> = new Map();

  constructor() {
    super();
    this.initDefaultDevices();
  }

  private initDefaultDevices() {
    this.deviceStates.set('GPS-DEV-001', { lat: -6.2088, lng: 106.8456, speed: 45, heading: 120, ignition: true, satellites: 14, voltage: 24.2, protocol: 'GT06' });
    this.deviceStates.set('GPS-DEV-002', { lat: -6.1754, lng: 106.8272, speed: 0, heading: 90, ignition: false, satellites: 16, voltage: 24.5, protocol: 'Teltonika' });
    this.deviceStates.set('GPS-DEV-003', { lat: -6.2297, lng: 106.8074, speed: 0, heading: 210, ignition: true, satellites: 12, voltage: 24.0, protocol: 'Generic_HTTP' });
  }

  public startSimulation(intervalMs: number = 3000) {
    if (this.isSimulating) return;
    this.isSimulating = true;

    this.simulationTimer = setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  public stopSimulation() {
    this.isSimulating = false;
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
  }

  public isRunning(): boolean {
    return this.isSimulating;
  }

  private tick() {
    this.deviceStates.forEach((state, deviceId) => {
      if (state.ignition && state.speed > 0) {
        // Increment coordinates along heading vector
        const rad = (state.heading * Math.PI) / 180;
        const distDeg = (state.speed / 3600 / 111) * 3; // 3 second jump
        state.lat += Math.sin(rad) * distDeg;
        state.lng += Math.cos(rad) * distDeg;
      }

      this.currentSequence++;
      const packet = {
        deviceId,
        timestamp: new Date().toISOString(),
        latitude: state.lat,
        longitude: state.lng,
        speed: state.speed,
        heading: state.heading,
        ignition: state.ignition,
        sequenceNumber: this.currentSequence,
        protocol: state.protocol,
        rawData: { mockState: state },
      };

      gpsIngestionService.ingestTelemetry(packet);
    });
  }

  // Simulator Interactive Controls
  public triggerSpeedSpike(deviceId: string, speedKmH: number = 110) {
    const st = this.deviceStates.get(deviceId);
    if (st) {
      st.speed = speedKmH;
      st.ignition = true;
      this.tick();
    }
  }

  public toggleIgnition(deviceId: string) {
    const st = this.deviceStates.get(deviceId);
    if (st) {
      st.ignition = !st.ignition;
      st.speed = st.ignition ? 25 : 0;
      this.tick();
    }
  }

  public triggerLowVoltage(deviceId: string, volts: number = 10.5) {
    const st = this.deviceStates.get(deviceId);
    if (st) {
      st.voltage = volts;
      this.tick();
    }
  }

  public triggerSignalLoss(deviceId: string) {
    const st = this.deviceStates.get(deviceId);
    if (st) {
      st.satellites = 1;
      this.tick();
    }
  }

  public async getDevice(deviceId: string): Promise<DeviceHealth | null> {
    const st = this.deviceStates.get(deviceId);
    return {
      deviceId,
      tenantId: 'tenant-1',
      lastSeenAt: new Date().toISOString(),
      gpsSignal: st && st.satellites >= 10 ? 'Excellent' : 'Weak',
      gsmSignal: 90,
      networkType: '4G',
      operator: 'Telkomsel',
      batteryVoltage: 12.6,
      externalVoltage: st ? st.voltage : 24.0,
      firmwareVersion: 'Sim-v2.0',
      connectionStatus: 'Online',
      healthScore: 96,
      satellitesCount: st ? st.satellites : 12,
      hdop: 1.0,
      offlineThresholdSeconds: 300,
    };
  }

  public async getLatestLocation(deviceId: string): Promise<VehicleLocation | null> {
    const locs = gpsIngestionService.getLatestLocations();
    return locs.find((l) => l.deviceId === deviceId) || null;
  }

  public async sendCommand(command: GpsCommand): Promise<GpsCommand> {
    return {
      ...command,
      status: 'Acknowledged',
      sentAt: new Date().toISOString(),
      acknowledgedAt: new Date().toISOString(),
      response: `[MOCK_PROVIDER_ACK] Simulated execution of ${command.commandType} on ${command.deviceId}`,
    };
  }

  public normalizeMessage(raw: RawGpsMessage): NormalizedTelemetry {
    return {
      deviceId: raw.deviceId,
      timestamp: raw.receivedAt,
      latitude: -6.2088,
      longitude: 106.8456,
      speed: 35,
      heading: 90,
      ignition: true,
      satellites: 14,
      accuracy: 2.0,
      sequenceNumber: raw.sequenceNumber,
    };
  }
}

export const mockGpsProvider = new MockGpsProvider();
