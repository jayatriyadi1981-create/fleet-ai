/**
 * Fleet Intelligence Smart AI - Live Tracking Service
 * Enterprise Realtime Telemetry, Connection Management, Filtering, & Audit Engine
 */

import { MapVehicle, LiveVehicleStatus, VehicleClusterData } from '../types';
import { mockVehicles, mockDrivers, mockGpsDevices, mockBranches, mockAlerts } from '../../../constants/mockData';
import { gpsSimulator } from '../../../services/gpsSimulator';

export type RealtimeTransportState = 'LIVE' | 'RECONNECTING' | 'OFFLINE';

export interface LiveTrackingFilterState {
  searchQuery: string;
  status: 'ALL' | LiveVehicleStatus;
  group: string;
  branchId: string;
  driverAssignment: 'ALL' | 'ASSIGNED' | 'UNASSIGNED';
  gpsStatus: 'ALL' | 'ONLINE' | 'OFFLINE' | 'WEAK';
  ignition: 'ALL' | 'ON' | 'OFF';
  speedRange: 'ALL' | '0_20' | '20_40' | '40_60' | '60_80' | '80_PLUS';
  alertsOnly: boolean;
}

export interface LiveVehicleCounters {
  total: number;
  moving: number;
  stopped: number;
  idle: number;
  offline: number;
  unknown: number;
  hasAlerts: number;
}

export interface AuditLogItem {
  timestamp: string;
  action: string;
  details: string;
}

type SubscriberCallback = (vehicles: MapVehicle[]) => void;
type ConnectionStateCallback = (state: RealtimeTransportState) => void;

export class LiveTrackingService {
  private vehiclesMap: Map<string, MapVehicle> = new Map();
  private subscribers: Set<SubscriberCallback> = new Set();
  private connectionSubscribers: Set<ConnectionStateCallback> = new Set();
  private transportState: RealtimeTransportState = 'LIVE';
  private followingVehicleId: string | null = null;
  private selectedVehicleId: string | null = null;
  private auditLogs: AuditLogItem[] = [];

  private filterState: LiveTrackingFilterState = {
    searchQuery: '',
    status: 'ALL',
    group: 'ALL',
    branchId: 'ALL',
    driverAssignment: 'ALL',
    gpsStatus: 'ALL',
    ignition: 'ALL',
    speedRange: 'ALL',
    alertsOnly: false
  };

  constructor() {
    this.initializeMasterData();
    this.startRealtimeSimulation();
  }

  /**
   * Hydrate initial MapVehicle dataset from Prompt 9, 10, 11, 12 master models
   */
  private initializeMasterData(): void {
    mockVehicles.forEach((v) => {
      const driver = mockDrivers.find((d) => d.id === v.currentDriverId || d.assignedVehicleId === v.id);
      const gpsDevice = mockGpsDevices.find((g) => g.id === v.gpsDeviceId);
      const branch = mockBranches.find((b) => b.id === v.branchId);
      const activeAlert = mockAlerts.find((a) => a.vehicleId === v.id);

      // Map vehicle status to LiveVehicleStatus
      let liveStatus: LiveVehicleStatus = 'Moving';
      if (v.status === 'moving') liveStatus = 'Moving';
      else if (v.status === 'parking' || v.status === 'maintenance') liveStatus = 'Stopped';
      else if (v.status === 'idle') liveStatus = 'Idle';
      else if (v.status === 'offline') liveStatus = 'Offline';
      else liveStatus = 'Unknown';

      const mapVeh: MapVehicle = {
        vehicleId: v.id,
        vehiclePlate: v.plateNumber,
        vehicleName: `${v.brand} ${v.model}`,
        vehicleType: v.type,
        driverId: driver?.id,
        driverName: driver?.name,
        driverPhone: driver?.phone,
        driverPhoto: driver?.photoUrl,
        driverScore: driver?.score.overallScore,
        latitude: v.latestTelemetry?.location.lat || -6.200000,
        longitude: v.latestTelemetry?.location.lng || 106.816666,
        speed: v.latestTelemetry?.location.speed || 0,
        heading: v.latestTelemetry?.location.heading || 0,
        status: liveStatus,
        ignition: v.latestTelemetry?.ignition ?? true,
        gpsSignal: (v.latestTelemetry?.gpsSignal ?? 90) > 70 ? 'Excellent' : 'Good',
        accuracy: 8,
        lastSeenAt: v.latestTelemetry?.timestamp || new Date().toISOString(),
        batteryVoltage: v.latestTelemetry?.batteryVoltage || 12.8,
        externalVoltage: 24.2,
        fuelLevelPercent: v.latestTelemetry?.fuelLevelPercent || 82,
        odometerKm: v.odometerKm,
        hasActiveAlert: !!activeAlert,
        alertCategory: activeAlert?.category,
        alertMessage: activeAlert?.message,
        branchId: v.branchId,
        branchName: branch?.name || 'Cabang Utama',
        groupName: v.groupName,
        deviceId: gpsDevice?.id || 'GPS-DEV-001',
        imei: gpsDevice?.imei || '864201048291001'
      };

      this.vehiclesMap.set(v.id, mapVeh);
    });
  }

