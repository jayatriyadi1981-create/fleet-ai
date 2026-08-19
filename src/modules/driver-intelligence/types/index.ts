/**
 * Fleet Intelligence Smart AI - Driver Intelligence Domain Types
 * PROMPT 29 - Enterprise Driver Risk, Safety, Behavior, Recommendations, & Coaching Architecture
 */

export type DriverRiskLevel = 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
// 0–20 Very Low, 21–40 Low, 41–60 Moderate, 61–80 High, 81–100 Critical

export type DriverScoreTrend = 'IMPROVING' | 'STABLE' | 'DECLINING';

export type DriverIntelligencePeriod = '7_DAYS' | '30_DAYS' | '90_DAYS' | 'CUSTOM';

export type DriverIntelligenceTab =
  | 'OVERVIEW'
  | 'RISK_SCORE'
  | 'BEHAVIOR'
  | 'SAFETY_SCORE'
  | 'TRENDS'
  | 'RANKING'
  | 'RECOMMENDATIONS'
  | 'COACHING'
  | 'COMPARISON'
  | 'REPORTS'
  | 'SELF_COACHING';

export type BehaviorEventType =
  | 'OVERSPEED'
  | 'HARSH_BRAKING'
  | 'HARSH_ACCELERATION'
  | 'SHARP_TURN'
  | 'EXCESSIVE_IDLE'
  | 'ROUTE_DEVIATION'
  | 'POSSIBLE_COLLISION'
  | 'RAPID_LANE_CHANGE'
  | 'DRIVER_DISTRACTION'
  | 'FATIGUE'
  | 'SEATBELT'
  | 'PHONE_USAGE';

export type BehaviorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReviewStatus = 'UNREVIEWED' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'DISMISSED';

export type CoachingStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FOLLOW_UP_REQUIRED'
  | 'CLOSED'
  | 'CANCELLED';

export type RecommendationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RecommendationFocusType =
  | 'SPEED_MANAGEMENT'
  | 'DEFENSIVE_DRIVING'
  | 'BRAKING_TECHNIQUE'
  | 'ACCELERATION_CONTROL'
  | 'CORNERING_TECHNIQUE'
  | 'ROUTE_COMPLIANCE'
  | 'IDLE_REDUCTION'
  | 'VEHICLE_INSPECTION'
  | 'REST_BREAK_REMINDER'
  | 'SAFETY_AWARENESS';

// Configurable Risk Weights Model
export interface DriverRiskScoreWeights {
  overspeed: number; // e.g. 0.20
  harshBraking: number; // e.g. 0.15
  harshAcceleration: number; // e.g. 0.10
  sharpTurn: number; // e.g. 0.08
  routeDeviation: number; // e.g. 0.12
  idleBehavior: number; // e.g. 0.08
  safetyEvents: number; // e.g. 0.12
  fatigueRiskIndicators: number; // e.g. 0.08 (operational risk indicators)
  tripCompliance: number; // e.g. 0.04
  inspectionCompliance: number; // e.g. 0.03
}

export interface DriverRiskScoreConfig {
  tenantId: string;
  weights: DriverRiskScoreWeights;
  thresholds: {
    veryLow: number; // 20
    low: number; // 40
    moderate: number; // 60
    high: number; // 80
    critical: number; // 100
  };
  normalizationBasis: 'PER_100_KM' | 'PER_10_HOURS';
  updatedAt: string;
}

export interface RiskContributor {
  category: keyof DriverRiskScoreWeights | string;
  factor?: string;
  name?: string;
  label: string;
  weight: number;
  rawScore: number; // 0-100
  weightedScore: number;
  normalizedScore: number;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidenceText: string;
  trend: DriverScoreTrend;
  rawMetricDisplay?: string;
  contributionToTotalRisk?: number;
}

