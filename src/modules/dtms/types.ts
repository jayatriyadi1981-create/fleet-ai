export type DumpTruckCategory = 
  | 'OFF_HIGHWAY_RIGID'     // e.g. CAT 777, Komatsu HD785 (OHT 50-100 Ton)
  | 'ARTICULATED_DUMP_TRUCK'// e.g. Volvo A40G, CAT 740 (ADT 30-45 Ton)
  | 'HEAVY_DUMP_TRUCK_8X4'  // e.g. Scania P460, Volvo FMX, Mercedes Arocs (40-50 Ton)
  | 'HEAVY_DUMP_TRUCK_6X4'  // e.g. Hino 500 FM260JD, Quester GWE, Isuzu Giga (25-35 Ton)
  | 'MEDIUM_TIPPER_4X2';    // e.g. Mitsubishi Canter HD, Hino Dutro (8-12 Ton)

export type DumpTruckStatus = 
  | 'LOADING'
  | 'HAULING_LOADED'
  | 'QUEUEING_DUMP'
  | 'DUMPING'
  | 'RETURNING_EMPTY'
  | 'QUEUEING_LOAD'
  | 'STANDBY_IDLE'
  | 'BREAKDOWN_MAINTENANCE'
  | 'REFUELING';

export type MaterialType = 
  | 'OVERBURDEN_OB'
  | 'COAL_BATUBARA'
  | 'NICKEL_ORE'
  | 'IRON_ORE'
  | 'LIMESTONE_BATUKAPUR'
  | 'AGGREGATE_PASIR_BATU'
  | 'TOPSOIL'
  | 'CLAY_BALLAST';

export type PayloadStatus = 'UNDERLOAD' | 'OPTIMAL' | 'OVERLOAD_WARNING' | 'CRITICAL_OVERLOAD';

export interface DumpTruckUnit {
  id: string;
  hullNumber: string; // e.g. DT-101, DT-204
  plateNumber: string;
  category: DumpTruckCategory;
  model: string; // e.g. Komatsu HD785-7, Scania P460 6x4, Hino FM260JD
  brand: string;
  vesselCapacityM3: number;
  ratedPayloadTons: number;
  currentPayloadTons: number;
  tareWeightTons: number;
  currentGrossWeightTons: number;
  payloadStatus: PayloadStatus;
  status: DumpTruckStatus;
  currentMaterial: MaterialType;
  assignedExcavator: string; // e.g. EX-01 (Hitachi EX1200)
  assignedLoadingPoint: string; // e.g. Pit Alpha - Bench 12
  assignedDumpingPoint: string; // e.g. ROM Stockpile 2 / Waste Dump South
  currentDriverName: string;
  driverKimperNo: string;
  fuelLevelPct: number;
  fuelBurnRateLtrPerKm: number;
  bodyHoistAngleDeg: number; // 0 to 60 deg
  ptoActive: boolean;
  speedKmh: number;
  speedLimitKmh: number;
  tirePressureAvgPsi: number;
  todayRits: number;
  todayTonnage: number;
  targetDailyRits: number;
  location: {
    lat: number;
    lng: number;
    zoneName: string;
  };
  lastUpdated: string;
}

export interface HaulCycleRecord {
  id: string;
  cycleCode: string;
  truckHullNo: string;
  driverName: string;
  excavatorHullNo: string;
  material: MaterialType;
  loadingPoint: string;
  dumpingPoint: string;
  startTime: string;
  endTime: string;
  queueLoadTimeMins: number;
  loadingTimeMins: number;
  loadedHaulTimeMins: number;
  queueDumpTimeMins: number;
  dumpingTimeMins: number;
  emptyReturnTimeMins: number;
  totalCycleTimeMins: number;
  distanceLoadedKm: number;
  distanceEmptyKm: number;
  grossWeightTon: number;
  netPayloadTon: number;
  fuelUsedLiters: number;
  efficiencyScore: number; // 0 - 100
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ABORTED';
}

export interface WeighbridgeRecord {
  id: string;
  ticketNo: string;
  truckHullNo: string;
  driverName: string;
  material: MaterialType;
  sourcePit: string;
  destination: string;
  firstWeightTon: number; // Gross
  secondWeightTon: number; // Tare
  netWeightTon: number;
  ratedCapacityTon: number;
  discrepancyTon: number;
  payloadClassification: PayloadStatus;
  timestamp: string;
  operatorName: string;
  sealBarcode: string;
}

export interface HaulRoadSegment {
  id: string;
  segmentCode: string;
  segmentName: string;
  startPoint: string;
  endPoint: string;
  lengthKm: number;
  averageGradePct: number; // Kemiringan % (+ naik, - turun)
  maxSpeedKmh: number;
  roadCondition: 'GOOD' | 'DUSTY' | 'SLIPPERY_MUDDY' | 'POTHOLES' | 'UNDER_GRADING';
  waterTruckScheduled: boolean;
  activeTruckCount: number;
  dustLevelPpm: number;
}

export interface TireRecord {
  id: string;
  serialNumber: string;
  truckHullNo: string;
  wheelPosition: string; // e.g. POS-1 (Front Left), POS-2 (Front Right), POS-3 (Drive 1 L-Out), etc.
  brand: string;
  size: string; // e.g. 27.00R49, 12.00R24
  pattern: string; // e.g. E4 Rock Lug
  currentPressurePsi: number;
  recommendedPressurePsi: number;
  temperatureCelsius: number;
  initialTreadDepthMm: number;
  currentTreadDepthMm: number;
  hoursRun: number;
  estimatedTkph: number;
  status: 'HEALTHY' | 'LOW_PRESSURE' | 'OVER_TEMP' | 'CRITICAL_TREAD' | 'DAMAGED';
}

export interface DumpTruckDriver {
  id: string;
  badgeNumber: string;
  name: string;
  phone: string;
  simType: string;
  kimperNo: string;
  kimperExpiry: string;
  assignedTruckHull: string;
  shift: 'SHIFT_1_DAY' | 'SHIFT_2_NIGHT';
  todayRitsCompleted: number;
  todayTonnageHauled: number;
  fatigueScorePct: number; // 0 = Fresh, 100 = Severe Fatigue
  dssAlertsToday: number; // Driver Safety System (Yawning, Phone, Distraction)
  safetyScorePct: number;
  overSpeedIncidents: number;
  incentiveBonusRp: number;
}

export interface MatchFactorExcavator {
  id: string;
  excavatorCode: string;
  model: string;
  bucketCapacityM3?: number;
  loadingPoint: string;
  assignedTruckCount: number;
  avgLoadingTimeMins: number;
  avgTruckCycleTimeMins: number;
  calculatedMatchFactor: number; // MF = (N_dt * t_load) / (N_exc * t_cycle)
  status: 'BALANCED' | 'TRUCK_QUEUE' | 'EXCAVATOR_WAITING';
  hourlyTargetBcm: number;
  actualHourlyBcm: number;
}

export interface DtmsKpis {
  totalActiveTrucks: number;
  totalStandbyTrucks: number;
  totalBreakdownTrucks: number;
  totalRitsToday: number;
  targetRitsToday: number;
  targetDailyRits?: number;
  totalTonnageToday: number;
  totalBcmToday: number;
  avgCycleTimeMins: number;
  avgPayloadPerTruckTon: number;
  overloadIncidentCount: number;
  fleetAvailabilityPaPct: number; // Physical Availability
  fleetUtilizationUaPct: number; // Use of Availability
  fuelConsumptionLiterPerTon: number;
  totalFuelBurnedLiters: number;
  totalGrossRevenueRp: number;
}
