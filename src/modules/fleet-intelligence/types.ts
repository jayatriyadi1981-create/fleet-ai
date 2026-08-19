/**
 * Fleet Intelligence Smart AI - Domain Types (Prompt 28)
 * Definisi tipe data lengkap untuk AI Fleet Intelligence Layer
 */

export type HealthCategory = 'Excellent' | 'Good' | 'Attention' | 'Poor' | 'Critical';
export type UtilizationCategory = 'Very Low' | 'Low' | 'Moderate' | 'Good' | 'High';
export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AnomalyScoreInterpretation = 'Normal' | 'Slight' | 'Moderate' | 'High' | 'Critical';
export type PerformanceTrend = 'improving' | 'stable' | 'declining';
export type IntelligencePeriod = 
  | 'today' 
  | 'yesterday' 
  | 'last_7_days' 
  | 'last_30_days' 
  | 'this_month' 
  | 'previous_month' 
  | 'custom';

export type AnomalyType =
  | 'unexpected_idle'
  | 'unusual_driving_hours'
  | 'unusual_route'
  | 'repeated_route_deviation'
  | 'unusual_fuel_consumption'
  | 'fuel_drain'
  | 'frequent_offline'
  | 'unexpected_downtime'
  | 'abnormal_trip_duration'
  | 'abnormal_distance'
  | 'repeated_overspeed'
  | 'repeated_safety_events'
  | 'unusual_utilization';

export type AnomalyDetectionMethod =
  | 'rule_based'
  | 'historical_baseline'
  | 'peer_comparison'
  | 'trend_analysis'
  | 'statistical_deviation'
  | 'ai_reasoning';

export interface FleetIntelligenceFilter {
  period: IntelligencePeriod;
  customStartDate?: string;
  customEndDate?: string;
  branchId?: string;
  departmentId?: string;
  fleetGroupId?: string;
  vehicleType?: string;
  vehicleId?: string;
  driverId?: string;
  routeId?: string;
  region?: string;
}

export interface HealthWeightsConfig {
  availability: number; // e.g. 0.20
  maintenance: number;  // e.g. 0.20
  inspection: number;   // e.g. 0.15
  safety: number;       // e.g. 0.15
  gpsConnectivity: number; // e.g. 0.10
  driverBehavior: number;  // e.g. 0.10
  operations: number;      // e.g. 0.10
}

export interface FleetHealthBreakdown {
  overallScore: number;
  category: HealthCategory;
  availability: number;
  maintenance: number;
  inspection: number;
  safety: number;
  gpsConnectivity: number;
  driverBehavior: number;
  operations: number;
  weights: HealthWeightsConfig;
  trend: Array<{
    date: string;
    currentScore: number;
    previousScore: number;
  }>;
  changePercent: number;
  changeAnalysis: {
    summary: string;
    mainContributors: Array<{
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      description: string;
    }>;
  };
}

