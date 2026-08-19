/**
 * Fleet Intelligence Smart AI - AI Fuel Intelligence Data Types
 * PROMPT 30 Architecture
 */

import { FuelType, FuelDataSource, FuelConfidence } from '../../fuel/types';

export type FuelPeriodPreset = 'TODAY' | 'YESTERDAY' | '7_DAYS' | '30_DAYS' | '90_DAYS' | 'THIS_MONTH' | 'PREVIOUS_MONTH' | 'CUSTOM';

export type FuelTrendDirection = 'IMPROVING' | 'STABLE' | 'INCREASING' | 'DECREASING' | 'VOLATILE';

export type FuelTheftRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FuelAnomalySeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type FuelPredictionQuality = 'HIGH' | 'MEDIUM' | 'LIMITED' | 'INSUFFICIENT_DATA';

export type AnomalyInvestigationStatus = 'NEW' | 'UNDER_REVIEW' | 'VERIFIED' | 'FALSE_POSITIVE' | 'RESOLVED';

export interface FuelFilterState {
  period: FuelPeriodPreset;
  startDate?: string;
  endDate?: string;
  branchId: string;
  vehicleGroupId: string;
  vehicleId: string;
  driverId: string;
  routeId: string;
  geofenceId: string;
  fuelType: string;
  minTripsThreshold: number;
}

export interface FuelOverviewKPIs {
  avgConsumptionL100Km: number;
  avgConsumptionKmL: number;
  avgConsumptionLPerHour: number;
  fuelEfficiencyScore: number; // 0 - 100
  totalFuelCostIdr: number;
  costPerKmIdr: number;
  totalFuelConsumedLiters: number;
  totalDistanceKm: number;
  fuelRiskLevel: FuelTheftRiskLevel;
  totalAnomaliesCount: number;
  potentialTheftIndicatorsCount: number;
  drainEventsCount: number;
  refuelingEventsCount: number;
  estimatedFuelWasteLiters: number;
  estimatedFuelWasteIdr: number;
  dataQualityScore: number; // 0 - 100
}

export interface VehicleFuelBaseline {
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  vehicleClass: string;
  fuelType: FuelType;
  normalConsumptionL100Km: number;
  normalRangeMinL100Km: number;
  normalRangeMaxL100Km: number;
  historicalAverageL100Km: number;
  bestPerformanceL100Km: number;
  worstPerformanceL100Km: number;
  currentConsumptionL100Km: number;
  deviationPercentage: number;
  typeBaselineL100Km: number;
  efficiencyScore: number;
  totalTrips: number;
  totalDistanceKm: number;
}

export interface FuelConsumptionMetric {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  routeName?: string;
  timestamp: string;
  distanceKm: number;
  fuelConsumedLiters: number;
  consumptionL100Km: number;
  consumptionKmL: number;
  consumptionLPerHour: number;
  engineHours: number;
  expectedL100Km: number;
  variancePercentage: number;
  fuelCostIdr: number;
  costPerKmIdr: number;
  dataSource: FuelDataSource;
  confidence: FuelConfidence;
}

export interface FuelEfficiencyFactor {
  name: string;
  score: number; // 0 - 100
  weight: number; // e.g. 0.25
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  description: string;
}

export interface FuelEfficiencyDetail {
  overallScore: number; // 0 - 100
  category: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' | 'CRITICAL';
  factors: {
    consumptionBaseline: FuelEfficiencyFactor;
    drivingBehavior: FuelEfficiencyFactor;
    idlingImpact: FuelEfficiencyFactor;
    routeProfile: FuelEfficiencyFactor;
    vehicleMaintenance: FuelEfficiencyFactor;
    loadUtilization: FuelEfficiencyFactor;
  };
  summary: string;
}

