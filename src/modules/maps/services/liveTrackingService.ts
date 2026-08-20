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
  searchType?: 'ALL' | 'PLATE' | 'DRIVER' | 'LOCATION' | 'IMEI';
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
  idle: number;
  parking: number;
  offline: number;
  emergency: number;
  maintenance: number;
  stopped: number;
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
  private multiSelectedVehicleIds: Set<string> = new Set();
  private auditLogs: AuditLogItem[] = [];

  private filterState: LiveTrackingFilterState = {
    searchQuery: '',
    searchType: 'ALL',
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
   * Hydrate initial MapVehicle dataset from master models with full telematics
   */
  private initializeMasterData(): void {
    mockVehicles.forEach((v, idx) => {
      const driver = mockDrivers.find((d) => d.id === v.currentDriverId || d.assignedVehicleId === v.id);
      const gpsDevice = mockGpsDevices.find((g) => g.id === v.gpsDeviceId);
      const branch = mockBranches.find((b) => b.id === v.branchId);
      const activeAlert = mockAlerts.find((a) => a.vehicleId === v.id);

      // Map vehicle status to LiveVehicleStatus
      let liveStatus: LiveVehicleStatus = 'Moving';
      if (idx === 0) liveStatus = 'Moving';
      else if (idx === 1) liveStatus = 'Idle';
      else if (idx === 2) liveStatus = 'Parking';
      else if (idx === 3) liveStatus = 'Emergency';
      else if (idx === 4) liveStatus = 'Maintenance';
      else if (idx === 5) liveStatus = 'Offline';
      else if (v.status === 'moving') liveStatus = 'Moving';
      else if (v.status === 'idle') liveStatus = 'Idle';
      else if (v.status === 'parking') liveStatus = 'Parking';
      else if (v.status === 'maintenance') liveStatus = 'Maintenance';
      else if (v.status === 'offline') liveStatus = 'Offline';
      else liveStatus = 'Stopped';

      const speed = liveStatus === 'Moving' ? (v.latestTelemetry?.location.speed || 58) : 0;
      const heading = v.latestTelemetry?.location.heading || (idx * 45) % 360;
      const cardinalDirection = this.calculateCardinal(heading);

      // Group classification
      let groupCat = 'Logistics & Cargo';
      let isReefer = false;
      if (v.type?.includes('reefer') || v.model?.toLowerCase().includes('cold') || idx === 1) {
        groupCat = 'Cold Chain (Reefer)';
        isReefer = true;
      } else if (v.type?.includes('dump') || v.type?.includes('flatbed') || idx === 4) {
        groupCat = 'Heavy Duty';
      } else if (v.type?.includes('van') || v.type?.includes('passenger') || idx === 5) {
        groupCat = 'Passenger & Shuttle';
      } else if (idx === 3) {
        groupCat = 'Hazardous Material';
      }

      const fuelPercent = v.latestTelemetry?.fuelLevelPercent || Math.max(25, 95 - idx * 12);
      const tankCap = v.type?.includes('truck') ? 250 : 80;
      const fuelLiters = Math.round((fuelPercent / 100) * tankCap);

      const lat = v.latestTelemetry?.location.lat || (-6.200000 + (idx * 0.015 - 0.03));
      const lng = v.latestTelemetry?.location.lng || (106.816666 + (idx * 0.018 - 0.025));

      // Generate trail breadcrumbs
      const trailHistory = Array.from({ length: 12 }).map((_, i) => ({
        lat: lat - Math.cos((heading * Math.PI) / 180) * 0.0012 * (12 - i),
        lng: lng - Math.sin((heading * Math.PI) / 180) * 0.0012 * (12 - i),
        speed: Math.max(20, speed - (12 - i) * 2),
        timestamp: new Date(Date.now() - (12 - i) * 60000).toISOString()
      }));

      const mapVeh: MapVehicle = {
        vehicleId: v.id,
        vehiclePlate: v.plateNumber,
        vehicleName: `${v.brand} ${v.model}`,
        vehicleModel: v.model,
        vehicleType: v.type,
        groupCategory: groupCat,
        driverId: driver?.id,
        driverName: driver?.name || 'Driver Reguler',
        driverPhone: driver?.phone || '+62 812-3456-7890',
        driverPhoto: driver?.photoUrl,
        driverScore: driver?.score.overallScore || 94,
        driverLicense: 'BII Umum / Sim A',
        latitude: lat,
        longitude: lng,
        speed: speed,
        maxSpeedToday: Math.max(speed, 78),
        heading: heading,
        cardinalDirection: cardinalDirection,
        status: liveStatus,
        ignition: liveStatus === 'Moving' || liveStatus === 'Idle' || liveStatus === 'Emergency',
        engineStatus: liveStatus === 'Moving' ? 'ON' : liveStatus === 'Idle' ? 'IDLE' : 'OFF',
        engineRpm: liveStatus === 'Moving' ? 1850 : liveStatus === 'Idle' ? 750 : 0,
        gpsSignal: liveStatus === 'Offline' ? 'No Fix' : 'Excellent',
        satelliteCount: liveStatus === 'Offline' ? 0 : 14 + (idx % 5),
        gnssLock: liveStatus === 'Offline' ? 'Signal Lost' : '3D Fixed / DGPS Dual-Band',
        accuracy: liveStatus === 'Offline' ? 50 : 3.5,
        lastSeenAt: liveStatus === 'Offline' ? new Date(Date.now() - 3600000).toISOString() : new Date().toISOString(),
        batteryVoltage: 12.6 + (idx % 3) * 0.2,
        externalVoltage: 24.4,
        fuelLevelPercent: fuelPercent,
        fuelLitersRemaining: fuelLiters,
        fuelTankCapacity: tankCap,
        fuelConsumptionRate: liveStatus === 'Moving' ? 26.4 : liveStatus === 'Idle' ? 1.8 : 0,
        odometerKm: v.odometerKm || (112000 + idx * 8500),
        tripKmToday: 86.4 + idx * 14.2,
        cargoTemperature: isReefer ? -18.4 + (idx % 2) * 0.8 : null,
        engineTemperature: liveStatus === 'Offline' ? 28.0 : 88.5,
        address: v.latestTelemetry?.location.address || 'Kawasan Industri Pulogadung, Jakarta Timur',
        hasActiveAlert: liveStatus === 'Emergency' || !!activeAlert,
        alertCategory: liveStatus === 'Emergency' ? 'SOS / Panic Alarm' : activeAlert?.category,
        alertMessage: liveStatus === 'Emergency' ? 'Peringatan Darurat: Tombol SOS Ditekan Driver!' : activeAlert?.message,
        branchId: v.branchId,
        branchName: branch?.name || 'Hub Logistik Jabodetabek',
        groupName: v.groupName || groupCat,
        deviceId: gpsDevice?.id || `GPS-TRK-00${idx + 1}`,
        imei: gpsDevice?.imei || `86420104829100${idx + 1}`,
        activeRouteDestination: {
          lat: lat + 0.035,
          lng: lng + 0.045,
          name: 'Pusat Distribusi Logistik Cikarang Dry Port',
          etaMinutes: 38,
          distanceRemainingKm: 28.4
        },
        trailHistory: trailHistory
      };

      this.vehiclesMap.set(v.id, mapVeh);
    });
  }

  private calculateCardinal(heading: number): string {
    const norm = ((heading % 360) + 360) % 360;
    if (norm >= 337.5 || norm < 22.5) return 'Utara (N)';
    if (norm >= 22.5 && norm < 67.5) return 'Timur Laut (NE)';
    if (norm >= 67.5 && norm < 112.5) return 'Timur (E)';
    if (norm >= 112.5 && norm < 157.5) return 'Tenggara (SE)';
    if (norm >= 157.5 && norm < 202.5) return 'Selatan (S)';
    if (norm >= 202.5 && norm < 247.5) return 'Barat Daya (SW)';
    if (norm >= 247.5 && norm < 292.5) return 'Barat (W)';
    return 'Barat Laut (NW)';
  }

  /**
   * Start listening for real-time telemetry updates or simulated packets
   */
  private startRealtimeSimulation(): void {
    // Listen to GPS Simulator events
    gpsSimulator.subscribe((updatedVehicles) => {
      if (this.transportState !== 'LIVE') return;

      let changed = false;
      updatedVehicles.forEach((simVeh) => {
        const vehicle = this.vehiclesMap.get(simVeh.id);
        if (vehicle && simVeh.latestTelemetry) {
          let newStatus: LiveVehicleStatus = 'Moving';
          if (simVeh.status === 'parking') newStatus = 'Parking';
          else if (simVeh.status === 'maintenance') newStatus = 'Maintenance';
          else if (simVeh.status === 'idle') newStatus = 'Idle';
          else if (simVeh.status === 'offline') newStatus = 'Offline';

          const updated: MapVehicle = {
            ...vehicle,
            latitude: simVeh.latestTelemetry.location.lat,
            longitude: simVeh.latestTelemetry.location.lng,
            speed: simVeh.latestTelemetry.location.speed || 0,
            heading: simVeh.latestTelemetry.location.heading || vehicle.heading,
            cardinalDirection: this.calculateCardinal(simVeh.latestTelemetry.location.heading || vehicle.heading),
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
          const speedFactor = (veh.speed / 3600) * 0.01;
          const rad = (veh.heading * Math.PI) / 180;

          const deltaLat = Math.cos(rad) * speedFactor;
          const deltaLng = Math.sin(rad) * speedFactor;
          const newHeading = (veh.heading + (Math.random() * 4 - 2) + 360) % 360;

          // Update trail history
          const trail = veh.trailHistory || [];
          const newTrail = [
            ...trail.slice(-14),
            { lat: veh.latitude, lng: veh.longitude, speed: veh.speed, timestamp: new Date().toISOString() }
          ];

          this.vehiclesMap.set(id, {
            ...veh,
            latitude: veh.latitude + deltaLat,
            longitude: veh.longitude + deltaLng,
            heading: Math.round(newHeading),
            cardinalDirection: this.calculateCardinal(newHeading),
            lastSeenAt: new Date().toISOString(),
            trailHistory: newTrail
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
   * Multi-selection controls
   */
  public toggleVehicleSelection(vehicleId: string): void {
    if (this.multiSelectedVehicleIds.has(vehicleId)) {
      this.multiSelectedVehicleIds.delete(vehicleId);
    } else {
      this.multiSelectedVehicleIds.add(vehicleId);
    }
    this.notifySubscribers();
  }

  public selectAllFiltered(): void {
    const filtered = this.getFilteredVehicles();
    filtered.forEach((v) => this.multiSelectedVehicleIds.add(v.vehicleId));
    this.notifySubscribers();
  }

  public clearMultiSelection(): void {
    this.multiSelectedVehicleIds.clear();
    this.notifySubscribers();
  }

  public getMultiSelectedVehicleIds(): string[] {
    return Array.from(this.multiSelectedVehicleIds);
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
        const matchDriverPhone = v.driverPhone ? v.driverPhone.toLowerCase().includes(q) : false;
        const matchImei = v.imei ? v.imei.toLowerCase().includes(q) : false;
        const matchAddress = v.address ? v.address.toLowerCase().includes(q) : false;

        if (f.searchType === 'PLATE') {
          if (!matchPlate) return false;
        } else if (f.searchType === 'DRIVER') {
          if (!matchDriver && !matchDriverPhone) return false;
        } else if (f.searchType === 'LOCATION') {
          if (!matchAddress) return false;
        } else if (f.searchType === 'IMEI') {
          if (!matchImei && !matchId) return false;
        } else {
          if (!matchPlate && !matchName && !matchId && !matchDriver && !matchDriverPhone && !matchImei && !matchAddress) {
            return false;
          }
        }
      }

      // 2. Status Filter
      if (f.status !== 'ALL') {
        if (f.status === 'Stopped' && (v.status === 'Stopped' || v.status === 'Parking')) {
          // match stopped/parking
        } else if (v.status !== f.status) {
          return false;
        }
      }

      // 3. Group Filter
      if (f.group !== 'ALL') {
        const matchesGroup = v.groupCategory === f.group || v.groupName === f.group;
        if (!matchesGroup) return false;
      }

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
      idle: all.filter((v) => v.status === 'Idle').length,
      parking: all.filter((v) => v.status === 'Parking' || v.status === 'Stopped').length,
      offline: all.filter((v) => v.status === 'Offline').length,
      emergency: all.filter((v) => v.status === 'Emergency').length,
      maintenance: all.filter((v) => v.status === 'Maintenance').length,
      stopped: all.filter((v) => v.status === 'Stopped' || v.status === 'Parking').length,
      hasAlerts: all.filter((v) => v.hasActiveAlert || v.status === 'Emergency').length
    };
  }

  /**
   * Calculate clusters dynamically based on zoom & viewport coordinates
   */
  public calculateClusters(zoom: number): VehicleClusterData[] {
    if (zoom >= 13) return [];

    const vehicles = this.getFilteredVehicles();
    const clusters: VehicleClusterData[] = [];
    const gridSize = zoom <= 8 ? 1.5 : zoom <= 10 ? 0.8 : 0.3;

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