export interface FleetUtilizationData {
  utilizationRate: number; // 0-100%
  category: UtilizationCategory;
  formulaDescription: string;
  activeVehicles: number;
  idleVehicles: number;
  availableVehicles: number;
  unusedVehicles: number;
  totalVehicles: number;
  totalDrivingHours: number;
  totalTripHours: number;
  totalDistanceKm: number;
  averageAvailabilityPercent: number;
  trend: Array<{
    date: string;
    rate: number;
    previousRate: number;
  }>;
  changePercent: number;
  underutilizedVehicles: Array<{
    vehicleId: string;
    plateNumber: string;
    brandModel: string;
    groupName: string;
    branchName: string;
    utilizationPercent: number;
    operatingHours: number;
    distanceKm: number;
    recommendedAction: string;
  }>;
  overutilizedVehicles: Array<{
    vehicleId: string;
    plateNumber: string;
    brandModel: string;
    groupName: string;
    branchName: string;
    utilizationPercent: number;
    operatingHours: number;
    mileageKm: number;
    potentialRisks: string[];
    maintenanceExposure: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  balancingRecommendation: {
    summary: string;
    heavilyUtilizedCount: number;
    underutilizedCount: number;
    suggestedActions: string[];
  };
}

export interface VehiclePerformanceItem {
  vehicleId: string;
  plateNumber: string;
  brand: string;
  model: string;
  type: string;
  groupName: string;
  branchName: string;
  status: string;
  utilizationPercent: number;
  distanceKm: number;
  fuelEfficiencyKmPerL: number;
  idleHours: number;
  maintenanceScore: number;
  safetyScore: number;
  performanceScore: number; // 0 - 100
  ranking: number;
  trend: PerformanceTrend;
  trendScores: number[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  keyIssues: string[];
}

export interface OperationalAnomalyItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  vehicleModel: string;
  driverName?: string;
  branchName?: string;
  type: AnomalyType;
  title: string;
  severity: AnomalySeverity;
  anomalyScore: number; // 0 - 100
  scoreInterpretation: AnomalyScoreInterpretation;
  detectedAt: string;
  evidence: string[];
  impact: string;
  recommendation: string;
  detectionMethod: AnomalyDetectionMethod;
  baselineValue?: string;
  currentValue?: string;
  deviationPercent?: number;
  relatedModule: 'gps' | 'fuel' | 'maintenance' | 'safety' | 'trip' | 'inspection';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
}

export interface FleetEfficiencyData {
  overallEfficiencyScore: number; // 0 - 100
  fuelEfficiency: {
    score: number;
    avgKmPerL: number;
    baselineKmPerL: number;
    avgLitersPer100Km: number;
    deviationPercent: number;
    fuelCostPerKmIdr: number;
    anomaliesCount: number;
    unit: 'km/L' | 'L/100km';
  };
  idleEfficiency: {
    score: number;
    totalIdleMinutes: number;
    idlePercentOfRunTime: number;
    idleFuelLostLiters: number;
    idleCostEstimateIdr: number;
    topIdleVehicles: Array<{ plateNumber: string; idleHours: number; lostCostIdr: number }>;
  };
  routeEfficiency: {
    score: number;
    plannedDistanceKm: number;
    actualDistanceKm: number;
    deviationKm: number;
    deviationPercent: number;
    plannedDurationHours: number;
    actualDurationHours: number;
    delayIncidentsCount: number;
  };
  downtimeEfficiency: {
    score: number;
    totalDowntimeHours: number;
    maintenanceDowntimeHours: number;
    gpsOfflineDowntimeHours: number;
    operationalAvailabilityRate: number;
  };
  costEfficiency: {
    hasFinancialData: boolean;
    fuelCostIdr?: number;
    maintenanceCostIdr?: number;
    totalOperationalCostIdr?: number;
    costPerKmIdr?: number;
    costPerTripIdr?: number;
    costNote?: string;
  };
}

export interface FleetRiskOverview {
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0 - 100
  breakdown: {
    safetyRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    maintenanceRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    gpsRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    fuelRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    operationalRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    driverRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  criticalVehiclesCount: number;
  highRiskVehiclesCount: number;
}

export interface BranchHealthHeatmapItem {
  branchId: string;
  branchName: string;
  city: string;
  healthScore: number;
  category: HealthCategory;
  utilizationRate: number;
  vehiclesCount: number;
  anomaliesCount: number;
  safetyScore: number;
}

export interface CrossModuleCorrelation {
  id: string;
  chain: string[]; // e.g. ['Fuel Consumption ↑ 19%', 'Idle Excess ↑ 37%', 'Route Deviation ↑ 6x']
  rootInsight: string;
  impactScore: number;
  severity: AnomalySeverity;
  affectedVehicles: string[];
}

export interface RootCauseInvestigation {
  metricChanged: string;
  changeValue: string;
  direction: 'increase' | 'decrease';
  correlatedFactors: string[];
  historicalPattern: string;
  affectedEntities: {
    vehicles: string[];
    drivers: string[];
    routes: string[];
  };
  rankedCauses: Array<{
    cause: string;
    probability: 'Likely contributor' | 'Possible contributor' | 'Minor contributor';
    evidence: string[];
  }>;
}

export interface PeriodComparisonData {
  periodCurrent: string;
  periodPrevious: string;
  metrics: Array<{
    name: string;
    currentValue: string | number;
    previousValue: string | number;
    changePercent: number;
    trend: 'improving' | 'declining' | 'stable';
    isPositiveChange: boolean;
    unit?: string;
  }>;
  aiExplanation: string;
}

export interface BranchComparisonData {
  branchA: {
    name: string;
    healthScore: number;
    utilization: number;
    efficiency: number;
    fuelKmPerL: number;
    safetyScore: number;
    anomaliesCount: number;
  };
  branchB: {
    name: string;
    healthScore: number;
    utilization: number;
    efficiency: number;
    fuelKmPerL: number;
    safetyScore: number;
    anomaliesCount: number;
  };
  comparativeAnalysis: string;
  winnerMetrics: Record<string, string>;
}

export interface AIRecommendationItem {
  id: string;
  title: string;
  recommendation: string;
  reason: string;
  expectedBenefit: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  relatedVehicles: string[];
  relatedModule: 'fleet' | 'fuel' | 'maintenance' | 'safety' | 'driver' | 'trip' | 'inspection';
  actionLabel: string;
  actionType: string;
  potentialSavingsIdr?: number;
  estimatedEffort?: 'Low' | 'Medium' | 'High';
  evidence: string[];
}

export interface FleetIntelligenceReportPayload {
  generatedAt: string;
  tenantName: string;
  periodLabel: string;
  health: FleetHealthBreakdown;
  utilization: FleetUtilizationData;
  efficiency: FleetEfficiencyData;
  risk: FleetRiskOverview;
  topAnomalies: OperationalAnomalyItem[];
  topRecommendations: AIRecommendationItem[];
  topVehicles: VehiclePerformanceItem[];
  attentionVehicles: VehiclePerformanceItem[];
  dailyBriefingText: string;
  executiveSummaryText: string;
}
