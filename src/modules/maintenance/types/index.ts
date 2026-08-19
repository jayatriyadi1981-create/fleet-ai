/**
 * Fleet Intelligence Smart AI - Maintenance Management Types
 * PROMPT 25 - Comprehensive Predictive Maintenance & Health Architecture
 */

export type MaintenanceType = 
  | 'PREVENTIVE' 
  | 'CORRECTIVE' 
  | 'PREDICTIVE' 
  | 'EMERGENCY' 
  | 'INSPECTION' 
  | 'WARRANTY' 
  | 'RECALL';

export type MaintenanceCategory = 
  | 'ENGINE' 
  | 'TRANSMISSION' 
  | 'BRAKE' 
  | 'SUSPENSION' 
  | 'TIRE' 
  | 'ELECTRICAL' 
  | 'BATTERY' 
  | 'AIR_CONDITIONING' 
  | 'COOLING' 
  | 'FUEL_SYSTEM' 
  | 'EXHAUST' 
  | 'BODY' 
  | 'GPS_DEVICE' 
  | 'FUEL_SENSOR' 
  | 'SAFETY_EQUIPMENT' 
  | 'OTHER';

export type MaintenanceStatus = 
  | 'SCHEDULED' 
  | 'IN_PROGRESS' 
  | 'WAITING_PARTS' 
  | 'QUALITY_CHECK' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'OVERDUE';

export type VehicleHealthStatus = 
  | 'HEALTHY' 
  | 'GOOD' 
  | 'ATTENTION' 
  | 'AT_RISK' 
  | 'CRITICAL';

export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkOrderStatus = 
  | 'REQUEST' 
  | 'APPROVED' 
  | 'SCHEDULED' 
  | 'IN_PROGRESS' 
  | 'WAITING_PARTS' 
  | 'QUALITY_CHECK' 
  | 'COMPLETED' 
  | 'CLOSED';

export type RootCause = 
  | 'WEAR_AND_TEAR' 
  | 'DRIVER_BEHAVIOR' 
  | 'ROAD_CONDITION' 
  | 'MAINTENANCE_DELAY' 
  | 'PART_FAILURE' 
  | 'SENSOR_FAILURE' 
  | 'ELECTRICAL' 
  | 'UNKNOWN' 
  | 'OTHER';

export type InspectionType = 
  | 'PRE_TRIP' 
  | 'POST_TRIP' 
  | 'PERIODIC' 
  | 'SAFETY' 
  | 'MAINTENANCE' 
  | 'BREAKDOWN';

export type InspectionResult = 'PASS' | 'FAIL' | 'ATTENTION';

export type PartTransactionType = 
  | 'PURCHASE' 
  | 'RECEIVE' 
  | 'ISSUE' 
  | 'RETURN' 
  | 'ADJUSTMENT' 
  | 'TRANSFER' 
  | 'SCRAP';

export type ScheduleTrigger = 'WHICHEVER_FIRST' | 'WHICHEVER_LATER';

export interface TelemetryHealthSignal {
  engineTemperatureC?: number;
  batteryVoltage?: number;
  oilPressureKpa?: number;
  coolantTemperatureC?: number;
  rpm?: number;
  engineFaultCodes?: string[]; // DTC Codes e.g. ["P0300", "P0115"]
  tirePressurePsi?: { fl: number; fr: number; rl: number; rr: number };
  fuelSystemHealth?: string;
  brakePadWearPct?: number;
}

