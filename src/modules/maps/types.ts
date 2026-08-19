/**
 * Fleet Intelligence Smart AI - Map Provider Abstraction Types
 * PROMPT 13: Provider-Agnostic Realtime Live Tracking Map Engine
 */

export type MapStyle = 'default' | 'dark' | 'satellite' | 'light';

export type LiveVehicleStatus = 'Moving' | 'Stopped' | 'Idle' | 'Offline' | 'Unknown';

export interface MapVehicle {
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  vehicleType: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverScore?: number;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  heading: number; // 0-359 deg
  status: LiveVehicleStatus;
  ignition: boolean;
  gpsSignal: 'Excellent' | 'Good' | 'Weak' | 'No Fix' | 'Unknown';
  accuracy?: number; // meters
  lastSeenAt: string; // ISO
  batteryVoltage?: number;
  batteryLevel?: number;
  externalVoltage?: number;
  fuelLevelPercent?: number;
  odometerKm?: number;
  address?: string;
  hasActiveAlert?: boolean;
  alertCategory?: string;
  alertMessage?: string;
  branchId?: string;
  branchName?: string;
  groupName?: string;
  deviceId?: string;
  imei?: string;
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
  onMapMove?: (bounds: MapViewportBounds) => void;
  onMapClick?: () => void;
}

export interface MapProvider {
  initialize(container: HTMLElement, options?: MapProviderOptions): void;
  setCenter(lat: number, lng: number, zoom?: number): void;
  setZoom(zoom: number): void;
  addMarker(vehicle: MapVehicle, onClick?: (vehicleId: string) => void): void;
  removeMarker(vehicleId: string): void;
  updateMarker(vehicle: MapVehicle): void;
  setSelectedMarker(vehicleId: string | null): void;
  fitBounds(points: Array<[number, number]>): void;
  setClusters(clusters: VehicleClusterData[], onClusterClick?: (cluster: VehicleClusterData) => void): void;
  drawPolyline(id: string, coords: Array<[number, number]>, color?: string): void;
  clearPolyline(id: string): void;
  setTileStyle(style: MapStyle): void;
  destroy(): void;
}
