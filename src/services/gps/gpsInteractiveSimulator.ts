/**
 * Fleet Intelligence Smart AI - Interactive GPS & Protocol Telematics Simulator
 * PROMPT 43: Interactive Route Generator, Multi-Protocol Packet Streamer & Anomaly Injector
 */

import { gpsIntegrationService } from './gpsIntegrationService';
import { ProtocolTransport } from '../../types/gpsIntegration';

export interface SimVehicleState {
  vehicleId: string;
  vehiclePlate: string;
  deviceId: string;
  imei: string;
  protocol: string;
  transport: ProtocolTransport;
  driverName: string;
  currentRouteIndex: number;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  rpm: number;
  fuelPercent: number;
  batteryPercent: number;
  ignition: boolean;
  isEngineLocked: boolean;
  status: 'MOVING' | 'IDLE' | 'STOPPED' | 'ANOMALY';
  activeAnomaly?: string;
}

export class GPSInteractiveSimulator {
  private isRunning: boolean = false;
  private timer: any = null;
  private updateIntervalMs: number = 2500;
  private listeners: Set<(states: SimVehicleState[]) => void> = new Set();

  // Route 1: Tol Jakarta - Cikampek (KM 10 to Cikarang / Karawang)
  private routeJktCikampek = [
    { lat: -6.2297, lng: 106.9275, name: 'Tol Jakarta-Cikampek KM 12 (Bekasi Barat)' },
    { lat: -6.2380, lng: 106.9600, name: 'Tol Jakarta-Cikampek KM 18 (Bekasi Timur)' },
    { lat: -6.2510, lng: 107.0200, name: 'Rest Area KM 19' },
    { lat: -6.2620, lng: 107.0700, name: 'Tol Cibitung KM 24' },
    { lat: -6.2750, lng: 107.1200, name: 'Cikarang Utama KM 29' },
    { lat: -6.2825, lng: 107.1702, name: 'Cikarang Dry Port, Jababeka' },
    { lat: -6.3100, lng: 107.2200, name: 'Kawasan Industri KIIC Karawang' }
  ];

  // Route 2: Surabaya Tanjung Perak - Tol Gempol
  private routeSurabaya = [
    { lat: -7.2014, lng: 112.7311, name: 'Pelabuhan Tanjung Perak Surabaya' },
    { lat: -7.2250, lng: 112.7420, name: 'Jl. Perak Timur' },
    { lat: -7.2500, lng: 112.7500, name: 'Jl. Ahmad Yani, Wonokromo' },
    { lat: -7.2800, lng: 112.7650, name: 'Gerbang Tol Waru' },
    { lat: -7.3400, lng: 112.7800, name: 'Tol Surabaya - Gempol KM 28' },
    { lat: -7.4200, lng: 112.8200, name: 'Depo Logistik Porong' }
  ];

