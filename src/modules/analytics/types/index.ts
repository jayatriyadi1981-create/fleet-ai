/**
 * Fleet Intelligence Smart AI - Fleet Analytics & Performance Intelligence Types
 * PROMPT 36
 */

export type AnalyticsTab =
  | 'dashboard'
  | 'fleet'
  | 'utilization'
  | 'productivity'
  | 'mileage'
  | 'trips'
  | 'idle'
  | 'downtime'
  | 'vehicles'
  | 'drivers'
  | 'branches'
  | 'trends'
  | 'ai-insights'
  | 'reports';

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'last_month'
  | 'last_30_days'
  | 'custom';

export type PeriodComparisonMode =
  | 'previous_period'
  | 'same_period_last_month'
  | 'same_period_last_year'
  | 'custom_period';

export type IndustryProfileType =
  | 'LOGISTICS'
  | 'DELIVERY'
  | 'RENTAL'
  | 'PASSENGER'
  | 'MINING'
  | 'CONSTRUCTION'
  | 'PLANTATION'
  | 'MANUFACTURING'
  | 'FIELD_SERVICE'
  | 'GOVERNMENT';

export type UtilizationFormulaType = 'TIME_BASED' | 'DISTANCE_BASED' | 'TRIP_BASED';

export type UnderutilizedStatus = 'HEALTHY' | 'UNDERUTILIZED' | 'CRITICAL_UNDERUTILIZED' | 'OVERUTILIZED';

export type IdleClassification =
  | 'TRAFFIC'
  | 'LOADING'
  | 'UNLOADING'
  | 'WAITING'
  | 'DRIVER_BREAK'
  | 'OPERATIONAL'
  | 'UNAUTHORIZED'
  | 'UNKNOWN';

export type DowntimeCategory =
  | 'MAINTENANCE'
  | 'MECHANICAL_FAILURE'
  | 'GPS_DEVICE'
  | 'ACCIDENT'
  | 'DRIVER_UNAVAILABLE'
  | 'ADMINISTRATIVE'
  | 'UNKNOWN';

export type AnomalySeverity = 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface GlobalAnalyticsFilter {
  datePreset: DateRangePreset;
  startDate: string;
  endDate: string;
  comparisonMode: PeriodComparisonMode;
  industryProfile: IndustryProfileType;
  tenantId: string;
  branchIds: string[];
  departmentIds: string[];
  vehicleGroupIds: string[];
  vehicleTypes: string[];
  vehicleIds: string[];
  driverIds: string[];
  routeIds: string[];
  customerIds: string[];
}

export interface MetricDelta {
  currentValue: number;
  previousValue: number;
  absoluteDiff: number;
  percentChange: number;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean; // whether "up" is desirable for this metric
}

export interface FleetKPIOverview {
  utilizationRate: MetricDelta;
  productivityScore: MetricDelta;
  totalMileageKm: MetricDelta;
  completedTripsCount: MetricDelta;
  activeVehiclesCount: MetricDelta;
  idleTimePercent: MetricDelta;
  downtimePercent: MetricDelta;
  avgTripDurationMinutes: MetricDelta;
  vehicleAvailabilityPercent: MetricDelta;
  onTimeDeliveryRate: MetricDelta;
  totalFuelLiters: MetricDelta;
  totalEstimatedIdleCostIdr: MetricDelta;
  mttrHours: MetricDelta;
  mtbfHours: MetricDelta;
}

export interface VehicleUtilizationMetric {
  vehicleId: string;
  plateNumber: string;
  model: string;
  type: string;
  branchName: string;
  department: string;
  totalAvailableHours: number;
  operatingHours: number;
  idleHours: number;
  downtimeHours: number;
  offlineHours: number;
  utilizationRate: number; // percentage
  status: UnderutilizedStatus;
  mileageKm: number;
  tripCount: number;
  productivityScore: number;
  rank: number;
  primaryAssignedDriver?: string;
  lastActiveTimestamp: string;
}

