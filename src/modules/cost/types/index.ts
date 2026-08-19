/**
 * Fleet Intelligence Smart AI - Cost Analytics & Total Operating Cost Engine Types
 * PROMPT 37 - Comprehensive Enterprise Cost Intelligence Schema
 */

export type CostCategoryKey =
  | 'FUEL'
  | 'MAINTENANCE'
  | 'PARTS'
  | 'DRIVER'
  | 'TOLL'
  | 'PARKING'
  | 'INSURANCE'
  | 'TAX'
  | 'GPS_DEVICE'
  | 'TELEMATICS'
  | 'TYRES'
  | 'CLEANING'
  | 'INSPECTION'
  | 'ACCIDENT'
  | 'RENTAL'
  | 'OTHER';

export type CostType =
  | 'FIXED'
  | 'VARIABLE'
  | 'SEMI_VARIABLE'
  | 'ONE_TIME'
  | 'RECURRING';

export type CostSource =
  | 'FUEL_TRANSACTION'
  | 'MAINTENANCE_WORK_ORDER'
  | 'PARTS_PURCHASE'
  | 'DRIVER_PAYROLL'
  | 'TRIP_EXPENSE'
  | 'TOLL_TRANSACTION'
  | 'INSURANCE_PREMIUM'
  | 'TAX_PAYMENT'
  | 'MANUAL_EXPENSE'
  | 'IMPORTED_EXPENSE'
  | 'API_INTEGRATION';

export type CostStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'POSTED'
  | 'REJECTED'
  | 'CANCELLED';

export type AllocationMethod =
  | 'DIRECT'
  | 'BY_MILEAGE'
  | 'BY_TRIP'
  | 'BY_OPERATING_HOURS'
  | 'BY_DRIVER_HOURS'
  | 'BY_PERCENTAGE';

export type AllocationStatus =
  | 'UNALLOCATED'
  | 'DIRECTLY_ALLOCATED'
  | 'SPLIT_ALLOCATED'
  | 'DERIVED_CHILD';

export type CostPeriodFilter =
  | 'TODAY'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'QUARTER'
  | 'YEAR'
  | 'CUSTOM';

export type ComparisonPeriod =
  | 'PREVIOUS_PERIOD'
  | 'SAME_PERIOD_LAST_YEAR';

export interface CostRecord {
  id: string;
  tenantId: string;
  branchId: string;
  branchName?: string;
  category: CostCategoryKey;
  type: CostType;
  amount: number;
  currency: string; // Default 'IDR'
  date: string; // ISO format YYYY-MM-DD
  vehicleId?: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  tripCode?: string;
  routeId?: string;
  routeName?: string;
  customerId?: string;
  customerName?: string;
  source: CostSource;
  sourceId?: string;
  allocationMethod: AllocationMethod;
  allocationStatus: AllocationStatus;
  parentCostId?: string;
  status: CostStatus;
  requiresApproval?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
  tags?: string[];
  receiptUrl?: string;
  isEstimated?: boolean;
}

export interface CostCategoryConfig {
  id: string;
  key: CostCategoryKey;
  name: string;
  defaultType: CostType;
  iconName: string;
  colorHex: string;
  isCustom: boolean;
  isActive: boolean;
  isArchived: boolean;
  requiresApprovalThreshold: number; // e.g. 10.000.000 IDR
  description: string;
}

export interface FuelCostMetric {
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverId?: string;
  driverName?: string;
  routeId?: string;
  routeName?: string;
  branchId: string;
  branchName: string;
  totalLiters: number;
  fuelCostIdr: number;
  estimatedFuelCostIdr?: number;
  mileageKm: number;
  fuelCostPerKmIdr: number;
  fuelCostPerTripIdr: number;
  fuelConsumptionLPer100Km: number;
  fuelEfficiencyKmPerL: number;
  averageFuelPricePerL: number;
  fuelType: string;
  isEstimated: boolean;
}

export interface FuelPriceHistoryRecord {
  id: string;
  date: string;
  fuelType: 'BIO_SOLAR' | 'DEXLITE' | 'PERTAMINA_DEX' | 'PERTALITE' | 'PERTAMAX';
  pricePerLiter: number;
  source: 'PERTAMINA_OFFICIAL' | 'SPBU_RECEIPT' | 'TELEMATICS_INVOICE' | 'REGULATORY_INDEX';
  station: string;
  region: string;
  notes?: string;
}

export interface MaintenanceCostMetric {
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  branchId: string;
  branchName: string;
  workOrdersCount: number;
  partsCostIdr: number;
  laborCostIdr: number;
  serviceCostIdr: number;
  repairCostIdr: number;
  emergencyRepairCostIdr: number;
  preventiveMaintenanceCostIdr: number;
  correctiveMaintenanceCostIdr: number;
  totalMaintenanceCostIdr: number;
  costPerKmIdr: number;
  recurringIssueFlag?: boolean;
  highCostWarning?: boolean;
}

