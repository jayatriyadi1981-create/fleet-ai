/**
 * Fleet Intelligence Smart AI - Concox GT06 Provider Adapter
 */

import { BaseGpsProviderAdapter } from './GpsProviderAdapter';
import { RawGpsMessage, NormalizedTelemetry, GpsCommand, VehicleLocation, DeviceHealth } from '../types/gpsArchitecture';
import { GT06Parser } from '../parsers/GT06Parser';

export class ConcoxGT06Adapter extends BaseGpsProviderAdapter {
  public providerId = 'concox_gt06_adapter';
  public providerName = 'Concox / Jimi IoT';
  public protocolName = 'GT06 Protocol';
  public transport: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket' = 'TCP';

  public async getDevice(deviceId: string): Promise<DeviceHealth | null> {
    return {
      deviceId,
      tenantId: 'tenant-1',
      lastSeenAt: new Date().toISOString(),
      gpsSignal: 'Good',
      gsmSignal: 85,
      networkType: '4G',
      operator: 'Indosat',
      batteryVoltage: 12.4,
      externalVoltage: 24.1,
      temperature: 36,
      firmwareVersion: 'GT06-v4.2.1',
      connectionStatus: 'Online',
      healthScore: 92,
      satellitesCount: 14,
      hdop: 1.2,
      offlineThresholdSeconds: 300,
    };
  }

  public async getLatestLocation(deviceId: string): Promise<VehicleLocation | null> {
    return {
      id: `loc-${deviceId}`,
      tenantId: 'tenant-1',
      vehicleId: 'veh-2',
      deviceId,
      latitude: -6.2088,
      longitude: 106.8456,
      speed: 40,
      heading: 180,
      accuracy: 2.5,
      altitude: 15,
      timestamp: new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      ignition: true,
      status: 'Moving',
      lastSeenAt: new Date().toISOString(),
      lastLocationAt: new Date().toISOString(),
    };
  }

  public async sendCommand(command: GpsCommand): Promise<GpsCommand> {
    return {
      ...command,
      status: 'Acknowledged',
      sentAt: new Date().toISOString(),
      acknowledgedAt: new Date().toISOString(),
      response: `[GT06_ACK] Command ${command.commandType} delivered to GT06 device.`,
    };
  }

  public normalizeMessage(raw: RawGpsMessage): NormalizedTelemetry {
    return GT06Parser.parse(raw);
  }
}