export interface ProductivityWeightConfig {
  utilizationWeight: number; // e.g. 0.30
  tripCompletionWeight: number; // e.g. 0.20
  onTimeWeight: number; // e.g. 0.20
  idleWeight: number; // e.g. 0.10
  downtimeWeight: number; // e.g. 0.10
  availabilityWeight: number; // e.g. 0.10
}

export interface MileageReconciliationRecord {
  id: string;
  vehicleId: string;
  plateNumber: string;
  date: string;
  gpsDistanceKm: number;
  tripDistanceKm: number;
  vehicleOdometerKm: number;
  gpsOdometerKm: number;
  differenceKm: number;
  percentDiscrepancy: number;
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'FLAGGED_ANOMALY';
  confidenceScore: number; // 0-1
  source: 'GPS_TELTONIKA' | 'CANBUS_ODOMETER' | 'TRIP_WAYPOINTS' | 'QUECLINK_GATEWAY';
  lastUpdated: string;
}

export interface TripPerformanceMetric {
  tripId: string;
  tripCode: string;
  vehicleId: string;
  plateNumber: string;
  driverId: string;
  driverName: string;
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  status: 'COMPLETED' | 'CANCELLED' | 'DELAYED' | 'IN_PROGRESS' | 'FAILED';
  plannedDistanceKm: number;
  actualDistanceKm: number;
  distanceVarianceKm: number;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  durationVarianceMinutes: number;
  plannedEta: string;
  actualArrival: string;
  etaVarianceMinutes: number;
  onTime: boolean;
  idleDurationMinutes: number;
  efficiencyScore: number; // 0-100
  fuelConsumedLiters: number;
}

export interface IdleEventMetric {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  locationName: string;
  coordinates: [number, number];
  startTime: string;
  endTime: string;
  durationMinutes: number;
  classification: IdleClassification;
  estimatedFuelLiters: number;
  estimatedCostIdr: number;
  speed: number;
  engineOn: boolean;
  notes?: string;
}

export interface DowntimeEventMetric {
  id: string;
  vehicleId: string;
  plateNumber: string;
  startTime: string;
  endTime?: string;
  durationHours: number;
  category: DowntimeCategory;
  primaryCause: string;
  workOrderId?: string;
  costEstimatedIdr: number;
  resolved: boolean;
  technicianName?: string;
  branchName: string;
}

export interface BranchPerformanceMatrix {
  branchId: string;
  branchName: string;
  totalVehicles: number;
  activeVehicles: number;
  utilizationRate: number;
  productivityScore: number;
  totalMileageKm: number;
  totalTrips: number;
  completedTrips: number;
  idleTimePercent: number;
  idlePercent?: number;
  downtimePercent: number;
  availabilityRate: number;
  fleetAvailabilityPercent?: number;
  onTimeDeliveryRate: number;
  totalOperatingCostIdr: number;
  efficiencyRank: number;
}

export interface DriverProductivityMetric {
  driverId: string;
  driverName: string;
  avatarUrl?: string;
  employeeCode: string;
  branchName: string;
  totalTrips: number;
  completedTrips: number;
  totalDistanceKm: number;
  totalMileageKm?: number;
  drivingHours: number;
  idleHours: number;
  onTimeRate: number; // percentage
  onTimeDeliveryRate?: number;
  safetyScore: number; // 0-100
  fatigueRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  productivityScore: number; // 0-100
  rank: number;
}

export interface CustomKPIConfig {
  id: string;
  name: string;
  code?: string;
  description: string;
  formulaExpression: string; // e.g. "totalMileageKm / totalFuelLiters"
  unit?: string; // e.g. "km/L", "Rp/km", "trips/day"
  targetValue?: number;
  currentValue?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  category?: 'UTILIZATION' | 'PRODUCTIVITY' | 'COST' | 'EFFICIENCY';
  isPositiveDirection?: boolean; // higher is better
  createdBy: string;
  createdAt: string;
}

