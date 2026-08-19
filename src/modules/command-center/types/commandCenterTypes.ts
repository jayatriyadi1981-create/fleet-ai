/**
 * Fleet Intelligence Smart AI - Command Center & Control Room Domain Types
 * PROMPT 47 — 24/7 Mission-Critical Operational Command Center Architecture
 */

import { Vehicle, Driver, AlertNotification, Location, TelemetryData } from '../../../types';
import { MapVehicle } from '../../maps/types';

export type ServiceHealthStatus = 'HEALTHY' | 'DEGRADED' | 'OFFLINE';

export interface CommandCenterHealth {
  gpsIngestion: ServiceHealthStatus;
  apiGateway: ServiceHealthStatus;
  realtimeWs: ServiceHealthStatus;
  notificationEngine: ServiceHealthStatus;
  aiEngine: ServiceHealthStatus;
  database: ServiceHealthStatus;
  lastHeartbeat: string;
  activeSockets: number;
  packetsPerSec: number;
}

export interface CommandCenterFleetKPIs {
  total: number;
  moving: number;
  stopped: number;
  idle: number;
  offline: number;
  maintenance: number;
  emergency: number;
}

export type EmergencyType = 'PANIC' | 'ACCIDENT' | 'CARGO_TAMPER' | 'CRITICAL_OVERSPEED' | 'FATIGUE_CRITICAL' | 'GEOFENCE_BREACH';
export type EmergencySeverity = 'CRITICAL' | 'HIGH';
export type EmergencyStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'DISPATCHED' | 'RESOLVED';
export type EscalationTier = 'DISPATCHER' | 'SAFETY_OFFICER' | 'FLEET_MANAGER' | 'EXECUTIVE_ADMIN';

export interface EmergencyAlertItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverPhotoUrl?: string;
  type: EmergencyType;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  title: string;
  description: string;
  triggeredAt: string;
  location: Location;
  currentSpeed: number;
  batteryLevel: number;
  fuelLevel: number;
  escalationTier: EscalationTier;
  broadcastSentTo: {
    whatsApp: boolean;
    sms: boolean;
    push: boolean;
    email: boolean;
  };
  acknowledgedBy?: {
    userId: string;
    userName: string;
    timestamp: string;
    notes?: string;
  };
  dispatchedUnitId?: string;
  dispatchedDriverName?: string;
  resolutionNotes?: string;
  resolvedBy?: {
    userId: string;
    userName: string;
    timestamp: string;
  };
  audioPlayed?: boolean;
}

export interface CommandAlertItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  category: 'speed' | 'geofence' | 'battery' | 'fuel_drop' | 'harsh_brake' | 'fatigue' | 'maintenance' | 'sos' | 'idle_excess';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolutionStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  resolutionNotes?: string;
  speed?: number;
  location?: Location;
}

export interface DriverRiskItem {
  driverId: string;
  driverName: string;
  phone: string;
  photoUrl?: string;
  riskScore: number; // 0 (safest) - 100 (highest risk)
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  primaryRisks: string[];
  vehicleId?: string;
  plateNumber?: string;
  speedingIncidents24h: number;
  harshBraking24h: number;
  fatigueAlerts24h: number;
  activeTripDurationHours: number;
}

export interface VehicleRiskItem {
  vehicleId: string;
  plateNumber: string;
  brandModel: string;
  riskCategory: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  issueType: 'GPS_LOST' | 'FUEL_ANOMALY' | 'ENGINE_OVERHEAT' | 'BRAKE_WEAR' | 'MAINTENANCE_OVERDUE' | 'BATTERY_LOW' | 'IDLE_EXCESS';
  title: string;
  metricValue: string;
  lastSeen: string;
  branchName: string;
}

export interface AIInsightCard {
  id: string;
  title: string;
  category: 'ANOMALY' | 'PREDICTION' | 'EFFICIENCY' | 'SAFETY';
  severity: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';
  confidenceScore: number; // 0 - 100
  evidenceText: string;
  recommendedAction: string;
  actionType: 'DISPATCH_REROUTE' | 'SCHEDULE_MAINTENANCE' | 'ALERT_DRIVER' | 'OPTIMIZE_FUEL' | 'CONTACT_POLICE';
  impactedUnits: string[];
  estimatedImpact: string;
  timestamp: string;
  dismissed?: boolean;
}

export interface CommandCenterEvent {
  id: string;
  timestamp: string;
  category: 'GPS' | 'ALERT' | 'SAFETY' | 'TRIP' | 'DELIVERY' | 'FUEL' | 'MAINTENANCE' | 'AI' | 'EMERGENCY';
  title: string;
  description: string;
  vehicleId?: string;
  plateNumber?: string;
  driverName?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

export interface DispatchCandidate {
  vehicleId: string;
  plateNumber: string;
  brandModel: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  distanceKm: number;
  etaMinutes: number;
  currentStatus: 'idle' | 'parking' | 'moving';
  safetyScore: number;
  suitabilityScore: number; // 0 - 100
  fuelLevelPercent: number;
  recommendationReason: string;
  location: Location;
}

export interface AudioAlertConfig {
  soundEnabled: boolean;
  volume: number; // 0 - 1
  muteNonCritical: boolean;
  repeatIntervalSec: number;
}

export type CommandCenterDisplayMode = 'NORMAL' | 'FULLSCREEN' | 'CONTROL_ROOM';

export interface CommandCenterLayerConfig {
  showVehicles: boolean;
  showGeofences: boolean;
  showRoutes: boolean;
  showDepots: boolean;
  showEmergencyZones: boolean;
  showTraffic: boolean;
  clusteringEnabled: boolean;
}

export type CommandCenterSavedFilter = 'ALL' | 'CRITICAL_RISK' | 'EMERGENCY_ONLY' | 'OFFLINE_ONLY' | 'MOVING_ONLY' | 'HIGH_RISK_DRIVERS' | 'MY_BRANCH';
