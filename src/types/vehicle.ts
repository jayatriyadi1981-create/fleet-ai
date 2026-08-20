/**
 * Fleet Intelligence Smart AI - Vehicle Management Domain Types
 * Comprehensive Vehicle Master Data, Assignments, Lifecycle & 9 Detail Tabs
 */

import { VehicleStatus, VehicleType, FuelType, Location, TelemetryData } from './index';
export type { VehicleStatus, VehicleType, FuelType };

export type OperationalStatus = 'moving' | 'idle' | 'stopped' | 'offline' | 'unknown';

export type TransmissionType = 'manual' | 'automatic';

export type OwnershipType = 'company_owned' | 'leased' | 'rental' | 'third_party';

export type VehicleLifecycleStatus = 
  | 'active'        // Unit beroperasi aktif dalam armada
  | 'inactive'      // Unit sementara standby / tidak aktif
  | 'sold'          // Unit telah dijual ke pihak ketiga
  | 'rental'        // Unit disewakan / kontrak rental
  | 'maintenance'   // Unit sedang perawatan bengkel / overhaul
  | 'retired';      // Unit dipensiunkan / afkir / decommissioned

export type DocumentExpiryStatus = 'valid' | 'expiring_soon' | 'expired';

export interface VehicleCapacity {
  payloadKg?: number;           // Kapasitas muatan berat (e.g. 12000 kg)
  passengerCount?: number;      // Kapasitas penumpang (e.g. 14 seats)
  cargoVolumeCbm?: number;      // Volume kargo kubikasi (e.g. 36 m³)
  maxWeightKg?: number;         // GVW (Gross Vehicle Weight)
  formatted?: string;           // e.g. "12.0 Ton (36 CBM)"
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  tenantId: string;
  type: 'stnk' | 'bpkb' | 'kir' | 'insurance' | 'tax' | 'permit' | 'lease' | 'other';
  documentNumber: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  fileUrl?: string;
  fileName?: string;
  fileSizeMb?: number;
  status: DocumentExpiryStatus;
  notes?: string;
  issuingAuthority?: string;
  createdAt: string;
}

export interface VehicleAssignmentHistory {
  id: string;
  vehicleId: string;
  tenantId: string;
  type: 'driver' | 'backup_driver' | 'gps' | 'branch' | 'region' | 'group' | 'department';
  previousValue: string;
  newValue: string;
  assignedAt: string;
  assignedBy: string;
  unassignedAt?: string;
  reason?: string;
}

export interface VehicleTripRecord {
  id: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  originName: string;
  destinationName: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  departureTime: string;
  arrivalTime?: string;
  distanceKm: number;
  durationMinutes: number;
  avgSpeedKm: number;
  maxSpeedKm: number;
  fuelConsumedLiters: number;
  fuelEfficiencyKmPerLiter: number;
  cargoDescription: string;
  cargoWeightKg: number;
  status: 'completed' | 'in_progress' | 'scheduled' | 'cancelled';
  waypoints?: Array<{ lat: number; lng: number; name?: string; timestamp?: string }>;
}

export interface VehicleFuelRecord {
  id: string;
  vehicleId: string;
  tenantId: string;
  driverId?: string;
  driverName?: string;
  date: string;
  odometerKm: number;
  litersAdded: number;
  fuelType: FuelType;
  costPerLiterIdr: number;
  totalCostIdr: number;
  gasStationName: string;
  locationAddress: string;
  fullTank: boolean;
  efficiencyKmPerLiter?: number;
  receiptNumber?: string;
  notes?: string;
  isAnomaly?: boolean;
  anomalyReason?: string;
}

export interface VehicleMaintenanceRecord {
  id: string;
  workOrderNumber: string;
  vehicleId: string;
  serviceType: 'routine_service' | 'oil_change' | 'brake_overhaul' | 'tire_replacement' | 'engine_repair' | 'transmission' | 'electrical' | 'body_repair' | 'kir_inspection';
  title: string;
  status: 'completed' | 'in_progress' | 'scheduled' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  serviceDate: string;
  completedDate?: string;
  serviceOdometerKm: number;
  nextServiceOdometerKm?: number;
  nextServiceDate?: string;
  workshopName: string;
  technicianName: string;
  totalCostIdr: number;
  partsReplaced?: Array<{ partName: string; partNumber: string; quantity: number; costIdr: number }>;
  notes: string;
}