export type CustomKpiDefinition = CustomKPIConfig;

export interface AnalyticsAIInsight {
  id: string;
  title: string;
  category: 'UTILIZATION' | 'PRODUCTIVITY' | 'IDLE' | 'DOWNTIME' | 'MILEAGE' | 'COST';
  severity: AnomalySeverity | 'OPPORTUNITY' | 'WARNING';
  headline: string;
  description?: string;
  evidence: string[];
  metricsInvolved: Record<string, number | string>;
  possibleCause: string;
  rootCause?: string;
  detectedMetric?: {
    label?: string;
    value?: string | number;
    currentValue?: string | number;
    baseline?: string | number;
    benchmarkValue?: string | number;
    unit?: string;
  };
  financialImpactEstimate?: number | string;
  actionRecommendation?: string;
  recommendations: Array<{
    text: string;
    expectedImpact: string;
    actionType?: string;
    targetEntityId?: string;
  }>;
  confidenceScore: number; // e.g. 0.92
  isSimulated?: boolean;
  generatedAt: string;
  acknowledged: boolean;
}

export type AnalyticsInsight = AnalyticsAIInsight;
export type InsightSeverity = AnomalySeverity | 'OPPORTUNITY' | 'WARNING';

export interface WhatIfScenarioInput {
  scenarioName: string;
  sourceBranchId?: string;
  targetBranchId?: string;
  vehiclesCountToReallocate?: number;
  targetedVehicleIds?: string[];
  expectedDemandIncreasePercent?: number;
  maintenanceCapacityAdjustmentPercent?: number;
  fleetSizeDelta?: number;
  shiftHoursDelta?: number;
  idleReductionPercent?: number;
  demandSurgePercent?: number;
}

export type WhatIfInputScenario = WhatIfScenarioInput;

export interface WhatIfScenarioResult {
  scenarioId: string;
  scenarioName: string;
  baselineUtilization: number;
  projectedUtilization: number;
  predictedUtilizationRate?: number;
  predictedProductivityScore?: number;
  baselineTrips: number;
  projectedTrips: number;
  baselineMileageKm: number;
  projectedMileageKm: number;
  baselineDowntimeHours: number;
  projectedDowntimeHours: number;
  estimatedMonthlySavingsIdr: number;
  estimatedMonthlyFuelCostDeltaIdr?: number;
  estimatedRevenueImpactIdr?: number;
  aiAdvice?: string[] | string;
  confidenceLevel: number;
  simulationNotes: string;
}

export type WhatIfSimulationResult = WhatIfScenarioResult;

export interface DailyBriefingData {
  date: string;
  greetingTitle: string;
  summaryMetrics: {
    activeVehicles: number;
    inMaintenanceVehicles: number;
    highRiskDrivers: number;
    unusualIdleVehicles: number;
    maintenanceRisks: number;
    fleetUtilization: number;
  };
  topRecommendations: string[];
  operationalNotice?: string;
}

export interface AnalyticsSnapshot {
  date: string;
  tenantId: string;
  branchId?: string;
  utilizationRate: number;
  productivityScore: number;
  mileageKm: number;
  tripsCount: number;
  idlePercent: number;
  idleHours?: number;
  downtimePercent: number;
  availabilityPercent: number;
  totalCostIdr: number;
  activeCount: number;
  idleCount: number;
  maintenanceCount: number;
  offlineCount: number;
}

export interface AnalyticsAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'VIEWED' | 'FILTER_APPLIED' | 'REPORT_GENERATED' | 'REPORT_EXPORTED' | 'CUSTOM_KPI_CREATED' | 'CUSTOM_KPI_UPDATED' | 'AI_INSIGHT_TRIGGERED' | 'WHAT_IF_EXECUTED';
  details: string;
  ipAddress?: string;
}
