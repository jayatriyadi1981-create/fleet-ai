/**
 * Fleet Intelligence Smart AI - Construction & Heavy Equipment Management System Types
 * Enterprise Alat Berat, Tambang, & Manajemen Proyek Konstruksi
 * Fulfills all Enterprise Requirements for Construction & Mining Fleet
 */

export type EquipmentClassification = 
  | 'EXCAVATOR'
  | 'BULLDOZER'
  | 'WHEEL_LOADER'
  | 'MOTOR_GRADER'
  | 'COMPACTOR'
  | 'CRANE'
  | 'ROUGH_TERRAIN_CRANE'
  | 'MOBILE_CRANE'
  | 'FORKLIFT'
  | 'DUMP_TRUCK'
  | 'TRACTOR'
  | 'BACKHOE'
  | 'CONCRETE_MIXER'
  | 'PAVER'
  | 'DRILL'
  | 'GENERATOR'
  | 'PUMP'
  | 'LIGHT_TOWER'
  | 'OTHER';

export type EquipmentCategory = EquipmentClassification;

export type EquipmentStatus = 
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'WORKING'
  | 'OPERATING'
  | 'IDLE'
  | 'STANDBY'
  | 'MAINTENANCE'
  | 'BREAKDOWN'
  | 'INSPECTION'
  | 'RENTED'
  | 'OFFLINE'
  | 'RETIRED'
  | 'MOBILIZATION'
  | 'DEMOBILIZATION';

export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'CUSTOM' | 'SHIFT_1_DAY' | 'SHIFT_2_NIGHT';

export type P2HResult = 'FIT_TO_WORK' | 'FIT_WITH_NOTE' | 'DO_NOT_OPERATE';

export type TelemetryCapability = 
  | 'GPS_ONLY'
  | 'GPS_FUEL'
  | 'GPS_ENGINE_HOUR'
  | 'GPS_CAN_BUS'
  | 'GPS_FULL_TELEMETRY';

