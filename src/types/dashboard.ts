/**
 * Fleet Intelligence Smart AI - Dashboard Domain Types
 * PROMPT 8 - Smart Dashboard Architecture & Data Models
 */

import { VehicleStatus, AlertSeverity, UserRole } from './index';

export type DateRangeOption =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'custom';

export interface DashboardFilterState {
  dateRange: DateRangeOption;
  customStartDate?: string;
  customEndDate?: string;
  fleetGroup: string; // 'all' | specific group name
  branchId: string; // 'all' | specific branch ID
  tenantId: string;
}

export interface FleetKPIs {
  totalVehicles: number;
  totalVehiclesTrend: string;
  activeVehicles: number;
  movingVehicles: number;
  idleVehicles: number;
  stoppedVehicles: number;
  offlineVehicles: number;
  tripsToday: number;
  distanceTodayKm: number;
  fleetUtilizationPercent: number;
  fleetAvailabilityPercent: number;
  averageSpeedKmH: number;
  drivingHours: number;
  idleHours: number;
}

export interface VehicleStatusSummary {
  moving: number;
  idle: number;
  stopped: number;
  offline: number;
  maintenance: number;
  total: number;
}

export interface MapPreviewVehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  brandModel: string;
  status: VehicleStatus;
  speedKmH: number;
  locationName: string;
  lat: number;
  lng: number;
  lastUpdatedText: string;
  tripNumber?: string;
}

export interface AlertKPISummary {
  critical: number;
  high: number;
  medium: number;
  resolvedToday: number;
}

export interface DashboardAlertItem {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: string;
  timeAgo: string;
}

export interface DriverFactorBreakdown {
  speedingEvents: number;
  harshBrakingEvents: number;
  harshAccelerationEvents: number;
  harshCorneringEvents: number;
  seatbeltViolations: number;
  excessiveIdleMinutes: number;
  drivingHoursTotal: number;
}

export interface TopDriverItem {
  id: string;
  name: string;
  avatarUrl?: string;
  score: number;
  tripsCompleted: number;
  assignedVehiclePlate: string;
}

export interface DriverAtRiskItem {
  id: string;
  name: string;
  avatarUrl?: string;
  score: number;
  primaryRiskReason: string;
  assignedVehiclePlate: string;
  recentIncidentCount: number;
}

export interface DriverScoreSummary {
  averageScore: number;
  scoreTrendVsLastWeekPercent: number;
  topDrivers: TopDriverItem[];
  driversAtRisk: DriverAtRiskItem[];
  factorBreakdown: DriverFactorBreakdown;
}

export interface FuelTrendDataPoint {
  dateLabel: string;
  consumptionLiters: number;
  costIdr: number;
  efficiencyKmL: number;
}

export interface FuelAnomalyItem {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  deviationPercent: number; // e.g. +28
  expectedLiters: number;
  actualLiters: number;
  spbuLocation: string;
  timeAgo: string;
  estimatedCostLossIdr: number;
}

export interface FuelSummary {
  totalConsumptionLiters: number;
  totalCostIdr: number;
  averageEfficiencyKmL: number;
  efficiencyTrendPercent: number;
  anomalyCount: number;
  trendChart: FuelTrendDataPoint[];
  anomalies: FuelAnomalyItem[];
}

export interface MaintenanceHealthSummary {
  overallHealthPercent: number;
  healthyVehicles: number;
  dueSoon: number;
  overdue: number;
  inService: number;
  breakdown: number;
  healthBreakdown: {
    engine: number;
    battery: number;
    gpsDevice: number;
    tires: number;
    service: number;
  };
  upcomingCalendarEvents: {
    id: string;
    vehiclePlate: string;
    type: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    workshopName: string;
  }[];
}

export interface TripSummary {
  scheduled: number;
  inProgress: number;
  completed: number;
  delayed: number;
  cancelled: number;
  onTimePerformancePercent: number;
  distanceTodayKm: number;
  fleetUtilizationPercent: number;
  vehicleUtilizationPercent: number;
}

export interface DashboardAIInsight {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'OPPORTUNITY';
  finding: string;
  evidence: string;
  potentialImpactText: string;
  recommendation: string;
  confidencePercent: number; // e.g. 89
  actionLabel: string;
  actionRoute: string;
  targetVehicleId?: string;
  category: 'fuel' | 'maintenance' | 'driver' | 'trip' | 'fleet';
}

export interface RoleWidgetVisibility {
  showFleetKPIs: boolean;
  showVehicleStatus: boolean;
  showLiveMap: boolean;
  showAlerts: boolean;
  showDriverSafety: boolean;
  showFuel: boolean;
  showMaintenance: boolean;
  showTrips: boolean;
  showAIInsights: boolean;
  showPersonalDriverStats: boolean;
  showFinancialMetrics: boolean;
}
