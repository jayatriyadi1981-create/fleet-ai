/**
 * Fleet Intelligence Smart AI - AI Predictive Maintenance Types
 * PROMPT 31 - Comprehensive Predictive Maintenance, Failure Prediction & Health Architecture
 */

export type VehicleHealthGrade = 'EXCELLENT' | 'GOOD' | 'ATTENTION' | 'POOR' | 'CRITICAL' | 'INSUFFICIENT_DATA';

export type MaintenanceRiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export type ComponentCategory =
  | 'ENGINE'
  | 'TRANSMISSION'
  | 'BATTERY'
  | 'BRAKES'
  | 'TIRES'
  | 'COOLING_SYSTEM'
  | 'ELECTRICAL_SYSTEM'
  | 'SUSPENSION'
  | 'FUEL_SYSTEM'
  | 'OIL_SYSTEM'
  | 'AIR_CONDITIONING'
  | 'GPS_DEVICE';

export type ComponentHealthStatus =
  | 'OPTIMAL'
  | 'NORMAL'
  | 'WARNING'
  | 'CRITICAL'
  | 'NOT_MONITORED';

export type ServiceDueStatus =
  | 'NORMAL'
  | 'DUE_SOON'
  | 'DUE'
  | 'OVERDUE'
  | 'CRITICAL_OVERDUE';

export type MaintenancePriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';

export type PredictionHorizon = '7_DAYS' | '30_DAYS' | '90_DAYS' | '6_MONTHS';

export type PredictionQuality = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';

export type TrendDirection = 'IMPROVING' | 'STABLE' | 'WORSENING' | 'VOLATILE';

export type RecommendationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'WORK_ORDER_CREATED';

export type AnomalyPatternType =
  | 'REPEAT_REPAIR'
  | 'FREQUENT_BREAKDOWN'
  | 'COST_OUTLIER'
  | 'SHORT_INTERVAL'
  | 'REPEAT_COMPONENT_FAILURE'
  | 'ABNORMAL_DOWNTIME';

export interface EvidenceItem {
  source: 'TELEMETRY' | 'VEHICLE_INSPECTION' | 'MAINTENANCE_HISTORY' | 'FUEL_INTELLIGENCE' | 'DRIVER_BEHAVIOR' | 'GPS_EVENTS' | 'DIAGNOSTIC_DTC';
  finding: string;
  timestamp: string;
  dataQuality: PredictionQuality;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  metricValue?: string | number;
  threshold?: string | number;
}

export interface ComponentHealthItem {
  component: ComponentCategory;
  name: string;
  status: ComponentHealthStatus;
  healthScore?: number; // 0-100 or undefined if NOT_MONITORED
  riskLevel: MaintenanceRiskLevel;
  indicators: {
    status: 'PASS' | 'WARN' | 'FAIL' | 'UNAVAILABLE';
    text: string;
  }[];
  sensorValues?: {
    label: string;
    value: string;
    unit?: string;
    isAbnormal?: boolean;
  }[];
  lastInspectedAt?: string;
  lastServicedAt?: string;
  estimatedRemainingLifeKm?: number;
  estimatedRemainingLifeDays?: number;
}

export interface FailurePredictionItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  branch: string;
  component: ComponentCategory;
  componentName: string;
  failureRisk: MaintenanceRiskLevel;
  horizon: PredictionHorizon;
  horizonLabel: string;
  failureProbabilityScore?: number; // 0 - 1
  predictionQuality: PredictionQuality;
  potentialFailureMode: string;
  evidence: EvidenceItem[];
  recommendedAction: string;
  modelVersion: string;
  predictionTimestamp: string;
  feedback?: {
    reviewedAt?: string;
    reviewedBy?: string;
    actualOutcome?: 'CORRECT' | 'PARTIALLY_CORRECT' | 'FALSE_POSITIVE' | 'PENDING';
    technicianNotes?: string;
  };
}

export interface ServiceDueItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  branch: string;
  serviceType: string;
  intervalType: 'MILEAGE' | 'TIME' | 'ENGINE_HOURS' | 'COMBINED';
  currentMileage: number;
  nextServiceMileage: number;
  remainingMileage: number;
  currentEngineHours: number;
  nextServiceEngineHours: number;
  remainingEngineHours: number;
  lastServiceDate: string;
  nextServiceDueDate: string;
  predictedServiceDate: string;
  predictedServiceMileage: number;
  status: ServiceDueStatus;
  estimatedCost: number;
  partsRequired: string[];
}

export interface MaintenancePriorityItem {
  id: string;
  priority: MaintenancePriorityLevel;
  priorityLabel: string;
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  branch: string;
  driverName?: string;
  component: ComponentCategory;
  componentName: string;
  riskScore: number;
  riskLevel: MaintenanceRiskLevel;
  primaryIssue: string;
  dueStatus: ServiceDueStatus;
  safetyImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  operationalImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  assignedTeam?: string;
  workOrderStatus?: 'NONE' | 'PENDING_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'SCHEDULED';
  estimatedDowntimeHours: number;
}

