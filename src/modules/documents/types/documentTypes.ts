/**
 * Fleet Intelligence Smart AI - Document Management & Expiry Intelligence Types
 * PROMPT 48 - Unified Document Entity, Compliance Engine, OCR, and Expiry Engine Types
 */

export type EntityType = 'VEHICLE' | 'DRIVER' | 'COMPANY' | 'DEVICE' | 'BRANCH' | 'EMPLOYEE';

export type DocumentType =
  // Vehicle
  | 'STNK'
  | 'KIR'
  | 'INSURANCE'
  | 'VEHICLE_CERTIFICATE'
  // Driver
  | 'SIM_A'
  | 'SIM_B1'
  | 'SIM_B2'
  | 'SIM_C'
  | 'DRIVER_CERT'
  | 'TRAINING_CERT'
  | 'MEDICAL_CERT'
  // Company
  | 'BUSINESS_LICENSE'
  | 'OPERATING_LICENSE'
  | 'COMPANY_INSURANCE'
  | 'COMPANY_CERTIFICATE'
  // Device
  | 'GPS_CALIBRATION'
  | 'TELEMATICS_CERT'
  | 'SIM_REGISTRATION'
  // Custom
  | 'CUSTOM';

export type DocumentStatus =
  | 'VALID'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'PENDING_VERIFICATION'
  | 'REJECTED'
  | 'MISSING'
  | 'ARCHIVED';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CORRECTION_REQUIRED';

export type ExpirySeverity = 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DocumentQuality = 'READABLE' | 'PARTIALLY_READABLE' | 'POOR_QUALITY';

export interface DocumentVersion {
  versionNumber: number;
  fileId: string;
  fileName: string;
  fileSize: number; // bytes
  fileType: string; // mime
  fileUrl: string;
  fileHash?: string;
  uploadedBy: string;
  uploadedAt: string;
  changeReason?: string;
}

export type DocumentActionType =
  | 'CREATED'
  | 'UPLOADED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CORRECTION_REQUESTED'
  | 'REPLACED'
  | 'EXPIRY_UPDATED'
  | 'DOWNLOADED'
  | 'VIEWED'
  | 'ARCHIVED'
  | 'RESTORED'
  | 'LEGAL_HOLD_ENABLED'
  | 'LEGAL_HOLD_DISABLED'
  | 'OCR_PROCESSED';

export interface DocumentHistoryLog {
  id: string;
  timestamp: string;
  actor: string;
  action: DocumentActionType;
  details: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
}

export interface DocumentMetadata {
  plateNumber?: string;
  vehicleBrandModel?: string;
  driverName?: string;
  simType?: 'SIM_A' | 'SIM_B1' | 'SIM_B2' | 'SIM_C';
  insuranceProvider?: string;
  policyNumber?: string;
  coverageType?: 'ALL_RISK' | 'TLO' | 'LIABILITY' | 'CARGO';
  coverageLimit?: number;
  premium?: number;
  inspectionAuthority?: string; // e.g. "Dishub DKI Jakarta"
  testingLocation?: string;
  certificationName?: string; // e.g. "Defensive Driving", "Hazmat Transport"
  issuer?: string;
  branchName?: string;
  departmentName?: string;
  notes?: string;
  customTypeName?: string;
  ocrConfidence?: number;
}

export interface OcrExtractionResult {
  documentNumber?: string;
  entityName?: string;
  plateNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuer?: string;
  policyNumber?: string;
  detectedType?: DocumentType;
  confidence: number; // 0 - 100
  quality: DocumentQuality;
  possibleMismatch?: boolean;
  mismatchReason?: string;
  rawExtractedText?: string;
  extractedFields: Array<{
    field: string;
    label: string;
    value: string;
    confidence: number;
    confirmed: boolean;
  }>;
}

