/**
 * Interface & Mock Implementation for Realtime GPS Telematics Service
 */

import { TelemetryData, Vehicle } from '../../types';

export interface GpsService {
  connect(): Promise<void>;
  disconnect(): void;
  subscribeToVehicleUpdates(callback: (telemetry: TelemetryData) => void): () => void;
  getLatestTelemetry(vehicleId: string): Promise<TelemetryData | null>;
}

export class MockGpsService implements GpsService {
  private subscribers: Set<(telemetry: TelemetryData) => void> = new Set();
  private intervalId: any = null;

  async connect(): Promise<void> {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.notifySubscribers();
    }, 4000);
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.subscribers.clear();
  }

  subscribeToVehicleUpdates(callback: (telemetry: TelemetryData) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  async getLatestTelemetry(vehicleId: string): Promise<TelemetryData | null> {
    return {
      deviceId: `DEV-${vehicleId}`,
      imei: '869210049281723',
      timestamp: new Date().toISOString(),
      location: {
        lat: -6.2088 + (Math.random() - 0.5) * 0.01,
        lng: 106.8456 + (Math.random() - 0.5) * 0.01,
        speed: Math.floor(Math.random() * 80),
        address: 'Tol Jakarta - Cikampek KM 19',
      },
      ignition: true,
      engineRpm: 1850,
      fuelLevelPercent: 78,
      fuelLevelLiters: 156,
      engineTempCelsius: 88,
      batteryVoltage: 24.2,
      odometerKm: 128450,
      engineHours: 3420,
      doorOpen: false,
      acOn: true,
      gpsSignal: 95,
      gsmSignal: 88,
    };
  }

  private notifySubscribers() {
    const mockTelemetry: TelemetryData = {
      deviceId: 'DEV-DEMO-01',
      imei: '869210049281723',
      timestamp: new Date().toISOString(),
      location: {
        lat: -6.2088 + (Math.random() - 0.5) * 0.02,
        lng: 106.8456 + (Math.random() - 0.5) * 0.02,
        speed: Math.floor(Math.random() * 70) + 10,
        address: 'Kawasan Industri MM2100 Cikarang',
      },
      ignition: true,
      engineRpm: 1900,
      fuelLevelPercent: 74,
      fuelLevelLiters: 148,
      engineTempCelsius: 89,
      batteryVoltage: 24.1,
      odometerKm: 128455,
      engineHours: 3421,
      doorOpen: false,
      acOn: true,
      gpsSignal: 98,
      gsmSignal: 90,
    };

    this.subscribers.forEach((cb) => cb(mockTelemetry));
  }
}

export const gpsService: GpsService = new MockGpsService();
