/**
 * Safety Management & Incident Intelligence Types
 * PROMPT 22 Architecture
 */

export type AccidentType =
  | 'VEHICLE_COLLISION'
  | 'PEDESTRIAN_ACCIDENT'
  | 'ROLLOVER'
  | 'VEHICLE_DAMAGE'
  | 'PROPERTY_DAMAGE'
  | 'FATAL_ACCIDENT'
  | 'OTHER';

export type AccidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'FATAL';

export type AccidentStatus =
  | 'REPORTED'
  | 'ACKNOWLEDGED'
  | 'UNDER_INVESTIGATION'
  | 'ACTION_REQUIRED'
  | 'MONITORING'
  | 'RESOLVED'
  | 'CLOSED';

export interface Accident {
  id: string;
  tenantId: string;
  incidentNumber: string; // e.g. ACC-2026-000001
  type: AccidentType;
  status: AccidentStatus;
  severity: AccidentSeverity;
  dateTime: string;
  reportedAt: string;
  location: string;
  latitude: number;
  longitude: number;
  driverId: string;
  driverName?: string;
  vehicleId: string;
  vehiclePlate?: string;
  deviceId?: string;
  tripId?: string;
  routeId?: string;
  routeName?: string;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  description: string;
  weatherCondition: 'CLEAR' | 'RAIN' | 'FOG' | 'STORM' | 'NIGHT_LOW_VISIBILITY';
  roadCondition: 'DRY' | 'WET' | 'SLIPPERY' | 'DAMAGED' | 'CONSTRUCTION';
  injuries: number;
  fatalities: number;
  propertyDamage: boolean;
  estimatedLossIdr: number;
  policeReportNumber?: string;
  investigationId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type IncidentType =
  | 'OPERATIONAL'
  | 'VEHICLE'
  | 'DRIVER'
  | 'SAFETY'
  | 'EQUIPMENT'
  | 'ENVIRONMENTAL'
  | 'SECURITY'
  | 'OTHER';

export interface Incident {
  id: string;
  tenantId: string;
  incidentNumber: string; // e.g. INC-2026-000001
  type: IncidentType;
  severity: AccidentSeverity;
  status: AccidentStatus;
  dateTime: string;
  location: string;
  latitude: number;
  longitude: number;
  driverId: string;
  driverName?: string;
  vehicleId: string;
  vehiclePlate?: string;
  tripId?: string;
  routeId?: string;
  description: string;
  impact: string;
  operationalImpact: 'NONE' | 'MINOR_DELAY' | 'MAJOR_DELAY' | 'TRIP_CANCELLED';
  investigationId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NearMiss {
  id: string;
  tenantId: string;
  nearMissNumber: string; // e.g. NM-2026-000001
  type: string; // e.g. "Near Collision", "Pedestrian Avoidance", "Cargo Unstable"
  severity: AccidentSeverity;
  dateTime: string;
  location: string;
  latitude: number;
  longitude: number;
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  tripId?: string;
  routeId?: string;
  description: string;
  potentialConsequence: string;
  actualConsequence: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyObservation {
  id: string;
  tenantId: string;
  observationNumber: string; // e.g. OBS-2026-000001
  category: 'UNSAFE_DRIVING' | 'UNSAFE_VEHICLE' | 'UNSAFE_ROAD' | 'UNSAFE_LOADING' | 'GOOD_SAFETY_BEHAVIOR';
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  dateTime: string;
  location: string;
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  description: string;
  photoEvidence?: string;
  recommendation: string;
  status: 'OPEN' | 'REVIEWED' | 'ACTION_TAKEN';
  createdBy: string;
  createdAt: string;
}

export interface SafetyEvent {
  id: string;
  tenantId: string;
  eventType: 'EXTREME_DECELERATION' | 'SUDDEN_STOP' | 'IMPACT_SENSOR' | 'ROLLOVER_SENSOR' | 'PANIC_BUTTON';
  source: 'GPS_TELEMETRY' | 'DASHCAM_AI' | 'DRIVER_PANIC' | 'CANBUS_FAULT';
  timestamp: string;
  latitude: number;
  longitude: number;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  deviceId?: string;
  tripId?: string;
  confidenceScore: number; // 0-100%
  status: 'DETECTED' | 'REVIEW_REQUIRED' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'RESOLVED';
  linkedAccidentId?: string;
  linkedIncidentId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type InvestigationStatus =
  | 'REPORTED'
  | 'INVESTIGATION'
  | 'EVIDENCE'
  | 'ANALYSIS'
  | 'ROOT_CAUSE'
  | 'CORRECTIVE_ACTION'
  | 'VERIFICATION'
  | 'CLOSED';

export interface InvestigationTeamMember {
  id: string;
  investigationId: string;
  userId: string;
  userName: string;
  role: 'LEAD_INVESTIGATOR' | 'INVESTIGATOR' | 'REVIEWER' | 'APPROVER';
}

export interface Investigation {
  id: string;
  tenantId: string;
  investigationNumber: string; // e.g. INV-2026-000001
  caseType: 'ACCIDENT' | 'INCIDENT' | 'NEAR_MISS';
  caseId: string;
  caseNumber: string; // ACC-2026-000001, etc.
  leadInvestigatorId: string;
  leadInvestigatorName: string;
  status: InvestigationStatus;
  startDate: string;
  targetDate: string;
  completedDate?: string;
  summary: string;
  findings: string;
  rootCause?: string;
  conclusion?: string;
  teamMembers: InvestigationTeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type EvidenceType =
  | 'PHOTO'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'GPS_DATA'
  | 'TELEMETRY'
  | 'DASHCAM'
  | 'WITNESS_STATEMENT'
  | 'POLICE_REPORT'
  | 'DRIVER_STATEMENT';

export interface Evidence {
  id: string;
  tenantId: string;
  investigationId: string;
  type: EvidenceType;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: string;
  description: string;
  capturedAt: string;
  capturedBy: string;
  location?: string;
  hash: string; // SHA-256 integrity simulation
  createdAt: string;
}

export interface FishboneCategories {
  people: string[];
  vehicle: string[];
  equipment: string[];
  environment: string[];
  process: string[];
  management: string[];
  road: string[];
  weather: string[];
}

export interface RootCauseAnalysis {
  id: string;
  investigationId: string;
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  fishbone: FishboneCategories;
  contributingFactors: string[];
  aiSuggestedFindings?: string;
  investigatorConfirmed: boolean;
}

export interface WitnessStatement {
  id: string;
  investigationId: string;
  witnessName: string;
  contact: string;
  statement: string;
  date: string;
  attachmentUrl?: string;
}

export interface DriverStatement {
  id: string;
  investigationId: string;
  driverId: string;
  driverName: string;
  statement: string;
  date: string;
  signatureUrl?: string;
}

export type CAPAStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'CLOSED'
  | 'OVERDUE';

export type CAPAPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CorrectiveAction {
  id: string;
  tenantId: string;
  actionNumber: string; // e.g. CAPA-2026-000001
  sourceType: 'ACCIDENT' | 'INCIDENT' | 'NEAR_MISS' | 'OBSERVATION';
  sourceId: string;
  sourceNumber: string;
  type: 'CORRECTIVE' | 'PREVENTIVE';
  title: string;
  description: string;
  rootCause: string;
  priority: CAPAPriority;
  assignedTo: string;
  assignedToName: string;
  departmentId?: string;
  departmentName?: string;
  dueDate: string;
  status: CAPAStatus;
  verificationRequired: boolean;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyScoreConfig {
  accidentWeight: number; // e.g. 35%
  incidentWeight: number; // e.g. 25%
  nearMissWeight: number; // e.g. 10%
  driverBehaviorWeight: number; // e.g. 20%
  capaWeight: number; // e.g. 10%
}

export const DEFAULT_SAFETY_SCORE_CONFIG: SafetyScoreConfig = {
  accidentWeight: 35,
  incidentWeight: 25,
  nearMissWeight: 10,
  driverBehaviorWeight: 20,
  capaWeight: 10,
};

export interface FleetSafetyScoreMetrics {
  score: number; // 0-100
  previousPeriodScore: number;
  changePercent: number;
  totalDistanceKm: number;
  totalTrips: number;
  accidentsCount: number;
  incidentsCount: number;
  nearMissCount: number;
  openCapasCount: number;
  overdueCapasCount: number;
  lostTimeIncidents: number;
  severityRate: number; // per 100k km
  frequencyRate: number; // per 100k km
}

export interface SafetyFilterState {
  dateRange: 'today' | '7d' | '30d' | '90d' | '12m' | 'custom';
  branchId?: string;
  departmentId?: string;
  vehicleGroupId?: string;
  vehicleId?: string;
  driverId?: string;
  routeId?: string;
  severity?: string;
  status?: string;
}
