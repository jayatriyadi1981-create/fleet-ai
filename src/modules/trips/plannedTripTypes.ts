/**
 * Fleet Intelligence Smart AI - Planned Trip & Operational Trip Management Domain Types
 * PROMPT 15 — Operational Trip Planning, Status State Machine, Waypoints & ETA Engine
 */

export type PlannedTripStatus =
  | 'DRAFT'
  | 'PLANNED'
  | 'ASSIGNED'
  | 'READY'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'DELAYED'
  | 'CANCELLED'
  | 'FAILED';

export type TripPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type EtaSource = 'CALCULATED' | 'LIVE_TRAFFIC' | 'MANUAL' | 'AI_PREDICTED';

export type WaypointStatus = 'PENDING' | 'ARRIVING' | 'ARRIVED' | 'COMPLETED' | 'SKIPPED' | 'FAILED';

export interface LocationPoint {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPerson?: string;
  contactPhone?: string;
  notes?: string;
}

export interface TripWaypoint extends LocationPoint {
  id: string;
  tripId: string;
  sequence: number;
  plannedArrival?: string;
  plannedDeparture?: string;
  actualArrival?: string;
  actualDeparture?: string;
  status: WaypointStatus;
}

export interface PlannedRoute {
  polyline: Array<[number, number]>;
  distanceKm: number;
  estimatedDurationMinutes: number;
  routePoints?: any[];
}

export interface PlannedTrip {
  id: string;
  tenantId: string;
  tripNumber: string; // e.g. TRP-2026-000001
  referenceNumber?: string; // DO / Customer PO / Shipment #
  customerName?: string;
  cargoDescription?: string;
  cargoWeightKg?: number;
  vehicleId: string;
  vehiclePlate?: string;
  vehicleName?: string;
  driverId: string;
  driverName?: string;
  driverPhone?: string;
  dispatcherId?: string;
  dispatcherName?: string;

  origin: LocationPoint;
  destination: LocationPoint;
  waypoints: TripWaypoint[];

  plannedRoute: PlannedRoute;

  scheduledDate: string; // YYYY-MM-DD
  plannedEtd: string;    // ISO timestamp
  plannedEta: string;    // ISO timestamp
  currentEta: string;    // Live calculated ISO timestamp
  etaSource: EtaSource;
  manualEtaOverride?: boolean;

  actualStartTime?: string;
  actualEndTime?: string;

  status: PlannedTripStatus;
  priority: TripPriority;

  distanceKm: number;
  estimatedDurationMinutes: number;

  actualDistanceKm?: number;
  actualDurationMinutes?: number;

  notes?: string;

  actualTripId?: string; // Relationship link to actual telemetry trip in Trip History (Prompt 14)

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripAuditTimelineItem {
  id: string;
  tripId: string;
  action: string; // e.g. 'trip.created', 'trip.dispatched', 'trip.waypoint_arrived'
  timestamp: string;
  userId: string;
  userName: string;
  userRole?: string;
  beforeState?: string;
  afterState?: string;
  details?: string;
}

export interface TripConflict {
  type: 'VEHICLE_ASSIGNED' | 'DRIVER_ASSIGNED' | 'MAINTENANCE_SCHEDULED' | 'SHIFT_CONFLICT' | 'DUPLICATE';
  title: string;
  description: string;
  conflictingTripId?: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface PlannedVsActualComparison {
  tripId: string;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  distanceVarianceKm: number;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  durationVarianceMinutes: number;
  plannedEta: string;
  actualArrival: string;
  etaDelayMinutes: number;
  onTimeStatus: 'ON_TIME' | 'SLIGHT_DELAY' | 'SEVERE_DELAY' | 'EARLY';
}

export interface TripFilterState {
  searchQuery: string;
  datePreset: 'TODAY' | 'TOMORROW' | 'THIS_WEEK' | 'THIS_MONTH' | 'ALL';
  startDate?: string;
  endDate?: string;
  status: 'ALL' | PlannedTripStatus;
  priority: 'ALL' | TripPriority;
  vehicleId: string;
  driverId: string;
  branchId: string;
}

export interface TripAiEtaPrediction {
  predictedEta: string;
  delayRiskMinutes: number;
  confidencePercent: number; // e.g. 85%
  keyFactors: string[];
  suggestedRouteDeviation?: string;
}