  /**
   * Start listening for real-time telemetry updates or simulated packets
   */
  private startRealtimeSimulation(): void {
    // Listen to Prompt 12 GPS Simulator events
    gpsSimulator.subscribe((updatedVehicles) => {
      if (this.transportState !== 'LIVE') return;

      let changed = false;
      updatedVehicles.forEach((simVeh) => {
        const vehicle = this.vehiclesMap.get(simVeh.id);
        if (vehicle && simVeh.latestTelemetry) {
          let newStatus: LiveVehicleStatus = 'Moving';
          if (simVeh.status === 'parking' || simVeh.status === 'maintenance') newStatus = 'Stopped';
          else if (simVeh.status === 'idle') newStatus = 'Idle';
          else if (simVeh.status === 'offline') newStatus = 'Offline';

          const updated: MapVehicle = {
            ...vehicle,
            latitude: simVeh.latestTelemetry.location.lat,
            longitude: simVeh.latestTelemetry.location.lng,
            speed: simVeh.latestTelemetry.location.speed || 0,
            heading: simVeh.latestTelemetry.location.heading || vehicle.heading,
            ignition: simVeh.latestTelemetry.ignition,
            status: newStatus,
            lastSeenAt: simVeh.latestTelemetry.timestamp,
            fuelLevelPercent: simVeh.latestTelemetry.fuelLevelPercent,
            batteryVoltage: simVeh.latestTelemetry.batteryVoltage
          };

          this.vehiclesMap.set(updated.vehicleId, updated);
          changed = true;
        }
      });

      if (changed) {
        this.notifySubscribers();
      }
    });

    // Background interval to move moving vehicles slightly along realistic trajectories
    setInterval(() => {
      if (this.transportState !== 'LIVE') return;

      let changed = false;
      this.vehiclesMap.forEach((veh, id) => {
        if (veh.status === 'Moving' && veh.speed > 0) {
          // Micro position shift based on speed & heading
          const speedFactor = (veh.speed / 3600) * 0.01; // ~0.0001 deg per step
          const rad = (veh.heading * Math.PI) / 180;

          const deltaLat = Math.cos(rad) * speedFactor;
          const deltaLng = Math.sin(rad) * speedFactor;

          // Slightly drift heading for curved roads
          const newHeading = (veh.heading + (Math.random() * 6 - 3) + 360) % 360;

          this.vehiclesMap.set(id, {
            ...veh,
            latitude: veh.latitude + deltaLat,
            longitude: veh.longitude + deltaLng,
            heading: Math.round(newHeading),
            lastSeenAt: new Date().toISOString()
          });
          changed = true;
        }
      });

      if (changed) {
        this.notifySubscribers();
      }
    }, 2000);
  }