  // Simulated fleet state
  private vehicles: SimVehicleState[] = [
    {
      vehicleId: 'veh-01',
      vehiclePlate: 'B 9281 TKL',
      deviceId: 'dev-001',
      imei: '867492041234561',
      protocol: 'Teltonika Codec 8',
      transport: 'TCP',
      driverName: 'Budi Pratama',
      currentRouteIndex: 0,
      lat: -6.2297,
      lng: 106.9275,
      speed: 64,
      heading: 95,
      rpm: 1650,
      fuelPercent: 82.5,
      batteryPercent: 96,
      ignition: true,
      isEngineLocked: false,
      status: 'MOVING'
    },
    {
      vehicleId: 'veh-02',
      vehiclePlate: 'B 9043 UZX',
      deviceId: 'dev-002',
      imei: '869103049182732',
      protocol: 'Teltonika Codec 8 Extended',
      transport: 'TCP',
      driverName: 'Agus Santoso',
      currentRouteIndex: 2,
      lat: -6.2510,
      lng: 107.0200,
      speed: 72,
      heading: 92,
      rpm: 1820,
      fuelPercent: 68.0,
      batteryPercent: 98,
      ignition: true,
      isEngineLocked: false,
      status: 'MOVING'
    },
    {
      vehicleId: 'veh-03',
      vehiclePlate: 'L 8812 AB',
      deviceId: 'dev-003',
      imei: '356789012345673',
      protocol: 'Queclink @Track',
      transport: 'TCP',
      driverName: 'Dedi Kurniawan',
      currentRouteIndex: 1,
      lat: -7.2250,
      lng: 112.7420,
      speed: 48,
      heading: 180,
      rpm: 1400,
      fuelPercent: 74.0,
      batteryPercent: 92,
      ignition: true,
      isEngineLocked: false,
      status: 'MOVING'
    },
    {
      vehicleId: 'veh-04',
      vehiclePlate: 'D 1944 CD',
      deviceId: 'dev-004',
      imei: '868123045678904',
      protocol: 'Concox GT06 Binary',
      transport: 'TCP',
      driverName: 'Hendra Wijaya',
      currentRouteIndex: 0,
      lat: -6.9175,
      lng: 107.6191,
      speed: 0,
      heading: 0,
      rpm: 750,
      fuelPercent: 55.0,
      batteryPercent: 99,
      ignition: true,
      isEngineLocked: false,
      status: 'IDLE'
    }
  ];

