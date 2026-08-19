/**
 * Fleet Intelligence Smart AI - Driver Management Domain Types
 * PROMPT 11 - Driver Master Data, SIMs, Assignments, Shifts, Performance & AI Intelligence
 */

import { Location } from './index';

export type EmploymentStatus =
  | 'active'
  | 'inactive'
  | 'on_leave'
  | 'suspended'
  | 'resigned'
  | 'terminated';

export type OperationalAvailability =
  | 'available'
  | 'assigned'
  | 'on_trip'
  | 'off_duty'
  | 'unavailable';

export type EmploymentType =
  | 'permanent'
  | 'contract'
  | 'outsourced'
  | 'freelance'
  | 'other';

export type LicenseType =
  | 'SIM A'
  | 'SIM A Umum'
  | 'SIM B1'
  | 'SIM B1 Umum'
  | 'SIM B2'
  | 'SIM B2 Umum'
  | 'SIM C'
  | 'SIM D'
  | 'Other';

export type LicenseExpiryStatus = 'valid' | 'expiring_soon' | 'expired' | 'unknown';

export interface DriverLicense {
  licenseId: string;
  driverId: string;
  licenseNumber: string;
  licenseType: LicenseType;
  issuingAuthority?: string;
  issuedDate?: string;
  expiryDate: string;
  status: LicenseExpiryStatus;
  documentUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export type AssignmentType =
  | 'primary'
  | 'secondary'
  | 'temporary'
  | 'replacement'
  | 'training';

export type AssignmentStatus =
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface DriverAssignment {
  assignmentId: string;
  tenantId: string;
  driverId: string;
  driverName?: string;
  vehicleId: string;
  vehiclePlate?: string;
  vehicleName?: string;
  gpsDeviceId?: string;
  gpsStatus?: 'online' | 'offline' | 'delayed' | 'never_connected';
  startAt: string;
  endAt?: string;
  assignmentType: AssignmentType;
  status: AssignmentStatus;
  assignedBy: string;
  reason?: string;
  createdAt: string;
}

export interface ShiftMaster {
  id: string;
  tenantId: string;
  name: string; // e.g. "Shift Pagi"
  startTime: string; // "06:00"
  endTime: string; // "14:00"
  breakMinutes: number;
  timezone: string;
  status: 'active' | 'inactive';
}

export type ShiftStatus =
  | 'scheduled'
  | 'checked_in'
  | 'active'
  | 'completed'
  | 'missed'
  | 'cancelled';

export interface DriverShift {
  driverShiftId: string;
  tenantId: string;
  driverId: string;
  driverName?: string;
  shiftId: string;
  shiftName: string;
  date: string; // YYYY-MM-DD
  startAt: string; // ISO string or time
  endAt: string;
  status: ShiftStatus;
  checkInId?: string;
  assignedBy: string;
  notes?: string;
}

export interface DriverCheckIn {
  checkInId: string;
  driverId: string;
  shiftId: string;
  timestamp: string;
  location?: Location;
  method: 'manual' | 'mobile' | 'qr' | 'biometric' | 'other';
  status: 'success' | 'flagged' | 'rejected';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface DriverDocument {
  id: string;
  driverId: string;
  tenantId: string;
  type: 'sim' | 'ktp' | 'employee_id' | 'medical_clearance' | 'training_cert' | 'safety_cert' | 'other';
  title: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'pending_verification' | 'verified' | 'rejected' | 'expired' | 'archived';
  documentUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface DriverTraining {
  id: string;
  driverId: string;
  tenantId: string;
  trainingName: string;
  category: 'safety' | 'defensive_driving' | 'vehicle_operation' | 'emergency' | 'hse' | 'other';
  provider: string;
  date: string;
  expiryDate?: string;
  status: 'completed' | 'scheduled' | 'expired' | 'failed';
  certificateUrl?: string;
  score?: number;
  notes?: string;
}

export interface DriverSafetyEvent {
  id: string;
  driverId: string;
  vehicleId?: string;
  vehiclePlate?: string;
  timestamp: string;
  type:
    | 'speeding'
    | 'harsh_braking'
    | 'harsh_acceleration'
    | 'harsh_cornering'
    | 'excessive_idling'
    | 'gps_tampering'
    | 'unauthorized_use';
  severity: 'critical' | 'warning' | 'info';
  speedKmH?: number;
  speedLimitKmH?: number;
  location?: Location;
  details?: string;
}

export interface DriverAIIntelligence {
  driverId: string;
  safetyScore: number; // 0 - 100
  overallRating: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  drivingBehaviorSummary: string;
  positivePoints: string[];
  attentionPoints: string[];
  recommendations: string[];
  confidenceScore: number; // e.g. 88
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  anomalies: {
    id: string;
    title: string;
    description: string;
    impact: string;
  }[];
  coaching: {
    focusArea: string;
    suggestion: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export interface DriverActivityLog {
  id: string;
  driverId: string;
  tenantId: string;
  timestamp: string;
  eventType:
    | 'driver_created'
    | 'driver_updated'
    | 'license_added'
    | 'license_verified'
    | 'vehicle_assigned'
    | 'vehicle_unassigned'
    | 'shift_assigned'
    | 'training_completed'
    | 'status_changed'
    | 'document_uploaded'
    | 'performance_reviewed';
  title: string;
  description: string;
  performedBy: string;
}

export interface DriverExtended {
  id: string; // driverId
  driverId: string;
  tenantId: string;
  employeeId: string;
  driverCode: string; // e.g. DRV-000001
  fullName: string;
  displayName: string;
  photoUrl?: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  branchId: string;
  branchName: string;
  departmentId?: string;
  departmentName?: string;
  position: string;
  status: EmploymentStatus;
  availabilityStatus: OperationalAvailability;
  employmentType: EmploymentType;
  joinDate: string;
  resignDate?: string;
  emergencyContact: EmergencyContact;

  // Active Assignments & Status
  currentVehicleId?: string;
  currentVehiclePlate?: string;
  currentVehicleName?: string;
  currentGpsDeviceId?: string;
  currentGpsStatus?: 'online' | 'offline' | 'delayed' | 'never_connected';
  currentShiftId?: string;
  currentShiftName?: string;
  currentTripId?: string;
  currentTripNumber?: string;

  // Licenses
  licenses: DriverLicense[];
  primaryLicenseNumber?: string;
  primaryLicenseType?: LicenseType;
  primaryLicenseExpiry?: string;
  licenseStatus: LicenseExpiryStatus;

  // Performance Foundations
  safetyScore: number; // 0 - 100
  totalTripsCompleted: number;
  totalDistanceKm: number;
  totalDriveTimeMinutes: number;
  speedingEventsCount: number;
  harshBrakingCount: number;
  harshAccelCount: number;
  idleExcessMinutes: number;

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverFilterParams {
  tenantId?: string;
  status?: string;
  availabilityStatus?: string;
  branchId?: string;
  departmentId?: string;
  employmentType?: string;
  shiftId?: string;
  vehicleId?: string;
  licenseType?: string;
  licenseStatus?: string;
  minPerformance?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  hasSensitivePermission?: boolean;
}