export interface FuelAnomalyItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  timestamp: string;
  anomalyType: 
    | 'UNEXPECTED_FUEL_DROP'
    | 'UNEXPECTED_FUEL_INCREASE'
    | 'ABNORMAL_CONSUMPTION'
    | 'FUEL_SENSOR_SPIKE'
    | 'FUEL_SENSOR_DROP'
    | 'SENSOR_FLATLINE'
    | 'REFUELING_MISMATCH'
    | 'CONSUMPTION_OUTLIER'
    | 'REPEATED_FUEL_LOSS';
  anomalyScore: number; // 0 - 100
  severity: FuelAnomalySeverity;
  fuelLevelBefore: number; // % or L
  fuelLevelAfter: number;
  fuelDifferenceLiters: number;
  fuelDifferencePercentage: number;
  durationMinutes: number;
  distanceTravelledKm: number;
  ignitionStatus: boolean;
  speedKmH: number;
  latitude: number;
  longitude: number;
  locationName: string;
  insideGeofence: boolean;
  geofenceName?: string;
  evidenceQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceDescription: string;
  status: AnomalyInvestigationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  investigationNotes?: string;
  maintenanceCorrelation?: string;
}

export interface FuelTheftIndicator {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverId?: string;
  driverName?: string;
  timestamp: string;
  riskLevel: FuelTheftRiskLevel;
  detectionStrengthScore: number; // 0 - 100 (calibrated rule-based strength)
  fuelDropLiters: number;
  fuelDropPercentage: number;
  ignitionOffConfirmed: boolean;
  vehicleStationaryConfirmed: boolean;
  distanceDuringDropKm: number;
  outsideAuthorizedGeofence: boolean;
  noMatchingTransaction: boolean;
  latitude: number;
  longitude: number;
  locationName: string;
  evidenceList: string[];
  status: AnomalyInvestigationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  operatorNotes?: string;
  disclaimer: string;
}

export interface FuelDrainItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverName?: string;
  timestamp: string;
  fuelLostLiters: number;
  dropRateLitersPerHour: number;
  ignitionState: boolean;
  speedKmH: number;
  latitude: number;
  longitude: number;
  locationName: string;
  possibleCauses: string[];
  maintenanceAlertLinked?: string;
  sensorHealthStatus: 'HEALTHY' | 'SUSPECT_CALIBRATION' | 'INTERMITTENT';
  status: AnomalyInvestigationStatus;
}

export interface RefuelingAuditItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverId?: string;
  driverName?: string;
  timestamp: string;
  fuelType: FuelType;
  sensorIncreaseLiters: number;
  transactionVolumeLiters: number;
  differenceLiters: number;
  differencePercentage: number;
  reconciliationResult: 'CONSISTENT' | 'PARTIAL_MATCH' | 'MISMATCH_DETECTED' | 'UNREGISTERED_STATION';
  pricePerLiterIdr: number;
  totalCostIdr: number;
  stationName: string;
  stationAuthorized: boolean;
  geofenceMatch: boolean;
  latitude: number;
  longitude: number;
  receiptNumber?: string;
  status: 'VERIFIED' | 'FLAGGED' | 'RESOLVED';
  aiObservation: string;
}

export interface FuelCostBreakdown {
  totalCostIdr: number;
  previousPeriodCostIdr: number;
  changePercentage: number;
  costPerKmIdr: number;
  costPerTripIdr: number;
  costPerVehicleIdr: number;
  costPerEngineHourIdr: number;
  estimatedAvoidableWasteCostIdr: number;
  costByVehicleType: { type: string; totalCostIdr: number; volumeLiters: number; avgCostPerKm: number }[];
  costByBranch: { branchName: string; totalCostIdr: number; volumeLiters: number }[];
  costByFuelType: { fuelType: FuelType; totalCostIdr: number; volumeLiters: number; avgPricePerLiter: number }[];
  topCostliestVehicles: { vehicleId: string; plateNumber: string; totalCostIdr: number; costPerKm: number; distanceKm: number }[];
}

export interface VehicleFuelRankingItem {
  rank: number;
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  branchName: string;
  assignedDriverName: string;
  efficiencyScore: number; // 0 - 100
  avgConsumptionL100Km: number;
  avgConsumptionKmL: number;
  baselineL100Km: number;
  deviationPercentage: number;
  totalFuelLiters: number;
  totalCostIdr: number;
  completedTripsCount: number;
  totalDistanceKm: number;
  efficiencyStatus: 'HIGHLY_EFFICIENT' | 'NORMAL' | 'ELEVATED_CONSUMPTION' | 'SEVERELY_INEFFICIENT';
}

