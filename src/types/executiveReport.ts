/**
 * Fleet Intelligence Smart AI - AI Executive Report Domain Types
 * PROMPT 52 — Business & Financial Intelligence for Director / Owner / C-Level
 */

export type ExecutivePeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export type ExecutiveReportStatus = 'SCHEDULED' | 'PROCESSING' | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'REGENERATED';

export type ExecutiveRolePerspective = 'director_owner' | 'fleet_manager' | 'finance' | 'safety';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type RecommendationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RecommendationStatus = 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';

export type RiskSeverity = 'CRITICAL' | 'WARNING' | 'WATCH' | 'NORMAL';

export interface EvidenceItem {
  id: string;
  evidenceId?: string;
  domain: 'fuel' | 'maintenance' | 'driver' | 'safety' | 'cost' | 'logistics' | 'utilization';
  title: string;
  description: string;
  sourceModule: string;
  sourceType?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  vehiclePlateOrRef?: string;
  driverId?: string;
  driverName?: string;
  routeId?: string;
  routeName?: string;
  dataPoints?: Record<string, any>;
  telematicsTelemetrySnippet?: Record<string, any>;
  timestamp: string;
}

export type ExecutiveEvidenceItem = EvidenceItem;

export interface RootCauseDriver {
  category: string;
  sharePercent: number; // e.g. 52%
  costAmount: number; // e.g. Rp 956.800.000
  changePercent: number; // e.g. +8.4%
  confidence: ConfidenceLevel;
  affectedVehiclesCount: number;
  affectedVehicles: Array<{
    vehicleId: string;
    plateNumber: string;
    model: string;
    cost: number;
    mileageKm: number;
    costPerKm: number;
    variancePercent: number;
    primaryReason: string;
  }>;
  affectedRoutes: Array<{
    routeId: string;
    routeName: string;
    tripCount: number;
    distanceKm: number;
    totalCost: number;
    costPerKm: number;
    variancePercent: number;
    delayMinutes: number;
  }>;
  affectedDrivers: Array<{
    driverId: string;
    name: string;
    overspeedCount: number;
    harshEventCount: number;
    idleExcessMinutes: number;
    impactDescription: string;
  }>;
  explanation: string;
  evidenceIds: string[];
}

export interface ScorecardMetric {
  score: number; // 0 - 100
  previousScore: number;
  changePercent: number;
  targetScore: number;
  status: 'above' | 'on_target' | 'below';
  benchmark: string;
}

export interface ExecutiveScorecard {
  overallIndex: number; // 0 - 100
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  efficiency: ScorecardMetric;
  costControl: ScorecardMetric;
  safety: ScorecardMetric;
  utilization: ScorecardMetric;
  maintenance: ScorecardMetric;
  fuelEfficiency: ScorecardMetric;
  productivity: ScorecardMetric;
}

export interface ExecutiveKPIs {
  // Financial KPIs
  totalOperatingCost: number;
  fuelCost: number;
  maintenanceCost: number;
  driverCost: number;
  operationalOverheadCost: number;
  costPerKm: number;
  costPerTrip: number;
  revenue: number | null; // null if not configured
  revenuePerKm: number | null;
  profitabilityMargin: number | null; // null if not configured
  budgetAmount: number | null;
  budgetVariancePercent: number | null;
  budgetStatus: 'UNDER_BUDGET' | 'ON_BUDGET' | 'OVER_BUDGET' | 'NOT_CONFIGURED';

  // Operational & Fleet KPIs
  fleetUtilizationPercent: number;
  vehicleAvailabilityPercent: number;
  fleetProductivityScore: number;
  totalDistanceKm: number;
  totalTripsCompleted: number;
  activeVehiclesCount: number;
  totalFleetCount: number;
  totalDowntimeHours: number;
  totalExcessIdleHours: number;

  // Safety & Driver KPIs
  fleetSafetyScore: number;
  incidentCount: number;
  accidentCount: number;
  nearMissCount: number;
  highRiskDriversCount: number;
  fatigueAlertsCount: number;

  // Logistics & SLA KPIs
  onTimeDeliveryRatePercent: number;
  totalDeliveries: number;
  failedDeliveries: number;
  delayedDeliveries: number;
  podCompletionRatePercent: number;
  customerSlaBreachCount: number | null; // null if not configured
}

export interface ExecutiveForecast {
  metric: string;
  metricLabel: string;
  currentValueFormatted: string;
  projectedNextPeriodFormatted: string;
  projectedRangeFormatted: { min: string; max: string };
  projectedChangePercent: number;
  trend: 'increase' | 'stable' | 'decrease';
  confidence: ConfidenceLevel;
  assumptions: string[];
  businessRecommendation: string;
}

export interface ExecutiveRiskItem {
  id: string;
  title: string;
  category: 'Financial' | 'Safety' | 'Operational' | 'Compliance' | 'Maintenance';
  severity: RiskSeverity;
  businessImpact: string;
  likelihood: ConfidenceLevel;
  financialExposureEstimate?: string;
  mitigationStrategy: string;
  targetResolutionDate: string;
  ownerDepartment: string;
  evidenceIds: string[];
}

export interface ExecutiveRecommendation {
  id: string;
  title: string;
  category: 'Cost Optimization' | 'Safety & Compliance' | 'Fleet Maintenance' | 'Operational Logistics';
  reason: string;
  expectedImpact: string;
  calculationBasis?: string;
  priority: RecommendationPriority;
  ownerRole: string; // e.g. 'Fleet Director', 'Finance Head', 'Safety Lead'
  suggestedTimeline: string; // e.g. '7 Hari', '14 Hari', 'Segera'
  status: RecommendationStatus;
  actionType: 'review_fuel' | 'approve_maintenance' | 'assign_driver_coaching' | 'route_optimization' | 'audit_investigation';
  actionPayload?: Record<string, any>;
  evidenceIds: string[];
  approvedBy?: string;
  approvedAt?: string;
  taskCreatedId?: string;
}

