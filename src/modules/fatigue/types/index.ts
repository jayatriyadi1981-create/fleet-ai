/**
 * Fleet Intelligence Smart AI - Fatigue Management & Driver Fatigue Intelligence
 * PROMPT 23 - Complete Domain Types & Architecture
 */

export type FatigueRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type FatigueDataSource = 
  | 'GPS Derived' 
  | 'Driver Reported' 
  | 'Admin Entered' 
  | 'System Calculated' 
  | 'AI Estimated';

export type FatigueConfidence = 'High' | 'Medium' | 'Low';

export interface RiskFactorItem {
  factor: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactScore: number; // 0-100 contribution
  description: string;
  recommendation?: string;
}

export interface DriverFatigueProfile {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  branchId: string;
  branchName: string;
  departmentId?: string;
  departmentName?: string;
  
  // Scores & Levels
  currentScore: number; // 0-100 (80-100 Low, 60-79 Moderate, 40-59 High, 0-39 Critical)
  riskLevel: FatigueRiskLevel;
  
  // Hours Breakdown Today
  drivingHoursToday: number; // e.g. 5.2 hours
  restHoursToday: number; // e.g. 7.5 hours
  shiftHoursToday: number; // e.g. 8.0 hours
  nightDrivingHoursToday: number; // e.g. 2.5 hours
  
  // Continuous & Consecutive metrics
  consecutiveDrivingHours: number; // e.g. 3.8 hours without break
  consecutiveShiftDays: number; // e.g. 5 days
  
  // Timestamps
  lastRestAt: string;
  lastDrivingStartAt?: string;
  lastDrivingEndAt?: string;
  
  // Current Shift
  currentShiftId?: string;
  currentShiftName?: string;
  
  // Transparent Factor Breakdown
  riskFactors: RiskFactorItem[];
  
  // Operational Quality Metadata
  lastCalculatedAt: string;
  confidence: FatigueConfidence;
  dataSource: FatigueDataSource;
  
  createdAt: string;
  updatedAt: string;
}

export interface DrivingSession {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  tripId?: string;
  deviceId?: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  distanceKm: number;
  startLocation: string;
  endLocation?: string;
  nightDrivingMinutes: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ESTIMATED';
  createdAt: string;
}

export type RestSessionType = 'BREAK' | 'REST' | 'SLEEP' | 'OFF_DUTY';
export type RestSessionSource = 'MANUAL' | 'GPS_INFERRED' | 'SHIFT_SYSTEM' | 'DRIVER_APP' | 'ADMIN';

export interface RestSession {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  type: RestSessionType;
  source: RestSessionSource;
  verified: boolean;
  note?: string;
  createdAt: string;
}

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'Custom' | 'Rotating';

export interface Shift {
  id: string;
  tenantId: string;
  name: string;
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "17:00"
  durationHours: number;
  type: ShiftType;
  branchId: string;
  branchName: string;
  departmentId?: string;
  maxDrivingHours: number; // e.g. 8
  requiredRestHours: number; // e.g. 10
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DriverShiftAssignment {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  shiftId: string;
  shiftName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
  assignedBy: string;
  createdAt: string;
}

export interface NightDrivingSession {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  tripId?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  startLocation: string;
  endLocation: string;
  createdAt: string;
}

export type FatigueAlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type FatigueAlertRuleType = 
  | 'FATIGUE_HIGH_RISK'
  | 'FATIGUE_CRITICAL'
  | 'EXCESSIVE_DRIVING'
  | 'INSUFFICIENT_REST'
  | 'LONG_SHIFT'
  | 'EXCESSIVE_NIGHT_DRIVING'
  | 'CONSECUTIVE_SHIFT_RISK';

export interface FatigueAlert {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  vehicleId?: string;
  vehiclePlate?: string;
  tripId?: string;
  severity: FatigueAlertSeverity;
  ruleType: FatigueAlertRuleType;
  title: string;
  message: string;
  drivingHours: number;
  lastRestHours: number;
  shiftName: string;
  nightHours: number;
  currentLocation: string;
  triggeredAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actionTaken?: string;
  escalated?: boolean;
  triggerExplanation: string[];
}

export type FatigueSelfReportLevel = 'Low' | 'Moderate' | 'High' | 'Need Assistance';

export interface FatigueSelfReport {
  id: string;
  tenantId: string;
  driverId: string;
  driverName: string;
  timestamp: string;
  riskLevel: FatigueSelfReportLevel;
  note?: string;
  location?: string;
  tripId?: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface FatigueScoreWeightConfig {
  drivingDurationWeight: number; // e.g. 25
  continuousDrivingWeight: number; // e.g. 20
  restDurationWeight: number; // e.g. 20
  shiftDurationWeight: number; // e.g. 15
  nightDrivingWeight: number; // e.g. 10
  consecutiveShiftsWeight: number; // e.g. 5
  recentBehaviorWeight: number; // e.g. 5
}

export interface FatigueRule {
  id: string;
  tenantId: string;
  ruleName: string;
  description: string;
  maxContinuousDrivingHours: number; // e.g. 4.0
  warningDrivingThresholdHours: number; // e.g. 3.5
  highDrivingThresholdHours: number; // e.g. 4.0
  criticalDrivingThresholdHours: number; // e.g. 5.0
  minRequiredRestHours: number; // e.g. 8.0
  maxShiftHours: number; // e.g. 12.0
  nightStart: string; // e.g. "22:00"
  nightEnd: string; // e.g. "06:00"
  timezone: string; // e.g. "Asia/Jakarta"
  version: string; // e.g. "v1.4"
  effectiveDate: string; // e.g. "2026-09-01"
  changedBy: string;
  changeReason: string;
  active: boolean;
  policySource: string; // e.g. "Standard K3 Operasional Transportasi Permenhub"
  policyName: string;
  jurisdiction: string;
}

export interface FatigueHistoryRecord {
  id: string;
  tenantId: string;
  date: string;
  driverId: string;
  driverName: string;
  shiftName: string;
  drivingHours: number;
  restHours: number;
  nightHours: number;
  fatigueScore: number;
  riskLevel: FatigueRiskLevel;
  alertsCount: number;
}

export interface FatigueTimelineItem {
  id: string;
  timestamp: string;
  type: 'SHIFT' | 'DRIVING' | 'BREAK' | 'REST' | 'NIGHT_DRIVING' | 'ALERT' | 'DRIVER_BEHAVIOR' | 'SAFETY_EVENT';
  title: string;
  description: string;
  severity?: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  location?: string;
}

export interface FatigueOverviewKPIs {
  totalDrivers: number;
  activeDrivers: number;
  driversCurrentlyDriving: number;
  highRiskDrivers: number;
  criticalRiskDrivers: number;
  avgDrivingHours: number;
  avgRestHours: number;
  restCompliancePercent: number;
  totalNightDrivingHours: number;
  activeAlertsCount: number;
  overdueRestCount: number;
  fleetFatigueScore: number;
}