export interface MaintenanceRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  type: MaintenanceType;
  category: MaintenanceCategory;
  status: MaintenanceStatus;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  odometer: number;
  engineHours: number;
  vendorId?: string;
  workshopId?: string;
  workshopName?: string;
  estimatedCost: number;
  actualCost: number;
  downtimeHours: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceSchedule {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  maintenanceType: MaintenanceType;
  serviceTemplateId?: string;
  serviceName: string;
  intervalKm: number;
  intervalEngineHours: number;
  intervalDays: number;
  triggerCondition: ScheduleTrigger;
  lastServiceDate: string;
  lastServiceOdometer: number;
  lastServiceEngineHours: number;
  nextDueDate: string;
  nextDueOdometer: number;
  nextDueEngineHours: number;
  remainingKm: number;
  remainingDays: number;
  status: 'UPCOMING' | 'DUE_SOON' | 'DUE' | 'OVERDUE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface VehicleHealth {
  vehicleId: string;
  vehiclePlate: string;
  brand: string;
  model: string;
  healthScore: number; // 0 - 100
  status: VehicleHealthStatus;
  lastService: string;
  nextService: string;
  mileageKm: number;
  engineHours: number;
  openIssuesCount: number;
  criticalIssuesCount: number;
  downtimeHours: number;
  maintenanceCostIdr: number;
  fuelCostIdr?: number;
  totalOperatingCostIdr?: number;
  costPerKm?: number;
  aiRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiRiskFactors?: string[];
  telemetrySignals?: TelemetryHealthSignal;
  serviceCompliancePct: number;
  breakdownCount: number;
}

export interface ServiceChecklistItem {
  id: string;
  item: string;
  status: 'PASS' | 'FAIL' | 'ATTENTION' | 'N/A';
  notes?: string;
}

export interface ServiceTemplate {
  id: string;
  tenantId: string;
  name: string;
  category: MaintenanceCategory;
  checklist: string[];
  intervalKm: number;
  intervalMonths: number;
  intervalEngineHours: number;
  estimatedCost: number;
  estimatedDurationHours: number;
  recommendedParts: string[];
}

