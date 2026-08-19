/**
 * Fleet Intelligence Smart AI - Teltonika Provider Adapter
 */

import { BaseGpsProviderAdapter } from './GpsProviderAdapter';
import { RawGpsMessage, NormalizedTelemetry, GpsCommand, VehicleLocation, DeviceHealth } from '../types/gpsArchitecture';
import { TeltonikaCodec8Parser } from '../parsers/TeltonikaCodec8Parser';

export class TeltonikaAdapter extends BaseGpsProviderAdapter {
  public providerId = 'teltonika_adapter';
  public providerName = 'Teltonika Telematics';
  public protocolName = 'Teltonika Codec 8 / 8 Extended';
  public transport: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket' = 'TCP';

  public async getDevice(deviceId: string): Promise<DeviceHealth | null> {
    return {
      deviceId,
      tenantId: 'tenant-1',
      lastSeenAt: new Date().toISOString(),
      gpsSignal: 'Excellent',
      gsmSignal: 94,
      networkType: '4G',
      operator: 'Telkomsel',
      batteryVoltage: 12.8,
      externalVoltage: 24.6,
      temperature: 32,
      firmwareVersion: '03.28.07.Rev.02',
      connectionStatus: 'Online',
      healthScore: 98,
      satellitesCount: 18,
      hdop: 0.8,
      offlineThresholdSeconds: 300,
    };
  }

  public async getLatestLocation(deviceId: string): Promise<VehicleLocation | null> {
    return {
      id: `loc-${deviceId}`,
      tenantId: 'tenant-1',
      vehicleId: 'veh-1',
      deviceId,
      latitude: -6.1754,
      longitude: 106.8272,
      speed: 55,
      heading: 90,
      accuracy: 1.5,
      altitude: 12,
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
      response: `[TELTONIKA_ACK] Command ${command.commandType} executed successfully on binary channel.`,
    };
  }

  public normalizeMessage(raw: RawGpsMessage): NormalizedTelemetry {
    return TeltonikaCodec8Parser.parse(raw);
  }
}