export interface DriverRiskScore {
  score: number; // 0-100 (higher = higher operational risk)
  level: DriverRiskLevel;
  previousScore: number;
  scoreChange: number;
  trend: DriverScoreTrend;
  contributors: RiskContributor[];
  primaryRiskFactor: string;
  explanation: string;
  evidence: string[];
  confidenceScore: number; // 0-100
  lastCalculatedAt: string;
}

export interface DriverSafetyScore {
  score: number; // 0-100 (higher = better safety)
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  previousScore: number;
  trend: DriverScoreTrend;
  subScores: {
    speedScore: number;
    brakingScore: number;
    accelerationScore: number;
    corneringScore: number;
    routeScore: number;
    idleEfficiencyScore: number;
    fatigueComplianceScore: number;
    inspectionAdherenceScore: number;
    speedCompliance: number;
    brakingSmoothness: number;
    alertResponse: number;
    inspectionCompliance: number;
  };
  eventsPer100Km: number;
  eventsPer10Hours: number;
  safeKilometersCount: number;
}

export interface DriverPerformanceScore {
  compositeScore: number; // 0-100
  factors: {
    safety: number; // 0-100
    behavior: number; // 0-100
    tripCompletion: number; // 0-100
    routeCompliance: number; // 0-100
    punctuality: number; // 0-100
    inspectionCompliance: number; // 0-100
    fuelEfficiency: number; // 0-100
    vehicleCare: number; // 0-100
  };
  ranking: number;
  peerGroupRanking: number;
}

export interface OverspeedIntelligence {
  eventCount: number;
  excessAvgKmH: number;
  maxSpeedKmH: number;
  durationMinutes: number;
  severity?: string;
  maxSpeedRecorded?: number;
  durationOverLimitMinutes?: number;
  topCorridors?: string[];
  concentratedRoute?: string;
  concentratedRouteCount?: number;
  speedAboveThresholdHistogram: { range: string; count: number }[];
  timeOfDayDistribution: { hourBlock: string; count: number }[];
  primaryLocations: string[];
  vehicleBreakdown: { vehiclePlate: string; count: number }[];
  insightSummary: string;
}

export interface HarshBrakingIntelligence {
  eventCount: number;
  avgDecelMs2: number;
  peakDecelMs2: number;
  averageDeceleration?: number;
  riskOfRearEndCollision?: string;
  topLocations: string[];
  roadSegments: { segment: string; count: number }[];
  timeDistribution: { timeRange: string; count: number }[];
  associatedSpeedExcessCount: number;
  insightSummary: string;
}

export interface HarshAccelerationIntelligence {
  eventCount: number;
  avgAccelMs2: number;
  peakAccelMs2: number;
  fuelWastePercentageEstimate?: number;
  topRoutes: string[];
  vehicleTypes: { type: string; count: number }[];
  fuelImpactLitersEstimate: number;
  insightSummary: string;
}

export interface SharpTurnIntelligence {
  eventCount: number;
  avgTurnAngleDeg: number;
  avgSpeedDuringTurnKmH: number;
  maxLateralG?: number;
  rolloverRisk?: string;
  hotspotLocations: string[];
  cargoShiftRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  insightSummary: string;
}

export interface RouteDeviationIntelligence {
  deviationCount: number;
  totalDurationMinutes: number;
  totalDetourKm?: number;
  avgDistanceMeters: number;
  maxDistanceMeters: number;
  recognizedDetours: {
    type: 'TRAFFIC' | 'ROAD_CLOSURE' | 'APPROVED_DETOUR' | 'UNAUTHORIZED';
    count: number;
    description: string;
  }[];
  unauthorizedCount: number;
  insightSummary: string;
}

export interface IdleBehaviorIntelligence {
  idleCount: number;
  totalIdleMinutes: number;
  idlePercentageOfTrip: number;
  estimatedFuelWastedLiters: number;
  estimatedCostWastedIdr: number;
  topIdleLocations: { locationName: string; minutes: number }[];
  idleEfficiencyScore: number; // 0-100
  insightSummary: string;
}

