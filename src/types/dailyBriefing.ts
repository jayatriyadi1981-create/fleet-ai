/**
 * Fleet Intelligence Smart AI - AI Fleet Daily Briefing Types (PROMPT 51)
 * Complete multi-tenant, role-based, AI-grounded daily fleet intelligence schema
 */

export type BriefingStatus = 
  | 'SCHEDULED' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'PARTIAL' 
  | 'FAILED' 
  | 'REGENERATED' 
  | 'AI_QUOTA_EXCEEDED';

export type ProblemSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RecommendationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AIConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type BriefingViewMode = 'executive' | 'fleet_manager' | 'maintenance' | 'safety' | 'finance' | 'all';
export type BriefingTimezone = 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura';

export interface FleetStatusBreakdown {
  totalVehicles: number;
  online: number;
  offline: number;
  moving: number;
  idle: number;
  stopped: number;
  maintenance: number;
  inactive: number;
}

export interface ScoreDimension {
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  detail: string;
}

export interface FleetHealthScore {
  overallScore: number; // 0 - 100
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  status: 'optimal' | 'stable' | 'attention_required' | 'critical';
  dimensions: {
    availability: ScoreDimension;
    vehicleHealth: ScoreDimension;
    driverSafety: ScoreDimension;
    fuelEfficiency: ScoreDimension;
    maintenance: ScoreDimension;
    operationalEfficiency: ScoreDimension;
    gpsConnectivity: ScoreDimension;
  };
  summaryReason: string;
}

export interface FleetRiskSummary {
  riskScore: number; // 0 - 100 (higher = riskier)
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  mainContributors: string[];
  affectedVehiclesCount: number;
  affectedDriversCount: number;
  topRisks: Array<{
    rank: number;
    title: string;
    category: 'OPERATIONAL' | 'SAFETY' | 'DRIVER' | 'VEHICLE' | 'FUEL' | 'MAINTENANCE' | 'DELIVERY' | 'GPS';
    severity: ProblemSeverity;
    evidence: string;
    affectedEntity: string;
    mitigationAction: string;
    linkedModule: string;
  }>;
}

export interface BriefingProblem {
  id: string;
  category: 'GPS' | 'VEHICLE' | 'DRIVER' | 'FUEL' | 'MAINTENANCE' | 'SAFETY' | 'ROUTE' | 'DELIVERY';
  severity: ProblemSeverity;
  title: string;
  evidence: string;
  entityType: 'vehicle' | 'driver' | 'route' | 'trip' | 'device' | 'document';
  entityId: string;
  entityName: string;
  detectedAt: string;
  recommendedAction: string;
  status: 'detected' | 'in_progress' | 'mitigated' | 'dismissed';
}

export interface FuelAnomalyItem {
  id: string;
  vehiclePlate: string;
  vehicleId: string;
  anomalyType: 'FUEL_DRAIN' | 'UNUSUAL_CONSUMPTION' | 'UNEXPECTED_REFUELING' | 'CONSUMPTION_SPIKE';
  possibleCause: string;
  confidence: AIConfidenceLevel;
  recordedLitresVariance: number;
  recommendedInvestigation: string;
}

export interface BriefingFuelIntelligence {
  totalFuelLiters: number;
  totalFuelCostIdr: number;
  avgConsumptionKmPerLiter: number;
  costPerKmIdr: number;
  yesterdayCostIdr: number;
  sevenDayAvgCostIdr: number;
  thirtyDayAvgCostIdr: number;
  changePercentVsSevenDay: number;
  refuelingEventsCount: number;
  anomaliesDetected: FuelAnomalyItem[];
  aiNarrative: string;
  confidence: AIConfidenceLevel;
}

export interface MaintenancePriorityItem {
  vehicleId: string;
  vehiclePlate: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  issue: string;
  reason: string;
  dueDistanceKm?: number;
  dueDate?: string;
  predictedFailureRiskPercent?: number;
  recommendation: string;
}

export interface BriefingMaintenanceOverview {
  overdueCount: number;
  dueSoonCount: number;
  scheduledCount: number;
  inProgressCount: number;
  completedYesterdayCount: number;
  criticalCount: number;
  priorities: MaintenancePriorityItem[];
  predictiveAdvisory: string;
}

export interface RiskyDriverItem {
  driverId: string;
  driverName: string;
  riskScore: number; // 0 - 100 (higher = riskier)
  safetyScore: number;
  overspeedCount: number;
  harshBrakingCount: number;
  fatigueAlerts: number;
  assignedPlate: string;
  primaryRiskReason: string;
  coachingRecommendation: string;
}

export interface BriefingDriverOverview {
  activeDriversCount: number;
  tripsCount: number;
  overspeedEventsTotal: number;
  harshBrakeEventsTotal: number;
  harshAccelEventsTotal: number;
  sharpTurnEventsTotal: number;
  idleExcessHoursTotal: number;
  routeDeviationsTotal: number;
  avgSafetyScore: number;
  topRiskyDrivers: RiskyDriverItem[];
  aiCoachingSummary: string;
}

export interface BriefingFatigueOverview {
  highRiskDriversCount: number;
  mediumRiskDriversCount: number;
  lowRiskDriversCount: number;
  nightDrivingHoursTotal: number;
  consecutiveHoursExceededCount: number;
  fatigueAdvisory: string;
}