export interface DriverCostMetric {
  driverId: string;
  driverName: string;
  employeeId: string;
  branchId: string;
  branchName: string;
  compensationModel: 'MONTHLY_SALARY' | 'DAILY_RATE' | 'HOURLY_RATE' | 'PER_TRIP' | 'PER_KM';
  baseSalaryIdr: number;
  overtimeIdr: number;
  allowanceIdr: number;
  tripAllowanceIdr: number;
  mealAllowanceIdr: number;
  accommodationIdr: number;
  bonusIdr: number;
  penaltyIdr: number;
  otherIdr: number;
  totalDriverCostIdr: number;
  drivingHours: number;
  totalDistanceKm: number;
  completedTrips: number;
  costPerKmIdr: number;
  costPerTripIdr: number;
  costPerHourIdr: number;
  isMasked?: boolean; // When viewer lacks finance.view_driver_cost
}

export interface CostPerKmMetric {
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  branchName: string;
  mileageKm: number;
  fuelCostPerKm: number;
  maintenanceCostPerKm: number;
  driverCostPerKm: number;
  otherCostPerKm: number;
  totalCostPerKm: number;
  fleetAverageCostPerKm: number;
  varianceVsFleetAvgPercent: number;
  rank: number; // 1 = most efficient
  status: 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL';
}

export interface CostPerTripMetric {
  tripId: string;
  tripCode: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  routeName: string;
  customerName: string;
  deliveriesCount: number;
  distanceKm: number;
  fuelCostIdr: number;
  driverCostIdr: number;
  maintenanceAllocatedIdr: number;
  tollCostIdr: number;
  otherCostIdr: number;
  totalCostIdr: number;
  costPerKmIdr: number;
  costPerTripIdr: number;
  costPerDeliveryIdr: number | null; // null if deliveriesCount = 0
}

export interface BranchCostMetric {
  branchId: string;
  branchName: string;
  city: string;
  vehicleCount: number;
  driverCount: number;
  mileageKm: number;
  tripsCount: number;
  fuelCostIdr: number;
  maintenanceCostIdr: number;
  driverCostIdr: number;
  tollAndParkingIdr: number;
  otherCostIdr: number;
  totalCostIdr: number;
  costPerKmIdr: number;
  costPerTripIdr: number;
  costEfficiencyScore: number; // 0 - 100
  utilizationRatePercent: number;
  idleRatePercent: number;
  downtimeHours: number;
  efficiencyRank: number;
}

export interface RouteCostMetric {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  tripsCount: number;
  fuelCostIdr: number;
  maintenanceAllocatedIdr: number;
  driverAllocatedIdr: number;
  tollCostIdr: number;
  totalCostIdr: number;
  costPerKmIdr: number;
  costPerTripIdr: number;
  efficiencyScore: number;
}

export interface VehicleCostProfile {
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleType: string;
  branchName: string;
  assignedDriverName?: string;
  totalCostIdr: number;
  costPerKmIdr: number;
  costPerTripIdr: number;
  fuelCostIdr: number;
  maintenanceCostIdr: number;
  driverCostIdr: number;
  downtimeCostIdr: number;
  tollCostIdr: number;
  insuranceCostIdr: number;
  taxCostIdr: number;
  gpsCostIdr: number;
  otherCostIdr: number;
  totalTrips: number;
  totalMileageKm: number;
  status: 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL';
  scorecard: {
    fuelEfficiencyScore: number;
    maintenanceEfficiencyScore: number;
    driverEfficiencyScore: number;
    idleEfficiencyScore: number;
    downtimeEfficiencyScore: number;
    totalCostEfficiencyScore: number;
  };
  tcoMetrics?: {
    purchasePriceIdr: number;
    accumulatedDepreciationIdr: number;
    financingCostIdr: number;
    totalOperatingCostToDateIdr: number;
    currentBookValueIdr: number;
    estimatedResaleValueIdr: number;
  };
}

export interface CostBudgetVariance {
  id: string;
  category: CostCategoryKey | 'TOTAL_OPERATING';
  categoryLabel: string;
  budgetIdr: number;
  actualIdr: number;
  forecastIdr: number;
  varianceIdr: number; // actual - budget
  variancePercent: number; // ((actual - budget) / budget) * 100
  status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET';
}