  /**
   * Subscribe to vehicle dataset updates
   */
  public subscribe(callback: SubscriberCallback): () => void {
    this.subscribers.add(callback);
    callback(this.getFilteredVehicles());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Subscribe to connection transport state
   */
  public subscribeConnection(callback: ConnectionStateCallback): () => void {
    this.connectionSubscribers.add(callback);
    callback(this.transportState);
    return () => {
      this.connectionSubscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const filtered = this.getFilteredVehicles();
    this.subscribers.forEach((cb) => cb(filtered));
  }

  private notifyConnectionSubscribers(): void {
    this.connectionSubscribers.forEach((cb) => cb(this.transportState));
  }

  /**
   * Filter State Getters & Setters
   */
  public setFilterState(newState: Partial<LiveTrackingFilterState>): void {
    this.filterState = { ...this.filterState, ...newState };
    this.logAudit('live_tracking.filter_changed', `Filter state updated: ${JSON.stringify(newState)}`);
    this.notifySubscribers();
  }

  public getFilterState(): LiveTrackingFilterState {
    return { ...this.filterState };
  }

  /**
   * Get all MapVehicles or filtered MapVehicles
   */
  public getAllVehicles(): MapVehicle[] {
    return Array.from(this.vehiclesMap.values());
  }

  public getFilteredVehicles(): MapVehicle[] {
    const all = Array.from(this.vehiclesMap.values());
    const f = this.filterState;

    return all.filter((v) => {
      // 1. Search Query
      if (f.searchQuery.trim()) {
        const q = f.searchQuery.toLowerCase().trim();
        const matchPlate = v.vehiclePlate.toLowerCase().includes(q);
        const matchName = v.vehicleName.toLowerCase().includes(q);
        const matchId = v.vehicleId.toLowerCase().includes(q);
        const matchDriver = v.driverName ? v.driverName.toLowerCase().includes(q) : false;
        const matchDriverId = v.driverId ? v.driverId.toLowerCase().includes(q) : false;
        const matchImei = v.imei ? v.imei.toLowerCase().includes(q) : false;
        if (!matchPlate && !matchName && !matchId && !matchDriver && !matchDriverId && !matchImei) {
          return false;
        }
      }

      // 2. Status Filter
      if (f.status !== 'ALL' && v.status !== f.status) return false;

      // 3. Group Filter
      if (f.group !== 'ALL' && v.groupName !== f.group) return false;

      // 4. Branch Filter
      if (f.branchId !== 'ALL' && v.branchId !== f.branchId) return false;

      // 5. Driver Assignment
      if (f.driverAssignment === 'ASSIGNED' && !v.driverId) return false;
      if (f.driverAssignment === 'UNASSIGNED' && v.driverId) return false;

      // 6. GPS Connection
      if (f.gpsStatus === 'ONLINE' && v.status === 'Offline') return false;
      if (f.gpsStatus === 'OFFLINE' && v.status !== 'Offline') return false;

      // 7. Ignition
      if (f.ignition === 'ON' && !v.ignition) return false;
      if (f.ignition === 'OFF' && v.ignition) return false;

      // 8. Speed Range
      if (f.speedRange !== 'ALL') {
        if (f.speedRange === '0_20' && (v.speed < 0 || v.speed > 20)) return false;
        if (f.speedRange === '20_40' && (v.speed < 20 || v.speed > 40)) return false;
        if (f.speedRange === '40_60' && (v.speed < 40 || v.speed > 60)) return false;
        if (f.speedRange === '60_80' && (v.speed < 60 || v.speed > 80)) return false;
        if (f.speedRange === '80_PLUS' && v.speed <= 80) return false;
      }

      // 9. Alerts Only
      if (f.alertsOnly && !v.hasActiveAlert) return false;

      return true;
    });
  }

  /**
   * Compute live vehicle counter statistics
   */
  public getCounters(): LiveVehicleCounters {
    const all = Array.from(this.vehiclesMap.values());
    return {
      total: all.length,
      moving: all.filter((v) => v.status === 'Moving').length,
      stopped: all.filter((v) => v.status === 'Stopped').length,
      idle: all.filter((v) => v.status === 'Idle').length,
      offline: all.filter((v) => v.status === 'Offline').length,
      unknown: all.filter((v) => v.status === 'Unknown').length,
      hasAlerts: all.filter((v) => v.hasActiveAlert).length
    };
  }

  /**
   * Calculate clusters dynamically based on zoom & viewport coordinates
   */
  public calculateClusters(zoom: number): VehicleClusterData[] {
    if (zoom >= 13) return []; // Don't cluster when zoomed in

    const vehicles = this.getFilteredVehicles();
    const clusters: VehicleClusterData[] = [];
    const gridSize = zoom <= 8 ? 1.5 : zoom <= 10 ? 0.8 : 0.3; // Grid step in deg

    const gridMap: Map<string, MapVehicle[]> = new Map();

    vehicles.forEach((v) => {
      const gridX = Math.floor(v.longitude / gridSize);
      const gridY = Math.floor(v.latitude / gridSize);
      const key = `${gridX}_${gridY}`;

      if (!gridMap.has(key)) {
        gridMap.set(key, []);
      }
      gridMap.get(key)!.push(v);
    });

    let clusterIdx = 1;
    gridMap.forEach((gridVehicles) => {
      if (gridVehicles.length > 1) {
        const avgLat = gridVehicles.reduce((s, v) => s + v.latitude, 0) / gridVehicles.length;
        const avgLng = gridVehicles.reduce((s, v) => s + v.longitude, 0) / gridVehicles.length;

        const lats = gridVehicles.map((v) => v.latitude);
        const lngs = gridVehicles.map((v) => v.longitude);

        clusters.push({
          clusterId: `cluster_${clusterIdx++}`,
          center: [avgLat, avgLng],
          count: gridVehicles.length,
          vehicleIds: gridVehicles.map((v) => v.vehicleId),
          bounds: [
            [Math.min(...lats), Math.min(...lngs)],
            [Math.max(...lats), Math.max(...lngs)]
          ]
        });
      }
    });

    return clusters;
  }

  /**
   * Selection & Camera Follow Controls
   */
  public setSelectedVehicle(vehicleId: string | null): void {
    this.selectedVehicleId = vehicleId;
    if (vehicleId) {
      this.logAudit('vehicle.location.viewed', `Selected vehicle ID: ${vehicleId}`);
    }
  }

  public getSelectedVehicle(): MapVehicle | null {
    if (!this.selectedVehicleId) return null;
    return this.vehiclesMap.get(this.selectedVehicleId) || null;
  }

  public followVehicle(vehicleId: string): void {
    this.followingVehicleId = vehicleId;
    this.selectedVehicleId = vehicleId;
    this.logAudit('vehicle_follow.started', `Started camera follow for vehicle ID: ${vehicleId}`);
  }

  public stopFollowing(): void {
    if (this.followingVehicleId) {
      this.logAudit('vehicle_follow.stopped', `Stopped camera follow for vehicle ID: ${this.followingVehicleId}`);
    }
    this.followingVehicleId = null;
  }

  public getFollowingVehicleId(): string | null {
    return this.followingVehicleId;
  }

  /**
   * Manual Realtime Reconnect
   */
  public reconnect(): void {
    this.transportState = 'RECONNECTING';
    this.notifyConnectionSubscribers();

    setTimeout(() => {
      this.transportState = 'LIVE';
      this.notifyConnectionSubscribers();
      this.notifySubscribers();
    }, 1200);
  }

  public getTransportState(): RealtimeTransportState {
    return this.transportState;
  }

  /**
   * Update or Inject single telemetry packet manually (Simulator / API)
   */
  public updateSingleVehicleTelemetry(vehicleId: string, data: Partial<MapVehicle>): void {
    const existing = this.vehiclesMap.get(vehicleId);
    if (!existing) return;

    const updated: MapVehicle = {
      ...existing,
      ...data,
      lastSeenAt: new Date().toISOString()
    };

    this.vehiclesMap.set(vehicleId, updated);
    this.notifySubscribers();
  }

  private logAudit(action: string, details: string): void {
    this.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action,
      details
    });
  }

  public getAuditLogs(): AuditLogItem[] {
    return this.auditLogs;
  }
}

export const liveTrackingService = new LiveTrackingService();
