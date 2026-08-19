/**
 * AI Safety Intelligence Types & Schemas
 * PROMPT 33 Architecture
 */

import { Accident, Incident, NearMiss, CorrectiveAction, Investigation, Evidence } from '../../safety/types';

export type SafetyRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
export type RiskTrendDirection = 'INCREASING' | 'STABLE' | 'DECREASING' | 'INSUFFICIENT_DATA';
export type DataQualityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

export type FactorConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type ContributingCategory =
  | 'DRIVER'
  | 'VEHICLE'
  | 'ENVIRONMENT'
  | 'ROUTE'
  | 'TRAFFIC'
  | 'FATIGUE'
  | 'OPERATIONAL'
  | 'MECHANICAL'
  | 'UNKNOWN';

export type SafetyIntelligenceTabKey =
  | 'OVERVIEW'
  | 'INCIDENT_INTELLIGENCE'
  | 'ACCIDENT_INTELLIGENCE'
  | 'INCIDENT_AI'
  | 'ACCIDENT_AI'
  | 'RISK_PREDICTION'
  | 'DRIVER_SAFETY'
  | 'VEHICLE_SAFETY'
  | 'ROUTE_SAFETY'
  | 'FATIGUE_SAFETY'
  | 'PATTERNS_HOTSPOTS'
  | 'INVESTIGATION_5WHY'
  | 'INVESTIGATION_AI'
  | 'COACHING_CAPA'
  | 'ADVISOR'
  | 'REPORTS';

export interface SafetyGlobalFilter {
  dateRange: 'TODAY' | '7D' | '30D' | '90D' | 'THIS_YEAR' | 'CUSTOM';
  branch: string;
  department: string;
  vehicleGroup: string;
  driverId: string;
  vehicleId: string;
  routeId: string;
  riskLevel: string;
  safetyStatus: string;
  searchQuery: string;
}

export interface AISafetyKPIs {
  totalIncidents: number;
  totalAccidents: number;
  nearMissCount: number;
  openInvestigations: number;
  highRiskDriversCount: number;
  highRiskVehiclesCount: number;
  highRiskRoutesCount: number;
  overallSafetyScore: number;
  previousSafetyScore: number;
  safetyScoreChangePct: number;
  incidentRatePer100kKm: number;
  accidentRatePer100kKm: number;
  correctiveActionCompletionPct: number;
  fatigueRiskIndex: number;
  dataQuality: DataQualityLevel;
  totalExposureKm: number;
}

export interface IncidentTimelinePoint {
  timeOffsetSeconds: number; // e.g. -15s, 0s (event), +10s
  timestamp: string;
  speedKmh: number;
  rpm?: number;
  brakeApplied?: boolean;
  accelerationG?: number;
  lateralG?: number;
  eventDescription: string;
  eventType: 'NORMAL' | 'SPEEDING' | 'HARSH_BRAKE' | 'HARSH_ACCEL' | 'IMPACT' | 'STOP' | 'DEVIATION';
  locationName: string;
  latitude: number;
  longitude: number;
}

export interface ContributingFactorItem {
  id: string;
  category: ContributingCategory;
  title: string;
  description: string;
  confidence: FactorConfidence;
  evidenceSource: string[];
  isObservedFact: boolean; // true if backed by direct telemetry data
}

export interface IncidentAIAnalysis {
  incidentId: string;
  incidentNumber: string;
  analysisTimestamp: string;
  modelVersion: string;
  dataQuality: DataQualityLevel;
  summary: string;
  observedFacts: string[];
  potentialContributingFactors: ContributingFactorItem[];
  riskFactors: string[];
  timeline: IncidentTimelinePoint[];
  timelineCompleteness: 'FULL' | 'PARTIAL' | 'UNAVAILABLE';
  aiSuggestedSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  companyPolicySeverity?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  patternIdentified?: string;
  recommendedActions: string[];
  missingEvidence: string[];
  investigationQuestions: string[];
  humanReviewStatus: 'NOT_REVIEWED' | 'REVIEWED_CONFIRMED' | 'MODIFIED_BY_HUMAN';
  reviewerNotes?: string;
}

export interface AccidentAIAnalysis {
  accidentId: string;
  accidentNumber: string;
  analysisTimestamp: string;
  modelVersion: string;
  dataQuality: DataQualityLevel;
  summary: string;
  eventTimeline: IncidentTimelinePoint[];
  impactGForce?: number;
  impactSensorAvailable: boolean;
  preCrashSpeedKmh?: number;
  speedAtImpactKmh?: number;
  decelerationRateG?: number;
  potentialFactors: ContributingFactorItem[];
  evidenceCorrelations: {
    telemetryEvidence: string[];
    driverBehaviorEvidence: string[];
    fatigueTelemetryEvidence: string[];
    vehicleInspectionEvidence: string[];
    maintenanceRecordEvidence: string[];
    externalConditionEvidence: string[];
  };
  missingEvidenceGaps: string[];
  rootCauseHierarchy: {
    immediateCause: string;
    contributingCause: string;
    underlyingCause: string;
    systemicCause: string;
  };
  recommendedActions: string[];
  humanApproval: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
    approvedAt?: string;
  };
}