export interface BriefingSafetyOverview {
  incidentsCount: number;
  nearMissCount: number;
  fleetSafetyScore: number;
  safetyTrendVsLastWeek: number; // e.g. +3.5%
  recurringPatterns: string[];
  safetyAdvisory: string;
}

export interface BriefingGpsHealth {
  overallHealthPercent: number;
  devicesOnline: number;
  devicesOffline: number;
  noRecentPingCount: number;
  gpsErrorsCount: number;
  connectivityTrend: 'improving' | 'stable' | 'degrading';
  offlineDevicesList: Array<{
    imei: string;
    plateNumber: string;
    lastPingAgoHours: number;
    lastKnownLocation: string;
  }>;
}

export interface BriefingDeliveryOverview {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  failedOrders: number;
  delayedOrders: number;
  podCompletionRate: number; // 0 - 100%
  onTimeDeliveryRate: number; // 0 - 100%
  deliveryRisks: string[];
}

export interface BriefingRouteOverview {
  activeRoutesCount: number;
  routeDeviationsCount: number;
  avgEtaDeviationMinutes: number;
  bottleneckCorridors: string[];
  routeAdvisory: string;
}

export interface BriefingAlertSummary {
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  lowAlerts: number;
  resolvedAlerts: number;
  unresolvedAlerts: number;
  topAlertTypes: Array<{
    type: string;
    count: number;
  }>;
  aiTrendExplanation: string;
}

export interface BriefingRecommendation {
  id: string;
  title: string;
  reason: string;
  evidence: string;
  priority: RecommendationPriority;
  expectedImpact: string;
  suggestedAction: string;
  targetModule: 'maintenance' | 'fuel' | 'safety' | 'driver' | 'gps' | 'route' | 'operations';
  entityReferences: {
    entityType: 'vehicle' | 'driver' | 'trip' | 'device' | 'fuel_record' | 'maintenance_order';
    entityId: string;
    label: string;
  }[];
  requiresHumanApproval: boolean;
  actionStatus: 'pending' | 'task_created' | 'scheduled' | 'dismissed' | 'approved';
  taskReferenceId?: string;
  isApproved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  userFeedback?: 'useful' | 'not_useful' | 'incorrect';
}

export interface BriefingScorecard {
  fleetHealth: number;
  safety: number;
  fuelEfficiency: number;
  maintenance: number;
  utilization: number;
  driverPerformance: number;
  gpsReliability: number;
}

export interface BriefingComparisonTrend {
  metric: string;
  yesterdayValue: string | number;
  sevenDayAvgValue: string | number;
  thirtyDayAvgValue: string | number;
  changePercent: number;
  direction: 'up' | 'down' | 'neutral';
  isPositive: boolean;
}

export interface FleetDailyBriefing {
  id: string; // e.g. FDB-2026-08-15-COMPANY001
  tenantId: string;
  tenantName: string;
  reportDate: string; // YYYY-MM-DD
  generatedAt: string; // ISO String
  generatedBy: string; // 'AI_SCHEDULER_0600' | 'USER_MANUAL' | 'SYSTEM'
  status: BriefingStatus;
  version: number;
  timezone: BriefingTimezone;
  
  // Executive Highlights
  executiveSummary: string;
  executiveNarrativeIndonesian: string;
  fleetHealth: FleetHealthScore;
  fleetRisk: FleetRiskSummary;
  scorecard: BriefingScorecard;
  
  // Operational Sections
  fleetStatus: FleetStatusBreakdown;
  problems: BriefingProblem[];
  fuelIntelligence: BriefingFuelIntelligence;
  maintenanceOverview: BriefingMaintenanceOverview;
  driverOverview: BriefingDriverOverview;
  fatigueOverview: BriefingFatigueOverview;
  safetyOverview: BriefingSafetyOverview;
  gpsHealth: BriefingGpsHealth;
  deliveryOverview?: BriefingDeliveryOverview;
  routeOverview: BriefingRouteOverview;
  alertSummary: BriefingAlertSummary;
  
  // Recommendations & Trends
  recommendations: BriefingRecommendation[];
  comparisons: BriefingComparisonTrend[];
  aiInsights: Array<{
    id: string;
    title: string;
    narrative: string;
    confidence: AIConfidenceLevel;
    evidence: string;
  }>;
  
  // Metadata & Diagnostics
  partialDataWarnings?: string[];
  aiTokensUsed?: number;
  processingDurationMs?: number;
  aiModel?: string;
}

export interface DailyBriefingScheduleConfig {
  tenantId: string;
  isEnabled: boolean;
  scheduledTime: string; // "06:00"
  timezone: BriefingTimezone;
  preferredLanguage: 'id' | 'en';
  autoCreateTasksForCritical: boolean;
  channels: {
    inApp: boolean;
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  emailRecipients: string[];
  whatsappRecipients: string[];
  rolesWithAccess: string[];
  lastRunAt?: string;
  nextRunAt?: string;
}

export interface DailyBriefingHistoryFilter {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  status?: BriefingStatus;
  minHealthScore?: number;
  maxRiskScore?: number;
  searchQuery?: string;
}
