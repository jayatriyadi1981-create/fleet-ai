/**
 * Fleet Intelligence Smart AI - Route Management Domain Types
 * PROMPT 16 — Master Route Planning, Optimization, Restrictions, Versioning & Deviation Engine
 */

import { LocationPoint } from '../trips/plannedTripTypes';

export type RouteStatus = 'DRAFT' | 'PLANNED' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type RouteOptimizationStatus = 'NOT_OPTIMIZED' | 'OPTIMIZED' | 'PARTIALLY_OPTIMIZED';

export type RouteType = 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_STOP' | 'RECURRING' | 'CUSTOM';

export type RoutePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type WaypointType =
  | 'DELIVERY'
  | 'PICKUP'
  | 'REST'
  | 'FUEL'
  | 'CHECKPOINT'
  | 'DEPOT'
  | 'CUSTOMER'
  | 'OTHER';

export type RestrictionType =
  | 'WEIGHT_LIMIT'
  | 'HEIGHT_LIMIT'
  | 'WIDTH_LIMIT'
  | 'ROAD_CLOSED'
  | 'TIME_RESTRICTION'
  | 'TRUCK_RESTRICTION'
  | 'TOLL'
  | 'CUSTOM';

export type OptimizationObjective =
  | 'Shortest Distance'
  | 'Fastest Time'
  | 'Lowest Fuel Consumption'
  | 'Lowest Cost'
  | 'Balanced';

export type DeviationSeverity = 'NORMAL' | 'WARNING' | 'DEVIATED' | 'CRITICAL' | 'RESOLVED';

export type ETARisk = 'ON_TIME' | 'AT_RISK' | 'DELAYED' | 'SEVERELY_DELAYED';

export type RouteChangeReason =
  | 'TRAFFIC'
  | 'ROAD_CLOSED'
  | 'ACCIDENT'
  | 'WEATHER'
  | 'VEHICLE_RESTRICTION'
  | 'DRIVER_REQUEST'
  | 'DISPATCHER_REQUEST'
  | 'AI_RECOMMENDATION'
  | 'OTHER';

export interface RouteWaypoint extends LocationPoint {
  id: string;
  routeId: string;
  sequence: number;
  stopDurationMinutes: number;
  type: WaypointType;
  plannedArrival?: string;
  plannedDeparture?: string;
  notes?: string;
}

export interface RouteRestriction {
  id: string;
  name: string;
  type: RestrictionType;
  description: string;
  latitude: number;
  longitude: number;
  geometry?: Array<[number, number]>;
  active: boolean;
  limitValue?: number; // e.g. 10 for 10 Tons, 3.8 for 3.8 Meters
  unit?: string; // 'Ton', 'm', 'km/h'
  timeWindow?: {
    start: string; // e.g. "06:00"
    end: string;   // e.g. "09:00"
  };
}

export interface AlternativeRoute {
  id: string;
  name: string; // e.g. "Route B - Trans Jawa via Subang"
  distanceKm: number;
  estimatedDurationMinutes: number;
  tollCostIdr: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  polyline: Array<[number, number]>;
  score: number; // 0-100
  keyDiff: string; // e.g. "Lebih cepat 15 mnt, +Rp15.000 tol"
  recommended?: boolean;
}

export interface VehicleRestrictionConfig {
  maxWeightTon?: number; // Maximum payload/vehicle weight allowed
  maxHeightMeters?: number;
  maxWidthMeters?: number;
  maxAxles?: number;
  allowTolls?: boolean;
  allowHighways?: boolean;
  allowFerries?: boolean;
  allowUnpaved?: boolean;
}

export interface RouteVersion {
  id: string;
  routeId: string;
  version: number;
  origin: LocationPoint;
  destination: LocationPoint;
  waypoints: RouteWaypoint[];
  polyline: Array<[number, number]>;
  distanceKm: number;
  durationMinutes: number;
  optimizationData?: {
    objective: OptimizationObjective;
    savingsDistanceKm?: number;
    savingsDurationMinutes?: number;
    savingsCostIdr?: number;
  };
  createdBy: string;
  createdAt: string;
  notes?: string;
}

export interface Route {
  id: string;
  tenantId: string;
  routeCode: string; // e.g. RT-2026-000001
  name: string;
  description: string;

  origin: LocationPoint;
  destination: LocationPoint;
  waypoints: RouteWaypoint[];

  plannedPolyline: Array<[number, number]>;
  optimizedPolyline?: Array<[number, number]>;
  alternativeRoutes: AlternativeRoute[];

  distanceKm: number;
  estimatedDurationMinutes: number;

  status: RouteStatus;
  optimizationStatus: RouteOptimizationStatus;

  routeType: RouteType;
  priority: RoutePriority;

  restrictions: RouteRestriction[];
  vehicleRestrictions?: VehicleRestrictionConfig;

  currentVersion: number;
  activeTripsCount?: number;
  deviationCount?: number;

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RouteDeviation {
  id: string;
  tripId: string;
  vehicleId: string;
  routeId: string;
  routeCode?: string;
  vehiclePlate?: string;
  driverName?: string;
  latitude: number;
  longitude: number;
  deviationDistanceMeters: number;
  severity: DeviationSeverity;
  timestamp: string;
  deviationStart?: string;
  deviationEnd?: string;
  deviationDurationMinutes?: number;
  maxDeviationMeters?: number;
  status: 'ACTIVE' | 'RESOLVED';
  resolvedAt?: string;
}

export interface TripRouteRevision {
  id: string;
  tripId: string;
  oldRouteVersionId: string;
  newRouteVersionId: string;
  reason: RouteChangeReason;
  customReasonDetails?: string;
  changedBy: string;
  changedAt: string;
}

export interface RouteFilterState {
  searchQuery: string;
  status: 'ALL' | RouteStatus;
  routeType: 'ALL' | RouteType;
  optimizationStatus: 'ALL' | RouteOptimizationStatus;
  hasDeviation: boolean;
  priority: 'ALL' | RoutePriority;
}

export interface RouteTemplate {
  id: string;
  tenantId: string;
  name: string;
  routeId: string;
  frequency: 'Daily' | 'Weekdays' | 'Weekly' | 'Custom';
  scheduledTime?: string;
  active: boolean;
  createdAt: string;
}

export interface RoutePerformanceMetrics {
  routeId: string;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  distanceVarianceKm: number;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  durationVarianceMinutes: number;
  averageDelayMinutes: number;
  deviationCount: number;
  fuelConsumedLiters?: number;
  routeEfficiencyScore: number; // 0-100
  totalTripsCompleted: number;
}
