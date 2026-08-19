/**
 * Fleet Intelligence Smart AI - AI Route Intelligence Types
 * Unifies live tracking, route optimization, ETA prediction, traffic intelligence,
 * route deviation detection, historical analysis, multi-stop delivery, and cross-module correlations.
 */

export type RouteStatus = 'ON_ROUTE' | 'DELAYED' | 'DEVIATED' | 'RECOVERED' | 'COMPLETED' | 'CANCELLED';
export type ETADelayRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type TrafficStatus = 'FREE' | 'LIGHT' | 'MODERATE' | 'HEAVY' | 'SEVERE' | 'UNKNOWN';
export type PredictionQuality = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';
export type OptimizationObjective = 'FASTEST' | 'SHORTEST' | 'LOWEST_FUEL' | 'LOWEST_COST' | 'SAFEST' | 'BALANCED';
export type RouteReliabilityCategory = 'HIGHLY_RELIABLE' | 'RELIABLE' | 'MODERATE' | 'UNRELIABLE' | 'HIGHLY_UNRELIABLE';
export type DeviationStatus = 'ACTIVE' | 'RECOVERED' | 'ACKNOWLEDGED' | 'RESOLVED';
export type DeviationReasonCategory = 
  | 'ROAD_CLOSURE'
  | 'TRAFFIC_AVOIDANCE'
  | 'WRONG_TURN'
  | 'UNAUTHORIZED_STOP'
  | 'TEMPORARY_DETOUR'
  | 'UNKNOWN';

export type RouteIntelligenceTabKey = 
  | 'OVERVIEW'
  | 'ACTIVE_TRIPS'
  | 'OPTIMIZATION'
  | 'TRAFFIC'
  | 'DEVIATIONS'
  | 'HISTORICAL'
  | 'DELIVERY_ROUTE'
  | 'CROSS_INTELLIGENCE'
  | 'AI_ADVISOR'
  | 'REPORTS';

export interface RouteCoordinates {
  lat: number;
  lng: number;
  address?: string;
  name?: string;
}

export interface RouteWayPoint extends RouteCoordinates {
  id: string;
  order: number;
  reached?: boolean;
  reachedAt?: string;
  estimatedArrival?: string;
}

export interface VehicleRestrictionInfo {
  maxHeightMeters?: number;
  maxWidthMeters?: number;
  maxWeightTons?: number;
  maxLengthMeters?: number;
  truckClass?: string;
  hasHazardousCargo?: boolean;
  roadRestrictionsApplied?: string[];
  restrictionDataAvailable: boolean;
}

export interface OptimizationWeights {
  timeWeight: number;      // e.g. 0.40
  distanceWeight: number;  // e.g. 0.20
  fuelWeight: number;      // e.g. 0.25
  riskWeight: number;      // e.g. 0.15
  tollWeight?: number;
}

export interface AlternativeRouteOption {
  id: string;
  label: string; // "Route A (Recommended)", "Route B (Alternative Toll)", etc.
  distanceKm: number;
  durationMinutes: number;
  eta: string;
  trafficCondition: TrafficStatus;
  estimatedFuelLiters: number;
  estimatedTollCostIdr: number;
  totalCostEstimatedIdr: number;
  riskScore: number; // 0-100 (lower is safer)
  historicalReliability: RouteReliabilityCategory;
  highlights: string[];
  tradeOffs: string;
  isRecommended: boolean;
  whyRecommended?: string;
  pathCoordinates: RouteCoordinates[];
}

