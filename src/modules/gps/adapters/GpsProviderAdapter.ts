/**
 * Fleet Intelligence Smart AI - GPS Provider Adapter Interface
 * Decouples external tracker manufacturers (Teltonika, Concox, Queclink, etc.) from Core Domain
 */

import {
  RawGpsMessage,
  NormalizedTelemetry,
  GpsCommand,
  VehicleLocation,
  DeviceHealth
} from '../types/gpsArchitecture';

export interface GpsProvider {
  providerId: string;
  providerName: string;
  protocolName: string;
  transport: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket';
  
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  authenticate(credentials: Record<string, any>): Promise<boolean>;
  
  getDevice(deviceId: string): Promise<DeviceHealth | null>;
  getLatestLocation(deviceId: string): Promise<VehicleLocation | null>;
  
  sendCommand(command: GpsCommand): Promise<GpsCommand>;
  subscribeTelemetry(callback: (telemetry: NormalizedTelemetry) => void): () => void;
  
  normalizeMessage(raw: RawGpsMessage): NormalizedTelemetry;
}

export abstract class BaseGpsProviderAdapter implements GpsProvider {
  public abstract providerId: string;
  public abstract providerName: string;
  public abstract protocolName: string;
  public abstract transport: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'MQTT' | 'WebSocket';
  
  protected isConnected: boolean = false;
  protected listeners: Array<(telemetry: NormalizedTelemetry) => void> = [];

  public async connect(): Promise<boolean> {
    this.isConnected = true;
    return true;
  }

  public async disconnect(): Promise<boolean> {
    this.isConnected = false;
    return true;
  }

  public async authenticate(credentials: Record<string, any>): Promise<boolean> {
    return true;
  }

  public abstract getDevice(deviceId: string): Promise<DeviceHealth | null>;
  public abstract getLatestLocation(deviceId: string): Promise<VehicleLocation | null>;
  public abstract sendCommand(command: GpsCommand): Promise<GpsCommand>;
  public abstract normalizeMessage(raw: RawGpsMessage): NormalizedTelemetry;

  public subscribeTelemetry(callback: (telemetry: NormalizedTelemetry) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  protected emitTelemetry(telemetry: NormalizedTelemetry) {
    this.listeners.forEach((listener) => listener(telemetry));
  }
}
