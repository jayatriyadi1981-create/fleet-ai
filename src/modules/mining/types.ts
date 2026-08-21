/**
 * Fleet Intelligence Smart AI - Mining Fleet & Operations Management Suite
 * Enterprise Types for Coal, Nickel, Gold, Quarry, and Mineral Open Pit Mining
 */

export type MiningSiteStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CLOSED';

export type MiningPitStatus = 'ACTIVE' | 'INACTIVE' | 'RESTRICTED' | 'EMERGENCY_ZONE';

export type MiningBenchStatus = 'ACTIVE' | 'BLASTING_SCHEDULED' | 'COMPACTING' | 'INACTIVE';

export type MiningMaterialCategory = 
  | 'COAL' 
  | 'NICKEL_ORE' 
  | 'GOLD_ORE' 
  | 'LIMESTONE' 
  | 'OVERBURDEN' 
  | 'WASTE' 
  | 'OTHER';

export type MiningEquipmentType = 
  | 'EXCAVATOR'
  | 'HYDRAULIC_EXCAVATOR'
  | 'WHEEL_LOADER'
  | 'BULLDOZER'
  | 'MOTOR_GRADER'
  | 'DUMP_TRUCK'
  | 'HAUL_TRUCK'
  | 'WATER_TRUCK'
  | 'FUEL_TRUCK'
  | 'SERVICE_TRUCK'
  | 'DRILL_RIG'
  | 'CRUSHER'
  | 'CONVEYOR'
  | 'DOZER'
  | 'COMPACTOR'
  | 'LIGHT_VEHICLE'
  | 'OTHER';

export type MiningEquipmentStatus = 
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'WORKING'
  | 'LOADING'
  | 'HAULING'
  | 'RETURNING'
  | 'DUMPING'
  | 'WAITING'
  | 'QUEUE'
  | 'IDLE'
  | 'STANDBY'
  | 'MAINTENANCE'
  | 'BREAKDOWN'
  | 'FUELING'
  | 'INSPECTION'
  | 'OFFLINE';

export type MiningShiftType = 'DAY_SHIFT' | 'NIGHT_SHIFT' | 'CUSTOM';

export type MiningSkillLevel = 'TRAINEE' | 'JUNIOR' | 'SENIOR' | 'MASTER' | 'TRAINER';

export type MiningDispatchCycleStatus = 
  | 'QUEUE_LOADING'
  | 'LOADING'
  | 'HAULING'
  | 'QUEUE_DUMPING'
  | 'DUMPING'
  | 'RETURNING'
  | 'COMPLETED';

export interface MiningSite {
  id: string;
  code: string;
  name: string;
  miningCompany: string; // IUP Holder (e.g. PT Kaltim Prima Coal, PT Vale Indonesia)
  contractor: string; // Mining Contractor (e.g. PT Pama Persada Nusantara, PT Bukit Makmur Mandiri Utama)
  commodityType: 'COAL' | 'NICKEL' | 'GOLD' | 'LIMESTONE' | 'BAUXITE' | 'COPPER';
  location: string; // Provinsi / Kabupaten
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaryPolygon?: { lat: number; lng: number }[];
  operatingHours: string;
  status: MiningSiteStatus;
  productionTargetMonthlyTon: number;
  productionTargetMonthlyBcm: number;
  currentMonthActualTon: number;
  safetyRules: string[];
  kttName: string; // Kepala Teknik Tambang (KTT)
  kttPhone: string;
  concessionAreaHa: number;
  totalActivePits: number;
  totalAssignedFleets: number;
  createdAt: string;
}

export interface MiningPit {
  id: string;
  code: string;
  name: string;
  siteId: string;
  siteName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geofenceRadiusMeters: number;
  miningArea: string; // e.g. "Blok Timur Sektor 4"
  currentBench: string; // e.g. "Bench RL +80"
  elevationRlMeters: number; // Reduced Level in meters e.g. +45.5m RL
  materialType: MiningMaterialCategory;
  primaryTargetBcmDaily: number;
  status: MiningPitStatus;
  highwallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedExcavatorCodes: string[];
  activeDumpTrucksCount: number;
  notes?: string;
  lastBlastingDate?: string;
  nextBlastingScheduled?: string;
}

export interface MiningBench {
  id: string;
  benchNumber: string; // e.g. "Bench 12 (RL +60)"
  pitId: string;
  pitName: string;
  elevationRl: number; // in meters (e.g. 60)
  materialId: string;
  materialName: string;
  materialCategory: MiningMaterialCategory;
  workingAreaStatus: 'STABLE' | 'RESTRICTED' | 'BLASTING_PREPARATION' | 'MUDDY';
  loadingZoneName: string; // e.g. "Front Loading Alpha-1"
  haulingRouteId: string;
  haulingRouteName: string;
  status: MiningBenchStatus;
  widthMeters: number;
  heightMeters: number;
  safetyBermHeightMeters: number;
}

