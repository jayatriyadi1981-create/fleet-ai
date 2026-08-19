/**
 * Fleet Intelligence Smart AI - Realtime GPS Telemetry Simulator Engine
 * Simulates active vehicle movements, telemetry updates, and speed/event triggers
 */

import { Vehicle, TelemetryData, Location } from '../types';

export type TelemetryListener = (updatedVehicles: Vehicle[]) => void;

class GPSTelemetrySimulator {
  private vehicles: Vehicle[] = [];
  private listeners: Set<TelemetryListener> = new Set();
  private timer: any = null;
  private isRunning: boolean = false;

  // Pre-defined polylines for route movements (e.g. Tol Jakarta - Cikampek - Cikarang)
  private routes: Record<string, Location[]> = {
    'veh-01': [
      { lat: -6.2297, lng: 106.9275, address: 'Tol Jakarta-Cikampek KM 18' },
      { lat: -6.2380, lng: 106.9600, address: 'Tol Jakarta-Cikampek KM 21' },
      { lat: -6.2510, lng: 107.0200, address: 'Tol Cibitung KM 25' },
      { lat: -6.2700, lng: 107.1100, address: 'Gerbang Tol Cikarang Barat' },
      { lat: -6.2825, lng: 107.1702, address: 'Cikarang Dry Port, Jababeka' },
    ],
    'veh-02': [
      { lat: -6.2825, lng: 107.1702, address: 'Cikarang Dry Port' },
      { lat: -6.3010, lng: 107.2100, address: 'Kawasan Industri Jababeka V' },
      { lat: -6.3250, lng: 107.2500, address: 'Kawasan Industri Karawang KIIC' },
      { lat: -6.3501, lng: 107.2800, address: 'Depo Karawang Barat' },
    ],
    'veh-04': [
      { lat: -7.2014, lng: 112.7311, address: 'Pelabuhan Tanjung Perak, Surabaya' },
      { lat: -7.2250, lng: 112.7420, address: 'Jl. Perak Timur, Surabaya' },
      { lat: -7.2500, lng: 112.7500, address: 'Jl. Ahmad Yani, Surabaya' },
      { lat: -7.2800, lng: 112.7650, address: 'Tol Surabaya-Gempol' },
    ]
  };

  private routeIndexes: Record<string, number> = {
    'veh-01': 0,
    'veh-02': 0,
    'veh-04': 0,
  };

  public init(initialVehicles: Vehicle[]) {
    this.vehicles = JSON.parse(JSON.stringify(initialVehicles));
  }

  public subscribe(listener: TelemetryListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public start(intervalMs: number = 3000) {
    if (this.isRunning) return;
    this.isRunning = true;

    this.timer = setInterval(() => {
      this.stepSimulation();
    }, intervalMs);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  private stepSimulation() {
    let updated = false;

    this.vehicles = this.vehicles.map((v) => {
      if (v.status !== 'moving' || !v.latestTelemetry) return v;

      const vehicleRoute = this.routes[v.id];
      if (!vehicleRoute) return v;

      const currentIndex = this.routeIndexes[v.id] || 0;
      const nextIndex = (currentIndex + 1) % vehicleRoute.length;
      this.routeIndexes[v.id] = nextIndex;

      const targetLoc = vehicleRoute[nextIndex];
      const speed = Math.floor(55 + Math.random() * 25); // 55 - 80 km/h
      const heading = (Math.floor(Math.random() * 20) + 80) % 360;

      const newTelemetry: TelemetryData = {
        ...v.latestTelemetry,
        timestamp: new Date().toISOString(),
        location: {
          lat: targetLoc.lat + (Math.random() - 0.5) * 0.001,
          lng: targetLoc.lng + (Math.random() - 0.5) * 0.001,
          address: targetLoc.address,
          speed,
          heading,
          altitude: 20 + Math.floor(Math.random() * 10),
        },
        engineRpm: Math.floor(1400 + Math.random() * 600),
        fuelLevelPercent: Math.max(10, v.latestTelemetry.fuelLevelPercent - 0.1),
        odometerKm: Math.round((v.odometerKm + 0.2) * 10) / 10,
      };

      updated = true;
      return {
        ...v,
        odometerKm: newTelemetry.odometerKm,
        latestTelemetry: newTelemetry,
      };
    });

    if (updated) {
      this.listeners.forEach((listener) => listener([...this.vehicles]));
    }
  }

  public getVehicles(): Vehicle[] {
    return this.vehicles;
  }

  public updateVehicleStatus(vehicleId: string, status: Vehicle['status']) {
    this.vehicles = this.vehicles.map((v) => {
      if (v.id === vehicleId) {
        return { ...v, status };
      }
      return v;
    });
    this.listeners.forEach((listener) => listener([...this.vehicles]));
  }
}

export const gpsSimulator = new GPSTelemetrySimulator();
