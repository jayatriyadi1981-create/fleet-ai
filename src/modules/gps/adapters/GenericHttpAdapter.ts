/**
 * Fleet Intelligence Smart AI - Generic HTTP / Webhook GPS Adapter
 */

import { BaseGpsProviderAdapter } from './GpsProviderAdapter';
import { RawGpsMessage, NormalizedTelemetry, GpsCommand, VehicleLocation, DeviceHealth } from '../types/gpsArchitecture';
import { GenericJsonParser } from '../parsers/GenericJsonParser';

export class GenericHttpAdapter extends BaseGpsProviderAdapter {
  public providerId = 'generic_http_adapter';
  public providerName = 'Generic Telematics Webhook Gateway';
  public protocolName = 'JSON / HTTP Webhook';
  public transport: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket' = 'HTTPS';

  public async getDevice(deviceId: string): Promise<DeviceHealth | null> {
    return {
      deviceId,
      tenantId: 'tenant-1',
      lastSeenAt: new Date().toISOString(),
      gpsSignal: 'Good',
      gsmSignal: 80,
      networkType: '4G',
      operator: 'Telkomsel',
      batteryVoltage: 12.2,
      externalVoltage: 24.0,
      firmwareVersion: '1.0.0-REST',
      connectionStatus: 'Online',
      healthScore: 90,
      satellitesCount: 12,
      hdop: 1.5,
      offlineThresholdSeconds: 300,
    };
  }

  public async getLatestLocation(deviceId: string): Promise<VehicleLocation | null> {
    return {
      id: `loc-${deviceId}`,
      tenantId: 'tenant-1',
      vehicleId: 'veh-3',
      deviceId,
      latitude: -6.2297,
      longitude: 106.8074,
      speed: 0,
      heading: 0,
      accuracy: 3.0,
      timestamp: new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      ignition: false,
      status: 'Stopped',
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
      response: `[HTTP_REST_ACK] REST Endpoint accepted payload for command ${command.commandType}.`,
    };
  }

  public normalizeMessage(raw: RawGpsMessage): NormalizedTelemetry {
    return GenericJsonParser.parse(raw);
  }
}
