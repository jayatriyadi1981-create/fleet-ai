/**
 * Fleet Intelligence Smart AI - Map Provider Abstraction Types
 * PROMPT 13: Provider-Agnostic Realtime Live Tracking Map Engine
 */

export type MapStyle = 'default' | 'dark' | 'satellite' | 'terrain' | 'street' | 'light';

export type LiveVehicleStatus = 
  | 'Moving' 
  | 'Idle' 
  | 'Parking' 
  | 'Offline' 
  | 'Emergency' 
  | 'Maintenance' 
  | 'Stopped';

export type VehicleGroupType =
  | 'ALL'
  | 'Logistics & Cargo'
  | 'Heavy Duty'
  | 'Cold Chain (Reefer)'
  | 'Passenger & Shuttle'
  | 'Hazardous Material'
  | 'General Fleet';

export interface MapVehicle {
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  vehicleType: string;
  vehicleModel?: string;
  groupCategory?: VehicleGroupType | string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverScore?: number;
  driverLicense?: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  maxSpeedToday?: number;
  heading: number; // 0-359 deg
  cardinalDirection?: string;
  status: LiveVehicleStatus;
  ignition: boolean;
  engineStatus?: 'ON' | 'OFF' | 'IDLE';
  engineRpm?: number;
  gpsSignal: 'Excellent' | 'Good' | 'Weak' | 'No Fix' | 'Unknown';
  satelliteCount?: number;
  gnssLock?: string;
  accuracy?: number; // meters
  lastSeenAt: string; // ISO
  batteryVoltage?: number;
  batteryLevel?: number;
  externalVoltage?: number;
  fuelLevelPercent?: number;
  fuelLitersRemaining?: number;
  fuelTankCapacity?: number;
  fuelConsumptionRate?: number; // L/100km or L/h
  odometerKm?: number;
  tripKmToday?: number;
  cargoTemperature?: number | null; // e.g. -18.5 for cold-chain reefer
  engineTemperature?: number | null; // e.g. 88.0 for coolant
  address?: string;
  hasActiveAlert?: boolean;
  alertCategory?: string;
  alertMessage?: string;
  branchId?: string;
  branchName?: string;
  groupName?: string;
  deviceId?: string;
  imei?: string;
  activeRouteDestination?: {
    lat: number;
    lng: number;
    name: string;
    etaMinutes?: number;
    distanceRemainingKm?: number;
  };
  trailHistory?: Array<{ lat: number; lng: number; speed: number; timestamp: string }>;
}

export interface VehicleMarkerData {
  vehicleId: string;
  position: [number, number];
  heading: number;
  status: LiveVehicleStatus;
  selected: boolean;
  hasAlert: boolean;
}

export interface VehicleClusterData {
  clusterId: string;
  center: [number, number];
  count: number;
  vehicleIds: string[];
  bounds?: [[number, number], [number, number]];
}

export interface MapViewportBounds {
  northEast: [number, number];
  southWest: [number, number];
  zoom: number;
}

export interface MapProviderOptions {
  center?: [number, number];
  zoom?: number;
  style?: MapStyle;
  showTraffic?: boolean;
  onMapMove?: (bounds: MapViewportBounds) => void;
  onMapClick?: (latLng?: { lat: number; lng: number }) => void;
}

export interface DistanceMeasurePoint {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

export interface MapProvider {
  initialize(container: HTMLElement, options?: MapProviderOptions): void;
  setCenter(lat: number, lng: number, zoom?: number): void;
  setZoom(zoom: number): void;
  addMarker(vehicle: MapVehicle, onClick?: (vehicleId: string) => void): void;
  removeMarker(vehicleId: string): void;
  updateMarker(vehicle: MapVehicle): void;
  setSelectedMarker(vehicleId: string | null): void;
  setSelectedMarkers?(vehicleIds: string[]): void;
  fitBounds(points: Array<[number, number]>): void;
  setClusters(clusters: VehicleClusterData[], onClusterClick?: (cluster: VehicleClusterData) => void): void;
  drawPolyline(id: string, coords: Array<[number, number]>, color?: string, dashed?: boolean): void;
  clearPolyline(id: string): void;
  setTileStyle(style: MapStyle): void;
  toggleTraffic?(enable: boolean): void;
  destroy(): void;
}