export interface MiningMaterial {
  id: string;
  materialCode: string;
  name: string;
  category: MiningMaterialCategory;
  densityTonPerM3: number; // e.g. 1.3 for Coal, 2.2 for Overburden, 1.6 for Nickel
  gradeInfo?: string; // e.g. "GAR 4800 kcal/kg" or "1.85% Ni (Saprolite High Grade)"
  unit: 'TON' | 'BCM' | 'WMT' | 'DMT';
  defaultDestination: 'STOCKPILE_ROM' | 'DISPOSAL_DUMP' | 'CRUSHER_PLANT' | 'SMELTER_FEED' | 'PORT_JETTY';
  stockpileName: string;
  colorHex: string;
}

export interface MiningEquipmentAsset {
  id: string;
  code: string; // CN - Code Number e.g. "EX-201", "HD-785", "DZ-104"
  name: string;
  category: MiningEquipmentType;
  brand: string; // Komatsu, Caterpillar, Hitachi, Scania, Volvo, Liebherr
  model: string; // PC1250-8R, CAT 777E, D375A, HD785-7
  serialNumber: string;
  capacityM3: number; // Bucket / Vessel Capacity in m3
  payloadCapacityTon: number; // Payload capacity in Ton
  hourMeter: number; // Current HM
  fuelLevelPct: number; // 0 - 100%
  fuelBurnRatePerHour: number; // L/HM
  gps: {
    lat: number;
    lng: number;
    speedKmh: number;
    heading: number;
    altitudeMeters: number;
    lastUpdated: string;
  };
  telemetry: {
    engineRpm: number;
    oilPressureKpa: number;
    coolantTempC: number;
    hydraulicTempC: number;
    payloadWeightTon: number;
    tirePressureAvgPsi: number;
    isEngineOn: boolean;
  };
  currentSiteId: string;
  currentSiteName: string;
  currentPitId?: string;
  currentPitName?: string;
  currentBenchId?: string;
  currentBenchName?: string;
  currentOperatorId?: string;
  currentOperatorName?: string;
  status: MiningEquipmentStatus;
  assignedLoadingUnitCode?: string; // For Dump Trucks: Excavator CN they are assigned to
  siloCertificateNumber: string;
  siloExpiryDate: string;
  lastServiceHM: number;
  nextServiceDueHM: number;
  availabilityStats: {
    physicalAvailabilityPct: number; // PA
    utilizationAvailabilityPct: number; // UA
    mechanicalAvailabilityPct: number; // MA
    effectiveUtilizationPct: number; // EU
  };
}

export interface MiningOperatorProfile {
  id: string;
  name: string;
  nik: string;
  badgeNumber: string;
  phone: string;
  siteId: string;
  siteName: string;
  certificationNumber: string; // SIO Kemenaker / ESDM
  certificationType: string; // SIO Kelas 1 / Kelas 2
  kimperNumber: string; // Kartu Izin Mengemudi Perusahaan
  kimperExpiryDate: string;
  authorizedEquipments: MiningEquipmentType[];
  trainingHistory: {
    courseName: string;
    trainingDate: string;
    validUntil: string;
    institution: string;
  }[];
  skillLevel: MiningSkillLevel;
  experienceYears: number;
  totalOperatingHoursHM: number;
  currentShift: MiningShiftType;
  workingHoursToday: number;
  drivingHoursToday: number;
  fatigueScore: number; // 0 - 100 (Higher = more fatigue risk)
  safetyScore: number; // 0 - 100 (Higher = safer)
  bloodPressureMorning: string; // e.g. "120/80"
  dssAlertsTodayCount: number; // Driver Safety System camera alerts (distraction/yawn)
  assignedEquipmentCode?: string;
  status: 'ACTIVE_WORKING' | 'ON_BREAK' | 'STANDBY' | 'FATIGUED_RESTING' | 'OFF_DUTY';
}

export interface MiningShiftRecord {
  id: string;
  shiftCode: string;
  shiftType: MiningShiftType;
  shiftDate: string;
  startTime: string;
  endTime: string;
  siteId: string;
  siteName: string;
  pitId: string;
  pitName: string;
  supervisorName: string;
  activeEquipmentCount: number;
  activeOperatorsCount: number;
  targetTon: number;
  actualTon: number;
  targetBcm: number;
  actualBcm: number;
  totalTrips: number;
  totalFuelConsumedLiters: number;
  toolboxMeetingTopic: string; // Topik P5M
  weatherCondition: 'SUNNY' | 'CLOUDY' | 'DRIZZLE' | 'HEAVY_RAIN' | 'FOGGY';
  rainDelayHours: number;
  slipperyDelayHours: number;
  status: 'ONGOING' | 'COMPLETED' | 'HANDOVER';
}

