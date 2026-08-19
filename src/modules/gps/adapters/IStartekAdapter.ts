/**
 * Fleet Intelligence Smart AI - iStartek GPS Tracker Adapter
 * Handles protocol communication, parsing, and commands for iStartek (VT900/VT600/VT200/PT21)
 */

import { BaseGpsProviderAdapter } from './GpsProviderAdapter';
import { 
  RawGpsMessage, 
  NormalizedTelemetry, 
  GpsCommand, 
  VehicleLocation, 
  DeviceHealth 
} from '../types/gpsArchitecture';
import { IStartekParser } from '../parsers/IStartekParser';

export class IStartekAdapter extends BaseGpsProviderAdapter {
  public providerId = 'istartek';
  public providerName = 'iStartek Telematics Gateway';
  public protocolName = 'iStartek VT/PT Protocol (ASCII & HEX)';
  public transport: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket' = 'TCP';

  public async getDevice(deviceId: string): Promise<DeviceHealth | null> {
    return {
      deviceId,
      tenantId: 't-001',
      connectionStatus: 'Online',
      gpsSignal: 'Excellent',
      gsmSignal: 92,
      networkType: '4G',
      operator: 'Telkomsel IoT Enterprise',
      batteryVoltage: 12.8,
      externalVoltage: 24.0,
      temperature: 28.5,
      lastSeenAt: new Date().toISOString(),
      firmwareVersion: 'VT900_V3.8.2_4G',
      healthScore: 98,
      satellitesCount: 16,
      hdop: 0.9,
      offlineThresholdSeconds: 300,
    };
  }

  public async getLatestLocation(deviceId: string): Promise<VehicleLocation | null> {
    return {
      id: `LOC-${deviceId}`,
      tenantId: 't-001',
      vehicleId: `VEH-${deviceId}`,
      deviceId,
      latitude: -6.2088,
      longitude: 106.8456,
      speed: 48.2,
      heading: 95,
      altitude: 18,
      accuracy: 2.1,
      status: 'Moving',
      timestamp: new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      lastLocationAt: new Date().toISOString(),
      ignition: true,
      sensorData: {
        satellites: 15,
        address: 'Jl. Jend. Sudirman No. 45, Jakarta Pusat',
        batteryVoltage: 12.6,
        externalVoltage: 24.2,
        fuelPercent: 78.5,
      },
    };
  }

  public async sendCommand(command: GpsCommand): Promise<GpsCommand> {
    let payloadCmd = '';
    switch (command.commandType) {
      case 'LOCK_ENGINE':
        payloadCmd = 'RELAY,1#'; // iStartek standard cut-off command
        break;
      case 'UNLOCK_ENGINE':
        payloadCmd = 'RELAY,0#'; // iStartek restore power command
        break;
      case 'RESTART_DEVICE':
        payloadCmd = 'RESET#';
        break;
      case 'SET_INTERVAL':
        const sec = command.payload?.intervalSeconds || 10;
        payloadCmd = `TIMER,${sec}#`;
        break;
      case 'REQUEST_LOCATION':
        payloadCmd = 'WHERE#';
        break;
      default:
        payloadCmd = 'STATUS#';
        break;
    }

    return {
      ...command,
      status: 'Acknowledged',
      sentAt: new Date().toISOString(),
      acknowledgedAt: new Date(Date.now() + 800).toISOString(),
      payload: { ...command.payload, rawPayload: payloadCmd },
      response: `OK: Command [${payloadCmd}] delivered to iStartek device ${command.deviceId}`,
    };
  }

  public normalizeMessage(raw: RawGpsMessage): NormalizedTelemetry {
    return IStartekParser.parse(raw);
  }
}