export interface HeavyEquipmentAsset {
  id: string;
  code: string; // e.g. "EXC-201"
  name: string; // e.g. "Komatsu PC200-8MO"
  category: EquipmentClassification;
  brand: string; // Komatsu, Caterpillar, Kobelco, Hitachi, Volvo, Scania, Sany, Tadano, Sakai
  model: string;
  serialNumber: string;
  engineSerialNumber: string;
  assetNumber?: string;
  year: number;
  capacity?: string;
  fuelType: 'SOLAR_B35' | 'DEXLITE' | 'INDUSTRI_HIGH_GRADE' | 'DIESEL';
  hourMeter: number; // in hours (HM) / Engine hours
  mileageKm?: number;
  bucketCapacityM3?: number;
  tonnageCapacityTons?: number;
  currentSiteId: string;
  currentSiteName: string;
  assignedOperatorId?: string;
  assignedOperatorName?: string;
  currentProjectId?: string;
  currentProjectName?: string;
  status: EquipmentStatus;
  fuelLevelPct: number;
  fuelBurnRateLitersPerHM: number; // e.g. 18.5 L/HM
  engineStatus: 'RUNNING' | 'IDLE' | 'OFF';
  engineRpm: number;
  coolantTempC: number;
  oilPressureBar: number;
  hydraulicPressureBar: number;
  hydraulicTempC?: number;
  batteryVoltage?: number;
  vibrationLevelMmS?: number;
  telemetryCapability: TelemetryCapability;
  dtcCodes: string[];
  gpsCoordinates: { lat: number; lng: number };
  currentLocationName?: string;
  lastP2hResult: P2HResult;
  lastServiceHM: number;
  nextServiceHM: number;
  physicalAvailabilityPct: number; // PA %
  utilizationAvailabilityPct: number; // UA %
  rentalHourlyRate: number; // in IDR
  dailyTargetHM: number;
  siloCertificateNumber: string;
  siloExpiryDate: string;
  utilizationCategory: 'LOW' | 'NORMAL' | 'HIGH';
  downtimeHoursThisMonth: number;
  totalBreakdownCount: number;
  operatingCostPerHourIdr: number;
  revenueGeneratedIdr: number;
  activeAlerts: string[];
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export interface ConstructionSite {
  id: string;
  code: string;
  name: string;
  projectId: string;
  projectName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  geofenceRadiusMeters: number;
  siteManager: string;
  siteManagerPhone: string;
  operatingHours: string; // e.g. "06:00 - 18:00 (2 Shifts)"
  equipmentCapacity: number;
  activeEquipmentsCount: number;
  safetyZoneStatus: 'SAFE' | 'ADVISORY' | 'HAZARD_ALERT';
  restrictedZones: { name: string; radius: number; reason: string }[];
  fuelStationLocation: { lat: number; lng: number; name: string };
  workshopLocation: { lat: number; lng: number; name: string };
  emergencyAssemblyPoint: { lat: number; lng: number; name: string };
  createdAt: string;
}

export interface ConstructionProject {
  id: string;
  code: string; // e.g. "PRJ-IKN-SEKTOR-1A"
  name: string; // e.g. "Proyek Pembangunan Jalan Tol IKN Seksi 3B"
  customer: string;
  contractor: string;
  clientName: string; // compatibility
  locationCity: string;
  projectManager: string;
  hseOfficer: string;
  startDate: string;
  targetEndDate: string;
  status: ProjectStatus;
  budgetTotalIdr: number;
  targetVolumeBcm: number; // Bank Cubic Meter
  achievedVolumeBcm: number;
  targetTonnageTons?: number;
  achievedTonnageTons?: number;
  allocatedEquipmentsCount: number;
  allocatedOperatorsCount: number;
  totalOperatingHours: number;
  totalIdleHours: number;
  totalFuelConsumedLiters: number;
  totalMaintenanceCostIdr: number;
  progressPercent: number;
  coordinates: { lat: number; lng: number };
  sitesCount: number;
  activeIncidentsCount: number;
  productivityRateBcmPerHour: number;
  createdAt: string;
  tenantId: string;
}

export interface EquipmentAssignment {
  id: string;
  assignmentCode: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  workArea: string;
  operatorId: string;
  operatorName: string;
  startDate: string;
  endDate: string;
  shift: ShiftType;
  targetHours: number;
  targetProductivity: string; // e.g. "450 BCM/Shift"
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  assignedBy: string;
  createdAt: string;
}

export interface OperatorCertification {
  id: string;
  operatorId: string;
  operatorName: string;
  certificationType: 'EXCAVATOR' | 'CRANE' | 'FORKLIFT' | 'BULLDOZER' | 'LOADER' | 'HEAVY_EQUIPMENT' | 'OTHER';
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  issuer: string; // e.g. "Kementerian Ketenagakerjaan RI (KEMENAKER)"
  documentUrl: string;
  sioClass: 'KELAS_1' | 'KELAS_2' | 'KELAS_3';
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
}

export interface HeavyOperatorProfile {
  id: string;
  nik: string;
  name: string;
  phone: string;
  specialization: EquipmentClassification[];
  sioLicenseNumber: string;
  sioClass: 'KELAS_1' | 'KELAS_2' | 'KELAS_3';
  sioExpiryDate: string;
  sioStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  certifications: OperatorCertification[];
  experienceYears: number;
  trainingHistory: string[];
  assignedEquipmentCode?: string;
  currentProject: string;
  currentSite?: string;
  rosterPattern: '6:2' | '8:2' | '10:2' | 'STANDARD_MON_SAT';
  daysOnDuty: number;
  safetyScore: number; // 0-100
  fatigueScore: number; // 0-100 (higher = more fatigued)
  totalLifetimeHM: number;
  workHoursThisMonth: number;
  medicalCheckupStatus: 'FIT' | 'FIT_WITH_RESTRICTION' | 'UNFIT';
  assignmentHistoryCount: number;
}

export interface EquipmentShiftRecord {
  id: string;
  shiftCode: string;
  shiftType: ShiftType;
  date: string;
  operatorId: string;
  operatorName: string;
  equipmentId: string;
  equipmentCode: string;
  projectId: string;
  projectName: string;
  siteId: string;
  siteName: string;
  startTime: string;
  endTime: string;
  operatingHours: number;
  idleHours: number;
  standbyHours: number;
  breakdownHours: number;
  productionValue: number;
  productionUnit: 'BCM' | 'TONS' | 'LIFTS' | 'BUCKETS';
  fuelConsumedLiters: number;
  supervisorNotes?: string;
}

export interface DailyTimesheet {
  id: string;
  timesheetNumber: string; // e.g. "TS-2026-0819-01"
  date: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  operatorId: string;
  operatorName: string;
  projectId: string;
  projectName: string;
  shift: ShiftType;
  startHM: number;
  endHM: number;
  totalHM: number;
  operatingHours: number;
  idleHours: number;
  standbyRainHours: number;
  standbyQueueHours: number;
  breakdownHours: number;
  fuelConsumedLiters: number;
  workDescription: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  activityType: 'EXCAVATION' | 'HAULING' | 'DOZING' | 'COMPACTING' | 'GRADING' | 'LIFTING';
}

export interface P2HInspection {
  id: string;
  inspectionNumber: string;
  date: string;
  time: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentCategory?: EquipmentClassification;
  operatorName: string;
  inspectorName?: string;
  shift: ShiftType;
  hourMeter: number;
  gpsCoordinates?: { lat: number; lng: number };
  items: {
    engineOilLevel: boolean;
    hydraulicOilLevel: boolean;
    radiatorCoolant: boolean;
    fuelWaterSeparator: boolean;
    trackTireTension: boolean;
    hydraulicCylinderLeak: boolean;
    brakeSystem: boolean;
    hornAndReverseAlarm: boolean;
    aparFireExtinguisher: boolean;
    safetyBelt: boolean;
    rotaryLampLighting: boolean;
    mirrorsAndGlass: boolean;
    // Equipment-specific inspection additions
    boomArmStructure?: boolean;
    wireRopeAndHook?: boolean;
    loadIndicatorAndOutrigger?: boolean;
    mastAndForkCondition?: boolean;
  };
  result: P2HResult;
  photoEvidenceUrls: string[];
  criticalDefectNotes?: string;
  operatorSignature: string;
}

export interface HeavyFuelLog {
  id: string;
  voucherNumber: string;
  date: string;
  time: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  projectId: string;
  projectName: string;
  currentHM: number;
  litersFilled: number;
  fuelBowserTruck: string; // e.g. "BOWSER-01 (Hino 500 Fuel Truck)"
  dispenserOperator: string;
  fuelType: 'SOLAR_B35' | 'DEXLITE' | 'INDUSTRI_HIGH_GRADE';
  unitCostPerLiter: number;
  totalCostIdr: number;
  previousRefuelHM: number;
  calculatedBurnRate: number; // L/HM
  isAnomalyDetected?: boolean;
  anomalyReason?: string;
}

export interface HeavyMaintenanceSchedule {
  id: string;
  workOrderNumber: string;
  equipmentId: string;
  equipmentCode: string;
  serviceType: 'PS_250' | 'PS_500' | 'PS_1000' | 'PS_2000' | 'UNDERCARRIAGE_OVERHAUL' | 'ENGINE_OVERHAUL' | 'UNSCHEDULED_BREAKDOWN';
  currentHM: number;
  targetServiceHM: number;
  remainingHM: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedMechanic: string;
  partsList: string[];
  estimatedCostIdr: number;
  downTimeHours: number;
  scheduledDate: string;
}

export interface EquipmentBreakdownRecord {
  id: string;
  breakdownNumber: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  projectId: string;
  projectName: string;
  siteName: string;
  operatorId: string;
  operatorName: string;
  reportedAt: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rootCause: string;
  failureCategory: 'HYDRAULIC' | 'ENGINE' | 'ELECTRICAL' | 'UNDERCARRIAGE' | 'TRANSMISSION' | 'BRAKE' | 'STRUCTURAL';
  technicianAssigned: string;
  diagnosisNotes: string;
  partsReplaced: { partName: string; partNumber: string; qty: number; unitCostIdr: number }[];
  repairDurationHours: number;
  laborCostIdr: number;
  partsCostIdr: number;
  totalCostIdr: number;
  status: 'REPORTED' | 'TECHNICIAN_DISPATCHED' | 'DIAGNOSING' | 'REPAIRING' | 'TESTING' | 'RETURNED_TO_SERVICE';
  testPassed: boolean;
  completedAt?: string;
}

export interface EquipmentIncidentRecord {
  id: string;
  incidentNumber: string;
  project: string;
  site: string;
  equipmentId: string;
  equipmentCode: string;
  operatorId: string;
  operatorName: string;
  date: string;
  time: string;
  location: string;
  severity: 'NEAR_MISS' | 'PROPERTY_DAMAGE' | 'EQUIPMENT_FAILURE' | 'MINOR_INJURY' | 'MAJOR_INCIDENT' | 'UNSAFE_CONDITION' | 'UNSAFE_ACT';
  description: string;
  evidencePhotoUrl?: string;
  witnessName?: string;
  rootCause: string;
  correctiveAction: string;
  status: 'INVESTIGATING' | 'ACTION_REQUIRED' | 'RESOLVED' | 'CLOSED';
}

export interface HeavyRentalBilling {
  id: string;
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  equipmentCode: string;
  rentalType: 'LEPAS_KUNCI' | 'ALL_IN_OPERATOR_BBM';
  pricingScheme: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'PER_PROJECT';
  minimumMonthlyHM: number; // e.g. 200 HM
  totalHMUsed: number;
  hourlyRateIdr: number;
  overtimeRateIdr: number;
  mobilizationFeeIdr: number;
  demobilizationFeeIdr: number;
  subtotalIdr: number;
  taxPpnIdr: number;
  totalInvoiceIdr: number;
  rentalCostIdr: number;
  netProfitIdr: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIALLY_PAID' | 'OVERDUE';
  dueDate: string;
}

export interface EquipmentTransportRequest {
  id: string;
  requestNumber: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  originSite: string;
  destinationSite: string;
  lowbedTrailerVehicle: string;
  driverName: string;
  requestedDate: string;
  departureDate?: string;
  arrivalDate?: string;
  permitNumber: string;
  routePlan: string;
  status: 'REQUESTED' | 'APPROVED' | 'ASSIGNED_TRAILER' | 'LOADED' | 'DEPARTED' | 'IN_TRANSIT' | 'ARRIVED' | 'UNLOADED' | 'CONFIRMED' | 'COMPLETED';
  transportCostIdr: number;
}

export interface EquipmentProductivityMetric {
  id: string;
  equipmentId: string;
  equipmentCode: string;
  category: EquipmentClassification;
  projectName: string;
  date: string;
  volumeM3?: number;
  tonnageTons?: number;
  cycleCount?: number;
  liftCount?: number;
  bucketCount?: number;
  operatingHours: number;
  actualUnitPerHour: number;
  targetUnitPerHour: number;
  productivityPct: number;
}

export interface AIDailyProjectBriefing {
  date: string;
  projectName: string;
  totalEquipments: number;
  workingCount: number;
  idleCount: number;
  breakdownCount: number;
  maintenanceCount: number;
  totalFuelConsumedLiters: number;
  totalVolumeAchievedBcm: number;
  safetyIncidentsCount: number;
  risksIdentified: string[];
  recommendations: string[];
  executiveSummary: string;
}

export type HeavyEquipmentTabId = 
  | 'control-tower'
  | 'equipment-assets'
  | 'equipment-detail'
  | 'projects-sites'
  | 'project-dashboard'
  | 'assignments'
  | 'timesheets-hm'
  | 'shifts-worklog'
  | 'p2h-inspection'
  | 'fuel-bowser'
  | 'maintenance-ps'
  | 'breakdowns'
  | 'safety-sio'
  | 'safety-incidents'
  | 'rental-billing'
  | 'transport-lowbed'
  | 'productivity-cost'
  | 'command-center'
  | 'ai-copilot'
  | 'mobile-operator'
  | 'reports';