export interface MiningDispatchCycle {
  id: string;
  cycleNumber: string;
  excavatorId: string;
  excavatorCode: string;
  dumpTruckId: string;
  dumpTruckCode: string;
  operatorId: string;
  operatorName: string;
  siteName: string;
  pitName: string;
  benchName: string;
  loadingPoint: string;
  dumpingPoint: string;
  materialName: string;
  materialCategory: MiningMaterialCategory;
  payloadTon: number;
  payloadBcm: number;
  status: MiningDispatchCycleStatus;
  startTime: string;
  queueLoadingTimeMin: number;
  loadingTimeMin: number;
  haulingTimeMin: number;
  queueDumpingTimeMin: number;
  dumpingTimeMin: number;
  returnTimeMin: number;
  totalCycleTimeMin: number;
  haulingDistanceKm: number;
  avgHaulSpeedKmh: number;
  matchFactor: number;
  notes?: string;
}

export interface MiningWeighbridgeTicket {
  id: string;
  ticketNumber: string;
  date: string;
  timeIn: string;
  timeOut: string;
  dumpTruckCode: string;
  operatorName: string;
  siteName: string;
  pitOrigin: string;
  destinationStockpile: string;
  materialName: string;
  grossWeightTon: number;
  tareWeightTon: number;
  netPayloadTon: number;
  targetCapacityTon: number;
  complianceStatus: 'OPTIMAL' | 'OVERLOAD' | 'UNDERLOAD';
  weighbridgeScaleId: string;
  rfidCardTag: string;
}

export interface MiningSafetyIncident {
  id: string;
  incidentCode: string;
  date: string;
  siteName: string;
  pitName: string;
  locationDetails: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 
    | 'FATIGUE_MICRO_SLEEP' 
    | 'SPEEDING_HAUL_ROAD' 
    | 'HIGHWALL_FALL' 
    | 'EQUIPMENT_BLINDSPOT_CONTACT' 
    | 'BRAKE_MALFUNCTION' 
    | 'TIRE_BURST' 
    | 'FUEL_SPILL' 
    | 'NEAR_MISS';
  involvedEquipmentCode: string;
  operatorName: string;
  description: string;
  immediateAction: string;
  rootCauseAnalysis: string;
  correctiveActions: string[];
  investigatorKtt: string;
  status: 'INVESTIGATING' | 'CORRECTIVE_ACTION_PENDING' | 'CLOSED';
}

export interface MiningOtrTyreLog {
  id: string;
  tyreSerialNumber: string;
  equipmentCode: string;
  position: 'FRONT_LEFT' | 'FRONT_RIGHT' | 'REAR_OUTER_LEFT' | 'REAR_INNER_LEFT' | 'REAR_OUTER_RIGHT' | 'REAR_INNER_RIGHT';
  brand: string; // Bridgestone, Michelin, Goodyear
  size: string; // e.g. "27.00R49", "33.00R51", "40.00R57"
  initialTreadDepthMm: number;
  currentTreadDepthMm: number;
  treadWearPct: number;
  currentPressurePsi: number;
  recommendedPressurePsi: number;
  tkphRating: number; // Ton-Kilometer Per Hour
  operatingHours: number;
  estimatedCostPerOperatingHourIdr: number;
  conditionStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_INSPECTION' | 'CRITICAL_CHANGE_REQUIRED';
}

export interface MiningCostPnl {
  id: string;
  equipmentCode: string;
  equipmentType: MiningEquipmentType;
  siteName: string;
  periodMonth: string;
  operatingHoursHM: number;
  productionTon: number;
  productionBcm: number;
  revenueIdr: number;
  fuelCostIdr: number;
  maintenanceCostIdr: number;
  tyreCostIdr: number;
  operatorWagesIdr: number;
  depreciationCostIdr: number;
  totalCostIdr: number;
  netMarginIdr: number;
  marginPct: number;
  costPerTonIdr: number;
  costPerBcmIdr: number;
  costPerKmIdr: number;
}

export interface AIMiningDailyBriefing {
  date: string;
  shift: string;
  siteName: string;
  kttName: string;
  executiveSummary: string;
  totalProductionTon: number;
  targetProductionTon: number;
  achievementPct: number;
  totalBcmAchieved: number;
  activeFleetsCount: number;
  averageMatchFactor: number;
  fuelBurnRateAvg: number;
  lostTimeInjuryHours: number;
  highRiskAlerts: string[];
  optimizationRecommendations: string[];
  weatherForecastImpact: string;
}

export type MiningTabId = 
  | 'dashboard'
  | 'sites'
  | 'pits'
  | 'benches'
  | 'materials'
  | 'equipment'
  | 'operators'
  | 'shifts'
  | 'dispatch'
  | 'hauling'
  | 'fuel'
  | 'safety'
  | 'maintenance'
  | 'productivity'
  | 'ai-copilot'
  | 'reports';