export interface DriverBehaviorAnalysis {
  overspeed: OverspeedIntelligence;
  harshBraking: HarshBrakingIntelligence;
  harshAcceleration: HarshAccelerationIntelligence;
  sharpTurn: SharpTurnIntelligence;
  routeDeviation: RouteDeviationIntelligence;
  idleBehavior: IdleBehaviorIntelligence;
  overallBehaviorScore: number;
  eventsBySeverity: Record<BehaviorSeverity, number>;
  frequencyComparison: {
    driverCurrent: number;
    driverPrevious: number;
    fleetAverage: number;
    peerGroupAverage: number;
  };
}

export interface DriverTrendHistoryPoint {
  date: string;
  riskScore: number;
  safetyScore: number;
  performanceScore: number;
  eventCount: number;
  distanceKm: number;
}

export interface DriverTrend {
  period: DriverIntelligencePeriod;
  score30DaysAgo: number;
  scoreToday: number;
  scoreChange: number;
  direction: DriverScoreTrend;
  riskChangeSummary: string;
  evidence: string[];
  history: DriverTrendHistoryPoint[];
}

export interface DriverRiskMatrixQuadrant {
  quadrant: 'CRITICAL_ATTENTION' | 'COACHING_OPPORTUNITY' | 'LOW_RISK_DEV' | 'EXEMPLARY_BENCHMARK';
  label: string;
  description: string;
  driverCount: number;
  driverIds: string[];
}

export interface DriverRiskMatrixNode {
  driverId: string;
  driverName: string;
  photoUrl?: string;
  branchId: string;
  branchName: string;
  vehiclePlate?: string;
  vehicleType?: string;
  riskScore: number; // 0-100 Y-axis
  performanceScore: number; // 0-100 X-axis
  safetyScore: number;
  quadrant: 'CRITICAL_ATTENTION' | 'COACHING_OPPORTUNITY' | 'LOW_RISK_DEV' | 'EXEMPLARY_BENCHMARK';
  trend: DriverScoreTrend;
  primaryRiskFactor: string;
}

export interface DriverRankingItem {
  rank: number;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  driverPhotoUrl?: string;
  branchId: string;
  branchName: string;
  vehiclePlate?: string;
  vehicleType?: string;
  riskScore: number;
  riskLevel: DriverRiskLevel;
  safetyScore: number;
  performanceScore: number;
  totalTrips: number;
  totalDistanceKm: number;
  trend: DriverScoreTrend;
  trendDelta: number;
  isTopPerformer: boolean;
  isAttentionRequired: boolean;
  primaryRiskIssue?: string;
}

export interface DriverSafetyRecommendation {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  branchId: string;
  branchName: string;
  focusType: RecommendationFocusType;
  category?: string;
  title: string;
  description?: string;
  reason: string;
  evidence: string[];
  priority: RecommendationPriority;
  suggestedAction: string;
  suggestedCoachingType?: string;
  projectedRiskReduction?: string;
  relatedEventsCount: number;
  relatedEventsTypes: BehaviorEventType[];
  createdAt: string;
  status: 'ACTIVE' | 'COACHING_SCHEDULED' | 'DISMISSED' | 'RESOLVED';
}

export interface AICoachingPlan {
  objective: string;
  keyBehaviors: string[];
  talkingPoints: string[];
  examples: string[];
  recommendedActions: string[];
  followUpMetrics: string[];
  suggestedDurationMinutes: number;
}

