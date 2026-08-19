/**
 * Fleet Intelligence Smart AI - Trip History & Route Playback Domain Types
 * PROMPT 14 — Enterprise Telematics Trip Engine Specifications
 */

export type TripStatus = 'ACTIVE' | 'COMPLETED' | 'INCOMPLETE' | 'CANCELLED' | 'UNKNOWN';

export type TripSegmentType = 'MOVING' | 'STOPPED' | 'IDLE';

export interface TripPoint {
  id: string;
  tripId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  ignition: boolean;
  accuracy?: number;
  odometer?: number;
  fuelLevel?: number;
  status: 'Moving' | 'Stopped' | 'Idle' | 'Offline';
  isSuspicious?: boolean; // GPS anomaly / speed jump flag
  isGapPoint?: boolean;   // GPS gap boundary flag
}

export interface TripSegment {
  id: string;
  tripId: string;
  sequence: number;
  startTime: string;
  endTime: string;
  distanceKm: number;
  durationSeconds: number;
  type: TripSegmentType;
  startLocation: { lat: number; lng: number; address?: string };
  endLocation: { lat: number; lng: number; address?: string };
}

export interface TripEvent {
  id: string;
  tripId: string;
  timestamp: string;
  type: 'speeding' | 'harsh_brake' | 'harsh_acceleration' | 'harsh_cornering' | 'idle' | 'stop' | 'tamper';
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  message: string;
  details?: string;
}

export interface TripStopDetail {
  id: string;
  location: { lat: number; lng: number; address?: string };
  stopStart: string;
  stopEnd: string;
  durationSeconds: number;
}

export interface TripIdleDetail {
  id: string;
  location: { lat: number; lng: number; address?: string };
  idleStart: string;
  idleEnd: string;
  durationSeconds: number;
}

export interface TripGapsDetail {
  startTime: string;
  endTime: string;
  durationSeconds: number;
}

export interface DetailedTrip {
  id: string;
  tenantId: string;
  vehicleId: string;
  driverId?: string;
  deviceId?: string;
  tripNumber: string;
  vehiclePlate: string;
  vehicleName: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  startTime: string;
  endTime?: string;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  startAddress: string;
  endAddress: string;
  distanceKm: number; // GPS calculated distance
  odometerDistanceKm?: number;
  startOdometerKm?: number;
  endOdometerKm?: number;
  durationSeconds: number; // Total trip duration
  movingDurationSeconds: number;
  stoppedDurationSeconds: number;
  idleDurationSeconds: number;
  averageSpeedKmH: number; // distance / movingDuration
  overallAverageSpeedKmH: number; // distance / total duration
  maxSpeedKmH: number;
  maxSpeedAt?: string;
  maxSpeedLocation?: { lat: number; lng: number; address?: string };
  stopsCount: number;
  idleCount: number;
  eventsCount: number;
  status: TripStatus;
  startFuelPercent?: number;
  endFuelPercent?: number;
  fuelConsumedLiters?: number;
  createdAt: string;
  updatedAt: string;
  branchId?: string;
  branchName?: string;
  groupName?: string;
}

export interface TripRoute {
  tripId: string;
  points: TripPoint[];
  distanceKm: number;
  startPoint: TripPoint;
  endPoint: TripPoint;
  segments: TripSegment[];
  events: TripEvent[];
  stops: TripStopDetail[];
  idles: TripIdleDetail[];
  gaps: TripGapsDetail[];
}

export interface TripFilterState {
  searchQuery: string;
  datePreset: 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';
  startDate: string;
  endDate: string;
  vehicleId: string;
  driverId: string;
  branchId: string;
  groupName: string;
  status: 'ALL' | TripStatus;
  minDistanceKm?: number;
  maxDistanceKm?: number;
}

export interface TripAnomaly {
  id: string;
  tripId: string;
  type: 'gps_jump' | 'unusual_stop' | 'excessive_idle' | 'abnormal_speed' | 'gps_gap' | 'route_deviation';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  timestamp: string;
  location?: { lat: number; lng: number };
}

export interface TripAISummary {
  tripId: string;
  executiveSummary: string;
  efficiencyScore: number; // 0 - 100
  driverSafetyScore: number; // 0 - 100
  fuelEfficiencyKmL: number;
  detectedAnomalies: TripAnomaly[];
  recommendations: string[];
}