export interface ServiceRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  serviceType: MaintenanceType;
  serviceTemplateId?: string;
  serviceTitle: string;
  date: string;
  odometer: number;
  engineHours: number;
  workshopId?: string;
  workshopName: string;
  technicianId?: string;
  technicianName: string;
  description: string;
  partsCost: number;
  laborCost: number;
  otherCost: number;
  totalCost: number;
  warrantyAvailable: boolean;
  warrantyMonths?: number;
  invoiceNumber?: string;
  nextServiceDate: string;
  nextServiceOdometer: number;
  nextServiceEngineHours: number;
  attachments?: string[];
  checklistResults?: ServiceChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderPartUsage {
  partId: string;
  partNumber: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface WorkOrder {
  id: string;
  tenantId: string;
  number: string; // e.g. "WO-2026-00125"
  vehicleId: string;
  vehiclePlate: string;
  maintenanceType: MaintenanceType;
  category: MaintenanceCategory;
  priority: WorkOrderPriority;
  title: string;
  description: string;
  reportedIssue: string;
  diagnosis?: string;
  dtcCodes?: string[];
  requestedBy: string;
  approvedBy?: string;
  assignedTechnician?: string;
  vendorId?: string;
  workshopId?: string;
  workshopName: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: WorkOrderStatus;
  estimatedCost: number;
  actualCost: number;
  partsCost: number;
  laborCost: number;
  downtimeHours: number;
  partsUsed: WorkOrderPartUsage[];
  checklist?: ServiceChecklistItem[];
  photoEvidence?: {
    before?: string[];
    during?: string[];
    after?: string[];
    damagedPart?: string[];
  };
  digitalSignatures?: {
    technicianSignature?: string;
    supervisorApproval?: string;
    driverConfirmation?: string;
  };
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepairRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  workOrderId: string;
  repairNumber: string;
  issue: string;
  diagnosis: string;
  rootCause: RootCause;
  repairAction: string;
  parts: WorkOrderPartUsage[];
  laborCost: number;
  totalCost: number;
  downtimeHours: number;
  startTime: string;
  endTime: string;
  technicianId: string;
  technicianName: string;
  warranty: boolean;
  warrantyExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Part {
  id: string;
  tenantId: string;
  partNumber: string;
  name: string;
  category: MaintenanceCategory;
  brand: string;
  unit: string; // "PCS", "SET", "LITER", "BOX"
  stockQuantity: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  supplierId?: string;
  supplierName: string;
  location: string; // "Rak A-02 Gudang Pusat"
  compatibleVehicles: string[]; // ["Hino 500", "Mitsubishi Fuso Fighter", "Isuzu Giga"]
  warrantyPeriodMonths: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  createdAt: string;
  updatedAt: string;
}

export interface PartTransaction {
  id: string;
  tenantId: string;
  partId: string;
  partNumber: string;
  partName: string;
  vehicleId?: string;
  vehiclePlate?: string;
  workOrderId?: string;
  type: PartTransactionType;
  quantity: number;
  unitCost: number;
  totalCost: number;
  sourceLocation: string;
  destinationLocation?: string;
  performedBy: string;
  timestamp: string;
}

export interface Inspection {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  type: InspectionType;
  timestamp: string;
  checklist: {
    item: string;
    category: string;
    status: 'PASS' | 'FAIL' | 'ATTENTION' | 'N/A';
    notes?: string;
  }[];
  result: InspectionResult;
  odometer: number;
  notes?: string;
  photoUrls?: string[];
  signature?: string;
  workOrderId?: string;
  createdAt: string;
}

export interface BreakdownEvent {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  tripId?: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  symptoms: string;
  diagnosis?: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  downtimeHours: number;
  workOrderId?: string;
  status: 'NEW' | 'DISPATCHED' | 'IN_REPAIR' | 'RESOLVED';
  replacementVehicleDispatched?: boolean;
  createdAt: string;
}

export interface Warranty {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate: string;
  partId?: string;
  partName?: string;
  vendorId?: string;
  vendorName: string;
  startDate: string;
  endDate: string;
  coverage: string;
  terms: string;
  claimStatus: 'ACTIVE' | 'CLAIMED' | 'EXPIRED' | 'UNDER_REVIEW';
}

export interface MaintenanceVendor {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  contact: string;
  phone: string;
  specialization: MaintenanceCategory[];
  rating: number; // 1 - 5
  serviceHistoryCount: number;
  avgCostIdr: number;
  avgRepairTimeHours: number;
  activeSlaStatus: 'ON_TIME' | 'AT_RISK' | 'BREACHED';
  warrantySupported: boolean;
  createdAt: string;
}

export interface MaintenanceRule {
  id: string;
  tenantId: string;
  ruleName: string;
  description: string;
  intervalKm: number;
  intervalMonths: number;
  intervalEngineHours: number;
  dueSoonThresholdKm: number; // e.g. 1000 km
  dueSoonThresholdDays: number; // e.g. 14 days
  lowStockThreshold: number;
  highDowntimeThresholdHours: number;
  repeatRepairDaysWindow: number; // e.g. 60 days
  costPerKmAlertThresholdIdr: number;
  version: string;
  effectiveDate: string;
  changedBy: string;
  changeReason: string;
  active: boolean;
}

export interface MaintenanceBudget {
  period: string; // "2026-08"
  branchId?: string;
  branchName: string;
  vehicleGroupId?: string;
  budgetAmount: number; // IDR
  actualAmount: number;
  variancePct: number;
}

export interface MaintenanceOverviewKPIs {
  fleetHealthScore: number;
  vehiclesHealthy: number;
  vehiclesAtRisk: number;
  vehiclesCritical: number;
  maintenanceDueCount: number;
  maintenanceOverdueCount: number;
  openWorkOrdersCount: number;
  completedWorkOrdersCount: number;
  preventiveMaintenanceCost: number;
  correctiveMaintenanceCost: number;
  totalMaintenanceCost: number;
  avgCostPerVehicle: number;
  avgCostPerKm: number;
  breakdownCount: number;
  totalDowntimeHours: number;
  partsCost: number;
  laborCost: number;
}

export interface AIMaintenanceInsight {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  finding: string;
  dataPeriod: string;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  potentialAreas: string[];
  failureWindowKm?: string; // e.g. "1,500 - 2,500 km"
  failureWindowDays?: string; // e.g. "10 - 20 hari"
  evidence: string[];
  contributingFactors: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  repeatRepairDetected?: boolean;
  crossModuleSignals?: {
    fuelAnomalyObserved?: string;
    harshDrivingObserved?: string;
    fatigueRiskContext?: string;
  };
}
