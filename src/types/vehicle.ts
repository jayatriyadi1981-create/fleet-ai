/**
 * Fleet Intelligence Smart AI - Vehicle Management Domain Types
 * PROMPT 9 - Vehicle Master Data, Groups, Branches, Departments & Documents
 */

import { VehicleStatus, VehicleType, FuelType, Location, TelemetryData } from './index';
export type { VehicleStatus, VehicleType, FuelType };

export type OperationalStatus = 'moving' | 'idle' | 'stopped' | 'offline' | 'unknown';

export type TransmissionType = 'manual' | 'automatic';

export type OwnershipType = 'company_owned' | 'leased' | 'rental' | 'third_party';

export type DocumentExpiryStatus = 'valid' | 'expiring_soon' | 'expired';

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  tenantId: string;
  type: 'stnk' | 'bpkb' | 'kir' | 'insurance' | 'purchase' | 'lease' | 'other';
  documentNumber: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  fileUrl?: string;
  fileName?: string;
  fileSizeMb?: number;
  status: DocumentExpiryStatus;
  notes?: string;
  createdAt: string;
}

export interface VehicleAssignmentHistory {
  id: string;
  vehicleId: string;
  tenantId: string;
  type: 'driver' | 'gps' | 'branch' | 'group' | 'department';
  previousValue: string;
  newValue: string;
  assignedAt: string;
  assignedBy: string;
  unassignedAt?: string;
  reason?: string;
}

export interface VehicleActivityLog {
  id: string;
  vehicleId: string;
  tenantId: string;
  timestamp: string;
  eventType: 
    | 'created' 
    | 'updated' 
    | 'archived' 
    | 'status_changed' 
    | 'driver_assigned' 
    | 'driver_unassigned' 
    | 'gps_assigned' 
    | 'branch_assigned' 
    | 'group_assigned' 
    | 'department_assigned'
    | 'document_added'
    | 'maintenance_created';
  title: string;
  description: string;
  performedBy: string;
}

export interface VehicleExtended extends Record<string, any> {
  id: string;
  tenantId: string;
  vehicleCode: string; // e.g. VH-000124
  name: string; // e.g. Toyota Dyna 130 HT
  licensePlate: string; // e.g. B 1234 ABC
  type: VehicleType;
  brand: string; // e.g. Isuzu, Hino, Mitsubishi, Toyota
  model: string; // e.g. Ranger FL 235
  variant?: string; // e.g. Long Chassis
  year: number;
  color: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  ownership: OwnershipType;

  // Technical Specs
  vin: string;
  chassisNumber: string;
  engineNumber: string;
  engineCapacityCc?: number;
  fuelCapacityLiters: number;
  payloadKg?: number;
  grossVehicleWeightKg?: number;
  numberOfWheels?: number;
  tireSize?: string;
  odometerKm: number;
  engineHours: number;

  // Registration & Legal
  stnkNumber?: string;
  stnkExpiry?: string;
  bpkbNumber?: string;
  kirNumber?: string;
  kirExpiry?: string;
  pajakExpiry?: string;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;
  registrationStatus?: DocumentExpiryStatus;

  // Organization & Assignments
  groupId?: string;
  groupName: string;
  branchId: string;
  branchName: string;
  departmentId?: string;
  departmentName?: string;
  primaryDriverId?: string;
  primaryDriverName?: string;
  backupDriverId?: string;
  backupDriverName?: string;

  // GPS & Telematics
  gpsDeviceId: string;
  gpsImei?: string;
  gpsStatus: 'online' | 'offline' | 'delayed' | 'never_connected';
  latestTelemetry?: TelemetryData;

  // Statuses
  status: VehicleStatus; // Active, Inactive, In Service, Under Maintenance, Breakdown, Retired, Archived
  operationalStatus: OperationalStatus; // Moving, Idle, Stopped, Offline, Unknown

  // Metadata
  maintenanceOverdue: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;

  // AI Health Score
  healthScore?: number; // 0 - 100
}

export interface VehicleGroup {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description: string;
  branchId?: string;
  branchName?: string;
  managerName?: string;
  vehiclesCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  branchId: string;
  branchName: string;
  managerName: string;
  vehiclesCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface BranchExtended {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  province: string;
  city: string;
  district?: string;
  village?: string;
  postalCode?: string;
  phone: string;
  email: string;
  managerName: string;
  status: 'active' | 'inactive';
  vehiclesCount: number;
}

export interface VehicleFilterParams {
  tenantId?: string;
  branchId?: string;
  departmentId?: string;
  groupId?: string;
  status?: string;
  operationalStatus?: string;
  gpsStatus?: string;
  type?: string;
  fuelType?: string;
  ownership?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isArchived?: boolean;
}

export interface VehicleListResponse {
  vehicles: VehicleExtended[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VehicleAIInsightDetail {
  id: string;
  vehicleId: string;
  healthScore: number;
  healthBreakdown: {
    engine: number;
    battery: number;
    gpsSensor: number;
    tires: number;
    fuelSystem: number;
  };
  anomalies: {
    id: string;
    type: string;
    title: string;
    description: string;
    confidencePercent: number;
    recommendation: string;
  }[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
