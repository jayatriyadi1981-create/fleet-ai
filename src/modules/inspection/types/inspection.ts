/**
 * Fleet Intelligence Smart AI - Vehicle Inspection Domain Types
 * Enterprise Pre-Trip, Post-Trip, and Smart AI Inspection Architecture
 */

export type InspectionType = 
  | 'PRE_TRIP' 
  | 'POST_TRIP' 
  | 'PERIODIC' 
  | 'SAFETY' 
  | 'MAINTENANCE' 
  | 'BREAKDOWN';

export type InspectionStatus = 
  | 'DRAFT' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'REVIEW_REQUIRED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELLED';

export type InspectionResult = 
  | 'PASS' 
  | 'ATTENTION' 
  | 'FAIL' 
  | 'CRITICAL';

export type ItemConditionResult = 
  | 'PASS' 
  | 'ATTENTION' 
  | 'FAIL' 
  | 'NOT_APPLICABLE';

export type IssueSeverity = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH' 
  | 'CRITICAL';

export type InspectionCategoryType = 
  | 'TIRE' 
  | 'BRAKE' 
  | 'LIGHT' 
  | 'OIL' 
  | 'BATTERY' 
  | 'BODY' 
  | 'SAFETY_EQUIPMENT' 
  | 'CARGO_COLD_CHAIN' 
  | 'CUSTOM';

export interface PhotoAnnotation {
  id: string;
  type: 'draw' | 'arrow' | 'circle' | 'text';
  color: string;
  points?: number[];
  text?: string;
  x?: number;
  y?: number;
}

export interface InspectionPhotoMetadata {
  id: string;
  inspectionId: string;
  inspectionItemId?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  category: InspectionCategoryType;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  uploadedBy: string;
  uploaderName: string;
  annotations?: PhotoAnnotation[];
  syncStatus?: 'synced' | 'pending' | 'uploading' | 'failed';
  aiAnalysis?: {
    analyzed: boolean;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    potentialIssues: string[];
    suggestedSeverity?: IssueSeverity;
    notes?: string;
  };
  createdAt: string;
}

export interface InspectionItem {
  id: string;
  inspectionId: string;
  category: InspectionCategoryType;
  itemCode: string;
  itemName: string;
  description?: string;
  required: boolean;
  result: ItemConditionResult;
  severity?: IssueSeverity;
  value?: string | number | boolean;
  unit?: string;
  notes?: string;
  inspectorNotes?: string;
  photoRequired: boolean;
  photos: InspectionPhotoMetadata[];
  groundingTrigger?: boolean; // triggers vehicle grounding if FAIL
  conditionalTriggered?: boolean;
  conditionalResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  type: 'start' | 'check' | 'photo' | 'alert' | 'submit' | 'workorder' | 'approval' | 'rejection';
}

export interface VehicleInspection {
  id: string;
  tenantId: string;
  branchId: string;
  inspectionNumber: string; // e.g. INS-2026-00108
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleType: string;
  driverId: string;
  driverName: string;
  tripId?: string;
  tripRoute?: string;
  type: InspectionType;
  status: InspectionStatus;
  result: InspectionResult;
  startedAt: string;
  completedAt?: string;
  odometer: number;
  previousOdometer: number;
  odometerConsistent: boolean;
  engineHours?: number;
  previousEngineHours?: number;
  locationName: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracy?: number;
  notes?: string;
  overallScore: number; // 0 - 100
  signature?: {
    signatureUrl: string;
    signedAt: string;
    signedBy: string;
    declarationAccepted: boolean;
  };
  items: InspectionItem[];
  photos: InspectionPhotoMetadata[];
  grounded: boolean;
  groundingReason?: string;
  workOrderId?: string;
  workOrderCreated?: boolean;
  complianceValidUntil?: string;
  timeline: InspectionTimelineEvent[];
  offlineSaved?: boolean;
  syncStatus?: 'synced' | 'local_only' | 'syncing' | 'conflict';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionIssue {
  id: string;
  tenantId: string;
  inspectionId: string;
  inspectionNumber: string;
  inspectionItemId?: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  category: InspectionCategoryType;
  itemCode: string;
  itemName: string;
  severity: IssueSeverity;
  description: string;
  status: 'OPEN' | 'IN_REVIEW' | 'WORK_ORDER_CREATED' | 'RESOLVED' | 'REJECTED';
  workOrderId?: string;
  workOrderNumber?: string;
  photoUrls: string[];
  groundingIssue: boolean;
  reportedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  postRepairVerification?: {
    verified: boolean;
    verificationDate: string;
    verifierName: string;
    result: 'PASS' | 'FAIL';
    notes: string;
  };
  createdAt: string;
}

export interface ChecklistItemTemplate {
  id: string;
  itemCode: string;
  itemName: string;
  category: InspectionCategoryType;
  description: string;
  required: boolean;
  photoRequiredOnFail: boolean;
  alwaysRequirePhoto?: boolean;
  severityIfFailed: IssueSeverity;
  causesGroundingIfFailed: boolean;
  defaultValue?: string;
  conditionalPrompt?: string;
  points: number; // For scoring calculation
}

export interface InspectionTemplate {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description: string;
  inspectionType: InspectionType;
  vehicleTypes: string[]; // ['truck_box', 'truck_container', 'van', etc.]
  categories: {
    category: InspectionCategoryType;
    title: string;
    icon: string;
    items: ChecklistItemTemplate[];
  }[];
  rules: {
    id: string;
    conditionField: string;
    conditionOperator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS';
    conditionValue: string;
    action: 'GROUND_VEHICLE' | 'CREATE_WORK_ORDER' | 'NOTIFY_MANAGER' | 'FLAG_CRITICAL';
    severity: IssueSeverity;
    description: string;
  }[];
  scoring: {
    passThreshold: number; // e.g. 85
    attentionThreshold: number; // e.g. 70
    weightPerCategory?: Record<string, number>;
  };
  signatureRequired: boolean;
  active: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionAnalyticsData {
  totalInspections: number;
  todayInspections: number;
  complianceRatePercent: number;
  passCount: number;
  attentionCount: number;
  failCount: number;
  criticalCount: number;
  groundedVehiclesCount: number;
  openIssuesCount: number;
  avgDurationMinutes: number;
  passRatePercent: number;
  categoryFailureBreakdown: {
    category: InspectionCategoryType;
    label: string;
    count: number;
    percentage: number;
  }[];
  topFailingVehicles: {
    vehicleId: string;
    vehiclePlate: string;
    model: string;
    failCount: number;
    lastFailedCategory: string;
    healthScore: number;
  }[];
  topDriverReporting: {
    driverId: string;
    driverName: string;
    completedCount: number;
    passRate: number;
    issuesReported: number;
  }[];
  timelineTrend: {
    date: string;
    pass: number;
    attention: number;
    fail: number;
    critical: number;
  }[];
  resolutionAvgHours: number;
}

export interface InspectionAiInsight {
  id: string;
  type: 'REPEAT_ISSUE' | 'PREDICTIVE_FAILURE' | 'ANOMALY_DETECTION' | 'EXECUTIVE_SUMMARY' | 'SAFETY_CORRELATION';
  title: string;
  summary: string;
  vehicleId?: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  category?: InspectionCategoryType;
  severity: IssueSeverity;
  confidenceScore: number; // 0 - 100
  evidenceCount: number;
  recommendation: string;
  actionRequired: string;
  detectedAt: string;
}
