/**
 * Fleet Intelligence Smart AI - Executive Dashboard & C-Level Intelligence Types
 * PROMPT 38 - Owner, Director, CEO, GM & Executive Management Intelligence Architecture
 */

export type ExecutivePeriod =
  | 'TODAY'
  | 'YESTERDAY'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'QUARTER'
  | 'YEAR'
  | 'CUSTOM';

export type ExecutiveStatus = 'EXCELLENT' | 'GOOD' | 'ATTENTION' | 'WARNING' | 'CRITICAL';
export type TrendDirection = 'UP' | 'DOWN' | 'STABLE';
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ExecutiveScoreWeights {
  efficiency: number; // default: 20
  productivity: number; // default: 20
  safety: number; // default: 20
  fuel: number; // default: 15
  maintenance: number; // default: 15
  cost: number; // default: 10
}

export interface ExecutiveScoreItem {
  key: string;
  label: string;
  score: number; // 0 - 100
  weight: number; // percentage (e.g. 20)
  weightedScore: number;
  status: ExecutiveStatus;
  trend: TrendDirection;
  delta: number;
  benchmarkScore: number;
}

export interface ExecutiveScoreResult {
  overallScore: number; // 0 - 100
  status: ExecutiveStatus;
  trend: TrendDirection;
  delta: number; // change vs previous period
  items: ExecutiveScoreItem[];
  generatedAt: string;
  isSufficientData: boolean;
}

export interface ExecutiveKpiCardData {
  id: string;
  title: string;
  currentValue: string | number;
  displayValue: string;
  unit?: string;
  previousValue: string | number;
  previousDisplayValue: string;
  percentageChange: number;
  trend: TrendDirection;
  isPositiveGood: boolean;
  status: ExecutiveStatus;
  subtitle: string;
  iconName: string;
  sparklineData?: number[];
}

export interface FleetHealthCounts {
  healthy: number;
  attention: number;
  warning: number;
  critical: number;
  total: number;
}

export interface FleetEfficiencyMetrics {
  fleetUtilizationRate: number; // %
  vehicleAvailabilityRate: number; // %
  vehicleActivePct: number; // %
  idlePct: number; // %
  downtimePct: number; // %
  totalMileageKm: number;
  totalTrips: number;
  efficiencyScore: number;
  healthCounts: FleetHealthCounts;
  prevEfficiencyScore: number;
}

export interface CostBreakdownCategories {
  fuel: number;
  maintenance: number;
  driver: number;
  toll: number;
  insurance: number;
  tax: number;
  gps: number;
  other: number;
}

export interface CostTrendPoint {
  label: string;
  current: number;
  previous: number;
  budget: number | null;
}

export interface ExecutiveCostMetrics {
  totalOperatingCost: number; // IDR
  costPerKm: number; // IDR / KM
  costPerTrip: number; // IDR / Trip
  costPerVehicle: number; // IDR / Unit
  budgetTotal: number | null;
  budgetVariancePct: number | null;
  costBreakdown: CostBreakdownCategories;
  costAlerts: string[];
  trendData: CostTrendPoint[];
  prevTotalCost: number;
}

export interface ExecutiveProductivityMetrics {
  totalTrips: number;
  completedTrips: number;
  tripCompletionRate: number; // %
  completedDeliveries: number;
  deliveriesPerDay: number;
  tripsPerVehicle: number;
  tripsPerDriver: number;
  totalDistanceKm: number;
  utilizationHours: number;
  productivityScore: number;
  trendDirection: TrendDirection;
  trendData: {
    period: string;
    trips: number;
    deliveries: number;
    distanceKm: number;
    utilizationPct: number;
  }[];
}

export interface SafetyCriticalAlertItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  location: string;
  event: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  speedKmh?: number;
  speedLimitKmh?: number;
}

export interface ExecutiveSafetyMetrics {
  safetyScore: number;
  prevSafetyScore: number;
  status: ExecutiveStatus;
  accidentsCount: number;
  incidentsCount: number;
  nearMissCount: number;
  overspeedCount: number;
  harshBrakingCount: number;
  harshAccelerationCount: number;
  fatigueAlertsCount: number;
  safetyViolationsCount: number;
  criticalAlerts: SafetyCriticalAlertItem[];
  trendData: {
    period: string;
    accidents: number;
    incidents: number;
    nearMiss: number;
    behaviorEvents: number;
    fatigueEvents: number;
  }[];
}

export interface FuelAnomalyItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  type: 'DRAIN' | 'ABNORMAL_CONSUMPTION' | 'UNEXPECTED_REFUEL' | 'SENSOR_ANOMALY';
  label: string;
  litersEstimated: number;
  costEstimatedIdr: number;
  timestamp: string;
  status: 'UNRESOLVED' | 'INVESTIGATING' | 'CONFIRMED' | 'FALSE_ALARM';
}

export interface ExecutiveFuelMetrics {
  totalFuelCost: number;
  totalLiters: number;
  avgKmLiter: number;
  avgCostPerKm: number;
  fuelEfficiencyPct: number;
  fuelAnomaliesCount: number;
  theftRiskCount: number;
  anomaliesList: FuelAnomalyItem[];
  trendData: {
    period: string;
    liters: number;
    costIdr: number;
    kmPerLiter: number;
  }[];
}

export interface ExecutiveMaintenanceMetrics {
  totalMaintenanceCost: number;
  vehiclesDueSoonCount: number;
  vehiclesOverdueCount: number;
  criticalVehiclesCount: number;
  breakdownsCount: number;
  downtimeHours: number;
  costBreakdown: {
    preventive: number;
    corrective: number;
    emergency: number;
  };
  healthCounts: {
    healthy: number;
    dueSoon: number;
    overdue: number;
    critical: number;
  };
  trendData: {
    period: string;
    preventive: number;
    corrective: number;
    emergency: number;
  }[];
}