export interface DriverFuelAnalysisItem {
  driverId: string;
  driverName: string;
  assignedPlate: string;
  branchName: string;
  totalTrips: number;
  totalDistanceKm: number;
  avgConsumptionL100Km: number;
  avgConsumptionKmL: number;
  peerGroupAvgL100Km: number;
  peerComparisonPercentage: number; // e.g. +14% vs peers
  fuelEfficiencyScore: number;
  idleDurationMinutes: number;
  idleFuelWasteLiters: number;
  harshAccelerationCount: number;
  overspeedEventsCount: number;
  associatedFactors: string[];
}

export interface RouteFuelAnalysisItem {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  totalTripsRecorded: number;
  avgConsumptionL100Km: number;
  fleetBaselineL100Km: number;
  deviationPercentage: number;
  avgFuelCostPerTripIdr: number;
  avgIdleMinutesPerTrip: number;
  terrainProfile: 'FLAT_HIGHWAY' | 'CONGESTED_URBAN' | 'HILLY_ELEVATED' | 'MIXED_LOGISTICS';
  aiObservation: string;
}

export interface FuelTrendDataPoint {
  date: string;
  label: string;
  currentConsumptionL100Km: number;
  previousConsumptionL100Km: number;
  efficiencyScore: number;
  totalLiters: number;
  totalCostIdr: number;
  anomalyEventsCount: number;
}

export interface FuelTrendAnalysis {
  direction: FuelTrendDirection;
  changePercentage: number;
  trendDescription: string;
  consecutiveWeeksTrend?: string;
  dataPoints: FuelTrendDataPoint[];
}

export interface FuelEfficiencyPredictionResult {
  vehicleId: string;
  plateNumber: string;
  currentConsumptionL100Km: number;
  predictedNextTripL100Km: number;
  predicted7DaysL100Km: number;
  predicted30DaysL100Km: number;
  expectedChangePercentage: number;
  forecastTrend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  associatedContributors: string[];
  predictionQuality: FuelPredictionQuality;
  confidenceScorePercentage?: number;
  modelRationale: string;
  isDataSufficient: boolean;
}

export interface AIFuelRecommendationItem {
  id: string;
  title: string;
  category: 'IDLE_REDUCTION' | 'SPEED_OPTIMIZATION' | 'ACCELERATION_COACHING' | 'ROUTE_REPLANNING' | 'MAINTENANCE_TRIGGER' | 'SENSOR_CALIBRATION';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  vehicleId?: string;
  plateNumber?: string;
  driverId?: string;
  driverName?: string;
  routeId?: string;
  routeName?: string;
  recommendation: string;
  reason: string;
  evidence: string[];
  potentialMonthlySavingsLiters: number;
  potentialMonthlySavingsIdr: number;
  actionItems: string[];
}

export interface FuelDataQualityMetrics {
  overallQualityScore: number; // 0 - 100
  sensorCoveragePercentage: number;
  dataFrequencySeconds: number;
  missingValuesPercentage: number;
  gpsAvailabilityPercentage: number;
  fuelSensorReliabilityScore: number;
  transactionCompletenessPercentage: number;
  vehiclesWithMissingSensor: string[];
  calibratedSensorsCount: number;
  uncalibratedSensorsCount: number;
  warnings: string[];
}

export interface FuelEventMapMarker {
  id: string;
  eventType: 'THEFT_INDICATOR' | 'FUEL_DRAIN' | 'ANOMALY' | 'REFUELING';
  title: string;
  vehicleId: string;
  plateNumber: string;
  driverName?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  locationName: string;
  fuelChangeLiters: number;
  fuelLevelBefore: number;
  fuelLevelAfter: number;
  ignitionStatus: boolean;
  speedKmH: number;
  riskLevel: FuelTheftRiskLevel;
  evidenceSummary: string;
}