export interface VehicleAlertRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName?: string;
  timestamp: string;
  alertType: 'overspeed' | 'harsh_braking' | 'harsh_acceleration' | 'sharp_turn' | 'geofence_breach' | 'engine_overheat' | 'low_battery' | 'fuel_drain' | 'power_cut' | 'sos_panic' | 'idle_excess';
  severity: 'critical' | 'high' | 'warning' | 'info';
  title: string;
  description: string;
  speedAtEvent?: number;
  locationAddress: string;
  lat: number;
  lng: number;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
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
    | 'lifecycle_changed'
    | 'status_changed' 
    | 'driver_assigned' 
    | 'driver_unassigned' 
    | 'backup_driver_assigned'
    | 'gps_assigned' 
    | 'branch_assigned' 
    | 'region_assigned'
    | 'group_assigned' 
    | 'department_assigned'
    | 'document_added'
    | 'document_renewed'
    | 'maintenance_created'
    | 'fuel_logged';
  title: string;
  description: string;
  performedBy: string;
}

export interface VehicleExtended extends Record<string, any> {
  id: string;
  tenantId: string;
  vehicleCode: string; // e.g. VH-000124 (Vehicle ID)
  name: string; // e.g. Toyota Dyna 130 HT / Hino Ranger FL 235
  licensePlate: string; // e.g. B 1234 ABC (License Plate)
  type: VehicleType;
  brand: string; // e.g. Isuzu, Hino, Mitsubishi, Toyota, Scania, Mercedes-Benz
  model: string; // e.g. Ranger FL 235
  variant?: string; // e.g. Long Chassis Box
  year: number; // Year
  color: string; // Color
  fuelType: FuelType; // Fuel Type
  transmission: TransmissionType;
  ownership: OwnershipType;

  // Vehicle Lifecycle Status
  lifecycleStatus: VehicleLifecycleStatus; // Active, Inactive, Sold, Rental, Maintenance, Retired

  // Master Technical Specs
  vin: string; // VIN
  chassisNumber: string; // Chassis
  engineNumber: string; // Engine Number
  engineCapacityCc?: number;
  fuelCapacityLiters: number; // Fuel Capacity
  capacity?: VehicleCapacity; // Capacity (Payload, Passenger, Cargo CBM)
  payloadKg?: number;
  grossVehicleWeightKg?: number;
  numberOfWheels?: number;
  tireSize?: string;
  odometerKm: number; // Odometer (KM)
  engineHours: number; // Engine Hour (Hours)

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

  // Vehicle Assignments
  primaryDriverId?: string;
  primaryDriverName?: string;
  backupDriverId?: string;
  backupDriverName?: string;
  departmentId?: string;
  departmentName?: string;
  branchId: string;
  branchName: string;
  region: string; // Region: e.g. 'Jabodetabek & Banten', 'Jawa Barat', 'Jawa Timur', etc.
  groupId?: string;
  groupName: string; // Vehicle Group

  // GPS & Telematics
  gpsDeviceId: string;
  gpsImei?: string;
  gpsStatus: 'online' | 'offline' | 'delayed' | 'never_connected';
  latestTelemetry?: TelemetryData;

  // Operational Status
  status: VehicleStatus; // moving, idle, stopped, under_maintenance, breakdown, etc.
  operationalStatus: OperationalStatus; // moving, idle, stopped, offline, unknown

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
  region?: string;
  status: 'active' | 'inactive';
  vehiclesCount: number;
}

export interface VehicleFilterParams {
  tenantId?: string;
  branchId?: string;
  departmentId?: string;
  groupId?: string;
  region?: string;
  lifecycleStatus?: string;
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
    transmission: number;
    brakingSystem: number;
    battery: number;
    gpsSensor: number;
    tires: number;
    fuelSystem: number;
    coolingSystem: number;
  };
  predictedMaintenance: {
    component: string;
    estimatedDaysRemaining: number;
    estimatedKmRemaining: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    action: string;
  }[];
  anomalies: {
    id: string;
    type: string;
    title: string;
    description: string;
    confidencePercent: number;
    recommendation: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  ecoDrivingScore: number;
  carbonEmissionsKgPerMonth: number;
  fuelOptimizationTips: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