export interface ActiveTripRouteItem {
  tripId: string;
  tripNumber: string;
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  driverId: string;
  driverName: string;
  branch: string;
  origin: string;
  destination: string;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  remainingDistanceKm: number;
  currentSpeedKmh: number;
  heading: number;
  currentLocation: RouteCoordinates;
  departureTime: string;
  scheduledArrival: string;
  predictedETA: string;
  etaRange: string; // e.g. "14:38 - 14:47"
  previousETA: string;
  etaChangeMinutes: number;
  etaChangeFactors: string[];
  delayRisk: ETADelayRisk;
  trafficStatus: TrafficStatus;
  trafficDelayMinutes: number;
  routeStatus: RouteStatus;
  routeComplianceScore: number; // 0-100
  currentWaypointIndex: number;
  totalWaypoints: number;
  waypoints: RouteWayPoint[];
  activeDeviation?: RouteDeviationEvent;
  dataQuality: PredictionQuality;
  modelVersion: string;
  fuelEstimatedLiters: number;
  fuelConsumedLiters: number;
  plannedPath: RouteCoordinates[];
  actualPath: RouteCoordinates[];
  maintenanceRiskLevel?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface RouteDeviationEvent {
  id: string;
  tripId: string;
  tripNumber: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  branch: string;
  timestamp: string;
  plannedLocation: RouteCoordinates;
  actualLocation: RouteCoordinates;
  distanceFromRouteMeters: number;
  corridorThresholdMeters: number;
  durationMinutes: number;
  status: DeviationStatus;
  aiReasonCategory: DeviationReasonCategory;
  aiReasonExplanation: string;
  evidence: string[];
  recoveryTime?: string;
}

export interface RouteBottleneckItem {
  id: string;
  locationLabel: string;
  kmMarker?: string;
  coordinates: RouteCoordinates;
  averageDelayMinutes: number;
  affectedTripsCount: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
  dominantCause: string;
  recommendedAction: string;
}

export interface HistoricalRouteItem {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  totalTripsAnalyzed: number;
  avgDistanceKm: number;
  avgDurationMinutes: number;
  avgDelayMinutes: number;
  onTimeRatePercentage: number;
  deviationRatePercentage: number;
  fuelConsumptionAvgLiters: number;
  fuelPerKm: number;
  routePerformanceScore: number; // 0-100
  reliabilityCategory: RouteReliabilityCategory;
  bottlenecks: RouteBottleneckItem[];
  hourlyTimeProfile: { hour: string; avgDurationMinutes: number; trafficLevel: TrafficStatus }[];
  dayOfWeekIntelligence: { day: string; avgDelayMinutes: number; delayFrequency: 'LOW' | 'MEDIUM' | 'HIGH' }[];
  dataQuality: PredictionQuality;
}

export interface DeliveryStopItem {
  orderId: string;
  customerName: string;
  address: string;
  coordinates: RouteCoordinates;
  timeWindow: { start: string; end: string };
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
  sequence: number;
  predictedETA: string;
  windowRisk: 'LOW' | 'MODERATE' | 'HIGH';
  onTimeProbabilityPercentage: number;
  status: 'PENDING' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export interface DeliveryOptimizationPlan {
  planId: string;
  manifestNumber: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  branch: string;
  stops: DeliveryStopItem[];
  totalStops: number;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  objectiveUsed: OptimizationObjective;
  status: 'OPTIMIZED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TrafficIntelligenceSegment {
  segmentId: string;
  roadName: string;
  city: string;
  coordinates: RouteCoordinates[];
  currentSpeedKmh: number;
  freeFlowSpeedKmh: number;
  trafficStatus: TrafficStatus;
  delayMinutes: number;
  delayPercentage: number;
  historicalTrend: string;
  bottleneckImpact: string;
  peakHours: string;
}

export interface AIRouteRecommendation {
  id: string;
  category: 'OPTIMIZATION' | 'TRAFFIC_REROUTE' | 'DEVIATION_ALERT' | 'MAINTENANCE_ADVISORY' | 'DELIVERY_SEQUENCING';
  title: string;
  description: string;
  vehicleId?: string;
  plateNumber?: string;
  driverName?: string;
  tripId?: string;
  tripNumber?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  type?: string;
  estimatedTimeSavingsMin?: number;
  estimatedFuelSavingsLiter?: number;
  why: string;
  evidence: string[];
  tradeOffs: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  dataQuality: PredictionQuality;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'APPLIED';
  suggestedAction: string;
  timestamp: string;
}

export interface RouteIntelligenceKPIs {
  activeTripsCount: number;
  etaRiskCount: number;
  activeDeviationsCount: number;
  routeEfficiencyScore: number;
  averageEtaAccuracy: number;
  delayedTripsCount: number;
  routeComplianceScore: number;
  averageDelayMinutes: number;
  onTimeRate: number;
  trafficImpactMinutes: number;
  fuelEfficiencyIndex: number;
}

export interface RouteFilterState {
  search: string;
  branch: string;
  vehicleType: string;
  routeStatus: string;
  trafficStatus: string;
  etaRisk: string;
  deviationStatus: string;
  dateRange: 'TODAY' | 'YESTERDAY' | '7_DAYS' | '30_DAYS' | '90_DAYS' | 'THIS_MONTH' | 'CUSTOM';
}