export interface MaintenanceRecommendationItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  branch: string;
  serviceType: string;
  priority: MaintenancePriorityLevel;
  recommendedDate: string;
  recommendedMileage: number;
  component: ComponentCategory;
  componentName: string;
  reason: string;
  rootCauseFactors: {
    category: 'TELEMETRY' | 'FUEL' | 'DRIVER' | 'INSPECTION' | 'MAINTENANCE_AGE';
    description: string;
  }[];
  requiredInspection: string[];
  possibleParts: {
    partName: string;
    partNumber?: string;
    estimatedCost: number;
    stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  }[];
  estimatedLaborCost: number;
  estimatedTotalCost: number;
  status: RecommendationStatus;
  approvalDetails?: {
    approvedBy?: string;
    approvedAt?: string;
    workOrderId?: string;
    notes?: string;
  };
  evidence: EvidenceItem[];
  createdTimestamp: string;
}

export interface VehicleMaintenanceProfile {
  vehicleId: string;
  plateNumber: string;
  brandModel: string;
  vehicleType: string;
  branch: string;
  driverName: string;
  yearOfManufacture?: number;
  vehicleAgeYears?: number;
  totalMileage: number;
  totalEngineHours: number;
  healthScore: number; // 0-100
  healthGrade: VehicleHealthGrade;
  riskScore: number; // 0-100
  riskLevel: MaintenanceRiskLevel;
  riskTrend: TrendDirection;
  dataQuality: PredictionQuality;
  telemetryOnline: boolean;
  lastTelemetryTimestamp?: string;
  sensorReadings: {
    batteryVoltage?: number;
    coolantTempC?: number;
    engineTempC?: number;
    oilPressureKpa?: number;
    engineRpm?: number;
    activeDTCs?: string[];
    tirePressurePsi?: { fl: number; fr: number; rl: number; rr: number };
  };
  components: ComponentHealthItem[];
  serviceDueItems: ServiceDueItem[];
  activePredictions: FailurePredictionItem[];
  activeRecommendations: MaintenanceRecommendationItem[];
  crossModuleSignals: {
    fuelEfficiencyImpact?: string; // e.g. "Konsumsi naik 12% kemungkinan akibat injektor/servis telat"
    driverBehaviorImpact?: string; // e.g. "Harsh braking 18x/minggu memicu keausan kampas rem"
    inspectionFindings?: string[]; // e.g. ["Pre-trip 14 Aug: Lampu sein kiri mati", "Tekanan ban kanan belakang rendah"]
    repeatedFailureCount: number;
  };
  costMetrics: {
    totalMaintenanceCostYTD: number;
    costPerKm: number;
    fleetAverageCostPerKm: number;
    isCostOutlier: boolean;
    downtimeDaysLast90Days: number;
    availabilityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  };
}

export interface MaintenanceAnomalyItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  branch: string;
  patternType: AnomalyPatternType;
  title: string;
  description: string;
  component: ComponentCategory;
  frequencyCount: number;
  periodDays: number;
  totalCostInvolved: number;
  severity: 'WARNING' | 'CRITICAL';
  detectedAt: string;
  evidence: string[];
  suggestedAction: string;
}

export interface MaintenanceCostAnalysis {
  totalCostPeriod: number;
  totalCostPreviousPeriod: number;
  costTrendPercentage: number;
  averageCostPerVehicle: number;
  averageCostPerKm: number;
  totalDowntimeHours: number;
  downtimeCostEstimated: number;
  costByComponent: {
    component: ComponentCategory;
    componentName: string;
    totalCost: number;
    percentage: number;
    repairCount: number;
  }[];
  costByMaintenanceType: {
    type: string;
    cost: number;
    percentage: number;
  }[];
  topCostOutlierVehicles: {
    vehicleId: string;
    plateNumber: string;
    branch: string;
    totalCost: number;
    costPerKm: number;
    percentageAboveAverage: number;
    primaryCostDriver: string;
  }[];
}

export interface MaintenanceTrendPoint {
  date: string;
  averageHealthScore: number;
  averageRiskScore: number;
  openIssuesCount: number;
  scheduledServicesCount: number;
  unplannedBreakdownsCount: number;
  maintenanceCost: number;
}

export interface FleetMaintenanceKPIs {
  fleetHealthScore: number;
  fleetHealthGrade: VehicleHealthGrade;
  highRiskVehiclesCount: number;
  serviceDueSoonCount: number;
  serviceOverdueCount: number;
  predictedFailureCount: number;
  repeatedAnomaliesCount: number;
  averageCostPerKm: number;
  fleetAvailabilityPercentage: number;
  pendingRecommendationsCount: number;
}

export interface MaintenanceFilterState {
  dateRangePreset: 'TODAY' | '7_DAYS' | '30_DAYS' | '90_DAYS' | 'THIS_MONTH' | 'NEXT_MONTH' | 'CUSTOM';
  startDate: string;
  endDate: string;
  branch: string;
  vehicleGroup: string;
  vehicleType: string;
  vehicleId: string;
  component: string;
  riskLevel: string;
  priorityLevel: string;
  status: string;
  searchQuery: string;
}

export interface ModelAuditEntry {
  id: string;
  modelName: string;
  modelVersion: string;
  inputFeatureVersion: string;
  vehicleId: string;
  component: ComponentCategory;
  predictedRisk: MaintenanceRiskLevel;
  predictedHorizon: PredictionHorizon;
  evidenceSummary: string;
  predictionTimestamp: string;
  evaluatedAt?: string;
  actualOutcome?: string;
  accuracyScore?: number;
}