  public getVehicles(): SimVehicleState[] {
    return [...this.vehicles];
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public subscribe(listener: (states: SimVehicleState[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public start(intervalMs: number = 2500) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.updateIntervalMs = intervalMs;

    this.timer = setInterval(() => {
      this.tick();
    }, this.updateIntervalMs);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  // Step simulation logic & push packet through real ingestion pipeline
  public tick() {
    this.vehicles = this.vehicles.map((veh) => {
      if (veh.isEngineLocked) {
        veh.speed = 0;
        veh.rpm = 0;
        veh.ignition = false;
        veh.status = 'STOPPED';
        return veh;
      }

      const route = veh.vehicleId === 'veh-03' ? this.routeSurabaya : this.routeJktCikampek;
      let nextIdx = (veh.currentRouteIndex + 1) % route.length;
      veh.currentRouteIndex = nextIdx;

      const targetPoint = route[nextIdx];
      // Micro-jitter to simulate smooth GPS coordinates along highway
      const jitterLat = (Math.random() - 0.5) * 0.0008;
      const jitterLng = (Math.random() - 0.5) * 0.0008;

      veh.lat = targetPoint.lat + jitterLat;
      veh.lng = targetPoint.lng + jitterLng;

      if (veh.status === 'MOVING') {
        veh.speed = Math.floor(58 + Math.random() * 24); // 58 - 82 km/h
        veh.rpm = Math.floor(1500 + veh.speed * 8);
        veh.fuelPercent = Math.max(5, Number((veh.fuelPercent - 0.04).toFixed(2)));
      } else if (veh.status === 'IDLE') {
        veh.speed = 0;
        veh.rpm = 750;
        veh.fuelPercent = Math.max(5, Number((veh.fuelPercent - 0.01).toFixed(2)));
      }

      // Dispatch packet through real integration service pipeline!
      gpsIntegrationService.ingestRawMessage({
        transport: veh.transport,
        protocol: veh.protocol,
        deviceIdentifier: veh.imei,
        rawPayload: {
          imei: veh.imei,
          lat: veh.lat,
          lng: veh.lng,
          speed: veh.speed,
          heading: veh.heading,
          ignition: veh.ignition,
          fuel: veh.fuelPercent,
          rpm: veh.rpm
        }
      });

      return veh;
    });

    this.notifyListeners();
  }

  // --- FAULT & ANOMALY INJECTION METHODS ---
  public injectSpeedSpike(vehicleId: string) {
    const veh = this.vehicles.find((v) => v.vehicleId === vehicleId);
    if (veh) {
      veh.speed = 195; // Impossible speed anomaly (> 180 km/h)
      veh.activeAnomaly = 'IMPOSSIBLE_SPEED';
      gpsIntegrationService.ingestRawMessage({
        transport: veh.transport,
        protocol: veh.protocol,
        deviceIdentifier: veh.imei,
        rawPayload: {
          imei: veh.imei,
          lat: veh.lat,
          lng: veh.lng,
          speed: 195,
          heading: veh.heading,
          ignition: true,
          fuel: veh.fuelPercent
        }
      });
      this.notifyListeners();
    }
  }

  public injectGpsJump(vehicleId: string) {
    const veh = this.vehicles.find((v) => v.vehicleId === vehicleId);
    if (veh) {
      // Teleport 200km away
      veh.lat += 1.8;
      veh.lng += 1.8;
      veh.activeAnomaly = 'GPS_JUMP';
      gpsIntegrationService.ingestRawMessage({
        transport: veh.transport,
        protocol: veh.protocol,
        deviceIdentifier: veh.imei,
        rawPayload: {
          imei: veh.imei,
          lat: veh.lat,
          lng: veh.lng,
          speed: veh.speed,
          heading: veh.heading,
          ignition: true,
          fuel: veh.fuelPercent
        }
      });
      this.notifyListeners();
    }
  }

  public injectFuelDrain(vehicleId: string) {
    const veh = this.vehicles.find((v) => v.vehicleId === vehicleId);
    if (veh) {
      veh.fuelPercent = Math.max(5, veh.fuelPercent - 25);
      veh.activeAnomaly = 'FUEL_DRAIN';
      gpsIntegrationService.publishEvent({
        id: `evt-fuel-${Date.now()}`,
        tenantId: 'tenant-1',
        companyId: 'comp-1',
        deviceId: veh.deviceId,
        vehicleId: veh.vehicleId,
        vehiclePlate: veh.vehiclePlate,
        driverName: veh.driverName,
        type: 'FUEL_DRAIN',
        timestamp: new Date().toISOString(),
        location: {
          latitude: veh.lat,
          longitude: veh.lng,
          speed: veh.speed,
          heading: veh.heading,
          accuracy: 4,
          timestamp: new Date().toISOString(),
          isValid: true
        },
        value: '-25% Fuel Drop in 60s',
        severity: 'CRITICAL',
        metadata: { dropRate: '25% / min', suspectedTheft: true }
      });
      this.notifyListeners();
    }
  }

  public injectPanicSOS(vehicleId: string) {
    const veh = this.vehicles.find((v) => v.vehicleId === vehicleId);
    if (veh) {
      veh.activeAnomaly = 'PANIC_SOS';
      gpsIntegrationService.publishEvent({
        id: `evt-panic-${Date.now()}`,
        tenantId: 'tenant-1',
        companyId: 'comp-1',
        deviceId: veh.deviceId,
        vehicleId: veh.vehicleId,
        vehiclePlate: veh.vehiclePlate,
        driverName: veh.driverName,
        type: 'PANIC',
        timestamp: new Date().toISOString(),
        location: {
          latitude: veh.lat,
          longitude: veh.lng,
          speed: veh.speed,
          heading: veh.heading,
          accuracy: 3,
          timestamp: new Date().toISOString(),
          isValid: true
        },
        value: 'Physical SOS Panic Button Triggered',
        severity: 'CRITICAL',
        metadata: { triggeredBy: 'Cabin SOS Switch' }
      });
      this.notifyListeners();
    }
  }

  public toggleEngineLock(vehicleId: string, locked: boolean) {
    const veh = this.vehicles.find((v) => v.vehicleId === vehicleId);
    if (veh) {
      veh.isEngineLocked = locked;
      if (locked) {
        veh.speed = 0;
        veh.rpm = 0;
        veh.ignition = false;
        veh.status = 'STOPPED';
      } else {
        veh.ignition = true;
        veh.status = 'MOVING';
      }
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l([...this.vehicles]));
  }
}

export const gpsInteractiveSimulator = new GPSInteractiveSimulator();