export interface HighCostVehicle {
  vehicleId: string;
  plateNumber: string;
  brandModel: string;
  groupName: string;
  branchName: string;
  totalCost: number;
  mileageKm: number;
  costPerKm: number;
  fleetAvgCostPerKm: number;
  fuelCost: number;
  maintenanceCost: number;
  utilizationPercent: number;
  aiExplanation: string;
  evidenceIds: string[];
}

export interface HighCostRoute {
  routeId: string;
  routeName: string;
  distanceKm: number;
  tripCount: number;
  fuelLiters: number;
  totalCost: number;
  costPerKm: number;
  delayMinutes: number;
  onTimePercent: number;
  aiInsight: string;
  evidenceIds: string[];
}

export interface ExecutiveBranchComparison {
  branchId: string;
  branchName: string;
  totalVehicles: number;
  totalCost: number;
  costPerKm: number;
  utilizationPercent: number;
  safetyScore: number;
  fuelEfficiencyKmPerL: number;
  maintenanceCost: number;
  productivityScore: number;
  varianceVsCompanyAvgPercent: number;
  status: 'optimal' | 'attention_needed' | 'high_cost';
}

export interface ExecutiveDepartmentComparison {
  departmentName: string;
  costCenterCode: string;
  vehicleCount: number;
  totalCost: number;
  costPerKm: number;
  utilizationPercent: number;
  safetyScore: number;
}

export interface ExecutiveCostTrendPoint {
  periodMonth: string; // e.g. 'Jan 26', 'Feb 26'
  fuelCost: number;
  maintenanceCost: number;
  driverAndOpsCost: number;
  totalCost: number;
  costPerKm: number;
  targetCostPerKm?: number;
}

export interface ExecutiveReport {
  id: string;
  tenantId: string;
  companyName: string;
  periodType: ExecutivePeriodType;
  periodLabel: string; // e.g. 'Agustus 2026'
  periodStart: string; // e.g. '2026-08-01'
  periodEnd: string; // e.g. '2026-08-31'
  comparisonPeriodLabel?: string; // e.g. 'Juli 2026' (vs Previous)
  samePeriodLastYearLabel?: string; // e.g. 'Agustus 2025'
  timezone: string;
  version: number;
  status: ExecutiveReportStatus;

  // Executive Narrative
  executiveSummary: {
    headline: string;
    narrative: string;
    keyPoints: string[];
    bulletCount: number;
    businessSentiment: 'positive' | 'neutral' | 'caution' | 'critical';
  };

  // Structured Domain Insights
  domainInsights: {
    financial: string;
    operations: string;
    fleet: string;
    fuel: string;
    maintenance: string;
    driverSafety: string;
    delivery: string;
  };

  // Scorecards & Key Performance Indicators
  scorecard: ExecutiveScorecard;
  kpis: {
    current: ExecutiveKPIs;
    previous?: ExecutiveKPIs | null;
    samePeriodLastYear?: ExecutiveKPIs | null;
    target?: Partial<ExecutiveKPIs> | null;
    varianceVsPreviousPercent: Record<string, number | null>;
    varianceVsTargetPercent: Record<string, number | null>;
  };

  // Cost and Root Cause Breakdown
  costAnalysis: {
    totalCost: number;
    changePercent: number;
    fleetAvgCostPerKm: number;
    bestCostPerKm: number;
    worstCostPerKm: number;
    drivers: RootCauseDriver[];
    costTrend: ExecutiveCostTrendPoint[];
  };

  // Detailed Segment Benchmarks
  highCostVehicles: HighCostVehicle[];
  highCostRoutes: HighCostRoute[];
  branchComparisons: ExecutiveBranchComparison[];
  departmentComparisons: ExecutiveDepartmentComparison[];

  // Risks, Recommendations, Forecasts
  risks: ExecutiveRiskItem[];
  recommendations: ExecutiveRecommendation[];
  forecasts: ExecutiveForecast[];

  // Evidence Grounding & AI Metadata
  evidences: EvidenceItem[];
  aiMetadata: {
    model: string;
    tokensUsed: number;
    computeCostUsd: number;
    generatedAt: string;
    generatedBy: string;
    confidenceOverall: ConfidenceLevel;
    hallucinationGuardsPassed: boolean;
  };

  auditLog?: Array<{
    action: string;
    performedBy: string;
    timestamp: string;
    notes?: string;
  }>;
}

export interface ExecutiveScheduleConfig {
  id: string;
  tenantId: string;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  dayOfMonth: number; // 1 - 28
  dayOfWeek?: number; // 1 (Mon) - 7 (Sun)
  timeOfDay: string; // '08:00'
  timezone: string;
  recipientsEmail: string[];
  recipientsWhatsApp: string[];
  rolesTargeted: ExecutiveRolePerspective[];
  autoGeneratePdf: boolean;
  autoSendEmail: boolean;
  autoSendWhatsApp: boolean;
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt: string;
}

export interface SharedReportToken {
  id: string;
  reportId: string;
  token: string;
  expiresAt: string;
  recipientEmail: string;
  allowedRolePerspective: ExecutiveRolePerspective;
  hasPassword: boolean;
  accessLog: Array<{ accessedAt: string; ipAddress: string; userAgent: string }>;
}