export interface DriverCoachingSession {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  coachId: string;
  coachName: string;
  supervisorName?: string;
  title?: string;
  date: string;
  scheduledDate?: string;
  coachingTopic: string;
  category: RecommendationFocusType;
  trigger: string;
  observedBehavior: string;
  aiRecommendation: string;
  aiCoachingPlan?: AICoachingPlan;
  talkingPoints?: string[];
  supervisorNotes: string;
  driverResponse?: string;
  actionPlan: string | string[];
  followUpDate: string;
  status: CoachingStatus;
  priority: RecommendationPriority;
  beforeRiskScore: number;
  beforeSafetyScore: number;
  afterRiskScore?: number;
  afterSafetyScore?: number;
  effectivenessDelta?: number;
  effectivenessSummary?: string;
  driverAcknowledged: boolean;
  acknowledgedAt?: string;
  driverComments?: string;
  followUpAlertActive: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface DriverGoal {
  id: string;
  driverId: string;
  type:
    | 'REDUCE_OVERSPEED'
    | 'REDUCE_HARSH_BRAKING'
    | 'REDUCE_IDLE'
    | 'IMPROVE_ROUTE_COMPLIANCE'
    | 'IMPROVE_INSPECTION_COMPLIANCE'
    | 'MAINTAIN_SAFETY_SCORE';
  title: string;
  description: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  progressPercentage: number;
  trend: DriverScoreTrend;
  startDate: string;
  deadline: string;
  status: 'ACTIVE' | 'ACHIEVED' | 'MISSED';
}

export interface DriverScorecard {
  driverId: string;
  driverName: string;
  employeeId?: string;
  branchName: string;
  period: DriverIntelligencePeriod;
  riskScore: number;
  riskLevel: DriverRiskLevel;
  safetyScore: number;
  safetyGrade: string;
  performanceScore: number;
  totalTrips: number;
  distanceKm: number;
  drivingHours: number;
  eventsSummary: {
    overspeed: number;
    harshBraking: number;
    harshAccel: number;
    sharpTurn: number;
    routeDeviation: number;
    excessiveIdle: number;
    safetyIncidents: number;
    fatigueRiskAlerts: number;
    inspectionPassRate: number;
  };
  benchmarks: {
    fleetAvgRisk: number;
    fleetAvgSafety: number;
    fleetAvgPerformance: number;
    branchAvgRisk: number;
    branchAvgSafety: number;
  };
  aiAssessmentSummary: string;
  keyStrengths: string[];
  keyImprovementAreas: string[];
  activeRecommendationsCount: number;
  completedCoachingCount: number;
  generatedAt: string;
}

export interface DriverAIReport {
  reportId: string;
  tenantId: string;
  period: DriverIntelligencePeriod;
  generatedAt: string;
  generatedBy: string;
  totalDriversMonitored: number;
  fleetAvgRiskScore: number;
  fleetAvgSafetyScore: number;
  fleetAvgPerformanceScore: number;
  riskDistribution: Record<DriverRiskLevel, number>;
  topRiskDrivers: DriverRankingItem[];
  topPerformingDrivers: DriverRankingItem[];
  highPriorityRecommendations: DriverSafetyRecommendation[];
  activeCoachingQueueCount: number;
  executiveSummaryText: string;
}

export interface DriverFilterState {
  period: DriverIntelligencePeriod;
  branchId?: string;
  driverId?: string;
  riskLevel?: DriverRiskLevel | 'ALL';
  searchQuery?: string;
  vehicleType?: string;
}

export interface DriverComparisonResult {
  drivers: {
    driverId: string;
    driverName: string;
    branchName: string;
    vehicleType: string;
    riskScore: number;
    safetyScore: number;
    performanceScore: number;
    overspeedCount: number;
    harshBrakingCount: number;
    harshAccelCount: number;
    sharpTurnCount: number;
    routeDeviationCount: number;
    idleEfficiency: number;
    distanceKm: number;
    tripsCount: number;
    trend: DriverScoreTrend;
  }[];
  peerGroupAverages: {
    riskScore: number;
    safetyScore: number;
    performanceScore: number;
    overspeedCount: number;
    harshBrakingCount: number;
    harshAccelCount: number;
    distanceKm: number;
  };
  comparisonNarrative: string;
}

// ---------------------------------------------------------------------------
// Telematics & Driver Behavior Types (PROMPT 21 / PROMPT 29 Interoperability)
// ---------------------------------------------------------------------------

export type ScorePeriod = '7_DAYS' | '30_DAYS' | '90_DAYS' | 'ALL_TIME' | 'CUSTOM';
export type RiskLevel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_ATTENTION' | 'HIGH_RISK';
export type ScoreTrend = 'IMPROVING' | 'STABLE' | 'DECLINING';

export interface TelemetryPoint {
  timestamp: string;
  speed: number;
  speedLimit?: number;
  heading?: number;
  lat: number;
  lng: number;
  ignition: boolean;
  deceleration?: number;
  acceleration?: number;
}

export interface EventMetadata {
  excessSpeed?: number;
  speedBefore?: number;
  speedAfter?: number;
  roadContext?: string;
  vehicleType?: string;
  turnAngle?: number;
  headingBefore?: number;
  headingAfter?: number;
  plannedRouteId?: string;
  deviationDistance?: number;
  deviationDuration?: number;
  fuelConsumptionEstimate?: number;
  [key: string]: any;
}

export interface DriverBehaviorEvent {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  deviceId?: string;
  tripId?: string;
  tripNumber?: string;
  routeId?: string;
  routeName?: string;
  eventType: BehaviorEventType;
  severity: BehaviorSeverity;
  timestamp: string;
  latitude: number;
  longitude: number;
  locationName: string;
  speed: number;
  speedLimit: number;
  heading?: number;
  deceleration?: number;
  acceleration?: number;
  duration?: number;
  distance?: number;
  riskScore: number;
  confidenceScore: number;
  reviewStatus: ReviewStatus;
  reviewNote?: string;
  reviewedBy?: string;
  metadata?: EventMetadata;
  telemetryBefore?: TelemetryPoint[];
  telemetryAfter?: TelemetryPoint[];
  createdAt: string;
}

export interface DriverBehaviorRule {
  id: string;
  tenantId: string;
  eventType: BehaviorEventType;
  threshold: number;
  duration: number;
  severity: BehaviorSeverity;
  enabled: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverCoaching {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  triggerEventId?: string;
  category: string;
  priority: string;
  recommendation: string;
  assignedTo?: string;
  assignedToName?: string;
  scheduledAt?: string;
  status: CoachingStatus | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  beforeScore?: number;
  afterScore?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverSafetyScoreConfig {
  tenantId: string;
  weights: {
    overspeed: number;
    harshBraking: number;
    harshAcceleration: number;
    sharpTurn: number;
    excessiveIdle: number;
    routeDeviation: number;
    [key: string]: number;
  };
  normalizationBasis: string;
  thresholds: {
    excellent: number;
    good: number;
    fair: number;
    needsAttention: number;
  };
}

export interface DriverSafetySummary {
  driverId: string;
  driverName: string;
  driverPhone?: string;
  simType?: string;
  branchId: string;
  branchName: string;
  vehicleId?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  period: ScorePeriod | DriverIntelligencePeriod | string;
  score: number;
  previousScore: number;
  trend: ScoreTrend | DriverScoreTrend;
  trendDelta: number;
  riskLevel: RiskLevel | string;
  totalEvents: number;
  overspeedCount: number;
  harshBrakingCount: number;
  harshAccelCount: number;
  sharpTurnCount: number;
  idleCount: number;
  routeDeviationCount: number;
  distanceKm: number;
  drivingHours: number;
  eventsPer100Km: number;
  eventsPer10Hours: number;
  rank: number;
  updatedAt: string;
}

export interface BehaviorAIInsight {
  id: string;
  title: string;
  category: string;
  severity: string;
  summary: string;
  explanation: string;
  dataCitations: string[];
  recommendedAction: string;
  coachingPriority: string;
  vehicleId?: string;
  timestamp: string;
}

export interface BehaviorRiskHotspot {
  id: string;
  tenantId: string;
  locationName: string;
  city: string;
  branchName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  totalEvents: number;
  primaryEventType: BehaviorEventType;
  riskLevel: string;
  speedLimitKmH?: number;
  avgExcessSpeed?: number;
}

export type AIDriverCoachingSession = DriverCoachingSession;
export type DriverCoachingStatus = CoachingStatus;
export type DriverCoachingFocusType = RecommendationFocusType;