export interface HighRiskVehicleItem {
  vehicleId: string;
  plateNumber: string;
  model: string;
  branchName: string;
  compositeRiskScore: number; // 0 - 100 (higher = worse)
  maintenanceRisk: number;
  costPerKm: number;
  downtimeHours: number;
  fuelAnomalyCount: number;
  safetyRiskScore: number;
  priority: PriorityLevel;
  reason: string;
  recommendedAction: string;
}

export interface TopVehicleCostItem {
  vehicleId: string;
  plateNumber: string;
  model: string;
  branchName: string;
  totalCostIdr: number;
  costPerKmIdr: number;
  fuelCostIdr: number;
  maintenanceCostIdr: number;
  distanceKm: number;
}

export interface TopDriverRiskItem {
  driverId: string;
  name: string;
  branchName: string;
  riskScore: number; // 0 - 100 (higher = riskier)
  safetyScore: number; // 0 - 100 (higher = safer)
  violationsCount: number;
  harshEventsCount: number;
  fatigueCount: number;
  priority: PriorityLevel;
  recommendedCoaching: string;
}

export interface TopEfficientVehicleItem {
  vehicleId: string;
  plateNumber: string;
  model: string;
  branchName: string;
  kmPerLiter: number;
  costPerKmIdr: number;
  utilizationPct: number;
  efficiencyRating: number; // 0 - 100
}

export interface TopProductiveVehicleItem {
  vehicleId: string;
  plateNumber: string;
  model: string;
  branchName: string;
  tripsCount: number;
  deliveriesCount: number;
  distanceKm: number;
  activeHours: number;
  productivityScore: number;
}

export interface AIExecutiveSummaryData {
  performanceStatus: ExecutiveStatus;
  executiveHeadline: string;
  keyFindings: string[];
  businessImpactSummary: string;
  recommendedActions: string[];
  generatedAt: string;
  confidenceScore: number; // 0 - 100
}

export interface AIExecutiveInsight {
  id: string;
  category: 'COST' | 'SAFETY' | 'EFFICIENCY' | 'MAINTENANCE' | 'FUEL' | 'OPERATIONS';
  priority: PriorityLevel;
  title: string;
  description: string;
  businessImpact: string;
  estimatedFinancialImpactIdr?: number;
  confidencePct: number;
  evidence: string[];
  recommendedAction: string;
  calculationMethod?: string;
  assumptions?: string[];
  dataSources: string[];
  period: string;
  createdAt: string;
  isAcknowledged?: boolean;
}

export interface ExecutiveSavingOpportunity {
  id: string;
  title: string;
  category: 'IDLE_REDUCTION' | 'PREVENTIVE_MAINTENANCE' | 'ROUTE_OPTIMIZATION' | 'TIRE_ROTATION' | 'FUEL_DRAIN_PREVENTION';
  estimatedMonthlySavingIdr: number;
  description: string;
  assumptions: string[];
  calculationMethod: string;
  dataSource: string;
  difficulty: 'EASY' | 'MODERATE' | 'COMPLEX';
}

export interface ExecutiveDecisionItem {
  id: string;
  title: string;
  category: string;
  issue: string;
  businessImpact: string;
  recommendation: string;
  assignedOwner: string;
  priority: PriorityLevel;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  actionType: 'CREATE_TASK' | 'CREATE_INVESTIGATION' | 'NOTIFY_MANAGER' | 'CREATE_REPORT';
  createdAt: string;
}

export interface BranchExecutivePerformance {
  branchId: string;
  branchName: string;
  fleetCount: number;
  utilizationPct: number;
  costPerKmIdr: number;
  productivityScore: number;
  safetyScore: number;
  fuelEfficiencyKmL: number;
  maintenanceHealthPct: number;
  overallScore: number;
  rank: number;
}

export interface DailyBriefingData {
  date: string;
  greeting: string;
  availabilityPct: number;
  totalOperatingCostIdr: number;
  productivityDeltaPct: number;
  safetyStatus: ExecutiveStatus;
  fuelStatus: ExecutiveStatus;
  maintenanceDueCount: number;
  highRiskVehiclesCount: number;
  topPriorityTitle: string;
  topPriorityAction: string;
  aiRecommendation: string;
  keyMetricsSummary: {
    activeVehicles: number;
    totalVehicles: number;
    ongoingTrips: number;
    openAlerts: number;
  };
}

export interface ExecutiveReportData {
  tenantId: string;
  companyName: string;
  periodLabel: string;
  dateRange: DateRange;
  generatedAt: string;
  generatedBy: string;
  overallScore: ExecutiveScoreResult;
  kpis: ExecutiveKpiCardData[];
  efficiency: FleetEfficiencyMetrics;
  cost: ExecutiveCostMetrics;
  productivity: ExecutiveProductivityMetrics;
  safety: ExecutiveSafetyMetrics;
  fuel: ExecutiveFuelMetrics;
  maintenance: ExecutiveMaintenanceMetrics;
  branches: BranchExecutivePerformance[];
  aiSummary: AIExecutiveSummaryData;
  insights: AIExecutiveInsight[];
  savingOpportunities: ExecutiveSavingOpportunity[];
  highRiskVehicles: HighRiskVehicleItem[];
  topCostVehicles: TopVehicleCostItem[];
  topRiskDrivers: TopDriverRiskItem[];
}
