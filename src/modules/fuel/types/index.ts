/**
 * Fleet Intelligence Smart AI - Fuel Management & Smart AI Fuel Intelligence
 * PROMPT 24 - Complete Architecture Types
 */

export type FuelType = 
  | 'DIESEL' 
  | 'GASOLINE' 
  | 'PERTALITE' 
  | 'PERTAMAX' 
  | 'SOLAR' 
  | 'BIODIESEL' 
  | 'ELECTRIC' 
  | 'HYBRID' 
  | 'OTHER';

export type FuelDataSource = 
  | 'FUEL_SENSOR' 
  | 'CAN_BUS' 
  | 'OBD' 
  | 'GPS_DEVICE' 
  | 'MANUAL_ENTRY' 
  | 'FUEL_CARD' 
  | 'FUEL_STATION' 
  | 'IMPORT' 
  | 'API' 
  | 'AI_ESTIMATE';

export type FuelConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FuelReading {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate?: string;
  deviceId?: string;
  timestamp: string;
  fuelLevel: number; // Liter
  fuelPercentage: number; // 0 - 100
  fuelTemperature?: number; // °C
  voltage?: number;
  tankId?: 'PRIMARY' | 'SECONDARY';
  source: FuelDataSource;
  confidence: FuelConfidence;
  latitude: number;
  longitude: number;
  odometer: number;
  engineHours: number;
  ignitionStatus?: boolean;
  rawFuelLevel?: number; // Raw unfiltered
  createdAt: string;
}

export interface FuelConsumption {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  periodStart: string;
  periodEnd: string;
  startFuel: number; // L
  endFuel: number; // L
  fuelAdded: number; // L
  fuelRemoved: number; // L
  fuelConsumed: number; // L
  distance: number; // km
  consumptionKmPerLiter: number; // km/L
  consumptionLiterPer100Km: number; // L/100km
  fuelCost: number; // IDR
  costPerKm: number; // IDR/km
  expectedKmPerLiter?: number;
  variancePct?: number; // % difference from expected
  efficiencyScore?: number; // 0 - 100
  dataSource: FuelDataSource;
  confidence: FuelConfidence;
  createdAt: string;
}

export type RefuelingStatus = 'DETECTED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export interface RefuelingEvent {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  timestamp: string;
  fuelType: FuelType;
  volume: number; // Liters
  pricePerLiter: number; // IDR/L
  totalCost: number; // IDR
  fuelLevelBefore: number; // L
  fuelLevelAfter: number; // L
  odometer: number;
  engineHours?: number;
  stationId?: string;
  stationName?: string;
  latitude: number;
  longitude: number;
  paymentMethod?: 'FUEL_CARD' | 'CASH' | 'COMPANY_ACCOUNT' | 'REIMBURSE';
  receiptNumber?: string;
  receiptPhotoUrl?: string;
  source: FuelDataSource;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  status: RefuelingStatus;
  reconciliationStatus?: 'MATCH' | 'PARTIAL_MATCH' | 'MISMATCH' | 'UNVERIFIED';
  reconciliationDiffPct?: number;
  createdAt: string;
  updatedAt: string;
}

export type FuelDrainStatus = 'NEW' | 'UNDER_REVIEW' | 'VERIFIED' | 'FALSE_POSITIVE' | 'RESOLVED';

export interface FuelDrainEvent {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  timestamp: string;
  fuelBefore: number; // L
  fuelAfter: number; // L
  fuelDrop: number; // L dropped
  duration: number; // minutes
  latitude: number;
  longitude: number;
  locationName?: string;
  ignitionStatus: boolean;
  vehicleSpeed: number;
  source: FuelDataSource;
  confidence: FuelConfidence;
  status: FuelDrainStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  evidenceNotes?: string;
  createdAt: string;
}

export type FuelAnomalyType = 
  | 'SUSPECTED_DRAIN' 
  | 'UNEXPECTED_INCREASE' 
  | 'ABNORMAL_CONSUMPTION' 
  | 'REFUELING_MISMATCH' 
  | 'SENSOR_NOISE' 
  | 'SENSOR_FLATLINE' 
  | 'FUEL_JUMP' 
  | 'COST_ANOMALY' 
  | 'UNAUTHORIZED_REFUELING';