export interface DocumentItem {
  id: string;
  tenantId: string;
  documentType: DocumentType;
  customTypeName?: string;
  title: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  fileId: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string; // e.g. 'application/pdf', 'image/jpeg'
  fileUrl: string;
  signedUrl?: string;
  signedUrlExpiresAt?: string;
  fileHash?: string;
  documentNumber: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  daysRemaining: number;
  status: DocumentStatus;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  correctionNotes?: string;
  currentVersion: number;
  versions: DocumentVersion[];
  historyLogs: DocumentHistoryLog[];
  legalHold: boolean;
  legalHoldReason?: string;
  metadata: DocumentMetadata;
  ocrResult?: OcrExtractionResult;
  lastNotificationSentThreshold?: number; // e.g. 30, 14, 7, 1, 0
  uploadedBy: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissingDocumentItem {
  id: string;
  tenantId: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  documentType: DocumentType;
  documentTypeName: string;
  requiredByTemplate: string;
  urgency: 'HIGH' | 'CRITICAL';
  status: 'MISSING';
  impactDescription: string;
}

export interface DocumentRequirementRule {
  id: string;
  name: string;
  entityType: EntityType;
  targetCategory: string; // e.g. 'truck_box', 'heavy_equipment', 'delivery_driver'
  requiredDocumentTypes: DocumentType[];
  enforceOperationalRestriction: boolean; // if true, expired/missing blocks dispatch/assign
  warningThresholdDays: number;
  description: string;
}

export interface DocumentRequirementTemplate {
  id: string;
  name: string;
  code: string;
  description: string;
  entityType: EntityType;
  targetDescription: string;
  requiredDocuments: Array<{
    type: DocumentType;
    name: string;
    criticality: 'MANDATORY' | 'RECOMMENDED';
    renewalWindowDays: number;
  }>;
  activeUnitCount: number;
}

export interface ExpiryThresholdConfig {
  infoDays: number; // default 90
  mediumDays: number; // default 60
  highDays: number; // default 30
  urgentDays: number; // default 14
  criticalDays: number; // default 7
  finalWarningDays: number; // default 1
}

export interface StorageQuotaInfo {
  usedBytes: number;
  totalBytes: number;
  usedFormatted: string;
  totalFormatted: string;
  percentageUsed: number;
  totalDocuments: number;
  maxDocumentsAllowed: number;
  ocrScansUsedMonth: number;
  ocrScansLimitMonth: number;
}

export interface DocumentComplianceSummary {
  fleetComplianceScore: number; // 0 - 100%
  vehicleComplianceScore: number; // 0 - 100%
  driverComplianceScore: number; // 0 - 100%
  companyComplianceScore: number; // 0 - 100%
  totalDocuments: number;
  validCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  pendingVerificationCount: number;
  rejectedCount: number;
  missingRequiredCount: number;
  archivedCount: number;
  operationalRestrictionsActive: number;
  storageQuota: StorageQuotaInfo;
}

export interface ExpiringGroupedSummary {
  today: DocumentItem[];
  next1to7Days: DocumentItem[];
  next8to30Days: DocumentItem[];
  next31to60Days: DocumentItem[];
  next61to90Days: DocumentItem[];
}

export interface ExpiredGroupedSummary {
  expiredToday: DocumentItem[];
  overdue1to7Days: DocumentItem[];
  overdue8to30Days: DocumentItem[];
  overdue30PlusDays: DocumentItem[];
}

export interface DocumentFilter {
  search?: string;
  entityType?: EntityType | 'ALL';
  documentType?: DocumentType | 'ALL';
  status?: DocumentStatus | 'ALL';
  verificationStatus?: VerificationStatus | 'ALL';
  branch?: string;
  expiringWithinDays?: number;
  expiredOnly?: boolean;
  legalHoldOnly?: boolean;
  pendingVerificationOnly?: boolean;
  missingOnly?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface DocumentAiPromptResponse {
  query: string;
  answer: string;
  suggestedActions: Array<{
    label: string;
    actionType: 'FILTER' | 'NAVIGATE' | 'CREATE_TASK' | 'SEND_REMINDER';
    payload?: any;
  }>;
  relatedDocuments?: DocumentItem[];
}