export interface DriverSafetyProfile {
  driverId: string;
  driverName: string;
  avatarUrl?: string;
  branch: string;
  overallSafetyScore: number;
  riskLevel: SafetyRiskLevel;
  riskTrend: RiskTrendDirection;
  overspeedEventsLast30d: number;
  harshBrakingLast30d: number;
  harshAccelerationLast30d: number;
  fatigueAlertsLast30d: number;
  incidentsLast90d: number;
  accidentsLast90d: number;
  totalDrivingHoursLast30d: number;
  scoreBreakdown: {
    behaviorScore: number;
    fatigueComplianceScore: number;
    routeComplianceScore: number;
    inspectionComplianceScore: number;
    incidentDeduction: number;
  };
  recommendedCoachingTopic: string;
  isCoachingAssigned: boolean;
}

export interface VehicleSafetyProfile {
  vehicleId: string;
  plateNumber: string;
  model: string;
  vehicleType: string;
  branch: string;
  overallSafetyScore: number;
  riskLevel: SafetyRiskLevel;
  riskTrend: RiskTrendDirection;
  maintenanceRiskScore: number; // from Prompt 31
  inspectionFailureCount30d: number;
  brakeConditionStatus: 'OPTIMAL' | 'DEGRADED' | 'ATTENTION_REQUIRED' | 'UNAVAILABLE';
  tireConditionStatus: 'OPTIMAL' | 'FAIR' | 'WORN' | 'UNAVAILABLE';
  batteryStatus: 'OPTIMAL' | 'FAIR' | 'REPLACE_SOON' | 'UNAVAILABLE';
  engineHealthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'UNAVAILABLE';
  recentIncidentsCount: number;
  recommendedAction: string;
}

export interface RouteSafetyProfile {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  totalTripsCompleted: number;
  riskLevel: SafetyRiskLevel;
  safetyScore: number;
  riskTrend: RiskTrendDirection;
  historicalIncidentsCount: number;
  historicalAccidentsCount: number;
  nearMissCount: number;
  corridorDeviationFrequency: number;
  identifiedHotspotsCount: number;
  roadComplexityFactor: 'LOW' | 'MEDIUM' | 'HIGH';
  nightIncidentRatioPct: number;
  recommendedSafetyGuidance: string;
}

export interface SafetyHotspot {
  id: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  incidentCount: number;
  accidentCount: number;
  nearMissCount: number;
  primaryPattern: string;
  riskLevel: SafetyRiskLevel;
  affectedRoutes: string[];
  recommendedMitigation: string;
}

export interface SafetyPatternItem {
  id: string;
  patternType: 'REPEATED_OVERSPEED' | 'REPEATED_HARSH_BRAKING' | 'ROUTE_DEVIATION' | 'FATIGUE_PEAK' | 'VEHICLE_BRAKE_DECAY' | 'LOCATION_HOTSPOT';
  title: string;
  description: string;
  scope: 'DRIVER_SPECIFIC' | 'ROUTE_SPECIFIC' | 'VEHICLE_SPECIFIC' | 'SYSTEM_WIDE';
  observedCount: number;
  confidence: FactorConfidence;
  evidenceDetails: string[];
  suggestedIntervention: string;
}

export interface SafetyRecommendationItem {
  id: string;
  recommendationType:
    | 'DRIVER_COACHING'
    | 'VEHICLE_INSPECTION'
    | 'MAINTENANCE_ESCALATION'
    | 'ROUTE_CHANGE'
    | 'SHIFT_ADJUSTMENT'
    | 'REST_RECOMMENDATION'
    | 'TRAINING'
    | 'OPERATIONAL_CONTROL'
    | 'GEOFENCE_CONTROL'
    | 'ALERT_RULE_ADJUSTMENT'
    | 'INVESTIGATION'
    | 'CORRECTIVE_ACTION'
    | 'PREVENTIVE_ACTION';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  reason: string;
  evidence: string[];
  targetEntity: {
    type: 'DRIVER' | 'VEHICLE' | 'ROUTE' | 'FLEET' | 'BRANCH';
    id: string;
    name: string;
  };
  ownerDepartment: string;
  suggestedDeadlineDays: number;
  expectedOutcome: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';
  createdAt: string;
}

export interface FiveWhyAnalysis {
  investigationId: string;
  incidentNumber: string;
  problemStatement: string;
  why1: { question: string; answer: string; evidence: string; confirmedByHuman: boolean };
  why2: { question: string; answer: string; evidence: string; confirmedByHuman: boolean };
  why3: { question: string; answer: string; evidence: string; confirmedByHuman: boolean };
  why4: { question: string; answer: string; evidence: string; confirmedByHuman: boolean };
  why5: { question: string; answer: string; evidence: string; confirmedByHuman: boolean };
  rootCauseConclusion: string;
  actionItem: string;
}

export interface SafetyCoachingPlan {
  id: string;
  driverId: string;
  driverName: string;
  objective: string;
  observedPattern: string;
  recommendedTopics: string[];
  suggestedActivities: string[];
  followUpMetric: string;
  evaluationPeriodDays: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedCoach?: string;
  createdAt: string;
}

export interface SafetyInvestigationReport {
  reportId: string;
  generatedAt: string;
  generatedBy: string;
  tenantId: string;
  modelVersion: string;
  dataPeriod: string;
  executiveSummary: string;
  safetyKPIs: AISafetyKPIs;
  highRiskDrivers: DriverSafetyProfile[];
  highRiskVehicles: VehicleSafetyProfile[];
  highRiskRoutes: RouteSafetyProfile[];
  topHotspots: SafetyHotspot[];
  activeRecommendations: SafetyRecommendationItem[];
  disclaimer: string;
}