export interface FuelAnomaly {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  type: FuelAnomalyType;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  expectedValue: number;
  actualValue: number;
  variance: number;
  confidence: FuelConfidence;
  evidence: {
    gpsSpeed: number;
    ignition: boolean;
    locationName?: string;
    description: string;
    sensorHealthStatus?: string;
  };
  status: 'NEW' | 'UNDER_REVIEW' | 'VERIFIED' | 'FALSE_POSITIVE' | 'RESOLVED';
  reviewedBy?: string;
  reviewedAt?: string;
  resolutionNotes?: string;
  createdAt: string;
}

export interface FuelStation {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  brand: 'PERTAMINA' | 'SHELL' | 'BP' | 'VIVO' | 'PRIVATE_DEPOT' | 'OTHER';
  status: 'AUTHORIZED' | 'UNAUTHORIZED' | 'PENDING_REVIEW';
  fuelTypes: FuelType[];
  pricePerLiterMap?: Record<string, number>;
  geofenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelPrice {
  id: string;
  tenantId: string;
  fuelType: FuelType;
  pricePerLiter: number;
  effectiveFrom: string;
  effectiveTo?: string;
  source: 'OFFICIAL_GOVT' | 'STATION_PRICE' | 'MANUAL' | 'IMPORTED';
  stationId?: string;
  createdAt: string;
}

export interface FuelRule {
  id: string;
  tenantId: string;
  ruleName: string;
  description: string;
  lowFuelThresholdPct: number; // e.g. 20%
  criticalFuelThresholdPct: number; // e.g. 10%
  minDrainVolumeLiters: number; // e.g. 15 L
  drainTimeWindowMinutes: number; // e.g. 10 min
  consumptionTolerancePct: number; // e.g. 15%
  refuelingThresholdLiters: number; // e.g. 20 L
  costPerKmThreshold: number; // e.g. 2500 IDR/km
  sensorFlatlineHours: number; // e.g. 12 hours
  sensorJumpThresholdPct: number; // e.g. 15%
  authorizedStationsOnly: boolean;
  version: string;
  effectiveDate: string;
  changedBy: string;
  changeReason: string;
  active: boolean;
}

export interface FuelBudget {
  period: string; // "2026-08"
  branchId?: string;
  branchName?: string;
  vehicleGroupId?: string;
  fuelType: FuelType;
  budgetAmount: number; // IDR
  budgetVolume: number; // Liters
  actualAmount: number;
  actualVolume: number;
}

export interface FuelOverviewKPIs {
  totalFuelConsumedLiters: number;
  totalFuelPurchasedLiters: number;
  currentFleetFuelLiters: number;
  avgConsumptionKmPerLiter: number;
  avgConsumptionLiterPer100Km: number;
  totalFuelCostIdr: number;
  avgCostPerKmIdr: number;
  fuelEfficiencyIndexPct: number;
  fuelVariancePct: number;
  totalAnomaliesCount: number;
  suspectedDrainEventsCount: number;
  refuelingEventsCount: number;
  dataStaleCount: number;
}

export interface VehicleFuelConfig {
  vehicleId: string;
  vehiclePlate: string;
  fuelType: FuelType;
  tankCapacityLiters: number; // Primary
  secondaryTankCapacityLiters?: number;
  fuelSensorType: 'ULTRASONIC' | 'CAN_BUS' | 'FLOAT_LEVER' | 'PRESSURE' | 'OBD_INFERRED';
  sensorOffsetPct: number;
  expectedKmPerLiter: number; // Target
  expectedLiterPer100Km: number;
  tolerancePct: number; // Acceptable deviation
}

export interface FuelFilterState {
  dateRangeStart: string;
  dateRangeEnd: string;
  branchId: string;
  departmentId: string;
  vehicleGroupId: string;
  vehicleId: string;
  driverId: string;
  fuelType: string;
  routeId: string;
  tripId: string;
  stationId: string;
}