export interface CostForecastResult {
  period: 'NEXT_7_DAYS' | 'NEXT_30_DAYS' | 'NEXT_3_MONTHS' | 'NEXT_12_MONTHS';
  periodLabel: string;
  forecastAmountIdr: number;
  lowerBoundIdr: number;
  upperBoundIdr: number;
  fuelProjectedIdr: number;
  maintenanceProjectedIdr: number;
  driverProjectedIdr: number;
  otherProjectedIdr: number;
  method: 'HISTORICAL_SEASONAL_REGRESSION' | 'AI_TELEMATICS_EXTRAPOLATION';
  confidencePercent: number;
  seasonalFactors: string[];
  generatedAt: string;
}

export interface AICostInsight {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'OPPORTUNITY';
  headline: string;
  category: CostCategoryKey | 'MULTI_FACTOR';
  mainContributors: Array<{
    factor: string;
    percentageContribution: number;
    amountIdr: number;
    description: string;
  }>;
  rootCauses: string[];
  recommendations: Array<{
    id: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    action: string;
    potentialSavingMonthlyIdr: number;
    difficulty: 'EASY' | 'MODERATE' | 'HARD';
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    calculationBasis: string;
    targetModule?: string;
  }>;
  supportingData: Record<string, number | string>;
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface CostSavingOpportunity {
  id: string;
  title: string;
  category: 'IDLE_REDUCTION' | 'ROUTE_OPTIMIZATION' | 'PREVENTIVE_MAINTENANCE' | 'DRIVER_BEHAVIOR' | 'VEHICLE_REDISTRIBUTION';
  categoryLabel: string;
  currentCostMonthlyIdr: number;
  projectedCostMonthlyIdr: number;
  monthlySavingIdr: number;
  annualSavingIdr: number;
  difficulty: 'EASY' | 'MODERATE' | 'HARD';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assumptions: {
    currentIdleHours?: number;
    targetIdleReductionPercent?: number;
    fuelPricePerLiter?: number;
    estimatedLitersSaved?: number;
    unplannedMaintenanceCount?: number;
    description: string;
  };
}

export interface CostReconciliationItem {
  id: string;
  type: 'FUEL_SENSOR_VS_RECEIPT' | 'MAINTENANCE_INVOICE_VS_WO' | 'DRIVER_PAYROLL_VS_SHIFT';
  typeLabel: string;
  referenceId: string;
  referenceLabel: string;
  date: string;
  vehiclePlate?: string;
  driverName?: string;
  telemetryAmount: number;
  reportedAmount: number;
  discrepancyAmount: number;
  discrepancyPercent: number;
  status: 'MATCH' | 'MINOR_VARIANCE' | 'SUSPICIOUS_SPIKE' | 'FLAGGED';
  details: string;
  suggestedAction: string;
}

export interface CostAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action:
    | 'COST_CREATED'
    | 'COST_EDITED'
    | 'COST_APPROVED'
    | 'COST_REJECTED'
    | 'COST_ALLOCATED'
    | 'COST_REVERSED'
    | 'COST_IMPORTED'
    | 'COST_EXPORTED'
    | 'RECONCILIATION_RUN';
  details: string;
  costRecordId?: string;
  amountIdr?: number;
  ipAddress: string;
}

export interface GlobalCostFilter {
  dateRange: CostPeriodFilter;
  customStartDate?: string;
  customEndDate?: string;
  comparisonPeriod: ComparisonPeriod;
  companyId?: string;
  branchId?: string;
  department?: string;
  vehicleGroupId?: string;
  vehicleId?: string;
  vehicleType?: string;
  driverId?: string;
  driverGroupId?: string;
  tripId?: string;
  routeId?: string;
  customerId?: string;
  costCategory?: CostCategoryKey | 'ALL';
  costType?: CostType | 'ALL';
  currency: string; // 'IDR'
}

export interface WhatIfCostSimulationInput {
  scenarioName: string;
  fuelPriceChangePercent: number; // e.g. -5% or +10%
  idleReductionPercent: number; // e.g. 15%
  preventiveMaintenanceIncreasePercent: number; // e.g. +10%
  correctiveReductionPercent: number; // e.g. -20%
  routeOptimizationEfficiencyPercent: number; // e.g. 5%
  fleetSizeDelta: number; // e.g. +2 vehicles
}

export interface WhatIfCostSimulationResult {
  scenarioName: string;
  baselineTotalCostMonthlyIdr: number;
  projectedTotalCostMonthlyIdr: number;
  totalMonthlySavingIdr: number;
  totalAnnualSavingIdr: number;
  fuelCostDeltaMonthlyIdr: number;
  maintenanceCostDeltaMonthlyIdr: number;
  driverCostDeltaMonthlyIdr: number;
  efficiencyGainPercent: number;
  aiExplanation: string;
}
